import { Link } from 'react-router-dom';
import { ArrowRight, Mountain, Clock, Users, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedTrekBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/treks/kudremukh-trek.jpg"
          alt="Kudremukh Trek"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Most Popular Trek</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Kudremukh
              <span className="block text-primary mt-1">Peak Trek</span>
            </h2>

            <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
              Conquer the horse-face peak at 1,894m altitude. Trek through pristine shola forests, 
              rolling grasslands, and witness panoramic views of the Western Ghats.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors">
                <Mountain className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg">1,894m</div>
                <div className="text-xs text-white/60">Altitude</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg">2 Days</div>
                <div className="text-xs text-white/60">Duration</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-colors">
                <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg">20 km</div>
                <div className="text-xs text-white/60">Distance</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/trekking">
                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8">
                  Book This Trek
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/trekking">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 md:px-8">
                  View All Treks
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Price Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-500 to-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-sm">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    Limited Slots Available
                  </div>
                  
                  <div className="py-4">
                    <div className="text-white/60 text-sm mb-1">Starting from</div>
                    <div className="text-4xl md:text-5xl font-bold text-white">
                      ₹3,899
                      <span className="text-lg font-normal text-white/60">/person</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-left text-white/80 text-sm">
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Professional trek leaders
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Meals & camping included
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Transport from Bangalore
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Safety equipment provided
                    </li>
                  </ul>

                  <Link to="/trekking" className="block pt-4">
                    <Button className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
