import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import GroupsManagement from '../components/groups/GroupsManagement';
import { exportData, importData, clearLocalStorage } from '../hooks/useLocalStorage';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { state, dispatch } = useApp();
  const { darkModeStyle, setDarkModeStyle } = useTheme();
  const { permission, requestPermission, sendNotification, isSupported } = useNotifications();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: newTheme } });
  };

  const handleDarkModeStyleChange = (style: 'true_black' | 'gray') => {
    setDarkModeStyle(style);
  };

  const handleExport = () => {
    try {
      exportData();
      showMessage('Data exported successfully!', 'success');
    } catch (error) {
      showMessage('Failed to export data', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      showMessage('Data imported successfully!', 'success');
    } catch (error) {
      showMessage('Failed to import data. Please check the file format.', 'error');
    }

    e.target.value = '';
  };

  const handleClearData = () => {
    if (clearConfirmText === 'DELETE') {
      clearLocalStorage();
      showMessage('All data cleared', 'success');
      setShowClearConfirm(false);
      setClearConfirmText('');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleRequestNotificationPermission = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      showMessage('Notification permission granted!', 'success');
      // Send a test notification
      sendNotification('Luka Habits', {
        body: 'You will now receive habit reminders!',
      });
    } else if (result === 'denied') {
      showMessage('Notification permission denied. Please enable in browser settings.', 'error');
    }
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      sendNotification('Test Notification', {
        body: "This is a test notification from Luka Habits!",
      });
      showMessage('Test notification sent!', 'success');
    } else {
      showMessage('Please enable notifications first', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 backdrop-blur-lg border-b border-bg-tertiary-light dark:border-bg-tertiary-dark">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
            >
              <svg
                className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Settings
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Appearance */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Appearance
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                  Theme
                </label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      className={`flex-1 px-4 py-3 rounded-xl capitalize transition-colors ${
                        state.settings.theme === t
                          ? 'bg-accent text-white'
                          : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                  Dark Mode Style
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDarkModeStyleChange('gray')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                      darkModeStyle === 'gray'
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    System Gray
                  </button>
                  <button
                    onClick={() => handleDarkModeStyleChange('true_black')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                      darkModeStyle === 'true_black'
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    True Black (OLED)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Behavior */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Behavior
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    Week Starts On
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Choose when your week begins
                  </p>
                </div>
                <select
                  value={state.settings.weekStartsOn}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { weekStartsOn: parseInt(e.target.value) as 0 | 1 },
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    Confetti Animations
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Show confetti when unlocking achievements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={state.settings.confettiEnabled}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { confettiEnabled: e.target.checked },
                    })
                  }
                  className="w-12 h-6 rounded-full accent-accent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    Sound Effects
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Play sounds for interactions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={state.settings.soundEnabled}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { soundEnabled: e.target.checked },
                    })
                  }
                  className="w-12 h-6 rounded-full accent-accent"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Notifications
            </h2>

            {!isSupported ? (
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Notifications are not supported in your browser.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      Browser Notifications
                    </p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Status: {permission === 'granted' ? '✓ Enabled' : permission === 'denied' ? '✗ Denied' : 'Not enabled'}
                    </p>
                  </div>
                  {permission !== 'granted' && (
                    <Button variant="primary" size="sm" onClick={handleRequestNotificationPermission}>
                      Enable
                    </Button>
                  )}
                </div>

                {permission === 'granted' && (
                  <div>
                    <Button variant="secondary" onClick={handleTestNotification} fullWidth>
                      Send Test Notification
                    </Button>
                  </div>
                )}

                {permission === 'denied' && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                    <p className="text-sm text-error">
                      Notifications are blocked. Please enable them in your browser settings.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Groups Management */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <GroupsManagement
              groups={state.groups}
              onCreateGroup={(group) => dispatch({ type: 'ADD_GROUP', payload: group })}
              onUpdateGroup={(group) => dispatch({ type: 'UPDATE_GROUP', payload: group })}
              onDeleteGroup={(groupId) => dispatch({ type: 'DELETE_GROUP', payload: groupId })}
              habitCountByGroup={(groupId) =>
                state.habits.filter((h) => h.groupId === groupId && !h.archivedAt).length
              }
            />
          </section>

          {/* Data Management */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Data Management
            </h2>

            <div className="space-y-3">
              <Button variant="secondary" onClick={handleExport} fullWidth>
                Export Data (JSON)
              </Button>

              <label className="block cursor-pointer">
                <div className="w-full px-6 py-3 text-base min-h-[44px] font-medium rounded-xl transition-all duration-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:bg-opacity-10 text-center">
                  Import Data (JSON)
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <div className="pt-4 border-t border-bg-tertiary-light dark:border-bg-tertiary-dark">
                {!showClearConfirm ? (
                  <Button
                    variant="danger"
                    onClick={() => setShowClearConfirm(true)}
                    fullWidth
                  >
                    Clear All Data
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-error">
                      This will delete all your habits, logs, and achievements. Type "DELETE" to
                      confirm.
                    </p>
                    <input
                      type="text"
                      value={clearConfirmText}
                      onChange={(e) => setClearConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full px-4 py-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-error"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowClearConfirm(false);
                          setClearConfirmText('');
                        }}
                        fullWidth
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={handleClearData}
                        disabled={clearConfirmText !== 'DELETE'}
                        fullWidth
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* About */}
          <section className="p-6 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              About
            </h2>

            <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <p>
                <strong>Version:</strong> 1.3.0 (Tasks Feature)
              </p>
              <p>
                <strong>Description:</strong> A modern habit tracking app inspired by Grit
              </p>
              <p className="pt-2">
                Built with React, TypeScript, Tailwind CSS, and Framer Motion
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Settings;
