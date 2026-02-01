import { usePageBanner } from '@/hooks/usePageBanner';

interface PageBannerProps {
  pageSlug: string;
  defaultImage?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  height?: 'sm' | 'md' | 'lg';
}

const heightClasses = {
  sm: 'h-[200px] md:h-[250px]',
  md: 'h-[300px] md:h-[350px]',
  lg: 'h-[400px] md:h-[450px]',
};

export function PageBanner({ 
  pageSlug, 
  defaultImage, 
  defaultTitle, 
  defaultSubtitle,
  height = 'md' 
}: PageBannerProps) {
  const { imageUrl, title, subtitle } = usePageBanner(pageSlug, defaultImage, defaultTitle, defaultSubtitle);

  return (
    <section className={`relative ${heightClasses[height]} overflow-hidden`}>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-hero/80 to-hero/60" />
      <div className="relative container h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-4 drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-hero-foreground/90 drop-shadow-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
