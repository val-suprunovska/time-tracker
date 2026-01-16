import { create } from "zustand";
import type { TimeEntry, GroupedEntries } from "../types/time-entry";
import { timeService } from "../services/time.service";

interface TimeStore {
  entries: TimeEntry[];
  groupedEntries: GroupedEntries;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEntries: (date?: string) => Promise<void>;
  createEntry: (entry: Omit<TimeEntry, "id" | "createdAt">) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getDailyTotal: (date: string) => number;
  getGrandTotal: () => number;
}

export const useTimeStore = create<TimeStore>((set, get) => ({
  entries: [],
  groupedEntries: {},
  isLoading: false,
  error: null,

  fetchEntries: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const entries = await timeService.getEntries(date);
      set({
        entries: Array.isArray(entries) ? entries : [],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch entries";

      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  createEntry: async (entryData) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry = await timeService.createEntry(entryData);
      set((state) => ({
        entries: [
          newEntry,
          ...(Array.isArray(state.entries) ? state.entries : []),
        ],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create entry";

      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await timeService.deleteEntry(id);
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete entry";

      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  getGrandTotal: () => {
    const { entries } = get();
    if (!Array.isArray(entries)) return 0;
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
  },

  getDailyTotal: (date: string) => {
    const { entries } = get();
    if (!Array.isArray(entries)) return 0;
    const dayEntries = entries.filter((entry) => entry.date.startsWith(date));
    return dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
  },
}));
