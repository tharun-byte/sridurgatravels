import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { COMPANY_INFO } from '@/lib/constants';

export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  phones: string[];
  address: string;
  workingHours: string;
  whatsappNumber: string;
  floatingButtonsEnabled: boolean;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  // SEO Settings
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  canonicalUrl: string;
  robotsMeta: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: COMPANY_INFO.name,
  tagline: COMPANY_INFO.tagline,
  email: COMPANY_INFO.email,
  phones: COMPANY_INFO.phones,
  address: COMPANY_INFO.address,
  workingHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
  whatsappNumber: COMPANY_INFO.phones[0],
  floatingButtonsEnabled: true,
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  // SEO defaults
  siteTitle: COMPANY_INFO.name,
  metaDescription: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  canonicalUrl: '',
  robotsMeta: 'index, follow',
};

async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }

  if (!data || data.length === 0) {
    return DEFAULT_SETTINGS;
  }

  const getValue = (key: string, defaultValue: string = '') => {
    const setting = data.find((s) => s.key === key);
    return setting?.value || defaultValue;
  };

  const phone1 = getValue('phone_1', COMPANY_INFO.phones[0]);
  const phone2 = getValue('phone_2', COMPANY_INFO.phones[1] || '');

  return {
    companyName: getValue('company_name', COMPANY_INFO.name),
    tagline: getValue('tagline', COMPANY_INFO.tagline),
    email: getValue('email', COMPANY_INFO.email),
    phones: [phone1, phone2].filter(Boolean),
    address: getValue('address', COMPANY_INFO.address),
    workingHours: getValue('working_hours', 'Mon-Sat: 9:00 AM - 8:00 PM'),
    whatsappNumber: getValue('whatsapp_number', phone1),
    floatingButtonsEnabled: getValue('floating_buttons_enabled', 'true') !== 'false',
    facebookUrl: getValue('facebook_url', ''),
    instagramUrl: getValue('instagram_url', ''),
    twitterUrl: getValue('twitter_url', ''),
    youtubeUrl: getValue('youtube_url', ''),
    // SEO Settings
    siteTitle: getValue('seo_site_title', COMPANY_INFO.name),
    metaDescription: getValue('seo_meta_description', ''),
    keywords: getValue('seo_keywords', ''),
    ogTitle: getValue('seo_og_title', ''),
    ogDescription: getValue('seo_og_description', ''),
    ogImage: getValue('seo_og_image', ''),
    ogType: getValue('seo_og_type', 'website'),
    twitterCard: getValue('seo_twitter_card', 'summary_large_image'),
    twitterSite: getValue('seo_twitter_site', ''),
    canonicalUrl: getValue('seo_canonical_url', ''),
    robotsMeta: getValue('seo_robots_meta', 'index, follow'),
  };
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings-public'],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
