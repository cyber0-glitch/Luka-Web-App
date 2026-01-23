import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Task } from '../types';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

interface TasksProps {
  onBack: () => void;
}

const Tasks: React.FC<TasksProps> = ({ onBack }) => {
  const { state, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDueTime, setNewTaskDueTime] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const activeTasks = state.tasks.filter((t) => !t.completed);
  const completedTasks = state.tasks.filter((t) => t.completed);

  // Group tasks by either date or priority based on sortBy state
  const groupTasksBy = (tasks: Task[], groupBy: 'date' | 'priority') => {
    if (groupBy === 'priority') {
      return tasks.reduce((groups, task) => {
        const priority = task.priority;
        if (!groups[priority]) {
          groups[priority] = [];
        }
        groups[priority].push(task);
        return groups;
      }, {} as Record<string, Task[]>);
    } else {
      return tasks.reduce((groups, task) => {
        const date = task.createdAt.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(task);
        return groups;
      }, {} as Record<string, Task[]>);
    }
  };

  const groupedActiveTasks = groupTasksBy(activeTasks, sortBy);
  const groupedCompletedTasks = groupTasksBy(completedTasks, sortBy);

  // Sort keys based on grouping type
  const getGroupKeys = (grouped: Record<string, Task[]>) => {
    const keys = Object.keys(grouped);
    if (sortBy === 'priority') {
      // Priority order: high, medium, low
      return keys.sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a as 'high' | 'medium' | 'low'] - order[b as 'high' | 'medium' | 'low'];
      });
    } else {
      // Date order: newest first
      return keys.sort().reverse();
    }
  };

  const activeKeys = getGroupKeys(groupedActiveTasks);
  const completedKeys = getGroupKeys(groupedCompletedTasks);

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-error';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return priority;
    }
  };

  const getGroupHeader = (key: string) => {
    if (sortBy === 'priority') {
      return getPriorityLabel(key);
    } else {
      try {
        return format(parseISO(key), 'EEEE, MMMM d, yyyy');
      } catch {
        return key;
      }
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        text: newTaskText.trim(),
        priority: newTaskPriority,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: newTaskDueDate || undefined,
        dueTime: newTaskDueTime || undefined,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setNewTaskText('');
      setNewTaskPriority('low');
      setNewTaskDueDate('');
      setNewTaskDueTime('');
      setShowAddForm(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary-light/80 dark:bg-bg-primary-dark/80 backdrop-blur-lg border-b border-bg-tertiary-light dark:border-bg-tertiary-dark">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
              >
                <svg
                  className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Tasks
              </h1>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Add Task Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark"
          >
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              New Task
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What do you need to do?"
                className="w-full px-4 py-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                  Priority
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewTaskPriority('low')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                      newTaskPriority === 'low'
                        ? 'bg-success text-white'
                        : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setNewTaskPriority('medium')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                      newTaskPriority === 'medium'
                        ? 'bg-warning text-white'
                        : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setNewTaskPriority('high')}
                    className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                      newTaskPriority === 'high'
                        ? 'bg-error text-white'
                        : 'bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    High
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">
                    Due Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={newTaskDueTime}
                    onChange={(e) => setNewTaskDueTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTaskText('');
                    setNewTaskPriority('low');
                    setNewTaskDueDate('');
                    setNewTaskDueTime('');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-bg-tertiary-light dark:bg-bg-tertiary-dark text-text-primary-light dark:text-text-primary-dark hover:bg-bg-tertiary-light/80 dark:hover:bg-bg-tertiary-dark/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskText.trim()}
                  className="flex-1 px-6 py-3 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sort Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark p-1">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-accent text-white'
                  : 'text-text-primary-light dark:text-text-primary-dark'
              }`}
            >
              By Date
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'priority'
                  ? 'bg-accent text-white'
                  : 'text-text-primary-light dark:text-text-primary-dark'
              }`}
            >
              By Priority
            </button>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="space-y-6">
          {activeKeys.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                No tasks yet. Tap the + button to add one!
              </p>
            </div>
          )}

          {activeKeys.map((key) => (
            <div key={key}>
              <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">
                {getGroupHeader(key)}
              </h3>
              <div className="space-y-2">
                {groupedActiveTasks[key].map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark"
                  >
                    {/* Priority Indicator */}
                    <div
                      className={`w-1 h-12 rounded-full flex-shrink-0 ${getPriorityColor(
                        task.priority
                      )}`}
                    />

                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="w-6 h-6 rounded-lg border-2 border-text-secondary-light dark:border-text-secondary-dark flex items-center justify-center hover:border-accent transition-colors flex-shrink-0"
                    >
                      {task.completed && (
                        <svg
                          className="w-4 h-4 text-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Task Text */}
                    <div className="flex-1">
                      <p
                        className={`text-text-primary-light dark:text-text-primary-dark ${
                          task.completed ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {task.text}
                      </p>
                      {(task.dueDate || task.dueTime) && (
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                          Due: {task.dueDate && format(parseISO(task.dueDate), 'MMM d, yyyy')}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-xl hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark transition-colors flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark mb-4"
            >
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Completed ({completedTasks.length})
              </h3>
              <svg
                className={`w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark transition-transform ${
                  showCompleted ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showCompleted && (
              <div className="space-y-6">
                {completedKeys.map((key) => (
                  <div key={key}>
                    <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      {getGroupHeader(key)}
                    </h3>
                    <div className="space-y-2">
                      {groupedCompletedTasks[key].map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark opacity-60"
                        >
                          {/* Priority Indicator */}
                          <div
                            className={`w-1 h-12 rounded-full flex-shrink-0 ${getPriorityColor(
                              task.priority
                            )}`}
                          />

                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="w-6 h-6 rounded-lg border-2 border-accent flex items-center justify-center flex-shrink-0"
                          >
                            <svg
                              className="w-4 h-4 text-accent"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Task Text */}
                          <p className="flex-1 text-text-primary-light dark:text-text-primary-dark line-through">
                            {task.text}
                          </p>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 rounded-xl hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark transition-colors flex-shrink-0"
                          >
                            <svg
                              className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info about auto-deletion */}
        {completedTasks.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              💡 Completed tasks are automatically deleted after 1 week
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
