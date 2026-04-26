// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Email HTML Template ──────────────────────────────────────────────────────
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    body{margin:0;padding:0;background-color:#0d0d12;font-family:'Inter',system-ui,-apple-system,Arial,sans-serif;color:#e2e8f0;-webkit-text-size-adjust:100%}
    table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
    img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
    .wrapper{max-width:600px;margin:0 auto;padding:24px 16px}
    /* Header */
    .header{background:linear-gradient(145deg,#1a0a00 0%,#2d1200 40%,#1a0a00 100%);border-radius:20px 20px 0 0;padding:0;overflow:hidden;position:relative}
    .header-stripe{height:4px;background:linear-gradient(90deg,#ff6b35,#f7931e,#ffd166,#f7931e,#ff6b35);background-size:200% 100%}
    .header-content{padding:36px 40px;text-align:center;position:relative}
    .logo-wrap{display:inline-block;margin-bottom:20px}
    .logo-img{height:60px;width:auto;max-width:200px}
    .header-badge{display:inline-block;background:rgba(255,107,53,0.15);border:1px solid rgba(255,107,53,0.3);border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;color:#ff9f6b;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px}
    .header-title{font-size:26px;font-weight:800;color:#fff;margin:0;line-height:1.3;letter-spacing:-0.5px}
    .header-subtitle{font-size:14px;color:rgba(255,255,255,0.5);margin-top:8px;font-weight:400;line-height:1.5}
    /* Body */
    .body{background:#111827;padding:32px 40px}
    /* Cards */
    .card{background:#1e293b;border-radius:16px;overflow:hidden;margin:20px 0;border:1px solid rgba(255,255,255,0.06)}
    .card-header{background:rgba(255,107,53,0.06);border-bottom:1px solid rgba(255,107,53,0.12);padding:14px 20px;display:flex;align-items:center;gap:10px}
    .card-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#ff6b35,#f7931e);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
    .card-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f97316}
    .card-body{padding:4px 0}
    .info-row{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.04)}
    .info-row:last-child{border-bottom:none}
    .info-label{font-size:12px;color:#64748b;font-weight:500;min-width:110px}
    .info-value{font-size:13px;color:#e2e8f0;font-weight:600;text-align:right;word-break:break-word}
    /* Message block */
    .msg-block{margin:0;padding:20px;background:rgba(255,255,255,0.02);font-size:14px;color:#cbd5e1;line-height:1.75;border-radius:0 0 16px 16px}
    /* Status badges */
    .badge{display:inline-flex;align-items:center;gap:5px;padding:5px 14px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase}
    .badge-pending{background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25)}
    .badge-confirmed{background:rgba(16,185,129,0.12);color:#10b981;border:1px solid rgba(16,185,129,0.25)}
    .badge-new{background:rgba(99,102,241,0.12);color:#818cf8;border:1px solid rgba(99,102,241,0.25)}
    /* Highlight box */
    .highlight{background:linear-gradient(135deg,rgba(255,107,53,0.06),rgba(247,147,30,0.04));border:1px solid rgba(255,107,53,0.15);border-radius:14px;padding:20px 24px;margin:20px 0;font-size:15px;line-height:1.75;color:#e2e8f0}
    .highlight-greeting{font-size:20px;font-weight:800;color:#fff;margin-bottom:8px}
    /* CTA Button */
    .cta-wrap{text-align:center;margin:28px 0 8px}
    .cta-btn{display:inline-block;background:linear-gradient(135deg,#ff6b35,#f7931e);color:#ffffff !important;text-decoration:none;padding:15px 36px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.3px;line-height:1}
    /* Divider */
    .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,107,53,0.2),transparent);margin:24px 0}
    /* Footer */
    .footer{background:#0d0d12;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;border-top:1px solid rgba(255,107,53,0.1)}
    .footer-logo{height:32px;width:auto;margin-bottom:14px;opacity:0.7}
    .footer-links{margin:12px 0}
    .footer-links a{color:#f97316;text-decoration:none;font-size:12px;font-weight:500}
    .footer-links span{color:#374151;margin:0 8px}
    .footer-copy{font-size:11px;color:#374151;margin-top:14px;line-height:1.6}
    .footer-copy a{color:#4b5563;text-decoration:none}
    /* Responsive */
    @media(max-width:600px){
      .wrapper{padding:12px 8px}
      .header-content,.body,.footer{padding-left:20px !important;padding-right:20px !important}
      .header-title{font-size:20px}
      .info-row{flex-direction:column;align-items:flex-start;gap:4px}
      .info-value{text-align:left !important}
      .cta-btn{display:block;text-align:center}
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-stripe"></div>
      <div class="header-content">
        <div class="logo-wrap">
          <img src="https://sridurgatravels.com/assets/logo-transparent-Bc8nwp6R.png" alt="Sri Durga Travels" class="logo-img">
        </div>
        <div class="header-badge">Sri Durga Travels</div>
        <h1 class="header-title">Your Adventure Partner in Andhra Pradesh</h1>
        <p class="header-subtitle">Vehicle Rentals &nbsp;·&nbsp; Trekking Packages &nbsp;·&nbsp; Group Tours</p>
      </div>
    </div>

    <!-- Body -->
    <div class="body">
      ${bodyContent}
    </div>

    <!-- Footer -->
    <div class="footer">
      <img src="https://sridurgatravels.com/assets/logo-transparent-Bc8nwp6R.png" alt="Sri Durga Travels" class="footer-logo">
      <div class="footer-links">
        <a href="https://sridurgatravels.com">Website</a>
        <span>·</span>
        <a href="https://sridurgatravels.com/booking">Book Now</a>
        <span>·</span>
        <a href="https://sridurgatravels.com/contact">Contact</a>
      </div>
      <p class="footer-copy">
        📍 Andhra Pradesh, India &nbsp;|&nbsp; ✉️ <a href="mailto:orders@sridurgatravels.com">orders@sridurgatravels.com</a><br>
        <span style="margin-top:8px;display:inline-block">© 2025 Sri Durga Travels. All rights reserved.</span>
      </p>
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
