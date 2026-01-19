import React from 'react';
import Modal from './Modal';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'N'], description: 'Create new habit', category: 'Actions' },
  { keys: ['Ctrl', 'S'], description: 'Open statistics', category: 'Navigation' },
  { keys: ['Ctrl', ','], description: 'Open settings', category: 'Navigation' },
  { keys: ['Ctrl', 'H'], description: 'Go to today', category: 'Navigation' },
  { keys: ['Alt', '←'], description: 'Previous day', category: 'Navigation' },
  { keys: ['Alt', '→'], description: 'Next day', category: 'Navigation' },
  { keys: ['Ctrl', 'T'], description: 'Toggle theme', category: 'Appearance' },
  { keys: ['Shift', '?'], description: 'Show this help', category: 'Help' },
  { keys: ['Esc'], description: 'Close modal/dialog', category: 'General' },
];

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  const renderKey = (key: string) => (
    <kbd className="px-2 py-1 text-xs font-semibold bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark rounded border border-bg-primary-light dark:border-bg-primary-dark">
      {key}
    </kbd>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" maxWidth="lg">
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {shortcuts
                .filter((s) => s.category === category)
                .map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-bg-tertiary-light dark:border-bg-tertiary-dark last:border-b-0"
                  >
                    <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            <span className="text-text-secondary-light dark:text-text-secondary-dark mx-1">
                              +
                            </span>
                          )}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-bg-tertiary-light dark:border-bg-tertiary-dark">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <strong>Note:</strong> On Mac, use <kbd className="px-1 py-0.5 text-xs bg-bg-tertiary-light dark:bg-bg-tertiary-dark rounded">Cmd</kbd> instead of <kbd className="px-1 py-0.5 text-xs bg-bg-tertiary-light dark:bg-bg-tertiary-dark rounded">Ctrl</kbd>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsHelp;
