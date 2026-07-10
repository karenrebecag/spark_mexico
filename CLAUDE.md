# spark-mexico-lp

Landing page versionada para **Spark AI Summit México**. Lógica + estilos servidos vía
jsDelivr; **Elementor solo aporta un punto de montaje**. Build: esbuild + TypeScript + GSAP.

Origen: duplicado de `ATFX_PeruLP` (arquitectura vanilla + Mount Point Pattern + DS `.aa-*`).
Se reutiliza el DS y la maquetación como base; **el contenido de Spark AI Summit México
está pendiente**. La fase actual es trabajar el DS.

## Por qué este proyecto existe

Reutiliza el mismo stack vanilla probado en `ATFX_PeruLP`: DOM generado por TS (sin
React/Tailwind), CSS scopeado a `.aa-*` y bundle público en jsDelivr — embebible en
Elementor vía un único punto de montaje. Sobre esa base se ajusta el DS y luego el
contenido de Spark AI Summit México.

- Base heredada: `/Users/karenrebecaog/Desktop/SoftwareDevProjects/ATFX_PeruLP`
- Referencia de diseño original: `/Users/karenrebecaog/Desktop/SoftwareDevProjects/SparkSummit2026`

## Identidad

| Campo | Valor |
|---|---|
| Repo | `karenrebecag/SparkMexico` (PROVISIONAL — repo aún no creado; debe ser público) |
| Remote | _TBD_ (crear repo público en GitHub) |
| CDN loader | `https://cdn.jsdelivr.net/gh/karenrebecag/SparkMexico@latest/loader.js` |
| Bundle JS | `dist/landing.js` |
| Bundle CSS | `dist/landing.css` |

> Refs de repo (`loader.js`, `src/index.ts`, `.github/workflows/release.yml`) apuntan a
> `karenrebecag/SparkMexico` como placeholder. Ajustar al crear el repo definitivo.
> Prefijos `--aa-*` / `.aa-*` se conservan (scoping ya probado); el trabajo del DS remapea
> los **valores** de los tokens.

## Cómo se usa en Elementor

Widget **HTML** con el mount + loader:

```html
<div data-aa-mount data-aa-theme="light" data-aa-lang="es"></div>
<script data-cfasync="false"
  src="https://cdn.jsdelivr.net/gh/karenrebecag/SparkMexico@latest/loader.js"></script>
```

Atributos: `data-aa-theme` (`light|dark`, default `light`) · `data-aa-lang` (`es|en`, default `es`).

### Gotcha: plugins de "delay JS" de WordPress (WP Meteor, WP Rocket, Perfmatters…)

La landing se renderiza 100% con JS: si el loader no corre al cargar, la página queda
en blanco. Los plugins de optimización de WordPress **retrasan la ejecución de todo el JS
hasta la primera interacción** (scroll/touch/click). Reescriben el `<script>` del loader a
`type="javascript/blocked"` y mueven la URL a `data-wpmeteor-src` → en mobile no pinta hasta
que el usuario hace scroll (parece loader eterno).

`data-cfasync="false"` **NO** exime de esto (eso es solo para Cloudflare Rocket Loader). Hay
que eximir el loader del plugin de delay. Para **WP Meteor** basta el atributo:

```html
<script data-cfasync="false" data-wpmeteor-nooptimize="true"
  src="https://cdn.jsdelivr.net/gh/karenrebecag/SparkMexico@latest/loader.js"></script>
```

Para otros plugins (WP Rocket, Perfmatters, Flying Scripts), excluir la URL del loader
(`jsdelivr`/`loader.js`) en su lista de "no retrasar / exclude from delay".

Los scripts que el loader inyecta luego (`landing.js`) se crean vía JS, así que el plugin no
los toca; solo hay que eximir el `<script>` del loader.

> Cache: jsDelivr sirve el loader `@latest` con `max-age` de 7 días en el navegador. Tras
> cambiar el embed o publicar versión, probar con hard-refresh o incógnito para no quedarse
> con el loader viejo cacheado.

## Arquitectura

```
src/*.ts  --esbuild-->  dist/landing.js (GSAP inlined, minificado) + dist/landing.css
```

