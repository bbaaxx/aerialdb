## 2025-05-15 - SQL Aggregation for Admin Management
**Learning:** In SvelteKit server load functions, replacing `db.batch()` queries that require manual in-memory data merging with a single optimized SQL query (using `LEFT JOIN`, `GROUP BY`, and `count()`) significantly reduces database round-trips and application-layer processing overhead.
**Action:** Always prefer a single SQL aggregation query over multiple queries when counting related records for index/list views.

## 2025-05-15 - Local DB Schema Drift
**Learning:** The local database initialization script (`scripts/init-db.ts`) uses hardcoded `CREATE TABLE` and `INSERT` statements that may diverge from the Drizzle schema in `src/lib/server/db/schema.ts`. This can cause critical runtime failures (e.g., "no such column: level") even if the app code is correct.
**Action:** When updating the database schema, verify and update `scripts/init-db.ts` to ensure `pnpm db:init` produces a correctly structured `local.db` for development.
