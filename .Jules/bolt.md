## 2026-04-05 - [Database Indexing for Moves Table]

**Learning:** SQLite indexes on joining and filtering columns (name, category_id, level) significantly improve read performance for large datasets, especially when using complex filters in SvelteKit load functions. Generic index names like `name_idx` can collide in SQLite's global namespace, so prefixing with the table name (e.g., `moves_name_idx`) is a safer pattern.
**Action:** Always use descriptive, table-prefixed names for database indexes and include comments in the schema explaining the performance rationale for each index.

## 2026-04-06 - [Database Query Parallelization]

**Learning:** Sequential `await` calls for independent database queries in SvelteKit load functions introduce unnecessary latency. Parallelizing them with `Promise.all` can significantly reduce TTFB. However, when mocking these in Vitest, each concurrent call must receive a fresh, independent query builder instance from the mock to avoid state collision (e.g., shared result indices).
**Action:** Use `Promise.all` for independent database queries and ensure Vitest mocks return independent query builder objects.

## 2026-04-22 - [Selective Field Fetching (Lean Queries)]

**Learning:** Fetching entire database rows for listing pages (like Home or Search) is inefficient when only a subset of fields (e.g., name, image) is displayed. Large text fields like `description` significantly increase database I/O and network payload size. Using Drizzle's `.select({ fields })` to fetch only required data reduces TTFB and memory pressure on both server and client.
**Action:** Define explicit "Lean" types for common listing views and use selective field fetching in server-side load functions and API endpoints to minimize data transfer.

## 2026-04-23 - [Parallelizing Independent Admin Queries]

**Learning:** Admin listing pages often require multiple independent database queries (e.g., fetching categories and calculating aggregate move counts). Executing these sequentially increases TTFB. Parallelizing them with `Promise.all` optimizes server response time by leveraging the database's ability to handle concurrent requests.
**Action:** Audit admin and dashboard routes for sequential `await` calls of independent queries and refactor them to use `Promise.all`.
