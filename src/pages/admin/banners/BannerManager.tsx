import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';

interface BannerImage {
  id: string;
  position: number;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
  updated_at: string;
}

export default function BannerManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<BannerImage | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banner_images')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data as BannerImage[];
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (banner: Partial<BannerImage> & { id: string }) => {
      const { error } = await supabase
        .from('banner_images')
        .update({
          title: banner.title,
          subtitle: banner.subtitle,
          cta_text: banner.cta_text,
          cta_link: banner.cta_link,
          image_url: banner.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', banner.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
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

  const handleImageUpload = async (position: number, file: File) => {
    const banner = banners?.find(b => b.position === position);
    if (!banner) return;

    setUploading(position);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${position}-${Date.now()}.${fileExt}`;
      const filePath = `home/${fileName}`;

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
        cta_text: banner.cta_text,
        cta_link: banner.cta_link,
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
        <h1 className="text-2xl font-bold text-foreground">Home Page Banners</h1>
        <p className="text-muted-foreground">
          Manage the 3 banner slides on the home page. You can change the images, titles, and call-to-action buttons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {banners?.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Banner {banner.position}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                {banner.image_url ? (
                  <img
                    src={banner.image_url}
                    alt={`Banner ${banner.position}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={uploading === banner.position}
                    onClick={() => fileInputRefs.current[banner.position]?.click()}
                  >
                    {uploading === banner.position ? (
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
                  ref={(el) => (fileInputRefs.current[banner.position] = el)}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(banner.position, file);
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`cta-text-${banner.id}`} className="text-xs">CTA Text</Label>
                    <Input
                      id={`cta-text-${banner.id}`}
                      value={editingBanner?.id === banner.id ? editingBanner.cta_text || '' : banner.cta_text || ''}
                      onChange={(e) => setEditingBanner({ ...banner, ...editingBanner, id: banner.id, cta_text: e.target.value })}
                      onFocus={() => !editingBanner && setEditingBanner(banner)}
                      placeholder="Button text"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cta-link-${banner.id}`} className="text-xs">CTA Link</Label>
                    <Input
                      id={`cta-link-${banner.id}`}
                      value={editingBanner?.id === banner.id ? editingBanner.cta_link || '' : banner.cta_link || ''}
                      onChange={(e) => setEditingBanner({ ...banner, ...editingBanner, id: banner.id, cta_link: e.target.value })}
                      onFocus={() => !editingBanner && setEditingBanner(banner)}
                      placeholder="/page"
                      className="mt-1"
                    />
                  </div>
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
    </div>
  );
}
