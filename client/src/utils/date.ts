import { format, parseISO } from "date-fns";
import type { TimeEntry, GroupedEntries } from "../types/time-entry";

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), "MMM dd, yyyy");
};

export const formatDateForInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};


export const groupByDate = (entries: TimeEntry[]): GroupedEntries => {
  const grouped: GroupedEntries = {};

  entries.forEach(entry => {
    if (!entry.date) {
      console.warn('Skipping entry with undefined date', entry);
      return; // пропускаем некорректные записи
    }

    const dateObj = parseISO(entry.date); 
    const dateKey = format(dateObj, 'yyyy-MM-dd'); // ключ для группировки

    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  });

  return grouped;
};

export const calculateDailyTotal = (entries: TimeEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
};
