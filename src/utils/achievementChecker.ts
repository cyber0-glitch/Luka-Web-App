import { Achievement, HabitLog, Habit } from '../types';
import { calculateStreak, getTotalCompletions } from './streakCalculator';
import { getWeekDates, getMonthDates } from './dateUtils';

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 90, 180, 365];
const COMPLETION_MILESTONES = [10, 50, 100, 500, 1000];

export const checkForNewAchievements = (
  habitId: string,
  logs: HabitLog[],
  habit: Habit,
  existingAchievements: Achievement[]
): Achievement[] => {
  const newAchievements: Achievement[] = [];

  // Check first completion
  if (!hasAchievement(habitId, 'first_completion', 1, existingAchievements)) {
    const completions = getTotalCompletions(habitId, logs);
    if (completions >= 1) {
      newAchievements.push(createAchievement(habitId, 'first_completion', 1));
    }
  }

  // Check streak achievements
  const currentStreak = calculateStreak(habitId, logs, habit);
  for (const milestone of STREAK_MILESTONES) {
    if (!hasAchievement(habitId, 'streak', milestone, existingAchievements)) {
      if (currentStreak >= milestone) {
        newAchievements.push(createAchievement(habitId, 'streak', milestone));
      }
    }
  }

  // Check total completion achievements
  const totalCompletions = getTotalCompletions(habitId, logs);
  for (const milestone of COMPLETION_MILESTONES) {
    if (!hasAchievement(habitId, 'total', milestone, existingAchievements)) {
      if (totalCompletions >= milestone) {
        newAchievements.push(createAchievement(habitId, 'total', milestone));
      }
    }
  }

  // Check perfect week
  if (isPerfectWeek(habitId, logs, habit) && !hasRecentAchievement(habitId, 'perfect_week', existingAchievements, 7)) {
    newAchievements.push(createAchievement(habitId, 'perfect_week', 1));
  }

  // Check perfect month
  if (isPerfectMonth(habitId, logs, habit) && !hasRecentAchievement(habitId, 'perfect_month', existingAchievements, 30)) {
    newAchievements.push(createAchievement(habitId, 'perfect_month', 1));
  }

  return newAchievements;
};

const hasAchievement = (
  habitId: string,
  type: Achievement['type'],
  milestone: number,
  achievements: Achievement[]
): boolean => {
  return achievements.some(
    a => a.habitId === habitId && a.type === type && a.milestone === milestone
  );
};

const hasRecentAchievement = (
  habitId: string,
  type: Achievement['type'],
  achievements: Achievement[],
  days: number
): boolean => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return achievements.some(
    a => a.habitId === habitId &&
         a.type === type &&
         new Date(a.unlockedAt) > cutoffDate
  );
};

const createAchievement = (
  habitId: string,
  type: Achievement['type'],
  milestone: number
): Achievement => {
  return {
    id: `${habitId}-${type}-${milestone}-${Date.now()}`,
    habitId,
    type,
    milestone,
    unlockedAt: new Date().toISOString(),
    celebrated: false,
  };
};

const isPerfectWeek = (habitId: string, logs: HabitLog[], habit: Habit): boolean => {
  const weekDates = getWeekDates(new Date(), 0); // Assuming week starts on Sunday
  const habitLogs = logs.filter(l => l.habitId === habitId && weekDates.includes(l.date));

  // Check if all scheduled days in the week are completed
  for (const date of weekDates) {
    // For simplicity, if daily schedule, all days should be completed
    if (habit.schedule.type === 'daily') {
      const log = habitLogs.find(l => l.date === date);
      if (!log || (log.status !== 'completed' && log.status !== 'partial')) {
        return false;
      }
    }
  }

  return true;
};

const isPerfectMonth = (habitId: string, logs: HabitLog[], habit: Habit): boolean => {
  const monthDates = getMonthDates(new Date());
  const habitLogs = logs.filter(l => l.habitId === habitId && monthDates.includes(l.date));

  // Check if all scheduled days in the month are completed
  for (const date of monthDates) {
    if (habit.schedule.type === 'daily') {
      const log = habitLogs.find(l => l.date === date);
      if (!log || (log.status !== 'completed' && log.status !== 'partial')) {
        return false;
      }
    }
  }

  return true;
};

export const getAchievementTitle = (achievement: Achievement): string => {
  switch (achievement.type) {
    case 'first_completion':
      return 'First Step!';
    case 'streak':
      return `${achievement.milestone}-Day Streak!`;
    case 'total':
      return `${achievement.milestone} Completions!`;
    case 'perfect_week':
      return 'Perfect Week!';
    case 'perfect_month':
      return 'Perfect Month!';
    default:
      return 'Achievement Unlocked!';
  }
};

export const getAchievementDescription = (achievement: Achievement): string => {
  switch (achievement.type) {
    case 'first_completion':
      return 'Completed your first day!';
    case 'streak':
      if (achievement.milestone === 7) return 'One week strong!';
      if (achievement.milestone === 21) return 'Habit formed!';
      if (achievement.milestone === 30) return 'One month milestone!';
      if (achievement.milestone === 90) return 'Quarter year achieved!';
      if (achievement.milestone === 365) return 'Full year completed!';
      return `${achievement.milestone} days in a row!`;
    case 'total':
      return `Reached ${achievement.milestone} total completions!`;
    case 'perfect_week':
      return 'Completed all scheduled days this week!';
    case 'perfect_month':
      return 'Completed all scheduled days this month!';
    default:
      return '';
  }
};

export const getAchievementIcon = (achievement: Achievement): string => {
  switch (achievement.type) {
    case 'first_completion':
      return '🎉';
    case 'streak':
      if (achievement.milestone >= 365) return '👑';
      if (achievement.milestone >= 90) return '💎';
      if (achievement.milestone >= 30) return '⭐';
      if (achievement.milestone >= 7) return '🔥';
      return '✨';
    case 'total':
      if (achievement.milestone >= 1000) return '🏆';
      if (achievement.milestone >= 500) return '🥇';
      if (achievement.milestone >= 100) return '🥈';
      return '🥉';
    case 'perfect_week':
      return '📅';
    case 'perfect_month':
      return '📆';
    default:
      return '🎯';
  }
};
