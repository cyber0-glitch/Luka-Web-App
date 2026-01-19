import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// Default keyboard shortcuts
export const DEFAULT_SHORTCUTS = {
  NEW_HABIT: { key: 'n', ctrl: true, description: 'Create new habit' },
  TOGGLE_THEME: { key: 't', ctrl: true, description: 'Toggle theme' },
  OPEN_SETTINGS: { key: ',', ctrl: true, description: 'Open settings' },
  OPEN_STATS: { key: 's', ctrl: true, description: 'Open statistics' },
  GO_TO_TODAY: { key: 'h', ctrl: true, description: 'Go to today' },
  PREVIOUS_DAY: { key: 'ArrowLeft', alt: true, description: 'Previous day' },
  NEXT_DAY: { key: 'ArrowRight', alt: true, description: 'Next day' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
};
