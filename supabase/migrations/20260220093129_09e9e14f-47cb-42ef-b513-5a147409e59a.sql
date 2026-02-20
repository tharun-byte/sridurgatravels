
-- Fix RLS policies - they should be PERMISSIVE (default), not RESTRICTIVE
-- Drop all existing trek-related policies and recreate them as PERMISSIVE

-- TREKS table
DROP POLICY IF EXISTS "Managers can insert treks" ON public.treks;
DROP POLICY IF EXISTS "Managers can update treks" ON public.treks;
DROP POLICY IF EXISTS "Super admins can delete treks" ON public.treks;
DROP POLICY IF EXISTS "Treks are publicly viewable" ON public.treks;

CREATE POLICY "Treks are publicly viewable" ON public.treks FOR SELECT USING (true);
CREATE POLICY "Managers can insert treks" ON public.treks FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update treks" ON public.treks FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete treks" ON public.treks FOR DELETE USING (is_super_admin());

-- TREK_IMAGES table
DROP POLICY IF EXISTS "Trek images are publicly viewable" ON public.trek_images;
DROP POLICY IF EXISTS "Managers can insert trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Managers can update trek images" ON public.trek_images;
DROP POLICY IF EXISTS "Super admins can delete trek images" ON public.trek_images;

CREATE POLICY "Trek images are publicly viewable" ON public.trek_images FOR SELECT USING (true);
CREATE POLICY "Managers can insert trek images" ON public.trek_images FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update trek images" ON public.trek_images FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete trek images" ON public.trek_images FOR DELETE USING (is_super_admin());

-- Also fix VEHICLES table
DROP POLICY IF EXISTS "Vehicles are publicly viewable" ON public.vehicles;
DROP POLICY IF EXISTS "Managers can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Managers can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Super admins can delete vehicles" ON public.vehicles;

CREATE POLICY "Vehicles are publicly viewable" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Managers can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update vehicles" ON public.vehicles FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete vehicles" ON public.vehicles FOR DELETE USING (is_super_admin());

-- Fix VEHICLE_IMAGES table
DROP POLICY IF EXISTS "Vehicle images are publicly viewable" ON public.vehicle_images;
DROP POLICY IF EXISTS "Managers can insert vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Managers can update vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Super admins can delete vehicle images" ON public.vehicle_images;

CREATE POLICY "Vehicle images are publicly viewable" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Managers can insert vehicle images" ON public.vehicle_images FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update vehicle images" ON public.vehicle_images FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete vehicle images" ON public.vehicle_images FOR DELETE USING (is_super_admin());

-- Fix TESTIMONIALS table
DROP POLICY IF EXISTS "Testimonials are publicly viewable" ON public.testimonials;
DROP POLICY IF EXISTS "Managers can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Managers can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Super admins can delete testimonials" ON public.testimonials;

CREATE POLICY "Testimonials are publicly viewable" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Managers can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update testimonials" ON public.testimonials FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete testimonials" ON public.testimonials FOR DELETE USING (is_super_admin());

-- Fix GALLERY tables
DROP POLICY IF EXISTS "Gallery images are publicly viewable" ON public.gallery_images;
DROP POLICY IF EXISTS "Managers can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Managers can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Super admins can delete gallery images" ON public.gallery_images;

CREATE POLICY "Gallery images are publicly viewable" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Managers can insert gallery images" ON public.gallery_images FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update gallery images" ON public.gallery_images FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete gallery images" ON public.gallery_images FOR DELETE USING (is_super_admin());

DROP POLICY IF EXISTS "Gallery categories are publicly viewable" ON public.gallery_categories;
DROP POLICY IF EXISTS "Managers can insert gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Managers can update gallery categories" ON public.gallery_categories;
DROP POLICY IF EXISTS "Super admins can delete gallery categories" ON public.gallery_categories;

CREATE POLICY "Gallery categories are publicly viewable" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Managers can insert gallery categories" ON public.gallery_categories FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update gallery categories" ON public.gallery_categories FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete gallery categories" ON public.gallery_categories FOR DELETE USING (is_super_admin());

