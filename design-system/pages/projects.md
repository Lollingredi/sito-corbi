# Page Override — Project Detail Pages
> Applies to: `/projects/thesis` and `/projects/cyclistic-bike-share`
> These pages are data-heavy and deviate from the homepage in specific ways.

---

## Layout Density
Project pages use a **narrower reading column** for prose (max-w-3xl) and a
**wider panel** for charts (max-w-5xl). The homepage uses max-w-6xl uniformly.

## Section Padding
Reduce from `py-24` to `py-16` between sub-sections on project pages to keep
the user in a reading/exploring flow rather than scrolling through whitespace.

## Typography
- **Prose body**: same `body` scale (16px / 1.6) but may use `body-lg` (18px)
  for overview paragraphs that frame the research context.
- **Stat callouts** (e.g. "4–5×", "+12.85 p.p."): `text-3xl font-bold` in
  Fraunces, indigo-600 — these are the emotional hooks that summarise findings.
- **Chart labels/ticks**: Plus Jakarta Sans 12px — this is below normal body
  minimum but acceptable for axis labels since they are supplementary context.

## Chart Colour Rules
Use the full three-series palette from MASTER.md:
- Elasticity bars: indigo-600 (IT) vs slate-400 (DE comparison)
- Counterfactual bars: slate-400 (status quo) / indigo-500 (CF1) / emerald-500 (CF2)
- Member/casual split: indigo-500 vs amber-500

Chart backgrounds: `bg-slate-900/50` in dark, `bg-slate-50` in light — slightly
more contrast than page background to make charts visually distinct.

## Chart Accessibility (REQUIRED per page)
Every `<canvas>` element must have:
```tsx
aria-label="[Chart name]: [one-sentence key finding]"
role="img"
```
A `<p className="sr-only">` immediately after each chart must provide the same
key data in text form for screen-reader users.

## Dynamic Imports
Chart components within project pages must use `next/dynamic` with `ssr: false`
to prevent canvas errors during SSR and improve LCP:
```tsx
import dynamic from 'next/dynamic';
const Bar = dynamic(
  () => import('react-chartjs-2').then(m => m.Bar),
  { ssr: false }
);
```

## Breadcrumb Navigation
Project pages must include a breadcrumb (`Home > Projects > [Page Title]`) for
WCAG 2.4.8 Location compliance.

## Metadata
Each project page must export `metadata` from a server component wrapper:
- `title`: "[Project Name] | Michele Corbisiero"
- `description`: One-sentence research summary (120–155 chars)
- `openGraph.type`: "article"
