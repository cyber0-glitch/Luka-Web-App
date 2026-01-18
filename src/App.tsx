import { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import './styles/globals.css';

type View = 'dashboard' | 'settings' | 'statistics';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <AppProvider>
      <ThemeProvider>
        {currentView === 'dashboard' && (
          <Dashboard
            onSettingsClick={() => setCurrentView('settings')}
            onStatsClick={() => setCurrentView('statistics')}
          />
        )}

        {currentView === 'settings' && (
          <Settings onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'statistics' && (
          <Statistics onBack={() => setCurrentView('dashboard')} />
        )}
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
