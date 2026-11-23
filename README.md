# BookNook — A Small Online Library

A full-stack library app where readers browse a shared catalogue, borrow books
with a 7-day due date, and manage the titles they contribute. The client is a
Next.js 16 App Router application; the API lives in the sibling `book-server/`
project (Express 5 + MongoDB + JWT).

**Live site:** `https://book-nook-frontend.vercel.app` *(Vercel project
`book-nook-frontend` — confirm the final URL in your Vercel dashboard and update
this line if a custom domain or different alias is used.)*

## Features

- **Home page** with a 3-slide auto-playing Swiper hero and dynamic "New Arrivals"
  showing the six most recently added books (`?sort=newest&limit=6`).
- **All Books catalogue** with a responsive card grid and category filtering
  from the home page's Top Categories section.
- **Book details** with cover, description, contributor, availability and a
  one-click borrow confirmation dialog.
- **Book management** — authenticated users can add books (with a *Total Copies*
  field), edit their own books and delete them through custom confirmation
  dialogs (no browser `alert`/`confirm`).
- **Borrowing** — available copies decrease on borrow and increase on return;
  borrowing is disabled and shows **"Not Available"** at zero copies, and a user
  cannot borrow the same book twice at once.
- **My Books / My Borrows / Profile** private pages with loading, empty and error
  states, plus a clean borrow table on desktop and cards on mobile.
- **Authentication** with Better Auth (MongoDB adapter): email/password with
  uppercase + lowercase + 6-character validation, Google OAuth, session
  handling, and a session → JWT bridge for the Express API.
- **Polish** — Sonner toasts, route loading spinner, custom 404 page, per-page
  metadata titles, dark mode, and responsive layouts for mobile/tablet/desktop.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Base UI / shadcn |
| Auth | Better Auth 1.x with MongoDB adapter, Google provider, email/password |
| API | Express 5, JWT (shared `JWT_SECRET`) |
| Database | MongoDB Atlas — `book-nook` database, `books` + `borrows` collections |
| Extras | Swiper, Sonner, lucide-react, next/image, optional imgBB upload proxy |

## Getting started

```bash
cd book-note
npm install
npm run dev          # http://localhost:3000
```

Start `book-server` first (see `book-server/README.md`); the client expects the
API on port 8000 by default.

### Environment (`.env.local`, git-ignored — never commit secrets)

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/?retryWrites=true&w=majority
BETTER_AUTH_SECRET=<random secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
JWT_SECRET=<must exactly match book-server JWT_SECRET>
NEXT_PUBLIC_API_URL=http://localhost:8000
IMGBB_API_KEY=<optional; enables cover file upload in the book form>
```

Notes:

- `JWT_SECRET` **must be identical** in both projects: `/api/token` signs a JWT
  from the Better Auth session and the Express server verifies it.
- `BETTER_AUTH_URL` must be the browser-facing origin in production; Google OAuth
  callbacks are derived from it. Add the matching redirect URI in Google Cloud.
- `NEXT_PUBLIC_API_URL` must point to the deployed Express server in production.
  A relative or missing value falls back to `http://localhost:8000`.
- Email verification and password recovery are intentionally **not** implemented.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Turbopack dev server |
| `npm run build` | Production build (also runs TypeScript checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint 9 flat config |
| `npx tsc --noEmit` | Standalone typecheck (run once after `next dev`/`build`) |

## Project structure

```
src/
  app/
    page.tsx                 home (hero, new arrivals, categories, steps, reviews, CTA)
    books/                   catalogue + category filter + [id] details
    add-book/                create book (private)
    my-books/                edit / delete own books (private)
    my-borrows/              borrowed books + return (private)
    profile/                 account overview (private)
    login/ register/         auth forms (email/password + Google)
    api/auth/[...all]        Better Auth handler
    api/token/               session -> JWT exchange for Express
    api/upload/              optional imgBB proxy
    loading.tsx not-found.tsx
  components/                navbar, footer, sections, cards, modals, ui/
  hooks/use-require-auth.ts  private-route guard with ?next= redirect
  lib/                       api client, auth, jwt, cached book fetchers, types
```

## API used from the client

Base: `NEXT_PUBLIC_API_URL`. Protected calls send `Authorization: Bearer <JWT>`.

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/books`, `/books/:id` | public |
| POST | `/books` | JWT |
| PATCH | `/books/:id` | JWT (owner) |
| DELETE | `/books/:id` | JWT (owner) |
| POST | `/borrows` | JWT |
| GET | `/borrows` | JWT |
| DELETE | `/borrows/:id` | JWT (owner) |
