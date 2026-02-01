import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Loader2, Bus, Mountain, Calendar, LogOut, Home, Phone, Mail, MapPin,
  User, Clock, ChevronRight, Image as ImageIcon, Settings, Star
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import logo from '@/assets/logo.png';

export default function UserDashboard() {
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('travel_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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

  const upcomingBookings = bookings?.filter(
    (b) => new Date(b.travel_date) >= new Date() && b.status !== 'cancelled'
  ) || [];

  const pastBookings = bookings?.filter(
    (b) => new Date(b.travel_date) < new Date() || b.status === 'completed'
  ) || [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return <Badge className={styles[status] || styles.pending} variant="outline">{status}</Badge>;
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email.slice(0, 2).toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Sri Durga Travels" className="h-10 w-auto" />
            <span className="font-heading font-bold text-lg hidden sm:inline">Sri Durga Travels</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{profile?.name || user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 mb-8">
          <div className="absolute inset-0 bg-[url('/images/hero/hero-bus.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Welcome back, {profile?.name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Ready for your next adventure? Book a vehicle or trek today!
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/rentals">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-medium text-sm">Book Vehicle</span>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/trekking">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                      <Mountain className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="font-medium text-sm">Book Trek</span>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/gallery">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                      <ImageIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="font-medium text-sm">View Gallery</span>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/contact">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="font-medium text-sm">Contact Us</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Bookings
                </CardTitle>
                <CardDescription>Your scheduled trips</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                    <div className="flex justify-center gap-2">
                      <Link to="/rentals">
                        <Button variant="outline" size="sm">Book a Vehicle</Button>
                      </Link>
                      <Link to="/trekking">
                        <Button variant="outline" size="sm">Explore Treks</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => {
                      const daysUntil = differenceInDays(new Date(booking.travel_date), new Date());
                      return (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              booking.booking_type === 'vehicle' ? 'bg-primary/10' : 'bg-green-100'
                            }`}>
                              {booking.booking_type === 'vehicle' ? (
                                <Bus className="h-6 w-6 text-primary" />
                              ) : (
                                <Mountain className="h-6 w-6 text-green-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{booking.booking_type} Booking</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.travel_date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(booking.status)}
                            {daysUntil >= 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {daysUntil === 0 ? 'Today!' : `${daysUntil} days left`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Past Bookings
                  </CardTitle>
                  <CardDescription>Your travel history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pastBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {booking.booking_type === 'vehicle' ? (
                              <Bus className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Mountain className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{booking.booking_type} Booking</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(booking.travel_date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Profile & Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-primary to-primary/80" />
              <CardContent className="-mt-10 pb-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials(profile?.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-heading font-bold text-lg mt-4">
                    {profile?.name || 'Traveler'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{bookings?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-green-600">{upcomingBookings.length}</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="bg-gradient-to-br from-muted to-muted/50">
              <CardContent className="p-6">
                <h4 className="font-heading font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is available 24/7 to assist you with your bookings.
                </p>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