-- Fix SITE_SETTINGS
DROP POLICY IF EXISTS "Site settings are publicly viewable" ON public.site_settings;
DROP POLICY IF EXISTS "Super admins can manage site settings" ON public.site_settings;

CREATE POLICY "Site settings are publicly viewable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Super admins can manage site settings" ON public.site_settings FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());

-- Fix PAGE_BANNERS
DROP POLICY IF EXISTS "Page banners are publicly viewable" ON public.page_banners;
DROP POLICY IF EXISTS "Managers can insert page banners" ON public.page_banners;
DROP POLICY IF EXISTS "Managers can update page banners" ON public.page_banners;

CREATE POLICY "Page banners are publicly viewable" ON public.page_banners FOR SELECT USING (true);
CREATE POLICY "Managers can insert page banners" ON public.page_banners FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update page banners" ON public.page_banners FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete page banners" ON public.page_banners FOR DELETE USING (is_super_admin());

-- Fix BOOKINGS
DROP POLICY IF EXISTS "Anyone can create bookings with required fields" ON public.bookings;
DROP POLICY IF EXISTS "Public can view bookings by ID" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can update booking status" ON public.bookings;
DROP POLICY IF EXISTS "Super admins can delete bookings" ON public.bookings;

CREATE POLICY "Anyone can create bookings with required fields" ON public.bookings FOR INSERT WITH CHECK ((customer_name IS NOT NULL) AND (customer_email IS NOT NULL) AND (customer_phone IS NOT NULL) AND (travel_date IS NOT NULL));
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING ((user_id = auth.uid()) OR is_admin());
CREATE POLICY "Staff can update booking status" ON public.bookings FOR UPDATE USING (is_staff());
CREATE POLICY "Super admins can delete bookings" ON public.bookings FOR DELETE USING (is_super_admin());

-- Fix CONTACT_MESSAGES
DROP POLICY IF EXISTS "Anyone can create contact messages with required fields" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Super admins can delete contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can create contact messages with required fields" ON public.contact_messages FOR INSERT WITH CHECK ((name IS NOT NULL) AND (email IS NOT NULL) AND (subject IS NOT NULL) AND (message IS NOT NULL));
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (is_admin());
CREATE POLICY "Super admins can delete contact messages" ON public.contact_messages FOR DELETE USING (is_super_admin());

-- Fix TREK_DATES
DROP POLICY IF EXISTS "Trek dates are viewable by everyone" ON public.trek_dates;
DROP POLICY IF EXISTS "Admins can insert trek dates" ON public.trek_dates;
DROP POLICY IF EXISTS "Admins can update trek dates" ON public.trek_dates;
DROP POLICY IF EXISTS "Admins can delete trek dates" ON public.trek_dates;

CREATE POLICY "Trek dates are viewable by everyone" ON public.trek_dates FOR SELECT USING (true);
CREATE POLICY "Admins can insert trek dates" ON public.trek_dates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update trek dates" ON public.trek_dates FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete trek dates" ON public.trek_dates FOR DELETE USING (is_admin());

-- Fix TREK_REVIEWS
DROP POLICY IF EXISTS "Approved reviews are publicly viewable" ON public.trek_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.trek_reviews;
DROP POLICY IF EXISTS "Managers can update reviews" ON public.trek_reviews;
DROP POLICY IF EXISTS "Super admins can delete reviews" ON public.trek_reviews;

CREATE POLICY "Approved reviews are publicly viewable" ON public.trek_reviews FOR SELECT USING ((is_approved = true) OR is_admin());
CREATE POLICY "Users can create reviews" ON public.trek_reviews FOR INSERT WITH CHECK ((name IS NOT NULL) AND (content IS NOT NULL));
CREATE POLICY "Managers can update reviews" ON public.trek_reviews FOR UPDATE USING (is_manager());
CREATE POLICY "Super admins can delete reviews" ON public.trek_reviews FOR DELETE USING (is_super_admin());

-- Fix USER_ROLES
DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Super admins can manage user roles" ON public.user_roles FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());

-- Fix PROFILES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