### Estructura actual

```
src/
├── index.ts              # boot: lee atributos del mount, renderiza root .aa-landing, initMotion
├── core/{types,dom}.ts   # tipos + helpers de query ($, $$, has)
├── sections/             # hero, waitlist, styleguide (base a reemplazar por strips de Spark)
├── ui/
│   ├── atoms/            # button, checkbox, input
│   ├── motion.ts         # initMotion / reveal*
│   ├── button-rotate.ts  # patrón letra-roll OSMO
│   ├── gsap-env.ts       # registro/centralización de GSAP
│   ├── layout.ts text.ts # helpers de maquetación y tipografía
└── styles/               # tokens, typography, layout, components, hero, form, section-theme, landing(entry)
```

---

## PLAN — Traslado SparkSummit2026 → vanilla (Mount Point Pattern)

**Objetivo:** reconstruir las 9 secciones + navbar de SparkSummit en TS/CSS vanilla,
maquetación idéntica, animaciones equivalentes con GSAP, contenido ATFX Perú.

**Constraints:**
- Sin React/Tailwind: cada componente React → función que crea DOM. Cada clase Tailwind → CSS plano `.aa-*`.
- CSS siempre prefijado `.aa-*` (nunca selectores globales — colisionan con Elementor).
- Un solo punto de montaje; bundle público en jsDelivr (sin secretos).
- GSAP centralizado en `ui/gsap-env.ts`. Lenis (smooth scroll) opcional — ya hay anchor-scroll nativo.
- Assets: reusar URLs del CDN R2 de Spark; reemplazar copy/imagery por ATFX Perú.

### Mapeo de tokens (valores Spark → `--aa-*`)

| Token Spark | Valor | Destino `--aa-*` |
|---|---|---|
| `navy` | `#08101d` | bg dark / `--aa-fg` sobre claro |
| `snow` | `#efece6` | bg light |
| `cyan` | `#22d3ee` | accent (dots, progress, underline) |
| `grad-hero` | `#be6235 → #c52b66` | gradiente hero |
| `grad-accent` | `#e73b58 → #eb5e31` | gradiente acento (texto, botones, scrollbar) |
| text on dark | `#fff` / 75% / 55% | `--aa-fg`, `--aa-fg-muted`, … |
| text on light (`ink`) | `#08101d` / 65% / 40% / 8% | semánticos light |
| Fuente | **Mulish** 400/600/700/800 | `--aa-font-sans` |
| Type scale | base Tailwind **+20% en móvil** (`<768px`) | escala `clamp` en `typography.css` |
| Easing | `cubic-bezier(0.625,0.05,0,1)`, `expo.out`, `power3` | `--aa-ease*` |
| Utilities | `surface-noise` (turbulencia SVG ~30%), `text-gradient-accent` | utilidades `.aa-*` |

### Mapeo de secciones (orden de render top→bottom)

| # | Strip Spark | Archivo destino | Layout clave |
|---|---|---|---|
| 1 | HeroStrip | `sections/hero.ts` | grid 2-col `1fr/1.4fr`, video bg `brightness-50`, Pill + logo + MediaPlayer |
| — | ProgramaWrapper | wrapper en `index.ts` | `-mt-16` overlap, `radius 2.5em` top, bg snow + noise |
| 2 | TicketsStrip | `sections/tickets.ts` | header + Countdown + iframe Luma |
| 3 | ValuePropStrip | `sections/value-prop.ts` | header centrado + PillarSlider |
| 4 | AudienceStrip | `sections/audience.ts` | bg mesh, lista con dots gradiente, sponsors + marcas |
| 5 | Edition2025Strip | `sections/edition.ts` | doble marquee de fotos, stats 3-col, marquee logos |
| 6 | SpeakersStrip | `sections/speakers.ts` | bg mesh, DraggableMarquee de SpeakerCards |
| 7 | FaqStrip | `sections/faq.ts` | Accordion (grid-rows) + CTA |
| 8 | CtaBannerStrip | `sections/cta-banner.ts` | bg img, Marquee palabras, cards 3-col, CTA |
| 9 | Footer | `sections/footer.ts` | bg mesh, logo + socials, legal |
| (opt) | AgendaStrip | `sections/agenda.ts` | ComparisonTable (estaba comentado en Spark) |

