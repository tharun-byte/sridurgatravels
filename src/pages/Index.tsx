import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { VehicleCard } from '@/components/home/VehicleCard';
import { TrekCard } from '@/components/home/TrekCard';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_VEHICLES, DEFAULT_TREKS } from '@/lib/constants';
import type { Vehicle, Trek } from '@/types/database';

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);

  useEffect(() => {
    fetchVehicles();
    fetchTreks();
  }, []);

  const fetchVehicles = async () => {
    const { data } = await supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(6);
    
    if (data && data.length > 0) {
      setVehicles(data.map(v => ({ ...v, images: v.vehicle_images })) as Vehicle[]);
    } else {
      // Use defaults with placeholder structure
      setVehicles(DEFAULT_VEHICLES.slice(0, 6).map((v, i) => ({
        id: `default-${i}`,
        ...v,
        type: v.type as any,
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [{ id: `img-${i}`, vehicle_id: `default-${i}`, url: v.image, is_primary: true, display_order: 0, created_at: new Date().toISOString() }],
      })) as Vehicle[]);
    }
  };

  const fetchTreks = async () => {
    const { data } = await supabase
      .from('treks')
      .select('*, trek_images(*)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(4);
    
    if (data && data.length > 0) {
      setTreks(data.map(t => ({ 
        ...t, 
        images: t.trek_images,
        highlights: Array.isArray(t.highlights) ? t.highlights as string[] : [],
        itinerary: Array.isArray(t.itinerary) ? (t.itinerary as unknown as Trek['itinerary']) : [],
        inclusions: Array.isArray(t.inclusions) ? t.inclusions as string[] : [],
        exclusions: Array.isArray(t.exclusions) ? t.exclusions as string[] : [],
        things_to_carry: Array.isArray(t.things_to_carry) ? t.things_to_carry as string[] : [],
      })) as Trek[]);
    } else {
      setTreks(DEFAULT_TREKS.slice(0, 4).map((t, i) => ({
        id: `default-${i}`,
        ...t,
        difficulty: t.difficulty as any,
        distance: t.distance || null,
        itinerary: [],
        inclusions: [],
        exclusions: [],
        things_to_carry: [],
        important_notes: null,
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [{ id: `img-${i}`, trek_id: `default-${i}`, url: t.image, is_primary: true, display_order: 0, created_at: new Date().toISOString() }],
      })) as Trek[]);
    }
  };

  return (
    <Layout>
      <HeroCarousel />
      
      {/* Bus Rental Packages */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Bus Rental Packages</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of well-maintained buses and tempo travellers for any occasion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/rentals">
              <Button size="lg" variant="outline">View All Vehicles</Button>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <StatsSection />

      {/* Trekking Packages */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Popular <span className="text-primary">Trekking Packages</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the Western Ghats with our guided trekking and tour packages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/trekking">
              <Button size="lg" variant="outline">View All Packages</Button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
