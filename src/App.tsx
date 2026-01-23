import { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import Tasks from './pages/Tasks';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import './styles/globals.css';

type View = 'dashboard' | 'settings' | 'statistics' | 'tasks';

function App() {
  const [currentView, setCurrentView] = useState<View>('tasks');

  return (
    <AppProvider>
      <ThemeProvider>
        {currentView === 'dashboard' && (
          <Dashboard
            onSettingsClick={() => setCurrentView('settings')}
            onStatsClick={() => setCurrentView('statistics')}
            onTasksClick={() => setCurrentView('tasks')}
          />
        )}

        {currentView === 'settings' && (
          <Settings onBack={() => setCurrentView('tasks')} />
        )}

        {currentView === 'statistics' && (
          <Statistics onBack={() => setCurrentView('tasks')} />
        )}

        {currentView === 'tasks' && (
          <Tasks
            onHabitsClick={() => setCurrentView('dashboard')}
            onSettingsClick={() => setCurrentView('settings')}
            onStatsClick={() => setCurrentView('statistics')}
          />
        )}

        <PWAInstallPrompt />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
