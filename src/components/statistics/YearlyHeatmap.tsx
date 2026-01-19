import React from 'react';
import { Habit, HabitLog } from '../../types';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, addDays } from 'date-fns';

interface YearlyHeatmapProps {
  habit: Habit;
  logs: HabitLog[];
  year?: number;
}

const YearlyHeatmap: React.FC<YearlyHeatmapProps> = ({ habit, logs, year = new Date().getFullYear() }) => {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 0, 1));

  // Get all days in the year
  const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Add padding days to start on Sunday
  const startDayOfWeek = getDay(yearStart);
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => addDays(yearStart, -startDayOfWeek + i));

  const allDaysWithPadding = [...paddingDays, ...allDays];

  // Group days into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < allDaysWithPadding.length; i += 7) {
    weeks.push(allDaysWithPadding.slice(i, i + 7));
  }

  const getCellData = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const log = logs.find(l => l.habitId === habit.id && l.date === dateString);

    if (!log) {
      return { percentage: 0, status: 'none' as const };
    }

    const percentage = Math.min((log.value / habit.goal.value) * 100, 100);
    return { percentage, status: log.status };
  };

  const getCellColor = (percentage: number, status: string, isPadding: boolean) => {
    if (isPadding) return 'bg-transparent';
    if (status === 'skipped') {
      return 'bg-text-tertiary-light/20 dark:bg-text-tertiary-dark/20';
    }
    if (status === 'missed' || percentage === 0) {
      return 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark';
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
    return 'bg-bg-tertiary-light/50 dark:bg-bg-tertiary-dark/50';
  };

  let currentMonth = '';

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
        {year} Activity
      </h4>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1 mb-1 ml-6">
            {weeks.map((week, weekIndex) => {
              const firstDayOfWeek = week[0];
              if (!firstDayOfWeek) return null;

              const month = format(firstDayOfWeek, 'MMM');
              const showLabel = month !== currentMonth;
              currentMonth = month;

              return (
                <div key={weekIndex} className="w-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {showLabel && week.some(d => d >= yearStart && d <= yearEnd) && (
                    <span className="text-[10px]">{month}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid container */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 justify-around text-xs text-text-secondary-light dark:text-text-secondary-dark mr-1">
              <div className="h-3 flex items-center">Mon</div>
              <div className="h-3 flex items-center">Wed</div>
              <div className="h-3 flex items-center">Fri</div>
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const isPadding = day < yearStart || day > yearEnd;
                    const { percentage, status } = getCellData(day);
                    const dateString = format(day, 'MMM d, yyyy');

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getCellColor(percentage, status, isPadding)} transition-colors`}
                        title={isPadding ? '' : `${dateString}: ${percentage}%`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-bg-tertiary-light dark:bg-bg-tertiary-dark" />
              <div className="w-3 h-3 rounded-sm bg-warning/40" />
              <div className="w-3 h-3 rounded-sm bg-warning/70" />
              <div className="w-3 h-3 rounded-sm bg-success/70" />
              <div className="w-3 h-3 rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;
