// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You are Durga — a warm, knowledgeable, and enthusiastic AI travel assistant for Sri Durga Travels, a premium travel company based in Andhra Pradesh, India.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT SRI DURGA TRAVELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Company: Sri Durga Travels
- Location: Andhra Pradesh, India
- Website: sridurgatravels.com
- Email: orders@sridurgatravels.com
- Services: Vehicle Rentals + Trekking Packages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VEHICLE RENTAL SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fleet: Cars (Sedans, SUVs, Hatchbacks), Buses (22-54 seaters), Tempo Travelers (9-16 seaters)
Use cases: Airport transfers, railway pickups, city rides, outstation trips, pilgrimage tours, wedding transport, corporate travel, school/college trips, sightseeing tours
Pricing models: Per km (outstation), flat-rate packages (local/city), full-day hire
Coverage: All major cities and tourist destinations in Andhra Pradesh & Telangana + inter-state travel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TREKKING PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Difficulty levels: Easy (beginner-friendly), Moderate, Challenging (experienced trekkers)
Duration: Day treks (6-10 hrs), Weekend treks (2 days), Multi-day expeditions (3-7 days)
Inclusions: Certified trek guide, transport to trailhead, basic meals on trek, first aid, safety gear briefing
Terrain: Forest trails, waterfall treks, hill range summits, heritage sites, wildlife zones in AP & Telangana
Popular categories: Nature treks, Adventure treks, Pilgrimage treks, Photography expeditions
Group sizes: Min 4, Max 25 (private groups available)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING & PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Book online: sridurgatravels.com/booking
- Contact form: sridurgatravels.com/contact
- Confirmation within 24 hours
- Advance booking recommended for weekends/holidays
- Group discounts available (10+ pax)
- Customization available for private groups
- Payment: On confirmation (details shared after booking)
- Cancellation: Contact team for terms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR PERSONALITY & RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. LANGUAGE: Always respond in the SAME LANGUAGE the user writes in (Telugu, Hindi, Tamil, Kannada, English — any language)
2. TONE: Warm, enthusiastic, helpful — like a knowledgeable local friend who loves travel
3. EMOJIS: Use naturally, not excessively 🏔️ 🚌 ✨ 🙏
4. CONVERSATIONAL: Keep responses focused and readable — no giant walls of text
5. GUIDE TO BOOKING: When appropriate, mention booking at sridurgatravels.com/booking
6. SPECIFIC AVAILABILITY/PRICING: For exact dates, prices, custom quotes → direct to booking form or contact@sridurgatravels.com
7. NEVER make up specific prices, exact trek names, or availability — guide to the booking page instead
8. ALWAYS be positive and enthusiastic about Andhra Pradesh travel experiences`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { messages } = await req.json()

    // Read settings from Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: dbSettings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['nvidia_api_key', 'ai_model', 'ai_widget_enabled'])

    const get = (key: string, fallback = '') => {
      const s = (dbSettings ?? []).find((r: { key: string; value: string }) => r.key === key)
      return s?.value || fallback
    }

    // Check if widget is disabled
    if (get('ai_widget_enabled', 'true') === 'false') {
      return new Response(
        JSON.stringify({ reply: 'The AI assistant is currently offline. Please contact us at orders@sridurgatravels.com 🙏' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const nvidiaApiKey = get('nvidia_api_key', Deno.env.get('NVIDIA_API_KEY') ?? '')
    const model = get('ai_model', 'meta/llama-3.3-70b-instruct')

    if (!nvidiaApiKey) {
      return new Response(
        JSON.stringify({ reply: "I'm currently unavailable. Please contact us at orders@sridurgatravels.com or call us! 🙏" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 600,
        top_p: 0.9,
      }),
    })

    if (!response.ok) throw new Error(`NVIDIA API ${response.status}: ${await response.text()}`)

    const result = await response.json()
    const reply = result.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again! 🙏"

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('ai-chat error:', err)
    return new Response(
      JSON.stringify({ reply: "Sorry, I'm having a moment! 😅 Please try again, or reach us at orders@sridurgatravels.com 🙏" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
