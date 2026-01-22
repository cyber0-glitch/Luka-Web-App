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
  const [currentView, setCurrentView] = useState<View>('dashboard');

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
          <Settings onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'statistics' && (
          <Statistics onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'tasks' && (
          <Tasks onBack={() => setCurrentView('dashboard')} />
        )}

        <PWAInstallPrompt />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
