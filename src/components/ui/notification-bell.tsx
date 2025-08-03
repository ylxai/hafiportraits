'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationCenter, { type Notification } from './notification-center';

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
    <>
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
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </>
  );
}