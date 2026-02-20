
# Plan: Fix Admin Trek Editing & Populate All Trek Packages with Full Content

## Root Cause Analysis

After thoroughly reviewing the codebase, there are **two separate problems**:

### Problem 1: Admin Cannot Edit Treks (Auth/RLS Issue)

The `TrekForm.tsx` code is structurally correct — it calls `supabase.from('treks').update(...)`. The issue is **role assignment**. Here is why:

The RLS policies on the `treks` table require:
- UPDATE: `is_manager()` — which means the user must have `manager` or `super_admin` role in the `user_roles` table
- DELETE on `trek_images`: `is_manager()` — same

The test account `testadmin@sridurgatravels.com` likely exists in `auth.users` but may **not have a role assigned** in the `user_roles` table, causing all UPDATE/DELETE operations to silently fail (the UI shows no error but nothing gets saved).

**Fix**: Verify the test admin's user ID and ensure they have a `super_admin` role in `user_roles`. Also fix a secondary issue — when the Trek Form submits, it calls `supabase.from('trek_images').delete().eq('trek_id', id)` to refresh images. This requires `super_admin` (DELETE on trek_images needs `is_super_admin()`), but the current policy says `is_manager()` for DELETE on trek_images. Let me re-read... actually `trek_images` DELETE policy IS `is_manager()` so that's fine. The issue IS the role.

Additionally, I need to verify the actual Supabase session to ensure the authenticated user credentials are being sent with requests properly.

### Problem 2: Trek Data is Missing Full Content

All 16 trek packages exist in the database but only have basic data (name, destination, duration, price). They need full content:
- Detailed descriptions
- Highlights (bullet points)
- Day-by-day itinerary
- Inclusions list
- Exclusions list
- Things to carry list
- Important notes

---

## Implementation Plan

### Step 1: Fix the Role Assignment for Test Admin
- Query the database to find the user ID for `testadmin@sridurgatravels.com`
- Insert a `super_admin` role into `user_roles` for that user if missing

### Step 2: Improve Error Handling in TrekForm
Currently, when Supabase returns an RLS error, `toast.error('Failed to update trek')` fires but doesn't show the actual error. Update error display to show the actual Supabase error message so admins can diagnose issues.

### Step 3: Populate All 16 Trek Packages with Full Data
Insert complete data for all trekking packages directly into the database using SQL `UPDATE` statements:

**Packages to update:**
1. Pondicherry Tour — 2D/1N, ₹5,299
2. Chikkamagaluru Tour — 2D/1N, ₹4,499
3. Coorg Tour — 2D/1N, ₹4,499
4. Wayanad Tour — 2D/1N, ₹5,499
5. Kodaikanal Tour — 2D/1N, ₹5,499
6. Ooty Tour — 2D/1N, ₹5,499
7. Kurinjal Trek — 2D/1N, ₹3,299
8. Dudhsagar Trek & Dandeli Rafting — 2D/1N, ₹4,999
9. Gokarna Beach Trek — 2D/1N, ₹3,299
10. Kodachadri Trek via Hidlumane Falls — 2D/1N, ₹3,299
11. Gangadikal Trek — 2D/1N, ₹3,299
12. Kumaraparvatha Trek — 2D/1N, ₹3,299
13. Kudremukh Trek — 2D/1N, ₹3,899
14. Nethravathi Trek — 2D/1N, ₹3,899
15. Bandaje Falls Trek — 2D/1N, ₹3,299
16. Tadiandamol Trek — 2D/1N, ₹3,299

### Step 4: Improve TrekForm for Better Admin UX
Minor fixes to the form:
- Show actual error messages from Supabase (not generic ones)
- Add a "Save & Continue Editing" button so admins don't navigate away after saving
- Ensure the form properly reloads after saving when staying on the same page

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| Database (`user_roles`) | Data insert | Assign super_admin role to testadmin user |
| Database (`treks`) | Data update | Populate all 16 treks with full content via SQL |
| `src/pages/admin/treks/TrekForm.tsx` | Modify | Better error handling, show actual Supabase errors, add "Save & Stay" button |

---

## Technical Details

### Trek Form Error Handling Fix
```typescript
// Before (hides actual error):
if (error) {
  toast.error('Failed to update trek');
  setLoading(false);
  return;
}

// After (shows actual error for debugging):
if (error) {
  toast.error(`Failed to update trek: ${error.message}`);
  console.error('Trek update error:', error);
  setLoading(false);
  return;
}
```

### SQL Data Update Pattern for Each Trek
```sql
UPDATE treks SET
  description = '...',
  highlights = '["item1", "item2"]'::jsonb,
  itinerary = '[{"day": 1, "title": "...", "description": "..."}]'::jsonb,
  inclusions = '["item1", "item2"]'::jsonb,
  exclusions = '["item1", "item2"]'::jsonb,
  things_to_carry = '["item1", "item2"]'::jsonb,
  important_notes = '...'
WHERE name = 'Trek Name';
```

### Role Assignment SQL
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'testadmin@sridurgatravels.com'
ON CONFLICT DO NOTHING;
```

---

## Expected Outcome
1. Admin can login with `testadmin@sridurgatravels.com` / `TestAdmin123!` and successfully edit, update, and delete any trek
2. All 16 trek packages will have complete descriptions, itineraries, inclusions, exclusions, highlights, and things-to-carry
3. Trek detail pages on the public site will show rich, full content for every package
4. Error messages in the admin form will be informative if anything goes wrong
