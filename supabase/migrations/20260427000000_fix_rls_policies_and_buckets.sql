-- ============================================
-- FIX: Create banners storage bucket (was missing)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Banners storage policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Banner images are publicly accessible' AND tablename = 'objects'
  ) THEN
    EXECUTE 'CREATE POLICY "Banner images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = ''banners'')';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can upload banner images' AND tablename = 'objects'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can upload banner images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = ''banners'' AND public.is_admin())';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update banner images' AND tablename = 'objects'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update banner images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = ''banners'' AND public.is_admin())';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete banner images' AND tablename = 'objects'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can delete banner images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = ''banners'' AND public.is_admin())';
  END IF;
END $$;

-- ============================================
-- FIX: gallery_images — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Managers can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Managers can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;

CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery images"
ON public.gallery_images FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: gallery_categories — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Managers can insert gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Managers can update gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Admins can delete gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Admins can insert gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Admins can update gallery categories" ON public.gallery_categories;

CREATE POLICY "Admins can insert gallery categories"
ON public.gallery_categories FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery categories"
ON public.gallery_categories FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete gallery categories"
ON public.gallery_categories FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: gallery storage bucket — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery images in storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images from storage" ON storage.objects;

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins can update gallery images in storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins can delete gallery images from storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND public.is_admin());

-- ============================================
-- FIX: bookings DELETE — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: contact_messages DELETE — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: testimonials — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Managers can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Managers can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;

CREATE POLICY "Admins can insert testimonials"
ON public.testimonials FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: trek_images — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Managers can insert trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Managers can update trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Admins can delete trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Admins can insert trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Admins can update trek images" ON public.trek_images;

CREATE POLICY "Admins can insert trek images"
ON public.trek_images FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update trek images"
ON public.trek_images FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete trek images"
ON public.trek_images FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: vehicle_images — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Managers can insert vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Managers can update vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Admins can delete vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Admins can insert vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Admins can update vehicle images" ON public.vehicle_images;

CREATE POLICY "Admins can insert vehicle images"
ON public.vehicle_images FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update vehicle images"
ON public.vehicle_images FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete vehicle images"
ON public.vehicle_images FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: vehicles — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Managers can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Managers can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;

CREATE POLICY "Admins can insert vehicles"
ON public.vehicles FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update vehicles"
ON public.vehicles FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete vehicles"
ON public.vehicles FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: treks — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete treks" ON public.treks;
DROP POLICY IF EXISTS "Managers can insert treks" ON public.treks;
DROP POLICY IF EXISTS "Managers can update treks" ON public.treks;
DROP POLICY IF EXISTS "Admins can delete treks" ON public.treks;
DROP POLICY IF EXISTS "Admins can insert treks" ON public.treks;
DROP POLICY IF EXISTS "Admins can update treks" ON public.treks;

CREATE POLICY "Admins can insert treks"
ON public.treks FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update treks"
ON public.treks FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete treks"
ON public.treks FOR DELETE TO authenticated
USING (public.is_admin());

-- ============================================
-- FIX: treks storage bucket — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete trek images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can upload trek images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can update trek images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload trek images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update trek images in storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete trek images from storage" ON storage.objects;

CREATE POLICY "Admins can upload trek images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'treks' AND public.is_admin());

CREATE POLICY "Admins can update trek images in storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'treks' AND public.is_admin());

CREATE POLICY "Admins can delete trek images from storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'treks' AND public.is_admin());

-- ============================================
-- FIX: vehicles storage bucket — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can delete vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Managers can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update vehicle images in storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete vehicle images from storage" ON storage.objects;

CREATE POLICY "Admins can upload vehicle images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicles' AND public.is_admin());

CREATE POLICY "Admins can update vehicle images in storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'vehicles' AND public.is_admin());

CREATE POLICY "Admins can delete vehicle images from storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicles' AND public.is_admin());

-- ============================================
-- FIX: site_settings — open to all admins
-- ============================================
DROP POLICY IF EXISTS "Super admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================
-- FIX: page_banners — ensure admins can manage
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Page banners are publicly viewable' AND tablename = 'page_banners'
  ) THEN
    EXECUTE 'CREATE POLICY "Page banners are publicly viewable" ON public.page_banners FOR SELECT USING (true)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage page banners' AND tablename = 'page_banners'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage page banners" ON public.page_banners FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;
