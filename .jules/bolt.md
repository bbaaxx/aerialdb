## 2025-05-31 - Optimize Cloudflare D1 with Drizzle Batching
**Learning:** Using `Promise.all()` with Drizzle queries on Cloudflare D1 results in multiple network round-trips (one per query). Using `db.batch()` consolidates these into a single round-trip, significantly reducing TTFB.
**Action:** Always prefer `db.batch()` over `Promise.all()` for concurrent database queries in this codebase.
