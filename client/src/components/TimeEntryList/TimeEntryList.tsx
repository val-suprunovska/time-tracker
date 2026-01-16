import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Trash2, Filter, Calendar, Download } from 'lucide-react';
import { useTimeStore } from '../../store/timeStore';
import { formatDate, groupByDate, calculateDailyTotal } from '../../utils/date';
import { format } from 'date-fns';

export const TimeEntryList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entries, fetchEntries, deleteEntry, getGrandTotal, isLoading, error } = useTimeStore();
  const [filterDate, setFilterDate] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries(filterDate || undefined);
  }, [fetchEntries, filterDate]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteEntry(deleteId);
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const csv = entries.map(entry => 
      `${entry.date},${entry.project},${entry.hours},"${entry.description}"`
    ).join('\n');
    
    const blob = new Blob([`Date,Project,Hours,Description\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const groupedEntries = groupByDate(entries);

  if (isLoading && entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading entries...</div>
        </CardContent>
      </Card>
    );
  }

  // if (error) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6 text-center text-destructive">
  //         Error: {error}
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Entry History
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
            
            {filterDate && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterDate('')}
              >
                Clear
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No time entries found. Start by adding your first entry!
          </div>
        ) : (
          <>
            {Object.entries(groupedEntries).map(([date, dayEntries]) => (
              <div key={date} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {formatDate(date)}
                  </h3>
                  <Badge variant="secondary">
                    Daily Total: {calculateDailyTotal(dayEntries).toFixed(1)}h
                  </Badge>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.project}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.hours}h</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(entry.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the time entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Separator className="my-6" />
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} total
              </div>
              <div className="text-xl font-bold">
                Grand Total: <span className="text-primary">{getGrandTotal().toFixed(1)}h</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};