import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const getResend = () => {
    if (!process.env.RESEND_API_KEY) return null;
    return new Resend(process.env.RESEND_API_KEY);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel Serverless Functions only work over HTTPS.
    // Configure CORS if necessary.
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, tourDetails, type = 'reservation' } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const resend = getResend();
    const TELEGRAM_LINK = "https://t.me/+MlIOqCcF0-RlMGNi";

    const rawFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    let EMAIL_FROM = rawFrom.replace(/^["']|["']$/g, "").trim();

    if (EMAIL_FROM.toLowerCase().endsWith("@gmail.com") || EMAIL_FROM.toLowerCase().includes("onboarding@resend.dev")) {
        EMAIL_FROM = "onboarding@resend.dev";
    }

    console.log(`[Email Service] Vercel API attempting delivery. From: ${EMAIL_FROM}, To: ${email}`);

    if (!resend) {
        console.warn("RESEND_API_KEY not found. Simulating email send.");
        return res.json({
            success: true,
            message: "Simulated sending (API KEY missing)",
            isSimulated: true
        });
    }

    try {
        const subject = type === 'newsletter'
            ? 'Sinfonia Nobile - Welcome to Our Mailing List'
            : 'Sinfonia Nobile - Your Reservation Confirmation';

        const html = type === 'newsletter'
            ? `<div style="font-family: serif; background-color: #0d0d0d; color: #f5f5f0; padding: 40px; border: 1px solid #d4af37;"><h1 style="color: #d4af37; font-style: italic;">Sinfonia Nobile</h1><p>Thank you for joining our exclusive circle.</p><hr style="border: 0.5px solid rgba(255,255,255,0.1);" /><p>You will now be the first to receive updates on our global tours.</p><a href="${TELEGRAM_LINK}" style="display: inline-block; background: #26A5E4; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 10px; border-radius: 4px;">Join Telegram Channel</a></div>`
            : `<div style="font-family: serif; background-color: #0d0d0d; color: #f5f5f0; padding: 40px; border: 1px solid #d4af37;"><h1 style="color: #d4af37; font-style: italic;">Sinfonia Nobile</h1><p>Welcome to the circle of elegance.</p><hr style="border: 0.5px solid rgba(255,255,255,0.1);" /><p>Date: ${tourDetails?.date || 'Upcoming Performance'}</p><a href="${TELEGRAM_LINK}" style="display: inline-block; background: #26A5E4; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 10px; border-radius: 4px;">Join Telegram Channel</a></div>`;

        const response = await resend.emails.send({
            from: EMAIL_FROM,
            to: [email],
            subject,
            html
        });

        if (response.error) {
            console.error("Resend API error:", response.error);

            let userMessage = response.error.message;
            const errName = response.error.name?.toLowerCase() || "";
            const errMsg = response.error.message?.toLowerCase() || "";

            if (errMsg.includes("can only send testing emails") || errMsg.includes("not verified")) {
                console.warn(`[Sandbox Mode] Simulated sending for unauthorized email: ${email}`);
                return res.json({
                    success: true,
                    message: "Simulated sending (Sandbox limits applied)",
                    isSimulated: true
                });
            }

            if (errMsg.includes("invalid from")) {
                userMessage = "Sender config error: You cannot send FROM a @gmail.com address.";
            } else if (errName.includes("limit") || errMsg.includes("limit")) {
                userMessage = "Daily email limit reached. Please try again tomorrow.";
            }

            return res.status(400).json({ error: userMessage, code: response.error.name });
        }

        res.status(200).json({ success: true, data: response.data, isSimulated: false });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
}