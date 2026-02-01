import { Link, useLocation } from 'react-router-dom';
import { Home, Car, Mountain, Info, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rentals', label: 'Rentals', icon: Car },
  { href: '/trekking', label: 'Treks', icon: Mountain },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      {/* Safe area padding for iOS */}
      <div className="pb-safe">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] transition-all duration-300",
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-300",
                  active && "bg-primary/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    active && "scale-110"
                  )} strokeWidth={active ? 2.5 : 2} />
                  {active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  active ? "font-semibold" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
