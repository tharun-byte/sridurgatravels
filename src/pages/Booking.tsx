import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, CheckCircle, Bus, Mountain, Plus, Trash2, User, Users, MapPin, Clock, IndianRupee } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';

// Person schema for trek booking
interface TrekPerson {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
}

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  customer_email: z.string().trim().email('Invalid email address').max(255),
  customer_phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15),
});

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bookingType = searchParams.get('type') as 'vehicle' | 'trek' | null;
  const itemId = searchParams.get('id');
  
  const [selectedType, setSelectedType] = useState<'vehicle' | 'trek'>(bookingType || 'vehicle');
  const [selectedItemId, setSelectedItemId] = useState<string>(itemId || '');
  
  // Primary contact form data
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_requirements: '',
  });
  
  // Vehicle-specific fields
  const [vehicleData, setVehicleData] = useState({
    trip_type: 'local' as 'local' | 'outstation' | 'airport',
    pickup_location: '',
    drop_location: '',
    travel_date: undefined as Date | undefined,
    return_date: undefined as Date | undefined,
    num_days: 1,
    travel_time: '',
  });
  
  // Trek-specific fields - travelers list
  const [trekPersons, setTrekPersons] = useState<TrekPerson[]>([
    { id: '1', name: '', age: '', gender: '', phone: '' }
  ]);
  const [trekDate, setTrekDate] = useState<Date | undefined>(undefined);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch vehicle if booking vehicle
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', selectedItemId],
    queryFn: async () => {
      if (!selectedItemId || selectedType !== 'vehicle') return null;
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(*)')
        .eq('id', selectedItemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedItemId && selectedType === 'vehicle',
  });

  // Fetch trek if booking trek
  const { data: trek } = useQuery({
    queryKey: ['trek', selectedItemId],
    queryFn: async () => {
      if (!selectedItemId || selectedType !== 'trek') return null;
      const { data, error } = await supabase
        .from('treks')
        .select('*, trek_images(*)')
        .eq('id', selectedItemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedItemId && selectedType === 'trek',
  });

  // Fetch all vehicles for selection
  const { data: vehicles } = useQuery({
    queryKey: ['all-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, type, capacity, base_price')
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
        .select('id, name, destination, price_per_person, duration')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch available dates for the selected trek
  const { data: availableTrekDates } = useQuery({
    queryKey: ['trek-available-dates', selectedItemId],
    queryFn: async () => {
      if (!selectedItemId || selectedType !== 'trek') return [];
      const { data, error } = await supabase
        .from('trek_dates')
        .select('id, available_date, max_participants, current_bookings, price_override')
        .eq('trek_id', selectedItemId)
        .eq('is_active', true)
        .gte('available_date', format(new Date(), 'yyyy-MM-dd'))
        .order('available_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedItemId && selectedType === 'trek',
  });

  useEffect(() => {
    if (bookingType) setSelectedType(bookingType);
    if (itemId) setSelectedItemId(itemId);
  }, [bookingType, itemId]);

  // Add a new person for trek
  const addPerson = () => {
    setTrekPersons([
      ...trekPersons,
      { id: Date.now().toString(), name: '', age: '', gender: '', phone: '' }
    ]);
  };

  // Remove a person
  const removePerson = (id: string) => {
    if (trekPersons.length > 1) {
      setTrekPersons(trekPersons.filter(p => p.id !== id));
    }
  };

  // Update person details
  const updatePerson = (id: string, field: keyof TrekPerson, value: string) => {
    setTrekPersons(trekPersons.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      // Build special requirements with person details for trek
      let specialReq = formData.special_requirements?.trim() || '';
      
      if (selectedType === 'trek') {
        const personDetails = trekPersons.map((p, i) => 
          `Person ${i + 1}: ${p.name}, Age: ${p.age}, Gender: ${p.gender}, Phone: ${p.phone || 'N/A'}`
        ).join('\n');
        specialReq = `--- Traveler Details ---\n${personDetails}\n\n${specialReq ? '--- Additional Notes ---\n' + specialReq : ''}`;
      } else {
        specialReq = `Trip Type: ${vehicleData.trip_type}\n${vehicleData.travel_time ? 'Pickup Time: ' + vehicleData.travel_time + '\n' : ''}Number of Days: ${vehicleData.num_days}\n\n${specialReq ? '--- Additional Notes ---\n' + specialReq : ''}`;
      }

      const travelDate = selectedType === 'trek' ? trekDate : vehicleData.travel_date;

      const bookingData = {
        booking_type: selectedType,
        vehicle_id: selectedType === 'vehicle' ? selectedItemId : null,
        trek_id: selectedType === 'trek' ? selectedItemId : null,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
        pickup_location: selectedType === 'vehicle' ? vehicleData.pickup_location?.trim() || null : null,
        drop_location: selectedType === 'vehicle' ? vehicleData.drop_location?.trim() || null : null,
        travel_date: travelDate ? format(travelDate, 'yyyy-MM-dd') : null,
        return_date: selectedType === 'vehicle' && vehicleData.return_date ? format(vehicleData.return_date, 'yyyy-MM-dd') : null,
        num_passengers: selectedType === 'trek' ? trekPersons.length : 1,
        special_requirements: specialReq || null,
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
      // Fire-and-forget notification (doesn't block or affect UX)
      const travelDate = selectedType === 'trek' ? trekDate : vehicleData.travel_date;
      supabase.functions.invoke('send-notification', {
        body: {
          type: 'new_booking',
          data: {
            userEmail: formData.customer_email.trim(),
            customerName: formData.customer_name.trim(),
            customerPhone: formData.customer_phone.trim(),
            bookingType: selectedType,
            serviceName: selectedType === 'vehicle'
              ? vehicles?.find(v => v.id === selectedItemId)?.name ?? 'Vehicle Rental'
              : treks?.find(t => t.id === selectedItemId)?.name ?? 'Trek Package',
            travelDate: travelDate ? format(travelDate, 'dd MMM yyyy') : 'TBD',
            passengers: selectedType === 'trek' ? trekPersons.length : 1,
            specialRequirements: formData.special_requirements?.trim() || null,
            // Vehicle-specific fields
            ...(selectedType === 'vehicle' && {
              pickupLocation: vehicleData.pickup_location?.trim() || null,
              dropLocation: vehicleData.drop_location?.trim() || null,
              tripType: vehicleData.trip_type || null,
              travelTime: vehicleData.travel_time || null,
              returnDate: vehicleData.return_date ? format(vehicleData.return_date, 'dd MMM yyyy') : null,
              numDays: vehicleData.num_days || null,
            }),
            // Trek-specific fields
            ...(selectedType === 'trek' && trekPersons.length > 0 && {
              travelersInfo: trekPersons.map((p, i) =>
                `${i + 1}. ${p.name} — Age: ${p.age}, Gender: ${p.gender}, Phone: ${p.phone || 'N/A'}`
              ).join('\n'),
            }),
          },
        },
      }).catch(() => { /* silent */ });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      bookingSchema.parse({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
    }

    if (!selectedItemId) {
      newErrors.item = 'Please select a vehicle or trek';
    }

    if (selectedType === 'trek') {
      if (!trekDate) {
        newErrors.travel_date = 'Please select a travel date';
      }
      // Validate each person
      trekPersons.forEach((person, index) => {
        if (!person.name.trim()) {
          newErrors[`person_${index}_name`] = 'Name is required';
        }
        if (!person.age.trim()) {
          newErrors[`person_${index}_age`] = 'Age is required';
        }
        if (!person.gender) {
          newErrors[`person_${index}_gender`] = 'Gender is required';
        }
      });
    } else {
      if (!vehicleData.travel_date) {
        newErrors.travel_date = 'Please select a travel date';
      }
      if (!vehicleData.pickup_location.trim()) {
        newErrors.pickup_location = 'Pickup location is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createBookingMutation.mutate();
    }
  };

  const selectedVehicle = vehicles?.find(v => v.id === selectedItemId);
  const selectedTrek = treks?.find(t => t.id === selectedItemId);

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
                    special_requirements: '',
                  });
                  setTrekPersons([{ id: '1', name: '', age: '', gender: '', phone: '' }]);
                  setVehicleData({
                    trip_type: 'local',
                    pickup_location: '',
                    drop_location: '',
                    travel_date: undefined,
                    return_date: undefined,
                    num_days: 1,
                    travel_time: '',
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
      <section className="relative h-[250px] md:h-[300px] bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hero/90 to-hero/70" />
        <div className="relative container h-full flex items-center px-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-hero-foreground mb-2 md:mb-4">
              Book Your Journey
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/90">
              {selectedType === 'vehicle' 
                ? (selectedVehicle ? `Booking: ${selectedVehicle.name}` : 'Book a vehicle for your trip')
                : (selectedTrek ? `Booking: ${selectedTrek.name}` : 'Book a trek package')
              }
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container max-w-4xl px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedType === 'vehicle' ? <Bus className="h-5 w-5 text-primary" /> : <Mountain className="h-5 w-5 text-primary" />}
                  Select Service Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={selectedType === 'vehicle' ? 'default' : 'outline'}
                    className="h-16 md:h-20 flex-col gap-1 md:gap-2"
                    onClick={() => {
                      setSelectedType('vehicle');
                      if (bookingType !== 'vehicle') setSelectedItemId('');
                    }}
                  >
                    <Bus className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="text-xs md:text-sm">Vehicle Rental</span>
                  </Button>
                  <Button
                    type="button"
                    variant={selectedType === 'trek' ? 'default' : 'outline'}
                    className="h-16 md:h-20 flex-col gap-1 md:gap-2"
                    onClick={() => {
                      setSelectedType('trek');
                      if (bookingType !== 'trek') setSelectedItemId('');
                    }}
                  >
                    <Mountain className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="text-xs md:text-sm">Trek Package</span>
                  </Button>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Select {selectedType === 'vehicle' ? 'Vehicle' : 'Trek Package'} *
                  </Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={`Choose a ${selectedType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedType === 'vehicle' ? (
                        vehicles?.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            <span className="flex items-center gap-2">
                              {v.name} 
                              <span className="text-muted-foreground">({v.capacity} seater) - ₹{v.base_price?.toLocaleString()}</span>
                            </span>
                          </SelectItem>
                        ))
                      ) : (
                        treks?.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <span className="flex items-center gap-2">
                              {t.name}
                              <span className="text-muted-foreground">- {t.destination} (₹{t.price_per_person}/person)</span>
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.item && <p className="text-sm text-destructive mt-1">{errors.item}</p>}
                </div>

                {/* Selected Item Preview */}
                {selectedItemId && (selectedVehicle || selectedTrek) && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {selectedType === 'vehicle' ? (
                          <Bus className="h-6 w-6 text-primary" />
                        ) : (
                          <Mountain className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{selectedVehicle?.name || selectedTrek?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedType === 'vehicle' 
                            ? `${selectedVehicle?.capacity} seater • ₹${selectedVehicle?.base_price?.toLocaleString()}`
                            : `${selectedTrek?.destination} • ₹${selectedTrek?.price_per_person}/person`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Primary Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Contact Details
                </CardTitle>
                <CardDescription>
                  Primary contact for this booking
                </CardDescription>
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
                      className="mt-1.5"
                    />
                    {errors.customer_name && <p className="text-sm text-destructive mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1.5"
                    />
                    {errors.customer_phone && <p className="text-sm text-destructive mt-1">{errors.customer_phone}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="your@email.com"
                    className="mt-1.5"
                  />
                  {errors.customer_email && <p className="text-sm text-destructive mt-1">{errors.customer_email}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle-specific Form */}
            {selectedType === 'vehicle' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Trip Type */}
                  <div>
                    <Label>Trip Type *</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[
                        { value: 'local', label: 'Local' },
                        { value: 'outstation', label: 'Outstation' },
                        { value: 'airport', label: 'Airport Transfer' },
                      ].map((type) => (
                        <Button
                          key={type.value}
                          type="button"
                          variant={vehicleData.trip_type === type.value ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs md:text-sm"
                          onClick={() => setVehicleData({ ...vehicleData, trip_type: type.value as typeof vehicleData.trip_type })}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Travel Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1.5 justify-start text-left font-normal",
                              !vehicleData.travel_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {vehicleData.travel_date ? format(vehicleData.travel_date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={vehicleData.travel_date}
                            onSelect={(date) => setVehicleData({ ...vehicleData, travel_date: date })}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.travel_date && <p className="text-sm text-destructive mt-1">{errors.travel_date}</p>}
                    </div>

                    {vehicleData.trip_type === 'outstation' && (
                      <div>
                        <Label>Return Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full mt-1.5 justify-start text-left font-normal",
                                !vehicleData.return_date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {vehicleData.return_date ? format(vehicleData.return_date, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={vehicleData.return_date}
                              onSelect={(date) => setVehicleData({ ...vehicleData, return_date: date })}
                              disabled={(date) => date < (vehicleData.travel_date || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  {/* Time and Days */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Pickup Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={vehicleData.travel_time}
                        onChange={(e) => setVehicleData({ ...vehicleData, travel_time: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    {vehicleData.trip_type === 'outstation' && (
                      <div>
                        <Label htmlFor="days">Number of Days</Label>
                        <Input
                          id="days"
                          type="number"
                          min={1}
                          max={30}
                          value={vehicleData.num_days}
                          onChange={(e) => setVehicleData({ ...vehicleData, num_days: parseInt(e.target.value) || 1 })}
                          className="mt-1.5"
                        />
                      </div>
                    )}
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickup">Pickup Location *</Label>
                      <Input
                        id="pickup"
                        value={vehicleData.pickup_location}
                        onChange={(e) => setVehicleData({ ...vehicleData, pickup_location: e.target.value })}
                        placeholder="Enter pickup address"
                        className="mt-1.5"
                      />
                      {errors.pickup_location && <p className="text-sm text-destructive mt-1">{errors.pickup_location}</p>}
                    </div>
                    <div>
                      <Label htmlFor="drop">Drop Location</Label>
                      <Input
                        id="drop"
                        value={vehicleData.drop_location}
                        onChange={(e) => setVehicleData({ ...vehicleData, drop_location: e.target.value })}
                        placeholder="Enter drop address"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trek-specific Form - Traveler Details */}
            {selectedType === 'trek' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Traveler Details
                  </CardTitle>
                  <CardDescription>
                    Add details for all travelers joining this trek ({trekPersons.length} {trekPersons.length === 1 ? 'person' : 'persons'})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Trek Date - Only show dates set by admin */}
                  <div>
                    <Label>Trek Date *</Label>
                    {availableTrekDates && availableTrekDates.length > 0 ? (
                      <Select 
                        value={trekDate ? format(trekDate, 'yyyy-MM-dd') : ''} 
                        onValueChange={(value) => setTrekDate(new Date(value + 'T00:00:00'))}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select available date" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrekDates.map((dateInfo) => {
                            const spotsLeft = dateInfo.max_participants - dateInfo.current_bookings;
                            const isFull = spotsLeft <= 0;
                            return (
                              <SelectItem 
                                key={dateInfo.id} 
                                value={dateInfo.available_date}
                                disabled={isFull}
                              >
                                <span className="flex items-center gap-2">
                                  {format(new Date(dateInfo.available_date + 'T00:00:00'), 'EEEE, dd MMM yyyy')}
                                  {isFull ? (
                                    <span className="text-xs text-destructive">(Full)</span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">({spotsLeft} spots left)</span>
                                  )}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2 p-4 rounded-lg bg-muted/50 border border-dashed text-center">
                        <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No dates available for this trek yet.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Please contact us for custom dates or check back later.
                        </p>
                      </div>
                    )}
                    {errors.travel_date && <p className="text-sm text-destructive mt-1">{errors.travel_date}</p>}
                  </div>

                  {/* Travelers List */}
                  <div className="space-y-4">
                    {trekPersons.map((person, index) => (
                      <div key={person.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Person {index + 1}
                          </h4>
                          {trekPersons.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removePerson(person.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="col-span-2 md:col-span-1">
                            <Label className="text-xs">Name *</Label>
                            <Input
                              value={person.name}
                              onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                              placeholder="Full name"
                              className="mt-1 h-9 text-sm"
                            />
                            {errors[`person_${index}_name`] && (
                              <p className="text-xs text-destructive mt-0.5">{errors[`person_${index}_name`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs">Age *</Label>
                            <Input
                              type="number"
                              min={1}
                              max={100}
                              value={person.age}
                              onChange={(e) => updatePerson(person.id, 'age', e.target.value)}
                              placeholder="Age"
                              className="mt-1 h-9 text-sm"
                            />
                            {errors[`person_${index}_age`] && (
                              <p className="text-xs text-destructive mt-0.5">{errors[`person_${index}_age`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs">Gender *</Label>
                            <Select value={person.gender} onValueChange={(val) => updatePerson(person.id, 'gender', val)}>
                              <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors[`person_${index}_gender`] && (
                              <p className="text-xs text-destructive mt-0.5">{errors[`person_${index}_gender`]}</p>
                            )}
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <Label className="text-xs">Phone (Optional)</Label>
                            <Input
                              value={person.phone}
                              onChange={(e) => updatePerson(person.id, 'phone', e.target.value)}
                              placeholder="Phone"
                              className="mt-1 h-9 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Person Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={addPerson}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Person
                  </Button>

                  {/* Price Summary */}
                  {selectedTrek && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {trekPersons.length} × ₹{selectedTrek.price_per_person.toLocaleString()}
                        </span>
                        <span className="text-xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {(trekPersons.length * selectedTrek.price_per_person).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        *Final price may vary. Our team will confirm the exact amount.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Special Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.special_requirements}
                  onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                  placeholder="Any special requests, dietary requirements, medical conditions, etc..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
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
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Submit Booking Request
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
