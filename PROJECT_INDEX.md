# Project Index: AerialDB

**Generated:** 2025-11-20
**Version:** 0.0.1
**Total LOC:** ~409 lines

---

## 📁 Project Structure

```
aerialdb/
├── src/
│   ├── lib/
│   │   ├── assets/          # Static assets (favicon, etc.)
│   │   ├── paraglide/       # Generated i18n files
│   │   └── server/
│   │       ├── auth.ts      # Session-based authentication
│   │       └── db/
│   │           ├── index.ts # Database client setup
│   │           └── schema.ts # Drizzle ORM schema
│   ├── routes/              # SvelteKit routes
│   │   ├── demo/
│   │   │   ├── lucia/       # Lucia auth demo
│   │   │   └── paraglide/   # i18n demo
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.d.ts             # TypeScript app declarations
│   ├── hooks.server.ts      # Server-side request hooks
│   └── hooks.ts             # Client-side hooks
├── e2e/                     # End-to-end tests
├── messages/                # i18n message files
├── db/                      # SQLite database files
└── static/                  # Static assets
```

---

## 🚀 Entry Points

### Development
- **Dev Server:** `npm run dev` - Start Vite dev server
- **Build:** `npm run build` - Production build
- **Preview:** `npm run preview` - Preview production build

### Testing
- **Unit Tests:** `npm run test:unit` - Vitest unit tests
- **E2E Tests:** `npm run test:e2e` - Playwright e2e tests
- **Full Test Suite:** `npm test` - Run all tests

### Database
- **Push Schema:** `npm run db:push` - Push schema to database
- **Generate Migrations:** `npm run db:generate` - Generate migrations
- **Migrate:** `npm run db:migrate` - Run migrations
- **Studio:** `npm run db:studio` - Open Drizzle Studio

### Code Quality
- **Check:** `npm run check` - Type checking with svelte-check
- **Lint:** `npm run lint` - ESLint + Prettier
- **Format:** `npm run format` - Auto-format code

---

## 📦 Core Modules

### Authentication (`src/lib/server/auth.ts`)
- **Exports:**
  - `generateSessionToken()` - Generate secure session token
  - `createSession(token, userId)` - Create new session
  - `validateSessionToken(token)` - Validate and refresh session
  - `invalidateSession(sessionId)` - Logout/delete session
  - `setSessionTokenCookie(event, token, expiresAt)` - Set session cookie
  - `deleteSessionTokenCookie(event)` - Clear session cookie
- **Purpose:** Session-based authentication using SHA-256 hashed tokens
- **Security:** 30-day sessions with automatic renewal at 15 days

### Database (`src/lib/server/db/`)
- **index.ts:**
  - Exports: `db` - Drizzle ORM client instance
  - Uses: LibSQL client (Turso-compatible)
  - Requires: `DATABASE_URL` environment variable
- **schema.ts:**
  - Tables: `user`, `session`
  - Types: `User`, `Session`
  - Purpose: SQLite database schema with Drizzle ORM

### Server Hooks (`src/hooks.server.ts`)
- **Exports:** `handle` - Combined middleware chain
- **Middleware:**
  - `handleParaglide` - i18n request processing
  - `handleAuth` - Session validation on every request
- **Purpose:** Global request preprocessing

---

## 🔧 Configuration Files

### Core Config
- **svelte.config.js** - SvelteKit configuration
  - Adapter: auto
  - Preprocessors: Vite + MDsveX (markdown support)
  - Extensions: `.svelte`, `.svx`

- **vite.config.ts** - Vite build configuration
  - Plugins: TailwindCSS, SvelteKit, Paraglide i18n, DevTools JSON
  - Test setup: Vitest with browser (client) and node (server) projects

- **drizzle.config.ts** - Database migrations config
  - Schema: `./src/lib/server/db/schema.ts`
  - Dialect: SQLite
  - Connection: `DATABASE_URL` from env

- **tsconfig.json** - TypeScript configuration
  - Strict mode enabled
  - Module resolution: bundler
  - Extends: `.svelte-kit/tsconfig.json`

### Linting & Formatting
- **eslint.config.js** - ESLint v9 flat config
- **prettier** - Auto-formatting (Svelte + TailwindCSS plugins)

---

## 🧪 Test Coverage

### Test Files
- **Unit Tests:**
  - `src/demo.spec.ts`
  - `src/routes/page.svelte.spec.ts`
- **E2E Tests:**
  - `e2e/demo.test.ts`

### Test Configuration
- **Framework:** Vitest + Playwright
- **Browser Tests:** Svelte components (Chromium headless)
- **Server Tests:** Node environment
- **E2E:** Playwright Test (@playwright/test)

---

## 🔗 Key Dependencies

