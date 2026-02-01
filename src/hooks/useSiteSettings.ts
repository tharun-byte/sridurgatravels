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
