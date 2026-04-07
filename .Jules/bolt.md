## 2025-05-15 - Accidental Inclusion of Log Files

**Learning:** Running a development server in the background (e.g., `pnpm dev > dev_server.log 2>&1 &`) can lead to accidental inclusion of log files in the repository if not explicitly ignored.
**Action:** Always verify the staged files and explicitly delete any generated log or build artifacts before submission.

## 2025-05-15 - Missing Drizzle Migrations

**Learning:** Updating the Drizzle schema file (`schema.ts`) is insufficient for a complete performance optimization in a production-ready codebase. Drizzle requires generated SQL migration files to apply changes to the database.
**Action:** After modifying the schema, always run `pnpm db:generate` to create the necessary migration files in the `drizzle/` directory.

## 2025-05-15 - Lazy Loading Images in Lists

**Learning:** Adding `loading="lazy"` and `decoding="async"` to images in list components like `MoveCard.svelte` is a simple, high-impact optimization for initial page load and scrolling performance.
**Action:** Use these attributes by default for images that are likely to appear below the fold or in long lists.
