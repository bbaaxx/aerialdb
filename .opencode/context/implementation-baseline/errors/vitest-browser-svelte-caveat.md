<!-- Context: implementation-baseline/errors | Priority: medium | Version: 1.0 | Updated: 2026-04-01 -->

# Errors: vitest-browser-svelte Caveat

**Purpose**: Track known browser component test caveat in current stack.
**Last Updated**: 2026-04-01

## Error: Browser Component Test Instability

**Symptom**:

- Some Svelte 5 browser-component tests can fail unexpectedly with nested props/state patterns.

**Cause**:

- Upstream compatibility issue in `vitest-browser-svelte` versions used during recent workstreams.

**Solution**:

- Prefer server-side tests for critical logic when browser run is flaky.
- Keep component tests minimal and isolated.
- Re-check package release notes before removing workaround assumptions.

**Prevention**:

- Pin known-good versions and track changelog before upgrades.
- Keep browser test coverage focused on behavior that truly needs browser runtime.

## Quick Example

```bash
npm run test:unit -- --run --project=server
```

## 📂 Codebase References

**Implementation**:

- `vite.config.ts` - Vitest project split (client/server)
- `src/lib/components/MoveCard.svelte.spec.ts` - Browser component test anchor

## Reference

- https://vitest.dev/guide/browser/

## Related

- lookup/lint-policy-decisions.md
