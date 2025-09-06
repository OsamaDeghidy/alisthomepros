import api from './api';

// Message interfaces
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  user_type: string;
  is_verified: boolean;
  is_available: boolean;
}

export interface MessageAttachment {
  id: number;
  file: string;
  file_url: string;
  original_filename: string;
  file_size: number;
  file_size_formatted: string;
  file_type: string;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  created_at: string;
}

export interface MessageReaction {
  id: number;
  reaction: string;
  user: User;
  created_at: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: User;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'audio' | 'video';
  is_read: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  reply_to?: Message;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  other_participant?: User;
  project?: {
    id: number;
    title: string;
    status: string;
  };
  last_message?: Message;
  unread_count: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateConversationData {
  participants: number[];
  project?: number;
  initial_message?: string;
}

export interface CreateMessageData {
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'audio' | 'video';
  reply_to?: number;
}

// Messaging service
export const messagingService = {
  // Get all conversations
  async getConversations(): Promise<{ count: number; results: Conversation[] }> {
    const response = await api.get('/messages/conversations/');
    return response.data;
  },

  // Get conversation details
  async getConversation(conversationId: number): Promise<Conversation> {
    const response = await api.get(`/messages/conversations/${conversationId}/`);
    return response.data;
  },

  // Create a new conversation
  async createConversation(data: CreateConversationData): Promise<Conversation> {
    const response = await api.post('/messages/conversations/create/', data);
    return response.data;
  },

  // Start conversation with a specific user
  async startConversationWithUser(userId: number, initialMessage?: string, projectId?: number): Promise<Conversation> {
    const response = await api.post(`/messages/users/${userId}/start-conversation/`, {
      initial_message: initialMessage,
      project_id: projectId
    });
    return response.data;
  },

  // Get messages for a conversation
  async getMessages(conversationId: number, page?: number): Promise<{ count: number; results: Message[] }> {
    const params = page ? { page } : {};
    const response = await api.get(`/messages/conversations/${conversationId}/messages/`, { params });
    return response.data;
  },

  // Send a message
  async sendMessage(conversationId: number, data: CreateMessageData): Promise<Message> {
    const response = await api.post(`/messages/conversations/${conversationId}/messages/create/`, data);
    return response.data;
  },

  // Mark conversation as read
  async markConversationAsRead(conversationId: number): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/mark-read/`);
  },

  // Delete conversation
  async deleteConversation(conversationId: number): Promise<void> {
    await api.delete(`/messages/conversations/${conversationId}/delete/`);
  },

  // Upload message attachment
  async uploadMessageAttachment(conversationId: number, file: File): Promise<MessageAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/messages/conversations/${conversationId}/attachments/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Add message reaction
  async addMessageReaction(messageId: number, reaction: string): Promise<MessageReaction> {
    const response = await api.post(`/messages/messages/${messageId}/reactions/`, { reaction });
    return response.data;
  },

  // Remove message reaction
  async removeMessageReaction(messageId: number, reactionId: number): Promise<void> {
    await api.delete(`/messages/messages/${messageId}/reactions/${reactionId}/`);
  }
};