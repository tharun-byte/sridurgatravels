import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Car, Mountain, Calendar, Mail, TrendingUp, Users, Plus } from 'lucide-react';
import { BOOKING_STATUSES } from '@/lib/constants';
import { format } from 'date-fns';

interface DashboardStats {
  totalVehicles: number;
  totalTreks: number;
  pendingBookings: number;
  unreadMessages: number;
}

interface RecentBooking {
  id: string;
  customer_name: string;
  booking_type: 'vehicle' | 'trek';
  travel_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  created_at: string;
  is_read: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalTreks: 0,
    pendingBookings: 0,
    unreadMessages: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
    fetchRecentMessages();
  }, []);

  const fetchStats = async () => {
    const [vehiclesRes, treksRes, bookingsRes, messagesRes] = await Promise.all([
      supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('treks').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ]);

    setStats({
      totalVehicles: vehiclesRes.count || 0,
      totalTreks: treksRes.count || 0,
      pendingBookings: bookingsRes.count || 0,
      unreadMessages: messagesRes.count || 0,
    });
  };

  const fetchRecentBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('id, customer_name, booking_type, travel_date, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentBookings(data as RecentBooking[]);
    }
  };

  const fetchRecentMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('id, name, subject, created_at, is_read')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentMessages(data);
    }
  };

  const statCards = [
    {
      title: 'Active Vehicles',
      value: stats.totalVehicles,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/vehicles',
    },
    {
      title: 'Active Treks',
      value: stats.totalTreks,
      icon: Mountain,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/treks',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/admin/bookings',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/admin/messages',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back to your admin panel</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/vehicles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
          <Link to="/admin/treks/new">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Trek
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest booking requests</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.booking_type === 'vehicle' ? 'Vehicle' : 'Trek'} •{' '}
                        {format(new Date(booking.travel_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        booking.status === 'confirmed'
                          ? 'default'
                          : booking.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {BOOKING_STATUSES[booking.status].label}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/bookings">
              <Button variant="link" className="mt-4 p-0">
                View all bookings →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{message.name}</p>
                        {!message.is_read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.subject}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {format(new Date(message.created_at), 'MMM d')}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/messages">
              <Button variant="link" className="mt-4 p-0">
                View all messages →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
