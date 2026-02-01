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
import { Loader2, Save, Building2, Mail, Share2, MessageCircle } from 'lucide-react';
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

  // Floating buttons state
  const [whatsappNumber, setWhatsappNumber] = useState(COMPANY_INFO.phones[0]);
  const [floatingButtonsEnabled, setFloatingButtonsEnabled] = useState(true);
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

      setWhatsappNumber(getValue('whatsapp_number', COMPANY_INFO.phones[0]));
      setFloatingButtonsEnabled(getValue('floating_buttons_enabled', 'true') !== 'false');
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

  const saveFloatingButtonSettings = () => {
    saveMutation.mutate([
      { key: 'whatsapp_number', value: whatsappNumber },
      { key: 'floating_buttons_enabled', value: floatingButtonsEnabled.toString() },
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
        <TabsList className="flex-wrap">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="floating" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Floating Buttons
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
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

        {/* Floating Buttons Tab */}
        <TabsContent value="floating">
          <Card>
            <CardHeader>
              <CardTitle>Floating Contact Buttons</CardTitle>
              <CardDescription>
                Configure the sticky WhatsApp and Phone buttons that appear on all pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Enable Floating Buttons</Label>
                  <p className="text-sm text-muted-foreground">
                    Show WhatsApp and Phone buttons on all pages
                  </p>
                </div>
                <Switch
                  checked={floatingButtonsEnabled}
                  onCheckedChange={setFloatingButtonsEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 86188 25738"
                />
                <p className="text-sm text-muted-foreground">
                  Enter the phone number with country code (e.g., +91 86188 25738)
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Preview</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The buttons will appear at the bottom-right corner of every page.
                </p>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-white">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <Button onClick={saveFloatingButtonSettings} disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Floating Button Settings
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
