
# Sri Durga Travels - Logo, Banner, and Image Enhancement Plan

## Overview
This plan addresses all the requested improvements including: downloading the proper white logo, removing the company name text from header/footer, making the logo bigger, implementing admin-managed banner images for the home page, and ensuring all vehicle/trek images are properly linked.

---

## Phase 1: Logo Updates

### 1.1 Download and Replace Logo
- Download the white logo from `https://sridurgatravels.com/assets/version-2/img/logo-white.png`
- Replace the current `src/assets/logo-white.png` with the downloaded version (transparent background)

### 1.2 Update Header Component
**File:** `src/components/layout/Header.tsx`

Changes:
- Remove the "Sri Durga Travels" text span completely
- Increase logo height from `h-12` to `h-16` (or larger)
- Keep the logo as the only branding element in the navbar

```text
Before:
  <Link to="/" className="flex items-center gap-3">
    <img src={logoWhite} alt="Sri Durga Travels Logo" className="h-12 w-auto" />
    <span className="font-heading font-bold text-xl text-foreground hidden sm:inline">
      {COMPANY_INFO.name}
    </span>
  </Link>

After:
  <Link to="/" className="flex items-center">
    <img src={logoWhite} alt="Sri Durga Travels Logo" className="h-16 md:h-20 w-auto" />
  </Link>
```

### 1.3 Update Footer Component
**File:** `src/components/layout/Footer.tsx`

Changes:
- Remove the "Sri Durga Travels" text span from the logo section
- Increase logo height from `h-14` to `h-20`
- Keep background color as `#0a1628` (dark navy - matches well with white logo)

---

## Phase 2: Home Page Banner Management (Admin Feature)

### 2.1 Create Banner Settings Table
Create a new database migration for storing banner images:

```sql
CREATE TABLE IF NOT EXISTS banner_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL UNIQUE CHECK (position >= 1 AND position <= 3),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with default banners
INSERT INTO banner_images (position, image_url, title, subtitle, cta_text, cta_link)
VALUES 
  (1, '/images/hero/hero-bus.jpg', 'Book Regular & AC Buses Online', 'Comfortable travel for groups of all sizes with experienced drivers', 'Reserve Your Bus Today', '/rentals'),
  (2, '/images/hero/hero-trekking.jpg', 'Exciting Trekking Trips & Packages', 'Adventure awaits! Explore the Western Ghats with expert guides', 'Book Your Trek Now', '/trekking'),
  (3, '/images/hero/hero-cars.jpg', 'Affordable 5-Seater Car Rentals', 'Premium cars for family trips, airport transfers and outstation journeys', 'Explore Car Rentals', '/rentals');

-- RLS Policies
ALTER TABLE banner_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Banners are publicly viewable" ON banner_images FOR SELECT USING (true);
CREATE POLICY "Managers can update banners" ON banner_images FOR UPDATE USING (is_manager());
```

### 2.2 Create Banner Management Page
**New File:** `src/pages/admin/banners/BannerManager.tsx`

Features:
- Display all 3 banner slots in a grid
- Each slot shows current image preview
- Upload button to replace image (uploads to Supabase Storage)
- Edit title, subtitle, CTA text
- Cannot add new banners (fixed 3 slots)
- Cannot delete banners (only replace)

### 2.3 Update Hero Carousel to Use Database
**File:** `src/components/home/HeroCarousel.tsx`

Changes:
- Fetch banner data from `banner_images` table
- Fall back to static slides if database is empty
- Keep existing animation/styling logic

### 2.4 Add Route for Banner Manager
**File:** `src/App.tsx`

Add route: `/admin/banners` pointing to `BannerManager.tsx`

### 2.5 Update Admin Sidebar
**File:** `src/components/admin/AdminSidebar.tsx`

Add "Banners" link to sidebar navigation

---

## Phase 3: Vehicle Image Updates

### 3.1 Download Vehicle Images
All 14 vehicle images have already been downloaded to `public/images/vehicles/`. The mapping is:

