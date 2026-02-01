import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bus, Mountain, Car, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PageBanner {
  id: string;
  page_slug: string;
  page_name: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
}

const defaultSlides = [
  {
    image: '/images/hero/hero-bus.jpg',
    title: 'Book Regular & AC Buses Online',
    subtitle: 'Comfortable travel for groups of all sizes with experienced drivers',
    cta: 'Reserve Your Bus Today',
    href: '/rentals',
    icon: Bus,
    label: 'Bus Rentals',
  },
  {
    image: '/images/hero/hero-trekking.jpg',
    title: 'Exciting Trekking Trips & Packages',
    subtitle: 'Adventure awaits! Explore the Western Ghats with expert guides',
    cta: 'Book Your Trek Now',
    href: '/trekking',
    icon: Mountain,
    label: 'Trekking',
  },
  {
    image: '/images/hero/hero-cars.jpg',
    title: 'Affordable 5-Seater Car Rentals',
    subtitle: 'Premium cars for family trips, airport transfers and outstation journeys',
    cta: 'Explore Car Rentals',
    href: '/rentals',
    icon: Car,
    label: 'Car Rentals',
  },
];

const slideConfig = [
  { slug: 'home-1', icon: Bus, label: 'Bus Rentals', cta: 'Reserve Your Bus Today', href: '/rentals' },
  { slug: 'home-2', icon: Mountain, label: 'Trekking', cta: 'Book Your Trek Now', href: '/trekking' },
  { slug: 'home-3', icon: Car, label: 'Car Rentals', cta: 'Explore Car Rentals', href: '/rentals' },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners from database
  const { data: bannerData } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_banners')
        .select('*')
        .in('page_slug', ['home-1', 'home-2', 'home-3'])
        .order('page_slug');
      
      if (error) throw error;
      return data as PageBanner[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Convert database banners to slides format, fallback to defaults
  const slides = bannerData && bannerData.length > 0
    ? bannerData.map((banner, index) => {
        const config = slideConfig[index] || slideConfig[0];
        return {
          image: banner.image_url || defaultSlides[index]?.image || '/images/hero/hero-bus.jpg',
          title: banner.title || defaultSlides[index]?.title || '',
          subtitle: banner.subtitle || defaultSlides[index]?.subtitle || '',
          cta: config.cta,
          href: config.href,
          icon: config.icon,
          label: config.label,
        };
      })
    : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[90vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 hero-overlay" />
          
          {/* Floating sparkles */}
          <Sparkles className="absolute top-20 right-20 h-8 w-8 text-primary/50 animate-float opacity-60" />
          <Sparkles className="absolute bottom-40 left-20 h-6 w-6 text-primary/40 animate-float" style={{ animationDelay: '1s' }} />
          
          <div className="relative container h-full flex items-center">
            <div className={cn(
              "max-w-2xl transition-all duration-700 delay-300",
              index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <p className="text-primary font-medium mb-2 italic animate-fade-in">Adventure Awaits</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-4 leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-hero-foreground/90 mb-8 drop-shadow-lg">
                {slide.subtitle}
              </p>
              <Link to={slide.href}>
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 group transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95"
                >
                  {slide.cta}
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Icon Navigation at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Icon Buttons */}
            <div className="flex items-center gap-8 md:gap-16">
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                const isActive = index === currentSlide;
                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "flex flex-col items-center gap-2 transition-all duration-500 group",
                      isActive ? "scale-105" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-lg transition-all duration-500",
                      isActive 
                        ? "text-primary bg-primary/10 shadow-lg shadow-primary/30" 
                        : "text-hero-foreground group-hover:text-primary/80 group-hover:bg-white/5"
                    )}>
                      <Icon className={cn(
                        "h-8 w-8 md:h-10 md:w-10 transition-transform duration-300",
                        isActive && "animate-pulse-soft"
                      )} strokeWidth={1.5} />
                    </div>
                    <span className={cn(
                      "text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      isActive ? "text-primary" : "text-hero-foreground group-hover:text-primary/80"
                    )}>
                      {slide.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Arrow Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-hero-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-hero-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
