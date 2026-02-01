-- Create banner_images table for home page banners
CREATE TABLE IF NOT EXISTS public.banner_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL UNIQUE CHECK (position >= 1 AND position <= 3),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with default banners
INSERT INTO public.banner_images (position, image_url, title, subtitle, cta_text, cta_link)
VALUES 
  (1, '/images/hero/hero-bus.jpg', 'Book Regular & AC Buses Online', 'Comfortable travel for groups of all sizes with experienced drivers', 'Reserve Your Bus Today', '/rentals'),
  (2, '/images/hero/hero-trekking.jpg', 'Exciting Trekking Trips & Packages', 'Adventure awaits! Explore the Western Ghats with expert guides', 'Book Your Trek Now', '/trekking'),
  (3, '/images/hero/hero-cars.jpg', 'Affordable 5-Seater Car Rentals', 'Premium cars for family trips, airport transfers and outstation journeys', 'Explore Car Rentals', '/rentals');

-- Enable RLS
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Banners are publicly viewable" ON public.banner_images FOR SELECT USING (true);
CREATE POLICY "Managers can update banners" ON public.banner_images FOR UPDATE USING (is_manager());

-- Create storage bucket for banner uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for banner bucket
CREATE POLICY "Banners are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Managers can upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND is_manager());
CREATE POLICY "Managers can update banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND is_manager());
CREATE POLICY "Managers can delete banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND is_manager());