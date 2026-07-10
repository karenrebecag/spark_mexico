// Beneficios — efecto MWG 087: sección pinneada + scroll horizontal. El scroll vertical
// traslada la tira de cards en X (scrub); cada card, al entrar al viewport por la
// containerAnimation, recibe una inercia (xPercent) proporcional a la velocidad del
// scroll que se relaja a 0. Patrón espejo de drift-gallery.ts (MWG 094).

import { gsap, ScrollTrigger } from './gsap-env';

const INERTIA_FACTOR = 3; // multiplica el desfase px/frame → xPercent de la cara

export function initBenefitsScroll(scope: Element): void {
  const root = scope.querySelector<HTMLElement>('.aa-benefits');
  if (!root) return;
  const container = root.querySelector<HTMLElement>('.aa-benefits__container');
  const cardsContainer = root.querySelector<HTMLElement>('.aa-benefits__cards');
  const hint = root.querySelector<HTMLElement>('.aa-benefits__hint');
  if (!container || !cardsContainer) return;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.aa-benefits__card'));
  if (!cards.length) return;

  // Reduced-motion: tira estática, sin pin ni inercia (el CSS la deja scrolleable).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const distance = (): number => cardsContainer.clientWidth - window.innerWidth;
  if (distance() <= 0) return; // la tira cabe en pantalla: sin scroll horizontal

  // Hint que se desvanece al llegar el pin a top:top.
  if (hint) {
    gsap.to(hint, {
      autoAlpha: 0,
      duration: 0.2,
      scrollTrigger: {
        trigger: cardsContainer,
        start: 'top top',
        end: 'top top-=1',
        toggleActions: 'play none reverse none',
      },
    });
  }

  // Traslada la tira mientras la sección está pinneada.
  const scrollTween = gsap.to(cardsContainer, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1, // lag ~1s: suaviza el catch-up del scroll nativo
      start: 'top top',
      end: () => '+=' + distance(),
      invalidateOnRefresh: true,
    },
  });

  // Velocidad = px que se movió la tira entre dos frames. El ticker solo corre mientras
  // la sección está en pantalla.
  let between = 0;
  let old = 0;
  const tick = (): void => {
    const current = gsap.getProperty(cardsContainer, 'x') as number;
    between = current - old;
    old = current;
  };

  const transformCard = (face: Element | null): void => {
    if (!(face instanceof HTMLElement)) return;
    gsap.fromTo(
      face,
      { xPercent: -between * INERTIA_FACTOR },
      { xPercent: 0, ease: 'power3.out', duration: 0.7, overwrite: true },
    );
  };

  // Dispara la inercia cuando cada card cruza al viewport (ambos sentidos).
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      containerAnimation: scrollTween,
      start: 'left 100%',
      end: 'right 0%',
      onEnter: () => transformCard(card.firstElementChild),
      onEnterBack: () => transformCard(card.firstElementChild),
    });
  });

  // Enciende/apaga el ticker de velocidad según la sección esté o no en viewport.
  ScrollTrigger.create({
    trigger: root,
    onEnter: () => gsap.ticker.add(tick),
    onLeave: () => gsap.ticker.remove(tick),
    onEnterBack: () => gsap.ticker.add(tick),
    onLeaveBack: () => gsap.ticker.remove(tick),
  });

  // El ancho de la tira depende de fonts/imágenes: recalcula el pin al terminar de cargar.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
}
