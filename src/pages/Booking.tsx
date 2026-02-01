import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, CheckCircle, Bus, Mountain } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  customer_email: z.string().trim().email('Invalid email address').max(255),
  customer_phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15),
  pickup_location: z.string().trim().max(200).optional(),
  drop_location: z.string().trim().max(200).optional(),
  num_passengers: z.number().min(1).max(100),
  special_requirements: z.string().trim().max(500).optional(),
});

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bookingType = searchParams.get('type') as 'vehicle' | 'trek' | null;
  const itemId = searchParams.get('id');
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_location: '',
    drop_location: '',
    travel_date: undefined as Date | undefined,
    return_date: undefined as Date | undefined,
    num_passengers: 1,
    special_requirements: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch vehicle if booking vehicle
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', itemId],
    queryFn: async () => {
      if (!itemId || bookingType !== 'vehicle') return null;
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(*)')
        .eq('id', itemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!itemId && bookingType === 'vehicle',
  });

  // Fetch trek if booking trek
  const { data: trek } = useQuery({
    queryKey: ['trek', itemId],
    queryFn: async () => {
      if (!itemId || bookingType !== 'trek') return null;
      const { data, error } = await supabase
        .from('treks')
        .select('*, trek_images(*)')
        .eq('id', itemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!itemId && bookingType === 'trek',
  });

  // Fetch all vehicles for selection
  const { data: vehicles } = useQuery({
    queryKey: ['all-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, type, capacity')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all treks for selection
  const { data: treks } = useQuery({
    queryKey: ['all-treks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treks')
        .select('id, name, destination, price_per_person')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const [selectedType, setSelectedType] = useState<'vehicle' | 'trek'>(bookingType || 'vehicle');
  const [selectedItemId, setSelectedItemId] = useState<string>(itemId || '');

  useEffect(() => {
    if (bookingType) setSelectedType(bookingType);
    if (itemId) setSelectedItemId(itemId);
  }, [bookingType, itemId]);

  const createBookingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const bookingData = {
        booking_type: selectedType,
        vehicle_id: selectedType === 'vehicle' ? selectedItemId : null,
        trek_id: selectedType === 'trek' ? selectedItemId : null,
        customer_name: data.customer_name.trim(),
        customer_email: data.customer_email.trim(),
        customer_phone: data.customer_phone.trim(),
        pickup_location: data.pickup_location?.trim() || null,
        drop_location: data.drop_location?.trim() || null,
        travel_date: data.travel_date ? format(data.travel_date, 'yyyy-MM-dd') : null,
        return_date: data.return_date ? format(data.return_date, 'yyyy-MM-dd') : null,
        num_passengers: data.num_passengers,
        special_requirements: data.special_requirements?.trim() || null,
        status: 'pending' as const,
      };

      const { error } = await supabase.from('bookings').insert(bookingData);
      if (error) throw error;
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: 'Booking Submitted!',
        description: 'We will contact you shortly to confirm your booking.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    try {
      bookingSchema.parse({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        num_passengers: formData.num_passengers,
        special_requirements: formData.special_requirements,
      });

      if (!formData.travel_date) {
        setErrors({ travel_date: 'Please select a travel date' });
        return false;
      }

      if (!selectedItemId) {
        setErrors({ item: 'Please select a vehicle or trek' });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createBookingMutation.mutate(formData);
    }
  };

  const selectedItem = selectedType === 'vehicle' ? vehicle : trek;
  const itemName = vehicle?.name || trek?.name || '';

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your booking request. Our team will contact you shortly to confirm your reservation.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/')}>Back to Home</Button>
                <Button variant="outline" onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    customer_name: '',
                    customer_email: '',
                    customer_phone: '',
                    pickup_location: '',
                    drop_location: '',
                    travel_date: undefined,
                    return_date: undefined,
                    num_passengers: 1,
                    special_requirements: '',
                  });
                }}>
                  New Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Banner */}
      <section className="relative h-[300px] bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hero/90 to-hero/70" />
        <div className="relative container h-full flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-hero-foreground mb-4">
              Book Your Journey
            </h1>
            <p className="text-xl text-hero-foreground/90">
              {itemName ? `Booking: ${itemName}` : 'Choose a vehicle or trek package'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedType === 'vehicle' ? <Bus className="h-5 w-5" /> : <Mountain className="h-5 w-5" />}
                  Select Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={selectedType === 'vehicle' ? 'default' : 'outline'}
                    className="h-20 flex-col gap-2"
                    onClick={() => {
                      setSelectedType('vehicle');
                      setSelectedItemId('');
                    }}
                  >
                    <Bus className="h-6 w-6" />
                    Vehicle Rental
                  </Button>
                  <Button
                    type="button"
                    variant={selectedType === 'trek' ? 'default' : 'outline'}
                    className="h-20 flex-col gap-2"
                    onClick={() => {
                      setSelectedType('trek');
                      setSelectedItemId('');
                    }}
                  >
                    <Mountain className="h-6 w-6" />
                    Trek Package
                  </Button>
                </div>

                <div>
                  <Label>Select {selectedType === 'vehicle' ? 'Vehicle' : 'Trek Package'}</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={`Choose a ${selectedType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedType === 'vehicle' ? (
                        vehicles?.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} ({v.capacity} seater)
                          </SelectItem>
                        ))
                      ) : (
                        treks?.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} - {t.destination} (₹{t.price_per_person}/person)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.item && <p className="text-sm text-destructive mt-1">{errors.item}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                    {errors.customer_name && <p className="text-sm text-destructive mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                    {errors.customer_email && <p className="text-sm text-destructive mt-1">{errors.customer_email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                    {errors.customer_phone && <p className="text-sm text-destructive mt-1">{errors.customer_phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="passengers">Number of Passengers *</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min={1}
                      max={100}
                      value={formData.num_passengers}
                      onChange={(e) => setFormData({ ...formData, num_passengers: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Travel Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !formData.travel_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.travel_date ? format(formData.travel_date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.travel_date}
                          onSelect={(date) => setFormData({ ...formData, travel_date: date })}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.travel_date && <p className="text-sm text-destructive mt-1">{errors.travel_date}</p>}
                  </div>

                  <div>
                    <Label>Return Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !formData.return_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.return_date ? format(formData.return_date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.return_date}
                          onSelect={(date) => setFormData({ ...formData, return_date: date })}
                          disabled={(date) => date < (formData.travel_date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {selectedType === 'vehicle' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input
                        id="pickup"
                        value={formData.pickup_location}
                        onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                        placeholder="Enter pickup address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="drop">Drop Location</Label>
                      <Input
                        id="drop"
                        value={formData.drop_location}
                        onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
                        placeholder="Enter drop address"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.special_requirements}
                    onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                    placeholder="Any special requests or requirements..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Booking Request'
              )}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
