<!-- Context: core/workflows | Priority: high | Version: 2.0 | Updated: 2026-03-27 -->

# Context Operation Workflows (Compact)

**Core Concept**: Use one shared workflow pattern for all `/context` write operations, then apply command-specific steps. Keep approvals explicit, previews scannable, and outputs reproducible.

**Key Points**:

- Always run approval gates before mutating files.
- Use letter-based conflict resolution for ambiguous choices.
- Create backups before any write operation.
- Report file impact, validation status, and rollback path.

**Minimal Example**:

```bash
/context organize development/
# analyze -> preview -> approve -> backup -> execute -> report
```

**Reference**: `.opencode/context/core/context-system/standards/mvi.md`

---

## Non-Negotiable Rules

All operations with `enforce="@critical_rules.approval_gate"` MUST:

1. Show clear preview of what will happen.
2. Wait for explicit user input.
3. Provide options (`yes/no/edit/preview/dry-run`).
4. Never proceed without confirmation.

When conflicts are detected:

1. Present all options clearly.
2. Use letter-based selection (A/B/C...).
3. Show impact of each option.
4. Let the user choose final resolution.

All write operations MUST:

1. Create backup before changes.
2. Store backup in `.tmp/backup/{operation}-{topic}-{timestamp}/`.
3. Report backup location.
4. Validate references and line limits after write.

---

## Shared Workflow Skeleton

Use this order for `extract`, `organize`, `update`, and `error`:

1. **Read/Analyze** source and affected files.
2. **Plan** deterministic changes.
3. **Approval Checkpoint** with preview/options.
4. **Backup** (first write step).
5. **Execute** approved changes only.
6. **Validate** links + size limits.
7. **Report** counts, files, and rollback path.

---

## Extract Workflow

**Command**: `/context extract from {source}`

### Stages

1. Read source and identify concepts/errors/guides candidates.
2. Propose destination category (`development/`, `core/`, or new).
3. Approval: item selection + category.
4. Approval: file creation preview.
5. Backup (if updates are required) and create files.
6. Update category navigation and report output.

### Minimal Interaction Example

```text
User: /context extract from https://react.dev/hooks
Agent: Found concepts/errors/guides. Select items (A B M or all) + category.
User: all 1
Agent: Preview: 15 files, all under limits. Approve? (yes/no/preview)
User: yes
Agent: Created files, updated navigation, reported summary.
```

---

## Organize Workflow

**Command**: `/context organize {category}`

### Stages

1. Scan category for flat files and current structure.
2. Categorize into `concepts/`, `examples/`, `guides/`, `lookup/`, `errors/`.
3. Approval: resolve ambiguous files (letter options).
4. Approval: preview create/move/split/merge impacts.
5. Backup, execute approved operations, and update navigation.
6. Validate links/limits and report changes.

### Minimal Interaction Example

```text
User: /context organize development/
Agent: Ambiguous file api-design.md -> [A split] [B concept] [C guide]
User: A
Agent: Preview + dry-run available. Approve? (yes/no/show-diff)
User: yes
Agent: Backup created, files moved/split, references fixed.
```

---

## Update Workflow

**Command**: `/context update for {topic}`

### Stages

1. Capture change type (API/deprecations/new features/breaking changes).
2. Find affected context files and references.
3. Approval: diff-style preview of proposed edits.
4. Backup and apply approved updates.
5. Validate links and size limits.
6. Report per-file before→after impact.

### Minimal Interaction Example

```text
User: /context update for Next.js 15
Agent: Found 5 impacted files. Approve preview? (yes/no/show-all/edit)
User: edit
Agent: Line-by-line approval mode...
User: yes
Agent: Updated files, validated links, reported before/after sizes.
```

---

## Error Workflow

**Command**: `/context error for "{error message}"`

### Stages

1. Search existing error docs for duplicates/near-matches.
2. Approval: choose add/update/skip + target category.
3. Approval: preview patch.
4. Backup and apply.
5. Validate line limits and related references.
6. Report changes.

### Minimal Interaction Example

```text
User: /context error for "Cannot read property 'map' of undefined"
Agent: Similar entry found. [A add] [B update] [C skip]
User: B 1
Agent: Preview patch. Approve? (yes/no/edit)
User: yes
Agent: Updated error doc and reported final size.
```

---

## Reporting & Validation Output

Every operation report should include:

- Files created/updated/moved/split/merged.
- File sizes (before → after) where modified.
- Link/reference validation result.
- MVI/line-limit compliance status.
- Backup location and rollback availability.

Preferred summary format:

```text
✅ Updated 5 files
🔗 Fixed 17 references
📏 All files under limits
💾 Backup: .tmp/backup/{operation}-{topic}-{timestamp}/
```

---

## Related

- `../operations/harvest.md`
- `../standards/mvi.md`
- `../standards/templates.md`
- `./compact.md`
