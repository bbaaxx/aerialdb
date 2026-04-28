## 2025-04-03 - [Accessibility: Component Focus and Aria States]

**Learning:** Components in a dark-themed UI (like AerialDB) often lack visible focus indicators, making keyboard navigation difficult. Additionally, toggle elements (like favorites or filters) need explicit ARIA states (`aria-pressed`) to be usable by screen readers.
**Action:** Always include `focus-visible:ring-2` and `aria-pressed` for interactive toggle elements. Ensure hidden interactive elements (like hover-only buttons) are made visible on focus using `group-focus-within` or `focus-visible`.

## 2024-04-02 - [Interactive Focus and Semantic States]

**Learning:** In a card-based UI where some actions (like 'Favorite') are only visible on hover, keyboard users are often unable to discover or use those actions. Using `group-focus-within:opacity-100` alongside `group-hover:opacity-100` ensures these actions are accessible to all users. Additionally, for toggle-like buttons (like filter chips), `aria-pressed` is essential for screen readers to convey the current state.
**Action:** Always ensure that hidden interactive elements are revealed on focus of their container, and use appropriate ARIA states for toggles.

## 2025-04-04 - [Svelte 5 & Vitest-Browser Accessibility Testing]

**Learning:** When using `vitest-browser-svelte` with Svelte 5, the `render` function should receive props directly as the second argument, and it returns a `container` instead of a `target`. Accessibility attributes like `aria-pressed` and `role="group"` are essential for communicating component state and structure to assistive technologies.
**Action:** Always check the `vitest-browser-svelte` API version and Svelte version to ensure correct test rendering. Use `aria-pressed` for toggle states and `role="group"` with `aria-labelledby` for related sets of controls.

## 2025-05-14 - [Discoverable Keyboard Shortcuts]

**Learning:** Keyboard shortcuts improve efficiency but lack discoverability. Adding a visible `<kbd>` hint that appears on hover or focus of the trigger element provides "just-in-time" education for users. Including the shortcut in the `aria-label` (e.g., "Search (/)") ensures that screen reader users are also informed of the shortcut's existence.
**Action:** Always pair keyboard shortcuts with a visible `<kbd>` hint on hover/focus and include the shortcut in the `aria-label` for full accessibility.

## 2025-04-14 - [Search Accessibility and Shortcuts]

**Learning:** Implementing keyboard shortcuts like `/` for search significantly improves power-user UX, but it must be guarded against triggering when the user is already focused on an input or content-editable element. Using `type="search"` on inputs provides a better mobile experience (e.g., "Search" button on keyboard). Dynamic content like search result counts should use `aria-live="polite"` to ensure screen reader users are notified of updates without being interrupted.
**Action:** Add keyboard shortcut hints to `aria-label` for discoverability. Use `type="search"` for search inputs and `aria-live` for dynamic status indicators. Guard shortcuts against `isContentEditable` elements.

## 2026-04-22 - [Native Sharing Experience with Web Share API]

**Learning:** Using the Web Share API (`navigator.share`) provides a significantly better UX on mobile devices by opening the native share sheet, while a clipboard fallback ensures functionality on desktop and older browsers. Localizing the share titles and text further improves the experience.
**Action:** Always prefer `navigator.share` for sharing actions, providing a `navigator.clipboard` fallback and handling `AbortError` gracefully.

## 2025-05-23 - [Stretched Link Pattern for Accessible Cards]

**Learning:** When building interactive cards that contain multiple actions (like a "Favorite" button), the "stretched link" pattern (an `<a>` with an `after` pseudo-element covering the parent) is superior to nesting the entire card in an `<a>`. It avoids invalid HTML (nested interactive elements) and allows for fine-grained control over which elements are clickable. Highlighting the container with a focus-within ring provides clear feedback for keyboard users.
**Action:** Use the stretched link pattern for interactive cards. Ensure nested buttons have a higher `z-index` than the stretched link. Add `focus-within:ring-2` to the container for unified focus feedback.
