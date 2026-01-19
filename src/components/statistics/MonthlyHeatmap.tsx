import React from 'react';
import { Habit, HabitLog } from '../../types';
import { getMonthDates } from '../../utils/dateUtils';
import { format, parseISO, startOfMonth, getDay } from 'date-fns';

interface MonthlyHeatmapProps {
  habit: Habit;
  logs: HabitLog[];
}

const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ habit, logs }) => {
  const monthDates = getMonthDates(new Date());
  const monthStart = startOfMonth(new Date());
  const startDayOfWeek = getDay(monthStart);

  const monthData = monthDates.map(date => {
    const log = logs.find(l => l.habitId === habit.id && l.date === date);
    const value = log?.value || 0;
    const percentage = Math.min((value / habit.goal.value) * 100, 100);

    return {
      date,
      value,
      percentage,
      status: log?.status || 'none',
      day: format(parseISO(date), 'd'),
    };
  });

  const getCellColor = (percentage: number, status: string) => {
    if (status === 'skipped') {
      return 'bg-text-tertiary-light/30 dark:bg-text-tertiary-dark/30';
    }
    if (status === 'missed' || percentage === 0) {
      return 'bg-error/20';
    }
    if (percentage >= 100) {
      return 'bg-success';
    }
    if (percentage >= 75) {
      return 'bg-success/70';
    }
    if (percentage >= 50) {
      return 'bg-warning/70';
    }
    if (percentage >= 25) {
      return 'bg-warning/40';
    }
    return 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark';
  };

  // Add empty cells for days before month starts
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
        {format(new Date(), 'MMMM yyyy')}
      </h4>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center mb-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {monthData.map((day) => (
          <div
            key={day.date}
            className={`aspect-square rounded ${getCellColor(day.percentage, day.status)} flex items-center justify-center text-xs font-medium text-text-primary-light dark:text-text-primary-dark transition-colors`}
            title={`${day.date}: ${day.percentage}%`}
          >
            {day.day}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 pt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-bg-tertiary-light dark:bg-bg-tertiary-dark" />
          <div className="w-4 h-4 rounded bg-warning/40" />
          <div className="w-4 h-4 rounded bg-warning/70" />
          <div className="w-4 h-4 rounded bg-success/70" />
          <div className="w-4 h-4 rounded bg-success" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default MonthlyHeatmap;
