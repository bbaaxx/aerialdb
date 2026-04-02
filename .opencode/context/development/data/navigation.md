<!-- Context: development/navigation | Priority: critical | Version: 1.0 | Updated: 2026-03-29 -->

# Data Layer Navigation

**Purpose**: Database and data access patterns for AerialDB (SQLite/Drizzle)

---

## Structure

```
data/
├── navigation.md
├── concepts/
│   └── db-type-assertions.md   # Drizzle union type workaround
└── errors/
    ├── db-type-errors.md       # 52 TS errors from union type
    ├── lint-svelte-ignore.md   # Stale svelte-ignore comments
    ├── svelte-each-keys.md     # Missing key expressions
    └── svelte-reactivity-lint.md # URLSearchParams → SvelteURLSearchParams
```

---

## Quick Routes

| Task                    | Path                             |
| ----------------------- | -------------------------------- |
| Drizzle type workaround | `concepts/db-type-assertions.md` |
| Fix TS errors           | `errors/db-type-errors.md`       |
| Fix lint errors         | `errors/`                        |

---

## Related Context

- **Project DB schema** → `../../project-intelligence/lookup/database-schema.md`
- **DB query types** → `../../project-intelligence/lookup/db-types.md`
- **Cloudflare deployment** → `../infrastructure/navigation.md`
