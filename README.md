# PerfectFit Blinds

A responsive Next.js website for a Manchester blinds business, designed to turn product enquiries into free home-measurement appointments and quotations.

## Customer Journey

- Home, Blinds, About, Contact and Book a Free Home Visit pages share responsive navigation and clear enquiry calls to action.
- The quote form collects contact details, a UK postcode, blind type, number of windows, preferred date, service requested and optional notes.
- Zod validates submissions in the browser and again in the API. Successful requests receive an on-screen confirmation.
- The private dashboard at `/admin` lists enquiries, shows full customer details, and tracks New, Contacted, Measurement Booked, Quote Sent, Won and Lost statuses.

## Architecture

- **Frontend:** Next.js App Router, React and Tailwind CSS. Shared site header/footer components keep public pages consistent; Manrope is used for headings and Inter for body/UI text.
- **Backend/API:** Route handlers in `app/api` accept enquiries, serve dashboard data and update lead status.
- **Database:** Supabase Postgres stores enquiry records. `lib/db.ts` uses the server-only service-role key; the table definition and row-level security setup are in `supabase/schema.sql`.
- **Authentication:** Admin credentials are supplied as server environment variables. Successful sign-in sets a signed, eight-hour, HttpOnly, SameSite cookie. Dashboard pages and customer-data API routes verify the session on the server.
- **Validation:** The shared `lib/enquiry-schema.ts` schema is used by React Hook Form and the enquiry API, so client and server rules stay aligned.

## Local Setup

1. Create or select a Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Copy `.env.example` to `.env.local` and set the project URL, server-only service-role key, admin username, a unique strong admin password, and a random session secret of at least 32 characters. Never expose or commit the service-role key.
3. Install dependencies with `npm ci`.
4. Start the site with `npm run dev`; visit `http://localhost:3000` and sign in at `/admin/login`.

Generate a session secret with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Data Protection

- Public visitors can submit a validated enquiry but cannot read leads or change lead status.
- Only the server uses the Supabase service-role key. The enquiries table has row-level security enabled and grants no access to anonymous or authenticated browser roles.
- Lead reads and updates require the signed admin session. Session cookies are HttpOnly, expire after eight hours and use Secure in production.
- Deploy behind HTTPS, keep secrets in the hosting provider’s encrypted environment settings, and configure edge rate limits for the public enquiry and admin-login endpoints before launch.
- Define a retention period and privacy notice for customer data before accepting production enquiries.

## Existing Local Data

`data/enquiries.json` is a legacy local store and is no longer used by the application. Review and securely migrate any records it contains to Supabase before removing the local copy. It is ignored for future Git changes, but if it was already tracked, remove it from the repository and its history before publishing; do not commit customer contact details.

## Deployment and SEO

Deploy the Next.js app to a Node-compatible host such as Vercel, set the environment variables above, and run the SQL schema against the production Supabase project before accepting leads. Configure rate limits at the hosting edge and verify the production domain in the canonical metadata URL in `app/layout.tsx`.

Page-specific titles, descriptions and canonical paths are defined alongside each public route. The site uses semantic page landmarks, a single primary heading per page, descriptive image labels, internal links and responsive layouts.

Useful checks:

```sh
npm run lint
npm run build
```