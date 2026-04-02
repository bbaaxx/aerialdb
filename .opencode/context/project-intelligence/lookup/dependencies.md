<!-- Context: project-intelligence/lookup/dependencies | Priority: medium | Version: 1.0 | Updated: 2026-03-28 -->

# Key Dependencies

**Purpose**: Quick reference for AerialDB's main packages.

## Framework & Build

| Package         | Version | Purpose              |
| --------------- | ------- | -------------------- |
| `@sveltejs/kit` | ^2.47.1 | SvelteKit framework  |
| `svelte`        | ^5.41.0 | Svelte 5 (runes API) |
| `vite`          | ^7.1.10 | Build tool           |

## Database

| Package          | Version  | Purpose             |
| ---------------- | -------- | ------------------- |
| `drizzle-orm`    | ^0.44.6  | TypeScript ORM      |
| `drizzle-kit`    | ^0.31.5  | Schema migrations   |
| `@libsql/client` | ^0.15.15 | LibSQL/Turso client |

## Authentication

| Package            | Version | Purpose            |
| ------------------ | ------- | ------------------ |
| `@node-rs/argon2`  | ^2.0.2  | Password hashing   |
| `@oslojs/crypto`   | ^1.0.1  | SHA-256 hashing    |
| `@oslojs/encoding` | ^1.1.0  | Base64url encoding |

## UI & Styling

| Package                   | Version | Purpose            |
| ------------------------- | ------- | ------------------ |
| `@tailwindcss/vite`       | ^4.1.14 | TailwindCSS v4     |
| `@tailwindcss/forms`      | ^0.5.10 | Form plugin        |
| `@tailwindcss/typography` | ^0.5.19 | Typography plugin  |
| `mdsvex`                  | ^0.12.6 | Markdown in Svelte |

## i18n

| Package                | Version | Purpose        |
| ---------------------- | ------- | -------------- |
| `@inlang/paraglide-js` | ^2.4.0  | Type-safe i18n |

## Testing

| Package                      | Version | Purpose         |
| ---------------------------- | ------- | --------------- |
| `vitest`                     | ^4.0.5  | Unit testing    |
| `@playwright/test`           | ^1.56.1 | E2E testing     |
| `@vitest/browser-playwright` | ^4.0.5  | Browser testing |

## Related

- `../concepts/sveltekit-setup.md` — How packages integrate
- `../../development/infrastructure/guides/cloudflare-deployment.md` — Cloudflare-specific deps
