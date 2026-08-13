# Insurance Gyani

Run `npm install`, copy `.env.example` to `.env`, add Supabase values, run `supabase/schema.sql`, then `npm run dev`.

The lead form writes directly to the existing Supabase `leads` table. It stores the enquiry source and, for blog CTAs, the blog slug. The public frontend intentionally cannot read leads.

## Blog administration

The `/admin/blogs` route is a protected management structure for creating, editing, deleting and publishing articles. It uses the existing `blogs` table and only loads management data after a Supabase Auth session is present.

Before using it in production:

1. Enable Supabase Auth and create the approved admin user.
2. Set that user’s `app_metadata.role` to `admin` using a trusted server-side/admin workflow.
3. Apply `supabase/schema.sql`, which includes the RLS policy allowing only users with that role to manage blogs.
4. Keep public blog reads limited to `published = true`.

The schema seeds six useful starter articles only when the blogs table is empty. Edit or remove those examples after adding the site’s own content.

The public contact details are:

- Phone: `9891510642`
- WhatsApp: `919891510642`
- Email: `info@insurancegyani.in`

Do not put service-role keys, email provider secrets or other privileged credentials in `VITE_` variables.
