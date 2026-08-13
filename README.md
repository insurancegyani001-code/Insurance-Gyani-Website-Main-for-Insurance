# Insurance Gyani Production Starter

Run `npm install`, copy `.env.example` to `.env`, add Supabase values, run `supabase/schema.sql`, then `npm run dev`.

The lead form writes directly to the Supabase `leads` table. The public frontend intentionally cannot read leads. A protected server/admin API is required for the admin dashboard and status management.

Configure a server-side email provider for lead notifications; never put SMTP/API secrets in VITE_ variables.

Replace the placeholder phone, WhatsApp and email before production.
