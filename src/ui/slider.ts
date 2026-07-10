// Slider draggable con inercia (GSAP Draggable + InertiaPlugin). Portado de ATOM.
// El track se arrastra en X con momentum, acotado al overflow real del contenido.
// Sobre eso, cada card hace un "sway" elástico al entrar al viewport del slider:
// adaptación del efecto MWG 087 al arrastre — el desfase se calcula con la velocidad
// del drag en vez de la del scroll.

import { gsap, Draggable } from './gsap-env';

// Knobs del sway: factor sobre la velocidad (px/frame) y tope para flings rápidos.
const SWAY_FACTOR = 1.1;
const SWAY_CLAMP = 42; // xPercent máximo de desfase

export function initSliders(scope: Element): void {
  scope.querySelectorAll<HTMLElement>('[data-aa-slider]').forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('[data-aa-slider-track]');
    if (!track) return;

    // El track se mueve hacia la izquierda (x negativo) para revelar el overflow.
    const bounds = (): { minX: number; maxX: number } => ({
      minX: Math.min(0, slider.clientWidth - track.scrollWidth),
      maxX: 0,
    });

    const instance = Draggable.create(track, {
      type: 'x',
      inertia: true,
      bounds: bounds(),
      edgeResistance: 0.9,
      dragResistance: 0.05,
      cursor: 'grab',
      activeCursor: 'grabbing',
      allowNativeTouchScrolling: true, // permite scroll vertical nativo en móvil
    })[0];

    const refresh = (): void => instance.applyBounds(bounds());
    window.addEventListener('resize', refresh);
    document.fonts?.ready?.then(refresh); // las fonts cambian el ancho del track
    requestAnimationFrame(refresh);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slots = slider.querySelectorAll<HTMLElement>('.aa-slider__item');

    // ── Accesibilidad por teclado (siempre activa, no depende de reduced-motion) ──
    // El slider es enfocable (tabindex en el markup); las flechas mueven un paso de
    // card, Home/End van a los extremos. Se mueve el track con gsap y se re-sincroniza
    // Draggable vía instance.update() para que un arrastre posterior parta del lugar real.
    const currentX = (): number => gsap.getProperty(track, 'x') as number;
    const stepSize = (): number => {
      const slot = slots[0];
      if (!slot) return slider.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slot.getBoundingClientRect().width + gap;
    };
    const moveTo = (target: number): void => {
      const b = bounds();
      gsap.to(track, {
        x: gsap.utils.clamp(b.minX, b.maxX, target),
        duration: reduce ? 0 : 0.5,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => instance.update(),
      });
    };
    slider.addEventListener('keydown', (e) => {
      const b = bounds();
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); moveTo(currentX() - stepSize()); break;
        case 'ArrowLeft':  e.preventDefault(); moveTo(currentX() + stepSize()); break;
        case 'Home':       e.preventDefault(); moveTo(b.maxX); break;
        case 'End':        e.preventDefault(); moveTo(b.minX); break;
      }
    });

    // ── Sway elástico por card, dirigido por la velocidad del arrastre ──────────
    if (reduce || !slots.length) return;

    // Velocidad = cuánto se movió el track entre dos frames (px). El ticker solo
    // corre mientras el slider está en pantalla (gate del observer de visibilidad).
    let velocity = 0;
    let prevX = 0;
    const tick = (): void => {
      const x = gsap.getProperty(track, 'x') as number;
      velocity = x - prevX;
      prevX = x;
    };

    const sway = (face: HTMLElement | null): void => {
      if (!face) return;
      const offset = gsap.utils.clamp(-SWAY_CLAMP, SWAY_CLAMP, -velocity * SWAY_FACTOR);
      gsap.fromTo(
        face,
        { xPercent: offset },
        { xPercent: 0, ease: 'power3.out', duration: 0.7, overwrite: true },
      );
    };

    // Dispara el sway cuando un slot cruza al área visible del slider (ambos sentidos).
    // Se observa el slot (geometría estable); se mueve su cara hija (.aa-mod-card).
    const enterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) sway(e.target.firstElementChild as HTMLElement | null);
        });
      },
      { root: slider, threshold: 0 },
    );
    slots.forEach((slot) => enterObserver.observe(slot));

    // Enciende/apaga el ticker de velocidad según el slider esté o no en viewport.
    const visObserver = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        prevX = gsap.getProperty(track, 'x') as number; // evita un pico de velocidad al reentrar
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
      }
    });
    visObserver.observe(slider);
  });
}
