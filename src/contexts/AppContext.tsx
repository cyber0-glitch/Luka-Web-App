import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, UserSettings } from '../types';
import { getTodayString } from '../utils/dateUtils';
import { saveToLocalStorage, loadFromLocalStorage, checkDataVersion } from '../hooks/useLocalStorage';

const defaultSettings: UserSettings = {
  theme: 'system',
  darkModeStyle: 'gray',
  weekStartsOn: 0,
  showCompletedAtBottom: true,
  hideCompletedHabits: false,
  confettiEnabled: true,
  soundEnabled: false,
};

const initialState: AppState = {
  habits: [],
  logs: [],
  groups: [],
  achievements: [],
  settings: defaultSettings,
  selectedDate: getTodayString(),
  ui: {
    activeModal: null,
    selectedHabitId: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload],
      };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload.id ? action.payload : h
        ),
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
        logs: state.logs.filter(l => l.habitId !== action.payload),
        achievements: state.achievements.filter(a => a.habitId !== action.payload),
      };

    case 'ARCHIVE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload
            ? { ...h, archivedAt: new Date().toISOString() }
            : h
        ),
      };

    case 'LOG_PROGRESS':
      return {
        ...state,
        logs: [...state.logs.filter(l => !(l.habitId === action.payload.habitId && l.date === action.payload.date)), action.payload],
      };

    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map(l =>
          l.id === action.payload.id ? action.payload : l
        ),
      };

    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter(l => l.id !== action.payload),
      };

    case 'ADD_GROUP':
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };

    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
      };

    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.payload),
        habits: state.habits.map(h =>
          h.groupId === action.payload ? { ...h, groupId: undefined } : h
        ),
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };

    case 'MARK_ACHIEVEMENT_CELEBRATED':
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.payload ? { ...a, celebrated: true } : a
        ),
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      };

    case 'SET_ACTIVE_MODAL':
      return {
        ...state,
        ui: { ...state.ui, activeModal: action.payload },
      };

    case 'SET_SELECTED_HABIT_ID':
      return {
        ...state,
        ui: { ...state.ui, selectedHabitId: action.payload },
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    checkDataVersion();

    return {
      ...initial,
      habits: loadFromLocalStorage('habits', []),
      logs: loadFromLocalStorage('logs', []),
      groups: loadFromLocalStorage('groups', []),
      achievements: loadFromLocalStorage('achievements', []),
      settings: { ...defaultSettings, ...loadFromLocalStorage('settings', {}) },
    };
  });

  // Save to localStorage whenever state changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('habits', state.habits);
      saveToLocalStorage('logs', state.logs);
      saveToLocalStorage('groups', state.groups);
      saveToLocalStorage('achievements', state.achievements);
      saveToLocalStorage('settings', state.settings);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state.habits, state.logs, state.groups, state.achievements, state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
