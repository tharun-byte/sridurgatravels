import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Image as ImageIcon, Loader2, Home, Info, Car, Mountain, ImageIcon as GalleryIcon, Mail } from 'lucide-react';

interface PageBanner {
  id: string;
  page_slug: string;
  page_name: string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  updated_at: string;
}

const pageCategories = [
  { id: 'home', label: 'Home Page', icon: Home, slugs: ['home-1', 'home-2', 'home-3'] },
  { id: 'about', label: 'About Us', icon: Info, slugs: ['about'] },
  { id: 'rentals', label: 'Cars & Bus Rentals', icon: Car, slugs: ['rentals'] },
  { id: 'trekking', label: 'Trekking', icon: Mountain, slugs: ['trekking'] },
  { id: 'gallery', label: 'Gallery', icon: GalleryIcon, slugs: ['gallery'] },
  { id: 'contact', label: 'Contact Us', icon: Mail, slugs: ['contact'] },
];

export default function BannerManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<PageBanner | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { data: banners, isLoading } = useQuery({
    queryKey: ['page-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_banners')
        .select('*')
        .order('page_slug');
      
      if (error) throw error;
      return data as PageBanner[];
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (banner: Partial<PageBanner> & { id: string }) => {
      const { error } = await supabase
        .from('page_banners')
        .update({
          title: banner.title,
          subtitle: banner.subtitle,
          image_url: banner.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', banner.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-banners'] });
      setEditingBanner(null);
      toast({
        title: 'Banner updated',
        description: 'The banner has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update banner: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleImageUpload = async (bannerId: string, pageSlug: string, file: File) => {
    const banner = banners?.find(b => b.id === bannerId);
    if (!banner) return;

    setUploading(bannerId);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      await updateBannerMutation.mutateAsync({
        id: banner.id,
        image_url: publicUrl.publicUrl,
        title: banner.title,
        subtitle: banner.subtitle,
      });

      toast({
        title: 'Image uploaded',
        description: 'The banner image has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editingBanner) return;
    updateBannerMutation.mutate(editingBanner);
  };

  const getBannersForCategory = (slugs: string[]) => {
    return banners?.filter(b => slugs.includes(b.page_slug)) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Banner Management</h1>
        <p className="text-muted-foreground">
          Manage banner images and text for all pages of the website.
        </p>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {pageCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {pageCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getBannersForCategory(category.slugs).map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{banner.page_name}</CardTitle>
                    <CardDescription>Slug: {banner.page_slug}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      {banner.image_url && !banner.image_url.includes('/api/placeholder') ? (
                        <img
                          src={banner.image_url}
                          alt={banner.page_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={uploading === banner.id}
                          onClick={() => fileInputRefs.current[banner.id]?.click()}
                        >
                          {uploading === banner.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Change Image
                        </Button>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[banner.id] = el)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(banner.id, banner.page_slug, file);
                        }}
                      />
                    </div>

                    {/* Editable Fields */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`title-${banner.id}`} className="text-xs">Title</Label>
                        <Input
                          id={`title-${banner.id}`}
                          value={editingBanner?.id === banner.id ? editingBanner.title || '' : banner.title || ''}
                          onChange={(e) => setEditingBanner({ ...banner, ...editingBanner, id: banner.id, title: e.target.value })}
                          onFocus={() => !editingBanner && setEditingBanner(banner)}
                          placeholder="Banner title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`subtitle-${banner.id}`} className="text-xs">Subtitle</Label>
                        <Input
                          id={`subtitle-${banner.id}`}
                          value={editingBanner?.id === banner.id ? editingBanner.subtitle || '' : banner.subtitle || ''}
                          onChange={(e) => setEditingBanner({ ...banner, ...editingBanner, id: banner.id, subtitle: e.target.value })}
                          onFocus={() => !editingBanner && setEditingBanner(banner)}
                          placeholder="Banner subtitle"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    {editingBanner?.id === banner.id && (
                      <Button
                        onClick={handleSaveEdit}
                        disabled={updateBannerMutation.isPending}
                        className="w-full"
                      >
                        {updateBannerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
