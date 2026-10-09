# Sproutify

Sproutify is a platform for organising and joining environmental volunteering events. Hosts publish events (beach cleanups, tree plantations, e-waste drives and more), volunteers register and check in with a QR code, and attendance earns EcoTokens that can be redeemed for eco-friendly rewards.

Live site: https://sproutify.blackburn1910.workers.dev

## Features

### Volunteers
- Browse and filter upcoming events by category, location and date
- Register for events and track them under "My events"
- Check in on the day by scanning the event's QR code
- Earn EcoTokens for attendance and spend them in the redeem shop
- Personal dashboard with registrations, attendance history and token balance

### Hosts (NGOs and community groups)
- Create, edit and delete events, including safety instructions and an optional image
- Generate a QR code per event for check-in
- See registrations and attendance for their own events only

### Admins
- Platform-wide dashboard: events, volunteers, check-ins and monthly deltas
- Manage every event, view the volunteer directory and read the contact inbox
- Mark events as featured on the homepage

### Event categories
Cleanup, Plantation, E-waste, Restoration, Community and Other. Each category has its own artwork and colour.

## Roles

| Role | Can do |
|---|---|
| `VOLUNTEER` | Browse, register, check in, redeem rewards |
| `ORGANIZER` (host) | Everything above, plus manage events they created |
| `ADMIN` | Manage all events, volunteers and messages |

The register page lets a user sign up as a Volunteer or a Host. Host permissions are enforced server-side in `lib/admin-auth.js`, not just hidden in the UI.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3.4, shadcn/ui on Radix primitives, lucide icons |
| Data | PostgreSQL via Prisma 6 with the `pg` driver adapter |
| Auth | JWT, bcryptjs password hashing |
| Client state | TanStack Query, react-hook-form, sonner toasts |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare`, Hyperdrive in front of Supabase Postgres |

## Getting started

### Prerequisites
- Node.js 18 or newer
- A PostgreSQL database (local, or a Supabase project)

### Setup

```bash
git clone https://github.com/sanidhya1910/sproutify.git
cd sproutify
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sproutify"
JWT_SECRET="a-long-random-string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Create the schema and seed the reward catalogue:

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

The app runs at http://localhost:3000.

### Demo accounts

The sign-in page lists three demo accounts: a volunteer (`sanidhya.ravi@example.com`), a host (`host@example.com`) and an admin (`admin@sproutify.local`). They share the password defined in `lib/demo.ts`. These exist for demos only and must not be created in an environment with real users.

In demo mode, volunteer event registrations are stored in the browser's `localStorage` and cleared on logout. They never touch the database.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build for Workers and run it locally with wrangler |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npx prisma studio` | Browse the database |

## Deploying to Cloudflare

The app deploys as a Worker. Database access goes through a Hyperdrive binding declared in `wrangler.jsonc`.

```bash
npm run deploy
```

Things to keep intact when changing the data layer:
- Prisma on Workers uses the driver adapter and the `@prisma/client/wasm` build. `lib/prisma.js` picks the right client at runtime, so use `getPrisma()` rather than constructing a client.
- Use the synchronous bcryptjs functions. The async variants silently return `false` under Workers.
- Keep `serverExternalPackages: ['@prisma/client', '.prisma/client']` in `next.config.js`.

## Project structure

```
app/
  (marketing)/   Public pages: home, about, events, resources, contact
  (auth)/        Login, register, unauthorized
  (app)/         Signed-in app: volunteer/* and admin/* (hosts use admin/*)
  api/           Route handlers: auth, public, volunteer, admin, checkin, contact
  checkin/       Mobile-first QR check-in screen
components/      UI primitives, patterns, chrome, auth guards, event form
lib/             Prisma client, auth helpers, event types, demo data
prisma/          Schema, migrations, reward seed
scripts/         ComfyUI scripts used to generate site artwork
```

## Data model

`User`, `Event`, `EventRegistration`, `Attendance`, `Reward`, `Redemption` and `ContactMessage`, defined in `prisma/schema.prisma`. Events carry a category (`EventType`), a location, a time window, safety instructions and a creator, which is what scopes hosts to their own events. Attendance is recorded by QR check-in and awards EcoTokens.

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push the branch and open a pull request

## License

No license file is included in this repository yet.
