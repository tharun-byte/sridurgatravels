-- Fix function search path warnings by updating the trigger functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$;

-- Fix overly permissive INSERT policies for bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings with required fields"
ON public.bookings FOR INSERT
WITH CHECK (
    customer_name IS NOT NULL 
    AND customer_email IS NOT NULL 
    AND customer_phone IS NOT NULL
    AND travel_date IS NOT NULL
);

-- Fix overly permissive INSERT policies for contact_messages  
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can create contact messages with required fields"
ON public.contact_messages FOR INSERT
WITH CHECK (
    name IS NOT NULL 
    AND email IS NOT NULL 
    AND subject IS NOT NULL
    AND message IS NOT NULL
);