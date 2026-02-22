import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TREK_DIFFICULTIES, DEFAULT_TREKS } from '@/lib/constants';
import type { Trek, TrekDifficulty } from '@/types/database';
import { Clock, Mountain, MapPin, IndianRupee, Check, X, ArrowLeft, Backpack, Calendar, Info, Star } from 'lucide-react';

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
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: 'Duration', value: trek.duration, show: true },
                { icon: Mountain, label: 'Altitude', value: trek.altitude, show: !!trek.altitude },
                { icon: MapPin, label: 'Distance', value: trek.distance, show: !!trek.distance },
                { icon: IndianRupee, label: 'Price/Person', value: `₹${trek.price_per_person.toLocaleString('en-IN')}`, show: true },
              ].filter(c => c.show).map((card, i) => (
                <Card key={i} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardContent className="pt-4 text-center">
                    <card.icon className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="font-semibold">{card.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            {trek.description && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-heading font-bold mb-4">About This Trek</h2>
                <p className="text-muted-foreground leading-relaxed">{trek.description}</p>
              </div>
            )}

            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-5 flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" /> Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {trek.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-5 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" /> Day-wise Itinerary
                </h2>
                <div className="relative pl-6 border-l-2 border-primary/20">
                  <Accordion type="single" collapsible defaultValue="day-0" className="space-y-3">
                    {trek.itinerary.map((day, index) => (
                      <AccordionItem
                        key={index}
                        value={`day-${index}`}
                        className="border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[calc(1.5rem+5px)] top-4 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                          <div className="flex items-center gap-3 text-left">
                            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                              Day {day.day}
                            </span>
                            <span className="font-semibold text-sm">{day.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="pl-[calc(2.5rem+0.75rem)] space-y-2 text-sm text-muted-foreground leading-relaxed">
                            {day.description.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              {trek.inclusions && trek.inclusions.length > 0 && (
                <Card className="overflow-hidden border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-success to-success/50" />
                  <CardHeader>
                    <CardTitle className="text-lg text-success flex items-center gap-2">
                      <Check className="h-5 w-5" /> What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {trek.inclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-sm hover:translate-x-1 transition-transform duration-200">
                        <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {trek.exclusions && trek.exclusions.length > 0 && (
                <Card className="overflow-hidden border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="h-1 bg-gradient-to-r from-destructive to-destructive/50" />
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive flex items-center gap-2">
                      <X className="h-5 w-5" /> What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {trek.exclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-sm hover:translate-x-1 transition-transform duration-200">
                        <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Things to Carry */}
            {trek.things_to_carry && trek.things_to_carry.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-5 flex items-center gap-2">
                  <Backpack className="h-6 w-6 text-warning" /> Things to Carry
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {trek.things_to_carry.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-warning/30 bg-warning/5 text-sm hover:bg-warning/15 hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default"
                    >
                      <Check className="h-3.5 w-3.5 text-warning" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notes */}
            {trek.important_notes && (
              <Card className="border-l-4 border-l-primary bg-primary/5 border-border/50">
                <CardContent className="flex gap-4 pt-6">
                  <Info className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2">Important Notes</h3>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                      {trek.important_notes.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-primary/30 hover:shadow-xl transition-shadow duration-300">
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
