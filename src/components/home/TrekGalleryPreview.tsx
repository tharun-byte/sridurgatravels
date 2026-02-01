import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryImages = [
  { src: '/images/treks/kudremukh-trek.jpg', alt: 'Kudremukh Trek', span: 'col-span-2 row-span-2' },
  { src: '/images/treks/gokarna-beach.jpg', alt: 'Gokarna Beach', span: 'col-span-1 row-span-1' },
  { src: '/images/treks/coorg-tour.jpg', alt: 'Coorg Tour', span: 'col-span-1 row-span-1' },
  { src: '/images/treks/kodachadri-trek.jpg', alt: 'Kodachadri Trek', span: 'col-span-1 row-span-2' },
  { src: '/images/treks/wayanad-tour.jpg', alt: 'Wayanad Tour', span: 'col-span-1 row-span-1' },
  { src: '/images/treks/tadiandamol-trek.jpg', alt: 'Tadiandamol Trek', span: 'col-span-1 row-span-1' },
];

export function TrekGalleryPreview() {
  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Camera className="w-4 h-4" />
              Captured Moments
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Adventure <span className="text-primary">Gallery</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl">
              Experience the thrill through the lens of our trekkers
            </p>
          </div>
          <Link to="/gallery" className="hidden md:block">
            <Button variant="outline" className="group">
              View Full Gallery
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[180px]">
          {galleryImages.map((image, index) => (
            <Link
              key={index}
              to="/gallery"
              className={`group relative rounded-xl md:rounded-2xl overflow-hidden ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
              
              {/* Hover Content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-6 h-6 text-primary fill-primary ml-0.5" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-sm md:text-base font-medium">{image.alt}</p>
              </div>

              {/* Border effect */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-500" />
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-8 md:hidden">
          <Link to="/gallery">
            <Button variant="outline" className="group">
              View Full Gallery
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-8">
          <div className="text-center p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
            <div className="text-2xl md:text-4xl font-bold text-primary mb-1">500+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Photos Shared</div>
          </div>
          <div className="text-center p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
            <div className="text-2xl md:text-4xl font-bold text-primary mb-1">15+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Destinations</div>
          </div>
          <div className="text-center p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
            <div className="text-2xl md:text-4xl font-bold text-primary mb-1">2K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Happy Trekkers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
