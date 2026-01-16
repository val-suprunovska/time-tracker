import { api } from './api';
import type { TimeEntry, CreateTimeEntryDto } from '../types/time-entry';

export const timeService = {
  getEntries: async (date?: string): Promise<TimeEntry[]> => {
    const params = date ? { date } : {};
    const response = await api.get('/api/entries', { params });

    // используем response.data.data
    if (!response.data || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data;
  },

  createEntry: async (entry: CreateTimeEntryDto): Promise<TimeEntry> => {
    const response = await api.post('/api/entries', entry);

    // возвращаем только объект записи
    return response.data.data;
  },

  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/api/entries/${id}`);
  }
};
