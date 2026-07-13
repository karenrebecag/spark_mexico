# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versionado: el CI de release etiqueta `vX.Y.Z` por push a `main` (cuando se conecte el repo).

## [Unreleased]

### Added
- Sección de patrocinios (`sections/sponsors.ts` + `styles/sponsors.css`, `#patrocinios`):
  logos agrupados por tier (Diamante/Oro/Plata/Participantes). Layout combinado de Relume
  —tarjetas de Logo 6 para los tiers de patrocinio, fila suelta de Logo 1 para las marcas
  participantes— porque ninguna de sus 6 secciones de logos contempla tiers. La jerarquía
  se lee por tarjeta + nº de columnas + altura de logo, sin anunciar precios. Feedback del
  cliente: las franjas del marquee se quedan, pero faltaba una sección dedicada. Contenido
  pendiente — placeholders hasta que lleguen los tiers reales y los archivos de logo
  (`SPONSOR_TIERS` en `constants/sponsors.ts`).
- CTA de WhatsApp en `#faq` (agente de Q&A). El link `wa.me` aún no está definido: el botón
  apunta a `#faq` para no publicar un destino roto.

### Changed
- Labels del marquee de logos → CTAs: "Patrocinadores" y "Marcas participantes" anclan a su
  fila de `#patrocinios` (ids `patrocinios-<tier>`). Evita dos fuentes de verdad sobre el
  nivel de cada marca: la franja hace de teaser y la sección responde quién está en cuál.
  "Marcas aliadas" pasa a "Marcas participantes" para que link y destino se llamen igual.
- MediaPlayer del hero: autoreproduce muteado y en loop al entrar al viewport; el sonido
  pasa a un botón explícito en la esquina. Antes exigía click y arrancaba con volumen alto.
- `#edicion-2025` → `#ediciones-anteriores`: cubre Panamá 2025 + Bogotá 2026 (pill, heading
  a "Más de 1000 líderes", párrafo nuevo y label del navbar). Pendiente: fotos y logos de
  marcas de ambas ediciones en la tira (hoy placeholders por el coste de compositar en el pin).

### Added
- Scroll highlight (`ui/scroll-highlight.ts` + `styles/scroll-highlight.css`): marcador de
  acento coral que se llena bajo las palabras marcadas con `[data-aa-highlight]` al scroll
  (background-size scrubbeado). Nueva opción `mark` en `renderParagraph`; aplicado en los
  intros de `#contacto` y `#problema`. Respeta `prefers-reduced-motion`.
- Reveal de body text por líneas (`data-aa-lines`): cada renglón sube tras su clip
  (mask + stagger, `expo.out`), la contraparte de bajo perfil del split de headings.
  `renderParagraph` lo emite por defecto (opt-out con `reveal: false`).
- Bootstrap del proyecto: duplicado 1:1 de `ATOM_Academy` como punto de partida (stack
  vanilla TS + esbuild + GSAP, Mount Point Pattern para Elementor).
- `PORT` configurable en `esbuild.config.mjs` (default `8766`) para coexistir con otros
  proyectos del mismo stack en local.
- Plan de traslado de SparkSummit2026 documentado en `CLAUDE.md` (mapeo de tokens,
  secciones, componentes y fases).
- Este `CHANGELOG.md`.
- Fotos reales de los aliados en la sección Speakers: Álvaro Matos (columna izquierda) y
  Josué Flores (strip inferior, columna derecha), reemplazando los placeholders.

### Changed
- Split-reveal ahora corre en TODOS los headings, incluidos los que llevan gradiente
  (`.aa-text-gradient`): antes se caían a un fade plano. `motion.ts` detecta el gradiente y
  parte por líneas (preserva el `background-clip`); el resto sigue por words. `renderHeading`
  activa `split` por defecto y `renderSectionHeader` deja de excluirlo cuando hay highlight.
- Pin del loader de `at_forms` a `@v1.0.12` (incluye preselección de país/prefijo por geo-IP
  y el fix de envío a Salesforce).
- Fotos de aliados corregidas (cruce de identidad) y media en proporción 1:1 (antes 3:4
  desktop / 4:3 mobile).
- Rol unificado de Álvaro y Josué: "Fundador y CEO de Blue Makers. Cofundador de Skillyfund."
- Fotos de aliados en proporción 4:5 (ligeramente vertical).
- Countdown: squares en grid de columnas iguales (`minmax(0,1fr)`) con `aspect-ratio` 1:1,
  para que los 4 midan lo mismo; 2 columnas en mobile.

### Fixed
- Desborde horizontal en todas las strips: se restauró el reset `box-sizing: border-box`
  (perdido en el duplicado). Sin él, `width:100%` + `padding-inline` del `.aa-container`
  desbordaba y el `overflow-x: clip` del root recortaba el contenido por la derecha
  (más visible en la sección del form embebido).

### Changed
- Beneficios ("Por qué asistir"): se reemplazó el slider draggable por el efecto MWG 087
  (pin + scroll horizontal con inercia por card según la velocidad de scroll). Header sin
  cambios. Nuevos `ui/benefits-scroll.ts` y `styles/benefits.css`; `ui/slider.ts` +
  `styles/slider.css` quedan sin uso.
- FAQ accordion: portado el estilo de ATOM Academy (filas underline + icono +/−) en lugar
  del de Spark (pills rellenos), que se estiraban a lo ancho de la card navy.
- Git desconectado del duplicado (sin historial ni remote del proyecto origen).

### Pending
- Rebrand de identidad: `package.json` (`name`), refs `Academy_LP` en `loader.js` /
  `src/index.ts`, definir repo/remote/CDN destino.
- Traslado de las 9 secciones + navbar de SparkSummit (ver fases en `CLAUDE.md`).
- Reemplazo de contenido/copy/imagery por el de ATFX Perú.
