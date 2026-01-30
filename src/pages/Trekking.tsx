import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TrekCard } from '@/components/home/TrekCard';
import { CTASection } from '@/components/home/CTASection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_TREKS, TREK_DIFFICULTIES } from '@/lib/constants';
import type { Trek, TrekDifficulty } from '@/types/database';
import { Mountain, MapPin, Compass } from 'lucide-react';

const Trekking = () => {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    const { data } = await supabase
      .from('treks')
      .select('*, trek_images(*)')
      .eq('is_active', true)
      .order('price_per_person', { ascending: true });

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
      // Use defaults
      setTreks(DEFAULT_TREKS.map((t, i) => ({
        id: `default-${i}`,
        ...t,
        difficulty: t.difficulty as TrekDifficulty,
        distance: t.distance || null,
        description: t.description || null,
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

  const filterTreks = (type: string) => {
    if (type === 'all') return treks;
    if (type === 'treks') return treks.filter(t => t.difficulty !== 'easy');
    if (type === 'tours') return treks.filter(t => t.difficulty === 'easy' && t.distance === 'Sightseeing');
    return treks.filter(t => t.difficulty === type);
  };

  const filteredTreks = filterTreks(activeTab);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero/hero-trekking.jpg)' }}
        >
          <div className="absolute inset-0 bg-hero/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Treks & Weekend Escapes</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore the Western Ghats with our guided trekking and tour packages
          </p>
        </div>
      </section>

      {/* Filters & Treks */}
      <section className="section-padding">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  All Packages
                </TabsTrigger>
                <TabsTrigger value="treks" className="flex items-center gap-2">
                  <Mountain className="h-4 w-4" />
                  Treks
                </TabsTrigger>
                <TabsTrigger value="tours" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Tours
                </TabsTrigger>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="moderate">Moderate</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {filteredTreks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No packages found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTreks.map((trek) => (
                    <TrekCard key={trek.id} trek={trek} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              What's <span className="text-primary">Included</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All our trekking packages include essential amenities for a hassle-free experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-xl border text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">🚐</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Transport</h3>
              <p className="text-sm text-muted-foreground">Pick-up & drop from Bangalore by tempo traveller or bus</p>
            </div>
            <div className="bg-background p-6 rounded-xl border text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">🏕️</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Accommodation</h3>
              <p className="text-sm text-muted-foreground">Camping or homestay based on package type</p>
            </div>
            <div className="bg-background p-6 rounded-xl border text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">🍽️</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Meals</h3>
              <p className="text-sm text-muted-foreground">2 breakfasts, 1 packed lunch, 1 dinner included</p>
            </div>
            <div className="bg-background p-6 rounded-xl border text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">🧭</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Guides & Permits</h3>
              <p className="text-sm text-muted-foreground">Experienced trek leads, local guides, and all permits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Things to Carry */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Things to <span className="text-primary">Carry</span>
            </h2>
          </div>
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">✓ ID proof (Aadhar/Driving License)</li>
                <li className="flex items-center gap-2">✓ Trekking shoes with good grip</li>
                <li className="flex items-center gap-2">✓ 2 sets of clothes</li>
                <li className="flex items-center gap-2">✓ Empty lunch box for packed lunch</li>
                <li className="flex items-center gap-2">✓ Water bottle (2L minimum)</li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">✓ Raincoat or poncho</li>
                <li className="flex items-center gap-2">✓ Torch with extra batteries</li>
                <li className="flex items-center gap-2">✓ Energy bars and snacks</li>
                <li className="flex items-center gap-2">✓ Sunscreen and sunglasses</li>
                <li className="flex items-center gap-2">✓ Personal medicines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Trekking;
