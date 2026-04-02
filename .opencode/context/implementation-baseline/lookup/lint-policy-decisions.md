<!-- Context: implementation-baseline/lookup | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Lookup: Lint Policy Decisions

**Purpose**: Record active lint rule decisions that affect implementation choices.
**Last Updated**: 2026-04-01

## Rule Decisions

| Rule                                   | Decision | Rationale                                                   | Source             |
| -------------------------------------- | -------- | ----------------------------------------------------------- | ------------------ |
| `no-undef`                             | off      | TypeScript handles globals better                           | `eslint.config.js` |
| `@typescript-eslint/no-explicit-any`   | off      | Managed debt for dual DB client typing                      | `eslint.config.js` |
| `svelte/no-navigation-without-resolve` | off      | Conflicts with normal SvelteKit internal links              | `eslint.config.js` |
| `svelte/prefer-svelte-reactivity`      | off      | Reactive replacements unavailable in current Svelte version | `eslint.config.js` |

## Commands

```bash
npm run lint
```

## 📂 Codebase References

**Validation/Enforcement**:

- `eslint.config.js` - Project lint policy source

## Related

- errors/drizzle-union-inference.md
- errors/vitest-browser-svelte-caveat.md
