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
import { Users, IndianRupee, Check, ArrowLeft, Clock, Route, Sparkles, Shield, Star, MapPin, Fuel } from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      if (id?.startsWith('default-')) {
        const index = parseInt(id.replace('default-', ''));
        const v = DEFAULT_VEHICLES[index];
        if (v) {
          return {
            id,
            ...v,
            type: v.type as VehicleType,
            description: v.description || null,
            local_package_price: (v as any).local_package_price || null,
            after_hrs_driver_bata: (v as any).after_hrs_driver_bata || null,
            outstation_per_km: (v as any).outstation_per_km || null,
            comfort: (v as any).comfort || null,
            trip_type: (v as any).trip_type || null,
            why_choose: (v as any).why_choose || [],
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
        why_choose: Array.isArray(data.why_choose) ? data.why_choose as string[] : [],
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

  const allImages = vehicle.images?.filter(img => img.url) || [];

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/rentals')}
          className="mb-6 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rentals
        </Button>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <img 
                src={primaryImage} 
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg">
                {VEHICLE_TYPES[vehicle.type as VehicleType]}
              </Badge>
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {allImages.slice(0, 3).map((img, i) => (
                  <div key={img.id} className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <img src={img.url} alt={`${vehicle.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info Header */}
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                {vehicle.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                  {vehicle.capacity} {vehicle.capacity <= 7 ? '+ Driver' : 'Seats'}
                </span>
                {vehicle.comfort && (
                  <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {vehicle.comfort}
                  </span>
                )}
                {vehicle.trip_type && (
                  <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                    {vehicle.trip_type}
                  </span>
                )}
              </div>
            </div>

            {vehicle.description && (
              <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
            )}

            {/* Package Details Table */}
            <Card className="border-border/50 overflow-hidden">
              <div className="bg-primary/10 px-5 py-3 border-b border-border/50">
                <h3 className="font-heading font-bold text-base flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  Package Details
                </h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <PricingRow 
                    label="Local Package (8hrs / 80km)" 
                    value={vehicle.base_price} 
                    isPrice 
                    highlight 
                  />
                  {vehicle.extra_hour_rate && (
                    <PricingRow label="Extra Hour" value={vehicle.extra_hour_rate} isPrice suffix="/hr" />
                  )}
                  {vehicle.extra_km_rate && (
                    <PricingRow label="Extra Km" value={vehicle.extra_km_rate} isPrice suffix="/km" />
                  )}
                  {vehicle.outstation_allowance && (
                    <PricingRow label="Outstation Limit" value={vehicle.outstation_allowance} />
                  )}
                  {vehicle.outstation_per_km && (
                    <PricingRow label="Outstation / Per Km" value={vehicle.outstation_per_km} isPrice suffix="/km" />
                  )}
                  {vehicle.driver_bata && (
                    <PricingRow label="O/S Driver Bata" value={vehicle.driver_bata} isPrice suffix="/day" />
                  )}
                  {vehicle.after_hrs_driver_bata && (
                    <PricingRow label="After Hrs Driver Bata" value={vehicle.after_hrs_driver_bata} isPrice suffix="/day" />
                  )}
                  {vehicle.local_package_price && (
                    <PricingRow label="Local Package (Short Trips)" value={vehicle.local_package_price} isPrice />
                  )}
                  {vehicle.full_day_price && (
                    <PricingRow label="Full Day Package" value={vehicle.full_day_price} isPrice />
                  )}
                  <div className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-muted-foreground">Seating Capacity</span>
                    <span className="font-semibold">{vehicle.capacity} {vehicle.capacity <= 7 ? '+ Driver' : 'Seats'}</span>
                  </div>
                  {vehicle.comfort && (
                    <div className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-muted-foreground">Comfort</span>
                      <span className="font-semibold">{vehicle.comfort}</span>
                    </div>
                  )}
                  {vehicle.trip_type && (
                    <div className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-muted-foreground">Trip Type</span>
                      <span className="font-semibold">{vehicle.trip_type}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Book Button */}
            <Button 
              size="lg" 
              className="w-full text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              onClick={() => navigate(`/booking?type=vehicle&id=${vehicle.id}`)}
            >
              Book This Vehicle
            </Button>
          </div>
        </div>

        {/* Why Choose Section */}
        {vehicle.why_choose && vehicle.why_choose.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              Why Choose {vehicle.name}?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {vehicle.why_choose.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              Features & Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-default"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {feature}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

function PricingRow({ label, value, isPrice, suffix, highlight }: { 
  label: string; 
  value: string | number; 
  isPrice?: boolean; 
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-muted/30 ${highlight ? 'bg-primary/5' : ''}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold flex items-center ${highlight ? 'text-primary text-base' : ''}`}>
        {isPrice && <IndianRupee className={`${highlight ? 'h-4 w-4' : 'h-3 w-3'}`} />}
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        {suffix && <span className="text-muted-foreground font-normal ml-0.5">{suffix}</span>}
      </span>
    </div>
  );
}
