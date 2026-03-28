<!-- Context: openagents-repo/navigation | Priority: critical | Version: 1.1 | Updated: 2026-03-27 -->

# OpenAgents Repo Context Navigation

**Purpose**: Function-based index for OpenAgents repository context.

---

## Quick Navigation

### Concepts

| File                                 | Description                              | Priority |
| ------------------------------------ | ---------------------------------------- | -------- |
| `concepts/agents.md`                 | Agent model and structure                | critical |
| `concepts/evals.md`                  | Eval framework concepts                  | critical |
| `concepts/registry.md`               | Registry model and lifecycle             | high     |
| `concepts/categories.md`             | Category taxonomy and paths              | high     |
| `concepts/agent-metadata.md`         | Metadata/frontmatter concepts            | high     |
| `concepts/subagent-testing-modes.md` | Standalone vs delegated testing          | high     |
| `concepts/plugins/context/`          | Context plugin architecture/capabilities | medium   |

### Examples

| File                                    | Description                       | Priority |
| --------------------------------------- | --------------------------------- | -------- |
| `examples/context-bundle-template.md`   | Reusable context-bundle template  | high     |
| `examples/context-bundle-example.md`    | Filled context-bundle example     | medium   |
| `examples/subagent-prompt-structure.md` | Subagent prompt structure example | high     |

### Guides

| File                              | Description                    | Priority |
| --------------------------------- | ------------------------------ | -------- |
| `guides/quick-start.md`           | Fast repo orientation          | critical |
| `guides/adding-agent-basics.md`   | Add new agents                 | high     |
| `guides/testing-agent.md`         | Test agent workflows           | high     |
| `guides/testing-subagents.md`     | Test subagents                 | high     |
| `guides/updating-registry.md`     | Registry update workflow       | high     |
| `guides/registry-dependencies.md` | Dependency validation workflow | medium   |

### Lookup

| File                                | Description             | Priority |
| ----------------------------------- | ----------------------- | -------- |
| `lookup/commands.md`                | Command reference       | high     |
| `lookup/file-locations.md`          | Canonical path lookup   | high     |
| `lookup/subagent-test-commands.md`  | Test command cheatsheet | high     |
| `lookup/subagent-framework-maps.md` | Subagent map reference  | medium   |

### Errors

| File                               | Description                     | Priority |
| ---------------------------------- | ------------------------------- | -------- |
| `errors/tool-permission-errors.md` | Tool permission troubleshooting | high     |

---

## Loading Strategy

- **New contributor**: `guides/quick-start.md` → `concepts/agents.md` → `concepts/registry.md`
- **Agent work**: `concepts/agent-metadata.md` → `guides/adding-agent-basics.md` → `guides/testing-agent.md`
- **Subagent testing**: `concepts/subagent-testing-modes.md` → `guides/testing-subagents.md` → `lookup/subagent-test-commands.md`
- **Troubleshooting**: `guides/debugging.md` + `errors/tool-permission-errors.md`

---

## Related

- `../core/context-system/navigation.md`
- `../core/`
