console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
console.log('ENV KEYS:', Object.keys(process.env).filter(key =>
  key.includes('STRIPE')
));

import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";



export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    try {
        const { items, tourDetails } = req.body;
        if (!items || Object.keys(items).length === 0) {
            return res.status(400).json({ error: "No tickets selected." });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(400).json({ error: "STRIPE_SECRET_KEY is not configured." });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2026-05-27.dahlia",
        });

        const ticketCategories = [
            { id: 'vip', name: 'VIP Circle', price: 250 },
            { id: 'parterre', name: 'Parterre', price: 150 },
            { id: 'balcony', name: 'Balcony', price: 90 },
        ];

        let amount = 0;
        Object.entries(items).forEach(([catId, qty]) => {
            const cat = ticketCategories.find(c => c.id === catId);
            if (cat) amount += cat.price * (qty as number);
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // cents
            currency: "usd",
            metadata: {
                tourId: tourDetails?.id || "",
                city: tourDetails?.city || "",
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("[PaymentIntent] Error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create payment intent" });
    }
}
