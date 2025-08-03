/**
 * React Hook for Notification Management
 * Provides easy access to notification features and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { getWebSocketClient } from '@/lib/websocket-client';
import { 
  requestNotificationPermission, 
  onForegroundMessage, 
  subscribeToTopic,
  unsubscribeFromTopic,
  getCurrentToken,
  sendTestNotification,
  getNotificationPermission
} from '@/lib/firebase-config';
import { useToast } from '@/components/ui/toast-notification';

export interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isConnected: boolean;
  fcmToken: string | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationHook {
  state: NotificationState;
  requestPermission: () => Promise<boolean>;
  sendTest: () => Promise<void>;
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearError: () => void;
  reconnect: () => void;
}

export function useNotifications(): NotificationHook {
  const { addToast } = useToast();
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    permission: 'default',
    isConnected: false,
    fcmToken: null,
    unreadCount: 0,
    isLoading: true,
    error: null
  });

  // Initialize notification system
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const wsClient = getWebSocketClient();
    
    // Connection status listeners
    wsClient.on('connected', () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      console.log('✅ WebSocket connected');
    });

    wsClient.on('disconnected', () => {
      setState(prev => ({ ...prev, isConnected: false }));
      console.log('🔌 WebSocket disconnected');
    });

    wsClient.on('error', (data: any) => {
      setState(prev => ({ ...prev, error: 'WebSocket connection error' }));
      console.error('❌ WebSocket error:', data);
    });

    wsClient.on('max_reconnect_attempts', () => {
      setState(prev => ({ ...prev, error: 'Failed to connect to notification service' }));
    });

    // Notification listeners
    wsClient.on('notification', (payload: any) => {
      // Update unread count
      setState(prev => ({ ...prev, unreadCount: prev.unreadCount + 1 }));
    });

    wsClient.on('upload_progress', (payload: any) => {
      console.log('📤 Upload progress:', payload);
    });

    wsClient.on('camera_status', (payload: any) => {
      console.log('📷 Camera status:', payload);
    });

    wsClient.on('system_status', (payload: any) => {
      console.log('⚙️ System status:', payload);
    });

    return () => {
      // Cleanup listeners
      wsClient.off('connected', () => {});
      wsClient.off('disconnected', () => {});
      wsClient.off('error', () => {});
      wsClient.off('notification', () => {});
    };
  }, []);

  // Setup FCM foreground message listener
  useEffect(() => {
    if (state.fcmToken) {
      onForegroundMessage((payload) => {
        console.log('📨 Foreground FCM message:', payload);
        
        // Show toast for foreground messages
        if (payload.notification) {
          addToast({
            type: 'info',
            title: payload.notification.title || 'Notification',
            message: payload.notification.body || 'You have a new notification',
            action: payload.data?.url ? {
              label: 'View',
              onClick: () => window.open(payload.data.url, '_blank')
            } : undefined
          });
        }
        
        // Update unread count
        setState(prev => ({ ...prev, unreadCount: prev.unreadCount + 1 }));
      });
    }
  }, [state.fcmToken, addToast]);

  const initializeNotifications = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if notifications are supported
      const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
      const permission = getNotificationPermission();
      const existingToken = getCurrentToken();

      setState(prev => ({
        ...prev,
        isSupported,
        permission,
        fcmToken: existingToken,
        isLoading: false
      }));

      console.log('🔔 Notification system initialized:', {
        isSupported,
        permission,
        hasToken: !!existingToken
      });

    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize notification system'
      }));
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const token = await requestNotificationPermission();
      
      if (token) {
        setState(prev => ({
          ...prev,
          permission: 'granted',
          fcmToken: token,
          isLoading: false
        }));

        // Subscribe to default topics
        await subscribeToTopic('general');
        await subscribeToTopic('uploads');
        
        addToast({
          type: 'success',
          title: 'Notifications Enabled',
          message: 'You will now receive real-time notifications'
        });

        return true;
      } else {
        setState(prev => ({
          ...prev,
          permission: 'denied',
          isLoading: false,
          error: 'Notification permission denied'
        }));

        addToast({
          type: 'error',
          title: 'Permission Denied',
          message: 'Please enable notifications in your browser settings'
        });

        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting permission:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request notification permission'
      }));

      addToast({
        type: 'error',
        title: 'Permission Error',
        message: 'Failed to enable notifications'
      });

      return false;
    }
  }, [addToast]);

  const sendTest = useCallback(async (): Promise<void> => {
    try {
      if (!state.fcmToken) {
        throw new Error('No FCM token available');
      }

      await sendTestNotification();
      
      addToast({
        type: 'info',
        title: 'Test Sent',
        message: 'Test notification has been sent'
      });

    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      addToast({
        type: 'error',
        title: 'Test Failed',
        message: 'Failed to send test notification'
      });
    }
  }, [state.fcmToken, addToast]);

  const subscribe = useCallback(async (topic: string): Promise<void> => {
    try {
      await subscribeToTopic(topic);
      addToast({
        type: 'success',
        title: 'Subscribed',
        message: `Subscribed to ${topic} notifications`
      });
    } catch (error) {
      console.error('❌ Error subscribing to topic:', error);
      addToast({
        type: 'error',
        title: 'Subscription Failed',
        message: `Failed to subscribe to ${topic}`
      });
    }
  }, [addToast]);

  const unsubscribe = useCallback(async (topic: string): Promise<void> => {
    try {
      await unsubscribeFromTopic(topic);
      addToast({
        type: 'info',
        title: 'Unsubscribed',
        message: `Unsubscribed from ${topic} notifications`
      });
    } catch (error) {
      console.error('❌ Error unsubscribing from topic:', error);
      addToast({
        type: 'error',
        title: 'Unsubscribe Failed',
        message: `Failed to unsubscribe from ${topic}`
      });
    }
  }, [addToast]);

  const markAsRead = useCallback((notificationId: string): void => {
    // TODO: Send to server to mark as read
    console.log('✅ Marking notification as read:', notificationId);
    
    // Update local unread count
    setState(prev => ({ 
      ...prev, 
      unreadCount: Math.max(0, prev.unreadCount - 1) 
    }));
  }, []);

  const markAllAsRead = useCallback((): void => {
    // TODO: Send to server to mark all as read
    console.log('✅ Marking all notifications as read');
    
    setState(prev => ({ ...prev, unreadCount: 0 }));
  }, []);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reconnect = useCallback((): void => {
    const wsClient = getWebSocketClient();
    wsClient.reconnect();
    
    addToast({
      type: 'info',
      title: 'Reconnecting',
      message: 'Attempting to reconnect to notification service'
    });
  }, [addToast]);

  return {
    state,
    requestPermission,
    sendTest,
    subscribe,
    unsubscribe,
    markAsRead,
    markAllAsRead,
    clearError,
    reconnect
  };
}