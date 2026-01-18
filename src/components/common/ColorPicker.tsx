import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const presetColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#DC2626', '#7C3AED', '#4F46E5',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelect }) => {
  const [customColor, setCustomColor] = useState(selectedColor);

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-3 mb-4">
        {presetColors.map((color) => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(color)}
            className={`w-12 h-12 rounded-xl transition-all ${
              selectedColor === color
                ? 'ring-4 ring-accent ring-offset-2 ring-offset-bg-primary-light dark:ring-offset-bg-primary-dark'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          Custom:
        </label>
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            onSelect(e.target.value);
          }}
          className="w-16 h-10 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
              onSelect(e.target.value);
            }
          }}
          placeholder="#000000"
          className="flex-1 px-3 py-2 rounded-lg bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
