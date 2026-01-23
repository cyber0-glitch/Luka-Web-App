import { useState } from 'react';

const DATA_VERSION = 1;

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export const saveToLocalStorage = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const clearLocalStorage = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const checkDataVersion = (): void => {
  const storedVersion = loadFromLocalStorage('dataVersion', 0);

  if (storedVersion < DATA_VERSION) {
    // Run migrations if needed
    runMigrations(storedVersion, DATA_VERSION);
    saveToLocalStorage('dataVersion', DATA_VERSION);
  }
};

const runMigrations = (fromVersion: number, toVersion: number): void => {
  console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);

  // Add migration logic here when schema changes
  // For now, no migrations needed
};

export const exportData = () => {
  const data = {
    habits: loadFromLocalStorage('habits', []),
    logs: loadFromLocalStorage('logs', []),
    groups: loadFromLocalStorage('groups', []),
    tasks: loadFromLocalStorage('tasks', []),
    achievements: loadFromLocalStorage('achievements', []),
    settings: loadFromLocalStorage('settings', {}),
    dataVersion: DATA_VERSION,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `luka-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Validate data structure
        if (!data.habits || !Array.isArray(data.habits)) {
          throw new Error('Invalid data format: missing habits array');
        }

        // Import data
        saveToLocalStorage('habits', data.habits);
        saveToLocalStorage('logs', data.logs || []);
        saveToLocalStorage('groups', data.groups || []);
        saveToLocalStorage('tasks', data.tasks || []);
        saveToLocalStorage('achievements', data.achievements || []);
        saveToLocalStorage('settings', data.settings || {});

        // Trigger page reload to apply imported data
        window.location.reload();

        resolve(true);
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
