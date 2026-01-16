import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTimeStore } from '../../store/timeStore';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

export const Totals: React.FC = () => {
  const { entries, getGrandTotal } = useTimeStore();
  
  const totalHours = getGrandTotal();
  const totalEntries = entries.length;
  const avgHours = totalEntries > 0 ? totalHours / totalEntries : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{totalEntries}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Average per Entry</p>
              <p className="text-2xl font-bold">{avgHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};