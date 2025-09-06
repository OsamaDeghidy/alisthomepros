import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Conversation, Message, TypingIndicator, MessageReadStatus
from .serializers import MessageSerializer, MessageResponseSerializer

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time messaging"""
    
    async def connect(self):
        """Handle WebSocket connection"""
        # Get user from token or session
        self.user = self.scope.get('user')
        
        if not self.user or self.user.is_anonymous:
            await self.close()
            return
        
        # Get conversation ID from URL
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        
        # Check if user is participant in conversation
        if not await self.is_participant(self.conversation_id, self.user):
            await self.close()
            return
        
        # Join conversation group
        self.conversation_group_name = f'chat_{self.conversation_id}'
        
        await self.channel_layer.group_add(
            self.conversation_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send user connected notification
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'user_connected',
                'user_id': self.user.id,
                'username': self.user.username
            }
        )
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'conversation_group_name'):
            # Remove typing indicator
            await self.stop_typing()
            
            # Send user disconnected notification
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'user_disconnected',
                    'user_id': self.user.id,
                    'username': self.user.username
                }
            )
            
            # Leave conversation group
            await self.channel_layer.group_discard(
                self.conversation_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'send_message':
                await self.handle_send_message(data)
            elif message_type == 'typing_start':
                await self.handle_typing_start()
            elif message_type == 'typing_stop':
                await self.handle_typing_stop()
            elif message_type == 'mark_read':
                await self.handle_mark_read(data)
            elif message_type == 'edit_message':
                await self.handle_edit_message(data)
            elif message_type == 'delete_message':
                await self.handle_delete_message(data)
            
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')
    
    async def handle_send_message(self, data):
        """Handle sending a new message"""
        content = data.get('content', '').strip()
        reply_to_id = data.get('reply_to')
        message_type = data.get('message_type', 'text')
        
        if not content and message_type == 'text':
            await self.send_error('Message content cannot be empty')
            return
        
        # Create message in database
        message = await self.create_message(
            conversation_id=self.conversation_id,
            sender=self.user,
            content=content,
            message_type=message_type,
            reply_to_id=reply_to_id
        )
        
        if message:
            # Serialize message
            message_data = await self.serialize_message(message)
            
            # Send to conversation group
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'new_message',
                    'message': message_data
                }
            )
            
            # Update conversation last message
            await self.update_conversation_last_message(
                self.conversation_id, 
                message
            )
    
    async def handle_typing_start(self):
        """Handle typing indicator start"""
        await self.start_typing()
        
        # Notify others in conversation
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': self.user.username,
                'is_typing': True
            }
        )
    
    async def handle_typing_stop(self):
        """Handle typing indicator stop"""
        await self.stop_typing()
        
        # Notify others in conversation
        await self.channel_layer.group_send(
            self.conversation_group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': self.user.username,
                'is_typing': False
            }
        )
    
    async def handle_mark_read(self, data):
        """Handle marking messages as read"""
        message_ids = data.get('message_ids', [])
        
        if message_ids:
            await self.mark_messages_read(message_ids)
            
            # Notify sender about read status
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'messages_read',
                    'message_ids': message_ids,
                    'reader_id': self.user.id,
                    'reader_username': self.user.username
                }
            )
    
    async def handle_edit_message(self, data):
        """Handle message editing"""
        message_id = data.get('message_id')
        new_content = data.get('content', '').strip()
        
        if not new_content:
            await self.send_error('Message content cannot be empty')
            return
        
        message = await self.edit_message(message_id, new_content)
        
        if message:
            message_data = await self.serialize_message(message)
            
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'message_edited',
                    'message': message_data
                }
            )
    
    async def handle_delete_message(self, data):
        """Handle message deletion"""
        message_id = data.get('message_id')
        
        if await self.delete_message(message_id):
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'message_deleted',
                    'message_id': message_id,
                    'deleted_by': self.user.id
                }
            )
    
    # Event handlers for group messages
    async def new_message(self, event):
        """Send new message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))
    
    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket"""
        # Don't send typing indicator to the user who is typing
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing']
            }))
    
    async def messages_read(self, event):
        """Send read status to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'messages_read',
            'message_ids': event['message_ids'],
            'reader_id': event['reader_id'],
            'reader_username': event['reader_username']
        }))
    
    async def message_edited(self, event):
        """Send edited message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'message_edited',
            'message': event['message']
        }))
    
    async def message_deleted(self, event):
        """Send deleted message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'message_id': event['message_id'],
            'deleted_by': event['deleted_by']
        }))
    
    async def user_connected(self, event):
        """Send user connected notification"""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_connected',
                'user_id': event['user_id'],
                'username': event['username']
            }))
    
    async def user_disconnected(self, event):
        """Send user disconnected notification"""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_disconnected',
                'user_id': event['user_id'],
                'username': event['username']
            }))
    
    async def send_error(self, error_message):
        """Send error message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))
    
    # Database operations
    @database_sync_to_async
    def is_participant(self, conversation_id, user):
        """Check if user is participant in conversation"""
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            return conversation.participants.filter(id=user.id).exists()
        except Conversation.DoesNotExist:
            return False
    
    @database_sync_to_async
    def create_message(self, conversation_id, sender, content, message_type='text', reply_to_id=None):
        """Create a new message"""
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            
            reply_to = None
            if reply_to_id:
                try:
                    reply_to = Message.objects.get(id=reply_to_id, conversation=conversation)
                except Message.DoesNotExist:
                    pass
            
            message = Message.objects.create(
                conversation=conversation,
                sender=sender,
                content=content,
                message_type=message_type,
                reply_to=reply_to
            )
            
            return message
            
        except Conversation.DoesNotExist:
            return None
    
    @database_sync_to_async
    def serialize_message(self, message):
        """Serialize message for JSON response"""
        serializer = MessageResponseSerializer(message)
        return serializer.data
    
    @database_sync_to_async
    def update_conversation_last_message(self, conversation_id, message):
        """Update conversation's last message"""
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            conversation.last_message = message.content
            conversation.last_message_sender = message.sender
            conversation.last_message_at = message.created_at
            conversation.save()
        except Conversation.DoesNotExist:
            pass
    
    @database_sync_to_async
    def start_typing(self):
        """Start typing indicator"""
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            TypingIndicator.objects.update_or_create(
                conversation=conversation,
                user=self.user,
                defaults={'last_activity': timezone.now()}
            )
        except Conversation.DoesNotExist:
            pass
    
    @database_sync_to_async
    def stop_typing(self):
        """Stop typing indicator"""
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            TypingIndicator.objects.filter(
                conversation=conversation,
                user=self.user
            ).delete()
        except Conversation.DoesNotExist:
            pass
    
    @database_sync_to_async
    def mark_messages_read(self, message_ids):
        """Mark messages as read"""
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            messages = Message.objects.filter(
                id__in=message_ids,
                conversation=conversation
            ).exclude(sender=self.user)
            
            for message in messages:
                MessageReadStatus.objects.get_or_create(
                    user=self.user,
                    message=message
                )
            
        except Conversation.DoesNotExist:
            pass
    
    @database_sync_to_async
    def edit_message(self, message_id, new_content):
        """Edit a message"""
        try:
            message = Message.objects.get(
                id=message_id,
                sender=self.user,
                conversation_id=self.conversation_id
            )
            
            message.content = new_content
            message.is_edited = True
            message.edited_at = timezone.now()
            message.save()
            
            return message
            
        except Message.DoesNotExist:
            return None
    
    @database_sync_to_async
    def delete_message(self, message_id):
        """Delete a message"""
        try:
            message = Message.objects.get(
                id=message_id,
                sender=self.user,
                conversation_id=self.conversation_id
            )
            
            message.is_deleted = True
            message.content = "This message was deleted"
            message.save()
            
            return True
            
        except Message.DoesNotExist:
            return False


class NotificationConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time notifications"""
    
    async def connect(self):
        """Handle WebSocket connection for notifications"""
        self.user = self.scope.get('user')
        
        if not self.user or self.user.is_anonymous:
            await self.close()
            return
        
        # Join user-specific notification group
        self.notification_group_name = f'notifications_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'notification_group_name'):
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'mark_read':
                await self.handle_mark_notification_read(data)
            
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
    
    async def handle_mark_notification_read(self, data):
        """Mark notification as read"""
        notification_id = data.get('notification_id')
        
        if notification_id:
            await self.mark_notification_read(notification_id)
    
    # Event handlers
    async def send_notification(self, event):
        """Send notification to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))
    
    async def send_error(self, error_message):
        """Send error message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        """Mark notification as read in database"""
        from notifications.models import Notification
        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient=self.user
            )
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save()
        except Notification.DoesNotExist:
            pass