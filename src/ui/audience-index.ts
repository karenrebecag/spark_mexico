// Audience index (efecto MWG 105) — la lista de segmentos barre horizontalmente al
// scroll (cada ítem x: 0→offset→0, scrubbeado) y el ítem más cercano al centro del
// viewport se resalta (opacity 1 vs 0.35). Sin thumbnail. Port del recurso a gsap-env
// (sin Lenis; el scroll nativo basta). Respeta prefers-reduced-motion.

import { gsap, ScrollTrigger } from './gsap-env';

const SWEEP_RATIO = 0.12; // fracción del ancho que barre cada ítem (mwg usa 0.26)
const DIM = 0.35; // opacidad de los ítems no centrados

export function initAudienceIndex(scope: Element): void {
  const list = scope.querySelector<HTMLElement>('.aa-aud__list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll<HTMLElement>('.aa-aud__item'));
  if (!items.length) return;

  // Reduced-motion: sin barrido ni dimming; todos visibles.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(items, { autoAlpha: 1, x: 0 });
    return;
  }

  const offset = list.clientWidth * SWEEP_RATIO;

  // Barrido horizontal por ítem, scrubbeado al paso por el viewport.
  items.forEach((item) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 0.3 },
    });
    tl.to(item, { x: offset, duration: 1, ease: 'power1.inOut' });
    tl.to(item, { x: 0, duration: 1, ease: 'power1.inOut' });
  });

  // Highlight: el ítem cuyo centro está más cerca del centro del viewport queda opaco.
  let currentIndex = -1;
  function updateHighlight(): void {
    const centerY = window.innerHeight / 2;
    let closest = -1;
    let closestDist = Infinity;

    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (centerY < rect.top || centerY > rect.bottom) return;
      const dist = Math.abs(rect.top + rect.height / 2 - centerY);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });

    if (closest === currentIndex) return;
    currentIndex = closest;
    items.forEach((item, i) => {
      gsap.to(item, { autoAlpha: i === closest ? 1 : DIM, duration: 0.3, ease: 'power2.out' });
    });
  }

  ScrollTrigger.create({
    trigger: list,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: updateHighlight,
  });

  updateHighlight();
  ScrollTrigger.refresh();
}
