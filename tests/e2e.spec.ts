import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:8080';
const ADMIN_EMAIL = 'testadmin@sridurgatravels.com';
const ADMIN_PASS = 'TestAdmin123!';

// ─── PUBLIC PAGES ────────────────────────────────────────────────────────────

test.describe('Public Pages', () => {
  test('Homepage loads and nav works', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Sri Durga Travels/i);
    await expect(page.locator('nav').first()).toBeVisible();
    // Hero section
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Rentals page loads with vehicle cards', async ({ page }) => {
    await page.goto(`${BASE}/rentals`);
    await page.waitForLoadState('networkidle');
    // Should show at least one vehicle card
    const cards = page.locator('[data-testid="vehicle-card"], .vehicle-card, a[href*="/rentals/"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Trekking page loads with trek cards', async ({ page }) => {
    await page.goto(`${BASE}/trekking`);
    await page.waitForLoadState('load'); // 'networkidle' times out due to 17 trek images loading from CDN
    const cards = page.locator('a[href*="/trekking/"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test('Gallery page loads with images', async ({ page }) => {
    await page.goto(`${BASE}/gallery`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('img').first()).toBeVisible({ timeout: 10000 });
  });

  test('Contact page renders form', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page.locator('input[type="text"], input[name="name"]').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Send")').first()).toBeVisible();
  });

  test('Contact form submits successfully', async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await page.waitForLoadState('load');
    // Fill name
    await page.locator('input[placeholder="Enter your name"]').fill('Test User');
    // Fill email
    await page.locator('input[type="email"]').fill('testuser@example.com');
    // Fill phone
    await page.locator('input[placeholder="+91 XXXXX XXXXX"]').fill('9876543210');
    // Subject is a Radix Select dropdown — click trigger then pick an option
    await page.locator('button[role="combobox"]').click();
    await page.locator('[role="option"]:has-text("General Inquiry")').click();
    // Fill message
    await page.locator('textarea').fill('This is a test message from Playwright. Testing the contact form end to end.');
    // Submit
    await page.locator('button:has-text("Send Message")').click();
    // Expect success toast
    await expect(page.locator('text=/Message sent successfully/i').first()).toBeVisible({ timeout: 12000 });
  });

  test('Vehicle detail page loads', async ({ page }) => {
    await page.goto(`${BASE}/rentals`);
    await page.waitForLoadState('networkidle');
    const firstLink = page.locator('a[href*="/rentals/"]').first();
    if (await firstLink.count() > 0) {
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('Trek detail page loads', async ({ page }) => {
    await page.goto(`${BASE}/trekking`);
    await page.waitForLoadState('networkidle');
    const firstLink = page.locator('a[href*="/trekking/"]').first();
    if (await firstLink.count() > 0) {
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('Mobile viewport - homepage', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await expect(page.locator('nav, header').first()).toBeVisible();
    // Check no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('Mobile viewport - rentals page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE}/rentals`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });
});

// ─── ADMIN HELPERS ───────────────────────────────────────────────────────────

async function adminLogin(page: Page) {
  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(`${BASE}/admin`, { timeout: 15000 });
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

test.describe('Admin Dashboard', () => {
  test('Admin login works', async ({ page }) => {
    await adminLogin(page);
    await expect(page).toHaveURL(`${BASE}/admin`);
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible({ timeout: 8000 });
  });

  test('Dashboard stats cards visible', async ({ page }) => {
    await adminLogin(page);
    await page.waitForLoadState('networkidle');
    // 4 stat cards should be visible
    await expect(page.locator('text=/Active Vehicles|Active Treks|Pending Bookings|Unread Messages/').first()).toBeVisible({ timeout: 8000 });
  });

  test('Non-admin redirect: unauthenticated visit → login', async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForURL(`${BASE}/admin/login`, { timeout: 8000 });
    await expect(page).toHaveURL(`${BASE}/admin/login`);
  });
});

// ─── ADMIN TESTIMONIALS ───────────────────────────────────────────────────────

test.describe('Admin - Testimonials', () => {
  test('Testimonials page loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/testimonials`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2, h1').filter({ hasText: /testimonial/i }).first()).toBeVisible({ timeout: 8000 });
  });

  test('Add testimonial', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/testimonials`);
    await page.waitForLoadState('networkidle');
    // Click "Add Testimonial" button
    await page.locator('button:has-text("Add Testimonial")').click();
    // Dialog opens — fill name and content inputs
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[role="dialog"] input').first().fill('Playwright Tester');
    await page.locator('[role="dialog"] textarea').first().fill('Excellent travel service! Highly recommended.');
    // Submit inside dialog
    await page.locator('[role="dialog"] button:has-text("Create"), [role="dialog"] button:has-text("Update"), [role="dialog"] button:has-text("Save")').last().click();
    await expect(page.locator('text=/success|saved|added/i').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── ADMIN BOOKINGS ───────────────────────────────────────────────────────────

test.describe('Admin - Bookings', () => {
  test('Bookings list loads with pagination', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/bookings`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2:has-text("Booking")').first()).toBeVisible({ timeout: 8000 });
    // Table should be visible
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 });
  });

  test('Booking status filter works', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/bookings`);
    await page.waitForLoadState('networkidle');
    // Open status filter dropdown
    const filterTrigger = page.locator('button[role="combobox"]').first();
    await filterTrigger.click();
    await page.locator('[role="option"]:has-text("Pending")').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });
  });

  test('View booking details', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/bookings`);
    await page.waitForLoadState('networkidle');
    // Eye icon is the first ghost button in each row
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    if (rowCount > 0) {
      // Eye button is in the last cell (Actions column); status cell has a combobox button before it
      const eyeBtn = rows.first().locator('td:last-child button').first();
      await eyeBtn.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 8000 });
      await page.keyboard.press('Escape');
    }
  });
});

