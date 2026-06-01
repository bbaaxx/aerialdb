## 2026-04-05 - [Database Indexing for Moves Table]

**Learning:** SQLite indexes on joining and filtering columns (name, category_id, level) significantly improve read performance for large datasets, especially when using complex filters in SvelteKit load functions. Generic index names like `name_idx` can collide in SQLite's global namespace, so prefixing with the table name (e.g., `moves_name_idx`) is a safer pattern.
**Action:** Always use descriptive, table-prefixed names for database indexes and include comments in the schema explaining the performance rationale for each index.

## 2026-04-06 - [Database Query Parallelization]

**Learning:** Sequential `await` calls for independent database queries in SvelteKit load functions introduce unnecessary latency. Parallelizing them with `Promise.all` can significantly reduce TTFB. However, when mocking these in Vitest, each concurrent call must receive a fresh, independent query builder instance from the mock to avoid state collision (e.g., shared result indices).
**Action:** Use `Promise.all` for independent database queries and ensure Vitest mocks return independent query builder objects.

## 2026-05-15 - [Presence Indicators vs. Full Text Fetching]

**Learning:** Fetching large text fields (like `description`) only to check for their existence in listing pages is a major performance bottleneck. Using a Drizzle `sql` computed boolean (e.g., `sql<boolean>CASE WHEN ...`) allows the database to handle the presence check, significantly reducing data transfer and memory pressure.
**Action:** Use computed booleans for presence indicators in listing queries instead of fetching full text content.

## 2026-04-22 - [Selective Field Fetching (Lean Queries)]

**Learning:** Fetching entire database rows for listing pages (like Home or Search) is inefficient when only a subset of fields (e.g., name, image) is displayed. Large text fields like `description` significantly increase database I/O and network payload size. Using Drizzle's `.select({ fields })` to fetch only required data reduces TTFB and memory pressure on both server and client.
**Action:** Define explicit "Lean" types for common listing views and use selective field fetching in server-side load functions and API endpoints to minimize data transfer.

## 2026-05-31 - [Cloudflare D1 Query Batching]

**Learning:** While `Promise.all` parallelizes queries from the application layer, it still results in multiple HTTP round-trips when using Cloudflare D1 or similar remote SQLite databases. Using Drizzle's `db.batch()` combines these into a single database request, significantly reducing latency. Proper TypeScript inference for `db.batch()` results requires an explicit type override when using a unified `Database` interface to correctly unwrap thenable query builders.
**Action:** Prefer `db.batch()` over `Promise.all()` for independent parallel queries in environments with remote database latency. Ensure the `Database` type explicitly defines `batch` with `Awaited<T[K]>` mapping.
