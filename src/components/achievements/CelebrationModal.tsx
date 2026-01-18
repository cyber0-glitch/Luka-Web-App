import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Achievement } from '../../types';
import { useAchievements } from '../../hooks/useAchievements';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';

interface CelebrationModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  achievement,
  isOpen,
  onClose,
}) => {
  const { state } = useApp();
  const { getAchievementInfo, markAchievementCelebrated } = useAchievements();

  useEffect(() => {
    if (isOpen && achievement && state.settings.confettiEnabled) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, achievement, state.settings.confettiEnabled]);

  if (!achievement || !isOpen) return null;

  const { title, description, icon } = getAchievementInfo(achievement);
  const habit = state.habits.find((h) => h.id === achievement.habitId);

  const handleClose = () => {
    markAchievementCelebrated(achievement.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="relative w-full max-w-md bg-gradient-to-br from-bg-primary-light to-bg-secondary-light dark:from-bg-primary-dark dark:to-bg-secondary-dark rounded-3xl shadow-2xl overflow-hidden p-8"
      >
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent opacity-50 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Header */}
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="text-6xl mb-4"
            >
              {icon}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-accent mb-2"
            >
              New Achievement!
            </motion.h2>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2"
            >
              {title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-text-secondary-light dark:text-text-secondary-dark"
            >
              {description}
            </motion.p>
          </div>

          {/* Habit Reference */}
          {habit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${habit.color}26` }}
              >
                {habit.icon}
              </div>
              <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {habit.name}
              </span>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button variant="primary" onClick={handleClose} fullWidth size="lg">
              Awesome!
            </Button>

            <button
              onClick={() => {
                const text = `🎉 I just unlocked "${title}" in my habit tracker! ${description}`;
                navigator.clipboard.writeText(text);
              }}
              className="text-sm text-accent hover:underline"
            >
              Copy to share
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CelebrationModal;
