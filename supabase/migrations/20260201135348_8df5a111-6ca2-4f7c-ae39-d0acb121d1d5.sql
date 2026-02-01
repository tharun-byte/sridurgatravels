-- Create trek_dates table for admin to manage available trek dates
CREATE TABLE public.trek_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trek_id UUID NOT NULL REFERENCES public.treks(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  max_participants INTEGER DEFAULT 20,
  current_bookings INTEGER DEFAULT 0,
  price_override NUMERIC(10,2) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trek_id, available_date)
);

-- Enable RLS
ALTER TABLE public.trek_dates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active trek dates
CREATE POLICY "Trek dates are viewable by everyone"
ON public.trek_dates
FOR SELECT
USING (is_active = true);

-- Allow admins to manage trek dates
CREATE POLICY "Admins can insert trek dates"
ON public.trek_dates
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update trek dates"
ON public.trek_dates
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete trek dates"
ON public.trek_dates
FOR DELETE
USING (public.is_admin());

-- Create index for faster lookups
CREATE INDEX idx_trek_dates_trek_id ON public.trek_dates(trek_id);
CREATE INDEX idx_trek_dates_available_date ON public.trek_dates(available_date);

-- Update trigger for updated_at
CREATE TRIGGER update_trek_dates_updated_at
BEFORE UPDATE ON public.trek_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();