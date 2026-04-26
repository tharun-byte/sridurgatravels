import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, MapPin, IndianRupee } from 'lucide-react';
import { TREK_DIFFICULTIES } from '@/lib/constants';
import { toast } from 'sonner';
import type { TrekDifficulty } from '@/types/database';

const difficultyColors: Record<TrekDifficulty, string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  challenging: 'bg-orange-100 text-orange-800',
  difficult: 'bg-red-100 text-red-800',
};

interface TrekRow {
  id: string;
  name: string;
  destination: string;
  duration: string;
  difficulty: TrekDifficulty;
  price_per_person: number;
  is_active: boolean;
  is_featured: boolean;
}

export default function TrekList() {
  const queryClient = useQueryClient();

  const { data: treks, isLoading: loading } = useQuery({
    queryKey: ['admin-treks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treks')
        .select('id, name, destination, duration, difficulty, price_per_person, is_active, is_featured')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrekRow[];
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: boolean }) => {
      const { error } = await supabase
        .from('treks')
        .update({ is_active: !currentValue })
        .eq('id', id);
      if (error) throw error;
      return { currentValue };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-treks'] });
      toast.success(`Trek ${!data.currentValue ? 'activated' : 'deactivated'}`);
    },
    onError: () => {
      toast.error('Failed to update trek');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: boolean }) => {
      const { error } = await supabase
        .from('treks')
        .update({ is_featured: !currentValue })
        .eq('id', id);
      if (error) throw error;
      return { currentValue };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-treks'] });
      toast.success(`Trek ${!data.currentValue ? 'featured' : 'unfeatured'}`);
    },
    onError: () => {
      toast.error('Failed to update trek');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('treks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-treks'] });
      toast.success('Trek deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete trek');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold">Trekking Packages</h2>
          <p className="text-muted-foreground">Manage your trekking packages</p>
        </div>
        <Link to="/admin/treks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trek
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Treks ({treks?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : !treks || treks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No treks added yet</p>
              <Link to="/admin/treks/new">
                <Button>Add Your First Trek</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Price/Person</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treks.map((trek) => (
                    <TableRow key={trek.id}>
                      <TableCell className="font-medium">{trek.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {trek.destination}
                        </span>
                      </TableCell>
                      <TableCell>{trek.duration}</TableCell>
                      <TableCell>
                        <Badge className={difficultyColors[trek.difficulty]}>
                          {TREK_DIFFICULTIES[trek.difficulty]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {trek.price_per_person.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={trek.is_featured}
                          onCheckedChange={() => toggleFeaturedMutation.mutate({ id: trek.id, currentValue: trek.is_featured })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={trek.is_active}
                          onCheckedChange={() => toggleActiveMutation.mutate({ id: trek.id, currentValue: trek.is_active })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/treks/${trek.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Trek</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{trek.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(trek.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
