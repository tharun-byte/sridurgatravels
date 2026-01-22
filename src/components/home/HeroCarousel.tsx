import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    image: '/images/hero/hero-bus.jpg',
    title: 'Book Regular & AC Buses Online',
    subtitle: 'Comfortable travel for groups of all sizes with experienced drivers',
    cta: 'Reserve Your Bus Today',
    href: '/rentals',
  },
  {
    image: '/images/hero/hero-cars.jpg',
    title: 'Affordable 5-Seater Car Rentals',
    subtitle: 'Premium cars for family trips, airport transfers and outstation journeys',
    cta: 'Explore Car Rentals',
    href: '/rentals',
  },
  {
    image: '/images/hero/hero-trekking.jpg',
    title: 'Exciting Trekking & Tour Packages',
    subtitle: 'Adventure awaits! Explore the Western Ghats with expert guides',
    cta: 'View Trekking Packages',
    href: '/trekking',
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-hero-foreground/90 mb-8">
                {slide.subtitle}
              </p>
              <Link to={slide.href}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 text-hero-foreground transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 text-hero-foreground transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              index === currentSlide ? "bg-primary" : "bg-hero-foreground/50 hover:bg-hero-foreground/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
