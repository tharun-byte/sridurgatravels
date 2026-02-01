import { Link } from 'react-router-dom';
import { Phone, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Sparkle decorations */}
      <Sparkles className="absolute top-10 left-10 h-8 w-8 text-primary-foreground/30 animate-pulse-soft" />
      <Sparkles className="absolute bottom-10 right-10 h-6 w-6 text-primary-foreground/20 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
      <Sparkles className="absolute top-1/2 right-20 h-4 w-4 text-primary-foreground/25 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10 text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 text-primary-foreground animate-fade-in-up">
          Ready to Start Your Journey?
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-10 text-lg md:text-xl animate-fade-in-up stagger-1 opacity-0-start">
          Contact us now for a free consultation and quote. Our team is available 24/7 to assist you with your travel needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2 opacity-0-start">
          <Link to="/contact">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 group transition-all duration-300 hover:shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95"
            >
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <a href={`tel:${COMPANY_INFO.phones[0]}`}>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 hover:shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95 group"
            >
              <Phone className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Call Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
