---
description: Analyze open GitHub PRs for duplicates, risk, relevance, and queue-clearing actions
tags:
  - github
  - pull-requests
  - review
  - queue-management
dependencies:
  - subagent:guardian
  - subagent:reviewer
---

# Manage PR Queue

**Purpose**: Inspect all open pull requests for this repository, identify intent and implementation overlap, flag duplicate, irrelevant, stale, or risky PRs, and propose a safe course of action to clear the queue.

**Arguments**: `$ARGUMENTS`

---

## Usage

```bash
/manage-pr-queue
/manage-pr-queue --include-drafts
/manage-pr-queue --author app/github-actions
/manage-pr-queue --execute
```

Default mode is read-only analysis. Do not merge, close, label, comment, or edit PRs unless the user passes `--execute` and then explicitly approves the proposed action plan.

---

## Operating Rules

1. Treat repository safety as the priority: security, data loss, auth, migration, deployment, and dependency changes require extra scrutiny.
2. Study every open PR before recommending queue actions; do not decide PR-by-PR in isolation.
3. Prefer merge only for PRs that are relevant, non-duplicative, low-risk, passing checks, and aligned with project conventions.
4. Prefer close for duplicate, irrelevant, stale, harmful, unverifiable, or superseded PRs.
5. Prefer combine when multiple PRs solve the same problem partially, conflict with each other, or should become one coherent change.
6. Never run destructive GitHub actions without a user approval checkpoint.
7. If `gh` is unavailable or unauthenticated, stop and report the setup issue with the exact command that failed.

---

## Workflow

### Step 1: Establish Repository Context

Run:

```bash
git status --short
git branch --show-current
git remote -v
gh repo view --json nameWithOwner,defaultBranchRef,url
```

Read project guidance before reviewing implementation risk:

- `AGENTS.md`
- `mdocs/PROJECT_INDEX.md`
- `.Jules/sentinel.md` if any PR touches auth, security, API routes, uploads, database, or deployment

### Step 2: Inventory Open PRs

Run:

```bash
gh pr list --state open --limit 100 --json number,title,author,headRefName,baseRefName,isDraft,createdAt,updatedAt,mergeable,reviewDecision,statusCheckRollup,labels,url
```

If `--include-drafts` is not present, include drafts in the report but default their action to `defer` unless they are obvious duplicates or risks.

If `$ARGUMENTS` includes filters such as `--author`, `--label`, or explicit PR numbers, narrow the deep review to those PRs but still list the full queue for duplicate detection.

### Step 3: Collect Evidence Per PR

For each open PR, collect:

```bash
gh pr view <number> --json number,title,body,author,headRefName,baseRefName,isDraft,createdAt,updatedAt,mergeable,reviewDecision,statusCheckRollup,files,commits,additions,deletions,labels,url
gh pr diff <number> --patch
```

Summarize each PR in one short record:

- Intent: what problem it claims to solve
- Implementation: files touched and actual behavior changed
- Size: additions, deletions, changed files, commit count
- Status: draft, checks, reviews, mergeability, conflicts
- Risk areas: auth, database, migrations, uploads, Cloudflare, dependencies, generated code, tests, i18n, UI-only
- Evidence gaps: missing tests, unclear body, failing checks, no reproduction, stale branch

### Step 4: Compare Across PRs

Build an overlap map using:

- Same or similar title/intent
- Same files or routes touched
- Same bug/feature described differently
- One PR superseding another
- Conflicting schema, migration, dependency, or config changes
- Automated-agent PRs that match `.Jules/bolt.md`, `.Jules/palette.md`, or `.Jules/sentinel.md` entries

Use the `Guardian` subagent for automated-agent PRs or any PR that looks like generated quality/security/performance work. Ask it to classify each as `PASS`, `DUPLICATE`, or `REJECT` with merge/close/request-changes rationale.

Use the `CodeReviewer` subagent for high-risk or merge-candidate PRs. Ask it for correctness, security, and test-risk findings only; do not request code changes.

### Step 5: Classify Each PR

Assign exactly one recommended action:

- `merge`: safe and useful as-is after checks pass
- `merge-after-fix`: useful but needs specific fixes first
- `combine`: should be folded into another PR or a new consolidation PR
- `close-duplicate`: duplicates an existing PR or already-implemented behavior
- `close-not-relevant`: unrelated to project goals, wrong base, spam, or accidental PR
- `close-risky`: unsafe, too broad, unverifiable, or likely to regress behavior
- `defer`: needs human product decision, blocked dependency, or draft/incomplete work

### Step 6: Produce Queue-Clearing Plan

Return the report in this format:

```markdown
# PR Queue Plan

## Summary
- Open PRs reviewed: N
- Merge now: N
- Merge after fixes: N
- Combine: N
- Close: N
- Defer: N

## Recommended Order
1. Close duplicates and irrelevant PRs first.
2. Merge low-risk independent PRs with passing checks.
3. Combine overlapping PRs into named consolidation groups.
4. Re-review high-risk PRs after fixes or human decision.

## PR Matrix
| PR | Title | Intent | Risk | Overlap | Checks | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| #123 | Example | Fix login | High | #120 | Failing | close-duplicate |

## Merge Candidates
- `#<number>`: why it is safe, required pre-merge validation, merge order dependencies.

## Combine Groups
- Group name: PRs `#A`, `#B`, `#C`
- Keep from each PR: concise list
- Drop from each PR: concise list
- Proposed final branch/PR intent

## Close Candidates
- `#<number>`: close reason and suggested closing comment.

## Risk Register
- `#<number>`: risk, evidence, and required mitigation.

## Approval Needed
- List exact actions you want permission to execute.
```

### Step 7: Execution Mode

Only if `$ARGUMENTS` includes `--execute` and the user explicitly approves the exact action list:

1. Close approved PRs with concise comments using `gh pr close --comment`.
2. Merge approved PRs using the repository’s preferred merge method if visible; otherwise ask before choosing merge, squash, or rebase.
3. Do not create consolidation branches unless explicitly approved.
4. After execution, rerun `gh pr list --state open --limit 100` and report the remaining queue.

---

## Quality Bar

Before recommending `merge`, verify:

- The PR is relevant to AerialDB’s SvelteKit, Drizzle, Cloudflare, auth, UI, or documentation goals.
- It does not duplicate another open PR or already-landed code.
- Checks are passing or failures are unrelated and explicitly identified.
- Risky areas have targeted review notes and tests or a clear validation path.
- The change follows repository guidance from `AGENTS.md`.
