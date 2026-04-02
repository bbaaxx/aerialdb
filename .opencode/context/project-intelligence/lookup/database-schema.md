<!-- Context: project-intelligence/lookup/database-schema | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Database Schema

**Purpose**: User and session tables for session-based authentication.

## Tables

### user

| Column          | Type    | Constraints      |
| --------------- | ------- | ---------------- |
| `id`            | text    | PRIMARY KEY      |
| `username`      | text    | UNIQUE, NOT NULL |
| `password_hash` | text    | NOT NULL         |
| `age`           | integer | NULLABLE         |

### session

| Column       | Type      | Constraints                |
| ------------ | --------- | -------------------------- |
| `id`         | text      | PRIMARY KEY (SHA-256 hash) |
| `user_id`    | text      | FOREIGN KEY → user.id      |
| `expires_at` | timestamp | NOT NULL                   |

## Schema File

**Location**: `src/lib/server/db/schema.ts`

**ORM**: Drizzle ORM with libsql driver (Turso-compatible)

## Auth Flow

1. User registers → `user` row created with Argon2 hash
2. Login → Session created, ID stored in httpOnly cookie
3. Request → `hooks.server.ts` validates session via `validateSessionToken()`
4. Session expires → Auto-cleanup on expiration check

## Related

- `src/lib/server/auth.ts` — Session management functions
- `../concepts/sveltekit-setup.md` — Server hooks integration
