import React, { useState, useEffect } from 'react';
import { Habit } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import CircularProgress from '../common/CircularProgress';
import { useLogs } from '../../hooks/useLogs';
import { useApp } from '../../contexts/AppContext';
import { useAchievements } from '../../hooks/useAchievements';
import { formatDisplayDate } from '../../utils/dateUtils';

interface QuickLogModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickLogModal: React.FC<QuickLogModalProps> = ({ habit, isOpen, onClose }) => {
  const { state } = useApp();
  const { getLogForDate, createLog, logProgress } = useLogs();
  const { checkAchievements } = useAchievements();

  const [value, setValue] = useState(0);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (habit) {
      const log = getLogForDate(habit.id, state.selectedDate);
      setValue(log?.value || 0);
      setNote(log?.note || '');
    }
  }, [habit, state.selectedDate]);

  if (!habit) return null;

  const percentage = Math.min((value / habit.goal.value) * 100, 100);

  const handleIncrement = () => {
    setValue(Math.min(value + 1, habit.goal.value * 2));
  };

  const handleDecrement = () => {
    setValue(Math.max(value - 1, 0));
  };

  const handleComplete = () => {
    setValue(habit.goal.value);
  };

  const handleReset = () => {
    setValue(0);
  };

  const handleSave = () => {
    const status = value >= habit.goal.value
      ? 'completed'
      : value > 0
      ? 'partial'
      : 'missed';

    const log = createLog(habit.id, state.selectedDate, value, status, note || undefined);
    logProgress(log);

    // Check for achievements
    checkAchievements(habit.id);

    onClose();
  };

  const handleSkip = () => {
    const log = createLog(habit.id, state.selectedDate, 0, 'skipped', 'Skipped');
    logProgress(log);
    onClose();
  };

  const handleMiss = () => {
    const log = createLog(habit.id, state.selectedDate, 0, 'missed', 'Missed');
    logProgress(log);
    onClose();
  };

  const getUnitDisplay = () => {
    if (habit.goal.unit === 'custom' && habit.goal.customUnitName) {
      return habit.goal.customUnitName;
    }
    return habit.goal.unit;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${habit.color}26` }}
          >
            {habit.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              {habit.name}
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {formatDisplayDate(state.selectedDate)}
            </p>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center py-4">
          <CircularProgress
            percentage={percentage}
            size="xlarge"
            color={habit.color}
            value={`${value}/${habit.goal.value}`}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleDecrement}
            disabled={value === 0}
            className="w-16 h-16 !rounded-full"
          >
            −
          </Button>

          <div className="text-center min-w-[120px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-3xl font-bold text-center bg-transparent text-text-primary-light dark:text-text-primary-dark focus:outline-none"
            />
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {getUnitDisplay()}
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleIncrement}
            className="w-16 h-16 !rounded-full"
          >
            +
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleReset}
            size="sm"
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleComplete}
            size="sm"
            className="flex-1"
          >
            Complete
          </Button>
        </div>

        {/* Note */}
        <div>
          {!showNote ? (
            <button
              onClick={() => setShowNote(true)}
              className="text-sm text-accent hover:underline"
            >
              + Add note
            </button>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about today's progress..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="flex gap-3 pt-4 border-t border-bg-tertiary-light dark:border-bg-tertiary-dark">
          <Button
            variant="ghost"
            onClick={handleSkip}
            size="sm"
            className="flex-1"
          >
            Skip (Preserve Streak)
          </Button>
          <Button
            variant="danger"
            onClick={handleMiss}
            size="sm"
            className="flex-1"
          >
            Mark as Missed
          </Button>
        </div>

        {/* Save */}
        <Button
          variant="primary"
          onClick={handleSave}
          fullWidth
          size="lg"
        >
          Save Progress
        </Button>
      </div>
    </Modal>
  );
};

export default QuickLogModal;
