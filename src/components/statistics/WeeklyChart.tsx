import React from 'react';
import { motion } from 'framer-motion';
import { Habit, HabitLog } from '../../types';
import { getWeekDates } from '../../utils/dateUtils';
import { format, parseISO } from 'date-fns';

interface WeeklyChartProps {
  habit: Habit;
  logs: HabitLog[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ habit, logs }) => {
  const weekDates = getWeekDates(new Date(), 0);

  const weekData = weekDates.map(date => {
    const log = logs.find(l => l.habitId === habit.id && l.date === date);
    const value = log?.value || 0;
    const percentage = Math.min((value / habit.goal.value) * 100, 100);

    let status: 'completed' | 'partial' | 'missed' | 'skipped' | 'none' = 'none';
    if (log) {
      status = log.status;
    }

    return {
      date,
      value,
      percentage,
      status,
      dayName: format(parseISO(date), 'EEE'),
    };
  });

  const getBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'partial':
        return 'bg-warning';
      case 'missed':
        return 'bg-error';
      case 'skipped':
        return 'bg-text-tertiary-light dark:bg-text-tertiary-dark';
      default:
        return 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark';
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
        Last 7 Days
      </h4>

      <div className="flex items-end justify-between gap-2 h-32">
        {weekData.map((day, index) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
            {/* Bar */}
            <div className="relative w-full bg-bg-tertiary-light dark:bg-bg-tertiary-dark rounded-t-lg overflow-hidden flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${day.percentage}%` }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
                className={`absolute bottom-0 w-full ${getBarColor(day.status)} rounded-t-lg`}
              />
            </div>

            {/* Day label */}
            <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {day.dayName}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-error" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-text-tertiary-light dark:bg-text-tertiary-dark" />
          <span>Skipped</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
