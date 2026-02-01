-- Drop the existing banner_images table and recreate with page support
DROP TABLE IF EXISTS public.banner_images;

-- Create page_banners table for all pages
CREATE TABLE public.page_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  image_url TEXT,
  title TEXT,
  subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with banners for all pages
INSERT INTO public.page_banners (page_slug, page_name, image_url, title, subtitle)
VALUES 
  ('home-1', 'Home - Bus Rentals', '/images/hero/hero-bus.jpg', 'Book Regular & AC Buses Online', 'Comfortable travel for groups of all sizes with experienced drivers'),
  ('home-2', 'Home - Trekking', '/images/hero/hero-trekking.jpg', 'Exciting Trekking Trips & Packages', 'Adventure awaits! Explore the Western Ghats with expert guides'),
  ('home-3', 'Home - Car Rentals', '/images/hero/hero-cars.jpg', 'Affordable 5-Seater Car Rentals', 'Premium cars for family trips, airport transfers and outstation journeys'),
  ('about', 'About Us', '/api/placeholder/1920/600', 'About Sri Durga Travels', 'Your trusted travel partner since 2002'),
  ('rentals', 'Cars & Bus Rentals', '/api/placeholder/1920/600', 'Our Fleet', 'Premium vehicles for every journey'),
  ('trekking', 'Trekking', '/api/placeholder/1920/600', 'Adventure Awaits', 'Explore the Western Ghats with expert guides'),
  ('gallery', 'Gallery', '/api/placeholder/1920/600', 'Our Gallery', 'Memories from countless journeys'),
  ('contact', 'Contact Us', '/api/placeholder/1920/600', 'Get In Touch', 'We are here to help you plan your journey');

-- Enable RLS
ALTER TABLE public.page_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Page banners are publicly viewable" ON public.page_banners FOR SELECT USING (true);
CREATE POLICY "Managers can update page banners" ON public.page_banners FOR UPDATE USING (is_manager());
CREATE POLICY "Managers can insert page banners" ON public.page_banners FOR INSERT WITH CHECK (is_manager());