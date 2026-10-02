# PerfectFit Blinds

A responsive Next.js website for a Manchester blinds business, designed to turn product enquiries into free home-measurement appointments and quotations.

## Customer Journey

- Home, Blinds, About, Contact and Book a Free Home Visit pages share responsive navigation and clear enquiry calls to action.
- The quote form collects contact details, a UK postcode, blind type, number of windows, preferred date, service requested and optional notes.
- Zod validates submissions in the browser and again in the API. Successful requests receive an on-screen confirmation.
- The quote form validates Manchester-area postcodes, uses a honeypot and a database-backed per-IP request limit, and sends Resend confirmation and business notification emails when configured.
- The private dashboard at `/admin` lists and filters enquiries, shows weekly/funnel summaries and a status audit timeline, and tracks New, Contacted, Measurement Booked, Quote Sent, Won and Lost statuses.

## Architecture

- **Frontend:** Next.js App Router, React and Tailwind CSS. Shared site header/footer components keep public pages consistent; Manrope is used for headings and Inter for body/UI text.
- **Backend/API:** Route handlers in `app/api` accept enquiries, serve dashboard data and update lead status.
- **Database:** Supabase Postgres stores enquiry records. `lib/db.ts` uses the server-only service-role key; the table definition and row-level security setup are in `supabase/schema.sql`.
- **Authentication:** Admin credentials are supplied as server environment variables. Successful sign-in sets a signed, eight-hour, HttpOnly, SameSite cookie. Dashboard pages and customer-data API routes verify the session on the server.
- **Validation:** The shared `lib/enquiry-schema.ts` schema is used by React Hook Form and the enquiry API, so client and server rules stay aligned.

## Local Setup

1. Create or select a Supabase project and run `supabase/schema.sql` in its SQL Editor. Rerun it after schema updates to install the audit-history and rate-limit RPCs.
2. Copy `.env.example` to `.env.local` and set the project URL, server-only service-role key, admin username, a unique strong admin password, session/rate-limit secrets of at least 32 characters, and Resend settings. Never expose or commit the service-role key.
3. Install dependencies with `npm ci`.
4. Start the site with `npm run dev`; visit `http://localhost:3000` and sign in at `/admin/login`.

Generate a session secret with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Data Protection

- Public visitors can submit a validated enquiry but cannot read leads or change lead status.
- Only the server uses the Supabase service-role key. The enquiries table has row-level security enabled and grants no access to anonymous or authenticated browser roles.
- Enquiry IP addresses are HMAC-hashed with `RATE_LIMIT_SECRET` before the database rate limiter stores them; raw IP addresses are not persisted. The honeypot field is discarded before validation and storage.
- Status transitions and audit events are written in one database transaction. Admin usernames are recorded as the actor because this app uses environment-configured admin sessions rather than Supabase Auth users.
- Lead reads and updates require the signed admin session. Session cookies are HttpOnly, expire after eight hours and use Secure in production.
- Deploy behind HTTPS and keep secrets in the hosting provider’s encrypted environment settings. Consider adding an edge limit to admin login as well.
- Define a retention period and privacy notice for customer data before accepting production enquiries.

## Existing Local Data

`data/enquiries.json` is a legacy local store and is no longer used by the application. Review and securely migrate any records it contains to Supabase before removing the local copy. It is ignored for future Git changes, but if it was already tracked, remove it from the repository and its history before publishing; do not commit customer contact details.

## Deployment and SEO

### Vercel checklist

1. Import the repository into Vercel and keep the framework preset as **Next.js**.
2. Add these environment variables in **Project Settings → Environment Variables** for Production, Preview and Development as appropriate:
	- `SUPABASE_URL` — the server-only Supabase API URL, for example `https://your-project-ref.supabase.co`.
	- `SUPABASE_SERVICE_ROLE_KEY` — the server-only Supabase secret/service-role key. Never use a `NEXT_PUBLIC_` name for this key.
	- `ADMIN_USERNAME` — the private dashboard username.
	- `ADMIN_PASSWORD` — a strong, unique dashboard password.
	- `ADMIN_SESSION_SECRET` — at least 32 random characters.
	- `ADMIN_SESSION_SECRET` — at least 32 random characters.
	Save the variables and redeploy; existing deployments do not receive newly added values.
3. In the production Supabase project, run `supabase/schema.sql` once in **SQL Editor**. The website cannot create the table automatically.
4. Deploy with the default Vercel commands. The project scripts already provide `npm run build`.
5. After deployment, test `/quote` by submitting a test enquiry, then sign in at `/admin/login` and confirm it appears in the dashboard.
6. Configure the production domain in `app/layout.tsx` and `app/sitemap.ts` if it differs from the current canonical URL.
7. Keep `.env` out of Git. Use Vercel's encrypted environment variables instead, and rotate any Supabase keys or admin credentials that have been exposed.

Set up Resend with a verified sender domain to enable the two email notifications. SMS/WhatsApp via Twilio is not enabled; it can be added as a separate owner notification channel if the lead workflow needs it.

Before launch, replace the sample business telephone/email in `components/LocalBusinessJsonLd.tsx` with verified public contact details. The structured data is included on the home and contact pages.

Run `npm test` for schema tests. Set `TEST_BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` then run `npm run test:e2e` against a configured running app to verify login, enquiry submission and dashboard feed visibility.

Page-specific titles, descriptions and canonical paths are defined alongside each public route. The site uses semantic page landmarks, a single primary heading per page, descriptive image labels, internal links and responsive layouts.

Useful checks:

```sh
npm run lint
npm run build
npm test
```