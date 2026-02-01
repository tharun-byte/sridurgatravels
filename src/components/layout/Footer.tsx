import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { NAV_LINKS, COMPANY_INFO } from '@/lib/constants';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import logoTransparent from '@/assets/logo-transparent.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  const companyName = settings?.companyName || COMPANY_INFO.name;
  const tagline = settings?.tagline || COMPANY_INFO.tagline;
  const email = settings?.email || COMPANY_INFO.email;
  const phones = settings?.phones?.length ? settings.phones : COMPANY_INFO.phones;
  const address = settings?.address || COMPANY_INFO.address;
  const facebookUrl = settings?.facebookUrl;
  const instagramUrl = settings?.instagramUrl;
  const twitterUrl = settings?.twitterUrl;
  const youtubeUrl = settings?.youtubeUrl;

  return (
    <footer className="bg-[#0a1628] text-white mb-16 lg:mb-0">
      <div className="container px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center">
              <img 
                src={logoTransparent} 
                alt={`${companyName} Logo`} 
                className="h-20 sm:h-28 md:h-40 w-auto"
              />
            </div>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              {tagline}. With over {COMPANY_INFO.experience} years of experience, 
              we provide reliable and comfortable travel solutions across South India.
            </p>
            <div className="flex gap-4">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                  <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
              {/* Show placeholder icons if no social links are set */}
              {!facebookUrl && !instagramUrl && !twitterUrl && !youtubeUrl && (
                <>
                  <span className="text-white/30">
                    <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                  <span className="text-white/30">
                    <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                  <span className="text-white/30">
                    <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                  <span className="text-white/30">
                    <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm md:text-lg mb-3 md:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary transition-colors text-xs md:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="hidden sm:block">
            <h4 className="font-heading font-bold text-sm md:text-lg mb-3 md:mb-4 text-white">Our Services</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-white/70">
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
            <h4 className="font-heading font-bold text-sm md:text-lg mb-3 md:mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-white/70">{address}</span>
              </li>
              {phones.slice(0, 2).map((phone, index) => (
                <li key={index} className="flex items-center gap-2 md:gap-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="text-xs md:text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-xs md:text-sm text-white/70 hover:text-primary transition-colors break-all"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-white/50 text-center">
              © {currentYear} {companyName}. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-white/50">
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
