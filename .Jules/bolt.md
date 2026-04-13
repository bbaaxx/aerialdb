## 2026-04-05 - [Database Indexing for Moves Table]

**Learning:** SQLite indexes on joining and filtering columns (name, category_id, level) significantly improve read performance for large datasets, especially when using complex filters in SvelteKit load functions. Generic index names like `name_idx` can collide in SQLite's global namespace, so prefixing with the table name (e.g., `moves_name_idx`) is a safer pattern.
**Action:** Always use descriptive, table-prefixed names for database indexes and include comments in the schema explaining the performance rationale for each index.

## 2026-04-06 - [Database Query Parallelization]

**Learning:** Sequential `await` calls for independent database queries in SvelteKit load functions introduce unnecessary latency. Parallelizing them with `Promise.all` can significantly reduce TTFB. However, when mocking these in Vitest, each concurrent call must receive a fresh, independent query builder instance from the mock to avoid state collision (e.g., shared result indices).
**Action:** Use `Promise.all` for independent database queries and ensure Vitest mocks return independent query builder objects.

## 2026-04-13 - [LCP Image Optimization]

**Learning:** For SvelteKit applications with large hero images or media-heavy detail pages, explicitly setting `fetchpriority="high"`, `loading="eager"`, and `decoding="async"` on LCP elements significantly improves perceived performance. Conversely, decorative elements (like background bleeds) should use `loading="lazy"` to avoid competing for bandwidth.
**Action:** Always identify LCP elements in components (like HeroBanner or Detail headers) and apply priority attributes to ensure they are discovered and rendered by the browser as early as possible.
