import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import type { Testimonial } from '@/types/database';
import { DEFAULT_TESTIMONIALS } from '@/lib/constants';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      setTestimonials(DEFAULT_TESTIMONIALS.map((t, i) => ({
        id: `default-${i}`,
        ...t,
        avatar_url: null,
        is_featured: true,
        created_at: new Date().toISOString(),
      })));
    } else {
      setTestimonials(data as Testimonial[]);
    }
  };

  const handleChange = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const next = () => handleChange((currentIndex + 1) % testimonials.length);
  const prev = () => handleChange((currentIndex - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-10 h-6 w-6 text-primary/30 animate-pulse-soft" />
        <Sparkles className="absolute bottom-20 right-10 h-8 w-8 text-primary/20 animate-float" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-1/2 left-1/4 h-4 w-4 text-primary/25 animate-pulse-soft" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-primary animate-pulse-soft">Customers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our happy customers have to say about their experience with us.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Card className="border-none shadow-2xl shadow-primary/10 bg-card/90 backdrop-blur-sm overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
            {/* Animated border glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl" />
            </div>
            
            <CardContent className="p-8 md:p-12 relative">
              {/* Large quote icon with animation */}
              <div className="relative">
                <Quote className="h-16 w-16 text-primary/10 mb-6 transition-all duration-500 group-hover:text-primary/20 group-hover:scale-110" />
                <Sparkles className="absolute top-0 right-0 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-soft" />
              </div>
              
              {/* Testimonial content with smooth transition */}
              <div 
                key={currentIndex}
                className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
              >
                <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex]?.content}"
                </p>
                
                <div className="flex items-center gap-4">
                  {/* Avatar with glow effect */}
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/30 transition-all duration-300 group-hover/avatar:border-primary/50 group-hover/avatar:scale-110">
                      <span className="font-heading font-bold text-primary text-xl">
                        {testimonials[currentIndex]?.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-heading font-bold text-lg transition-colors duration-300 group-hover:text-primary">
                      {testimonials[currentIndex]?.name}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: testimonials[currentIndex]?.rating || 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 fill-primary text-primary transition-all duration-300 hover:scale-125" 
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {testimonials.length > 1 && (
            <>
              {/* Navigation buttons with enhanced styling */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow-lg border-primary/30 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                onClick={prev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full shadow-lg border-primary/30 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                onClick={next}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Enhanced dots indicator */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleChange(index)}
                    className={`relative h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                      index === currentIndex 
                        ? 'w-8 bg-primary shadow-lg shadow-primary/50' 
                        : 'w-3 bg-muted-foreground/30 hover:bg-primary/50'
                    }`}
                  >
                    {index === currentIndex && (
                      <span className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
