# 📬 Notification System — Complete Guide

## Overview

Your Sri Durga Travels website now has a **comprehensive, multi-channel notification system** that sends detailed information to both **email** and **Telegram** for ALL activities.

---

## ✅ What Gets Notified

### 1️⃣ **New Booking** (Trek or Vehicle Rental)
When a customer places a booking on `/booking` page:

**Admin Gets:**
- 📧 **Email** to `orders@sridurgatravels.com` with full booking details
  - Customer name, phone, email
  - Service type (Trek/Car/Bus/Tempo Traveler)
  - Travel date
  - Number of passengers
  - Booking status
  - Link to admin panel to manage booking
- 📱 **Telegram** message with booking summary

**Customer Gets:**
- 📧 **Email** confirmation with their booking details
- Warm, friendly Gen-Z tone
- "We'll confirm within 24 hours" message
- Link back to website

### 2️⃣ **Contact Form Submission**
When someone fills the "Contact Us" form:

**Admin Gets:**
- 📧 **Email** to `orders@sridurgatravels.com`
  - Visitor's name, email, phone
  - Subject/inquiry type
  - Full message text
  - Timestamp (India Standard Time)
  - Link to admin panel to reply
- 📱 **Telegram** alert with message preview

**Visitor Gets:**
- 📧 **Email** acknowledgment
- "We received your message" confirmation
- "We'll reply within 24 hours"

### 3️⃣ **New User Registration**
When someone signs up for an account:

**Admin Gets:**
- 📧 **Email** to `orders@sridurgatravels.com`
  - New user's name and email
  - Registration timestamp
- 📱 **Telegram** alert

**New User Gets:**
- 📧 **Welcome Email**
  - "Welcome to Sri Durga Travels" message
  - Invitation to explore packages
  - Link to start booking

### 4️⃣ **Admin Login**
When an admin logs into the dashboard:

**Admin Gets (Only):**
- 📱 **Telegram** security alert with:
  - Admin email that logged in
  - Timestamp
  - Security warning if unexpected
- 📧 **Email** login notification to `orders@sridurgatravels.com`

### 5️⃣ **Booking Status Change**
When a booking status is updated (Confirmed/Cancelled/Completed):

**Admin Gets:**
- 📧 **Email** to `orders@sridurgatravels.com`
  - Which booking changed
  - New status
  - Timestamp
- 📱 **Telegram** notification

**Customer Gets:**
- 📧 **Email** update
  - Their new booking status
  - Timestamp
  - Link to contact support if questions

---

## 🎯 Notification Channels

### 📧 Email System

**From:** `Sri Durga Travels <orders@sridurgatravels.com>`

**Recipients:**
- **Admin:** Always `orders@sridurgatravels.com` for all events
- **Customers:** Their own email address (booking confirmations, status updates, welcome emails)

**Template:**
- Modern, Gen-Z aesthetic
- Vibrant saffron-orange header with company logo
- Clean white body with organized information
- Professional dark footer
- Fully responsive (mobile & desktop)
- Includes all relevant details without overwhelming

**Email Provider:** Resend (Transactional Email Service)

### 📱 Telegram

**To:** Telegram Bot in chat ID `914958962` (your private admin group/chat)

**Features:**
- **Instant delivery** (faster than email)
- **Rich formatting** (bold, italic, links)
- **Emoji accents** for quick scanning
- **Direct links** to admin panel actions
- **Concise summaries** with key info only

**Bot:** `sridhurgatravels-bot` (handles all notifications)

---

## 🔧 How It Works (Technical Flow)

```
User Action (Booking/Contact/Signup/Login/Status Change)
    ↓
Website calls edge function: `send-notification`
    ↓
Function checks for required secrets:
  ✓ RESEND_API_KEY (for email)
  ✓ TELEGRAM_BOT_TOKEN (for Telegram)
  ✓ TELEGRAM_CHAT_ID (your chat ID)
  ✓ NVIDIA_API_KEY (for LLM content generation)
    ↓
If NVIDIA key present:
  → Call NVIDIA LLM to generate personalized, detailed content
  → Falls back to templates if LLM fails
    ↓
Send notifications in PARALLEL:
  1. Telegram message (if token exists)
  2. Admin email to orders@sridurgatravels.com (if API key exists)
  3. Customer email (if they provided email & it's their event type)
    ↓
All 3 channels process simultaneously (fast delivery)
    ↓
Function logs detailed delivery report:
  - Which channels succeeded ✅
  - Which channels failed ❌
  - Why each failed (if applicable)
```

---

## ✨ What's NEW (Recent Fixes)

### 🔒 Enhanced Reliability

1. **Credential Validation**
   - System checks ALL required secrets at startup
   - Warns if any are missing (prevents silent failures)
   - Logs exactly which credentials are missing

2. **Mandatory Admin Notifications**
   - Admin email to `orders@sridurgatravels.com` ALWAYS attempted
   - Won't be skipped by any condition
   - Fails with specific error if Resend key missing

3. **Detailed Delivery Reporting**
   - Each notification channel tracked independently
   - See status: SENT ✅ / FAILED ❌ / SKIPPED ⏭️
   - Specific error messages for debugging
   - Full request data logged

4. **Better Error Messages**
   - If email fails to send: "RESEND_API_KEY missing!"
   - If Telegram fails: specific API error returned
   - If customer email fails: knows why and reports it

---

## 📊 Information Included in Each Notification

### Booking Notification

