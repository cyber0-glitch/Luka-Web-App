import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import CircularProgress from '../common/CircularProgress';
import { useLogs } from '../../hooks/useLogs';
import { useStreak } from '../../hooks/useStreak';
import { useApp } from '../../contexts/AppContext';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onLongPress?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, onLongPress }) => {
  const { state } = useApp();
  const { getLogForDate } = useLogs();
  const { getCurrentStreak } = useStreak();

  const log = getLogForDate(habit.id, state.selectedDate);
  const currentValue = log?.value || 0;
  const percentage = Math.min((currentValue / habit.goal.value) * 100, 100);
  const currentStreak = getCurrentStreak(habit.id);

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
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      className="h-18 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark hover:shadow-md transition-all cursor-pointer"
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
      </div>
    </motion.div>
  );
};

export default HabitCard;
