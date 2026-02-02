import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// Helper to update or create meta tags
function updateMetaTag(name: string, content: string | undefined, property = false) {
  if (!content) return;
  
  const selector = property 
    ? `meta[property="${name}"]` 
    : `meta[name="${name}"]`;
  
  let element = document.querySelector(selector) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    if (property) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

// Helper to update or create link tags
function updateLinkTag(rel: string, href: string | undefined) {
  if (!href) return;
  
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

export function SEOHead() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;

    // Update document title
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    }

    // Primary Meta Tags
    updateMetaTag('description', settings.metaDescription);
    updateMetaTag('keywords', settings.keywords);
    updateMetaTag('robots', settings.robotsMeta);

    // Open Graph / Facebook
    updateMetaTag('og:type', settings.ogType || 'website', true);
    updateMetaTag('og:title', settings.ogTitle || settings.siteTitle, true);
    updateMetaTag('og:description', settings.ogDescription || settings.metaDescription, true);
    updateMetaTag('og:image', settings.ogImage, true);
    if (settings.canonicalUrl) {
      updateMetaTag('og:url', settings.canonicalUrl, true);
    }

    // Twitter Card
    updateMetaTag('twitter:card', settings.twitterCard || 'summary_large_image');
    updateMetaTag('twitter:title', settings.ogTitle || settings.siteTitle);
    updateMetaTag('twitter:description', settings.ogDescription || settings.metaDescription);
    updateMetaTag('twitter:image', settings.ogImage);
    if (settings.twitterSite) {
      updateMetaTag('twitter:site', settings.twitterSite);
    }

    // Canonical URL
    if (settings.canonicalUrl) {
      updateLinkTag('canonical', settings.canonicalUrl);
    }

  }, [settings]);

  // This component doesn't render anything visible
  return null;
}
