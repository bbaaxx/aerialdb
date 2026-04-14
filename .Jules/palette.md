## 2024-04-02 - [Interactive Focus and Semantic States]

**Learning:** In a card-based UI where some actions (like 'Favorite') are only visible on hover, keyboard users are often unable to discover or use those actions. Using `group-focus-within:opacity-100` alongside `group-hover:opacity-100` ensures these actions are accessible to all users. Additionally, for toggle-like buttons (like filter chips), `aria-pressed` is essential for screen readers to convey the current state.
**Action:** Always ensure that hidden interactive elements are revealed on focus of their container, and use appropriate ARIA states for toggles.

## 2025-04-04 - [Svelte 5 & Vitest-Browser Accessibility Testing]

**Learning:** When using `vitest-browser-svelte` with Svelte 5, the `render` function should receive props directly as the second argument, and it returns a `container` instead of a `target`. Accessibility attributes like `aria-pressed` and `role="group"` are essential for communicating component state and structure to assistive technologies.
**Action:** Always check the `vitest-browser-svelte` API version and Svelte version to ensure correct test rendering. Use `aria-pressed` for toggle states and `role="group"` with `aria-labelledby` for related sets of controls.

## 2025-04-14 - [Search Accessibility and Shortcuts]

**Learning:** Implementing keyboard shortcuts like `/` for search significantly improves power-user UX, but it must be guarded against triggering when the user is already focused on an input. Using `type="search"` on inputs provides a better mobile experience (e.g., "Search" button on keyboard). Dynamic content like search result counts should use `aria-live="polite"` to ensure screen reader users are notified of updates without being interrupted.
**Action:** Add keyboard shortcut hints to `aria-label` for discoverability. Use `type="search"` for search inputs and `aria-live` for dynamic status indicators.
