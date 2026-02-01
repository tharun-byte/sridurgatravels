import { Link } from 'react-router-dom';
import { Mountain, Sunrise, Users, Camera, MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  {
    icon: Mountain,
    title: 'Western Ghats',
    description: 'Trek through UNESCO heritage biodiversity hotspots',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Sunrise,
    title: 'Sunrise Points',
    description: 'Witness breathtaking sunrises from mountain peaks',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: Users,
    title: 'Expert Guides',
    description: 'Experienced local guides who know every trail',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Camera,
    title: 'Photo Spots',
    description: 'Instagram-worthy locations at every trek',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: MapPin,
    title: '15+ Destinations',
    description: 'Choose from a variety of trek destinations',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Compass,
    title: 'All Skill Levels',
    description: 'Treks for beginners to experienced trekkers',
    color: 'from-cyan-500 to-sky-600',
  },
];

export function TrekHighlightsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
            Adventure Awaits
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Trek With <span className="text-primary">Us?</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Experience the thrill of trekking with Karnataka's most trusted adventure company
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="group relative p-5 md:p-6 lg:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative font-heading font-bold text-base md:text-lg lg:text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="relative text-muted-foreground text-xs md:text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rotate-45 transition-opacity duration-500`} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-14">
          <Link to="/trekking">
            <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Explore All Treks
              <Compass className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