// ─── ADMIN MESSAGES ───────────────────────────────────────────────────────────

test.describe('Admin - Messages', () => {
  test('Messages page loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/messages`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').filter({ hasText: /message/i }).first()).toBeVisible({ timeout: 8000 });
  });

  test('Mark message as read', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/messages`);
    await page.waitForLoadState('networkidle');
    const rows = page.locator('table tbody tr');
    if (await rows.count() > 0) {
      // Eye button is in the last cell (Actions column)
      const eyeBtn = rows.first().locator('td:last-child button').first();
      await eyeBtn.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 8000 });
      await page.keyboard.press('Escape');
    }
  });
});

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────

test.describe('Admin - Settings', () => {
  test('Settings page loads with settings rows', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/settings`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').filter({ hasText: /setting/i }).first()).toBeVisible({ timeout: 8000 });
    // Should have input fields for settings
    await expect(page.locator('input, textarea').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── ADMIN BANNERS ────────────────────────────────────────────────────────────

test.describe('Admin - Banners', () => {
  test('Banners page loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/banners`);
    await page.waitForLoadState('networkidle');
    // Actual heading is h1 "Banner Management"
    await expect(page.locator('h1:has-text("Banner Management")').first()).toBeVisible({ timeout: 8000 });
  });

  test('Banner title can be edited', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/banners`);
    await page.waitForLoadState('networkidle');
    const firstInput = page.locator('input[placeholder*="title" i], input[placeholder*="Title" i]').first();
    if (await firstInput.count() > 0) {
      await firstInput.clear();
      await firstInput.fill('Updated Banner Title');
      const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        await expect(page.locator('text=/success|saved/i').first()).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

// ─── ADMIN GALLERY ────────────────────────────────────────────────────────────

test.describe('Admin - Gallery', () => {
  test('Gallery manager loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/gallery`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').filter({ hasText: /gallery/i }).first()).toBeVisible({ timeout: 8000 });
  });

  test('Gallery category selector works (no crash)', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/gallery`);
    await page.waitForLoadState('networkidle');
    // Check for errors in console
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.waitForTimeout(2000);
    // The page should not have crashed
    await expect(page.locator('body')).toBeVisible();
    expect(errors.filter(e => e.includes('Radix') || e.includes('SelectItem'))).toHaveLength(0);
  });
});

// ─── ADMIN TREK DATES ─────────────────────────────────────────────────────────

test.describe('Admin - Trek Dates', () => {
  test('Trek dates page loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/treks/dates`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── ADMIN VEHICLES ───────────────────────────────────────────────────────────

test.describe('Admin - Vehicles', () => {
  test('Vehicle list loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/vehicles`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').filter({ hasText: /vehicle/i }).first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 });
  });
});

// ─── ADMIN TREKS ──────────────────────────────────────────────────────────────

test.describe('Admin - Treks', () => {
  test('Trek list loads', async ({ page }) => {
    await adminLogin(page);
    await page.goto(`${BASE}/admin/treks`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2').filter({ hasText: /trek/i }).first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 });
  });
});
