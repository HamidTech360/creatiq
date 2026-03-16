import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();
        const plunkApiKey = process.env.PLUNK_API_KEY;

        if (!plunkApiKey) {
            return NextResponse.json({ error: 'Plunk API key is missing. Please add PLUNK_API_KEY to your .env file.' }, { status: 500 });
        }

        if (!html || !to) {
            return NextResponse.json({ error: 'Recipient and Email body (html) are required' }, { status: 400 });
        }

        const response = await fetch('https://api.useplunk.com/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${plunkApiKey}`,
            },
            body: JSON.stringify({
                to: to,
                subject: subject || 'CreateIQ Notification',
                body: html, // Plunk uses 'body' for the content
            }),
        });

        const resData = await response.json();

        if (!response.ok) {
            console.error("Plunk Error:", resData);
            return NextResponse.json({ error: resData.message || 'Failed to send email via Plunk' }, { status: response.status });
        }

        return NextResponse.json({ success: true, data: resData });
    } catch (error: any) {
        console.error("Email API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
