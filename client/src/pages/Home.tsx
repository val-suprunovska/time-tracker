import React, { useEffect } from 'react';
import { TimeForm } from '../components/TimeForm/TimeForm';
import { TimeEntryList } from '../components/TimeEntryList/TimeEntryList';
import { Totals } from '../components/Totals/Totals';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { useTimeStore } from '../store/timeStore';
import { Timer } from 'lucide-react';

export const Home: React.FC = () => {
  const { fetchEntries } = useTimeStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"> < Timer className="h-7 w-7"/>Time Tracker</h1>
              <p className="text-muted-foreground">Track your work hours across different projects</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* форма */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TimeForm />
              <div className="mt-6">
                <Totals />
              </div>
            </div>
          </div>

          {/* история */}
          <div className="lg:col-span-2">
            <TimeEntryList />
          </div>
        </div>
      </main>
    </div>
  );
};