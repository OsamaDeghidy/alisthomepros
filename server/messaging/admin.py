from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import (
    Conversation, Message, MessageAttachment, MessageReadStatus,
    ConversationReadTime, MessageReaction, BlockedUser, 
    ConversationSettings, TypingIndicator
)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['title', 'display_participants', 'project', 'last_message_at', 'is_group', 'is_archived']
    list_filter = ['is_group', 'is_archived', 'created_at', 'last_message_at']
    search_fields = ['title', 'participants__username', 'project__title']
    readonly_fields = ['conversation_id', 'created_at', 'updated_at', 'last_message_at']
    autocomplete_fields = ['participants', 'project', 'contract', 'last_message_sender']
    
    def display_participants(self, obj):
        participants = obj.participants.all()[:3]
        names = [p.get_full_name() or p.username for p in participants]
        display = ", ".join(names)
        if obj.participants.count() > 3:
            display += f" +{obj.participants.count() - 3} more"
        return display
    display_participants.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'conversation', 'content_preview', 'message_type', 'is_edited', 'created_at']
    list_filter = ['message_type', 'is_edited', 'is_deleted', 'created_at']
    search_fields = ['content', 'sender__username', 'conversation__title']
    readonly_fields = ['message_id', 'created_at', 'updated_at', 'edited_at']
    autocomplete_fields = ['conversation', 'sender', 'reply_to']
    
    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Content"


@admin.register(MessageAttachment)
class MessageAttachmentAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'file_type', 'file_size_display', 'is_scanned', 'is_safe', 'created_at']
    list_filter = ['file_type', 'is_scanned', 'is_safe', 'created_at']
    search_fields = ['original_filename', 'message__content']
    readonly_fields = ['file_size_display', 'created_at']
    autocomplete_fields = ['message']
    
    def file_size_display(self, obj):
        return obj.file_size_formatted
    file_size_display.short_description = "File Size"


@admin.register(MessageReadStatus)
class MessageReadStatusAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'read_at']
    list_filter = ['read_at']
    search_fields = ['user__username', 'message__content']
    readonly_fields = ['read_at']
    autocomplete_fields = ['user', 'message']


@admin.register(ConversationReadTime)
class ConversationReadTimeAdmin(admin.ModelAdmin):
    list_display = ['user', 'conversation', 'last_read_at']
    list_filter = ['last_read_at']
    search_fields = ['user__username', 'conversation__title']
    autocomplete_fields = ['user', 'conversation']


@admin.register(MessageReaction)
class MessageReactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'reaction', 'created_at']
    list_filter = ['reaction', 'created_at']
    search_fields = ['user__username', 'message__content']
    readonly_fields = ['created_at']
    autocomplete_fields = ['message', 'user']


@admin.register(BlockedUser)
class BlockedUserAdmin(admin.ModelAdmin):
    list_display = ['blocker', 'blocked', 'blocked_at']
    list_filter = ['blocked_at']
    search_fields = ['blocker__username', 'blocked__username']
    readonly_fields = ['blocked_at']
    autocomplete_fields = ['blocker', 'blocked']


@admin.register(ConversationSettings)
class ConversationSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'conversation', 'notifications_enabled', 'is_pinned', 'is_muted']
    list_filter = ['notifications_enabled', 'is_pinned', 'is_muted', 'sound_enabled']
    search_fields = ['user__username', 'conversation__title']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user', 'conversation']


@admin.register(TypingIndicator)
class TypingIndicatorAdmin(admin.ModelAdmin):
    list_display = ['user', 'conversation', 'started_at', 'last_activity']
    list_filter = ['started_at', 'last_activity']
    search_fields = ['user__username', 'conversation__title']
    readonly_fields = ['started_at', 'last_activity']
    autocomplete_fields = ['conversation', 'user']


# تخصيص موقع الإدارة
admin.site.site_header = 'A-List Messaging Admin'
admin.site.site_title = 'Messaging Management'
admin.site.index_title = 'إدارة الرسائل'
