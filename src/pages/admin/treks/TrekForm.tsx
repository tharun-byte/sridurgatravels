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
import { TREK_DIFFICULTIES } from '@/lib/constants';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, X, Upload, GripVertical } from 'lucide-react';
import type { TrekDifficulty, TrekItineraryDay } from '@/types/database';

const trekSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  destination: z.string().min(1, 'Destination is required'),
  duration: z.string().min(1, 'Duration is required'),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'difficult']),
  altitude: z.string().optional(),
  distance: z.string().optional(),
  description: z.string().optional(),
  important_notes: z.string().optional(),
  price_per_person: z.coerce.number().min(0, 'Price cannot be negative'),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

type TrekFormData = z.infer<typeof trekSchema>;

export default function TrekForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState('');
  
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState('');
  
  const [thingsToCarry, setThingsToCarry] = useState<string[]>([]);
  const [newThingToCarry, setNewThingToCarry] = useState('');
  
  const [itinerary, setItinerary] = useState<TrekItineraryDay[]>([]);
  
  const [images, setImages] = useState<{ id?: string; url: string; is_primary: boolean }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<TrekFormData>({
    resolver: zodResolver(trekSchema),
    defaultValues: {
      name: '',
      destination: '',
      duration: '',
      difficulty: 'moderate',
      altitude: '',
      distance: '',
      description: '',
      important_notes: '',
      price_per_person: 0,
      is_featured: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (id) {
      fetchTrek();
    }
  }, [id]);

  const fetchTrek = async () => {
    const { data, error } = await supabase
      .from('treks')
      .select('*, trek_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Trek not found');
      navigate('/admin/treks');
      return;
    }

    form.reset({
      name: data.name,
      destination: data.destination,
      duration: data.duration,
      difficulty: data.difficulty as TrekDifficulty,
      altitude: data.altitude || '',
      distance: data.distance || '',
      description: data.description || '',
      important_notes: data.important_notes || '',
      price_per_person: data.price_per_person,
      is_featured: data.is_featured || false,
      is_active: data.is_active ?? true,
    });

    setHighlights(Array.isArray(data.highlights) ? data.highlights as string[] : []);
    setInclusions(Array.isArray(data.inclusions) ? data.inclusions as string[] : []);
    setExclusions(Array.isArray(data.exclusions) ? data.exclusions as string[] : []);
    setThingsToCarry(Array.isArray(data.things_to_carry) ? data.things_to_carry as string[] : []);
    setItinerary(Array.isArray(data.itinerary) ? data.itinerary as unknown as TrekItineraryDay[] : []);
    setImages(data.trek_images || []);
  };

  const addListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    newItem: string,
    setNewItem: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newItem.trim() && !list.includes(newItem.trim())) {
      setList([...list, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: itinerary.length + 1,
        title: '',
        description: '',
        activities: [],
      },
    ]);
  };

  const updateItineraryDay = (index: number, field: keyof TrekItineraryDay, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    // Renumber days
    setItinerary(updated.map((day, i) => ({ ...day, day: i + 1 })));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${id || 'new'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('treks')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('treks')
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
      await supabase.from('trek_images').delete().eq('id', image.id);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    if (image.is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    setImages(newImages);
  };

  const onSubmit = async (data: TrekFormData) => {
    setLoading(true);

    const trekData = {
      ...data,
      highlights,
      inclusions,
      exclusions,
      things_to_carry: thingsToCarry,
      itinerary: itinerary as unknown as any,
      altitude: data.altitude || null,
      distance: data.distance || null,
      description: data.description || null,
      important_notes: data.important_notes || null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from('treks')
        .update(trekData as any)
        .eq('id', id);

      if (error) {
        toast.error('Failed to update trek');
        setLoading(false);
        return;
      }

      // Update images
      await supabase.from('trek_images').delete().eq('trek_id', id);
      if (images.length > 0) {
        await supabase.from('trek_images').insert(
          images.map((img, i) => ({
            trek_id: id,
            url: img.url,
            is_primary: img.is_primary,
            display_order: i,
          }))
        );
      }

      toast.success('Trek updated successfully');
    } else {
      const { data: newTrek, error } = await supabase
        .from('treks')
        .insert(trekData as any)
        .select()
        .single();

      if (error || !newTrek) {
        toast.error('Failed to create trek');
        setLoading(false);
        return;
      }

      // Add images
      if (images.length > 0) {
        await supabase.from('trek_images').insert(
          images.map((img, i) => ({
            trek_id: newTrek.id,
            url: img.url,
            is_primary: img.is_primary,
            display_order: i,
          }))
        );
      }

      toast.success('Trek created successfully');
    }

    setLoading(false);
    navigate('/admin/treks');
  };

  const ListEditor = ({
    label,
    items,
    setItems,
    newItem,
    setNewItem,
    placeholder,
  }: {
    label: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    newItem: string;
    setNewItem: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addListItem(items, setItems, newItem, setNewItem);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => addListItem(items, setItems, newItem, setNewItem)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm"
          >
            <span className="flex-1">{item}</span>
            <button
              type="button"
              onClick={() => removeListItem(items, setItems, index)}
              className="hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/treks')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-heading font-bold">
            {isEditing ? 'Edit Trek' : 'Add New Trek'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update trek details' : 'Add a new trekking package'}
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trek Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Kudremukh Trek" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Chikkamagaluru" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2 Days / 1 Night" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(TREK_DIFFICULTIES).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="altitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altitude</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1,894 m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 20-22 km" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Trek description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_per_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Person (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ListEditor
                  label="Highlights"
                  items={highlights}
                  setItems={setHighlights}
                  newItem={newHighlight}
                  setNewItem={setNewHighlight}
                  placeholder="Add a highlight..."
                />

                <ListEditor
                  label="Inclusions"
                  items={inclusions}
                  setItems={setInclusions}
                  newItem={newInclusion}
                  setNewItem={setNewInclusion}
                  placeholder="Add an inclusion..."
                />

                <ListEditor
                  label="Exclusions"
                  items={exclusions}
                  setItems={setExclusions}
                  newItem={newExclusion}
                  setNewItem={setNewExclusion}
                  placeholder="Add an exclusion..."
                />

                <ListEditor
                  label="Things to Carry"
                  items={thingsToCarry}
                  setItems={setThingsToCarry}
                  newItem={newThingToCarry}
                  setNewItem={setNewThingToCarry}
                  placeholder="Add an item..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Itinerary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Itinerary</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
            </CardHeader>
            <CardContent>
              {itinerary.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No itinerary days added. Click "Add Day" to start.
                </p>
              ) : (
                <div className="space-y-4">
                  {itinerary.map((day, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex items-center text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-primary">Day {day.day}</span>
                          <Input
                            value={day.title}
                            onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                            placeholder="Day title (e.g., Arrival & Base Camp)"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItineraryDay(index)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                          placeholder="Day description..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="important_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Any important notes for trekkers..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      alt={`Trek ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 ${
                        image.is_primary ? 'border-primary' : 'border-transparent'
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setPrimaryImage(index)}
                        disabled={image.is_primary}
                      >
                        {image.is_primary ? 'Primary' : 'Set Primary'}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
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
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="mb-0">Active</FormLabel>
                      <FormDescription>Trek is available for booking</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="mb-0">Featured</FormLabel>
                      <FormDescription>Show on homepage</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/treks')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Trek' : 'Create Trek'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
