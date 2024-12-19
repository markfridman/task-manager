import { format, parseISO, addDays as addDaysFns } from 'date-fns';
export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy HH:mm');
};

export const addDays = (date: Date | string, days: number): Date => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return addDaysFns(dateObject, days);
};
