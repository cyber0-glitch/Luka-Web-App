import React, { useState } from 'react';
import { Habit, HabitTemplate } from '../../types';
import Button from '../common/Button';
import IconPicker from '../common/IconPicker';
import ColorPicker from '../common/ColorPicker';
import { useApp } from '../../contexts/AppContext';

interface HabitFormProps {
  template?: HabitTemplate;
  existingHabit?: Habit;
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  template,
  existingHabit,
  onSave,
  onCancel,
}) => {
  const { state } = useApp();
  const isEditing = !!existingHabit;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: template?.name || existingHabit?.name || '',
    description: template?.description || existingHabit?.description || '',
    type: template?.type || existingHabit?.type || 'good' as 'good' | 'bad',
    icon: template?.icon || existingHabit?.icon || '🎯',
    color: template?.color || existingHabit?.color || '#007AFF',
    goalValue: template?.goal.value || existingHabit?.goal.value || 1,
    goalUnit: template?.goal.unit || existingHabit?.goal.unit || 'count' as any,
    customUnitName: template?.goal.customUnitName || existingHabit?.goal.customUnitName || '',
    scheduleType: template?.schedule.type || existingHabit?.schedule.type || 'daily' as any,
    scheduleDays: existingHabit?.schedule.days || template?.schedule.days || [],
    weeklyTarget: existingHabit?.schedule.weeklyTarget || template?.schedule.weeklyTarget || 7,
    monthlyTarget: existingHabit?.schedule.monthlyTarget || 30,
    intervalDays: existingHabit?.schedule.intervalDays || 1,
    specificDates: existingHabit?.schedule.specificDates || [],
    groupId: existingHabit?.groupId,
    reminderEnabled: existingHabit?.reminder?.enabled || false,
    reminderTime: existingHabit?.reminder?.time || '09:00',
    smartReminder: existingHabit?.reminder?.smartReminder || false,
  });

  const handleSave = () => {
    const habit: Habit = {
      id: existingHabit?.id || `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon,
      color: formData.color,
      type: formData.type,
      goal: {
        value: formData.goalValue,
        unit: formData.goalUnit,
        customUnitName: formData.goalUnit === 'custom' ? formData.customUnitName : undefined,
      },
      schedule: {
        type: formData.scheduleType,
        days: formData.scheduleType === 'specific_days' ? formData.scheduleDays : undefined,
        weeklyTarget: formData.scheduleType === 'weekly' ? formData.weeklyTarget : undefined,
        monthlyTarget: formData.scheduleType === 'monthly' ? formData.monthlyTarget : undefined,
        intervalDays: formData.scheduleType === 'interval' ? formData.intervalDays : undefined,
        specificDates: formData.scheduleType === 'specific_dates' ? formData.specificDates : undefined,
      },
      groupId: formData.groupId,
      sortOrder: existingHabit?.sortOrder ?? state.habits.length,
      createdAt: existingHabit?.createdAt || new Date().toISOString(),
      archivedAt: existingHabit?.archivedAt,
      reminder: formData.reminderEnabled
        ? {
            enabled: true,
            time: formData.reminderTime,
            smartReminder: formData.smartReminder,
          }
        : undefined,
    };

    onSave(habit);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.goalValue > 0 && (formData.goalUnit !== 'custom' || formData.customUnitName.trim().length > 0);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Basic Information
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Habit Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Drink Water"
          maxLength={50}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add a description..."
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Habit Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'good' })}
            className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
              formData.type === 'good'
                ? 'bg-success text-white'
                : 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark'
            }`}
          >
            Build Good Habit
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'bad' })}
            className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
              formData.type === 'bad'
                ? 'bg-error text-white'
                : 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark'
            }`}
          >
            Break Bad Habit
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Icon
        </label>
        <IconPicker
          selectedIcon={formData.icon}
          onSelect={(icon) => setFormData({ ...formData, icon })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Color
        </label>
        <ColorPicker
          selectedColor={formData.color}
          onSelect={(color) => setFormData({ ...formData, color })}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Goal Configuration
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Goal Value
        </label>
        <input
          type="number"
          value={formData.goalValue}
          onChange={(e) => setFormData({ ...formData, goalValue: parseInt(e.target.value) || 0 })}
          min="1"
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Unit
        </label>
        <select
          value={formData.goalUnit}
          onChange={(e) => setFormData({ ...formData, goalUnit: e.target.value as any })}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="count">Count</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="steps">Steps</option>
          <option value="ml">Milliliters</option>
          <option value="km">Kilometers</option>
          <option value="calories">Calories</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {formData.goalUnit === 'custom' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
            Custom Unit Name
          </label>
          <input
            type="text"
            value={formData.customUnitName}
            onChange={(e) => setFormData({ ...formData, customUnitName: e.target.value })}
            placeholder="e.g., glasses, pages, reps"
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      <div className="p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Preview: Complete {formData.goalValue}{' '}
          {formData.goalUnit === 'custom' ? formData.customUnitName || 'units' : formData.goalUnit}{' '}
          daily
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Schedule
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Schedule Type
        </label>
        <select
          value={formData.scheduleType}
          onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value as any })}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="daily">Daily</option>
          <option value="specific_days">Specific Days of Week</option>
          <option value="weekly">Weekly Target</option>
          <option value="monthly">Monthly Target</option>
          <option value="interval">Every X Days</option>
        </select>
      </div>

      {formData.scheduleType === 'specific_days' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
            Days of Week
          </label>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  const days = formData.scheduleDays.includes(index)
                    ? formData.scheduleDays.filter((d) => d !== index)
                    : [...formData.scheduleDays, index];
                  setFormData({ ...formData, scheduleDays: days });
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.scheduleDays.includes(index)
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {formData.scheduleType === 'weekly' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
            Times per Week
          </label>
          <input
            type="number"
            value={formData.weeklyTarget}
            onChange={(e) => setFormData({ ...formData, weeklyTarget: parseInt(e.target.value) || 1 })}
            min="1"
            max="7"
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      {formData.scheduleType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
            Times per Month
          </label>
          <input
            type="number"
            value={formData.monthlyTarget}
            onChange={(e) => setFormData({ ...formData, monthlyTarget: parseInt(e.target.value) || 1 })}
            min="1"
            max="31"
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      {formData.scheduleType === 'interval' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
            Every X Days
          </label>
          <input
            type="number"
            value={formData.intervalDays}
            onChange={(e) => setFormData({ ...formData, intervalDays: parseInt(e.target.value) || 1 })}
            min="1"
            className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Organization (Optional)
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
          Group
        </label>
        <select
          value={formData.groupId || ''}
          onChange={(e) => setFormData({ ...formData, groupId: e.target.value || undefined })}
          className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">No Group</option>
          {state.groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.reminderEnabled}
            onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
            className="w-5 h-5 rounded accent-accent"
          />
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            Enable Reminder
          </span>
        </label>
      </div>

      {formData.reminderEnabled && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
              Reminder Time
            </label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-bg-tertiary-light dark:border-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smartReminder}
                onChange={(e) => setFormData({ ...formData, smartReminder: e.target.checked })}
                className="w-5 h-5 rounded accent-accent"
              />
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Smart reminder (adjusts based on completion patterns)
              </span>
            </label>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {!isEditing && (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-accent' : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark'
              }`}
            />
          ))}
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[400px]">
        {isEditing ? (
          <div className="space-y-6">
            {renderStep1()}
            {renderStep2()}
            {renderStep3()}
            {renderStep4()}
          </div>
        ) : (
          <>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {!isEditing && step > 1 && (
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onCancel}
          fullWidth={isEditing || step === 1}
        >
          Cancel
        </Button>

        {!isEditing && step < 4 ? (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
            fullWidth
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isStepValid()}
            fullWidth
          >
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HabitForm;
