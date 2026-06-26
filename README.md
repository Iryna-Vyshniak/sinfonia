# Sinfonia Nobile

A modern full-stack web application featuring **Stripe payments** and **Resend email integration**, built with **Vite + React** and deployed using **Vercel Serverless Functions**.

## Features

- 🎼 Modern responsive UI built with React and Vite
- 💳 Secure online payments powered by Stripe
- 📧 Transactional emails powered by Resend
- ⚡ Serverless backend using Vercel Functions
- 🔒 Secure server-side payment processing
- 🚀 Ready for deployment on Vercel

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion

### Backend

- Vercel Serverless Functions
- Stripe API
- Resend API

---

## Project Structure

```text
.
├── api/
│   ├── create-payment-intent.ts
│   └── send-email.ts
├── public/
├── src/
├── index.html
├── .env.example
├── .env.local
├── package.json
└── vite.config.ts
```

---

## Environment Variables

Create an `.env.example` or `.env.local` file in the project root.

| Variable | Scope | Description |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | Server | Stripe Secret Key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client | Stripe Publishable Key |
| `RESEND_API_KEY` | Server | Resend API Key |
| `RESEND_FROM_EMAIL` | Server | Verified sender email address |

Example:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=info@example.com
```

> **Important**
>
> Never expose `STRIPE_SECRET_KEY` or `RESEND_API_KEY` to the frontend.
>
> Only variables prefixed with `VITE_` are accessible from client-side code.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Local Development

Run the project locally:

```bash
npm run vercel-dev
```

The application will be available at:

```text
http://localhost:5000
```

This command starts:

- Vite Development Server
- Vercel Serverless Functions

---

## Stripe Integration

Payments are processed using **Stripe PaymentIntents**.

### Payment Flow

1. User selects tickets.
2. Frontend sends a request to `/api/create-payment-intent`.
3. Server validates ticket quantities.
4. Server calculates the total amount.
5. Stripe creates a PaymentIntent.
6. The API returns a `clientSecret`.
7. Stripe.js confirms the payment on the client.

### Security

- Prices are calculated **only on the server**.
- The frontend never sends the final payment amount.
- Stripe Secret Key never leaves the server.

> **Note**
>
> Stripe allows HTTP during local development (`localhost`), but **HTTPS is required in production**.

---

## Email Integration

Emails are sent using **Resend** through the `/api/send-email` endpoint.

Typical use cases include:
- Newsletter subscriptions

Requirements:

- Valid `RESEND_API_KEY`
- Verified sender email or domain

---

## Serverless Functions

### `/api/create-payment-intent.ts`

Responsibilities:

- Validate ticket selections
- Calculate payment amount
- Create Stripe PaymentIntent
- Return `clientSecret`

---

### `/api/send-email.ts`

Responsibilities:

- Generate email content
- Send transactional emails through Resend

---

## Security

The application follows several security best practices:

- Sensitive API keys remain server-side.
- Payment totals are calculated exclusively on the backend.
- Environment variables are never committed to Git.
- Production secrets should be configured in the Vercel Dashboard.

---

## Build

Create a production build:

```bash
npm run build
```

---

## Deployment

Deploy the project by connecting the repository to **Vercel**.

During deployment, Vercel automatically:

- Builds the Vite application
- Deploys every file inside `/api` as a Serverless Function
- Injects configured Environment Variables

---

## Production Requirements

Before deploying:

- Configure all required Environment Variables.
- Use HTTPS.
- Verify your sender email or domain in Resend.
- Configure your Stripe API keys.

---

## Notes

If the project is migrated to a dedicated backend (for example Express or NestJS), the logic currently located inside the `/api` directory can be moved without requiring changes to the frontend payment flow.

---

## License

This project is intended for educational and portfolio purposes.