### Mapeo de componentes compartidos (`src/ui/`)

| Componente Spark | Archivo destino | Notas de port |
|---|---|---|
| Navbar (+ScrollProgressBar, ProgressiveBlur) | `ui/navbar.ts` | fixed, hide-on-scroll-down, indicador activo, tema por sección |
| Marquee | `ui/marquee.ts` | CSS keyframes translateX, duplicado seamless |
| DraggableMarquee | `ui/draggable-marquee.ts` | GSAP Observer + ScrollTrigger, inercia por timeScale |
| Accordion | `ui/accordion.ts` | `grid-rows-[0fr↔1fr]`, chevron rotate, easing OSMO |
| Countdown | `ui/countdown.ts` | target `2026` + tz offset, tick 1s |
| PillarSlider + PillarCard | `ui/pillar-slider.ts` | GSAP Draggable + Inertia, rotación 20°/paso, auto 4s, spv 3/1 |
| SpeakerCard | `ui/atoms/speaker-card.ts` | avatar circular + nombre/rol/empresa |
| MediaPlayer + Timeline | `ui/media-player.ts` | `<video>` 16:9, HLS.js, controles custom, autoplay en hero |
| ComparisonTable / SpeakerChip / Pill | `ui/atoms/*` | tablas role-based; pills; chips |
| ColumnWipeIntro | `ui/motion.ts` | 5 columnas wipe, dispara `mountComplete` |
| useSplitReveal | `ui/motion.ts` | SplitText + ScrollTrigger, `yPercent 110→0`, `expo.out` |

### Animaciones (data-attrs en HTML generado)

- `data-aa-split` → SplitText reveal (líneas/words, `yPercent 110→0`, stagger 0.05, `expo.out`).
- `data-aa-fade` → fade + translateY (`data-aa-delay` opcional).
- `data-aa-stagger` → stagger sobre hijos directos.
- Hero: timeline en `mountComplete` (left stagger + MediaPlayer scale 0.96→1).
- Navbar: hide/show por velocidad de scroll; tema dark/light por `data-theme-section`.

### Constantes / contenido (`src/constants/`)

Portar shapes y reemplazar con datos ATFX Perú: `nav`, `pillars`, `speakers`, `faq`,
`agenda`, `edition2025` (fotos/logos/stats). Copy en español, contexto Perú.

### Fases sugeridas

0. **Tokens + utilidades**: remapear `tokens.css`/`typography.css`, Mulish, `surface-noise`, gradientes.
1. **Atoms**: Pill, NavCta (reusar `button-rotate`), helpers de sección.
2. **Componentes**: Marquee → DraggableMarquee → Accordion → Countdown → PillarSlider → SpeakerCard → MediaPlayer → Navbar.
3. **Secciones**: Hero → Tickets → ValueProp → Audience → Edition → Speakers → Faq → CtaBanner → Footer.
4. **Motion**: split reveal + column wipe + scroll/nav.
5. **Contenido**: constants ATFX Perú.
6. **Integración**: orden en `boot()`, ProgramaWrapper, `preview.html`, build + typecheck.

> Cada sección y cada componente es un commit independiente. Spec por fase antes de tocar código.

---

## Desarrollo

```bash
npm install
npm run typecheck            # tsc --noEmit
npm run build                # genera dist/
PORT=8767 npm run dev        # build + watch + server (sirve preview.html)
```

`PORT` es configurable (default 8766) para coexistir con otros proyectos del mismo stack.
`preview.html` monta instancias light/dark contra el dist local.

## Reglas de operación

- CSS prefijado `.aa-*` — nunca selectores globales (colisionan con Elementor).
- Pegar en widget **HTML**, NO en el widget Form de Elementor.
- No meter secretos: el bundle es público en jsDelivr.
- Repo debe ser público (requisito de jsDelivr `/gh/`).
- Comentarios = WHY, no WHAT. Sin emojis.
- Registrar cada cambio relevante en `CHANGELOG.md`.
