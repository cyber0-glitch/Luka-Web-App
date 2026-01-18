import { useApp } from '../contexts/AppContext';
import { calculateStreak, getBestStreak, getTotalCompletions, getSuccessRate } from '../utils/streakCalculator';

export const useStreak = () => {
  const { state } = useApp();

  const getCurrentStreak = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return calculateStreak(habitId, state.logs, habit);
  };

  const getBestStreakForHabit = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return getBestStreak(habitId, state.logs, habit);
  };

  const getTotalCompletionsForHabit = (habitId: string) => {
    return getTotalCompletions(habitId, state.logs);
  };

  const getSuccessRateForHabit = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return getSuccessRate(habitId, state.logs, habit);
  };

  const getStreakStats = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        totalCompletions: 0,
        successRate: 0,
      };
    }

    return {
      currentStreak: calculateStreak(habitId, state.logs, habit),
      bestStreak: getBestStreak(habitId, state.logs, habit),
      totalCompletions: getTotalCompletions(habitId, state.logs),
      successRate: getSuccessRate(habitId, state.logs, habit),
    };
  };

  return {
    getCurrentStreak,
    getBestStreakForHabit,
    getTotalCompletionsForHabit,
    getSuccessRateForHabit,
    getStreakStats,
  };
};
