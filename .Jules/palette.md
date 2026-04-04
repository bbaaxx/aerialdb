## 2025-04-03 - [Accessibility: Component Focus and Aria States]

**Learning:** Components in a dark-themed UI (like AerialDB) often lack visible focus indicators, making keyboard navigation difficult. Additionally, toggle elements (like favorites or filters) need explicit ARIA states (`aria-pressed`) to be usable by screen readers.
**Action:** Always include `focus-visible:ring-2` and `aria-pressed` for interactive toggle elements. Ensure hidden interactive elements (like hover-only buttons) are made visible on focus using `group-focus-within` or `focus-visible`.

## 2024-04-02 - [Interactive Focus and Semantic States]

**Learning:** In a card-based UI where some actions (like 'Favorite') are only visible on hover, keyboard users are often unable to discover or use those actions. Using `group-focus-within:opacity-100` alongside `group-hover:opacity-100` ensures these actions are accessible to all users. Additionally, for toggle-like buttons (like filter chips), `aria-pressed` is essential for screen readers to convey the current state.
**Action:** Always ensure that hidden interactive elements are revealed on focus of their container, and use appropriate ARIA states for toggles.

## 2025-04-04 - [Svelte 5 & Vitest-Browser Accessibility Testing]

**Learning:** When using `vitest-browser-svelte` with Svelte 5, the `render` function should receive props directly as the second argument, and it returns a `container` instead of a `target`. Accessibility attributes like `aria-pressed` and `role="group"` are essential for communicating component state and structure to assistive technologies.
**Action:** Always check the `vitest-browser-svelte` API version and Svelte version to ensure correct test rendering. Use `aria-pressed` for toggle states and `role="group"` with `aria-labelledby` for related sets of controls.
