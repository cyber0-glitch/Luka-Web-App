import React from 'react';
import { Habit } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useStreak } from '../../hooks/useStreak';
import WeeklyChart from './WeeklyChart';
import MonthlyHeatmap from './MonthlyHeatmap';

interface HabitStatsProps {
  habit: Habit;
}

const HabitStats: React.FC<HabitStatsProps> = ({ habit }) => {
  const { state } = useApp();
  const { getStreakStats } = useStreak();

  const stats = getStreakStats(habit.id);
  const habitLogs = state.logs.filter(l => l.habitId === habit.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${habit.color}26` }}
        >
          {habit.icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            {habit.name}
          </h2>
          {habit.description && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
            Current Streak
          </p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {stats.currentStreak}
            </span>
            <span className="text-2xl">🔥</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
            Best Streak
          </p>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {stats.bestStreak}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
            Total Completions
          </p>
          <p className="text-3xl font-bold text-accent">
            {stats.totalCompletions}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
            Success Rate
          </p>
          <p className="text-3xl font-bold text-success">
            {stats.successRate}%
          </p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <WeeklyChart habit={habit} logs={state.logs} />
      </div>

      {/* Monthly Heatmap */}
      <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <MonthlyHeatmap habit={habit} logs={state.logs} />
      </div>

      {/* Recent Activity */}
      <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <h4 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">
          Recent Activity
        </h4>
        {habitLogs.length === 0 ? (
          <p className="text-center py-4 text-text-secondary-light dark:text-text-secondary-dark">
            No activity yet
          </p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {habitLogs
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-bg-tertiary-light dark:border-bg-tertiary-dark last:border-b-0"
                >
                  <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                    {log.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {log.value}/{habit.goal.value}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        log.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : log.status === 'partial'
                          ? 'bg-warning/20 text-warning'
                          : log.status === 'skipped'
                          ? 'bg-text-tertiary-light/20 dark:bg-text-tertiary-dark/20'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitStats;
