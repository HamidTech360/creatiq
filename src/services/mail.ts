/**
 * Mail Service
 */

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, html }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to send email');

        return { success: true, data: result.data };
    } catch (error: any) {
        console.error('Mail Service Error:', error);
        return { success: false, error: error.message };
    }
}