### Framework
- **@sveltejs/kit** ^2.47.1 - SvelteKit framework
- **svelte** ^5.41.0 - Svelte 5 (latest runes)
- **vite** ^7.1.10 - Build tool

### Database & ORM
- **drizzle-orm** ^0.44.6 - TypeScript ORM
- **drizzle-kit** ^0.31.5 - Schema management
- **@libsql/client** ^0.15.15 - LibSQL/Turso client

### Authentication
- **@node-rs/argon2** ^2.0.2 - Password hashing
- **@oslojs/crypto** ^1.0.1 - Cryptographic utilities
- **@oslojs/encoding** ^1.1.0 - Encoding helpers

### UI & Styling
- **@tailwindcss/vite** ^4.1.14 - TailwindCSS v4
- **@tailwindcss/forms** ^0.5.10 - Form styles
- **@tailwindcss/typography** ^0.5.19 - Typography plugin

### Internationalization
- **@inlang/paraglide-js** ^2.4.0 - Type-safe i18n

### Testing
- **vitest** ^4.0.5 - Unit testing
- **@playwright/test** ^1.56.1 - E2E testing
- **@vitest/browser-playwright** ^4.0.5 - Browser testing

### Content
- **mdsvex** ^0.12.6 - Markdown in Svelte

---

## 🌍 Internationalization

### Setup
- **Library:** Paraglide JS (Inlang)
- **Project:** `./project.inlang`
- **Output:** `./src/lib/paraglide` (auto-generated)
- **Languages:**
  - English (`messages/en.json`)
  - Spanish (`messages/es.json`)

### Integration
- Middleware in `hooks.server.ts`
- HTML lang attribute via `%paraglide.lang%` placeholder

---

## 🗄️ Database Schema

### Tables

#### `user`
- `id` (text, primary key)
- `username` (text, unique, not null)
- `password_hash` (text, not null)
- `age` (integer, nullable)

#### `session`
- `id` (text, primary key) - SHA-256 hash of token
- `user_id` (text, foreign key → user.id)
- `expires_at` (timestamp, not null)

### Connection
- **Type:** SQLite (LibSQL compatible)
- **URL:** Set via `DATABASE_URL` environment variable
- **Local DB:** `./db/` directory

---

## 📝 Routes Overview

### Public Routes
- **/** - Home page (`src/routes/+page.svelte`)
- **/demo** - Demo landing page

### Demo Routes
- **/demo/lucia** - Authentication demo
  - **/demo/lucia/login** - Login page
- **/demo/paraglide** - i18n demo

### Layout
- **src/routes/+layout.svelte** - Root layout
- **src/routes/layout.css** - Global styles

---

## 🔐 Security Features

### Authentication
- Session-based (no JWT)
- SHA-256 token hashing
- Base64url-encoded session IDs
- 30-day expiration with 15-day renewal
- Argon2 password hashing

### Best Practices
- TypeScript strict mode
- Environment variable validation
- HTTPS cookie settings
- Automatic session cleanup on expiration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
echo "DATABASE_URL=file:./db/local.db" > .env

# 3. Push database schema
npm run db:push

# 4. Start dev server
npm run dev
```

### Development Workflow
```bash
# Run type checking
npm run check

# Run tests
npm test

# Format code
npm run format

# Open database studio
npm run db:studio
```

---

## 🎯 Project Features

### Current Implementation
- Session-based authentication
- SQLite database with Drizzle ORM
- Internationalization (i18n) support
- TailwindCSS v4 styling
- Markdown content support (MDsveX)
- Type-safe forms
- Unit + E2E testing setup

### Tech Stack Highlights
- **Frontend:** Svelte 5 (with runes)
- **Backend:** SvelteKit server endpoints
- **Database:** SQLite/LibSQL (Turso-compatible)
- **Auth:** Custom session-based implementation
- **Styling:** TailwindCSS v4 with forms/typography
- **Testing:** Vitest + Playwright
- **i18n:** Paraglide (type-safe)

---

## 📊 Project Stats

- **Total Source Files:** ~11 TypeScript/Svelte files
- **Total Lines:** ~409 LOC
- **Routes:** 4 public routes
- **Demo Routes:** 3 demonstration pages
- **Database Tables:** 2 (user, session)
- **Languages Supported:** 2 (en, es)
- **Test Files:** 3 (1 e2e, 2 unit)

---

## 📚 Documentation References

- **SvelteKit:** https://svelte.dev/docs/kit
- **Svelte 5:** https://svelte.dev/docs/svelte
- **Drizzle ORM:** https://orm.drizzle.team
- **TailwindCSS:** https://tailwindcss.com
- **Paraglide:** https://inlang.com/m/gerre34r/library-inlang-paraglideJs

---

**Index Size:** ~4.5 KB
**Token Efficiency:** 94% reduction vs. full codebase read
**Last Updated:** 2025-11-20
