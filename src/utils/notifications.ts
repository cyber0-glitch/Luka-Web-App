import { Task } from '../types';

// Request notification permission from the user
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

// Check if notifications are supported and permitted
export const canShowNotifications = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Show a notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (!canShowNotifications()) {
    console.log('Notifications not permitted');
    return null;
  }

  return new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...options,
  });
};

// Schedule task notification (1 hour before due time)
export const scheduleTaskNotification = (task: Task) => {
  if (!task.dueDate || !task.dueTime || !canShowNotifications()) {
    return;
  }

  try {
    // Parse the due date and time
    const [year, month, day] = task.dueDate.split('-').map(Number);
    const [hours, minutes] = task.dueTime.split(':').map(Number);

    const dueDateTime = new Date(year, month - 1, day, hours, minutes);

    // Calculate notification time (1 hour before)
    const notificationTime = new Date(dueDateTime.getTime() - 60 * 60 * 1000);
    const now = new Date();

    // Only schedule if notification time is in the future
    if (notificationTime > now) {
      const delay = notificationTime.getTime() - now.getTime();

      // Store timeout ID in localStorage for cleanup
      const timeoutId = window.setTimeout(() => {
        showNotification('Task Reminder', {
          body: `"${task.text}" is due in 1 hour`,
          tag: `task-${task.id}`,
          requireInteraction: false,
        });

        // Remove the scheduled notification from storage
        removeScheduledNotification(task.id);
      }, delay);

      // Store the scheduled notification
      saveScheduledNotification(task.id, timeoutId);
    }
  } catch (error) {
    console.error('Error scheduling task notification:', error);
  }
};

// Cancel a scheduled task notification
export const cancelTaskNotification = (taskId: string) => {
  const scheduled = getScheduledNotifications();
  const timeoutId = scheduled[taskId];

  if (timeoutId) {
    clearTimeout(timeoutId);
    removeScheduledNotification(taskId);
  }
};

// Save scheduled notification timeout ID
const saveScheduledNotification = (taskId: string, timeoutId: number) => {
  const scheduled = getScheduledNotifications();
  scheduled[taskId] = timeoutId;
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
};

// Remove scheduled notification from storage
const removeScheduledNotification = (taskId: string) => {
  const scheduled = getScheduledNotifications();
  delete scheduled[taskId];
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
};

// Get all scheduled notifications
const getScheduledNotifications = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem('scheduledNotifications');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Schedule daily reminder at a specific time
export const scheduleDailyReminder = (
  time: string,
  title: string,
  body: string,
  tag: string
) => {
  if (!canShowNotifications()) {
    return;
  }

  try {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      showNotification(title, {
        body,
        tag,
        requireInteraction: false,
      });

      // Reschedule for next day
      scheduleDailyReminder(time, title, body, tag);
    }, delay);

    // Store the daily reminder timeout ID
    saveDailyReminder(tag, timeoutId);
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
};

// Cancel a daily reminder
export const cancelDailyReminder = (tag: string) => {
  const reminders = getDailyReminders();
  const timeoutId = reminders[tag];

  if (timeoutId) {
    clearTimeout(timeoutId);
    removeDailyReminder(tag);
  }
};

// Save daily reminder timeout ID
const saveDailyReminder = (tag: string, timeoutId: number) => {
  const reminders = getDailyReminders();
  reminders[tag] = timeoutId;
  localStorage.setItem('dailyReminders', JSON.stringify(reminders));
};

// Remove daily reminder from storage
const removeDailyReminder = (tag: string) => {
  const reminders = getDailyReminders();
  delete reminders[tag];
  localStorage.setItem('dailyReminders', JSON.stringify(reminders));
};

// Get all daily reminders
const getDailyReminders = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem('dailyReminders');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Initialize all task notifications (call this when app loads)
export const initializeTaskNotifications = (tasks: Task[]) => {
  if (!canShowNotifications()) {
    return;
  }

  // Clear all existing task notifications
  const scheduled = getScheduledNotifications();
  Object.keys(scheduled).forEach((taskId) => {
    clearTimeout(scheduled[taskId]);
  });
  localStorage.removeItem('scheduledNotifications');

  // Schedule notifications for all incomplete tasks with due dates
  tasks
    .filter((task) => !task.completed && task.dueDate && task.dueTime)
    .forEach((task) => scheduleTaskNotification(task));
};

// Initialize daily reminders (call this when app loads or settings change)
export const initializeDailyReminders = (
  habitsEnabled: boolean,
  habitsTime: string,
  tasksEnabled: boolean,
  tasksTime: string
) => {
  if (!canShowNotifications()) {
    return;
  }

  // Cancel existing reminders
  cancelDailyReminder('habit-reminder');
  cancelDailyReminder('task-reminder');

  // Schedule new reminders if enabled
  if (habitsEnabled) {
    scheduleDailyReminder(
      habitsTime,
      'Habit Reminder',
      "Don't forget to complete your daily habits!",
      'habit-reminder'
    );
  }

  if (tasksEnabled) {
    scheduleDailyReminder(
      tasksTime,
      'Task Reminder',
      'Check your tasks for today!',
      'task-reminder'
    );
  }
};
