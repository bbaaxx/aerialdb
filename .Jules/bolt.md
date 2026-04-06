# Bolt's Journal - Performance Learnings

## 2025-05-15 - Initial Performance Review

**Learning:** The application uses SQLite (LibSQL/D1) and currently lacks explicit indexes on frequently queried columns like `moves.name`, `moves.categoryId`, and `moves.level`.
**Action:** Always check for missing indexes when database queries involve filtering or ordering by non-primary key columns.
