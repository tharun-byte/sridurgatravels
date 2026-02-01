import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PageBanner {
  id: string;
  page_slug: string;
  page_name: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
}

export function usePageBanner(pageSlug: string, defaultImage?: string, defaultTitle?: string, defaultSubtitle?: string) {
  const { data: banner, isLoading } = useQuery({
    queryKey: ['page-banner', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_banners')
        .select('*')
        .eq('page_slug', pageSlug)
        .single();
      
      if (error) {
        console.log('Banner not found, using defaults');
        return null;
      }
      return data as PageBanner;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    imageUrl: banner?.image_url || defaultImage || '/images/hero/hero-bus.jpg',
    title: banner?.title || defaultTitle || '',
    subtitle: banner?.subtitle || defaultSubtitle || '',
    isLoading,
  };
}
