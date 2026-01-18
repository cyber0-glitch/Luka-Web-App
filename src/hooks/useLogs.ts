import { useApp } from '../contexts/AppContext';
import { HabitLog } from '../types';

export const useLogs = () => {
  const { state, dispatch } = useApp();

  const logProgress = (log: HabitLog) => {
    dispatch({ type: 'LOG_PROGRESS', payload: log });
  };

  const updateLog = (log: HabitLog) => {
    dispatch({ type: 'UPDATE_LOG', payload: log });
  };

  const deleteLog = (logId: string) => {
    dispatch({ type: 'DELETE_LOG', payload: logId });
  };

  const createLog = (
    habitId: string,
    date: string,
    value: number,
    status: 'completed' | 'partial' | 'missed' | 'skipped',
    note?: string
  ): HabitLog => {
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      habitId,
      date,
      value,
      status,
      note,
      completedAt: new Date().toISOString(),
    };
  };

  const getLogForDate = (habitId: string, date: string) => {
    return state.logs.find(l => l.habitId === habitId && l.date === date);
  };

  const getLogsForHabit = (habitId: string) => {
    return state.logs
      .filter(l => l.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getLogsForDate = (date: string) => {
    return state.logs.filter(l => l.date === date);
  };

  return {
    logs: state.logs,
    logProgress,
    updateLog,
    deleteLog,
    createLog,
    getLogForDate,
    getLogsForHabit,
    getLogsForDate,
  };
};
