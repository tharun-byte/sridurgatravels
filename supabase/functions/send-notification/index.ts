// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Email HTML Template (Modern Gen-Z Design) ─────────────────────────────────
function wrapInTemplate(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Sri Durga Travels</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      background-color: #f8f8f8;
      color: #1a1a1a;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; display: block; }
    .wrapper { max-width: 620px; margin: 0 auto; padding: 20px 0; }

    /* ─────────────────── HEADER ──────────────────── */
    .header {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
      background-size: 200% 200%;
      padding: 40px 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .header-content { position: relative; z-index: 2; }
    .logo { height: 50px; width: auto; max-width: 180px; margin: 0 auto 12px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15)); }
    .header-title {
      font-size: 32px;
      font-weight: 800;
      color: white;
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header-subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      margin-top: 6px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* ─────────────────── BODY ──────────────────── */
    .body {
      background: white;
      padding: 0;
      margin: 0 24px;
      border-radius: 0 0 16px 16px;
    }

    /* ─────────────────── GREETING & MAIN CONTENT ──────────────────── */
    .content-wrapper {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px;
      letter-spacing: -0.3px;
    }
    .subtext {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px;
      line-height: 1.6;
    }

    /* ─────────────────── CONTENT BLOCKS ──────────────────── */
    .block {
      margin: 24px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #ff6b35;
    }
    .block-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #ff6b35;
      margin: 0 0 12px;
    }
    .block-content {
      font-size: 14px;
      color: #2a2a2a;
      line-height: 1.7;
      margin: 0;
    }

    /* ─────────────────── INFO GRID ──────────────────── */
    .info-grid {
      display: table;
      width: 100%;
      margin: 20px 0;
    }
    .info-row {
      display: table-row;
    }
    .info-label {
      display: table-cell;
      padding: 12px 16px 12px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 45%;
      border-bottom: 1px solid #e5e5e5;
    }
    .info-value {
      display: table-cell;
      padding: 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      border-bottom: 1px solid #e5e5e5;
    }
    .info-row:last-child .info-label,
    .info-row:last-child .info-value {
      border-bottom: none;
    }

    /* ─────────────────── HIGHLIGHT BOX ──────────────────── */
    .highlight {
      background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(247,147,30,0.05) 100%);
      border: 2px solid #ff6b35;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .highlight-emoji {
      font-size: 36px;
      margin-bottom: 8px;
    }
    .highlight-text {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.5;
    }

    /* ─────────────────── CTA BUTTON ──────────────────── */
    .cta-wrapper {
      text-align: center;
      margin: 28px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white !important;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      line-height: 1;
      box-shadow: 0 4px 16px rgba(255,107,53,0.25);
      mso-padding-alt: 14px 40px;
      mso-border-radius: 8px;
    }

    /* ─────────────────── DIVIDER ──────────────────── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #ff6b35, transparent);
      margin: 24px 0;
      opacity: 0.4;
    }

    /* ─────────────────── FOOTER ──────────────────── */
    .footer {
      background: #1a1a1a;
      color: white;
      padding: 28px 24px;
      text-align: center;
      margin: 0 24px 0 24px;
      border-radius: 16px 16px 0 0;
    }
    .footer-logo {
      height: 28px;
      width: auto;
      margin: 0 auto 12px;
      opacity: 0.8;
    }
    .footer-text {
      font-size: 12px;
      color: #999;
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer-links {
      margin: 14px 0 8px;
    }
    .footer-links a {
      color: #ff6b35;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      margin: 0 8px;
    }

    /* ─────────────────── RESPONSIVE ──────────────────── */
    @media (max-width: 600px) {
      .wrapper { padding: 12px 0; }
      .header { padding: 28px 16px; }
      .header-title { font-size: 24px; }
      .body, .footer { margin: 0 16px; }
      .content-wrapper { padding: 24px 16px; }
      .block { padding: 16px; }
      .info-label, .info-value { display: block; width: 100% !important; padding: 10px 0 !important; border-bottom: 1px solid #e5e5e5 !important; }
      .info-row:last-child .info-label, .info-row:last-child .info-value { border-bottom: none !important; }
      .cta-btn { width: 100%; display: block; padding: 14px 20px !important; }
      .footer, .body { border-radius: 12px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- HEADER -->
    <div class="header">
      <div class="header-content">
        <img src="https://sridurgatravels.com/assets/logo-transparent-Bc8nwp6R.png" alt="Sri Durga Travels" class="logo">
        <h1 class="header-title">🏔️ Sri Durga Travels</h1>
        <p class="header-subtitle">Your Adventure Awaits</p>
      </div>
    </div>

    <!-- BODY -->
    <div class="body">
      <div class="content-wrapper">
        ${bodyContent}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <img src="https://sridurgatravels.com/assets/logo-transparent-Bc8nwp6R.png" alt="Sri Durga Travels" class="footer-logo">
      <p class="footer-text">Sri Durga Travels<br>Andhra Pradesh, India</p>
      <div class="footer-links">
        <a href="https://sridurgatravels.com">Website</a>
        <a href="https://sridurgatravels.com/contact">Contact</a>
        <a href="https://sridurgatravels.com">Book Now</a>
      </div>
      <p class="footer-text">© 2025 Sri Durga Travels. All rights reserved.<br>Your trusted partner in adventure.</p>
    </div>
  </div>
</body>
</html>`
}

// ─── LLM Content Generation ───────────────────────────────────────────────────
async function generateContent(
  type: string,
  data: Record<string, unknown>,
  nvidiaApiKey: string,
  model: string,
): Promise<{
  telegramText: string
  adminEmailSubject: string
  adminEmailBody: string
  userEmailSubject: string
  userEmailBody: string
}> {
  const typeDescriptions: Record<string, string> = {
    new_booking: 'A customer just placed a new booking',
    contact_form: 'A visitor submitted the contact form',
    new_user: 'A new user registered an account',
    admin_login: 'An admin logged into the dashboard',
    booking_status_changed: 'Admin updated a booking status',
  }

  const userFacing = ['new_booking', 'contact_form', 'new_user', 'booking_status_changed']
  const hasUserEmail = Boolean(data.userEmail) && userFacing.includes(type)

  const prompt = `You are writing notification content for Sri Durga Travels — a premium travel company in Andhra Pradesh, India (vehicle rentals: cars, buses, tempo travelers; trekking packages across AP & Telangana).

Event: ${typeDescriptions[type] || type}
Data: ${JSON.stringify(data, null, 2)}

Return ONLY a valid JSON object (NO markdown, NO explanation, NO code blocks, NO extra text):
{
  "telegramText": "Complete Telegram admin notification including EVERY data field provided above — name, email, phone, subject, full message text, dates, locations, trip type, traveler details, special requirements — nothing omitted. Use HTML formatting: <b>bold</b>, <i>italic</i>. No length limit. End with a link to the admin panel.",
  "adminEmailSubject": "Email subject for admin (max 60 chars, include relevant emoji)",
  "adminEmailBody": "Complete HTML body for the admin email showing ALL event data fields. Use these exact CSS classes from the template: .block, .block-title, .block-content, .info-grid, .info-row, .info-label, .info-value, .highlight, .highlight-emoji, .highlight-text, .cta-wrapper, .cta-btn, .divider. Render EVERY field (name, email, phone, subject, message, date, location, travelers, notes, etc). Include a CTA button linking to admin panel.",
  "userEmailSubject": "${hasUserEmail ? 'Email subject for the customer (max 60 chars, warm and friendly with emoji)' : 'N/A — no user email needed'}",
  "userEmailBody": "${hasUserEmail ? 'Complete HTML body for the customer email. Use: .block, .block-title, .block-content, .info-grid, .info-row, .info-label, .info-value, .highlight, .highlight-emoji, .highlight-text, .cta-wrapper, .cta-btn, .divider classes. Warm, friendly, Gen-Z energy. Show their booking/inquiry details. CTA links to https://sridurgatravels.com. Do NOT include sensitive admin-only data.' : ''}"
}`

  const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${nvidiaApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 3000,
    }),
  })

  if (!resp.ok) throw new Error(`NVIDIA API ${resp.status}`)

  const result = await resp.json()
  const raw = result.choices[0].message.content

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in LLM response')

  return JSON.parse(jsonMatch[0])
}

// ─── Fallback Templates ───────────────────────────────────────────────────────
function getFallbackContent(type: string, data: Record<string, unknown>) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  // Helper: build an info-row with the new template classes
  const row = (label: string, value: unknown) =>
    value ? `<div class="info-row"><div class="info-label">${label}</div><div class="info-value">${value}</div></div>` : ''

  if (type === 'new_booking') {
    // Build Telegram message with ALL fields, no truncation
    const tgLines = [
      `🎉 <b>New ${String(data.bookingType).toUpperCase()} Booking!</b>`,
      ``,
      `👤 <b>${data.customerName}</b>`,
      `📧 ${data.userEmail}`,
      `📞 ${data.customerPhone}`,
      `🚌 <b>${data.serviceName}</b>`,
      `📅 Travel Date: ${data.travelDate}`,
      `👥 Passengers: ${data.passengers}`,
      data.tripType ? `🗺️ Trip Type: ${data.tripType}` : '',
      data.pickupLocation ? `📍 Pickup: ${data.pickupLocation}` : '',
      data.dropLocation ? `🏁 Drop: ${data.dropLocation}` : '',
      data.travelTime ? `🕐 Pickup Time: ${data.travelTime}` : '',
      data.returnDate ? `↩️ Return Date: ${data.returnDate}` : '',
      data.numDays ? `📆 Number of Days: ${data.numDays}` : '',
      data.specialRequirements ? `\n📝 <b>Special Requirements:</b>\n${data.specialRequirements}` : '',
      data.travelersInfo ? `\n👥 <b>Traveler Details:</b>\n${data.travelersInfo}` : '',
      ``,
      `⏰ Received: ${now}`,
      `⚡ <a href="https://sridurgatravels.com/admin/bookings">View &amp; Manage in Admin →</a>`,
    ].filter(Boolean).join('\n')

    // Build admin email body with ALL fields
    const adminEmailBody = `
<div class="block">
  <div class="block-title">🎉 New ${data.bookingType === 'trek' ? 'Trek' : 'Vehicle'} Booking Received</div>
  <div class="info-grid">
    ${row('👤 Customer', data.customerName)}
    ${row('📧 Email', data.userEmail)}
    ${row('📞 Phone', data.customerPhone)}
    ${row('🚌 Service', data.serviceName)}
    ${row('📦 Type', data.bookingType)}
    ${row('📅 Travel Date', data.travelDate)}
    ${row('👥 Passengers', data.passengers)}
    ${row('🗺️ Trip Type', data.tripType)}
    ${row('📍 Pickup Location', data.pickupLocation)}
    ${row('🏁 Drop Location', data.dropLocation)}
    ${row('🕐 Pickup Time', data.travelTime)}
    ${row('↩️ Return Date', data.returnDate)}
    ${row('📆 Number of Days', data.numDays)}
    ${row('⏰ Received At (IST)', now)}
    ${row('📊 Status', 'Pending Confirmation')}
  </div>
</div>
${data.specialRequirements ? `<div class="block"><div class="block-title">📝 Special Requirements / Notes</div><div class="block-content">${data.specialRequirements}</div></div>` : ''}
${data.travelersInfo ? `<div class="block"><div class="block-title">👥 Traveler Details</div><div class="block-content" style="white-space:pre-line">${data.travelersInfo}</div></div>` : ''}
<div class="cta-wrapper"><a href="https://sridurgatravels.com/admin/bookings" class="cta-btn">View &amp; Manage Booking →</a></div>`

    return {
      telegramText: tgLines,
      adminEmailSubject: `🎉 New ${data.bookingType === 'trek' ? 'Trek' : 'Vehicle'} Booking from ${data.customerName}`,
      adminEmailBody,
      userEmailSubject: `Booking Received! We'll confirm soon 🎉`,
      userEmailBody: `
<div class="highlight">
  <div class="highlight-emoji">🙏</div>
  <p class="highlight-text">Hey ${data.customerName}! Thanks for choosing Sri Durga Travels!<br>We've received your booking and will confirm within <strong>24 hours</strong>.</p>
</div>
<div class="block">
  <div class="block-title">📋 Your Booking Summary</div>
  <div class="info-grid">
    ${row('Service', data.serviceName)}
    ${row('Travel Date', data.travelDate)}
    ${row('Passengers', data.passengers)}
    ${data.pickupLocation ? row('Pickup', data.pickupLocation) : ''}
    ${data.returnDate ? row('Return', data.returnDate) : ''}
    ${row('Status', 'Pending Confirmation ⏳')}
  </div>
</div>
<div class="cta-wrapper"><a href="https://sridurgatravels.com/contact" class="cta-btn">Questions? Reach Out →</a></div>`,
    }
  }

  if (type === 'contact_form') {
    // Full message — NO truncation
    return {
      telegramText: `📬 <b>New Contact Message!</b>\n\n👤 <b>${data.name}</b>\n📧 ${data.userEmail}\n📞 ${data.phone || 'Not provided'}\n📌 Subject: <i>${data.subject}</i>\n⏰ ${now}\n\n💬 <b>Full Message:</b>\n${data.message}\n\n⚡ <a href="https://sridurgatravels.com/admin/messages">Open &amp; Reply in Admin →</a>`,
      adminEmailSubject: `📬 New Message from ${data.name} — ${data.subject}`,
      adminEmailBody: `
<div class="block">
  <div class="block-title">📬 Contact Form Submission</div>
  <div class="info-grid">
    ${row('👤 Name', data.name)}
    ${row('📧 Email', data.userEmail)}
    ${row('📞 Phone', data.phone || 'Not provided')}
    ${row('📌 Subject', data.subject)}
    ${row('⏰ Received (IST)', now)}
  </div>
</div>
<div class="block">
  <div class="block-title">💬 Full Message</div>
  <div class="block-content" style="white-space:pre-wrap;line-height:1.7">${data.message}</div>
</div>
<div class="cta-wrapper"><a href="https://sridurgatravels.com/admin/messages" class="cta-btn">Open &amp; Reply in Admin →</a></div>`,
      userEmailSubject: `Got your message! We'll be in touch soon 👋`,
      userEmailBody: `
<div class="highlight">
  <div class="highlight-emoji">👋</div>
  <p class="highlight-text">Hi ${data.name}! Thanks for reaching out.<br>We've received your message and will reply within <strong>24 hours</strong>.</p>
</div>
<div class="block">
  <div class="block-title">✅ Message Received</div>
  <div class="info-grid">
    ${row('Subject', data.subject)}
    ${row('Submitted', now)}
  </div>
</div>
<div class="cta-wrapper"><a href="https://sridurgatravels.com" class="cta-btn">Explore Our Services →</a></div>`,
    }
  }

  if (type === 'new_user') {
    return {
      telegramText: `👤 <b>New User Registered!</b>\n\n👤 <b>${data.name}</b>\n📧 ${data.userEmail}\n⏰ ${now}`,
      adminEmailSubject: `👤 New Registration: ${data.name}`,
      adminEmailBody: `
<div class="block">
  <div class="block-title">👤 New User Registration</div>
  <div class="info-grid">
    ${row('Name', data.name)}
    ${row('Email', data.userEmail)}
    ${row('Registered At (IST)', now)}
  </div>
</div>`,
      userEmailSubject: `Welcome to Sri Durga Travels! 🏔️✨`,
      userEmailBody: `
<div class="highlight">
  <div class="highlight-emoji">🎉</div>
  <p class="highlight-text">Welcome, ${data.name}!<br>You're now part of the Sri Durga Travels family. Your next adventure awaits! 🏔️</p>
</div>
<div class="divider"></div>
<div class="cta-wrapper"><a href="https://sridurgatravels.com/booking" class="cta-btn">Book Your Adventure Now →</a></div>`,
    }
  }

  if (type === 'admin_login') {
    return {
      telegramText: `🔐 <b>Admin Login Alert</b>\n\n📧 ${data.email}\n⏰ ${now}\n\n⚠️ If this wasn't you, secure your account immediately at sridurgatravels.com/admin`,
      adminEmailSubject: `🔐 Admin Login Detected — ${now}`,
      adminEmailBody: `
<div class="block">
  <div class="block-title">🔐 Admin Login Detected</div>
  <div class="info-grid">
    ${row('📧 Email', data.email)}
    ${row('⏰ Time (IST)', now)}
  </div>
</div>
<div class="highlight" style="border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08)">
  <div class="highlight-emoji">⚠️</div>
  <p class="highlight-text" style="color:#b45309">If this login wasn't made by you, immediately change your password at <a href="https://sridurgatravels.com/admin" style="color:#f97316">sridurgatravels.com/admin</a></p>
</div>`,
      userEmailSubject: '',
      userEmailBody: '',
    }
  }

  if (type === 'booking_status_changed') {
    const statusLabels: Record<string, string> = {
      confirmed: 'Confirmed ✅',
      pending: 'Pending ⏳',
      cancelled: 'Cancelled ❌',
      completed: 'Completed 🎉',
    }
    const label = statusLabels[String(data.status)] || String(data.status)
    return {
      telegramText: `🔄 <b>Booking Status Updated</b>\n\n👤 ${data.customerName}\n📧 ${data.userEmail || 'N/A'}\n📦 Type: ${data.bookingType || 'N/A'}\n📊 New Status: <b>${label}</b>\n⏰ ${now}`,
      adminEmailSubject: `🔄 Booking Updated: ${data.customerName} → ${label}`,
      adminEmailBody: `
<div class="block">
  <div class="block-title">🔄 Booking Status Changed</div>
  <div class="info-grid">
    ${row('👤 Customer', data.customerName)}
    ${row('📧 Email', data.userEmail)}
    ${row('📦 Booking Type', data.bookingType)}
    ${row('📊 New Status', label)}
    ${row('⏰ Updated At (IST)', now)}
  </div>
</div>`,
      userEmailSubject: `Your booking status: ${label} — Sri Durga Travels`,
      userEmailBody: `
<div class="highlight">
  <div class="highlight-emoji">🔄</div>
  <p class="highlight-text">Hi ${data.customerName}! Your Sri Durga Travels booking has been updated.</p>
</div>
<div class="block">
  <div class="block-title">📊 Booking Update</div>
  <div class="info-grid">
    ${row('New Status', label)}
    ${row('Updated At', now)}
  </div>
</div>
<div class="cta-wrapper"><a href="https://sridurgatravels.com/contact" class="cta-btn">Questions? Contact Us →</a></div>`,
    }
  }

  return {
    telegramText: `📢 <b>Sri Durga Travels Notification</b>\n\nEvent: ${type}\n⏰ ${now}\n\nData: ${JSON.stringify(data)}`,
    adminEmailSubject: `Notification: ${type} — ${now}`,
    adminEmailBody: `<div class="block"><div class="block-title">📢 ${type}</div><div class="block-content" style="white-space:pre-wrap;font-size:13px">${JSON.stringify(data, null, 2)}</div></div>`,
    userEmailSubject: '',
    userEmailBody: '',
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function sendTelegram(token: string, chatId: string, text: string) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  })
  if (!resp.ok) console.error('Telegram error:', await resp.text())
}

