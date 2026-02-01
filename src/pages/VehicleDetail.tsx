import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VEHICLE_TYPES, DEFAULT_VEHICLES } from '@/lib/constants';
import type { Vehicle, VehicleType } from '@/types/database';
import { Users, IndianRupee, Check, ArrowLeft, Clock, Route } from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      // Check if it's a default vehicle
      if (id?.startsWith('default-')) {
        const index = parseInt(id.replace('default-', ''));
        const v = DEFAULT_VEHICLES[index];
        if (v) {
          return {
            id,
            ...v,
            type: v.type as VehicleType,
            description: v.description || null,
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: [{ id: `img-${index}`, vehicle_id: id, url: v.image, is_primary: true, display_order: 0, created_at: new Date().toISOString() }],
          } as Vehicle;
        }
      }

      const { data, error } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        images: data.vehicle_images,
        features: Array.isArray(data.features) ? data.features as string[] : [],
      } as Vehicle;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Button onClick={() => navigate('/rentals')}>Back to Rentals</Button>
        </div>
      </Layout>
    );
  }

  const primaryImage = vehicle.images?.find(img => img.is_primary)?.url || 
    vehicle.images?.[0]?.url || 
    '/placeholder.svg';

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/rentals')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rentals
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-[4/3] rounded-2xl overflow-hidden">
            <img 
              src={primaryImage} 
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {VEHICLE_TYPES[vehicle.type as VehicleType]}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                {vehicle.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-5 w-5 text-primary" />
                  {vehicle.capacity} Seats
                </span>
              </div>
            </div>

            {vehicle.description && (
              <p className="text-muted-foreground">{vehicle.description}</p>
            )}

            {/* Pricing Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Base Package (8hrs/80km)
                  </span>
                  <span className="text-2xl font-bold text-primary flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {vehicle.base_price.toLocaleString('en-IN')}
                  </span>
                </div>
                
                {vehicle.extra_hour_rate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Extra Hour Rate</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {vehicle.extra_hour_rate}/hr
                    </span>
                  </div>
                )}
                
                {vehicle.extra_km_rate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Extra Km Rate</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {vehicle.extra_km_rate}/km
                    </span>
                  </div>
                )}
                
                {vehicle.full_day_price && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Full Day Package</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {vehicle.full_day_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {vehicle.outstation_allowance && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Route className="h-4 w-4" /> Outstation Allowance
                    </span>
                    <span>{vehicle.outstation_allowance}</span>
                  </div>
                )}

                {vehicle.driver_bata && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Driver Bata</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {vehicle.driver_bata}/day
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-lg mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate(`/booking?type=vehicle&id=${vehicle.id}`)}
            >
              Book This Vehicle
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
