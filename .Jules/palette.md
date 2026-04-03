## 2025-04-03 - [Accessibility: Component Focus and Aria States]
**Learning:** Components in a dark-themed UI (like AerialDB) often lack visible focus indicators, making keyboard navigation difficult. Additionally, toggle elements (like favorites or filters) need explicit ARIA states (`aria-pressed`) to be usable by screen readers.
**Action:** Always include `focus-visible:ring-2` and `aria-pressed` for interactive toggle elements. Ensure hidden interactive elements (like hover-only buttons) are made visible on focus using `group-focus-within` or `focus-visible`.
