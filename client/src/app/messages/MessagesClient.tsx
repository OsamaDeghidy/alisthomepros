'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  DollarSign, 
  Calendar, 
  X, 
  Loader2 
} from 'lucide-react';
import { authService } from '@/lib/auth';
import { messagingService } from '@/lib/messaging';

interface Message {
  id: number;
  content: string;
  sender: User;
  conversation: number;
  created_at: string;
  attachments?: Attachment[];
}

interface Attachment {
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

interface User {
  id: number;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  display_name?: string;
  user_type: string;
  is_available?: boolean;
  is_verified?: boolean;
  rating?: number;
  avatar?: string;
}

interface FileUpload {
  file: File;
  preview?: string;
}

interface Professional {
  id: number;
  user: User;
  specialization: string;
  experience_years: number;
  hourly_rate: number;
  availability?: {
    weeklySchedule: WeeklySchedule;
  };
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  isAvailable: boolean;
  slots: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
}

export default function MessagesClient() {
  console.log('MessagesClient component loaded');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'online'>('all');
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedConversationForSchedule, setSelectedConversationForSchedule] = useState<Professional | null>(null);

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);
  const otherParticipant = selectedConversation?.other_participant;

  // Load conversations and current user on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
      // Mark conversation as read when opened
      markConversationAsRead(selectedChat);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading initial data...');
      
      // Get current user
      console.log('Getting current user...');
      const user = await authService.getCurrentUser();
      console.log('Current user:', user);
      setCurrentUser(user);
      
      // Check URL parameters for creating new conversation
      const freelancerId = searchParams?.get('freelancer');
      const projectId = searchParams?.get('project');
      
      if (freelancerId) {
        console.log('Creating/finding conversation with freelancer:', freelancerId, 'for project:', projectId);
        await handleCreateConversationFromParams(parseInt(freelancerId), projectId ? parseInt(projectId) : undefined);
      } else {
        // Load conversations normally
        console.log('Loading conversations...');
        const conversationsData = await messagingService.getConversations();
        console.log('Conversations data:', conversationsData);
        setConversations(conversationsData.results || []);
        
        // Select first conversation if available
        if (conversationsData.results && conversationsData.results.length > 0) {
          setSelectedChat(conversationsData.results[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        setError('You need to login to view messages. Please login first.');
      } else {
        setError('Failed to load conversations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const messagesData = await messagingService.getMessages(conversationId);
      setMessages(messagesData.results || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please try again.');
    }
  };

  const markConversationAsRead = async (conversationId: number) => {
    try {
      await messagingService.markConversationAsRead(conversationId);
      // Update the conversation in the local state to remove unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      const message = await messagingService.sendMessage(selectedChat, {
        content: newMessage.trim(),
        message_type: 'text'
      });
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatUserName = (user: any) => {
    if (!user) return 'Unknown User';
    return user.display_name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown User';
  };

  const handleCreateConversationFromParams = async (freelancerId: number, projectId?: number) => {
    try {
      setCreatingConversation(true);
      
      // Determine if current user is project owner
      let shouldIncludeProject = false;
      if (projectId && currentUser) {
        // Check if current user is the project owner by making a request to get project details
         try {
           const { projectsService } = await import('@/lib/projects');
           const projectData = await projectsService.getProject(projectId.toString());
           shouldIncludeProject = projectData.client?.id === currentUser.id;
         } catch (error) {
           console.error('Error checking project ownership:', error);
         }
      }
      
      // Start conversation with freelancer
      const conversation = await messagingService.startConversationWithUser(
        freelancerId,
        undefined, // no initial message
        shouldIncludeProject ? projectId : undefined
      );
      
      // Load all conversations to update the list
      const conversationsData = await messagingService.getConversations();
      setConversations(conversationsData.results || []);
      
      // Select the new/existing conversation
      setSelectedChat(conversation.id);
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/messages');
      
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to start conversation. Please try again.');
    } finally {
      setCreatingConversation(false);
    }
  };

  const formatUserRole = (user: any) => {
    if (!user) return 'User';
    return user.user_type === 'home_pro' ? 'Home Professional' : 
           user.user_type === 'specialist' ? 'Specialist' : 
           user.user_type === 'crew_member' ? 'Crew Member' : 
           user.user_type === 'client' ? 'Client' : 'Professional';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadInitialData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Conversations Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <Settings className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === conversation.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                          {formatUserName(conversation.other_participant).charAt(0).toUpperCase()}
                        </div>
                        {conversation.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {formatUserName(conversation.other_participant)}
                          </p>
                          {conversation.last_message && (
                            <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(conversation.last_message.created_at)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 mb-1 font-medium">
                          {formatUserRole(conversation.other_participant)}
                        </p>
                        {conversation.last_message && (
                          <p className={`text-sm truncate ${
                            conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                          }`}>
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                        {formatUserName(otherParticipant).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {formatUserName(otherParticipant)}
                        </h2>
                        <p className="text-sm text-blue-600 font-medium">
                          {formatUserRole(otherParticipant)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                        <Search className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isCurrentUser = message.sender.id === currentUser?.id;
                      const isLastMessage = index === messages.length - 1;
                      const nextMessage = messages[index + 1];
                      const isLastInGroup = !nextMessage || nextMessage.sender.id !== message.sender.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          } ${isLastInGroup ? 'mb-4' : 'mb-1'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl relative ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {isLastInGroup && (
                              <p
                                className={`text-xs mt-1 ${
                                  isCurrentUser
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-end space-x-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    />
                    <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder-gray-500"
                        style={{ minHeight: '20px', maxHeight: '100px' }}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}