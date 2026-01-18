import { HabitLog, Habit } from '../types';
import { getWeekDates, getMonthDates } from './dateUtils';

export interface WeeklyChartData {
  date: string;
  value: number;
  percentage: number;
  status: 'completed' | 'partial' | 'missed' | 'skipped' | 'none';
}

export interface MonthlyHeatmapData {
  date: string;
  value: number;
  percentage: number;
  status: 'completed' | 'partial' | 'missed' | 'skipped' | 'none';
}

export const getWeeklyChartData = (
  habitId: string,
  logs: HabitLog[],
  habit: Habit,
  weekStartsOn: 0 | 1 = 0
): WeeklyChartData[] => {
  const weekDates = getWeekDates(new Date(), weekStartsOn);

  return weekDates.map(date => {
    const log = logs.find(l => l.habitId === habitId && l.date === date);

    if (!log) {
      return {
        date,
        value: 0,
        percentage: 0,
        status: 'none',
      };
    }

    const percentage = Math.min(Math.round((log.value / habit.goal.value) * 100), 100);

    return {
      date,
      value: log.value,
      percentage,
      status: log.status,
    };
  });
};

export const getMonthlyHeatmapData = (
  habitId: string,
  logs: HabitLog[],
  habit: Habit,
  month: Date = new Date()
): MonthlyHeatmapData[] => {
  const monthDates = getMonthDates(month);

  return monthDates.map(date => {
    const log = logs.find(l => l.habitId === habitId && l.date === date);

    if (!log) {
      return {
        date,
        value: 0,
        percentage: 0,
        status: 'none',
      };
    }

    const percentage = Math.min(Math.round((log.value / habit.goal.value) * 100), 100);

    return {
      date,
      value: log.value,
      percentage,
      status: log.status,
    };
  });
};

export interface TrendData {
  date: string;
  percentage: number;
}

export const getTrendData = (
  habitId: string,
  logs: HabitLog[],
  habit: Habit,
  days: number = 30
): TrendData[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const habitLogs = logs
    .filter(l => l.habitId === habitId)
    .filter(l => {
      const logDate = new Date(l.date);
      return logDate >= startDate && logDate <= endDate;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return habitLogs.map(log => ({
    date: log.date,
    percentage: Math.min(Math.round((log.value / habit.goal.value) * 100), 100),
  }));
};

export const getMovingAverage = (data: TrendData[], window: number = 7): TrendData[] => {
  if (data.length < window) return data;

  const result: TrendData[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((sum, d) => sum + d.percentage, 0) / slice.length;

    result.push({
      date: data[i].date,
      percentage: Math.round(avg),
    });
  }

  return result;
};

export const getGlobalStats = (logs: HabitLog[], habits: Habit[]) => {
  const totalCompletions = logs.filter(l => l.status === 'completed' || l.status === 'partial').length;

  const thisWeekDates = getWeekDates(new Date());
  const weekCompletions = logs.filter(
    l => thisWeekDates.includes(l.date) && (l.status === 'completed' || l.status === 'partial')
  ).length;

  const thisMonthDates = getMonthDates(new Date());
  const monthCompletions = logs.filter(
    l => thisMonthDates.includes(l.date) && (l.status === 'completed' || l.status === 'partial')
  ).length;

  const currentYear = new Date().getFullYear();
  const yearCompletions = logs.filter(l => {
    const logYear = new Date(l.date).getFullYear();
    return logYear === currentYear && (l.status === 'completed' || l.status === 'partial');
  }).length;

  return {
    totalHabits: habits.filter(h => !h.archivedAt).length,
    totalCompletions,
    weekCompletions,
    monthCompletions,
    yearCompletions,
  };
};
