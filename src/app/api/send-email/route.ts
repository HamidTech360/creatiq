import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'Resend API key is missing' }, { status: 500 });
        }

        if (!html) {
            return NextResponse.json({ error: 'Email body (html) is required' }, { status: 400 });
        }

        const { data: resData, error } = await resend.emails.send({
            from: 'CreateIQ <notifications@createiq.ai>',
            to: [to],
            subject: subject || 'CreateIQ Notification',
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: resData });
    } catch (error: any) {
        console.error("Email API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
