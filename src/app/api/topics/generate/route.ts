import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { niche, voice, force } = await req.json();

        if (!niche) {
            return NextResponse.json({ error: 'Niche is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Act as a world-class social media trend analyst for the ${niche} niche. 
            Your brand voice is: ${voice || 'Professional & Authoritative'}.
            Identify 5 high-impact, specific trending topics OR timeless content pillars that are currently performing well for creators in this niche.
            
            For each topic, provide:
            1. A catchy "Headline" (max 60 chars).
            2. "Why Trending": A brief explanation of why this is valuable right now (focus on pain points or desires).
            3. "Platforms": An array of suitable platforms (LinkedIn, Twitter, Instagram, TikTok).
            4. "Engagement Score": A realistic predicted performance percentage (0-100).

            Return the response as a strict JSON array of objects with exactly these keys: 
            "headline", "why_trending", "suitable_platforms", "engagement_score".
            
            No preamble, no markdown formatting, just the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let topics = [];
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                topics = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found");
            }
        } catch (e) {
            console.error("Gemini Parse Error:", responseText);
            return NextResponse.json({ error: 'Failed to generate topics' }, { status: 500 });
        }

        // Persist to database
        const today = new Date().toISOString().split('T')[0];
        const dbEntries = topics.map((t: any) => ({
            headline: t.headline,
            why_trending: t.why_trending,
            suitable_platforms: t.suitable_platforms,
            engagement_score: t.engagement_score,
            niche,
            date: today,
            user_id: session.user.id
        }));

        // Use simple insert to avoid unique constraint issues if they don't exist
        // The dashboard logic handles filtering duplicates if needed, but for now we focus on SAVING.
        const { data: savedData, error: saveError } = await supabase
            .from('daily_topics')
            .insert(dbEntries)
            .select();

        if (saveError) {
            console.error("Supabase Save Error:", saveError);
            // If insert fails, we still return the generated topics so the user sees them,
            // but we log the error.
        }

        return NextResponse.json({ topics: savedData || topics });

    } catch (error: any) {
        console.error("Generate Topics Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
