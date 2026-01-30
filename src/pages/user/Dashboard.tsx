import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COMPANY_INFO } from '@/lib/constants';
import { Loader2, Bus, User, Calendar, LogOut, Home } from 'lucide-react';

export default function UserDashboard() {
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Bus className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-xl">{COMPANY_INFO.name}</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {profile?.name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">My Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                My Profile
              </CardTitle>
              <CardDescription>View and manage your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {profile?.name || 'Not set'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Bookings
              </CardTitle>
              <CardDescription>View your travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have no bookings yet.
              </p>
              <Link to="/rentals">
                <Button className="mt-4 w-full" variant="outline">
                  Book a Vehicle
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Explore our services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/rentals" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Browse Vehicles
                </Button>
              </Link>
              <Link to="/trekking" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Explore Treks
                </Button>
              </Link>
              <Link to="/contact" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
