import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topicHeadline, whyTrending, platform, tone, wordCount = 'Medium' } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const lengthGuideline = {
            'Short': 'under 50 words (concise and punchy)',
            'Medium': 'between 100-200 words (balanced detail)',
            'Long': 'over 300 words (deep dive / storytelling)'
        }[wordCount as 'Short' | 'Medium' | 'Long'] || 'balanced length';

        const prompt = `
            You are an expert social media content creator. Generate 3 unique, high-engagement post variations for ${platform} based on the following trending topic:
            
            Topic: ${topicHeadline}
            Context: ${whyTrending}
            Tone: ${tone || 'Professional yet engaging'}
            Target Length: ${lengthGuideline}
            
            Requirements:
            1. Return the output as a JSON array of 3 objects.
            2. Each object must have: "version" (A, B, or C), "content" (the post body), "hashtags" (an array of strings), and "cta" (a compelling call to action).
            3. Ensure the content is optimized for ${platform}'s typical character limits and formatting (line breaks, emojis).
            4. Respect the requested word count: ${lengthGuideline}.
            5. The response MUST be a valid JSON array and nothing else.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Basic JSON parsing from the response
        let variations = [];
        try {
            // Find JSON in the response string (sometimes AI adds markdown blocks)
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                variations = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not find valid JSON in AI response");
            }
        } catch (e) {
            console.error("Failed to parse Gemini response:", responseText);
            return NextResponse.json({
                error: 'The AI returned an invalid response format. Please try again.',
                details: 'JSON_PARSE_ERROR'
            }, { status: 500 });
        }

        return NextResponse.json({ variations });

    } catch (error: any) {
        console.error("Gemini Error:", error);

        // Return a clean error message for the frontend
        if (error.message?.includes('503') || error.message?.includes('Service Unavailable') || error.message?.includes('fetch failed')) {
            return NextResponse.json({
                error: 'AI services are currently busy or unavailable. Please try again in 30 seconds.',
                details: 'SERVICE_UNAVAILABLE'
            }, { status: 503 });
        }

        if (error.message?.includes('429') || error.message?.includes('quota')) {
            return NextResponse.json({
                error: 'Daily generation limit reached. Please try again tomorrow.',
                details: 'QUOTA_EXCEEDED'
            }, { status: 429 });
        }

        return NextResponse.json({
            error: 'AI generation failed. Please try a different tone or try again shortly.'
        }, { status: 500 });
    }
}
