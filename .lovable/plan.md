
# Plan: Fix Contact Page & Add SEO Settings to Admin Dashboard

## Issue 1: Contact Page Crash (CRITICAL BUG)

### Root Cause Analysis
The Contact page at `/contact` is crashing with a `TypeError: i.find is not a function` error. After analyzing the code, I identified the problem:

**The Contact.tsx page has duplicate settings fetching logic** (lines 51-67) that queries `site_settings` directly instead of using the shared `useSiteSettings` hook. This creates a conflict:

1. The `useSiteSettings` hook (used by Header, Footer, FloatingContactButtons) returns a **processed `SiteSettings` object**
2. The Contact page queries the same data with the same query key `['site-settings-public']` but expects **raw array data**
3. When both pages are rendered, React Query may serve cached processed data (object) to the Contact page which then tries to call `.find()` on an object instead of an array - causing the crash

### Solution
Refactor Contact.tsx to use the shared `useSiteSettings()` hook instead of its own inline query. This ensures:
- Consistent data format across all components
- Proper type safety
- No query key conflicts

---

## Issue 2: SEO Settings in Admin Dashboard

### Features to Add
A new "SEO" tab in the admin settings page (`/admin/settings`) with:

**1. Primary Meta Tags**
- Site Title (appears in browser tab)
- Meta Description (max 160 characters, shown in search results)
- Keywords (comma-separated)

**2. Open Graph Settings (Social Sharing)**
- OG Title (for Facebook/LinkedIn shares)
- OG Description
- OG Image URL (recommended 1200x630px)
- OG Type (website, article, etc.)

**3. Twitter Card Settings**
- Twitter Card Type (summary, summary_large_image)
- Twitter Site Handle (@username)

**4. Google Search Preview**
- Live preview showing how the site appears in Google search results

**5. Additional SEO Options**
- Canonical URL
- Robots meta tag (index/noindex, follow/nofollow)

---

## Implementation Steps

### Step 1: Fix Contact.tsx
Replace the inline query with the shared `useSiteSettings()` hook:

```text
Changes to src/pages/Contact.tsx:
- Remove lines 51-67 (duplicate useQuery and getSetting function)
- Import and use useSiteSettings() hook
- Access settings directly: settings?.email, settings?.phones, etc.
```

### Step 2: Add SEO Settings to Admin Dashboard
Modify `src/pages/admin/settings/SettingsPage.tsx`:

```text
New state variables for SEO:
- siteTitle, metaDescription, keywords
- ogTitle, ogDescription, ogImage, ogType
- twitterCard, twitterSite
- canonicalUrl, robotsMeta

New tab: "SEO" with icon Search/Globe

New card sections:
1. Primary Meta Tags card
2. Open Graph Settings card  
3. Twitter Card Settings card
4. Google Preview card (read-only preview)
5. Advanced SEO card

New save function: saveSeoSettings()
```

### Step 3: Extend useSiteSettings Hook
Add SEO fields to the `SiteSettings` interface:

```text
New fields:
- siteTitle: string
- metaDescription: string
- keywords: string
- ogTitle: string
- ogDescription: string
- ogImage: string
- ogType: string
- twitterCard: string
- twitterSite: string
- canonicalUrl: string
- robotsMeta: string
```

### Step 4: Create SEO Component for Frontend
Create a new component `src/components/SEOHead.tsx` using `document.head` manipulation or a custom hook to dynamically inject meta tags:

```text
- Reads SEO settings from useSiteSettings()
- Updates document.title
- Creates/updates meta tags in head
- Handles Open Graph and Twitter tags
```

### Step 5: Integrate SEO into Layout
Add SEO component to `Layout.tsx` so it applies to all public pages.

---

## Files to be Modified

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Contact.tsx` | Modify | Replace inline query with useSiteSettings hook |
| `src/hooks/useSiteSettings.ts` | Modify | Add SEO-related fields to interface and fetching |
| `src/pages/admin/settings/SettingsPage.tsx` | Modify | Add new SEO tab with all settings fields |
| `src/components/SEOHead.tsx` | Create | New component for dynamic meta tag injection |
| `src/components/layout/Layout.tsx` | Modify | Include SEOHead component |

---

## Technical Details

### Contact Page Fix (Critical)
```typescript
// Before (BROKEN):
const { data: settings } = useQuery({
  queryKey: ['site-settings-public'],
  queryFn: async () => {
    const { data } = await supabase.from('site_settings').select('key, value');
    return data; // Returns array
  },
});
const getSetting = (key) => settings.find(s => s.key === key)?.value; // CRASHES if settings is object

// After (FIXED):
const { data: settings } = useSiteSettings();
const companyEmail = settings?.email || COMPANY_INFO.email;
const phones = settings?.phones || COMPANY_INFO.phones;
```

### SEO Settings State Structure
```typescript
// New state in SettingsPage.tsx
const [siteTitle, setSiteTitle] = useState('Sri Durga Travels');
const [metaDescription, setMetaDescription] = useState('');
const [keywords, setKeywords] = useState('');
const [ogTitle, setOgTitle] = useState('');
const [ogDescription, setOgDescription] = useState('');
const [ogImage, setOgImage] = useState('');
const [twitterCard, setTwitterCard] = useState('summary_large_image');
const [canonicalUrl, setCanonicalUrl] = useState('');
const [robotsMeta, setRobotsMeta] = useState('index, follow');
```

### SEOHead Component Logic
```typescript
// Uses useEffect to update document head
useEffect(() => {
  document.title = settings?.siteTitle || 'Sri Durga Travels';
  
  // Update or create meta tags
  updateMetaTag('description', settings?.metaDescription);
  updateMetaTag('keywords', settings?.keywords);
  updateMetaTag('og:title', settings?.ogTitle || settings?.siteTitle);
  // ... etc
}, [settings]);
```

---

## Expected Outcome
1. Contact page loads without crashing
2. Admin can configure all SEO settings from `/admin/settings`
3. SEO meta tags are dynamically applied across the entire website
4. Google/social previews show properly configured information
