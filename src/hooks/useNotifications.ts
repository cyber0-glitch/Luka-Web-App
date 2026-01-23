import { useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsResult {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export const useNotifications = (): UseNotificationsResult => {
  // Check if notifications are supported - must be synchronous and immediate
  const checkNotificationSupport = () => {
    try {
      return typeof window !== 'undefined' &&
             typeof Notification !== 'undefined' &&
             'Notification' in window;
    } catch {
      return false;
    }
  };

  const isNotificationSupported = checkNotificationSupport();

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (isNotificationSupported) {
      return Notification.permission as NotificationPermission;
    }
    return 'denied';
  });

  const [isSupported] = useState(isNotificationSupported);

  useEffect(() => {
    // Update permission if it changes
    if (isNotificationSupported) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, [isNotificationSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result as NotificationPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported) {
      console.warn('Notifications are not supported');
      return;
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported,
  };
};

// Helper function to schedule daily reminders
export const scheduleDailyReminder = (
  hour: number,
  minute: number,
  title: string,
  body: string,
  sendNotification: (title: string, options?: NotificationOptions) => void
) => {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );

  // If the scheduled time has passed for today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  // Schedule the notification
  const timeoutId = setTimeout(() => {
    sendNotification(title, { body });

    // Reschedule for the next day
    scheduleDailyReminder(hour, minute, title, body, sendNotification);
  }, timeUntilNotification);

  return timeoutId;
};
