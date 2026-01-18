import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

const defaultIcons = [
  '💧', '💪', '👟', '😴', '🧘', '🤸', '💊', '📚', '📖', '✍️',
  '🎯', '📝', '🙏', '📱', '🍔', '📺', '🌸', '✨', '🦷', '🌅',
  '🌳', '☕', '🎨', '🎵', '🎮', '🏃', '🧠', '❤️', '⭐', '🔥',
  '💎', '🎪', '🎬', '📷', '🎸', '🥗', '🍎', '🏋️', '🚴', '🏊',
  '⚽', '🏀', '🎾', '🏐', '🥊', '🧩', '🎲', '♟️', '🎭', '🎤',
];

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = searchQuery
    ? defaultIcons.filter(icon => icon.includes(searchQuery))
    : defaultIcons;

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search emojis..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
      />

      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2">
        {filteredIcons.map((icon) => (
          <motion.button
            key={icon}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(icon)}
            className={`text-3xl p-2 rounded-lg hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark transition-colors ${
              selectedIcon === icon
                ? 'bg-accent bg-opacity-20 ring-2 ring-accent'
                : ''
            }`}
          >
            {icon}
          </motion.button>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
          No emojis found
        </div>
      )}
    </div>
  );
};

export default IconPicker;
