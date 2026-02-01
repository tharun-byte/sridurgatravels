
# Sri Durga Travels - Complete Feature Implementation Plan

## Overview
This plan addresses all the requested improvements including: adding the logo to navbar/footer, implementing icon-style banner navigation, fixing admin dashboard pages, improving user dashboard design, seeding all vehicles/treks data, and implementing complete admin management workflows.

---

## 1. Logo Integration

### Navbar Changes (`src/components/layout/Header.tsx`)
- Copy the uploaded logo image to `src/assets/logo.png`
- Replace the current "SD" circle placeholder with the actual logo image
- Display logo at 40-50px height with proper aspect ratio
- Keep "Sri Durga Travels" text on larger screens

### Footer Changes (`src/components/layout/Footer.tsx`)
- Add the same logo to the footer company info section
- Style consistently with the navbar

---

## 2. Hero Carousel Icon Navigation

### Updated Banner Controls (`src/components/home/HeroCarousel.tsx`)
Based on the reference screenshot, replace static dot indicators with icon-style buttons:
- **Sleeper Bus Booking** icon (Bus icon with label)
- **Trekking** icon (Hiking/backpack icon with label) - highlighted in red when active
- **Cars And Bus Rentals** icon (Car/bus icon with label)
- Position these at the bottom of the carousel with horizontal layout
- Active slide shows corresponding icon in primary color (#FA4318)
- Add arrow navigation on the right side

---

## 3. Admin Dashboard - Missing Pages

### 3.1 Bookings Management (`src/pages/admin/bookings/BookingList.tsx`)
Create a complete bookings management page with:
- Table view with columns: ID, Customer, Type (Vehicle/Trek), Date, Status, Price
- Filter by status (Pending, Confirmed, Cancelled, Completed)
- Filter by booking type (Vehicle, Trek)
- Status update functionality
- Admin notes field
- View booking details modal
- Delete booking (Super Admin only)

### 3.2 Messages Management (`src/pages/admin/messages/MessageList.tsx`)
Create contact messages management:
- Table view showing all contact form submissions
- Columns: Name, Email, Phone, Subject, Date, Status (Read/Unread)
- Mark as read/unread toggle
- Delete message functionality
- View full message in modal
- Reply option (opens email client for now, Resend integration later)

### 3.3 Gallery Management (`src/pages/admin/gallery/GalleryManager.tsx`)
Create full gallery CRUD:
- Grid view of all gallery images
- Upload new images to Supabase storage (gallery bucket)
- Edit image caption
- Reorder images (drag & drop or display_order field)
- Delete images
- Category management (optional)

### 3.4 Settings Management (`src/pages/admin/settings/SettingsPage.tsx`)
Create site settings page with tabs:

**General Tab:**
- Company name, tagline, email, phones, address
- Save to `site_settings` table with key-value pairs

**Email Integration Tab:**
- Resend API Key input field (stored as secret/setting)
- Toggle to enable/disable email notifications
- Email template preview (placeholder for future)

**Social Media Tab:**
- Facebook, Instagram, Twitter, YouTube URLs

---

## 4. User Dashboard Redesign (`src/pages/user/Dashboard.tsx`)

Implement a modern, sleek dashboard design:

### Layout
- Full-width header with logo, user avatar, and sign-out
- Sidebar navigation (collapsible on mobile)
- Main content area with cards

### Sections
- **Welcome Banner**: Personalized greeting with user name
- **Profile Card**: Avatar, name, email, phone with edit option
- **My Bookings**: 
  - Active/Upcoming bookings with countdown
  - Past bookings history
  - Booking status badges (Pending: yellow, Confirmed: green, etc.)
- **Quick Actions**: Book Vehicle, Book Trek, View Gallery, Contact Us
- **Recent Activity**: Timeline of recent interactions

### Styling
- Use gradient backgrounds for cards
- Add subtle shadows and rounded corners
- Implement hover animations
- Use the primary orange (#FA4318) as accent color

---

## 5. Database Seeding - Vehicles & Treks

### Vehicles to Seed (14 total)
Using the provided pricing data, insert all vehicles into the database:

| Vehicle | Capacity | Base Price | Extra Hour | Extra KM | Driver Bata |
|---------|----------|------------|------------|----------|-------------|
| AC TT 13 Luxury | 13 | ₹4,500 | ₹450 | ₹29 | ₹600 |
| Urbania Luxury 16 | 16 | ₹7,000 | ₹450 | ₹40 | ₹700 |
| 21 Seater | 21 | ₹8,500 | ₹500 | ₹38 | ₹800 |
| 25 Seater | 25 | ₹9,500 | ₹500 | ₹45 | ₹800 |
| 33 Seater | 33 | ₹11,000 | ₹600 | ₹50 | ₹900 |
| 49 Seater (3+2) | 49 | ₹12,000 | ₹600 | ₹52 | ₹900 |
| 40 Seater (2+2) | 40 | ₹16,000 | ₹1,500 | ₹65 | ₹1,250 |
| Benz 45 Seater | 45 | ₹16,000 | ₹1,500 | ₹65 | ₹1,250 |
| Volvo 45 Seater | 45 | ₹16,000 | ₹1,500 | ₹65 | ₹1,250 |
| Volvo 49 Seater | 49 | ₹16,000 | ₹1,500 | ₹65 | ₹1,250 |
| Kia Carens | 7 | ₹3,500 | - | ₹16 | - |
| Toyota Etios | 4 | ₹1,300 | - | - | - |
| Innova Crysta | 7 | ₹1,800 | - | - | - |
| Innova Hycross | 6 | ₹2,499 | - | - | - |

### Treks to Seed (16 total)
All trek packages with reviews:

| Trek | Price | Duration | Reviews |
|------|-------|----------|---------|
| Pondicherry Tour | ₹5,299 | 2D/1N | 7 |
| Chikkamagaluru Tour | ₹4,499 | 2D/1N | 0 |
| Coorg Tour | ₹4,499 | 2D/1N | 2 |
| Wayanad Tour | ₹5,499 | 2D/1N | 1 |
| Kodaikanal Tour | ₹5,499 | 2D/1N | 3 |
| Ooty Tour | ₹5,499 | 2D/1N | 1 |
| Kurinjal Trek | ₹3,299 | 2D/1N | 2 |
| Dudhsagar & Dandeli | ₹4,999 | 2D/1N | 291 |
| Gokarna Beach Trek | ₹3,299 | 2D/1N | 118 |
| Tadiandamol Trek | ₹3,299 | 2D/1N | 3 |
| Gangadikal Trek | ₹3,299 | 2D/1N | 0 |
| Kumara Parvatha Trek | ₹3,299 | 2D/1N | 0 |
| Kodachadri Trek | ₹3,299 | 2D/1N | 15 |
| Bandaje Trek | ₹3,299 | 2D/1N | 6 |
| Nethravathi Trek | ₹3,899 | 2D/1N | 13 |
| Kuduremukha Trek | ₹3,899 | 2D/1N | 3 |

---

## 6. Reviews/Testimonials Management

### Database Schema Update
Add a `trek_reviews` table to track per-trek reviews:
```sql
CREATE TABLE trek_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id UUID REFERENCES treks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Admin Testimonials Page (`src/pages/admin/testimonials/TestimonialList.tsx`)
- Manage site-wide testimonials (existing table)
- Add/Edit/Delete testimonials
- Toggle featured status

---

## 7. Contact Page Admin Editing

### Implementation
- Contact info (phone, email, address, working hours) pulled from `site_settings` table
- Admin can update via Settings page
- Contact page dynamically reads from database with fallback to constants

---

## 8. File Structure - New Files to Create

```text
src/
├── assets/
│   └── logo.png (copy from uploaded image)
├── pages/admin/
│   ├── bookings/
│   │   └── BookingList.tsx
│   ├── messages/
│   │   └── MessageList.tsx
│   ├── gallery/
│   │   └── GalleryManager.tsx
│   ├── settings/
│   │   └── SettingsPage.tsx
│   └── testimonials/
│       └── TestimonialList.tsx
```

---

## 9. Routes Update (`src/App.tsx`)

Add new admin routes:
```tsx
<Route path="bookings" element={<BookingList />} />
<Route path="messages" element={<MessageList />} />
<Route path="gallery" element={<GalleryManager />} />
<Route path="settings" element={<SettingsPage />} />
<Route path="testimonials" element={<TestimonialList />} />
```

---

## 10. Technical Implementation Details

### Image Uploads (Vehicle/Trek/Gallery)
- Use Supabase Storage buckets (already exist: `vehicles`, `treks`, `gallery`)
- Implement upload component with preview
- Store public URLs in database

### Settings Storage Pattern
```typescript
// Key-value pairs in site_settings table
{ key: 'company_name', value: 'Sri Durga Travels' }
{ key: 'email', value: 'contact@sridurgatravels.com' }
{ key: 'phone_1', value: '+91 86188 25738' }
{ key: 'resend_api_key', value: '...' }
```

### Dynamic Contact Page
- Fetch settings on page load
- Merge with defaults from constants
- Display dynamically

---

## Implementation Order

1. **Phase 1 - Logo & Banner** (Quick Wins)
   - Copy logo file
   - Update Header and Footer
   - Update HeroCarousel with icon navigation

2. **Phase 2 - Admin Pages** (Core Functionality)
   - BookingList
   - MessageList
   - GalleryManager
   - SettingsPage
   - Update App.tsx routes

3. **Phase 3 - Database Seeding**
   - Seed vehicles with all data
   - Seed treks with all data
   - Add vehicle/trek images

4. **Phase 4 - User Dashboard Redesign**
   - Modern layout implementation
   - Booking history display
   - Profile management

5. **Phase 5 - Dynamic Contact & Reviews**
   - Update Contact page to use settings
   - Add reviews/testimonials management

---

## Summary

This comprehensive plan covers:
- Logo integration in navbar and footer
- Icon-style banner navigation matching the reference design
- 5 new admin pages (Bookings, Messages, Gallery, Settings, Testimonials)
- Modern user dashboard redesign
- Complete vehicle and trek data seeding
- Admin-editable contact information
- Reviews/testimonials management
- Email integration preparation for Resend API
