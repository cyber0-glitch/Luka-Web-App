import { format, parseISO, isToday, isPast, isFuture, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  return format(d, 'EEEE, MMMM d');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const isDateToday = (dateString: string): boolean => {
  return isToday(parseISO(dateString));
};

export const isDatePast = (dateString: string): boolean => {
  return isPast(parseISO(dateString)) && !isDateToday(dateString);
};

export const isDateFuture = (dateString: string): boolean => {
  return isFuture(parseISO(dateString)) && !isDateToday(dateString);
};

export const getNextDay = (dateString: string): string => {
  return formatDate(addDays(parseISO(dateString), 1));
};

export const getPreviousDay = (dateString: string): string => {
  return formatDate(subDays(parseISO(dateString), 1));
};

export const getWeekDates = (date: Date | string, weekStartsOn: 0 | 1 = 0): string[] => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = startOfWeek(d, { weekStartsOn });
  const end = endOfWeek(d, { weekStartsOn });
  return eachDayOfInterval({ start, end }).map(formatDate);
};

export const getMonthDates = (date: Date | string): string[] => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = startOfMonth(d);
  const end = endOfMonth(d);
  return eachDayOfInterval({ start, end }).map(formatDate);
};

export const daysBetween = (startDate: string, endDate: string): number => {
  return differenceInDays(parseISO(endDate), parseISO(startDate));
};

export const getDayOfWeek = (dateString: string): number => {
  return parseISO(dateString).getDay();
};

export const isWeekend = (dateString: string): boolean => {
  const day = getDayOfWeek(dateString);
  return day === 0 || day === 6;
};
