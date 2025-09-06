from django.urls import path
from . import views

app_name = 'messaging'

urlpatterns = [
    # Conversations
    path('conversations/', views.ConversationListView.as_view(), name='conversation_list'),
    path('conversations/create/', views.ConversationCreateView.as_view(), name='conversation_create'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='conversation_detail'),
    path('conversations/<int:conversation_id>/delete/', views.delete_conversation, name='delete_conversation'),
    path('conversations/search/', views.conversation_search, name='conversation_search'),
    path('conversations/stats/', views.conversation_stats, name='conversation_stats'),
    
    # Messages
    path('conversations/<int:conversation_id>/messages/', views.MessageListView.as_view(), name='message_list'),
    path('conversations/<int:conversation_id>/messages/create/', views.MessageCreateView.as_view(), name='message_create'),
    path('conversations/<int:conversation_id>/mark-read/', views.MarkMessagesReadView.as_view(), name='mark_messages_read'),
    path('conversations/<int:conversation_id>/read/', views.mark_conversation_as_read, name='mark_conversation_as_read'),
    path('messages/<int:pk>/update/', views.MessageUpdateView.as_view(), name='message_update'),
    path('messages/<int:pk>/delete/', views.MessageDeleteView.as_view(), name='message_delete'),
    path('messages/bulk-action/', views.MessageBulkActionView.as_view(), name='message_bulk_action'),
    path('send/', views.send_message, name='send_message'),
    
    # Message Reactions
    path('messages/<int:message_id>/reactions/', views.add_message_reaction, name='add_message_reaction'),
    path('messages/<int:message_id>/reactions/<int:reaction_id>/', views.remove_message_reaction, name='remove_message_reaction'),
    
    # Message Attachments
    path('conversations/<int:conversation_id>/attachments/upload/', views.upload_message_attachment, name='upload_message_attachment'),
    
    # Message Stats
    path('stats/', views.message_stats, name='message_stats'),
    
    # User interactions
    path('users/<int:user_id>/start-conversation/', views.start_conversation_with_user, name='start_conversation_with_user'),
] 