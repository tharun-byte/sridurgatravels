import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VEHICLE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, X, Upload } from 'lucide-react';
import type { VehicleType } from '@/types/database';

const vehicleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['car', 'tempo_traveller', 'mini_bus', 'coach', 'luxury_bus']),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Price cannot be negative'),
  extra_hour_rate: z.coerce.number().optional(),
  extra_km_rate: z.coerce.number().optional(),
  full_day_price: z.coerce.number().optional(),
  outstation_allowance: z.string().optional(),
  driver_bata: z.coerce.number().optional(),
  local_package_price: z.coerce.number().optional(),
  after_hrs_driver_bata: z.coerce.number().optional(),
  outstation_per_km: z.coerce.number().optional(),
  comfort: z.string().optional(),
  trip_type: z.string().optional(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [whyChoose, setWhyChoose] = useState<string[]>([]);
  const [newWhyChoose, setNewWhyChoose] = useState('');
  const [images, setImages] = useState<{ id?: string; url: string; is_primary: boolean }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: '',
      type: 'tempo_traveller',
      capacity: 13,
      description: '',
      base_price: 0,
      extra_hour_rate: undefined,
      extra_km_rate: undefined,
      full_day_price: undefined,
      outstation_allowance: '',
      driver_bata: undefined,
      local_package_price: undefined,
      after_hrs_driver_bata: undefined,
      outstation_per_km: undefined,
      comfort: '',
      trip_type: '',
      is_featured: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Vehicle not found');
      navigate('/admin/vehicles');
      return;
    }

    form.reset({
      name: data.name,
      type: data.type as VehicleType,
      capacity: data.capacity,
      description: data.description || '',
      base_price: data.base_price,
      extra_hour_rate: data.extra_hour_rate || undefined,
      extra_km_rate: data.extra_km_rate || undefined,
      full_day_price: data.full_day_price || undefined,
      outstation_allowance: data.outstation_allowance || '',
      driver_bata: data.driver_bata || undefined,
      local_package_price: data.local_package_price || undefined,
      after_hrs_driver_bata: data.after_hrs_driver_bata || undefined,
      outstation_per_km: data.outstation_per_km || undefined,
      comfort: data.comfort || '',
      trip_type: data.trip_type || '',
      is_featured: data.is_featured || false,
      is_active: data.is_active ?? true,
    });

    setFeatures(Array.isArray(data.features) ? data.features as string[] : []);
    setWhyChoose(Array.isArray(data.why_choose) ? data.why_choose as string[] : []);
    setImages(data.vehicle_images || []);
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddWhyChoose = () => {
    if (newWhyChoose.trim() && !whyChoose.includes(newWhyChoose.trim())) {
      setWhyChoose([...whyChoose, newWhyChoose.trim()]);
      setNewWhyChoose('');
    }
  };

  const handleRemoveWhyChoose = (index: number) => {
    setWhyChoose(whyChoose.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${id || 'new'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vehicles')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vehicles')
      .getPublicUrl(filePath);

    setImages([...images, { url: publicUrl, is_primary: images.length === 0 }]);
    setUploadingImage(false);
    toast.success('Image uploaded');
  };

  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    if (image.id) {
      await supabase.from('vehicle_images').delete().eq('id', image.id);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    if (image.is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    setImages(newImages);
  };

  const onSubmit = async (data: VehicleFormData) => {
    setLoading(true);

    const vehicleData = {
      ...data,
      features,
      why_choose: whyChoose,
      extra_hour_rate: data.extra_hour_rate || null,
      extra_km_rate: data.extra_km_rate || null,
      full_day_price: data.full_day_price || null,
      driver_bata: data.driver_bata || null,
      local_package_price: data.local_package_price || null,
      after_hrs_driver_bata: data.after_hrs_driver_bata || null,
      outstation_per_km: data.outstation_per_km || null,
      outstation_allowance: data.outstation_allowance || null,
      description: data.description || null,
      comfort: data.comfort || null,
      trip_type: data.trip_type || null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from('vehicles')
        .update(vehicleData as any)
        .eq('id', id);

      if (error) {
        toast.error(`Failed to update vehicle: ${error.message}`);
        setLoading(false);
        return;
      }

      await supabase.from('vehicle_images').delete().eq('vehicle_id', id);
      if (images.length > 0) {
        await supabase.from('vehicle_images').insert(
          images.map((img, i) => ({
            vehicle_id: id,
            url: img.url,
            is_primary: img.is_primary,
            display_order: i,
          }))
        );
      }

      toast.success('Vehicle updated successfully');
    } else {
      const { data: newVehicle, error } = await supabase
        .from('vehicles')
        .insert(vehicleData as any)
        .select()
        .single();

      if (error || !newVehicle) {
        toast.error(`Failed to create vehicle: ${error?.message}`);
        setLoading(false);
        return;
      }

      if (images.length > 0) {
        await supabase.from('vehicle_images').insert(
          images.map((img, i) => ({
            vehicle_id: newVehicle.id,
            url: img.url,
            is_primary: img.is_primary,
            display_order: i,
          }))
        );
      }

      toast.success('Vehicle created successfully');
    }

    setLoading(false);
    navigate('/admin/vehicles');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vehicles')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-heading font-bold">
            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update vehicle details' : 'Add a new vehicle to your fleet'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Volvo 45 Seater" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(VEHICLE_TYPES).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seating Capacity</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Vehicle description..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="comfort" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comfort</FormLabel>
                      <FormControl><Input placeholder="e.g., Air Conditioned | Premium MPV" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="trip_type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Type</FormLabel>
                      <FormControl><Input placeholder="e.g., Local & Outstation" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <FormLabel>Features</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddFeature}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                        {feature}
                        <button type="button" onClick={() => handleRemoveFeature(index)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="base_price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price - 8hrs/80km (₹)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="extra_hour_rate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extra Hour Rate (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="extra_km_rate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extra KM Rate (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="full_day_price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Day Price (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="local_package_price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Package / Short Trips (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="outstation_allowance" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outstation Limit</FormLabel>
                    <FormControl><Input placeholder="e.g., 300 kms per day" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="outstation_per_km" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outstation Per KM Rate (₹)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="driver_bata" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Bata (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="after_hrs_driver_bata" render={({ field }) => (
                    <FormItem>
                      <FormLabel>After Hrs Driver Bata (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose This Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newWhyChoose}
                  onChange={(e) => setNewWhyChoose(e.target.value)}
                  placeholder="Add a reason why customers should choose this vehicle..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWhyChoose())}
                />
                <Button type="button" variant="outline" onClick={handleAddWhyChoose}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2 mt-2">
                {whyChoose.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm">
                    <span className="flex-1">{item}</span>
                    <button type="button" onClick={() => handleRemoveWhyChoose(index)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Vehicle ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 ${image.is_primary ? 'border-primary' : 'border-transparent'}`}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={() => setPrimaryImage(index)} disabled={image.is_primary}>
                        {image.is_primary ? 'Primary' : 'Set Primary'}
                      </Button>
                      <Button type="button" size="icon" variant="destructive" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  {uploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    </>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-8">
              <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div>
                    <FormLabel className="mb-0">Active</FormLabel>
                    <FormDescription>Vehicle is available for booking</FormDescription>
                  </div>
                </FormItem>
              )} />
              <FormField control={form.control} name="is_featured" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div>
                    <FormLabel className="mb-0">Featured</FormLabel>
                    <FormDescription>Show on homepage</FormDescription>
                  </div>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/vehicles')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Vehicle' : 'Create Vehicle'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
