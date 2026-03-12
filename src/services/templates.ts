/**
 * Email Templates for CreateIQ
 */

export const getDailyDigestTemplate = (data: { headline: string; whyTrending: string }) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 2rem;">
        <h1 style="color: #1e293b; font-weight: 900; margin-bottom: 24px;">Your Daily CreateIQ Hub</h1>
        <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Here is your curated trending intel for today.</p>
        
        <div style="background: #f8fafc; padding: 32px; border-radius: 2rem; border: 1px solid #f1f5f9;">
            <h2 style="color: #2563eb; margin: 0 0 16px 0;">${data.headline}</h2>
            <p style="color: #334155; line-height: 1.6;">${data.whyTrending}</p>
        </div>

        <a href="https://create-iq.vercel.app/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 1rem; text-decoration: none; font-weight: 900; margin-top: 32px;">
            Open My Dashboard
        </a>
    </div>
`;

export const getWelcomeTemplate = (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h1 style="color: #1e293b; font-weight: 900;">Welcome to CreateIQ, ${name}!</h1>
        <p style="color: #64748b; font-size: 16px;">We're excited to help you conquer social media. Your daily trends are waiting.</p>
        <a href="https://create-iq.vercel.app/onboarding" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 1rem; text-decoration: none; font-weight: 900; margin-top: 24px;">
            Complete Onboarding
        </a>
    </div>
`;
