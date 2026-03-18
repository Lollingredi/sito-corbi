# Michele Corbisiero — Portfolio

Sito portfolio personale di Michele Corbisiero, data analyst. Realizzato da [Redi Bako](https://www.rediverse.cc/projects).

## Stack tecnico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Linguaggio | TypeScript 5 |
| UI | React 19 |
| Stile | Tailwind CSS 4 |
| Animazioni | Framer Motion 12 |
| Grafici | Chart.js 4 + react-chartjs-2 |
| Icone | react-icons 5 |
| Deploy | Vercel |

## Struttura del progetto

```
app/
├── page.tsx                          # Homepage (hero, about, education, progetti, skills, contatti)
└── projects/
    ├── thesis/page.tsx               # Pagina tesi magistrale
    └── cyclistic-bike-share/page.tsx # Pagina progetto Cyclistic

components/
├── Navbar.tsx      # Navbar responsive con routing dinamico homepage/progetto
├── Footer.tsx      # Footer con link social
├── Skills.tsx      # Sezione strumenti e linguaggi
└── ...             # Altri componenti sezione homepage

context/
├── LanguageContext.tsx  # Context bilingue IT/EN
└── ThemeContext.tsx     # Context dark/light mode

lib/
└── translations.ts     # Stringhe tradotte IT/EN
```

## Funzionalità

- **Bilingue** — Italiano / Inglese con switch dinamico
- **Dark mode** — Toggle persistente
- **Routing smart** — La navbar usa `usePathname` per generare link corretti da qualsiasi pagina (`/#sezione` vs `#sezione`)
- **Pagine progetto** — Pagine dedicate con grafici interattivi (Chart.js) e animazioni scroll (Framer Motion)
- **Statico** — Build completamente statica (SSG), nessun server richiesto a runtime

## Comandi

```bash
npm run dev    # Server di sviluppo su http://localhost:3000
npm run build  # Build di produzione
npm run start  # Avvia la build di produzione
npm run lint   # Linting ESLint
```
