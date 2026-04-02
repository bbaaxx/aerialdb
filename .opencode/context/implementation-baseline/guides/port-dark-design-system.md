<!-- Context: implementation-baseline/guides | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Guide: Port Dark Design System

**Purpose**: Apply existing dark token system to a new route/page.
**Last Updated**: 2026-04-01

## Prerequisites

- Route exists and uses Tailwind classes
- Access to shared tokens in `layout.css`

**Estimated time**: 25 min

## Steps

### 1. Match route shell

- Use `bg-[#1A1C29]` or `bg-dark-base`; ensure text contrast defaults.

### 2. Convert cards and surfaces

- Replace light cards with `bg-[#242736]` / `bg-dark-card` and dark borders.

### 3. Normalize controls

- Inputs: dark background, gray borders, purple focus styles.
- Primary CTA: purple/indigo gradient with glow shadow.

### 4. Align typography

- Headings follow serif style where needed; secondary copy uses `text-[#A0A5C0]`.

### 5. Validate responsive and interaction states

- Check hover/focus/disabled styles and mobile stacking.

## Verification

```bash
npm run check && npm run lint
```

## 📂 Codebase References

**Implementation**:

- `src/routes/layout.css` - Token definitions
- `src/routes/auth/login/+page.svelte` - Auth dark form reference
- `src/routes/admin/+layout.svelte` - Admin glass header reference

## Troubleshooting

| Issue                    | Solution                            |
| ------------------------ | ----------------------------------- |
| Mixed light/dark palette | Replace leftover zinc/light classes |
| Weak focus visibility    | Use purple focus ring + border      |

## Related

- concepts/theme-token-system.md
- lookup/component-responsibility-map.md
