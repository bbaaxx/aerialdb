## 2025-05-15 - [Security Headers Enhancement]

**Vulnerability:** The application was missing basic security headers such as `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`, leaving it vulnerable to clickjacking and MIME-sniffing attacks.
**Learning:** SvelteKit does not include these headers by default in the `adapter-cloudflare` setup, requiring manual configuration via `hooks.server.ts`.
**Prevention:** Always implement a global security headers middleware to ensure all responses carry essential protection.

## 2025-05-20 - [Open Redirect and Broken Access Control]

**Vulnerability:** The login process was vulnerable to Open Redirect via the `redirectTo` parameter, and sensitive API endpoints (`/api/upload`, `/api/test-db`) lacked authentication checks.
**Learning:** SvelteKit API routes (+server.ts) do not automatically inherit authentication guards from layout files; they require explicit `event.locals.user` checks. `redirectTo` parameters should always be validated to ensure they are internal paths.
**Prevention:** Always validate redirect targets and explicitly verify user sessions in all non-public API endpoints.
