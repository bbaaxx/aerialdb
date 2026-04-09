## 2026-04-05 - [Database Indexing for Moves Table]

**Learning:** SQLite indexes on joining and filtering columns (name, category_id, level) significantly improve read performance for large datasets, especially when using complex filters in SvelteKit load functions. Generic index names like `name_idx` can collide in SQLite's global namespace, so prefixing with the table name (e.g., `moves_name_idx`) is a safer pattern.
**Action:** Always use descriptive, table-prefixed names for database indexes and include comments in the schema explaining the performance rationale for each index.

## 2026-04-09 - [Query Parallelization & Image Loading Hints]

**Learning:** Sequential database queries in SvelteKit 'load' functions increase TTFB. Wrapping independent queries in 'Promise.all' significantly reduces response time. Additionally, using 'fetchpriority="high"' and 'decoding="async"' on LCP images improves perceived performance and main-thread responsiveness.
**Action:** Always look for opportunities to parallelize independent DB queries and apply performance-related HTML attributes to critical images.
