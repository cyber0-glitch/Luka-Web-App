import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDisplayDate, getNextDay, getPreviousDay, getTodayString } from '../../utils/dateUtils';

interface HeaderProps {
  onSettingsClick?: () => void;
  onStatsClick?: () => void;
  onTasksClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onStatsClick, onTasksClick }) => {
  const { state, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();

  const handlePreviousDay = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: getPreviousDay(state.selectedDate) });
  };

  const handleNextDay = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: getNextDay(state.selectedDate) });
  };

  const handleToday = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: getTodayString() });
  };

  const isToday = state.selectedDate === getTodayString();

  return (
    <header className="sticky top-0 z-40 bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 backdrop-blur-lg border-b border-bg-tertiary-light dark:border-bg-tertiary-dark">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Luka
          </h1>

          <div className="flex items-center gap-2">
            {/* Stats Button */}
            {onStatsClick && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStatsClick}
                className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
                aria-label="Statistics"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </motion.button>
            )}

            {/* Tasks Button */}
            {onTasksClick && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onTasksClick}
                className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
                aria-label="Tasks"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </motion.button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </motion.button>

            {/* Settings Button */}
            {onSettingsClick && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onSettingsClick}
                className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
                aria-label="Settings"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousDay}
            className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
            aria-label="Previous day"
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
          </motion.button>

          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              {formatDisplayDate(state.selectedDate)}
            </h2>
            {!isToday && (
              <button
                onClick={handleToday}
                className="text-sm text-accent hover:underline mt-1"
              >
                Today
              </button>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextDay}
            className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
            aria-label="Next day"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
