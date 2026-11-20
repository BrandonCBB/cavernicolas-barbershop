---
name: accessibility-compliance
description: Web accessibility compliance guide (WCAG 2.1 & 2.2 Level AA/AAA). Use when reviewing color contrast, readability, keyboard navigation, visible focus indicators, form labels, ARIA landmarks, touch target sizing, and assistive technology compatibility.
---

# Accessibility Compliance (WCAG 2.2 & POUR Guidelines)

Comprehensive guide for auditing and building web interfaces that conform to WCAG 2.1 and WCAG 2.2 standards (Level A, AA, and AAA), ensuring an inclusive experience across all devices and assistive technologies.

## When to Apply This Skill

- Reviewing color contrast ratios for text, icons, and interactive elements.
- Ensuring full keyboard navigability (tab order, visible focus rings, no keyboard traps).
- Verifying accessible form structures (explicit `<label>` associations, error messages, clear validation).
- Validating semantic HTML structure and proper ARIA roles, states, and live regions.
- Auditing touch target sizes (minimum 44x44px or 24x24px with spacing under WCAG 2.2).
- Respecting user preferences such as `prefers-reduced-motion` and zoom scaling up to 400%.

---

## Core Principles (POUR Framework)

### 1. Perceivable
- **Text Contrast (Level AA):** Minimum 4.5:1 for normal body text (< 18pt or < 14pt bold). Minimum 3:1 for large text (>= 18pt or >= 14pt bold) and essential graphical components/borders.
- **Non-Text Content:** All informative images must provide meaningful `alt` text. Purely decorative elements must use empty `alt=""` or `aria-hidden="true"`.
- **Sensory Characteristics:** Do not use color, shape, or position as the sole vehicle for conveying status or instructions (e.g., combine color with icons or text badges).

### 2. Operable
- **Keyboard Access:** All interactive elements (`<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`) must be reachable and actionable via keyboard alone (`Tab`, `Shift+Tab`, `Enter`, `Space`, and Arrow keys).
- **Visible Focus Indicator:** Never remove `outline: none` without providing an unambiguous, high-contrast custom focus ring (e.g. `outline: 2px solid var(--accent)` with `outline-offset`).
- **Touch Target Size:** Interactive targets must measure at least 44x44 CSS pixels on touch interfaces or provide adequate spacing to prevent accidental taps.
- **Motion & Animations:** Honor `prefers-reduced-motion: reduce` by dampening or disabling non-essential background animations and continuous transitions.

### 3. Understandable
- **Readable Language:** Page has a valid `<html lang="es">` (or appropriate language code).
- **Predictable Interactions:** Changing an input or selecting an option must not unexpectedly submit a form, shift focus, or trigger disruptive page shifts without warning.
- **Input Assistance:** Required fields are clearly identified. Error messages identify the exact field and describe how to correct the issue.

### 4. Robust
- **Semantic HTML First:** Use native elements (`<button>`, `<a>`, `<header>`, `<main>`, `<nav>`, `<section>`, `<dialog>`) before applying custom ARIA attributes.
- **Valid ARIA:** Ensure ARIA attributes (`aria-expanded`, `aria-label`, `aria-modal`, `role`) match actual DOM states and do not conflict with native semantics.

---

## Practical Audit Checklist

1. **Keyboard Test:** Navigate the entire page using only `Tab` and `Shift+Tab`. Is every button, link, and input reached in logical order? Is the focus ring clearly visible?
2. **Contrast Test:** Check background vs text color combinations against WCAG 4.5:1 standards.
3. **Form Test:** Does every `<input>` have an associated `<label for="...">` or accessible `aria-label`? Are errors announced programmatically?
4. **Modal/Dialog Test:** When a modal opens, does focus move inside? Is background scrolling disabled? Can it be dismissed with `Escape`?
5. **Zoom Test:** Zoom the viewport to 200% and 400%. Does the layout reflow without horizontal clipping or loss of functionality?
