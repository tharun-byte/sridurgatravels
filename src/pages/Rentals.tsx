import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageBanner } from '@/components/layout/PageBanner';
import { VehicleCard } from '@/components/home/VehicleCard';
import { CTASection } from '@/components/home/CTASection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_VEHICLES, VEHICLE_TYPES } from '@/lib/constants';
import type { Vehicle, VehicleType } from '@/types/database';
import { Car, Bus } from 'lucide-react';
import rentalsBanner from '@/assets/banners/rentals-banner.jpg';

const Rentals = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data } = await supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('is_active', true)
      .order('capacity', { ascending: true });

    if (data && data.length > 0) {
      setVehicles(data.map(v => ({ 
        ...v, 
        images: v.vehicle_images,
        features: Array.isArray(v.features) ? v.features as string[] : [],
      })) as Vehicle[]);
    } else {
      // Use defaults
      setVehicles(DEFAULT_VEHICLES.map((v, i) => ({
        id: `default-${i}`,
        ...v,
        type: v.type as VehicleType,
        description: v.description || null,
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [{ id: `img-${i}`, vehicle_id: `default-${i}`, url: v.image, is_primary: true, display_order: 0, created_at: new Date().toISOString() }],
      })) as Vehicle[]);
    }
  };

  const filterVehicles = (type: string) => {
    if (type === 'all') return vehicles;
    if (type === 'cars') return vehicles.filter(v => v.type === 'car');
    if (type === 'buses') return vehicles.filter(v => v.type !== 'car');
    return vehicles.filter(v => v.type === type);
  };

  const filteredVehicles = filterVehicles(activeTab);

  return (
    <Layout>
      {/* Hero Section */}
      <PageBanner
        pageSlug="rentals"
        defaultImage={rentalsBanner}
        defaultTitle="Cars & Bus Rentals"
        defaultSubtitle="Choose from our wide range of well-maintained vehicles for any occasion"
        height="lg"
      />

      {/* Filters & Vehicles */}
      <section className="section-padding">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-6 md:mb-8 overflow-x-auto px-2">
              <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg gap-1 min-w-max">
                <TabsTrigger value="all" className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">
                  All
                </TabsTrigger>
                <TabsTrigger value="cars" className="px-3 py-2 text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cars</span>
                </TabsTrigger>
                <TabsTrigger value="tempo_traveller" className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">
                  <span className="sm:hidden">TT</span>
                  <span className="hidden sm:inline">Tempo Travellers</span>
                </TabsTrigger>
                <TabsTrigger value="mini_bus" className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">
                  <span className="sm:hidden">Mini</span>
                  <span className="hidden sm:inline">Mini Buses</span>
                </TabsTrigger>
                <TabsTrigger value="buses" className="px-3 py-2 text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5">
                  <Bus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Coaches</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No vehicles found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} showBookButton />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our <span className="text-primary">Pricing Structure</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden charges. All packages include driver and fuel.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="font-heading font-bold text-lg mb-3 text-primary">Local Package</h3>
              <p className="text-muted-foreground text-sm mb-4">
                8 hours / 80 km limit. Perfect for city travel, weddings, and local events.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Base fare as per vehicle type</li>
                <li>• Extra hour charges apply after 8 hours</li>
                <li>• Extra km charges apply after 80 km</li>
              </ul>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="font-heading font-bold text-lg mb-3 text-primary">Outstation</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Daily km allowance included. Ideal for weekend trips and pilgrimages.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Per day rate with km allowance</li>
                <li>• Driver bata as per vehicle type</li>
                <li>• Toll, parking, permit extra</li>
              </ul>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="font-heading font-bold text-lg mb-3 text-primary">Full Day Package</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Extended hours package for full-day events and longer journeys.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 12+ hours usage</li>
                <li>• Extended km allowance</li>
                <li>• Driver meals included</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Rentals;
