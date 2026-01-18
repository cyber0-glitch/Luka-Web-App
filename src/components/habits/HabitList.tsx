import React from 'react';
import HabitCard from './HabitCard';
import HabitGroup from './HabitGroup';
import { useApp } from '../../contexts/AppContext';
import { useHabits } from '../../hooks/useHabits';

interface HabitListProps {
  onHabitClick: (habitId: string) => void;
  onHabitLongPress?: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ onHabitClick, onHabitLongPress }) => {
  const { state } = useApp();
  const { getHabitsByGroup } = useHabits();

  const groups = state.groups.sort((a, b) => a.sortOrder - b.sortOrder);
  const ungroupedHabits = getHabitsByGroup(undefined);

  if (state.habits.filter(h => !h.archivedAt).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl mb-2">📝</p>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          No habits yet. Create your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grouped habits */}
      {groups.map((group) => {
        const groupHabits = getHabitsByGroup(group.id);
        if (groupHabits.length === 0) return null;

        return (
          <HabitGroup
            key={group.id}
            group={group}
            habits={groupHabits}
            onHabitClick={onHabitClick}
            onHabitLongPress={onHabitLongPress}
          />
        );
      })}

      {/* Ungrouped habits */}
      {ungroupedHabits.length > 0 && (
        <div className="space-y-2">
          {groups.length > 0 && (
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark px-2">
              Ungrouped
            </h3>
          )}
          {ungroupedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => onHabitClick(habit.id)}
              onLongPress={() => onHabitLongPress?.(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitList;
