import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { COMPANY_INFO, NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-hero text-hero-foreground py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{COMPANY_INFO.email}</span>
            </a>
            <a href={`tel:${COMPANY_INFO.phones[0]}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{COMPANY_INFO.phones[0]}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-hero-foreground hover:text-primary">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{profile?.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-hero-foreground hover:text-primary">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-background border-b shadow-sm">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full py-2">
            <img 
              src={logo} 
              alt="Sri Durga Travels Logo" 
              className="h-full w-auto max-h-16 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Book Now CTA */}
          <div className="hidden lg:block">
            <Link to="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-md text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4 bg-primary text-primary-foreground">
                    Book Now
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
