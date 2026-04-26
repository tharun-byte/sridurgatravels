import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Loader2, Eye, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BOOKING_STATUSES } from '@/lib/constants';

const PAGE_SIZE = 50;

type Booking = Tables<'bookings'>;
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export default function BookingList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const { data: bookingsResult, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, typeFilter, page],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as BookingStatus);
      }
      if (typeFilter !== 'all') {
        query = query.eq('booking_type', typeFilter as 'vehicle' | 'trek');
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: data ?? [], count: count ?? 0 };
    },
    placeholderData: (prev) => prev,
  });

  const bookings = bookingsResult?.data ?? [];
  const totalCount = bookingsResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Notes saved successfully' });
      setSelectedBooking(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Error saving notes', description: error.message, variant: 'destructive' });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Booking deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting booking', description: error.message, variant: 'destructive' });
    },
  });

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.customer_name.toLowerCase().includes(query) ||
      booking.customer_email.toLowerCase().includes(query) ||
      booking.customer_phone.includes(query)
    );
  });

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(0); // reset to first page on filter change
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = BOOKING_STATUSES[status];
    const colorMap: Record<string, string> = {
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      success: 'bg-green-100 text-green-800 border-green-300',
      destructive: 'bg-red-100 text-red-800 border-red-300',
      muted: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return (
      <Badge className={colorMap[statusConfig.color] || colorMap.muted}>
        {statusConfig.label}
      </Badge>
    );
  };

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Booking Management</h2>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} total booking{totalCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="trek">Trek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {booking.booking_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(booking.travel_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => 
                            updateStatusMutation.mutate({ id: booking.id, status: value as BookingStatus })
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {booking.total_price ? `₹${booking.total_price.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openBookingDetails(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setBookingToDelete(booking.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages} ({totalCount} bookings)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View and manage booking information
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
                  <p className="font-medium">{selectedBooking.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedBooking.customer_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">{selectedBooking.customer_phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Booking Type</label>
                  <p className="font-medium capitalize">{selectedBooking.booking_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Travel Date</label>
                  <p className="font-medium">{format(new Date(selectedBooking.travel_date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Passengers</label>
                  <p className="font-medium">{selectedBooking.num_passengers}</p>
                </div>
                {selectedBooking.pickup_location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pickup Location</label>
                    <p className="font-medium">{selectedBooking.pickup_location}</p>
                  </div>
                )}
                {selectedBooking.drop_location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Drop Location</label>
                    <p className="font-medium">{selectedBooking.drop_location}</p>
                  </div>
                )}
              </div>
              {selectedBooking.special_requirements && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Special Requirements</label>
                  <p className="font-medium">{selectedBooking.special_requirements}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this booking..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => updateNotesMutation.mutate({ id: selectedBooking.id, notes: adminNotes })}
                  disabled={updateNotesMutation.isPending}
                >
                  {updateNotesMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Booking Alert */}
      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this booking. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bookingToDelete) {
                  deleteBookingMutation.mutate(bookingToDelete);
                  setBookingToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
