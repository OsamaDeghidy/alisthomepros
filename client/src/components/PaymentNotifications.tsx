'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Info,
  X,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import ErrorDisplay from './ErrorDisplay';
import { useApiError } from '../hooks/useApiError';

interface PaymentNotification {
  id: number;
  type: 'payment_approved' | 'payment_rejected' | 'payment_requested' | 'milestone_completed' | 'contract_updated';
  title: string;
  message: string;
  amount?: number;
  contractId?: number;
  contractTitle?: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface PaymentNotificationsProps {
  userId?: number;
  userRole?: 'professional' | 'client';
  className?: string;
  maxNotifications?: number;
  showHeader?: boolean;
}

export default function PaymentNotifications({
  userId,
  userRole = 'professional',
  className = '',
  maxNotifications = 10,
  showHeader = true
}: PaymentNotificationsProps) {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { error, handleApiError, clearError } = useApiError();

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockNotifications: PaymentNotification[] = [
        {
          id: 1,
          type: 'payment_approved',
          title: 'Payment Approved',
          message: 'Your milestone payment of $2,500 has been approved and processed.',
          amount: 2500,
          contractId: 18,
          contractTitle: 'E-commerce Website Development',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'payment_requested',
          title: 'New Payment Request',
          message: 'A professional has requested payment for milestone completion.',
          amount: 1800,
          contractId: 15,
          contractTitle: 'Mobile App UI Design',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          read: false,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'milestone_completed',
          title: 'Milestone Completed',
          message: 'Frontend development milestone has been marked as completed.',
          contractId: 18,
          contractTitle: 'E-commerce Website Development',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          read: true,
          priority: 'medium'
        },
        {
          id: 4,
          type: 'payment_rejected',
          title: 'Payment Rejected',
          message: 'Your payment request has been rejected. Please review the feedback.',
          amount: 1200,
          contractId: 12,
          contractTitle: 'Logo Design Project',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true,
          priority: 'high'
        },
        {
          id: 5,
          type: 'contract_updated',
          title: 'Contract Updated',
          message: 'Contract terms have been updated. Please review the changes.',
          contractId: 18,
          contractTitle: 'E-commerce Website Development',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          read: true,
          priority: 'low'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, [userId, userRole]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getNotificationIcon = (type: PaymentNotification['type']) => {
    switch (type) {
      case 'payment_approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'payment_rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'payment_requested':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'milestone_completed':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case 'contract_updated':
        return <Info className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: PaymentNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, maxNotifications);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-4 animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {showHeader && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {displayedNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                notification.read ? 'bg-white' : getPriorityColor(notification.priority)
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                        
                        {notification.amount && (
                          <span className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{formatCurrency(notification.amount)}</span>
                          </span>
                        )}
                        
                        {notification.contractTitle && (
                          <span className="truncate max-w-32">
                            {notification.contractTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Mark as read"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > maxNotifications && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${notifications.length})`}
          </button>
        </div>
      )}
    </div>
  );
}