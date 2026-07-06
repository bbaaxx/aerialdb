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

## 2025-05-15 - [File Extension Spoofing Prevention]

**Vulnerability:** The file upload endpoint derived the storage filename extension from the client-provided filename. An attacker could bypass extension-based security filters by providing a mismatched extension (e.g., uploading a JPEG with a .php extension).
**Learning:** Even when MIME type is validated, trusting the filename extension for storage can lead to vulnerabilities if the serving infrastructure (R2/CDN) respects that extension.
**Prevention:** Always derive the storage file extension from the validated MIME type using a whitelist mapping, ignoring the client-provided extension entirely.

## 2025-05-16 - [Hardened Search Against Wildcard Injection and DoS]

**Vulnerability:** Search queries using SQLite `LIKE` did not escape wildcards (`%`, `_`), allowing users to perform unintended broad searches. Additionally, lack of input length and result set limits posed a DoS risk.
**Learning:** Drizzle's `like()` helper doesn't automatically escape wildcards or add the `ESCAPE` clause in SQLite. Manual escaping and explicit `sql` template literals are required for robust `LIKE` queries.
**Prevention:** Always trim and limit search query length. Use a dedicated `escapeLike` utility and the `ESCAPE` clause in SQL to safely handle user-provided search patterns.

## 2026-05-16 - [Enhanced Security Headers for Isolation]

**Vulnerability:** Missing modern isolation headers (`COOP`, `CORP`) and presence of outdated browser-side XSS filtering configurations could expose the application to cross-origin attacks or inconsistent security behaviors.
**Learning:** Modern web security requires explicit resource isolation through headers to mitigate speculative execution attacks and cross-origin information leaks. Outdated `X-XSS-Protection` can sometimes be leveraged for attacks.
**Prevention:** Always implement `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` set to `same-origin`. Disable legacy XSS filters with `X-XSS-Protection: 0` in favor of robust CSP and input validation.

## 2026-05-20 - [Hardened Security Header Delivery]

**Vulnerability:** Security headers were set using `response.headers.set()` after `resolve(event)`. If a downstream hook (e.g., admin guard) triggered a redirect or error, these headers were skipped, leaving redirects and error pages unprotected.
**Learning:** SvelteKit's `event.setHeaders()` should be used at the start of the hook chain to ensure headers persist across redirects and errors.
**Prevention:** Always place the security headers hook at the beginning of the middleware sequence and use `event.setHeaders()` before calling `resolve(event)`.

## 2026-07-06 - [Harden Session Cookie with __Host- Prefix]

**Vulnerability:** The session cookie lacked the `__Host-` prefix, which means it could potentially be sent to subdomains and didn't strictly enforce `Secure` and `Path=/` attributes at the browser level.
**Learning:** The `__Host-` prefix provides an additional layer of defense by ensuring the cookie is only sent to the host that set it, is always secure, and covers the entire path.
**Prevention:** Always use the `__Host-` prefix for session cookies in production to prevent cross-subdomain attacks and ensure strict attribute enforcement.
