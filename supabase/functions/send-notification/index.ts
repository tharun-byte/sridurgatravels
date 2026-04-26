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
  "telegramText": "Concise, emoji-rich Telegram notification (max 300 chars) using HTML formatting: <b>bold</b>, <i>italic</i>. Admin-focused.",
  "adminEmailSubject": "Email subject for admin (max 60 chars, include relevant emoji)",
  "adminEmailBody": "Inner HTML body for the admin email. Use these exact CSS classes from the template: .card, .card-header, .card-icon, .card-label, .card-body, .info-row, .info-label, .info-value, .badge, .badge-pending, .badge-new, .cta-wrap, .cta-btn, .divider. Show all event data. Include a CTA button to admin panel.",
  "userEmailSubject": "${hasUserEmail ? 'Email subject for the customer (max 60 chars, warm and friendly with emoji)' : 'N/A — no user email needed'}",
  "userEmailBody": "${hasUserEmail ? 'Inner HTML body for the customer email. Use: .highlight, .highlight-greeting, .card, .card-header, .card-label, .card-body, .info-row, .info-label, .info-value, .badge, .cta-wrap, .cta-btn classes. Warm, friendly, Gen-Z energy. CTA links to https://sridurgatravels.com. DO NOT include any sensitive admin-only data.' : ''}"
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

  if (type === 'new_booking') {
    return {
      telegramText: `🎉 <b>New Booking!</b>\n\n👤 <b>${data.customerName}</b>\n📞 ${data.customerPhone}\n📧 ${data.userEmail}\n🗺️ <i>${data.serviceName}</i>\n📅 ${data.travelDate}\n👥 ${data.passengers} passenger(s)\n\n⚡ <a href="https://sridurgatravels.com/admin/bookings">View in Admin →</a>`,
      adminEmailSubject: `🎉 New ${data.bookingType === 'trek' ? 'Trek' : 'Vehicle'} Booking from ${data.customerName}`,
      adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">🎉</div><div class="card-label">New Booking Received</div></div><div class="card-body"><div class="info-row"><span class="info-label">Customer</span><span class="info-value">${data.customerName}</span></div><div class="info-row"><span class="info-label">Email</span><span class="info-value">${data.userEmail}</span></div><div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.customerPhone}</span></div><div class="info-row"><span class="info-label">Service</span><span class="info-value">${data.serviceName}</span></div><div class="info-row"><span class="info-label">Type</span><span class="info-value"><span class="badge badge-new">${data.bookingType}</span></span></div><div class="info-row"><span class="info-label">Travel Date</span><span class="info-value">${data.travelDate}</span></div><div class="info-row"><span class="info-label">Passengers</span><span class="info-value">${data.passengers}</span></div><div class="info-row"><span class="info-label">Status</span><span class="info-value"><span class="badge badge-pending">Pending</span></span></div></div></div><div class="cta-wrap"><a href="https://sridurgatravels.com/admin/bookings" class="cta-btn">View &amp; Manage Booking →</a></div>`,
      userEmailSubject: `Booking Received! We'll confirm soon 🎉`,
      userEmailBody: `<div class="highlight"><div class="highlight-greeting">Hey ${data.customerName}! 🙏</div>Thanks for choosing Sri Durga Travels! We've received your booking and our team will confirm it within <strong>24 hours</strong>. Get ready for an amazing adventure! 🏔️</div><div class="card"><div class="card-header"><div class="card-icon">📋</div><div class="card-label">Your Booking Summary</div></div><div class="card-body"><div class="info-row"><span class="info-label">Service</span><span class="info-value">${data.serviceName}</span></div><div class="info-row"><span class="info-label">Travel Date</span><span class="info-value">${data.travelDate}</span></div><div class="info-row"><span class="info-label">Passengers</span><span class="info-value">${data.passengers}</span></div><div class="info-row"><span class="info-label">Status</span><span class="info-value"><span class="badge badge-pending">Pending Confirmation</span></span></div></div></div><div class="cta-wrap"><a href="https://sridurgatravels.com/contact" class="cta-btn">Questions? Reach Out →</a></div>`,
    }
  }

  if (type === 'contact_form') {
    return {
      telegramText: `📬 <b>New Contact Message!</b>\n\n👤 <b>${data.name}</b>\n📧 ${data.userEmail}\n📞 ${data.phone || 'N/A'}\n📌 <i>${data.subject}</i>\n\n💬 "${String(data.message).substring(0, 120)}${String(data.message).length > 120 ? '...' : ''}"\n\n⚡ <a href="https://sridurgatravels.com/admin/messages">Reply in Admin →</a>`,
      adminEmailSubject: `📬 New Message from ${data.name} — ${data.subject}`,
      adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">📬</div><div class="card-label">Contact Form Submission</div></div><div class="card-body"><div class="info-row"><span class="info-label">Name</span><span class="info-value">${data.name}</span></div><div class="info-row"><span class="info-label">Email</span><span class="info-value">${data.userEmail}</span></div><div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.phone || 'Not provided'}</span></div><div class="info-row"><span class="info-label">Subject</span><span class="info-value"><span class="badge badge-new">${data.subject}</span></span></div><div class="info-row"><span class="info-label">Received</span><span class="info-value">${now}</span></div></div></div><div class="card"><div class="card-header"><div class="card-icon">💬</div><div class="card-label">Message</div></div><div class="msg-block">${data.message}</div></div><div class="cta-wrap"><a href="https://sridurgatravels.com/admin/messages" class="cta-btn">Open &amp; Reply in Admin →</a></div>`,
      userEmailSubject: `Got your message! We'll be in touch soon 👋`,
      userEmailBody: `<div class="highlight"><div class="highlight-greeting">Hi ${data.name}! 👋</div>Thanks for reaching out to Sri Durga Travels. We've received your message and our team will get back to you within <strong>24 hours</strong>. While you wait, explore our latest packages! ✨</div><div class="card"><div class="card-header"><div class="card-icon">✅</div><div class="card-label">Message Received</div></div><div class="card-body"><div class="info-row"><span class="info-label">Subject</span><span class="info-value">${data.subject}</span></div><div class="info-row"><span class="info-label">Submitted</span><span class="info-value">${now}</span></div></div></div><div class="cta-wrap"><a href="https://sridurgatravels.com" class="cta-btn">Explore Our Services →</a></div>`,
    }
  }

  if (type === 'new_user') {
    return {
      telegramText: `👤 <b>New User Registered!</b>\n\n👤 <b>${data.name}</b>\n📧 ${data.userEmail}\n⏰ ${now}`,
      adminEmailSubject: `👤 New Registration: ${data.name}`,
      adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">👤</div><div class="card-label">New User Registration</div></div><div class="card-body"><div class="info-row"><span class="info-label">Name</span><span class="info-value">${data.name}</span></div><div class="info-row"><span class="info-label">Email</span><span class="info-value">${data.userEmail}</span></div><div class="info-row"><span class="info-label">Registered At</span><span class="info-value">${now}</span></div></div></div>`,
      userEmailSubject: `Welcome to Sri Durga Travels! 🏔️✨`,
      userEmailBody: `<div class="highlight"><div class="highlight-greeting">Welcome, ${data.name}! 🎉</div>You're now part of the Sri Durga Travels family! Explore our amazing trek packages and vehicle rentals — your next adventure is waiting. 🏔️🚌</div><div class="divider"></div><div class="cta-wrap"><a href="https://sridurgatravels.com/booking" class="cta-btn">Book Your Adventure Now →</a></div>`,
    }
  }

  if (type === 'admin_login') {
    return {
      telegramText: `🔐 <b>Admin Login Alert</b>\n\n📧 ${data.email}\n⏰ ${now}\n\nIf this wasn't you, secure your account immediately.`,
      adminEmailSubject: `🔐 Admin Login Detected — ${now}`,
      adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">🔐</div><div class="card-label">Admin Login Detected</div></div><div class="card-body"><div class="info-row"><span class="info-label">Email</span><span class="info-value">${data.email}</span></div><div class="info-row"><span class="info-label">Time (IST)</span><span class="info-value">${now}</span></div></div></div><div class="highlight" style="border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.05);font-size:13px;color:#94a3b8">If this login wasn't made by you, immediately change your password at <a href="https://sridurgatravels.com/admin" style="color:#f97316">sridurgatravels.com/admin</a></div>`,
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
    const badgeClass = data.status === 'confirmed' ? 'badge-confirmed' : data.status === 'pending' ? 'badge-pending' : 'badge-new'
    return {
      telegramText: `🔄 <b>Booking Status Updated</b>\n\n👤 ${data.customerName}\n📊 Status: <b>${label}</b>\n⏰ ${now}`,
      adminEmailSubject: `🔄 Booking Updated for ${data.customerName}`,
      adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">🔄</div><div class="card-label">Booking Status Changed</div></div><div class="card-body"><div class="info-row"><span class="info-label">Customer</span><span class="info-value">${data.customerName}</span></div><div class="info-row"><span class="info-label">New Status</span><span class="info-value"><span class="badge ${badgeClass}">${label}</span></span></div><div class="info-row"><span class="info-label">Updated At</span><span class="info-value">${now}</span></div></div></div>`,
      userEmailSubject: `Your booking status: ${label} — Sri Durga Travels`,
      userEmailBody: `<div class="highlight"><div class="highlight-greeting">Hi ${data.customerName}! 👋</div>Great news — your Sri Durga Travels booking has been updated!</div><div class="card"><div class="card-header"><div class="card-icon">🔄</div><div class="card-label">Booking Update</div></div><div class="card-body"><div class="info-row"><span class="info-label">New Status</span><span class="info-value"><span class="badge ${badgeClass}">${label}</span></span></div><div class="info-row"><span class="info-label">Updated At</span><span class="info-value">${now}</span></div></div></div><div class="cta-wrap"><a href="https://sridurgatravels.com/contact" class="cta-btn">Questions? Contact Us →</a></div>`,
    }
  }

  return {
    telegramText: `📢 <b>Sri Durga Travels Notification</b>\n\nEvent: ${type}\n⏰ ${now}`,
    adminEmailSubject: `Notification: ${type}`,
    adminEmailBody: `<div class="card"><div class="card-header"><div class="card-icon">📢</div><div class="card-label">${type}</div></div><div class="card-body"><div class="msg-block">${JSON.stringify(data, null, 2)}</div></div></div>`,
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
  if (!resp.ok) console.error('Resend error:', await resp.text())
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
      content = getFallbackContent(type, data)
    }

    const fromField = `Sri Durga Travels <${fromEmail}>`

    // Fire all notifications in parallel
    const tasks: Promise<void>[] = []

    if (telegramToken && telegramChatId && content.telegramText) {
      tasks.push(sendTelegram(telegramToken, telegramChatId, content.telegramText))
    }

    if (resendApiKey && content.adminEmailSubject) {
      tasks.push(sendEmail(resendApiKey, {
        from: fromField,
        to: ['orders@sridurgatravels.com'],
        subject: content.adminEmailSubject,
        html: wrapInTemplate(content.adminEmailBody),
      }))
    }

    if (resendApiKey && data.userEmail && content.userEmailSubject) {
      tasks.push(sendEmail(resendApiKey, {
        from: fromField,
        to: [data.userEmail as string],
        subject: content.userEmailSubject,
        html: wrapInTemplate(content.userEmailBody),
      }))
    }

    await Promise.allSettled(tasks)

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
