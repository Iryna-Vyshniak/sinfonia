import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const TICKET_CATEGORIES = [
    { id: 'vip', name: 'VIP Circle', price: 250 },
    { id: 'parterre', name: 'Parterre', price: 150 },
    { id: 'balcony', name: 'Balcony', price: 90 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const origin = req.headers.origin;
    
    // Explicit CORS check instead of invalid wildcard + credentials match
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
         return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { items, tourDetails } = req.body;
        if (!items || typeof items !== 'object' || Object.keys(items).length === 0) {
            return res.status(400).json({ error: "No tickets selected." });
        }

        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ error: "Payment gateway configuration error." });
        }

        const stripe = new Stripe(secretKey, {
            apiVersion: "2026-05-27.dahlia",
        });

        let totalAmountCents = 0;

        for (const [catId, qty] of Object.entries(items)) {
            const quantity = Number(qty);
            
            // Critical Input Validation: Reject zero, negative numbers, non-integers, or malicious payloads
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ error: `Invalid ticket quantity specified for category: ${catId}` });
            }

            const category = TICKET_CATEGORIES.find(c => c.id === catId);
            if (!category) {
                return res.status(400).json({ error: `Unknown ticket category payload matching identifier: ${catId}` });
            }

            totalAmountCents += category.price * quantity * 100;
        }

        if (totalAmountCents === 0) {
            return res.status(400).json({ error: "Total calculation cannot compute to zero base values." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmountCents,
            currency: "usd",
            metadata: {
                tourId: String(tourDetails?.id || ""),
                city: String(tourDetails?.city || ""),
            },
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("[PaymentIntent Processing Error]:", error);
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : "Internal system gateway exception occurred." 
        });
    }
}