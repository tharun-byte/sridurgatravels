import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
          Contact us now for a free consultation and quote. Our team is available 24/7 to assist you with your travel needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Free Quote
            </Button>
          </Link>
          <a href={`tel:${COMPANY_INFO.phones[0]}`}>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
