// Database types for Sri Durga Travels

export type VehicleType = 'car' | 'tempo_traveller' | 'mini_bus' | 'coach' | 'luxury_bus';
export type TrekDifficulty = 'easy' | 'moderate' | 'challenging' | 'difficult';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingType = 'vehicle' | 'trek';
export type AppRole = 'super_admin' | 'manager' | 'staff';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  capacity: number;
  description: string | null;
  features: string[];
  base_price: number;
  extra_hour_rate: number | null;
  extra_km_rate: number | null;
  full_day_price: number | null;
  outstation_allowance: string | null;
  driver_bata: number | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: VehicleImage[];
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Trek {
  id: string;
  name: string;
  destination: string;
  duration: string;
  difficulty: TrekDifficulty;
  altitude: string | null;
  distance: string | null;
  description: string | null;
  highlights: string[];
  itinerary: TrekItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  things_to_carry: string[];
  important_notes: string | null;
  price_per_person: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: TrekImage[];
}

export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface TrekImage {
  id: string;
  trek_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  booking_type: BookingType;
  vehicle_id: string | null;
  trek_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_location: string | null;
  drop_location: string | null;
  travel_date: string;
  travel_time: string | null;
  return_date: string | null;
  num_passengers: number;
  special_requirements: string | null;
  total_price: number | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  trek?: Trek;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
  images?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  category_id: string | null;
  url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}
