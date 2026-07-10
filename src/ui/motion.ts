// Motion — replica fiel del sistema de animación de OSMO (main.js).
//
// Data-attributes (opt-in desde el markup), espejo de los de OSMO:
//   [data-aa-intro]   → contenedor above-the-fold; sus hijos animan al MONTAR (no scroll)
//   [data-aa-split]    → heading: SplitText words suben con rotación (data-load-heading)
//   [data-aa-fade]     → reveal target: sube 2em con fade (data-load-reveal)
//   [data-aa-stagger]  → grid de cards: patrón playful-cards de OSMO
//
// Valores canónicos de OSMO: words yPercent 100 + rotate 10 (transformOrigin bottom left),
// reveal duration 1.2 / ease expo.out / stagger 0.05; scroll start "clamp(top 80%)" once.

import { gsap, ScrollTrigger, SplitText, STAGGER } from './gsap-env';
import { initButtonRotate } from './button-rotate';

// Timeline de entrada de OSMO: duration 1.2, ease expo.out (distinto del default 0.6/osmo).
const ENTER_DURATION = 1.2;
const ENTER_EASE = 'expo.out';

// SplitText idéntico al de runPageEnterAnimation: líneas enmascaradas + words.
const SPLIT_CONFIG = { type: 'lines,words', mask: 'lines', linesClass: 'aa-text-line' } as const;
// Un heading con gradiente (.aa-text-gradient) se parte SOLO por líneas: partir en words
// rompería el background-clip del degradado (cada word reiniciaría el gradiente). El
// reveal por líneas se ve igual de vivo y conserva el clip continuo.
const SPLIT_CONFIG_LINES = { type: 'lines', mask: 'lines', linesClass: 'aa-text-line' } as const;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Cada heading elige config/targets según tenga o no gradiente clipeado.
function splitHeading(el: HTMLElement): { targets: Element[] } {
  const hasGradient = !!el.querySelector('.aa-text-gradient');
  const split = new SplitText(el, hasGradient ? SPLIT_CONFIG_LINES : SPLIT_CONFIG);
  return { targets: hasGradient ? split.lines : split.words };
}

// ─── Animación de ENTRADA on-mount ([data-aa-intro]) ───────────────────────────
// Corre síncrono dentro del boot (antes del primer paint) → sin flash de contenido.
export function playIntro(scope: Element): void {
  const intro = scope.querySelector<HTMLElement>('[data-aa-intro]');
  if (!intro || prefersReducedMotion()) return;

  const headings = intro.querySelectorAll<HTMLElement>('[data-aa-split]');
  const reveals = intro.querySelectorAll<HTMLElement>('[data-aa-fade]');

  const tl = gsap.timeline({
    defaults: { duration: ENTER_DURATION, ease: ENTER_EASE, stagger: STAGGER },
  });

  headings.forEach((el) => {
    const { targets } = splitHeading(el);
    gsap.set(targets, { yPercent: 100, rotate: 10, transformOrigin: 'bottom left' });
    tl.to(targets, { yPercent: 0, autoAlpha: 1, rotate: 0, delay: 0.1 }, 0.1);
  });
  // OSMO sólo mueve y:2em (el fade lo da la cubierta de transición Barba). Aquí no hay
  // cubierta, así que añadimos autoAlpha para que el reveal se vea limpio.
  if (reveals.length) {
    tl.from(reveals, { y: '2em', autoAlpha: 0 }, '<');
  }
}

// ─── Scroll reveals (resto de secciones, fuera de [data-aa-intro]) ─────────────
export function initScrollReveals(scope: Element): void {
  if (prefersReducedMotion()) return;

  // Headings: mismo SplitText que el mount, disparado al entrar en viewport.
  scope.querySelectorAll<HTMLElement>('[data-aa-split]').forEach((el) => {
    if (el.closest('[data-aa-intro]')) return;
    const { targets } = splitHeading(el);
    gsap.from(targets, {
      yPercent: 100,
      rotate: 10,
      autoAlpha: 0,
      transformOrigin: 'bottom left',
      duration: ENTER_DURATION,
      ease: ENTER_EASE,
      stagger: STAGGER,
      scrollTrigger: { trigger: el, start: 'clamp(top 80%)', once: true },
    });
  });

  // Body text: reveal por líneas enmascaradas (cada renglón sube tras su clip), la
  // contraparte de bajo perfil del split de headings. Jerarquía OSMO: titular por
  // words, párrafo por líneas.
  scope.querySelectorAll<HTMLElement>('[data-aa-lines]').forEach((el) => {
    if (el.closest('[data-aa-intro]')) return;
    const split = new SplitText(el, SPLIT_CONFIG_LINES);
    gsap.from(split.lines, {
      yPercent: 110,
      autoAlpha: 0,
      duration: 0.9,
      ease: ENTER_EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'clamp(top 85%)', once: true },
    });
  });

  // Reveal targets: suben 2em con fade.
  scope.querySelectorAll<HTMLElement>('[data-aa-fade]').forEach((el) => {
    if (el.closest('[data-aa-intro]')) return;
    gsap.from(el, {
      y: '2em',
      autoAlpha: 0,
      duration: ENTER_DURATION,
      ease: ENTER_EASE,
      scrollTrigger: { trigger: el, start: 'clamp(top 85%)', once: true },
    });
  });

  // Cards: patrón playful-cards de OSMO (entran en diagonal con rotación alterna).
  scope.querySelectorAll<HTMLElement>('[data-aa-stagger]').forEach((group) => {
    if (group.closest('[data-aa-intro]')) return;
    const children = Array.from(group.children) as HTMLElement[];
    gsap.from(children, {
      yPercent: 25,
      xPercent: 25,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'expo.out',
      rotate: gsap.utils.wrap([9, 6, 3]),
      stagger: { each: 0.1, from: 'end' },
      scrollTrigger: { trigger: group, start: 'clamp(top 60%)', once: true },
    });
  });
}

export function initMotion(root: Element): void {
  initButtonRotate(root);
  playIntro(root);
  initScrollReveals(root);

  // Los reveals se crean en el boot, antes de que carguen fuentes e imágenes: con alturas
  // colapsadas los triggers above-the-fold quedan mal posicionados y el contenido no se
  // revela hasta hacer scroll. Recalculamos al asentarse el layout.
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.refresh();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
