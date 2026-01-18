import { Habit, HabitLog } from '../types';
import { getTodayString, getPreviousDay, getDayOfWeek } from './dateUtils';

export const calculateStreak = (habitId: string, logs: HabitLog[], habit: Habit): number => {
  const habitLogs = logs
    .filter(l => l.habitId === habitId)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (habitLogs.length === 0) return 0;

  let streak = 0;
  let currentDate = getTodayString();

  // Check if today is scheduled
  const isTodayScheduled = isDateScheduled(currentDate, habit);

  // If today is scheduled but not completed/skipped, streak might be broken
  // Only count from yesterday
  if (isTodayScheduled) {
    const todayLog = habitLogs.find(l => l.date === currentDate);
    if (todayLog && (todayLog.status === 'completed' || todayLog.status === 'partial')) {
      streak++;
      currentDate = getPreviousDay(currentDate);
    } else if (todayLog && todayLog.status === 'skipped') {
      // Skipped today, but streak continues
      currentDate = getPreviousDay(currentDate);
    } else {
      // Today not logged yet, start counting from yesterday
      currentDate = getPreviousDay(currentDate);
    }
  } else {
    // Today not scheduled, start from today and work backwards
  }

  // Count backwards through scheduled days
  for (let i = 0; i < 365; i++) { // Max 365 days lookback
    if (!isDateScheduled(currentDate, habit)) {
      currentDate = getPreviousDay(currentDate);
      continue;
    }

    const log = habitLogs.find(l => l.date === currentDate);

    if (!log) {
      // No log for this scheduled day, streak is broken
      break;
    }

    if (log.status === 'completed' || log.status === 'partial') {
      streak++;
    } else if (log.status === 'skipped') {
      // Skipped days don't break streak but don't add to it
    } else if (log.status === 'missed') {
      // Missed breaks the streak
      break;
    }

    currentDate = getPreviousDay(currentDate);
  }

  return streak;
};

export const isDateScheduled = (dateString: string, habit: Habit): boolean => {
  const { schedule } = habit;

  switch (schedule.type) {
    case 'daily':
      return true;

    case 'specific_days':
      if (!schedule.days) return false;
      const dayOfWeek = getDayOfWeek(dateString);
      return schedule.days.includes(dayOfWeek);

    case 'weekly':
      // For weekly habits, all days are potentially scheduled
      // The user needs to complete X times in the week
      return true;

    case 'monthly':
      // For monthly habits, all days are potentially scheduled
      return true;

    case 'interval':
      if (!schedule.intervalDays) return false;
      // Check if date is X days after creation or last completion
      // This is simplified - in reality you'd check against creation date
      return true;

    case 'specific_dates':
      if (!schedule.specificDates) return false;
      return schedule.specificDates.includes(dateString);

    default:
      return false;
  }
};

export const getBestStreak = (habitId: string, logs: HabitLog[], _habit: Habit): number => {
  const habitLogs = logs
    .filter(l => l.habitId === habitId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (habitLogs.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  for (const log of habitLogs) {
    if (log.status === 'completed' || log.status === 'partial') {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (log.status === 'missed') {
      currentStreak = 0;
    }
    // Skipped doesn't reset streak
  }

  return maxStreak;
};

export const getTotalCompletions = (habitId: string, logs: HabitLog[]): number => {
  return logs.filter(
    l => l.habitId === habitId && (l.status === 'completed' || l.status === 'partial')
  ).length;
};

export const getSuccessRate = (habitId: string, logs: HabitLog[], _habit: Habit): number => {
  const habitLogs = logs.filter(l => l.habitId === habitId);

  if (habitLogs.length === 0) return 0;

  const completedLogs = habitLogs.filter(
    l => l.status === 'completed' || l.status === 'partial'
  ).length;

  return Math.round((completedLogs / habitLogs.length) * 100);
};
