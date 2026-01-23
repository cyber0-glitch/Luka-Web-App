import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import CircularProgress from '../common/CircularProgress';
import { useLogs } from '../../hooks/useLogs';
import { useStreak } from '../../hooks/useStreak';
import { useApp } from '../../contexts/AppContext';
import { useSwipe } from '../../hooks/useSwipe';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onLongPress?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, onLongPress }) => {
  const { state } = useApp();
  const { getLogForDate, createLog, logProgress } = useLogs();
  const { getCurrentStreak } = useStreak();

  const log = getLogForDate(habit.id, state.selectedDate);
  const currentValue = log?.value || 0;
  const percentage = Math.min((currentValue / habit.goal.value) * 100, 100);
  const currentStreak = getCurrentStreak(habit.id);

  // Swipe gesture handlers
  const handleSwipeRight = () => {
    // Quick increment
    const newValue = Math.min(currentValue + 1, habit.goal.value * 2);
    const status = newValue >= habit.goal.value ? 'completed' : newValue > 0 ? 'partial' : 'missed';
    const newLog = createLog(habit.id, state.selectedDate, newValue, status);
    logProgress(newLog);
  };

  const handleSwipeLeft = () => {
    // Mark as skipped
    const newLog = createLog(habit.id, state.selectedDate, 0, 'skipped', 'Skipped');
    logProgress(newLog);
  };

  const swipeHandlers = useSwipe({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 80,
  });

  const getUnitDisplay = () => {
    if (habit.goal.unit === 'custom' && habit.goal.customUnitName) {
      return habit.goal.customUnitName;
    }
    return habit.goal.unit;
  };

  const getProgressText = () => {
    if (habit.type === 'bad') {
      // For bad habits, show how many times they avoided it
      return log?.status === 'completed' ? '✓ Avoided' : '✗ Broken';
    }
    return `${currentValue}/${habit.goal.value} ${getUnitDisplay()}`;
  };

  return (
    <div className="relative">
      {/* Swipe indicator backgrounds */}
      {swipeHandlers.isSwiping && (
        <>
          {swipeHandlers.swipeDirection === 'right' && (
            <div className="absolute inset-0 bg-success/20 rounded-2xl flex items-center justify-start px-6 pointer-events-none">
              <span className="text-2xl">+1</span>
            </div>
          )}
          {swipeHandlers.swipeDirection === 'left' && (
            <div className="absolute inset-0 bg-text-tertiary-light/20 dark:bg-text-tertiary-dark/20 rounded-2xl flex items-center justify-end px-6 pointer-events-none">
              <span className="text-2xl">⏭️</span>
            </div>
          )}
        </>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          // Don't trigger click if swiping
          if (!swipeHandlers.isSwiping) {
            onClick();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress?.();
        }}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
        className="relative h-18 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${habit.color}26` }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-text-primary-light dark:text-text-primary-dark truncate">
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {getProgressText()}
            </p>
            {currentStreak > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-streak-flame">🔥</span>
                <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {currentStreak}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <CircularProgress
            percentage={percentage}
            size="medium"
            color={habit.color}
            showValue={false}
          />
        </div>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLongPress?.();
          }}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark transition-colors"
          aria-label="Edit habit"
        >
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </motion.div>
    </div>
  );
};

export default HabitCard;
