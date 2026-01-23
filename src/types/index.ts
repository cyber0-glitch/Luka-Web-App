export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  type: 'good' | 'bad';

  goal: {
    value: number;
    unit: 'count' | 'minutes' | 'hours' | 'steps' | 'ml' | 'km' | 'calories' | 'custom';
    customUnitName?: string;
  };

  schedule: {
    type: 'daily' | 'specific_days' | 'weekly' | 'monthly' | 'interval' | 'specific_dates';
    days?: number[];
    weeklyTarget?: number;
    monthlyTarget?: number;
    intervalDays?: number;
    specificDates?: string[];
  };

  groupId?: string;
  sortOrder: number;

  createdAt: string;
  archivedAt?: string;

  reminder?: {
    enabled: boolean;
    time: string;
    smartReminder: boolean;
  };
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  value: number;
  status: 'completed' | 'partial' | 'missed' | 'skipped';
  note?: string;
  completedAt?: string;
}

export interface HabitGroup {
  id: string;
  name: string;
  color?: string;
  sortOrder: number;
  collapsed: boolean;
}

export interface Task {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high'; // Green, Yellow, Red
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  dueTime?: string; // Time string (HH:MM)
}

export interface Achievement {
  id: string;
  habitId: string;
  type: 'streak' | 'total' | 'perfect_week' | 'perfect_month' | 'first_completion';
  milestone: number;
  unlockedAt: string;
  celebrated: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  darkModeStyle: 'true_black' | 'gray';
  weekStartsOn: 0 | 1;
  showCompletedAtBottom: boolean;
  hideCompletedHabits: boolean;
  confettiEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  habitReminderTime: string; // Time string (HH:MM)
  taskReminderTime: string; // Time string (HH:MM)
}

export interface AppState {
  habits: Habit[];
  logs: HabitLog[];
  groups: HabitGroup[];
  tasks: Task[];
  achievements: Achievement[];
  settings: UserSettings;
  selectedDate: string;
  ui: {
    activeModal: string | null;
    selectedHabitId: string | null;
  };
}

export type AppAction =
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ARCHIVE_HABIT'; payload: string }
  | { type: 'LOG_PROGRESS'; payload: HabitLog }
  | { type: 'UPDATE_LOG'; payload: HabitLog }
  | { type: 'DELETE_LOG'; payload: string }
  | { type: 'ADD_GROUP'; payload: HabitGroup }
  | { type: 'UPDATE_GROUP'; payload: HabitGroup }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'CLEANUP_COMPLETED_TASKS' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'MARK_ACHIEVEMENT_CELEBRATED'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_ACTIVE_MODAL'; payload: string | null }
  | { type: 'SET_SELECTED_HABIT_ID'; payload: string | null }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

export interface HabitTemplate {
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'good' | 'bad';
  goal: {
    value: number;
    unit: 'count' | 'minutes' | 'hours' | 'steps' | 'ml' | 'km' | 'calories' | 'custom';
    customUnitName?: string;
  };
  schedule: {
    type: 'daily' | 'specific_days' | 'weekly' | 'monthly' | 'interval' | 'specific_dates';
    days?: number[];
    weeklyTarget?: number;
  };
  category: 'health' | 'productivity' | 'wellness' | 'self-care';
}
