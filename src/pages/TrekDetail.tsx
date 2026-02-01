import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TREK_DIFFICULTIES, DEFAULT_TREKS } from '@/lib/constants';
import type { Trek, TrekDifficulty } from '@/types/database';
import { Clock, Mountain, MapPin, IndianRupee, Check, X, ArrowLeft, Backpack } from 'lucide-react';

const difficultyColors: Record<TrekDifficulty, string> = {
  easy: 'bg-success text-success-foreground',
  moderate: 'bg-warning text-warning-foreground',
  challenging: 'bg-primary text-primary-foreground',
  difficult: 'bg-destructive text-destructive-foreground',
};

export default function TrekDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trek, isLoading } = useQuery({
    queryKey: ['trek', id],
    queryFn: async () => {
      // Check if it's a default trek
      if (id?.startsWith('default-')) {
        const index = parseInt(id.replace('default-', ''));
        const t = DEFAULT_TREKS[index];
        if (t) {
          return {
            id,
            ...t,
            difficulty: t.difficulty as TrekDifficulty,
            distance: t.distance || null,
            description: t.description || null,
            altitude: t.altitude || null,
            itinerary: [],
            inclusions: [],
            exclusions: [],
            things_to_carry: [],
            important_notes: null,
            is_featured: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: [{ id: `img-${index}`, trek_id: id, url: t.image, is_primary: true, display_order: 0, created_at: new Date().toISOString() }],
          } as Trek;
        }
      }

      const { data, error } = await supabase
        .from('treks')
        .select('*, trek_images(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        images: data.trek_images,
        highlights: Array.isArray(data.highlights) ? data.highlights as string[] : [],
        itinerary: Array.isArray(data.itinerary) ? (data.itinerary as unknown as Trek['itinerary']) : [],
        inclusions: Array.isArray(data.inclusions) ? data.inclusions as string[] : [],
        exclusions: Array.isArray(data.exclusions) ? data.exclusions as string[] : [],
        things_to_carry: Array.isArray(data.things_to_carry) ? data.things_to_carry as string[] : [],
      } as Trek;
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

  if (!trek) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Trek not found</h1>
          <Button onClick={() => navigate('/trekking')}>Back to Trekking</Button>
        </div>
      </Layout>
    );
  }

  const primaryImage = trek.images?.find(img => img.is_primary)?.url || 
    trek.images?.[0]?.url || 
    '/images/hero/hero-trekking.jpg';

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={primaryImage} 
          alt={trek.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hero/90 via-hero/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-8">
          <Badge className={`${difficultyColors[trek.difficulty]} mb-3`}>
            {TREK_DIFFICULTIES[trek.difficulty]}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-hero-foreground mb-2">
            {trek.name}
          </h1>
          <p className="text-lg text-hero-foreground/90 flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {trek.destination}
          </p>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/trekking')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trekking
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{trek.duration}</p>
                </CardContent>
              </Card>
              {trek.altitude && (
                <Card>
                  <CardContent className="pt-4 text-center">
                    <Mountain className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Altitude</p>
                    <p className="font-semibold">{trek.altitude}</p>
                  </CardContent>
                </Card>
              )}
              {trek.distance && (
                <Card>
                  <CardContent className="pt-4 text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold">{trek.distance}</p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="pt-4 text-center">
                  <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Price/Person</p>
                  <p className="font-semibold">₹{trek.price_per_person.toLocaleString('en-IN')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {trek.description && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">About This Trek</h2>
                <p className="text-muted-foreground leading-relaxed">{trek.description}</p>
              </div>
            )}

            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Highlights</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {trek.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                      <Check className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              {trek.inclusions && trek.inclusions.length > 0 && (
                <Card className="border-success/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-success">What's Included</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {trek.inclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {trek.exclusions && trek.exclusions.length > 0 && (
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">What's Not Included</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {trek.exclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <X className="h-4 w-4 text-destructive flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Things to Carry */}
            {trek.things_to_carry && trek.things_to_carry.length > 0 && (
              <Card className="border-warning/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Backpack className="h-5 w-5 text-warning" />
                    Things to Carry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {trek.things_to_carry.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-warning flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-primary/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-4xl font-bold text-primary flex items-center justify-center">
                      <IndianRupee className="h-8 w-8" />
                      {trek.price_per_person.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => navigate(`/booking?type=trek&id=${trek.id}`)}
                  >
                    Book This Trek
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 48 hours before the trek
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
