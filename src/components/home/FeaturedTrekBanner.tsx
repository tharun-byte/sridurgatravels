import { Link } from 'react-router-dom';
import { ArrowRight, Mountain, Compass, Shield, MapPin, Tent, Sunrise, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedTrekBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#0f172a]">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/treks/kodachadri-trek.jpg"
          alt="Trekking Adventure"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/50" />
      </div>

      {/* Subtle animated glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40">
              <Mountain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Adventure Awaits</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Discover the
              <span className="block text-primary mt-1">Western Ghats</span>
            </h2>

            <p className="text-slate-300 text-base md:text-lg max-w-lg leading-relaxed">
              Embark on unforgettable trekking adventures through Karnataka's most stunning landscapes. 
              From misty peaks to hidden waterfalls, we craft experiences that stay with you forever.
            </p>

            {/* Feature Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 py-4">
              <div className="text-center p-3 md:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-white/10">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg md:text-xl text-white">15+</div>
                <div className="text-xs text-slate-400">Destinations</div>
              </div>
              <div className="text-center p-3 md:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-white/10">
                <Compass className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg md:text-xl text-white">2K+</div>
                <div className="text-xs text-slate-400">Happy Trekkers</div>
              </div>
              <div className="text-center p-3 md:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all duration-300 hover:bg-white/10">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-lg md:text-xl text-white">100%</div>
                <div className="text-xs text-slate-400">Safe Treks</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/trekking">
                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 shadow-lg shadow-primary/25">
                  Explore Treks
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-white/10 hover:border-white/50 px-6 md:px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - What's Included Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-emerald-500/50 to-primary/50 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative p-6 md:p-8 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 max-w-sm shadow-2xl">
                <div className="space-y-5">
                  {/* Header */}
                  <div className="text-center pb-4 border-b border-slate-700">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-3">
                      <Tent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">What's Included</h3>
                    <p className="text-sm text-slate-400 mt-1">Every trek package comes with</p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {[
                      'Professional trek leaders & guides',
                      'All meals during the trek',
                      'Camping equipment & tents',
                      'Transport from Bangalore',
                      'First aid & safety equipment',
                      'Forest permits & entry fees',
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        </span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom Section */}
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Sunrise className="w-5 h-5 text-amber-400" />
                      <span className="text-sm text-slate-300">Weekend trips every week!</span>
                    </div>
                    <Link to="/trekking" className="block">
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg">
                        View All Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
