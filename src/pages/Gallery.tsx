import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CTASection } from '@/components/home/CTASection';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (data && data.length > 0) {
      setImages(data);
    } else {
      // Default placeholder images
      const defaultImages = [
        '/images/vehicles/tt-13-seater.jpg',
        '/images/vehicles/urbania-16.jpg',
        '/images/vehicles/minibus-21.jpg',
        '/images/vehicles/coach-33.jpg',
        '/images/vehicles/volvo-49.jpg',
        '/images/vehicles/luxury-40.jpg',
        '/images/vehicles/benz-45.jpg',
        '/images/vehicles/volvo-45.jpg',
        '/images/hero/hero-bus.jpg',
        '/images/hero/hero-cars.jpg',
        '/images/hero/hero-trekking.jpg',
      ].map((url, i) => ({
        id: `default-${i}`,
        url,
        caption: `Image ${i + 1}`,
      }));
      setImages(defaultImages);
    }
  };

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero/hero-bus.jpg)' }}
        >
          <div className="absolute inset-0 bg-hero/80" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto px-4">
            Explore our fleet and travel experiences
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          {selectedIndex !== null && (
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
              
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].caption || ''}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {images[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                  {images[selectedIndex].caption}
                </div>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTASection />
    </Layout>
  );
};

export default Gallery;
