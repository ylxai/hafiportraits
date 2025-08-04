'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'upload_success' | 'upload_failed' | 'camera_disconnected' | 'storage_warning' | 'event_milestone' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'upload' | 'system' | 'event' | 'user';
  metadata?: {
    fileName?: string;
    eventName?: string;
    count?: number;
    percentage?: number;
  };
}

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'upload_success',
      title: '📸 Foto Baru Diupload',
      message: '5 foto baru berhasil diupload ke album Official',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'medium',
      category: 'upload',
      metadata: {
        count: 5,
        eventName: 'Wedding Sarah & John'
      }
    },
    {
      id: '2',
      type: 'camera_disconnected',
      title: '📷 Kamera Terputus',
      message: 'Koneksi kamera DSLR terputus. Silakan cek kabel USB.',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      isRead: false,
      priority: 'high',
      category: 'system'
    },
    {
      id: '3',
      type: 'event_milestone',
      title: '🎉 Milestone Event',
      message: '100 foto telah diupload untuk event Wedding Sarah & John!',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true,
      priority: 'medium',
      category: 'event',
      metadata: {
        count: 100,
        eventName: 'Wedding Sarah & John'
      }
    },
    {
      id: '4',
      type: 'storage_warning',
      title: '💾 Storage Hampir Penuh',
      message: 'Storage tersisa 15%. Silakan backup foto lama.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: true,
      priority: 'high',
      category: 'system',
      metadata: {
        percentage: 15
      }
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo)
      if (Math.random() > 0.95) { // 5% chance every 2 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'upload_success',
          title: '📸 Foto Baru Diupload',
          message: `${Math.floor(Math.random() * 10) + 1} foto baru berhasil diupload`,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'medium',
          category: 'upload',
          metadata: {
            count: Math.floor(Math.random() * 10) + 1
          }
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-all duration-200 touch-feedback
          ${hasUnread 
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }
          ${isOpen ? 'bg-primary text-primary-foreground' : ''}
        `}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {hasUnread ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        
        {/* Pulse Animation for New Notifications */}
        {hasUnread && (
          <div className="absolute inset-0 rounded-lg bg-blue-400 animate-ping opacity-20" />
        )}
      </button>

      {/* Dropdown Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
              
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Clear all
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center p-6">
                  <Bell className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">No notifications</p>
                  <p className="text-sm text-gray-500">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-4 hover:bg-gray-50 transition-colors cursor-pointer
                        ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                      `}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Notification Icon */}
                        <div className="text-lg flex-shrink-0 mt-0.5">
                          {notification.type === 'upload_success' && '✅'}
                          {notification.type === 'upload_failed' && '❌'}
                          {notification.type === 'camera_disconnected' && '📷'}
                          {notification.type === 'storage_warning' && '💾'}
                          {notification.type === 'event_milestone' && '🎉'}
                          {notification.type === 'system' && '⚙️'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  notification.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                  notification.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}
                              >
                                {notification.priority}
                              </Badge>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <X className="h-3 w-3 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              {notification.metadata.eventName && (
                                <span>🎉 {notification.metadata.eventName}</span>
                              )}
                              {notification.metadata.count && (
                                <span>📊 {notification.metadata.count} items</span>
                              )}
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-gray-500 mt-2">
                            {(() => {
                              const now = new Date();
                              const time = new Date(notification.timestamp);
                              const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
                              
                              if (diffInMinutes < 1) return 'Baru saja';
                              if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
                              if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam lalu`;
                              return `${Math.floor(diffInMinutes / 1440)} hari lalu`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length > 10 && (
                    <div className="p-3 text-center border-t bg-gray-50">
                      <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        View all {notifications.length} notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}