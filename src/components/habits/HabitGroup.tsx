import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, HabitGroup as HabitGroupType } from '../../types';
import HabitCard from './HabitCard';
import { useApp } from '../../contexts/AppContext';
import { useLogs } from '../../hooks/useLogs';

interface HabitGroupProps {
  group: HabitGroupType;
  habits: Habit[];
  onHabitClick: (habitId: string) => void;
  onHabitLongPress?: (habitId: string) => void;
}

const HabitGroup: React.FC<HabitGroupProps> = ({
  group,
  habits,
  onHabitClick,
  onHabitLongPress,
}) => {
  const { state, dispatch } = useApp();
  const { getLogForDate } = useLogs();

  const toggleCollapse = () => {
    dispatch({
      type: 'UPDATE_GROUP',
      payload: { ...group, collapsed: !group.collapsed },
    });
  };

  const completedCount = habits.filter((habit) => {
    const log = getLogForDate(habit.id, state.selectedDate);
    return log && (log.status === 'completed' || log.status === 'partial');
  }).length;

  return (
    <div className="space-y-2">
      {/* Group Header */}
      <button
        onClick={toggleCollapse}
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: group.collapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary-light dark:text-text-secondary-dark"
          >
            ▶
          </motion.div>
          <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
            {group.name}
          </h3>
        </div>
        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {completedCount}/{habits.length}
        </span>
      </button>

      {/* Habits */}
      <AnimatePresence>
        {!group.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2 overflow-hidden"
          >
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onClick={() => onHabitClick(habit.id)}
                onLongPress={() => onHabitLongPress?.(habit.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitGroup;
