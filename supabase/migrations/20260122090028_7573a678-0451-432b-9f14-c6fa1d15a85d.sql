-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'manager', 'staff');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'staff')
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create vehicle type enum
CREATE TYPE public.vehicle_type AS ENUM ('car', 'tempo_traveller', 'mini_bus', 'coach', 'luxury_bus');

-- Create vehicles table
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type vehicle_type NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    base_price NUMERIC(10,2) NOT NULL,
    extra_hour_rate NUMERIC(10,2),
    extra_km_rate NUMERIC(10,2),
    full_day_price NUMERIC(10,2),
    outstation_allowance TEXT,
    driver_bata NUMERIC(10,2),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create vehicle images table
CREATE TABLE public.vehicle_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

-- Create trek difficulty enum
CREATE TYPE public.trek_difficulty AS ENUM ('easy', 'moderate', 'challenging', 'difficult');

-- Create treks table
CREATE TABLE public.treks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration TEXT NOT NULL,
    difficulty trek_difficulty NOT NULL DEFAULT 'moderate',
    altitude TEXT,
    distance TEXT,
    description TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    things_to_carry JSONB DEFAULT '[]'::jsonb,
    important_notes TEXT,
    price_per_person NUMERIC(10,2) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;

-- Create trek images table
CREATE TABLE public.trek_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id UUID REFERENCES public.treks(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trek_images ENABLE ROW LEVEL SECURITY;

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create booking type enum
CREATE TYPE public.booking_type AS ENUM ('vehicle', 'trek');

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_type booking_type NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    trek_id UUID REFERENCES public.treks(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    pickup_location TEXT,
    drop_location TEXT,
    travel_date DATE NOT NULL,
    travel_time TIME,
    return_date DATE,
    num_passengers INTEGER NOT NULL DEFAULT 1,
    special_requirements TEXT,
    total_price NUMERIC(10,2),
    status booking_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create contact messages table
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create gallery categories table
CREATE TABLE public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

-- Create gallery images table
CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create site settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- User roles policies
CREATE POLICY "Super admins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Vehicles policies (public read, manager+ write)
CREATE POLICY "Vehicles are publicly viewable"
ON public.vehicles FOR SELECT
USING (true);

CREATE POLICY "Managers can insert vehicles"
ON public.vehicles FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update vehicles"
ON public.vehicles FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete vehicles"
ON public.vehicles FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Vehicle images policies
CREATE POLICY "Vehicle images are publicly viewable"
ON public.vehicle_images FOR SELECT
USING (true);

CREATE POLICY "Managers can insert vehicle images"
ON public.vehicle_images FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update vehicle images"
ON public.vehicle_images FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete vehicle images"
ON public.vehicle_images FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Treks policies (public read, manager+ write)
CREATE POLICY "Treks are publicly viewable"
ON public.treks FOR SELECT
USING (true);

CREATE POLICY "Managers can insert treks"
ON public.treks FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update treks"
ON public.treks FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete treks"
ON public.treks FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Trek images policies
CREATE POLICY "Trek images are publicly viewable"
ON public.trek_images FOR SELECT
USING (true);

CREATE POLICY "Managers can insert trek images"
ON public.trek_images FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update trek images"
ON public.trek_images FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete trek images"
ON public.trek_images FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Public can view bookings by ID"
ON public.bookings FOR SELECT
USING (true);

CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff can update booking status"
ON public.bookings FOR UPDATE
TO authenticated
USING (public.is_staff());

CREATE POLICY "Super admins can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Super admins can delete contact messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Gallery categories policies
CREATE POLICY "Gallery categories are publicly viewable"
ON public.gallery_categories FOR SELECT
USING (true);

CREATE POLICY "Managers can insert gallery categories"
ON public.gallery_categories FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update gallery categories"
ON public.gallery_categories FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete gallery categories"
ON public.gallery_categories FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Gallery images policies
CREATE POLICY "Gallery images are publicly viewable"
ON public.gallery_images FOR SELECT
USING (true);

CREATE POLICY "Managers can insert gallery images"
ON public.gallery_images FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update gallery images"
ON public.gallery_images FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete gallery images"
ON public.gallery_images FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Testimonials policies
CREATE POLICY "Testimonials are publicly viewable"
ON public.testimonials FOR SELECT
USING (true);

CREATE POLICY "Managers can insert testimonials"
ON public.testimonials FOR INSERT
TO authenticated
WITH CHECK (public.is_manager());

CREATE POLICY "Managers can update testimonials"
ON public.testimonials FOR UPDATE
TO authenticated
USING (public.is_manager());

CREATE POLICY "Super admins can delete testimonials"
ON public.testimonials FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Site settings policies
CREATE POLICY "Site settings are publicly viewable"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Super admins can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treks_updated_at
    BEFORE UPDATE ON public.treks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicles', 'vehicles', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('treks', 'treks', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for vehicles bucket
CREATE POLICY "Vehicle images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicles');

CREATE POLICY "Managers can upload vehicle images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicles' AND public.is_manager());

CREATE POLICY "Managers can update vehicle images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicles' AND public.is_manager());

CREATE POLICY "Super admins can delete vehicle images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicles' AND public.is_super_admin());

-- Storage policies for treks bucket
CREATE POLICY "Trek images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'treks');

CREATE POLICY "Managers can upload trek images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'treks' AND public.is_manager());

CREATE POLICY "Managers can update trek images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'treks' AND public.is_manager());

CREATE POLICY "Super admins can delete trek images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'treks' AND public.is_super_admin());

-- Storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Managers can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery' AND public.is_manager());

CREATE POLICY "Managers can update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND public.is_manager());

CREATE POLICY "Super admins can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND public.is_super_admin());

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);