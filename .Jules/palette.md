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

## 2025-05-24 - [Accessible Form Validation and Hints]

**Learning:** For inclusive forms, visual error messages are insufficient. Using 'aria-invalid' signals the state to assistive technology, and 'aria-describedby' programmatically links the input to both dynamic error messages and static helper hints. Careful concatenation in 'aria-describedby' (e.g., handling spaces) ensures that screen readers can discover all relevant descriptions.
**Action:** Always use 'aria-invalid' on form fields and link them to error/hint IDs via 'aria-describedby'. Ensure IDs are stable and unique.

## 2025-05-25 - [Visual Consistency for Filter States]

**Learning:** Matching the visual style of filter controls (like difficulty level chips) with their corresponding result badges (like those on card components) creates a stronger mental model for users and makes the interface feel more intentional. Using subtle background tints and high-contrast text for active states improves visibility without being overwhelming.
**Action:** Always synchronize the color palette of filter controls with the data representations they affect to reinforce the connection between user actions and results.

## 2026-05-28 - [Search Input Customization]

**Learning:** Using `type="search"` provides better mobile OS integration, but browsers like Chrome/Safari add native clear buttons that can clash with custom UI. Using Tailwind's pseudo-element variants `[&::-webkit-search-cancel-button]:appearance-none` and `[&::-webkit-search-decoration]:appearance-none` allows for full control over the search interface while keeping the semantic benefits of the search type.
**Action:** Always suppress native search decorations when implementing custom clear buttons on `type="search" icon-only inputs.

## 2026-06-07 - [Standardized Tactile Feedback and Overlay Focus]

**Learning:** Providing consistent tactile feedback (e.g., `active:scale-95`) across all interactive elements significantly improves the "feel" of the UI, especially on touch devices. Additionally, for mobile-first overlays like search bars and mobile menus, restoring focus to the trigger button when closing via keyboard (Escape) is a critical accessibility requirement that prevents focus from being lost in the document.
**Action:** Always pair `focus-visible` styles with `active:scale-95` for interactive elements. Ensure focus is explicitly returned to triggering elements when overlays are dismissed.

## 2026-05-29 - [Targeted Loading States for List Management]

**Learning:** When managing a list of items (like categories), using a global loading state can be confusing. Implementing a targeted 'processingId' state allows for specific feedback (like spinners on the exact button clicked) while keeping the rest of the UI interactive. Furthermore, in SvelteKit 'use:enhance', the loading state should persist through the 'await update()' AND any subsequent data invalidation ('await invalidateAll()') to ensure a seamless transition until the UI is fully updated.
**Action:** Use a combination of 'isSubmitting' and 'processingId' for granular feedback in list views. Ensure the loading state wraps all post-submission data refreshes.

## 2026-05-29 - [Autofocus and Visual Feedback for Auth Flows]

**Learning:** Automatically focusing the first input in authentication forms (Login/Signup) significantly reduces friction by allowing users to start typing immediately. Pairing this with clear visual indicators for required fields (\*) and tactile feedback on button interaction (active:scale-95) creates a more professional and responsive user experience.
**Action:** Always implement autofocus for the primary input on task-oriented pages and provide immediate visual/tactile feedback for primary actions.

## 2026-06-08 - [Standardized Badge Patterns and CSS-Aware Testing]

**Learning:** Standardizing the visual treatment of metadata badges (like difficulty levels) across the application reduces cognitive load. A pattern of 15% background opacity, 30% ring opacity, and the `capitalize` class provides a consistent, accessible high-contrast design. However, CSS-transformed text (via `capitalize`) can lead to test failures if unit tests expect the visual casing instead of the raw data casing.
**Action:** Use the standardized badge pattern (bg/15, ring/30, capitalize) for all metadata indicators. In tests, always use case-insensitive regex matchers (e.g., `getByText(/text/i)`) when asserting on elements that use CSS text transformations.
