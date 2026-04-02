<!-- Context: development/infrastructure/navigation | Priority: critical | Version: 2.0 | Updated: 2026-03-28 -->

# Infrastructure Navigation

**Purpose**: DevOps, deployment patterns, and infrastructure references for AerialDB.

---

## Structure

```
infrastructure/
├── navigation.md
├── concepts/
│   └── dual-environment.md       # Local vs Cloudflare dual-mode
├── guides/
│   └── cloudflare-deployment.md  # Full deployment walkthrough
├── lookup/
│   ├── cloudflare-commands.md    # Wrangler CLI quick ref
│   └── cloudflare-limits.md      # Free tier limits & costs
└── errors/
    └── cloudflare-deployment-errors.md  # Common deployment errors
```

---

## Quick Routes

| Task                        | Path                                     |
| --------------------------- | ---------------------------------------- |
| **Deploy to Cloudflare**    | `guides/cloudflare-deployment.md`        |
| **Debug deployment error**  | `errors/cloudflare-deployment-errors.md` |
| **Wrangler CLI commands**   | `lookup/cloudflare-commands.md`          |
| **Check free tier limits**  | `lookup/cloudflare-limits.md`            |
| **Understand dual-mode DB** | `concepts/dual-environment.md`           |

---

## By Category

### concepts/

What and why — design decisions and architecture.

| File                  | Priority | Summary                                                       |
| --------------------- | -------- | ------------------------------------------------------------- |
| `dual-environment.md` | high     | Local SQLite vs Cloudflare D1/R2 switching via `getDb(event)` |

### guides/

How-to — step-by-step instructions.

| File                       | Priority | Summary                                       |
| -------------------------- | -------- | --------------------------------------------- |
| `cloudflare-deployment.md` | high     | Deploy AerialDB to Cloudflare Pages + D1 + R2 |

### lookup/

Quick reference — tables, commands, limits.

| File                     | Priority | Summary                                        |
| ------------------------ | -------- | ---------------------------------------------- |
| `cloudflare-commands.md` | medium   | Wrangler CLI commands for D1/R2 operations     |
| `cloudflare-limits.md`   | low      | Cloudflare free tier limits and cost breakdown |

### errors/

Common errors — symptoms, causes, solutions.

| File                              | Priority | Summary                                 |
| --------------------------------- | -------- | --------------------------------------- |
| `cloudflare-deployment-errors.md` | medium   | Build, DB, runtime, and R2 image errors |

---

## Loading Strategy

| Priority     | Load          | When                                    |
| ------------ | ------------- | --------------------------------------- |
| **critical** | Always        | This navigation file                    |
| **high**     | On task match | Deployment tasks, environment questions |
| **medium**   | On demand     | Debugging, CLI reference                |
| **low**      | On demand     | Limits lookup                           |

---

## Related Context

- **DB schema** → `src/lib/server/db/schema.ts`
- **Dual-mode DB** → `src/lib/server/db/index.ts`
- **Wrangler config** → `wrangler.toml`
- **Core Standards** → `../../core/standards/code-quality.md`
