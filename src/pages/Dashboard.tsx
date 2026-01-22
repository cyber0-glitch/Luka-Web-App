import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { useAchievements } from '../hooks/useAchievements';
import { useTheme } from '../contexts/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { getNextDay, getPreviousDay, getTodayString } from '../utils/dateUtils';
import Header from '../components/layout/Header';
import FloatingActionButton from '../components/layout/FloatingActionButton';
import HabitList from '../components/habits/HabitList';
import QuickLogModal from '../components/habits/QuickLogModal';
import CelebrationModal from '../components/achievements/CelebrationModal';
import Modal from '../components/common/Modal';
import TemplateGrid from '../components/habits/TemplateGrid';
import HabitForm from '../components/habits/HabitForm';
import KeyboardShortcutsHelp from '../components/common/KeyboardShortcutsHelp';
import { HabitTemplate } from '../types';

interface DashboardProps {
  onSettingsClick: () => void;
  onStatsClick: () => void;
  onTasksClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSettingsClick, onStatsClick, onTasksClick }) => {
  const { state, dispatch } = useApp();
  const { activeHabits, addHabit, updateHabit, deleteHabit, archiveHabit, getHabitById } = useHabits();
  const { getLogsForDate } = useLogs();
  const { getUncelebratedAchievements } = useAchievements();
  const { toggleTheme } = useTheme();

  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showTemplateGrid, setShowTemplateGrid] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const selectedHabit = selectedHabitId ? getHabitById(selectedHabitId) : null;

  // Check for uncelebrated achievements
  const uncelebratedAchievements = getUncelebratedAchievements();
  const [currentAchievement, setCurrentAchievement] = useState<typeof uncelebratedAchievements[0] | null>(uncelebratedAchievements[0] || null);

  useEffect(() => {
    const uncelebrated = getUncelebratedAchievements();
    if (uncelebrated.length > 0 && !currentAchievement) {
      setCurrentAchievement(uncelebrated[0]);
    }
  }, [state.achievements]);

  const handleHabitClick = (habitId: string) => {
    setSelectedHabitId(habitId);
    setShowQuickLog(true);
  };

  const handleCloseQuickLog = () => {
    setShowQuickLog(false);
    setSelectedHabitId(null);
  };

  const handleAddHabitClick = () => {
    setShowTemplateGrid(true);
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateGrid(false);
    setShowHabitForm(true);
  };

  const handleCustomClick = () => {
    setSelectedTemplate(null);
    setShowTemplateGrid(false);
    setShowHabitForm(true);
  };

  const handleSaveHabit = (habit: any) => {
    if (editingHabit) {
      updateHabit(habit);
      setEditingHabit(null);
    } else {
      addHabit(habit);
    }
    setShowHabitForm(false);
    setSelectedTemplate(null);
  };

  const handleCancelHabitForm = () => {
    setShowHabitForm(false);
    setSelectedTemplate(null);
    setEditingHabit(null);
    if (!editingHabit) {
      setShowTemplateGrid(true);
    }
  };

  const handleCloseCelebration = () => {
    setCurrentAchievement(null);
    // Check if there are more uncelebrated achievements
    const uncelebrated = getUncelebratedAchievements();
    if (uncelebrated.length > 0) {
      setTimeout(() => {
        setCurrentAchievement(uncelebrated[0]);
      }, 500);
    }
  };

  // Calculate progress summary
  const todayLogs = getLogsForDate(state.selectedDate);
  const completedCount = activeHabits.filter((habit) => {
    const log = todayLogs.find((l) => l.habitId === habit.id);
    return log && (log.status === 'completed' || log.status === 'partial');
  }).length;
  const totalCount = activeHabits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Keyboard shortcuts
  const isModalOpen = showQuickLog || showTemplateGrid || showHabitForm || !!currentAchievement || showKeyboardHelp;

  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      description: 'Create new habit',
      action: () => {
        if (!isModalOpen) handleAddHabitClick();
      },
    },
    {
      key: 's',
      ctrl: true,
      description: 'Open statistics',
      action: () => {
        if (!isModalOpen) onStatsClick();
      },
    },
    {
      key: ',',
      ctrl: true,
      description: 'Open settings',
      action: () => {
        if (!isModalOpen) onSettingsClick();
      },
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Go to today',
      action: () => {
        if (!isModalOpen) dispatch({ type: 'SET_SELECTED_DATE', payload: getTodayString() });
      },
    },
    {
      key: 'ArrowLeft',
      alt: true,
      description: 'Previous day',
      action: () => {
        if (!isModalOpen) dispatch({ type: 'SET_SELECTED_DATE', payload: getPreviousDay(state.selectedDate) });
      },
    },
    {
      key: 'ArrowRight',
      alt: true,
      description: 'Next day',
      action: () => {
        if (!isModalOpen) dispatch({ type: 'SET_SELECTED_DATE', payload: getNextDay(state.selectedDate) });
      },
    },
    {
      key: 't',
      ctrl: true,
      description: 'Toggle theme',
      action: () => {
        toggleTheme();
      },
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        setShowKeyboardHelp(true);
      },
    },
    {
      key: 'Escape',
      description: 'Close modal',
      action: () => {
        if (showQuickLog) handleCloseQuickLog();
        else if (showTemplateGrid) setShowTemplateGrid(false);
        else if (showHabitForm) handleCancelHabitForm();
        else if (currentAchievement) handleCloseCelebration();
        else if (showKeyboardHelp) setShowKeyboardHelp(false);
      },
    },
  ], true);

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      <Header onSettingsClick={onSettingsClick} onStatsClick={onStatsClick} onTasksClick={onTasksClick} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Progress Summary */}
        {totalCount > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                Today's Progress
              </h3>
              <span className="text-2xl font-bold text-accent">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-bg-tertiary-light dark:bg-bg-tertiary-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-base"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
              {completedCount} of {totalCount} habits completed
            </p>
          </div>
        )}

        {/* Habit List */}
        <HabitList
          onHabitClick={handleHabitClick}
          onHabitLongPress={(habitId) => {
            setEditingHabit(habitId);
            setShowHabitForm(true);
          }}
        />
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddHabitClick} />

      {/* Quick Log Modal */}
      <QuickLogModal
        habit={selectedHabit || null}
        isOpen={showQuickLog}
        onClose={handleCloseQuickLog}
      />

      {/* Template Selection Modal */}
      <Modal
        isOpen={showTemplateGrid}
        onClose={() => setShowTemplateGrid(false)}
        title="Choose a Habit Template"
        maxWidth="lg"
      >
        <TemplateGrid
          onSelectTemplate={handleTemplateSelect}
          onCustomClick={handleCustomClick}
        />
      </Modal>

      {/* Habit Form Modal */}
      <Modal
        isOpen={showHabitForm}
        onClose={handleCancelHabitForm}
        title={editingHabit ? 'Edit Habit' : selectedTemplate ? selectedTemplate.name : 'Create Custom Habit'}
        maxWidth="lg"
      >
        <HabitForm
          template={selectedTemplate || undefined}
          existingHabit={editingHabit ? getHabitById(editingHabit) : undefined}
          onSave={handleSaveHabit}
          onCancel={handleCancelHabitForm}
          onDelete={deleteHabit}
          onArchive={archiveHabit}
        />
      </Modal>

      {/* Achievement Celebration Modal */}
      {currentAchievement && (
        <CelebrationModal
          achievement={currentAchievement}
          isOpen={!!currentAchievement}
          onClose={handleCloseCelebration}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </div>
  );
};

export default Dashboard;
