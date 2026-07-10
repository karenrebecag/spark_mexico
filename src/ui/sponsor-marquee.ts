// Marquee de logos (patrocinadores + marcas aliadas) — misma técnica que el topbar (el
// marquee que sí funciona bien en el proyecto): track relleno dinámicamente hasta superar
// el viewport (fillTrack) + loop a velocidad constante en px/s. Una fila por grupo, cada
// una con su label fijo (no scrollea) + sparkle como separador entre logos (mismo glyph
// que el marquee de palabras de #bottom). En mobile el label pasa a estar arriba del track
// (ver sponsor-marquee.css). En desktop los grupos se montan como strips separadas en
// distintos puntos de la página (ver index.ts); en mobile van juntos tras el hero.

import { gsap } from './gsap-env';
import { SPONSOR_GROUPS, type SponsorGroup, type SponsorLogo } from '../constants/sponsors';

const SPEED = 40; // px/s — mismo criterio que el topbar (constante, no duración fija)

const SPARKLE =
  '<svg class="aa-sponsor-marquee__spark" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true">' +
  '<path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z"/></svg>';

function buildItem(logo: SponsorLogo): HTMLElement {
  const item = document.createElement('span');
  item.className = 'aa-sponsor-marquee__item';

  const img = document.createElement('img');
  img.className = 'aa-sponsor-marquee__logo';
  img.src = logo.src;
  img.alt = logo.alt;
  img.loading = 'lazy';
  img.decoding = 'async';

  const spark = document.createElement('span');
  spark.className = 'aa-sponsor-marquee__spark-wrap';
  spark.setAttribute('aria-hidden', 'true');
  spark.innerHTML = SPARKLE;

  item.append(img, spark);
  return item;
}

function buildRow(
  group: SponsorGroup,
  direction: 'forward' | 'reverse',
  tier: 'primary' | 'secondary',
): HTMLElement {
  const row = document.createElement('div');
  row.className = `aa-sponsor-marquee__row aa-sponsor-marquee__row--${direction} aa-sponsor-marquee__row--${tier}`;

  const label = document.createElement('span');
  label.className = 'aa-sponsor-marquee__label';
  label.textContent = group.label;

  const viewport = document.createElement('div');
  viewport.className = 'aa-sponsor-marquee__viewport';
  const track = document.createElement('div');
  track.className = 'aa-sponsor-marquee__track';
  group.logos.forEach((logo) => track.appendChild(buildItem(logo)));
  viewport.appendChild(track);

  row.append(label, viewport);
  return row;
}

// Dirección por índice global del grupo (par → forward, impar → reverse) para que un
// grupo conserve su sentido aunque se monte solo en su propia strip. Tier por índice:
// grupo 0 (patrocinadores) = primary (banda con fondo, logos + grandes); grupo 1 (marcas
// aliadas) = secondary (transparente, logos + discretos) — jerarquía por prominencia, no
// por color (ver sponsor-marquee.css).
export function renderSponsorMarquee(
  variant: 'mobile-only' | 'desktop-only',
  groupIndices: number[] = [0, 1],
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = `aa-sponsor-marquee aa-sponsor-marquee--${variant}`;
  wrap.setAttribute('data-aa-sponsor-marquee', '');
  wrap.setAttribute('data-aa-section-theme', 'light');

  const rows = document.createElement('div');
  rows.className = 'aa-sponsor-marquee__rows';
  groupIndices.forEach((gi) => {
    const direction = gi % 2 === 0 ? 'forward' : 'reverse';
    const tier = gi === 0 ? 'primary' : 'secondary';
    rows.appendChild(buildRow(SPONSOR_GROUPS[gi], direction, tier));
  });

  wrap.appendChild(rows);
  return wrap;
}

const prefersReduced = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Rellena el track hasta superar el viewport y lo duplica: con dos copias idénticas,
// animar a -mitad encadena el loop sin costuras (idéntico a fillTrack de topbar.ts).
function fillTrack(track: HTMLElement): number {
  const base = Array.from(track.children);
  let guard = 0;
  while (track.scrollWidth < window.innerWidth && guard++ < 40) {
    base.forEach((n) => track.appendChild(n.cloneNode(true)));
  }
  Array.from(track.children).forEach((n) => {
    const clone = n.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  return track.scrollWidth / 2;
}

export function initSponsorMarquee(scope: Element): void {
  // Solo se procesa la variante visible en el viewport actual: la otra está en
  // display:none (CSS, ver sponsor-marquee.css) → scrollWidth da 0 y fillTrack rellenaría
  // infinito sin llegar nunca a superar el ancho. No hay listener de resize (igual que
  // el resto de la maquetación responsive del proyecto: se mide una vez al montar).
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (prefersReduced()) return; // sin movimiento: las filas quedan estáticas y legibles

  scope.querySelectorAll<HTMLElement>('[data-aa-sponsor-marquee]').forEach((wrap) => {
    const isMobileVariant = wrap.classList.contains('aa-sponsor-marquee--mobile-only');
    if (isMobileVariant !== isMobile) return;

    // Por fila (no por wrap): una strip puede tener 1 o 2 grupos. La dirección se lee de
    // la clase del row para no depender del número de filas.
    wrap.querySelectorAll<HTMLElement>('.aa-sponsor-marquee__row').forEach((row) => {
      const track = row.querySelector<HTMLElement>('.aa-sponsor-marquee__track');
      if (!track) return;
      const distance = fillTrack(track);
      if (row.classList.contains('aa-sponsor-marquee__row--reverse')) {
        gsap.fromTo(track, { x: -distance }, { x: 0, ease: 'none', duration: distance / SPEED, repeat: -1 });
      } else {
        gsap.to(track, { x: -distance, ease: 'none', duration: distance / SPEED, repeat: -1 });
      }
    });
  });
}
