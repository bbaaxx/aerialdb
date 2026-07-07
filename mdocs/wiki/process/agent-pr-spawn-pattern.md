---
id: "agent-pr-spawn-pattern"
title: "Agent PR Spawn Duplication Pattern"
category: "process"
created: "2026-06-04"
updated: "2026-06-04"
related_initiatives: []
tags: []
---

# Agent PR Spawn Duplication Pattern

## The Pattern

AerialDB uses three named coding agents — **Bolt** (performance), **Sentinel** (security), and **Palette** (UI) — driven by Jules tasks. When a single high-value goal is decomposed into multiple parallel Jules tasks (e.g., a security hardening pass that splits into CSP, headers, and logout), the agents frequently produce **near-identical PRs that compete to land the same change**. The pattern repeats at a 1–2 week cadence and is not yet a closed loop.

## Evidence (as of 2026-06-03)

| Topic | Open PRs | Same dev head? | Pattern |
|---|---|---|---|
| `db.batch()` D1 query batching | #132, #133, #134, #139 | Yes (1e0baf5) | 4 PRs, 3 days apart |
| CSP + security headers | #135, #138 | Yes (1e0baf5) | 2 PRs, 1 day apart |
| Admin category loading states | #131, #136 | Yes (1e0baf5) | 2 PRs, 2 days apart |

All 9 open PRs target `dev` and branched from the same commit (`1e0baf5`, the merge of PR #130 on 2026-05-30). The "latest updates accumulated" cleanup on 2026-05-30 closed 14+ similar duplicates from earlier in May.

## Why It Happens

1. Jules tasks for related work are issued in parallel (or re-issued when a previous attempt is judged incomplete).
2. Each task creates a fresh branch off the current `dev` head and produces an independent commit.
3. The agents have no awareness of each other; they do not check for prior attempts on the same topic.
4. The Guardian agent (PR verification) checks for CI/lint/test health, not for semantic duplication. Duplicate PRs pass Guardian cleanly.

## Triage Workflow (manual, repeatable)

When N open PRs are concentrated on one topic:

1. **Cluster** by branch name prefix, commit subject, and `git diff --stat` file overlap.
2. For each cluster, pick the **strict superset** — the most recent PR that contains the changes of the others plus more. Verify by running `git diff origin/dev...origin/<branch> -- <shared-files>` side by side.
3. **Validate the superset's correctness independently.** Duplicates are not always safe — the strict-superset rule does not guarantee that the chosen PR is the most correct. In June 2026, the strict superset of the security cluster was actually buggy: PR #135's CSP `style-src` lacked `'unsafe-inline'`, which would have broken 5 Svelte transition call sites in production. The non-superset PR #138 was the right choice.
4. **Close the duplicates with reasons** in the PR comment (e.g., "Superseded by #N — this PR does not batch `src/routes/admin/categories/+page.server.ts`").
5. **Merge the canonical PR.** The user's standard merge button is fine — Guardian has already run, and the four surviving PRs in the June 2026 triage operated on entirely disjoint file sets.
6. **Capture the lesson.** The Agent PR spawn pattern should be addressed at the *task* layer (prevent parallel/redundant Jules tasks) and the *PR-verification* layer (Guardian should detect semantic duplication, not just CI/lint).

## Common Defects Found in Duplicate PRs

When reviewing the duplicates, the following defects surfaced that strict-superset heuristics would have missed:

- **Path-case mismatch** (#132): created `.jules/bolt.md` (lowercase 'j') instead of appending to the existing `.Jules/bolt.md` (uppercase 'J'). The commit tree contained both blobs. On macOS APFS the new file overwrote the original; on Linux/Cloudflare Pages build two unrelated files would have coexisted.
- **Wrong return type** (#132): `batch<U>(queries: U): Promise<U>` returns the queries, not the awaited results. The correct signature is `Promise<{ [K in keyof T]: Awaited<T[K]> }>`.
- **Unused imports** (#134): removed the `as [LeanMoveRaw[], ...]` cast but left `LeanMoveRaw` and `AdminLeanMoveRaw` imports in place. Fails `npm run lint` under `@typescript-eslint/no-unused-vars: 'error'`.
- **CSP without `'unsafe-inline'`** (#135): `style-src: ["'self'", 'https://fonts.googleapis.com']`. Per SvelteKit docs, Svelte transitions use inline `<style>` elements; this CSP would have broken 5 transition call sites silently in production. Sibling PR #138 had `style-src: ['self', 'unsafe-inline', 'https://fonts.googleapis.com']`, which is correct.
- **Stale comments** (#132, #139): test files left references to `Promise.all` and `featuredMoveRaw (wrapped in array by destructuring)` after the implementation moved to `db.batch` and `featuredMoveResults`. Cosmetic, not functional.

## Recommended Guardrails

1. **Single-task-per-topic convention for Jules.** When dispatching a Bolt/Sentinel/Palette task, check for in-flight PRs on the same topic and either (a) wait for the in-flight one or (b) explicitly mark the new task as "supersede prior attempt". Bolt/Sentinel/Palette should treat prior open PRs on the same files as inputs to read before producing a new branch.
2. **Semantic-duplication check in Guardian.** Add a pre-merge check that compares new PRs against the file-overlap and commit-subject similarity of all open PRs. Flag suspected duplicates to the user before merge.
3. **Branch naming convention.** Currently branches are `<agent>/<topic>-<jules-task-id>` with no numeric suffix. Suffixing retry attempts (`-v2`, `-v3`) or, conversely, opening all retries against the same branch would make duplicate detection trivial in `gh pr list --head`.
4. **Defensive defaults in the CSP template.** The svelte.config.js CSP should ship with `'unsafe-inline'` in `style-src` by default, with a comment explaining the Svelte transition requirement. New PRs proposing tighter `style-src` should be required to remove all `transition:` directives or fail review.
