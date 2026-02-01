import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, CalendarDays, Users, IndianRupee, Mountain } from 'lucide-react';
import { toast } from 'sonner';
import { format, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface TrekDate {
  id: string;
  trek_id: string;
  available_date: string;
  max_participants: number;
  current_bookings: number;
  price_override: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface Trek {
  id: string;
  name: string;
  price_per_person: number;
}

export default function TrekDatesManager() {
  const queryClient = useQueryClient();
  const [selectedTrekId, setSelectedTrekId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [maxParticipants, setMaxParticipants] = useState('20');
  const [priceOverride, setPriceOverride] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch all treks
  const { data: treks } = useQuery({
    queryKey: ['admin-treks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treks')
        .select('id, name, price_per_person')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Trek[];
    },
  });

  // Fetch trek dates for selected trek
  const { data: trekDates, isLoading: loadingDates } = useQuery({
    queryKey: ['trek-dates', selectedTrekId],
    queryFn: async () => {
      if (!selectedTrekId) return [];
      const { data, error } = await supabase
        .from('trek_dates')
        .select('*')
        .eq('trek_id', selectedTrekId)
        .order('available_date', { ascending: true });
      if (error) throw error;
      return data as TrekDate[];
    },
    enabled: !!selectedTrekId,
  });

  // Add new date mutation
  const addDateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTrekId || !selectedDate) throw new Error('Please select a trek and date');
      
      const { error } = await supabase.from('trek_dates').insert({
        trek_id: selectedTrekId,
        available_date: format(selectedDate, 'yyyy-MM-dd'),
        max_participants: parseInt(maxParticipants) || 20,
        price_override: priceOverride ? parseFloat(priceOverride) : null,
        notes: notes.trim() || null,
        is_active: true,
      });
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('This date is already added for this trek');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trek-dates', selectedTrekId] });
      setSelectedDate(undefined);
      setPriceOverride('');
      setNotes('');
      toast.success('Trek date added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete date mutation
  const deleteDateMutation = useMutation({
    mutationFn: async (dateId: string) => {
      const { error } = await supabase.from('trek_dates').delete().eq('id', dateId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trek-dates', selectedTrekId] });
      toast.success('Trek date deleted');
    },
    onError: () => {
      toast.error('Failed to delete date');
    },
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('trek_dates')
        .update({ is_active: !is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trek-dates', selectedTrekId] });
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const selectedTrek = treks?.find(t => t.id === selectedTrekId);

  // Get dates that are already added for highlighting in calendar
  const existingDates = trekDates?.map(d => new Date(d.available_date + 'T00:00:00')) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-bold">Trek Dates Manager</h2>
        <p className="text-muted-foreground">Manage available dates for each trek package</p>
      </div>

      {/* Trek Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            Select Trek Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTrekId} onValueChange={setSelectedTrekId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Choose a trek to manage dates" />
            </SelectTrigger>
            <SelectContent>
              {treks?.map((trek) => (
                <SelectItem key={trek.id} value={trek.id}>
                  {trek.name} (₹{trek.price_per_person}/person)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTrekId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Available Date
              </CardTitle>
              <CardDescription>
                Select a date and configure availability for {selectedTrek?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <div className="mt-2 border rounded-lg p-3 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    modifiers={{
                      booked: existingDates,
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '50%' },
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Dates highlighted in primary color are already added
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    min="1"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="priceOverride">Price Override (Optional)</Label>
                  <Input
                    id="priceOverride"
                    type="number"
                    value={priceOverride}
                    onChange={(e) => setPriceOverride(e.target.value)}
                    placeholder={`Default: ₹${selectedTrek?.price_per_person || 0}`}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Special holiday trek, limited spots"
                  className="mt-1.5"
                />
              </div>

              <Button
                className="w-full"
                onClick={() => addDateMutation.mutate()}
                disabled={!selectedDate || addDateMutation.isPending}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {addDateMutation.isPending ? 'Adding...' : 'Add Date'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Dates List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Scheduled Dates
              </CardTitle>
              <CardDescription>
                {trekDates?.length || 0} dates configured for this trek
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDates ? (
                <p>Loading...</p>
              ) : !trekDates || trekDates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No dates added yet</p>
                  <p className="text-sm">Use the calendar to add available dates</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Spots</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trekDates.map((date) => {
                        const isPast = isBefore(new Date(date.available_date + 'T00:00:00'), startOfDay(new Date()));
                        return (
                          <TableRow key={date.id} className={isPast ? 'opacity-50' : ''}>
                            <TableCell className="font-medium">
                              {format(new Date(date.available_date + 'T00:00:00'), 'dd MMM yyyy')}
                              {isPast && <Badge variant="secondary" className="ml-2 text-xs">Past</Badge>}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {date.current_bookings}/{date.max_participants}
                              </span>
                            </TableCell>
                            <TableCell>
                              {date.price_override ? (
                                <span className="flex items-center text-primary">
                                  <IndianRupee className="h-3 w-3" />
                                  {date.price_override}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Default</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActiveMutation.mutate({ id: date.id, is_active: date.is_active })}
                              >
                                <Badge variant={date.is_active ? 'default' : 'secondary'}>
                                  {date.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Date</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this date? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteDateMutation.mutate(date.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
