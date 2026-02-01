import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { COMPANY_INFO, NAV_LINKS } from '@/lib/constants';
import logoWhite from '@/assets/logo-white.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoWhite} 
                alt="Sri Durga Travels Logo" 
                className="h-14 w-auto"
              />
              <span className="font-heading font-bold text-xl text-white">{COMPANY_INFO.name}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {COMPANY_INFO.tagline}. With over {COMPANY_INFO.experience} years of experience, 
              we provide reliable and comfortable travel solutions across South India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Our Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/rentals" className="hover:text-primary transition-colors">
                  Bus Rentals
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="hover:text-primary transition-colors">
                  Car Rentals
                </Link>
              </li>
              <li>
                <Link to="/trekking" className="hover:text-primary transition-colors">
                  Trekking Packages
                </Link>
              </li>
              <li>
                <Link to="/trekking" className="hover:text-primary transition-colors">
                  Weekend Tours
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="hover:text-primary transition-colors">
                  Corporate Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">{COMPANY_INFO.address}</span>
              </li>
              {COMPANY_INFO.phones.map((phone, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-sm text-white/70 hover:text-primary transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              © {currentYear} {COMPANY_INFO.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/50">
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
