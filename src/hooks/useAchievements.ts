import { useApp } from '../contexts/AppContext';
import { Achievement } from '../types';
import { checkForNewAchievements, getAchievementTitle, getAchievementDescription, getAchievementIcon } from '../utils/achievementChecker';

export const useAchievements = () => {
  const { state, dispatch } = useApp();

  const unlockAchievement = (achievement: Achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const markAchievementCelebrated = (achievementId: string) => {
    dispatch({ type: 'MARK_ACHIEVEMENT_CELEBRATED', payload: achievementId });
  };

  const checkAchievements = (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const newAchievements = checkForNewAchievements(
      habitId,
      state.logs,
      habit,
      state.achievements
    );

    newAchievements.forEach(achievement => {
      unlockAchievement(achievement);
    });

    return newAchievements;
  };

  const getAchievementsForHabit = (habitId: string) => {
    return state.achievements
      .filter(a => a.habitId === habitId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  };

  const getUncelebratedAchievements = () => {
    return state.achievements.filter(a => !a.celebrated);
  };

  const getAllAchievements = () => {
    return state.achievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  };

  const getAchievementInfo = (achievement: Achievement) => {
    return {
      title: getAchievementTitle(achievement),
      description: getAchievementDescription(achievement),
      icon: getAchievementIcon(achievement),
    };
  };

  return {
    achievements: state.achievements,
    unlockAchievement,
    markAchievementCelebrated,
    checkAchievements,
    getAchievementsForHabit,
    getUncelebratedAchievements,
    getAllAchievements,
    getAchievementInfo,
  };
};