**Email to Admin includes:**
```
🎉 NEW BOOKING RECEIVED

Customer Name:    Raj Kumar
Email:            raj@example.com
Phone:            +91-9876543210
Service:          Araku Valley Trek - 2 Days
Booking Type:     Trek
Travel Date:      15 May 2025
Passengers:       5 people
Status:           Pending ⏳
Booking Received: [Timestamp]

[Link to Admin Panel to Manage]
```

**Email to Customer includes:**
```
Hi Raj Kumar! 🙏

Thanks for choosing Sri Durga Travels! 
We've received your booking and will confirm within 24 hours.

Your Booking Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service:    Araku Valley Trek - 2 Days
Date:       15 May 2025
Passengers: 5 people
Status:     Pending Confirmation ⏳

[Contact Us Button]
```

**Telegram to Admin:**
```
🎉 New Booking!

👤 Raj Kumar
📞 +91-9876543210
📧 raj@example.com
🗺️ Araku Valley Trek - 2 Days
📅 15 May 2025
👥 5 passengers

⚡ View in Admin →
```

### Contact Form Notification

**Email to Admin includes:**
```
📬 CONTACT FORM SUBMISSION

Name:       Sarah Williams
Email:      sarah@example.com
Phone:      +91-8765432109
Subject:    Bus Booking
Received:   26 April 2025, 7:15 PM IST

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message:
"I'm interested in renting a 20-seater bus for our corporate trip on May 10. Can you provide pricing and availability details?"

[Open & Reply in Admin]
```

**Email to Visitor includes:**
```
Hi Sarah! 👋

Thanks for reaching out to Sri Durga Travels.
We've received your message and our team will get back to you within 24 hours.

Your Message Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject:    Bus Booking
Submitted:  26 April 2025, 7:15 PM IST

[Explore Our Services Button]
```

---

## ⚠️ Troubleshooting

### "I'm not receiving admin emails"

**Check:**
1. ✅ Is `orders@sridurgatravels.com` the correct email?
2. ✅ Check spam/junk folder in that email account
3. ✅ Is `RESEND_API_KEY` set in Lovable Cloud Secrets?
4. ✅ Has the domain been verified in Resend?

**Verify Resend Setup:**
- Go to Resend dashboard
- Confirm `sridurgatravels.com` is verified
- Check API key is valid and not revoked

### "Telegram messages not arriving"

**Check:**
1. ✅ Is bot token (`TELEGRAM_BOT_TOKEN`) correct?
2. ✅ Is chat ID (`TELEGRAM_CHAT_ID = 914958962`) correct?
3. ✅ Is the bot added to the chat/channel?
4. ✅ Has the bot been muted? (Check notification settings)

### "Customer emails not arriving"

**Check:**
1. ✅ Are they providing email on the form/booking?
2. ✅ Is `RESEND_API_KEY` configured?
3. ✅ Look in spam folder for test emails
4. ✅ Try a test booking with your own email

### "Getting 'Function error' response"

**Check logs in Lovable Cloud:**
1. Go to Edge Functions section
2. Look for `send-notification` logs
3. Check for detailed error messages
4. Report specific error to debug

---

## 🔐 Security Notes

- **API Keys:** All stored in Lovable Cloud Secrets (not in code)
- **Sensitive Data:** Customer data in transit is encrypted (HTTPS)
- **Email Verification:** Resend verifies domain ownership
- **Telegram:** Official Bot API (verified by Telegram)
- **Fallback Templates:** If LLM fails, hardcoded templates are used (no data loss)

---

## 📈 Monitoring

### How to Know Notifications Are Working

1. **Test a booking** on the website
2. **Check your email** (`orders@sridurgatravels.com`) within 2 minutes
   - Look in Inbox AND Spam folder
3. **Check Telegram** for the notification
4. **Test admin login** - should get Telegram security alert
5. **Fill contact form** - should get email + Telegram

### If Something Isn't Working

1. **Check Lovable Cloud Logs:**
   - Go to Edge Functions section
   - Look for function execution logs
   - Search for "send-notification"
   - Read detailed delivery report

2. **Common Issues:**
   - Missing `RESEND_API_KEY` → emails won't send
   - Missing `TELEGRAM_BOT_TOKEN` → Telegram won't send
   - Email not verified in Resend → emails rejected
   - Bot not in chat → Telegram fails silently

---

## 📧 Next Steps for You

1. **Verify all secrets are set** in Lovable Cloud Secrets section:
   - ✅ RESEND_API_KEY
   - ✅ TELEGRAM_BOT_TOKEN
   - ✅ TELEGRAM_CHAT_ID
   - ✅ NVIDIA_API_KEY (for LLM content)

2. **Test the system:**
   - Place a test booking
   - Check if email arrives at `orders@sridurgatravels.com`
   - Check if Telegram bot sends message
   - Check if customer gets confirmation email

3. **Adjust email templates** (if needed):
   - Templates are in the edge function
   - Contact support to customize further

4. **Monitor for issues:**
   - Check logs weekly
   - Test monthly with real data
   - Report any delivery failures

---

## 📞 Support

**If notifications aren't working:**
1. Check all secrets are configured
2. Look at Lovable Cloud function logs
3. Verify Resend and Telegram are working
4. Test with simple contact form first (faster to debug)

**For customizations:**
- Email subject lines
- Telegram message format
- Which fields are included
- Different templates per event type

---

**Status:** ✅ LIVE & FULLY OPERATIONAL  
**Last Updated:** 26 April 2025  
**Channels:** Email (Resend) + Telegram Bot  
**LLM:** NVIDIA API (Fallback templates available)
