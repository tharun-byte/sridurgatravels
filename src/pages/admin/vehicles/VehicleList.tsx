import { useState, useEffect } from 'react';
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
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, name, type, capacity, base_price, is_active, is_featured')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch vehicles');
    } else {
      setVehicles(data as VehicleRow[]);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('vehicles')
      .update({ is_active: !currentValue })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update vehicle');
    } else {
      setVehicles(vehicles.map(v => 
        v.id === id ? { ...v, is_active: !currentValue } : v
      ));
      toast.success(`Vehicle ${!currentValue ? 'activated' : 'deactivated'}`);
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('vehicles')
      .update({ is_featured: !currentValue })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update vehicle');
    } else {
      setVehicles(vehicles.map(v => 
        v.id === id ? { ...v, is_featured: !currentValue } : v
      ));
      toast.success(`Vehicle ${!currentValue ? 'featured' : 'unfeatured'}`);
    }
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete vehicle');
    } else {
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Vehicle deleted successfully');
    }
  };

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
          <CardTitle>All Vehicles ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No vehicles added yet</p>
              <Link to="/admin/vehicles/new">
                <Button>Add Your First Vehicle</Button>
              </Link>
            </div>
          ) : (
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
                        onCheckedChange={() => toggleFeatured(vehicle.id, vehicle.is_featured)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={vehicle.is_active}
                        onCheckedChange={() => toggleActive(vehicle.id, vehicle.is_active)}
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
                                onClick={() => deleteVehicle(vehicle.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
