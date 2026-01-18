import React from 'react';

interface DatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  min,
  max,
  className = '',
}) => {
  return (
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      className={`px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
    />
  );
};

export default DatePicker;
