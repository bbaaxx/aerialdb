<!-- Context: implementation-baseline/lookup | Priority: critical | Version: 1.0 | Updated: 2026-04-01 -->

# Implementation Baseline Navigation

**Purpose**: Updated starting point for agents based on current code (not historical plans).
**Last Updated**: 2026-04-01

## Quick Navigation

### Concepts

| File                                  | Description                          | Priority |
| ------------------------------------- | ------------------------------------ | -------- |
| concepts/landing-page-architecture.md | Server/client filtering architecture | critical |
| concepts/theme-token-system.md        | Dark UI tokens and fonts             | high     |
| concepts/db-union-typing-strategy.md  | D1/libsql typing strategy            | critical |

### Examples

| File                                    | Description               | Priority |
| --------------------------------------- | ------------------------- | -------- |
| examples/url-filter-sync.svelte.md      | URL-driven filter sync    | high     |
| examples/typed-drizzle-select-map.ts.md | Typed join result shaping | high     |

### Guides

| File                                 | Description                   | Priority |
| ------------------------------------ | ----------------------------- | -------- |
| guides/add-list-filter-end-to-end.md | Add new list filter flow      | critical |
| guides/port-dark-design-system.md    | Port dark theme to routes     | high     |
| guides/admin-crud-ux-pattern.md      | Inline edit/delete UX pattern | high     |

### Lookup

| File                                   | Description                | Priority |
| -------------------------------------- | -------------------------- | -------- |
| lookup/component-responsibility-map.md | Component ownership matrix | high     |
| lookup/lint-policy-decisions.md        | Active lint rule decisions | high     |
| lookup/route-dataflow-reference.md     | Route dataflow quick map   | high     |

### Errors

| File                                   | Description                       | Priority |
| -------------------------------------- | --------------------------------- | -------- |
| errors/vitest-browser-svelte-caveat.md | Browser test compatibility caveat | medium   |
| errors/drizzle-union-inference.md      | Union client inference issue      | high     |

## Loading Strategy

**For feature implementation**:

1. `concepts/landing-page-architecture.md`
2. `concepts/db-union-typing-strategy.md`
3. `lookup/route-dataflow-reference.md`

**For UI/theming work**:

1. `concepts/theme-token-system.md`
2. `guides/port-dark-design-system.md`
3. `lookup/component-responsibility-map.md`

**For lint/test troubleshooting**:

1. `lookup/lint-policy-decisions.md`
2. `errors/vitest-browser-svelte-caveat.md`
3. `errors/drizzle-union-inference.md`
