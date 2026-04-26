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
import { Plus, Pencil, Trash2, Users, IndianRupee, Star } from 'lucide-react';
import { VEHICLE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import type { VehicleType } from '@/types/database';

interface VehicleRow {
  id: string;
  name: string;
  type: VehicleType;
  capacity: number;
  base_price: number;
  is_active: boolean;
  is_featured: boolean;
}

export default function VehicleList() {
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading: loading } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, type, capacity, base_price, is_active, is_featured')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VehicleRow[];
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: boolean }) => {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: !currentValue })
        .eq('id', id);
      if (error) throw error;
      return { currentValue };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast.success(`Vehicle ${!data.currentValue ? 'activated' : 'deactivated'}`);
    },
    onError: () => {
      toast.error('Failed to update vehicle');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: boolean }) => {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_featured: !currentValue })
        .eq('id', id);
      if (error) throw error;
      return { currentValue };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast.success(`Vehicle ${!data.currentValue ? 'featured' : 'unfeatured'}`);
    },
    onError: () => {
      toast.error('Failed to update vehicle');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast.success('Vehicle deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete vehicle');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold">Vehicles</h2>
          <p className="text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Link to="/admin/vehicles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles ({vehicles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : !vehicles || vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No vehicles added yet</p>
              <Link to="/admin/vehicles/new">
                <Button>Add Your First Vehicle</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {VEHICLE_TYPES[vehicle.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {vehicle.capacity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {vehicle.base_price.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={vehicle.is_featured}
                          onCheckedChange={() => toggleFeaturedMutation.mutate({ id: vehicle.id, currentValue: vehicle.is_featured })}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={vehicle.is_active}
                          onCheckedChange={() => toggleActiveMutation.mutate({ id: vehicle.id, currentValue: vehicle.is_active })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/vehicles/${vehicle.id}`}>
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
                                <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{vehicle.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(vehicle.id)}
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
