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

## 2026-04-11 - [Layout Guard Bypass in Form Actions]

**Vulnerability:** Admin form actions (POST requests) were not protected by authentication checks, despite the routes being under a layout with an authentication guard. Attackers could directly POST to these actions (e.g., to create categories or delete moves) without being logged in.
**Learning:** SvelteKit layout `load` functions only run during page loads (GET requests) or client-side navigation. Form actions (`actions` in `+page.server.ts`) execute independently and do not inherit the protection of a layout's `load` function.
**Prevention:** Always explicitly verify `event.locals.user` at the beginning of sensitive form actions, even if the route is nested under a protected layout.

## 2026-04-20 - [Hardened Open Redirect Prevention]

**Vulnerability:** Redirect validation only checked for `//` prefix, allowing bypasses using control characters, whitespace, or backslashes (e.g., `/\example.com`) which some browsers might interpret as external URLs.
**Learning:** Simple string prefix checks are insufficient for URL validation; the `URL` constructor with a controlled base is more reliable for detecting origin changes.
**Prevention:** Use a combination of character blocklists (whitespace/control chars) and the `URL` constructor to ensure redirect targets remain within the expected origin.

## 2026-04-21 - [User Enumeration and Timing Attacks]

**Vulnerability:** The login flow returned different error messages for existent vs. non-existent users and skipped the computationally expensive password hashing if the user was not found, allowing attackers to identify valid usernames through error messages and response timing.
**Learning:** Security-focused custom auth flows must treat "user not found" and "incorrect password" identically in both UI feedback and server processing time.
**Prevention:** Return generic error messages and always perform a "dummy" password verification with a pre-calculated hash when a user record is missing.
