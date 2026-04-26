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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Building2, Mail, Share2, MessageCircle, Search, Globe, Eye, Send, Bot, Bell, TestTube2 } from 'lucide-react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
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

  // Telegram settings state
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testingTelegram, setTestingTelegram] = useState(false);

  // AI settings state
  const [nvidiaApiKey, setNvidiaApiKey] = useState('');
  const [aiModel, setAiModel] = useState('meta/llama-3.3-70b-instruct');
  const [aiWidgetEnabled, setAiWidgetEnabled] = useState(true);
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState('');

  // Social media state
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  // Floating buttons state
  const [whatsappNumber, setWhatsappNumber] = useState(COMPANY_INFO.phones[0]);
  const [floatingButtonsEnabled, setFloatingButtonsEnabled] = useState(true);

  // SEO settings state
  const [siteTitle, setSiteTitle] = useState(COMPANY_INFO.name);
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsMeta, setRobotsMeta] = useState('index, follow');

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

      setTelegramBotToken(getValue('telegram_bot_token'));
      setTelegramChatId(getValue('telegram_chat_id', '914958962'));
      setNotificationsEnabled(getValue('notifications_enabled', 'true') !== 'false');

      setNvidiaApiKey(getValue('nvidia_api_key'));
      setAiModel(getValue('ai_model', 'meta/llama-3.3-70b-instruct'));
      setAiWidgetEnabled(getValue('ai_widget_enabled', 'true') !== 'false');
      setAiWelcomeMessage(getValue('ai_welcome_message'));

      setFacebook(getValue('facebook_url'));
      setInstagram(getValue('instagram_url'));
      setTwitter(getValue('twitter_url'));
      setYoutube(getValue('youtube_url'));

      setWhatsappNumber(getValue('whatsapp_number', COMPANY_INFO.phones[0]));
      setFloatingButtonsEnabled(getValue('floating_buttons_enabled', 'true') !== 'false');

      // SEO settings
      setSiteTitle(getValue('seo_site_title', COMPANY_INFO.name));
      setMetaDescription(getValue('seo_meta_description', ''));
      setKeywords(getValue('seo_keywords', ''));
      setOgTitle(getValue('seo_og_title', ''));
      setOgDescription(getValue('seo_og_description', ''));
      setOgImage(getValue('seo_og_image', ''));
      setOgType(getValue('seo_og_type', 'website'));
      setTwitterCard(getValue('seo_twitter_card', 'summary_large_image'));
      setTwitterSite(getValue('seo_twitter_site', ''));
      setCanonicalUrl(getValue('seo_canonical_url', ''));
      setRobotsMeta(getValue('seo_robots_meta', 'index, follow'));
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
      queryClient.invalidateQueries({ queryKey: ['site-settings-public'] });
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

  const saveTelegramSettings = () => {
    saveMutation.mutate([
      { key: 'telegram_bot_token', value: telegramBotToken },
      { key: 'telegram_chat_id', value: telegramChatId },
      { key: 'notifications_enabled', value: notificationsEnabled.toString() },
    ]);
  };

  const saveAiSettings = () => {
    saveMutation.mutate([
      { key: 'nvidia_api_key', value: nvidiaApiKey },
      { key: 'ai_model', value: aiModel },
      { key: 'ai_widget_enabled', value: aiWidgetEnabled.toString() },
      { key: 'ai_welcome_message', value: aiWelcomeMessage },
    ]);
  };

  const sendTestTelegram = async () => {
    setTestingTelegram(true);
    try {
      const { error } = await supabaseClient.functions.invoke('send-notification', {
        body: {
          type: 'admin_login',
          data: { email: 'test@sridurgatravels.com — this is a test notification ✅' },
        },
      });
      if (error) throw error;
      toast({ title: '✅ Test sent!', description: 'Check your Telegram and email.' });
    } catch (err) {
      toast({ title: 'Test failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setTestingTelegram(false);
    }
  };

  const saveSeoSettings = () => {
    saveMutation.mutate([
      { key: 'seo_site_title', value: siteTitle },
      { key: 'seo_meta_description', value: metaDescription },
      { key: 'seo_keywords', value: keywords },
      { key: 'seo_og_title', value: ogTitle },
      { key: 'seo_og_description', value: ogDescription },
      { key: 'seo_og_image', value: ogImage },
      { key: 'seo_og_type', value: ogType },
      { key: 'seo_twitter_card', value: twitterCard },
      { key: 'seo_twitter_site', value: twitterSite },
      { key: 'seo_canonical_url', value: canonicalUrl },
      { key: 'seo_robots_meta', value: robotsMeta },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Google Search Preview component
  const GoogleSearchPreview = () => {
    const previewTitle = siteTitle || COMPANY_INFO.name;
    const previewDescription = metaDescription || 'No description set';
    const previewUrl = canonicalUrl || 'https://sridurgatravels.lovable.app';
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Eye className="h-3 w-3" /> Google Search Preview
        </p>
        <div className="space-y-1">
          <p className="text-sm text-green-700 truncate">{previewUrl}</p>
          <h3 className="text-xl text-blue-800 hover:underline cursor-pointer truncate">
            {previewTitle.length > 60 ? previewTitle.substring(0, 60) + '...' : previewTitle}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {previewDescription.length > 160 ? previewDescription.substring(0, 160) + '...' : previewDescription}
          </p>
        </div>
      </div>
    );
  };

  // Social Share Preview component
  const SocialSharePreview = () => {
    const previewTitle = ogTitle || siteTitle || COMPANY_INFO.name;
    const previewDescription = ogDescription || metaDescription || 'No description set';
    
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <p className="text-xs text-muted-foreground p-2 border-b flex items-center gap-1">
          <Share2 className="h-3 w-3" /> Social Share Preview (Facebook/LinkedIn)
        </p>
        {ogImage && (
          <div className="aspect-video bg-muted relative">
            <img 
              src={ogImage} 
              alt="OG Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        {!ogImage && (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No image set</p>
          </div>
        )}
        <div className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground uppercase">sridurgatravels.lovable.app</p>
          <h4 className="font-semibold text-sm line-clamp-2">{previewTitle}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{previewDescription}</p>
        </div>
      </div>
    );
  };

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
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
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
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
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

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-6">
          {/* Primary Meta Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Primary Meta Tags
              </CardTitle>
              <CardDescription>
                Configure the main meta tags that affect how your site appears in search results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="Sri Durga Travels - Bus & Trek Booking"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {siteTitle.length}/60 characters (recommended max 60)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Book buses, cars, and trekking packages with Sri Durga Travels. Reliable transport services and adventure tours in Karnataka."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription.length}/160 characters (recommended max 160)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="bus booking, trek packages, Karnataka tours, travel services"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated keywords for search engines
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://sridurgatravels.lovable.app"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="robotsMeta">Robots Meta</Label>
                  <Select value={robotsMeta} onValueChange={setRobotsMeta}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">Index, Follow (Recommended)</SelectItem>
                      <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                      <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                      <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Graph Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Open Graph Settings
              </CardTitle>
              <CardDescription>
                Configure how your site appears when shared on Facebook, LinkedIn, and other platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Leave empty to use Site Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogType">OG Type</Label>
                  <Select value={ogType} onValueChange={setOgType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="business.business">Business</SelectItem>
                      <SelectItem value="place">Place</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Leave empty to use Meta Description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://example.com/image.jpg (Recommended: 1200x630px)"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200x630 pixels for optimal display on social media
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Twitter Card Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Twitter Card Settings</CardTitle>
              <CardDescription>
                Configure how your site appears when shared on Twitter/X
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Twitter Card Type</Label>
                  <Select value={twitterCard} onValueChange={setTwitterCard}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterSite">Twitter Site Handle</Label>
                  <Input
                    id="twitterSite"
                    value={twitterSite}
                    onChange={(e) => setTwitterSite(e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previews */}
          <Card>
            <CardHeader>
              <CardTitle>Live Previews</CardTitle>
              <CardDescription>
                See how your site will appear in search results and social shares
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GoogleSearchPreview />
                <SocialSharePreview />
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSeoSettings} disabled={saveMutation.isPending} size="lg">
            {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save SEO Settings
          </Button>
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
        {/* Telegram & Notifications Tab */}
        <TabsContent value="telegram">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure real-time Telegram and email alerts for bookings, contact forms, and admin activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Enable All Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Master switch — turns off Telegram + email notifications globally
                    </p>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegramBotToken">Telegram Bot Token</Label>
                  <Input
                    id="telegramBotToken"
                    type="password"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="8790287057:AAHXf07z2T74PmSZTQqnbTJbQfyUA3W7jhI"
                  />
                  <p className="text-sm text-muted-foreground">
                    Get from <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@BotFather</a> on Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
                  <Input
                    id="telegramChatId"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="914958962"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your personal Telegram user ID. Use <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@userinfobot</a> to find it
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={saveTelegramSettings} disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    Save Telegram Settings
                  </Button>
                  <Button variant="outline" onClick={sendTestTelegram} disabled={testingTelegram}>
                    {testingTelegram
                      ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                      : <><TestTube2 className="h-4 w-4 mr-2" />Send Test Notification</>
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events That Trigger Notifications</CardTitle>
                <CardDescription>All of these events send alerts to Telegram + admin email, and confirmation emails to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[
                    { icon: '🎉', event: 'New Booking', desc: 'Vehicle rental or trek booking placed', admin: true, user: true },
                    { icon: '📬', event: 'Contact Form', desc: 'Visitor submits the contact form', admin: true, user: true },
                    { icon: '👤', event: 'New User Registration', desc: 'Someone creates a new account', admin: true, user: true },
                    { icon: '🔐', event: 'Admin Login', desc: 'Admin signs into the dashboard', admin: true, user: false },
                    { icon: '🔄', event: 'Booking Status Changed', desc: 'Admin updates a booking status', admin: false, user: true },
                  ].map(item => (
                    <div key={item.event} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <p className="font-medium">{item.event}</p>
                          <p className="text-muted-foreground text-xs">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        {item.admin && <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Admin</span>}
                        {item.user && <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full font-medium">User</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Chat Widget
                </CardTitle>
                <CardDescription>
                  Configure the Durga AI assistant that appears on all public pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Enable AI Chat Widget</Label>
                    <p className="text-sm text-muted-foreground">
                      Show the floating Durga AI button on all public pages
                    </p>
                  </div>
                  <Switch checked={aiWidgetEnabled} onCheckedChange={setAiWidgetEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nvidiaApiKey">NVIDIA API Key</Label>
                  <Input
                    id="nvidiaApiKey"
                    type="password"
                    value={nvidiaApiKey}
                    onChange={(e) => setNvidiaApiKey(e.target.value)}
                    placeholder="nvapi-xxxxxxxxxxxxxxxx"
                  />
                  <p className="text-sm text-muted-foreground">
                    Get from <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">build.nvidia.com</a>. Also used for LLM-generated notification content.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiModel">AI Model</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger id="aiModel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta/llama-3.3-70b-instruct">meta/llama-3.3-70b-instruct (Recommended)</SelectItem>
                      <SelectItem value="meta/llama-3.1-8b-instruct">meta/llama-3.1-8b-instruct (Faster)</SelectItem>
                      <SelectItem value="nvidia/llama-3.1-nemotron-70b-instruct">nvidia/nemotron-70b (Most capable)</SelectItem>
                      <SelectItem value="mistralai/mistral-7b-instruct-v0.3">mistralai/mistral-7b-instruct (Lightweight)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiWelcomeMessage">Custom Welcome Message (optional)</Label>
                  <Textarea
                    id="aiWelcomeMessage"
                    value={aiWelcomeMessage}
                    onChange={(e) => setAiWelcomeMessage(e.target.value)}
                    placeholder="Namaste! 🙏 I'm Durga, your Sri Durga Travels assistant..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to use the default welcome message
                  </p>
                </div>

                <Button onClick={saveAiSettings} disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save AI Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Features Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { icon: '🌐', title: 'Multi-language', desc: 'Responds in any language — Telugu, Hindi, English, Kannada, Tamil and more' },
                  { icon: '🏔️', title: 'Business knowledge', desc: 'Knows all about Sri Durga Travels services, pricing, trekking packages, and vehicle rentals' },
                  { icon: '📧', title: 'Smart notifications', desc: 'NVIDIA LLM writes personalized email + Telegram content for every notification event' },
                  { icon: '💬', title: 'Multi-turn chat', desc: 'Maintains full conversation context for natural, flowing conversations' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <p className="font-medium">{f.title}</p>
                      <p className="text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
