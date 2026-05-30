<!-- Context: project-intelligence/lookup/database-schema | Priority: high | Version: 1.1 | Updated: 2026-05-30 -->

# Database Schema

**Purpose**: Current Drizzle schema for authentication and aerial move catalog data.

## Tables

| Table        | Purpose                                                |
| ------------ | ------------------------------------------------------ |
| `user`       | Auth users with role-based access                      |
| `session`    | SHA-256-hashed session tokens                          |
| `categories` | Admin-managed base techniques/apparatus categories     |
| `moves`      | Catalog entries linked to categories and creator users |

## Key Columns

| Table        | Columns                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`       | `id`, `age`, `username`, `password_hash`, `role`                                                                                            |
| `session`    | `id`, `user_id`, `expires_at`                                                                                                               |
| `categories` | `id`, `name`, `created_at`                                                                                                                  |
| `moves`      | `id`, `name`, `category_id`, `description`, `image_url`, `video_url`, `level`, `contributor_name`, `created_by`, `created_at`, `updated_at` |

## Notes

- Schema source: `src/lib/server/db/schema.ts`.
- ORM: Drizzle with libsql locally and Cloudflare D1 in production.
- Route files must use `getDb(event)` from `$lib/server/db`.
- Password hashes use Scrypt via `@noble/hashes`, not Argon2.

## Related

- `src/lib/server/auth.ts` - session management
- `src/lib/server/password.ts` - Scrypt password hashing
- `.opencode/context/implementation-baseline/errors/drizzle-union-inference.md` - known Drizzle union typing caveat
