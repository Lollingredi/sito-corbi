# Design System — Corbisiero Analytics
> Source of truth for all visual decisions. Page-specific overrides live in `design-system/pages/`.

---

## Product Identity
- **Type**: Data analyst personal portfolio with interactive data visualisations  
- **Style direction**: Professional · Editorial · Data-driven · Approachable  
- **Reference feel**: The Economist × modern SaaS dashboard

---

## Typography

### Pairing Rationale
Inter and Playfair Display were replaced with a more distinctive pairing that
signals analytical precision while remaining approachable.

| Role | Font | Weights | Source |
|------|------|---------|--------|
| **Display / Headings** | Fraunces | 400 · 700 · 900 (+ italic) | Google Fonts |
| **Body / UI** | Plus Jakarta Sans | 400 · 500 · 600 · 700 | Google Fonts |

- **Fraunces** is a variable optical-size serif with pronounced ink traps and a
  slightly quirky editorial character. It reads as authoritative at display sizes
  (thesis titles, hero name) while its italic variant adds warmth in pull-quotes.
- **Plus Jakarta Sans** is a humanist sans with open apertures and generous
  x-height — optimised for screen reading across sizes.

### Type Scale (major third · 1.25×)
| Token | Size | Line-height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display` | 4.5rem (72px) | 1.1 | 900 | Hero name only |
| `h1` | 3.75rem (60px) | 1.15 | 700 | Section H1 |
| `h2` | 3rem (48px) | 1.2 | 700 | Section headings |
| `h3` | 1.25rem (20px) | 1.35 | 600 | Card titles |
| `body-lg` | 1.125rem (18px) | 1.65 | 400 | Lead paragraphs |
| `body` | 1rem (16px) | 1.6 | 400 | Body copy |
| `small` | 0.875rem (14px) | 1.5 | 400 | Captions, tags |
| `xs` | 0.75rem (12px) | 1.4 | 500 | Labels, overlines |

---

## Colour System

### Palette Philosophy
Indigo-600 primary is kept — it reads as technical precision without corporate
coldness. Backgrounds shift from generic gray-50/gray-900 to slate-based values
for a cooler, more editorial feel. Section backgrounds use subtle tints rather
than flat colour alternation.

### CSS Custom Properties
```css
/* Light mode */
--background: #FAFAF8          /* warm off-white, not pure white */
--foreground: #0F172A          /* slate-950, deep not harsh */
--color-primary: #4F46E5       /* indigo-600 */
--color-primary-light: #6366F1 /* indigo-500, hover targets */
--color-secondary: #059669     /* emerald-600 */
--color-accent: #D97706        /* amber-600 */
--color-surface: #F1F5F9       /* slate-100 */
--color-surface-2: #E2E8F0     /* slate-200 */
--color-border: #CBD5E1        /* slate-300 */
--color-muted: #64748B         /* slate-500 */

