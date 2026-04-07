## 2024-04-02 - [Interactive Focus and Semantic States]

**Learning:** In a card-based UI where some actions (like 'Favorite') are only visible on hover, keyboard users are often unable to discover or use those actions. Using `group-focus-within:opacity-100` alongside `group-hover:opacity-100` ensures these actions are accessible to all users. Additionally, for toggle-like buttons (like filter chips), `aria-pressed` is essential for screen readers to convey the current state.
**Action:** Always ensure that hidden interactive elements are revealed on focus of their container, and use appropriate ARIA states for toggles.

## 2025-04-04 - [Svelte 5 & Vitest-Browser Accessibility Testing]

**Learning:** When using `vitest-browser-svelte` with Svelte 5, the `render` function should receive props directly as the second argument, and it returns a `container` instead of a `target`. Accessibility attributes like `aria-pressed` and `role="group"` are essential for communicating component state and structure to assistive technologies.
**Action:** Always check the `vitest-browser-svelte` API version and Svelte version to ensure correct test rendering. Use `aria-pressed` for toggle states and `role="group"` with `aria-labelledby` for related sets of controls.

## 2025-05-15 - [Ephemeral Feedback for Clipboard Actions]

**Learning:** When a user copies a link or text to the clipboard, immediate visual feedback is crucial to confirm the action. A "Copied!" state that persists for ~2 seconds using a Svelte `$state` and `setTimeout` provides clear, delightful confirmation without requiring a separate toast notification for single-page interactions. Using Lucide icons like `Share2` and `Check` helps provide strong visual cues for these states.
**Action:** Use a local `$state(false)` variable and a 2-second timeout to toggle between the action icon/label and a success state for clipboard-related buttons.
