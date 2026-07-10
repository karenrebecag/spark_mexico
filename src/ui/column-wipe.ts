// Column Wipe intro — adaptado del page-transition de Portfolio2026 (patrón OSMO).
// El Portfolio lo usa entre rutas (Barba); aquí es una landing de una sola página, así
// que se reduce a un overlay de ENTRADA: 5 columnas navy cubren el viewport y se retiran
// en stagger al montar, revelando el hero. Corre en paralelo con playIntro (el hero ya
// anima oculto bajo el overlay → sin flash al despejar). Respeta prefers-reduced-motion.

import { gsap, EASE } from './gsap-env';

const PANEL_COUNT = 5;
const DURATION = 0.45;
const STAGGER = 0.04;
const LINES_OPACITY = 0.12;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Inyecta el overlay como último hijo de root (queda arriba por z-index).
export function renderColumnWipe(root: HTMLElement): void {
  const overlay = document.createElement('div');
  overlay.className = 'aa-transition';
  overlay.setAttribute('data-aa-transition', '');
  overlay.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < PANEL_COUNT; i++) {
    const col = document.createElement('div');
    col.className = 'aa-transition__column';
    col.setAttribute('data-aa-transition-column', '');
    overlay.appendChild(col);
  }

  const lines = document.createElement('div');
  lines.className = 'aa-transition__lines';
  overlay.appendChild(lines);

  root.appendChild(overlay);
}

// Reveal de entrada: columnas cubren (yPercent 0) → se retiran hacia arriba (yPercent -100)
// en stagger. El overlay se elimina al terminar. Sin gating: playIntro corre a la par.
export function playColumnWipeIntro(root: Element): void {
  const overlay = root.querySelector<HTMLElement>('[data-aa-transition]');
  if (!overlay) return;

  if (prefersReducedMotion()) {
    overlay.remove();
    return;
  }

  const columns = gsap.utils.toArray<HTMLElement>(
    overlay.querySelectorAll('[data-aa-transition-column]'),
  );
  const lines = overlay.querySelector<HTMLElement>('.aa-transition__lines');

  gsap.set(columns, { yPercent: 0, force3D: true });
  if (lines) gsap.set(lines, { opacity: LINES_OPACITY });

  const tl = gsap.timeline({ onComplete: () => overlay.remove() });

  tl.to(columns, {
    yPercent: -100,
    duration: DURATION,
    stagger: STAGGER,
    ease: EASE,
    force3D: true,
  });

  if (lines) {
    tl.to(lines, { opacity: 0, duration: 0.4, ease: EASE }, 0.15);
  }
}
