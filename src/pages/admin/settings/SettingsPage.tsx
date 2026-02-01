import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Building2, Mail, Share2 } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

type Setting = { key: string; value: string | null };

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // General settings state
  const [companyName, setCompanyName] = useState(COMPANY_INFO.name);
  const [tagline, setTagline] = useState(COMPANY_INFO.tagline);
  const [email, setEmail] = useState(COMPANY_INFO.email);
  const [phone1, setPhone1] = useState(COMPANY_INFO.phones[0]);
  const [phone2, setPhone2] = useState(COMPANY_INFO.phones[1] || '');
  const [address, setAddress] = useState(COMPANY_INFO.address);
  const [workingHours, setWorkingHours] = useState('Mon-Sat: 9:00 AM - 8:00 PM');

  // Email settings state
  const [resendApiKey, setResendApiKey] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('Sri Durga Travels');

  // Social media state
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) throw error;
      return data;
    },
  });

  // Load settings into state
  useEffect(() => {
    if (settings) {
      const getValue = (key: string, defaultValue: string = '') => {
        const setting = settings.find((s) => s.key === key);
        return setting?.value || defaultValue;
      };

      setCompanyName(getValue('company_name', COMPANY_INFO.name));
      setTagline(getValue('tagline', COMPANY_INFO.tagline));
      setEmail(getValue('email', COMPANY_INFO.email));
      setPhone1(getValue('phone_1', COMPANY_INFO.phones[0]));
      setPhone2(getValue('phone_2', COMPANY_INFO.phones[1] || ''));
      setAddress(getValue('address', COMPANY_INFO.address));
      setWorkingHours(getValue('working_hours', 'Mon-Sat: 9:00 AM - 8:00 PM'));

      setResendApiKey(getValue('resend_api_key'));
      setEmailNotifications(getValue('email_notifications') === 'true');
      setFromEmail(getValue('from_email'));
      setFromName(getValue('from_name', 'Sri Durga Travels'));

      setFacebook(getValue('facebook_url'));
      setInstagram(getValue('instagram_url'));
      setTwitter(getValue('twitter_url'));
      setYoutube(getValue('youtube_url'));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (settingsToSave: Setting[]) => {
      for (const setting of settingsToSave) {
        const { data: existing } = await supabase
          .from('site_settings')
          .select('id')
          .eq('key', setting.key)
          .single();

        if (existing) {
          const { error } = await supabase
            .from('site_settings')
            .update({ value: setting.value, updated_at: new Date().toISOString() })
            .eq('key', setting.key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert({ key: setting.key, value: setting.value });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    },
  });

  const saveGeneralSettings = () => {
    saveMutation.mutate([
      { key: 'company_name', value: companyName },
      { key: 'tagline', value: tagline },
      { key: 'email', value: email },
      { key: 'phone_1', value: phone1 },
      { key: 'phone_2', value: phone2 },
      { key: 'address', value: address },
      { key: 'working_hours', value: workingHours },
    ]);
  };

  const saveEmailSettings = () => {
    saveMutation.mutate([
      { key: 'resend_api_key', value: resendApiKey },
      { key: 'email_notifications', value: emailNotifications.toString() },
      { key: 'from_email', value: fromEmail },
      { key: 'from_name', value: fromName },
    ]);
  };

  const saveSocialSettings = () => {
    saveMutation.mutate([
      { key: 'facebook_url', value: facebook },
      { key: 'instagram_url', value: instagram },
      { key: 'twitter_url', value: twitter },
      { key: 'youtube_url', value: youtube },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Manage your website configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Integration
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details that appear throughout the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone1">Primary Phone</Label>
                  <Input
                    id="phone1"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone2">Secondary Phone</Label>
                  <Input
                    id="phone2"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                />
              </div>
              <Button onClick={saveGeneralSettings} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Integration (Resend)</CardTitle>
              <CardDescription>
                Configure email notifications using Resend API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated emails for bookings and inquiries
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resendApiKey">Resend API Key</Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from{' '}
                  <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    resend.com
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="noreply@yourdomain.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Email Templates (Coming Soon)</h4>
                <p className="text-sm text-muted-foreground">
                  Customize email templates for booking confirmations, inquiries, and more.
                </p>
              </div>

              <Button onClick={saveEmailSettings} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Add your social media profile URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
              <Button onClick={saveSocialSettings} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Social Media Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
