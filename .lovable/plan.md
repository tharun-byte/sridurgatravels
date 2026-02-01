

# Fix Vehicle/Trek Images and Broken Buttons

## Overview
This plan addresses three critical issues:
1. "View Details" and "Book Now" buttons not working due to HTML nesting issues
2. Vehicle images not displaying (database has empty `vehicle_images` arrays)
3. Trek images need to be sourced from the internet

---

## Phase 1: Fix Broken Buttons (Link/Button Nesting)

### Root Cause
The current implementation has a `<Link>` wrapping a `<Button>`:
```jsx
<Link to="/rentals/...">
  <Button>View Details</Button>
</Link>
```

This creates invalid HTML (interactive element inside interactive element) and React warns about function components not receiving refs properly.

### Solution
Use the shadcn Button's `asChild` prop with Link as the child. This merges the Link and Button into a single clickable element.

**File: `src/components/home/VehicleCard.tsx`**
```jsx
// Before
<Link to={`/rentals/${vehicle.id}`} className="flex-1">
  <Button variant="outline" className="w-full">View Details</Button>
</Link>

// After
<Button variant="outline" className="w-full flex-1" asChild>
  <Link to={`/rentals/${vehicle.id}`}>View Details</Link>
</Button>
```

**File: `src/components/home/TrekCard.tsx`**
Same pattern for the "View Details" button.

---

## Phase 2: Add Vehicle Images to Database

### Current State
The network responses show `vehicle_images: []` for all vehicles. The images exist in `public/images/vehicles/` but aren't linked in the database.

### Solution
Insert records into the `vehicle_images` table mapping each vehicle to its correct image. This requires a database migration to insert the image records.

**Vehicle-to-Image Mapping:**

| Vehicle Name | Image Path |
|-------------|------------|
| Kia Carens | `/images/vehicles/kia-carens.avif` |
| Toyota Etios | `/images/vehicles/toyota-etios.avif` |
| Innova Crysta | `/images/vehicles/innova-crysta.avif` |
| Innova Hycross | `/images/vehicles/innova-hycross.avif` |
| AC TT 13 Seater (Luxury) | `/images/vehicles/tt-13-seater.jpg` |
| Urbania Luxury 16 Seater | `/images/vehicles/urbania-luxury.jpg` |
| 21 Seater Mini-bus | `/images/vehicles/21-seater.jpeg` |
| 25 Seater Mini-bus | `/images/vehicles/25-seater.jpeg` |
| 33 Seater Coach | `/images/vehicles/33-seater.jpeg` |
| 49 Seater (3+2) | `/images/vehicles/49-seater.jpeg` |
| 40 Seater (2+2) Luxury | `/images/vehicles/40-seater.jpeg` |
| Benz 45 Seater (2+2) | `/images/vehicles/benz-45.jpeg` |
| Volvo AC 45 Seater | `/images/vehicles/volvo-45-2x2.jpeg` |
| Volvo AC 49 Seater | `/images/vehicles/volvo-49.jpg` |

### Database Migration
```sql
-- Insert vehicle images by matching vehicle names
INSERT INTO vehicle_images (vehicle_id, url, is_primary, display_order)
SELECT v.id, 
  CASE 
    WHEN v.name ILIKE '%Kia Carens%' THEN '/images/vehicles/kia-carens.avif'
    WHEN v.name ILIKE '%Etios%' THEN '/images/vehicles/toyota-etios.avif'
    WHEN v.name ILIKE '%Crysta%' THEN '/images/vehicles/innova-crysta.avif'
    WHEN v.name ILIKE '%Hycross%' THEN '/images/vehicles/innova-hycross.avif'
    WHEN v.name ILIKE '%TT 13%' THEN '/images/vehicles/tt-13-seater.jpg'
    WHEN v.name ILIKE '%Urbania%' THEN '/images/vehicles/urbania-luxury.jpg'
    WHEN v.name ILIKE '%21 Seater%' THEN '/images/vehicles/21-seater.jpeg'
    WHEN v.name ILIKE '%25 Seater%' THEN '/images/vehicles/25-seater.jpeg'
    WHEN v.name ILIKE '%33 Seater%' THEN '/images/vehicles/33-seater.jpeg'
    WHEN v.name ILIKE '%49 Seater%' AND v.name ILIKE '%3+2%' THEN '/images/vehicles/49-seater.jpeg'
    WHEN v.name ILIKE '%40 Seater%' THEN '/images/vehicles/40-seater.jpeg'
    WHEN v.name ILIKE '%Benz%' THEN '/images/vehicles/benz-45.jpeg'
    WHEN v.name ILIKE '%Volvo%' AND v.capacity = 45 THEN '/images/vehicles/volvo-45-2x2.jpeg'
    WHEN v.name ILIKE '%Volvo%' AND v.capacity = 49 THEN '/images/vehicles/volvo-49.jpg'
    ELSE '/placeholder.svg'
  END,
  true,
  0
FROM vehicles v
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_images vi WHERE vi.vehicle_id = v.id
);
```

---

## Phase 3: Add Trek Images to Database

### Solution
Insert records into `trek_images` table with high-quality internet URLs from Unsplash (stable, free to use).

**Trek-to-Image Mapping (using Unsplash):**

| Trek Name | Image URL (Unsplash) |
|----------|---------------------|
| Kudremukh Trek | `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800` |
| Nethravathi Trek | `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800` |
| Gokarna Beach Trek | `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800` |
| Kodaikanal Tour | `https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800` |
| Coorg Tour | `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800` |
| Ooty Tour | `https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800` |
| Chikmagalur Tour | `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800` |
| Wayanad Tour | `https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800` |
| Pondicherry Tour | `https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800` |
| Kurinjal Trek | `https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800` |
| Dudhsagar Trek | `https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800` |
| Tadiandamol Trek | `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800` |
| Gangadikal Trek | `https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800` |
| Kumara Parvatha Trek | `https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800` |
| Kodachadri Trek | `https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800` |
| Bandaje Falls Trek | `https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800` |

### Database Migration
```sql
-- Insert trek images by matching trek names
INSERT INTO trek_images (trek_id, url, is_primary, display_order)
SELECT t.id, 
  CASE 
    WHEN t.name ILIKE '%Kudremukh%' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    WHEN t.name ILIKE '%Nethravathi%' THEN 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
    -- ... (all mappings)
  END,
  true,
  0
FROM treks t
WHERE NOT EXISTS (
  SELECT 1 FROM trek_images ti WHERE ti.trek_id = t.id
);
```

---

## Phase 4: Update DEFAULT_VEHICLES and DEFAULT_TREKS in Constants

Update `src/lib/constants.ts` to use correct image paths for fallback data (when database is empty).

---

## Files to Modify

1. **`src/components/home/VehicleCard.tsx`**
   - Fix Button/Link nesting using `asChild` prop
   - Ensure "View Details" and "Book Now" both work

2. **`src/components/home/TrekCard.tsx`**
   - Fix Button/Link nesting using `asChild` prop
   - Ensure "View Details" and "Book Trek" both work

3. **`src/lib/constants.ts`**
   - Update DEFAULT_VEHICLES with correct local image paths
   - Update DEFAULT_TREKS with Unsplash image URLs

4. **Database Migration**
   - Insert vehicle_images records for all vehicles
   - Insert trek_images records for all treks

---

## Summary

After implementation:
- "View Details" buttons will navigate to `/rentals/:id` and `/trekking/:id`
- "Book Now" buttons will navigate to `/booking?type=...&id=...`
- All vehicle cards will display the correct downloaded images
- All trek cards will display high-quality Unsplash images
- Admin dashboard will show the same images (data comes from database)