async function sendEmail(
  apiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string },
) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  })
  const body = await resp.text()
  if (!resp.ok) {
    const msg = `Resend HTTP ${resp.status}: ${body}`
    console.error('Resend FAILED:', msg)
    throw new Error(msg)   // propagates to .catch() in delivery report → shows FAILED ❌
  }
  console.log(`Resend OK [${resp.status}]: delivered to ${payload.to.join(', ')} — subject: "${payload.subject}"`)
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { type, data } = await req.json()

    // Read settings from Supabase (with env fallbacks)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: dbSettings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'resend_api_key', 'telegram_bot_token', 'telegram_chat_id',
        'nvidia_api_key', 'ai_model', 'notifications_enabled', 'resend_from_email',
      ])

    const get = (key: string, fallback = '') => {
      const s = (dbSettings ?? []).find((r: { key: string; value: string }) => r.key === key)
      return s?.value || fallback
    }

    // Master toggle
    if (get('notifications_enabled', 'true') === 'false') {
      return new Response(JSON.stringify({ ok: true, skipped: 'notifications disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendApiKey   = get('resend_api_key',    Deno.env.get('RESEND_API_KEY') ?? '')
    const telegramToken  = get('telegram_bot_token', Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '')
    const telegramChatId = get('telegram_chat_id',   Deno.env.get('TELEGRAM_CHAT_ID') ?? '914958962')
    const nvidiaApiKey   = get('nvidia_api_key',     Deno.env.get('NVIDIA_API_KEY') ?? '')
    const aiModel        = get('ai_model',           'meta/llama-3.3-70b-instruct')
    const fromEmail      = get('resend_from_email',  'orders@sridurgatravels.com')

    // ⚠️ CRITICAL: Verify all required credentials exist
    const errors: string[] = []
    if (!resendApiKey) errors.push('⚠️ RESEND_API_KEY not configured')
    if (!telegramToken) errors.push('⚠️ TELEGRAM_BOT_TOKEN not configured')
    if (!telegramChatId) errors.push('⚠️ TELEGRAM_CHAT_ID not configured')
    if (errors.length > 0) {
      console.warn('NOTIFICATION CONFIG ISSUES:', errors.join(', '))
    }

    // Generate content (LLM or fallback)
    let content
    if (nvidiaApiKey) {
      try {
        content = await generateContent(type, data, nvidiaApiKey, aiModel)
      } catch (err) {
        console.error('LLM failed, using fallback:', err)
        content = getFallbackContent(type, data)
      }
    } else {
      console.warn('NVIDIA_API_KEY not configured, using fallback templates')
      content = getFallbackContent(type, data)
    }

    const fromField = `Sri Durga Travels <${fromEmail}>`
    const adminEmail = 'orders@sridurgatravels.com'

    // Fire all notifications in parallel with detailed logging
    const tasks: Promise<void>[] = []
    const results: { channel: string; status: string; message?: string }[] = []

    // 1. TELEGRAM to Admin
    if (telegramToken && telegramChatId && content.telegramText) {
      tasks.push(
        sendTelegram(telegramToken, telegramChatId, content.telegramText)
          .then(() => results.push({ channel: 'Telegram', status: 'SENT ✅' }))
          .catch((err) => {
            console.error('Telegram send failed:', err)
            results.push({ channel: 'Telegram', status: 'FAILED ❌', message: String(err) })
          })
      )
    } else {
      results.push({ channel: 'Telegram', status: 'SKIPPED ⏭️', message: 'Missing token or chat ID' })
    }

    // 2. ADMIN EMAIL (MANDATORY — always send to orders@sridurgatravels.com)
    if (resendApiKey && content.adminEmailSubject) {
      tasks.push(
        sendEmail(resendApiKey, {
          from: fromField,
          to: [adminEmail],
          subject: content.adminEmailSubject,
          html: wrapInTemplate(content.adminEmailBody),
        })
          .then(() => results.push({ channel: `Email → ${adminEmail}`, status: 'SENT ✅' }))
          .catch((err) => {
            console.error('Admin email send failed:', err)
            results.push({ channel: `Email → ${adminEmail}`, status: 'FAILED ❌', message: String(err) })
          })
      )
    } else if (!resendApiKey) {
      results.push({ channel: `Email → ${adminEmail}`, status: 'FAILED ❌', message: 'RESEND_API_KEY missing!' })
    }

    // 3. CUSTOMER EMAIL (optional — only if they provided email)
    if (resendApiKey && data.userEmail && content.userEmailSubject) {
      tasks.push(
        sendEmail(resendApiKey, {
          from: fromField,
          to: [data.userEmail as string],
          subject: content.userEmailSubject,
          html: wrapInTemplate(content.userEmailBody),
        })
          .then(() => results.push({ channel: `Email → ${data.userEmail}`, status: 'SENT ✅' }))
          .catch((err) => {
            console.error('Customer email send failed:', err)
            results.push({ channel: `Email → ${data.userEmail}`, status: 'FAILED ❌', message: String(err) })
          })
      )
    } else if (!resendApiKey && data.userEmail) {
      results.push({ channel: `Email → ${data.userEmail}`, status: 'FAILED ❌', message: 'RESEND_API_KEY missing!' })
    }

    await Promise.allSettled(tasks)

    // Log detailed notification results
    console.log(`\n📊 NOTIFICATION DELIVERY REPORT\n${'='.repeat(50)}\n`)
    console.log(`Event Type: ${type}\nRequest Data: ${JSON.stringify(data, null, 2)}\n`)
    console.log('Delivery Channels:')
    results.forEach(r => console.log(`  ${r.channel.padEnd(35)} → ${r.status}${r.message ? ` (${r.message})` : ''}`))
    console.log(`\n${'='.repeat(50)}\n`)

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-notification error:', err)
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