| Vehicle Name | Image File |
|-------------|-----------|
| Kia Carens | `/images/vehicles/kia-carens.avif` |
| Toyota Etios | `/images/vehicles/toyota-etios.avif` |
| Innova Crysta | `/images/vehicles/innova-crysta.avif` |
| Innova Hycross | `/images/vehicles/innova-hycross.avif` |
| AC TT 13 Seater | `/images/vehicles/tt-13-seater.jpg` |
| Urbania Luxury 16 | `/images/vehicles/urbania-luxury.jpg` |
| 21 Seater Mini-bus | `/images/vehicles/21-seater.jpeg` |
| 25 Seater Mini-bus | `/images/vehicles/25-seater.jpeg` |
| 33 Seater Coach | `/images/vehicles/33-seater.jpeg` |
| 49 Seater (3+2) | `/images/vehicles/49-seater.jpeg` |
| 40 Seater (2+2) | `/images/vehicles/40-seater.jpeg` |
| Benz 45 Seater | `/images/vehicles/benz-45.jpeg` |
| Volvo 45 Seater | `/images/vehicles/volvo-45-2x2.jpeg` |
| Volvo 49 Seater | `/images/vehicles/volvo-49.jpg` |

### 3.2 Update Constants File
**File:** `src/lib/constants.ts`

Update `DEFAULT_VEHICLES` array with correct image paths for each vehicle.

### 3.3 Insert Vehicle Images into Database
Run a migration/update to add `vehicle_images` records for all vehicles in the database with the correct image URLs.

---

## Phase 4: Trek Image Updates

### 4.1 Trek Image Files
Trek images are already in `public/images/treks/`. The mapping is:

| Trek Name | Image File |
|----------|-----------|
| Kudremukh Trek | `/images/treks/kudremukh-trek.jpg` |
| Nethravathi Trek | `/images/treks/nethravathi-trek.jpg` |
| Gokarna Beach Trek | `/images/treks/gokarna-beach.jpg` |
| Kodaikanal Tour | `/images/treks/kodaikanal-tour.jpg` |
| Coorg Tour | `/images/treks/coorg-tour.jpg` |
| Ooty Tour | `/images/treks/ooty-tour.jpg` |
| Chikkamagaluru Tour | `/images/treks/chikmagalur-tour.jpg` |
| Wayanad Tour | `/images/treks/wayanad-tour.jpg` |
| Pondicherry Tour | `/images/treks/pondicherry-tour.jpg` |
| Kurinjal Trek | `/images/treks/kurinjal-trek.jpg` |
| Dudhsagar Trek | `/images/treks/dudhsagar-falls.jpg` |
| Tadiandamol Trek | `/images/treks/tadiandamol-trek.jpg` |
| Gangadikal Trek | `/images/treks/gangadikal-trek.jpg` |
| Kumara Parvatha Trek | `/images/treks/kumara-parvatha-trek.jpg` |
| Kodachadri Trek | `/images/treks/kodachadri-trek.jpg` |
| Bandaje Falls Trek | `/images/treks/bandaje-falls.jpg` |

### 4.2 Update Constants File
**File:** `src/lib/constants.ts`

Update `DEFAULT_TREKS` array with correct image paths for each trek.

### 4.3 Insert Trek Images into Database
Run a migration/update to add `trek_images` records for all treks in the database.

---

## Phase 5: Ensure Data Consistency

### 5.1 Verify Vehicle Data in Database
Ensure all 14 vehicles exist in the `vehicles` table with correct:
- Pricing information
- Features
- Image references in `vehicle_images` table

### 5.2 Verify Trek Data in Database
Ensure all 16 treks exist in the `treks` table with correct:
- Pricing information
- Highlights
- Image references in `trek_images` table

---

## Technical Details

### Files to Modify
1. `src/assets/logo-white.png` - Replace with downloaded logo
2. `src/components/layout/Header.tsx` - Remove text, increase logo size
3. `src/components/layout/Footer.tsx` - Remove text, increase logo size
4. `src/components/home/HeroCarousel.tsx` - Fetch banners from database
5. `src/lib/constants.ts` - Update image paths for vehicles and treks
6. `src/App.tsx` - Add banner manager route
7. `src/components/admin/AdminSidebar.tsx` - Add banners link

### New Files to Create
1. `src/pages/admin/banners/BannerManager.tsx` - Banner editing interface

### Database Changes
1. Create `banner_images` table with 3 fixed slots
2. Update `vehicle_images` with correct URLs
3. Update `trek_images` with correct URLs

### Storage Bucket
- Use existing storage bucket or create `banners` bucket for admin-uploaded banner images

---

## Summary

This implementation will:
1. Display only the logo (larger, without text) in header and footer
2. Allow admins to edit the 3 existing home page banners (no add/delete)
3. Ensure all vehicles have their specific images from the provided URLs
4. Ensure all treks have relevant images
5. Keep all admin dashboard functionality working without bugs
