# Farz+

Farz+ is a human-led parent-care operating platform for Pakistani families, care managers, Saathis, and doctors. This repository contains the interactive public experience and a synchronized multi-role working prototype.

## Prototype capabilities

- Animated public site with a responsive React Three Fiber care network.
- Live WhatsApp handoff simulator with risk screening, Corti context, and human approval.
- Persona journeys for overseas families, care teams, and doctors.
- Role-gated family, care-manager, and doctor dashboards.
- Shared patient, message, medication, escalation, and care-log records.
- Server-Sent Events for live updates across open dashboards.
- REST API routes for handoffs, case decisions, medications, and emergency requests.
- Server-only Corti adapter with explicit demo, ready, and live states.
- Locally bundled, credited Pexels imagery for reliable demonstrations.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Overseas family | `family@farzplus.pk` | `FarzFamily123` |
| Care manager | `care@farzplus.pk` | `FarzCare123` |
| Doctor | `doctor@farzplus.pk` | `FarzDoctor123` |

The login form prefills the selected role's credentials.

## Key routes

- `/` - public platform and live handoff simulator
- `/families` - overseas family journey
- `/care-teams` - care manager and Saathi journey
- `/doctors` - doctor and clinic journey
- `/login` - unified role entry
- `/dashboard/family` - family care record
- `/dashboard/care-manager` - safety handoff and MAR workspace
- `/dashboard/doctor` - clinical escalation portal

## Prototype APIs

- `GET /api/platform/snapshot`
- `GET /api/platform/events`
- `POST /api/platform/messages`
- `PATCH /api/platform/cases/:caseId`
- `PATCH /api/platform/medications/:medicationId`
- `POST /api/platform/emergency`

The prototype repository is an in-memory, tenant-scoped server store. It is intentionally easy to demo and replace. Before handling real patient records, connect PostgreSQL or Supabase, enforce row-level tenant access, add production authentication, encrypt sensitive data, and complete clinical, privacy, and incident-response review.

## Corti integration

Copy `.env.example` to `.env.local` and add the Corti OAuth client credentials for the approved tenant. Credentials remain server-side.

```bash
CORTI_CLIENT_ID=...
CORTI_CLIENT_SECRET=...
CORTI_ENVIRONMENT=eu
CORTI_TENANT=base
CORTI_LIVE_SYNC=false
```

`CORTI_LIVE_SYNC=false` keeps the integration in safe demo mode. Enable live interaction creation only for an approved deployment. The current adapter sends a non-identifying Farz+ case reference and does not send family messages, medications, or other health information.

## Safety boundary

Farz+ coordinates care. It does not diagnose, prescribe, replace licensed clinicians, or contact emergency services in this prototype.
