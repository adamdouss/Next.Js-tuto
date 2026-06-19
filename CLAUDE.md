# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The Git repo root is `Tuto Next.Js/`, but the actual application lives in the **`nextjs-dashboard/`** subdirectory. Run all commands from there. This is the Next.js App Router "Learn" course dashboard app, extended past the starter (auth, search/pagination, streaming, error handling are implemented).

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`). All from `nextjs-dashboard/`:

- `pnpm dev` — dev server with Turbopack (http://localhost:3000)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm exec eslint .` — lint (flat config in `eslint.config.mjs`; there is no `lint` npm script)

There is **no test runner** configured in this project.

### Database (Postgres on Neon/Vercel)

- Seed the database by running the app and hitting `GET /seed` (`app/seed/route.ts`) — creates tables and loads `app/lib/placeholder-data.ts`.
- `GET /query` (`app/query/route.ts`) is an ad-hoc SQL debug endpoint.
- Requires `POSTGRES_URL` and `AUTH_SECRET` in `.env` (gitignored; already present locally). The `postgres` client always connects with `{ ssl: 'require' }`.

## Architecture

Next.js App Router with React Server Components by default. Three layers under `app/`:

- **Data reads — `app/lib/data.ts`**: every fetch is an `async` function running a tagged-template SQL query via the `postgres` package. Called directly from Server Components. `fetchRevenue` has an intentional 3s `setTimeout` to demo streaming — do not "fix" it.
- **Mutations — `app/lib/actions.ts`**: Server Actions (`'use server'`). Pattern is: Zod-validate `FormData` → run SQL → `revalidatePath()` → `redirect()`. `createInvoice` returns a `State` object for field-level form errors; `authenticate` wraps NextAuth `signIn` and maps `AuthError` to messages.
- **Types — `app/lib/definitions.ts`**: hand-written types mirroring DB columns (snake_case, e.g. `customer_id`, `image_url`). No ORM.

UI components live in `app/ui/`, grouped by feature (`dashboard/`, `invoices/`, `customers/`). Routes live in `app/dashboard/`. `app/page.tsx` is the landing page.

### Auth (NextAuth v5 beta, Credentials provider)

Split across two files so the edge middleware stays lightweight:
- `auth.config.ts` — edge-safe config: `pages.signIn = '/login'` and the `authorized` callback that gates everything under `/dashboard` and redirects logged-in users away from public pages. `providers` is intentionally empty here.
- `auth.ts` — full config: adds the `Credentials` provider, queries the `users` table, and verifies passwords with `bcrypt.compare`. Exports `auth`, `signIn`, `signOut`.
- `proxy.ts` — the Next.js middleware (Next 16 renamed `middleware` → `proxy`). It imports only `auth.config.ts` and sets the route `matcher`.

### Conventions / gotchas

- **Money is stored in cents (INT)**. Multiply by 100 on write (`actions.ts`), divide by 100 / use `formatCurrency` (`app/lib/utils.ts`) on read.
- **Search & pagination are URL-driven**: the `Search` client component writes `query`/`page` into `searchParams` (debounced via `use-debounce`); pages read `searchParams` and pass them to `data.ts`. `ITEMS_PER_PAGE = 6` lives in `data.ts`.
- **Streaming** uses `<Suspense>` with skeletons from `app/ui/skeletons.tsx`; the `(overview)` route group + `loading.tsx` provide route-level loading UI.
- Path alias **`@/*` → project root** (e.g. `@/app/lib/data`, `@/auth`).
