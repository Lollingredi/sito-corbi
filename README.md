# Michele Corbisiero — Portfolio

Personal portfolio site for Michele Corbisiero, Data Analyst. Built and maintained by [Redi Bako](https://www.rediverse.cc/projects).

Live: [corbisieroanalytics.com](https://corbisieroanalytics.com)

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | ^5 |
| UI library | React | 19.2.3 |
| Styling | Tailwind CSS | ^4 |
| Animations | Framer Motion | ^12 |
| Charts | Chart.js + react-chartjs-2 | 4.5 / 5.3 |
| Icons | react-icons | ^5 |
| Fonts | Inter (body) · Playfair Display (headings) | Google Fonts |
| Deploy | Vercel | SSG |

---

## Project Structure

```
app/
├── layout.tsx                         # Root layout — providers, fonts, metadata, html lang
├── globals.css                        # Tailwind directives, CSS variables (light/dark tokens)
├── page.tsx                           # Homepage — composes all section components in order
└── projects/
    ├── thesis/page.tsx                # Tesi Magistrale detail page with real econometric charts
    └── cyclistic-bike-share/page.tsx  # Cyclistic Bike Share detail page with interactive dashboards

components/
├── Navbar.tsx      # Sticky navbar — section links, CV download, IT/EN toggle, mobile hamburger
├── Footer.tsx      # Footer — social links, theme toggle (sun/moon), credit
├── Hero.tsx        # Hero section — name, tagline, profile photo, CTAs
├── About.tsx       # "Chi sono" — bio paragraphs, quick-fact badges (grade, languages, cert)
├── Education.tsx   # Education timeline — cards with download links for diplomas
├── Internships.tsx # Work experience timeline — same card style as Education
├── Projects.tsx    # Portfolio project cards — tags, GitHub and Live links
├── Skills.tsx      # Tools & languages grid — grouped by category with icons
├── Resume.tsx      # CV download banner — accent background, download button
├── Contact.tsx     # Contact cards — phone (tel:), email, LinkedIn, GitHub
└── HtmlLang.tsx    # Side-effect component — syncs html[lang] with active language

context/
├── LanguageContext.tsx  # IT/EN state, setLang(), t() lookup — wraps entire app
└── ThemeContext.tsx     # Dark/light toggle (defaults to dark) — drives .dark class on <html>

lib/
└── translations.ts     # All UI strings keyed by TranslationKey, duplicated for IT and EN
```

---

## Pages

### Homepage (`/`)

Single-page layout with eight sections rendered in order:

| # | Section | Component | Background |
|---|---|---|---|
| 1 | Hero | `Hero.tsx` | `bg-white / dark:bg-gray-900` |
| 2 | Chi sono | `About.tsx` | `bg-gray-50 / dark:bg-gray-800` |
| 3 | Istruzione | `Education.tsx` | `bg-white / dark:bg-gray-900` |
| 4 | Esperienze | `Internships.tsx` | `bg-gray-50 / dark:bg-gray-800` |
| 5 | Progetti | `Projects.tsx` | `bg-white / dark:bg-gray-900` |
| 6 | Competenze | `Skills.tsx` | `bg-gray-50 / dark:bg-gray-800` |
| 7 | CV | `Resume.tsx` | `bg-indigo-500 / dark:bg-indigo-800` |
| 8 | Contatti | `Contact.tsx` | `bg-white / dark:bg-gray-900` |

Sections alternate between white and gray-50 backgrounds (dark: gray-900 / gray-800) to create visual separation without explicit dividers.

### Project pages (`/projects/*`)

Each project page is self-contained — it imports `Navbar` and `Footer` directly and does not use the homepage layout. Both pages are fully bilingual and pull their language state from `LanguageContext`.

**`/projects/thesis`** — Tesi Magistrale: Regional Misallocation, Italia vs Germania
- Wage-productivity elasticity charts (real panel data from Stata output)
- Counterfactual employment bar charts
- Methodology timeline
- Key findings cards with numeric stats

**`/projects/cyclistic-bike-share`** — Google Data Analytics Capstone
- Tabbed dashboard: Duration · Weekly patterns · Monthly trends · Data tables · Insights · Presentation
- Interactive Chart.js charts (Bar, Line, Doughnut) with real 2025 ridership data
- Filterable data table with inline distribution bars
- Embedded video presentation + PDF download

---

## i18n — IT / EN

All UI strings live in `lib/translations.ts` under a `TranslationKey` union type. Components consume translations via the `useLang()` hook:

```ts
const { t, lang, setLang } = useLang();
// t("hero_role") → "Data Analyst" (same in both languages)
// t("nav_about") → "Chi sono" (IT) | "About" (EN)
```

The language toggle button sits in the Navbar (desktop and mobile menu). It updates `lang` in `LanguageContext`, which re-renders all translated strings. `HtmlLang.tsx` keeps `document.documentElement.lang` in sync for accessibility and SEO.

Adding a new string: add the key to the `TranslationKey` type and supply both `it` and `en` values in `translations.ts`.

---

## Theming — Dark / Light

`ThemeContext` defaults to dark mode. It toggles the `dark` class on `<html>`, which activates Tailwind's `dark:` variants globally. The toggle button (sun/moon icon) lives in the Footer.

```ts
// globals.css defines tokens for both modes
:root    { --background: #ffffff; --foreground: #1F2937; }
.dark    { --background: #111827; --foreground: #F9FAFB; }
```

Custom variant in Tailwind 4:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Indigo (`#6366F1`) | Primary accent | CTAs, links, badges, timeline icons, section labels |
| Emerald (`#10B981`) | Secondary | Hero tagline highlight, contact phone hover |
| Amber (`#F59E0B`) | Accent | Hero tagline highlight, Cyclistic casual-rider charts |
| Gray-900 (`#111827`) | Dark bg | Body background in dark mode |
| Gray-50 (`#F9FAFB`) | Surface | Alternating section backgrounds |

---

## Animations

Scroll-triggered entrance animations are handled with Framer Motion's `whileInView` API. All section components use:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.6 }}
>
```

`viewport={{ once: true }}` ensures each animation plays only on first entry. `amount: 0.1` triggers the animation as soon as 10% of the element is visible — preventing the blank-page bug that occurs with negative `rootMargin` values when sections are already in the viewport at mount time.

The Hero section uses `animate` (not `whileInView`) since it is always in the viewport on load.

Tab-switching animations in the project pages use `animate` directly on the active tab's content wrapper for a quick fade-in on selection.

---

## Navbar Behaviour

- **Sticky** — `position: fixed`, `z-50`, full width
- **Scroll-aware** — transparent at the top; switches to `bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md` after 20px scroll
- **Smart links** — uses `usePathname()` to generate `#section` anchors when on `/`, or `/#section` when on a project sub-page
- **Mobile** — hamburger menu below `md` breakpoint; animated with `AnimatePresence`
- **Language toggle** — shown in both desktop nav and mobile menu
- **CV download** — `<a download>` pointing to `t("cv_file")` (resolves to `/MC_CV_ITA.pdf` or `/MC_CV_EN.pdf` depending on language)

---

## Security Headers

Configured in `next.config.ts` via `async headers()`, applied to all routes:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, interest-cohort all disabled |
| `Content-Security-Policy` | `default-src 'self'`; fonts from `fonts.gstatic.com`; no external frames |

---

## Development

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production build (static export)
npm run start     # Serve the production build locally
npm run lint      # ESLint
```

The output is fully static (SSG). Every route — `/`, `/projects/thesis`, `/projects/cyclistic-bike-share` — is prerendered to HTML at build time. No server runtime is required.

---

## Deployment

The site deploys to Vercel via GitHub webhook on push to the main branch. If auto-deploy is not triggering, deploy manually:

```bash
npx vercel --prod
```
