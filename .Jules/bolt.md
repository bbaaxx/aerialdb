## 2026-04-05 - [Database Indexing for Moves Table]

**Learning:** SQLite indexes on joining and filtering columns (name, category_id, level) significantly improve read performance for large datasets, especially when using complex filters in SvelteKit load functions. Generic index names like `name_idx` can collide in SQLite's global namespace, so prefixing with the table name (e.g., `moves_name_idx`) is a safer pattern.
**Action:** Always use descriptive, table-prefixed names for database indexes and include comments in the schema explaining the performance rationale for each index.

## 2026-04-06 - [Database Query Parallelization]

**Learning:** Sequential `await` calls for independent database queries in SvelteKit load functions introduce unnecessary latency. Parallelizing them with `Promise.all` can significantly reduce TTFB. However, when mocking these in Vitest, each concurrent call must receive a fresh, independent query builder instance from the mock to avoid state collision (e.g., shared result indices).
**Action:** Use `Promise.all` for independent database queries and ensure Vitest mocks return independent query builder objects.

## 2026-04-07 - [In-Memory Relation Mapping and Lean Queries]

**Learning:** Redundant SQL `JOIN` operations can be avoided by performing in-memory mapping with a `Map` when the related data (e.g., categories) is already being fetched for the page. Additionally, "Lean Queries" that only select necessary columns for the view significantly reduce database transfer and memory overhead, especially when tables contain large text fields like descriptions.
**Action:** Always evaluate if related data is already available in memory before adding a `JOIN`, and restrict `select()` statements to only the fields required by the UI components.
