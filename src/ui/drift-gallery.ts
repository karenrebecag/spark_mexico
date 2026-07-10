// Drift gallery (efecto MWG 094) — sección pinneada: el texto queda centrado fijo y una
// tira horizontal de fotos se traslada con el scroll (scrub). Al cruzar el centro, cada
// foto deriva en Y (alterna arriba/abajo), rota y escala vía containerAnimation.

import { gsap, ScrollTrigger } from './gsap-env';
import { fillTrack } from './fill-track';

const MARQUEE_SPEED = 30; // px/s — marquee mobile de fotos

export function initDriftGallery(scope: Element): void {
  const root = scope.querySelector<HTMLElement>('.aa-drift');
  if (!root) return;
  const container = root.querySelector<HTMLElement>('.aa-drift__container');
  const cardsContainer = root.querySelector<HTMLElement>('.aa-drift__cards');
  if (!container || !cardsContainer) return;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.aa-drift__card'));
  if (!cards.length) return;

  // Reduced-motion: tira estática, sin pin ni marquee.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Mobile (<=767): sin el pin (jank en touch) — la tira se vuelve un marquee simple
  // (fillTrack + loop a velocidad constante, ver fill-track.ts). El CSS la maqueta como
  // track horizontal a este breakpoint (sections.css).
  if (window.matchMedia('(max-width: 767px)').matches) {
    const distance = fillTrack(cardsContainer);
    gsap.to(cardsContainer, { x: -distance, ease: 'none', duration: distance / MARQUEE_SPEED, repeat: -1 });
    return;
  }

  const distance = cardsContainer.clientWidth - window.innerWidth;
  if (distance <= 0) return; // la tira cabe en pantalla: sin scroll horizontal

  const isPortrait = window.innerWidth < window.innerHeight;

  // Traslada la tira horizontalmente mientras la sección está pinneada.
  const scrollTween = gsap.to(cardsContainer, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1, // lag de ~1s: suaviza el catch-up del scroll nativo (aprox. al feel de Lenis)
      start: 'top top',
      end: '+=' + distance,
      invalidateOnRefresh: true,
    },
  });

  // Drift + rotación + scale por card, dirigido por la posición horizontal (containerAnimation).
  cards.forEach((card, i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    const rotation = (Math.random() - 0.5) * 6;
    const amplitude = isPortrait ? 0.38 : 0.48;

    gsap.fromTo(
      card,
      { rotation },
      {
        rotation: -rotation,
        y: () => sign * -amplitude * window.innerHeight,
        yPercent: () => sign * 50,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: 'left 90%',
          end: 'right 10%',
          scrub: true,
        },
      },
    );

    gsap.to(card, {
      scale: 1.4,
      yoyo: true,
      repeat: 1,
      ease: 'back.inOut(3)',
      scrollTrigger: {
        trigger: card,
        containerAnimation: scrollTween,
        start: 'left 90%',
        end: 'right 10%',
        scrub: true,
      },
    });
  });

  // Las fotos cargan async: al terminar, recalcula medidas/posiciones del pin.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
