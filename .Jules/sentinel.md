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
