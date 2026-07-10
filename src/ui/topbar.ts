// Topbar fijo (marquee top:0) — barra fina que ancla a la sección del form (todo el bloque
// es <a href="#contacto">). Dos filas apiladas con loop horizontal infinito
// en sentidos opuestos; al hacer scroll ruedan verticalmente (MWG024: una sale por arriba,
// la otra entra), atado al progreso con scrub. Portado del marquee superior de ATOM.

import { gsap, ScrollTrigger } from './gsap-env';

const PHRASE = 'Reserva tu lugar en Spark AI Summit México 🇲🇽';
const BASE_REPEAT = 4; // secuencia base; initTopbar la rellena hasta cubrir el viewport
const SPEED = 70; // px/s — velocidad constante del loop horizontal

function buildItem(): HTMLElement {
  const item = document.createElement('span');
  item.className = 'aa-topbar__item';
  const dot = document.createElement('span');
  dot.className = 'aa-topbar__dot';
  dot.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.className = 'aa-topbar__text';
  text.textContent = PHRASE;
  item.append(dot, text);
  return item;
}

function buildRow(modifier: '1' | '2'): HTMLElement {
  const row = document.createElement('div');
  row.className = `aa-topbar__row aa-topbar__row--${modifier}`;
  if (modifier === '2') row.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'aa-topbar__track';
  for (let i = 0; i < BASE_REPEAT; i++) track.appendChild(buildItem());
  row.appendChild(track);
  return row;
}

export function renderTopbar(root: Element): void {
  const bar = document.createElement('a');
  bar.className = 'aa-topbar';
  bar.href = '#contacto';
  bar.setAttribute('data-aa-topbar', '');
  bar.setAttribute('aria-label', PHRASE);

  const rows = document.createElement('div');
  rows.className = 'aa-topbar__rows';
  rows.append(buildRow('1'), buildRow('2'));

  bar.appendChild(rows);
  root.appendChild(bar);
}

const prefersReduced = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Rellena la secuencia base hasta superar el viewport y la duplica: con dos copias
// idénticas, animar a -mitad encadena el loop sin costuras. Devuelve esa mitad (px).
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

export function initTopbar(scope: Element): void {
  const bar = scope.querySelector<HTMLElement>('[data-aa-topbar]');
  if (!bar) return;
  const rows = Array.from(bar.querySelectorAll<HTMLElement>('.aa-topbar__row'));
  const tracks = Array.from(bar.querySelectorAll<HTMLElement>('.aa-topbar__track'));
  if (rows.length < 2 || tracks.length < 2) return;

  const distances = tracks.map(fillTrack);

  if (prefersReduced()) return; // sin movimiento: la fila 1 queda estática y visible

  // Loop horizontal infinito en sentidos opuestos (fila 1 ←, fila 2 →).
  gsap.to(tracks[0], { x: -distances[0], ease: 'none', duration: distances[0] / SPEED, repeat: -1 });
  gsap.fromTo(
    tracks[1],
    { x: -distances[1] },
    { x: 0, ease: 'none', duration: distances[1] / SPEED, repeat: -1 },
  );

  // Roll vertical atado al scroll: la fila 2 arranca abajo; el progreso de scroll sube
  // ambas filas 100% (fila 1 sale por arriba, fila 2 entra). Roll completo en ~1 viewport.
  gsap.set(rows[1], { yPercent: 100 });
  gsap.to(rows, {
    yPercent: '-=100',
    ease: 'power1.inOut',
    scrollTrigger: { trigger: scope, start: 'top top', end: '+=100%', scrub: 0.4 },
  });

  ScrollTrigger.refresh();
}
