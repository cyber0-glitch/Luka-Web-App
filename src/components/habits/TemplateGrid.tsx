import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HabitTemplate } from '../../types';
import { habitTemplates } from '../../utils/habitTemplates';

interface TemplateGridProps {
  onSelectTemplate: (template: HabitTemplate) => void;
  onCustomClick: () => void;
}

const categories = ['health', 'productivity', 'wellness', 'self-care'] as const;

const categoryLabels = {
  health: 'Health & Fitness',
  productivity: 'Productivity',
  wellness: 'Wellness',
  'self-care': 'Self-Care',
};

const TemplateGrid: React.FC<TemplateGridProps> = ({ onSelectTemplate, onCustomClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = habitTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-accent text-white'
              : 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-white'
                : 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Custom Habit Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCustomClick}
          className="p-4 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white text-left"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">✨</div>
            <div>
              <h3 className="font-semibold text-base mb-1">Custom Habit</h3>
              <p className="text-sm opacity-90">Create your own habit from scratch</p>
            </div>
          </div>
        </motion.button>

        {/* Template Cards */}
        {filteredTemplates.map((template) => (
          <motion.button
            key={template.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTemplate(template)}
            className="p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${template.color}26` }}
              >
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-text-primary-light dark:text-text-primary-dark mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
          No templates found
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;
