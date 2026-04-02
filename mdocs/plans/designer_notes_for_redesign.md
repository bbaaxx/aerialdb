# Designer Notes: Main Page Redesign

**Date:** 2026-03-28
**Context:** Companion notes and recommended enhancements based on a visual analysis of the mockup image compared against the `main-page-redesign.md` plan.

## Overview

While the existing implementation plan covers the core structural requirements, the provided mockup image contains several nuanced design details that were either missed or specified differently. These notes outline the precise functional and visual gaps and provide recommendations to achieve 1:1 parity with the premium aesthetic of the mockup.

## 1. Move Card: "Save to Favorites" Hover Overlay

- **Observation:** In the mockup, the bottom row of cards demonstrates an active/hover state. When hovered, a dark, translucent, pill-shaped overlay button with the text `♡ Save to Favorites` appears over the bottom-center of the image thumbnail.
- **Gap in Plan:** Task 2E (`MoveCard` redesign) defines hover animations (`translateY`) and a persistent heart icon in the top right, but completely omits this overlaid button interaction.
- **Recommendation:** Update the `MoveCard` component spec to include an absolute-positioned button container (using `backdrop-blur` and a dark background opacity). It should be horizontally centered at the bottom of the image area and conditionally display on hover/focus.

## 2. Desktop Grid Density (3 vs 4 Columns)

- **Observation:** The mockup clearly features a **3-column grid** layout for the Move Cards on wider desktop screens.
- **Gap in Plan:** Task 3B explicitly dictates a 4-column grid for desktop views (`lg:grid-cols-4`). Given the aspect ratio and typography footprint, a 4-column layout will likely force the cards to be too small, departing from the spacious, editorial feeling demonstrated in the 3-column mockup.
- **Recommendation:** Modify the responsive grid classes in Task 3B to utilize a 3-column layout on large screens (`lg:grid-cols-3`).

## 3. Hero Banner: Sub-labels for Badges

- **Observation:** Inside the Hero Banner, positioned below the main title ("Phoenix Roll-up on Silks"), there are explicit, very small text labels — **"Difficulty"** and **"Apparatus"** — positioned directly above their respective pill badges ("Advanced" and "Silks").
- **Gap in Plan:** Task 2D instructs adding the badges themselves but completely misses the small, descriptive category labels sitting vertically above them.
- **Recommendation:** Add these descriptive labels to the `HeroBanner` component DOM structure. They should be styled with a tiny font size and subtle color to match (e.g., `text-xs uppercase text-primary-light tracking-wide mb-1`).

## 4. Apparatus Badge Border Radius

- **Observation:** On the standard Move Cards (e.g., "Candy Cane"), the Apparatus badges located at the bottom left ("Silks", "Lyra", "Trapeze") are capsule/pill-shaped with fully rounded ends.
- **Gap in Plan:** Task 2E specifies the Apparatus badge shape to use the `rounded-md` utility class, which results in a slightly rounded rectangle. This directly conflicts with the pill shapes shown in the image and breaks consistency with the purely pill-shaped Level badges on the precise same cards.
- **Recommendation:** Alter the `MoveCard` styling specification from `rounded-md` to `rounded-full` for all internal badges.

## 5. Hero Carousel Visual "Bleed" Effect

- **Observation:** The main Hero image is not an isolated, standalone box. The mockup prominently displays partial, faded images from adjacent "slides" bleeding off the immediate left and right edges, implying an immersive slider experience.
- **Gap in Plan:** The plan explicitly scopes out "Carousel functionality" as future/out-of-scope work and defines the `HeroBanner` simply as a single centered `max-w-2xl` element, omitting the _visual structure_ of these adjacent slides.
- **Recommendation:** Even if technically static for Phase 1, structural CSS/layout accommodations should be made to emulate this design visually. Introduce an overflow gallery container that renders semi-transparent, scaled-down placeholder images on the left and right flanks of the central `HeroBanner` view to accurately replicate the premium feeling of the mockup.
