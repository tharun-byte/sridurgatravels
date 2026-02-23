
-- Add new columns to vehicles table for extended pricing and info
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS local_package_price numeric DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS after_hrs_driver_bata numeric DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS outstation_per_km numeric DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS comfort text DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS trip_type text DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS why_choose jsonb DEFAULT '[]'::jsonb;
