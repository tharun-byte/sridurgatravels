import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bus, Mountain, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    image: '/images/hero/hero-bus.jpg',
    title: 'Book Regular & AC Buses Online',
    subtitle: 'Comfortable travel for groups of all sizes with experienced drivers',
    cta: 'Reserve Your Bus Today',
    href: '/rentals',
    icon: Bus,
    label: 'sleeper bus booking',
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
    label: 'Cars And Bus Rentals',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative container h-full flex items-center">
            <div className="max-w-2xl animate-slide-up">
              <p className="text-primary font-medium mb-2 italic">Adventure Awaits</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-hero-foreground/90 mb-8">
                {slide.subtitle}
              </p>
              <Link to={slide.href}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                  {slide.cta} »
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Icon Navigation at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
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
                      "flex flex-col items-center gap-2 transition-all duration-300 group",
                      isActive ? "scale-105" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-lg transition-colors",
                      isActive ? "text-primary" : "text-hero-foreground group-hover:text-primary/80"
                    )}>
                      <Icon className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
                    </div>
                    <span className={cn(
                      "text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                      isActive ? "text-primary" : "text-hero-foreground group-hover:text-primary/80"
                    )}>
                      {slide.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Arrow Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-hero-foreground transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-hero-foreground transition-colors"
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
