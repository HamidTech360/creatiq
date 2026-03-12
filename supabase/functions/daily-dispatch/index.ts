import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_WHATSAPP_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

const NICHES = [
    'Technology', 'Business & Finance', 'Health & Fitness',
    'Marketing', 'Lifestyle', 'Parenting', 'Education', 'Entertainment'
]

Deno.serve(async (req) => {
    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Generate topics for each niche
        for (const niche of NICHES) {
            // Mocking Gemini API call for topics
            // In real implementation: fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, ...)

            const mockTopics = [
                {
                    date: new Date().toISOString().split('T')[0],
                    niche,
                    headline: `Trends in ${niche}: What's coming next?`,
                    why_trending: 'Market shift towards automation.',
                    suitable_platforms: ['linkedin', 'twitter'],
                    engagement_score: 85
                }
            ]

            await supabase.from('daily_topics').insert(mockTopics)
        }

        // 2. Fetch users for WhatsApp dispatch
        const { data: users, error: userError } = await supabase
            .from('notification_settings')
            .select('*, profiles(full_name, niche)')
            .eq('whatsapp_enabled', true)

        if (userError) throw userError

        // 3. Dispatch WhatsApp messages
        for (const user of users) {
            const topTopicsRes = await supabase
                .from('daily_topics')
                .select('headline')
                .eq('niche', user.profiles.niche)
                .eq('date', new Date().toISOString().split('T')[0])
                .order('engagement_score', { ascending: false })
                .limit(5)

            const headlines = topTopicsRes.data?.map((t, i) => `${i + 1}. ${t.headline}`).join('\n')
            const message = `👋 Good morning ${user.profiles.full_name}!\n\nHere are your top CreateIQ topics for today:\n${headlines}\n\nOpen CreateIQ to generate your posts → https://createiq.app`

            // Twilio API Call
            await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
                },
                body: new URLSearchParams({
                    From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
                    To: `whatsapp:${user.whatsapp_number}`,
                    Body: message
                })
            })
        }

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
})
