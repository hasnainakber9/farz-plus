# Farz+

Farz+ is a human-led parent-care coordination platform for Pakistani families, care managers, Saathis, and clinicians. This repository contains the public experience and the Production V1 application foundation.

## Production V1 capabilities

- Animated public site with a responsive React Three Fiber care network.
- Educational handoff simulator with risk screening, Corti context, and human approval boundaries.
- Persona journeys for overseas families, care teams, and doctors.
- Supabase SSR auth, Postgres migration, RLS, private Storage, consent records, audit events, and Realtime-ready reads.
- Role-gated family, care-manager, clinician, and administrator dashboards.
- Database-backed parent records, care requests, messaging, notifications, documents, subscriptions, and deletion requests.
- Server-only Corti gateway with explicit disabled, ready, and live states; live PHI is disabled by default.
- Locally bundled, credited imagery for reliable demonstrations.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Key routes

- `/` - public platform and educational handoff simulator
- `/families` - overseas family journey
- `/care-teams` - care manager and Saathi journey
- `/doctors` - doctor and clinic journey
- `/login` - unified role entry
- `/dashboard/family` - family care record
- `/dashboard/care-manager` - safety handoff and MAR workspace
- `/dashboard/doctor` - clinical escalation portal

## API routes

- `GET /api/platform/snapshot`
- `GET /api/platform/events`
- `POST /api/platform/messages`
- `PATCH /api/platform/cases/:caseId`
- `PATCH /api/platform/medications/:medicationId`
- `POST /api/platform/emergency`

API routes require Supabase configuration and authenticated role access where records are involved. The migration applies tenant-aware RLS policies; apply it to isolated staging and production projects before using real records.

## Corti integration

Copy `.env.example` to `.env.local` and add the Corti OAuth client credentials for the approved tenant. Credentials remain server-side.

```bash
CORTI_CLIENT_ID=...
CORTI_CLIENT_SECRET=...
CORTI_ENVIRONMENT=eu
CORTI_TENANT=base
CORTI_ENABLED=false
CORTI_LIVE_PHI_ENABLED=false
CORTI_DPA_APPROVED=false
CORTI_TRANSFER_APPROVED=false
```

Live PHI processing remains disabled until recorded consent, an administrator-approved DPA, documented EU transfer approval, and an explicit activation event exist. WhatsApp automation remains disabled unless real Meta credentials are configured; in-app messaging is the production channel.

## Deployment checklist

1. Create isolated Mumbai Supabase staging and production projects.
2. Apply `supabase/migrations/202608080001_platform.sql` to both projects.
3. Configure Vercel Preview/Development and Production variables from `.env.example`.
4. Configure Supabase email templates and callback URLs.
5. Create and verify `hasnainakber9@gmail.com`, then complete administrator MFA.
6. Run disposable-account, mobile, accessibility, and adversarial RLS acceptance tests before promotion.

Farz+ describes nationwide digital access. Physical and external-provider coordination is confirmed case by case. The platform does not claim HIPAA, GDPR, Pakistani privacy-law, medical certification, response-time, partner, or user adoption status without formal evidence.

## Safety boundary

Farz+ coordinates care. It does not diagnose, prescribe, replace licensed clinicians, or promise emergency dispatch or clinical outcomes.
