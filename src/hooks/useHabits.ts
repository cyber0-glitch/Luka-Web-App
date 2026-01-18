import { useApp } from '../contexts/AppContext';
import { Habit, HabitTemplate } from '../types';

export const useHabits = () => {
  const { state, dispatch } = useApp();

  const addHabit = (habit: Habit) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const updateHabit = (habit: Habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const archiveHabit = (habitId: string) => {
    dispatch({ type: 'ARCHIVE_HABIT', payload: habitId });
  };

  const createHabitFromTemplate = (template: HabitTemplate): Habit => {
    return {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      description: template.description,
      icon: template.icon,
      color: template.color,
      type: template.type,
      goal: template.goal,
      schedule: template.schedule,
      sortOrder: state.habits.length,
      createdAt: new Date().toISOString(),
    };
  };

  const getActiveHabits = () => {
    return state.habits
      .filter(h => !h.archivedAt)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const getArchivedHabits = () => {
    return state.habits.filter(h => h.archivedAt);
  };

  const getHabitById = (habitId: string) => {
    return state.habits.find(h => h.id === habitId);
  };

  const getHabitsByGroup = (groupId: string | undefined) => {
    return state.habits
      .filter(h => !h.archivedAt && h.groupId === groupId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const reorderHabits = (habitIds: string[]) => {
    habitIds.forEach((id, index) => {
      const habit = state.habits.find(h => h.id === id);
      if (habit) {
        dispatch({
          type: 'UPDATE_HABIT',
          payload: { ...habit, sortOrder: index },
        });
      }
    });
  };

  return {
    habits: state.habits,
    activeHabits: getActiveHabits(),
    archivedHabits: getArchivedHabits(),
    addHabit,
    updateHabit,
    deleteHabit,
    archiveHabit,
    createHabitFromTemplate,
    getHabitById,
    getHabitsByGroup,
    reorderHabits,
  };
};