/* Dark mode */
--background: #0F172A          /* slate-950 — deeper than gray-900 */
--foreground: #F1F5F9          /* slate-100 */
--color-surface: #1E293B       /* slate-800 */
--color-surface-2: #334155     /* slate-700 */
--color-border: #475569        /* slate-600 */
--color-muted: #94A3B8         /* slate-400 */
```

### Section Background Pattern
Rather than flat white/gray alternation, each section uses a semantic surface value:
- **Hero**: dark gradient overlay in dark mode; neutral in light
- **About**: `color-surface` tinted
- **Education**: `background` (default)
- **Internships**: `color-surface` tinted
- **Projects**: `background` (default)
- **Skills**: `color-surface` tinted
- **Resume**: indigo-600 gradient CTA band
- **Contact**: `background` (default)

### Accessibility Contrast
| Pair | Ratio | WCAG |
|------|-------|------|
| Indigo-600 on white (#FAFAF8) | 5.9:1 | AA ✓ |
| Indigo-500 on white | 4.6:1 | AA ✓ |
| Indigo-400 on slate-950 | 4.8:1 | AA ✓ |
| White on indigo-600 | 5.9:1 | AA ✓ |
| slate-100 on slate-950 | 17.3:1 | AAA ✓ |
| Emerald-600 on white | 3.8:1 | AA large only |
| Amber-600 on white | 2.1:1 | Decorative only — add icon/text |

> **Rule**: emerald and amber must NEVER be used as the sole carrier of text
> contrast. Always pair with iconography or bold weight at ≥18px.

---

## Spacing Scale (4px base)
```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px
```
Section vertical padding: `py-24` (96px). Hero: `py-32` (128px).

---

## Motion System
| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, toggle) | 150ms | ease-out |
| Standard (card, panel) | 300ms | ease-out |
| Page entrance (section) | 600ms | ease-out |
| Exit | 200ms | ease-in |
| Stagger interval | 80ms per child | — |

- All Framer Motion animations wrapped in `useReducedMotion()` — when true, skip
  transform/opacity transitions (render final state immediately).
- `viewport={{ once: true }}` on all `whileInView` animations.
- No animation that moves more than 40px — keeps motion purposeful, not theatrical.

### Entrance Variants per Section
| Section | Variant |
|---------|---------|
| Hero (role label) | fade up, y: 24→0, delay: 0 |
| Hero (name) | fade up, y: 32→0, delay: 0.1 |
| Hero (tagline) | fade up, y: 24→0, delay: 0.25 |
| Hero (CTAs) | fade up, y: 16→0, delay: 0.4 |
| Hero (photo) | scale 0.9→1 + fade, delay: 0.2 |
| About (text) | slide right, x: -40→0 |
| About (photo) | slide left, x: 40→0 |
| Timeline (Education/Internships) | stagger children, x: -24→0 |
| Projects cards | stagger, scale: 0.95→1 + fade |
| Skills categories | stagger y: 32→0 |
| Contact cards | stagger y: 24→0 |

---

## Component Standards

### Touch Targets
All interactive elements: min `44×44px`. Extend via padding, not visual size.

### Focus Rings
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 4px;
}
```
Override on rounded elements: `border-radius: 9999px`.

### Cards
- Border-radius: `rounded-2xl` (16px)
- Border: `1px solid var(--color-border)`
- Shadow: `shadow-sm` default → `shadow-lg` on hover
- Transition: `all 250ms ease-out`
- Hover lift: `translateY(-2px)`

### Buttons (primary)
- Background: `var(--color-primary)`
- Padding: `px-6 py-3` (24px × 12px)
- Border-radius: `rounded-full`
- Min-height: 44px
- Active: `scale(0.98)` via `whileTap`

---

## Icon Guidelines
- Library: `react-icons/fi` (Feather) — consistent 2px stroke, clean aesthetic
- Decorative icons: `aria-hidden="true"`
- Interactive icon-only elements: must have `aria-label` or `sr-only` text sibling
- Size: `w-4 h-4` in text, `w-5 h-5` standalone, `w-6 h-6` primary UI

---

## Chart Colours (data-viz)
| Use | Colour | Contrast on white | Contrast on slate-950 |
|-----|--------|-------------------|-----------------------|
| Primary series | #4F46E5 (indigo-600) | 5.9:1 ✓ | 3.2:1 (large) |
| Secondary series | #059669 (emerald-600) | 3.8:1 (large) | 3.5:1 (large) |
| Tertiary series | #D97706 (amber-600) | 2.1:1 decorative | 2.8:1 decorative |
| Neutral/comparison | #94A3B8 (slate-400) | 3.2:1 (large) | 5.9:1 ✓ |

All chart canvases must include `aria-label` describing the key insight and
`role="img"`. A visually-hidden `<p>` data summary provides screen-reader access.

---

## Accessibility Checklist
- [ ] Heading hierarchy: h1 (Hero only) → h2 (sections) → h3 (cards)
- [ ] Landmark roles: `<nav>`, `<main>`, `<footer>`, `<section aria-label>`
- [ ] All icons in non-interactive contexts: `aria-hidden="true"`
- [ ] Language/theme toggles: `aria-label` with current state
- [ ] Hamburger button: `aria-expanded`, `aria-controls`
- [ ] Download links: descriptive `aria-label` or visible text
- [ ] Focus-visible styles on all interactive elements
- [ ] `prefers-reduced-motion` media query in globals.css
- [ ] `useReducedMotion()` in every animated component
- [ ] Chart canvases: `aria-label` + `role="img"` + visually-hidden summary
- [ ] Profile photo: meaningful alt text
- [ ] Minimum 44px touch targets
