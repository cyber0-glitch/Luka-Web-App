import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useHabits } from '../hooks/useHabits';
import { getGlobalStats } from '../utils/statisticsCalculator';
import Modal from '../components/common/Modal';
import HabitStats from '../components/statistics/HabitStats';
import { Habit } from '../types';

interface StatisticsProps {
  onBack: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ onBack }) => {
  const { state } = useApp();
  const { activeHabits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const stats = getGlobalStats(state.logs, activeHabits);

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 backdrop-blur-lg border-b border-bg-tertiary-light dark:border-bg-tertiary-dark">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
            >
              <svg
                className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Statistics
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Global Stats */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Overview
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Total Habits
                </p>
                <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.totalHabits}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  Total Completions
                </p>
                <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.totalCompletions}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  This Week
                </p>
                <p className="text-3xl font-bold text-accent">
                  {stats.weekCompletions}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  This Month
                </p>
                <p className="text-3xl font-bold text-accent">
                  {stats.monthCompletions}
                </p>
              </div>

              <div className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-accent to-accent/80">
                <p className="text-sm text-white/80 mb-1">This Year</p>
                <p className="text-4xl font-bold text-white">
                  {stats.yearCompletions}
                </p>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Achievements
            </h2>

            <div className="p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Total Unlocked
              </p>
              <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {state.achievements.length}
              </p>
            </div>

            {state.achievements.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Recent Achievements
                </h3>
                {state.achievements
                  .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
                  .slice(0, 5)
                  .map((achievement) => {
                    const habit = state.habits.find((h) => h.id === achievement.habitId);
                    return (
                      <div
                        key={achievement.id}
                        className="p-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark flex items-center gap-3"
                      >
                        {habit && (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                            style={{ backgroundColor: `${habit.color}26` }}
                          >
                            {habit.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                            {habit?.name}
                          </p>
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {achievement.type === 'streak' && `${achievement.milestone}-day streak`}
                            {achievement.type === 'total' && `${achievement.milestone} completions`}
                            {achievement.type === 'first_completion' && 'First completion'}
                            {achievement.type === 'perfect_week' && 'Perfect week'}
                            {achievement.type === 'perfect_month' && 'Perfect month'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          {/* Habits Breakdown */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Active Habits
            </h2>

            {activeHabits.length === 0 ? (
              <p className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                No active habits yet
              </p>
            ) : (
              <div className="space-y-2">
                {activeHabits.map((habit) => {
                  const habitLogs = state.logs.filter((l) => l.habitId === habit.id);
                  const completions = habitLogs.filter(
                    (l) => l.status === 'completed' || l.status === 'partial'
                  ).length;

                  return (
                    <button
                      key={habit.id}
                      onClick={() => setSelectedHabit(habit)}
                      className="w-full p-4 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark flex items-center justify-between hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${habit.color}26` }}
                        >
                          {habit.icon}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {habit.name}
                          </p>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {completions} total completions
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Habit Stats Modal */}
      {selectedHabit && (
        <Modal
          isOpen={!!selectedHabit}
          onClose={() => setSelectedHabit(null)}
          title="Habit Statistics"
          maxWidth="lg"
        >
          <HabitStats habit={selectedHabit} />
        </Modal>
      )}
    </div>
  );
};

export default Statistics;
