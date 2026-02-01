import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const upcomingTrips = [
  {
    id: 1,
    name: 'Gokarna Beach Trek',
    destination: 'Gokarna',
    date: 'Every Weekend',
    image: '/images/treks/gokarna-beach.jpg',
    price: 3299,
    slots: 'Limited',
    duration: '2 Days',
    badge: 'Popular',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 2,
    name: 'Kodachadri Trek',
    destination: 'Shivamogga',
    date: 'Every Weekend',
    image: '/images/treks/kodachadri-trek.jpg',
    price: 3299,
    slots: 'Available',
    duration: '2 Days',
    badge: 'Best Seller',
    badgeColor: 'bg-emerald-500',
  },
  {
    id: 3,
    name: 'Coorg Weekend Tour',
    destination: 'Coorg',
    date: 'Every Weekend',
    image: '/images/treks/coorg-tour.jpg',
    price: 4499,
    slots: 'Filling Fast',
    duration: '2 Days',
    badge: 'Trending',
    badgeColor: 'bg-primary',
  },
];

export function UpcomingTripsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />

      <div className="container px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Don't Miss Out
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Upcoming <span className="text-primary">Adventures</span>
            </h2>
          </div>
          <Link to="/trekking" className="hidden md:block">
            <Button variant="outline" className="group">
              View All Trips
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {upcomingTrips.map((trip, index) => (
            <Link
              key={trip.id}
              to="/trekking"
              className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 ${trip.badgeColor} rounded-full text-white text-xs font-semibold`}>
                  {trip.badge}
                </div>

                {/* Duration */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {trip.duration}
                </div>

                {/* Price overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="text-white/70 text-xs mb-0.5">Starting from</div>
                  <div className="text-2xl font-bold text-white">
                    ₹{trip.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="font-heading font-bold text-lg md:text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                  {trip.name}
                </h3>

                <div className="space-y-2.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span className={trip.slots === 'Limited' || trip.slots === 'Filling Fast' ? 'text-orange-500 font-medium' : ''}>
                      {trip.slots} Slots
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full group/btn bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                  Book Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-8 md:hidden">
          <Link to="/trekking">
            <Button variant="outline" className="group">
              View All Trips
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
