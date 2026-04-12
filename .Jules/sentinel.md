## 2026-04-08 - [API Authentication Enforcement]

**Vulnerability:** The `/api/upload` and `/api/test-db` endpoints lacked authentication checks, allowing any user (authenticated or not) to upload files or probe the database connection status.
**Learning:** Endpoints under `/api` are not automatically protected by route-level authentication guards in `hooks.server.ts` if they are not specifically handled there or if they bypass standard page load logic.
**Prevention:** Always explicitly check `event.locals.user` in API `RequestHandler` functions that perform sensitive operations.

## 2026-04-09 - [Security Headers]

**Vulnerability:** The application was missing basic security headers such as `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`, leaving it vulnerable to clickjacking and MIME-sniffing attacks.
**Learning:** SvelteKit does not include these headers by default in the `adapter-cloudflare` setup, requiring manual configuration via `hooks.server.ts`.
**Prevention:** Always implement a global security headers middleware to ensure all responses carry essential protection.

## 2026-04-10 - [Open Redirect in Login Flow]

**Vulnerability:** The `redirectTo` parameter in the login page was used directly in SvelteKit `redirect()` calls without validation, allowing attackers to redirect users to external malicious domains after authentication.
**Learning:** Even internal-looking parameters like `redirectTo` can be manipulated to point to external URLs if not explicitly restricted to local paths (e.g., starting with `/` but not `//`).
**Prevention:** Always validate redirect targets against a whitelist of allowed domains or enforce that they are internal paths using a utility like `isValidRedirect`.

## 2026-04-11 - [Centralized Admin Protection]

**Vulnerability:** Admin routes (`/admin/*`) relied on individual layout-level or page-level guards, which are prone to being bypassed if a new route is added without a guard or if form actions/API handlers are used without explicit checks.
**Learning:** SvelteKit layout guards only protect the page load (GET), not the form actions or POST requests. A global hook in `hooks.server.ts` provides a more robust, fail-secure layer of protection for an entire path prefix.
**Prevention:** Implement a `handleAdminGuard` in `hooks.server.ts` that checks `event.locals.user` for all paths starting with `/admin`.
