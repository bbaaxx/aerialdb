## 2025-05-15 - [Security Headers Enhancement]

**Vulnerability:** The application was missing basic security headers such as `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`, leaving it vulnerable to clickjacking and MIME-sniffing attacks.
**Learning:** SvelteKit does not include these headers by default in the `adapter-cloudflare` setup, requiring manual configuration via `hooks.server.ts`.
**Prevention:** Always implement a global security headers middleware to ensure all responses carry essential protection.
