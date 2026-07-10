// Rotating text (recurso de OSMO): una palabra/frase del heading cicla verticalmente.
// Dos modos:
//   inline (default) → palabras sueltas; usa SplitText (máscara de línea), la palabra
//     se queda en el flujo del texto (ej. "...conversaciones que [venden]").
//   block            → frases largas; sin SplitText, la parte rotatoria va en su propia
//     línea full-width y puede envolver (ej. "...crecimiento: [conecta cada chat ...]").
// initRotatingText() arranca ambos según la clase del span.

import { gsap, SplitText } from './gsap-env';
import type { HeadingSize } from './text';

interface RotatingHeadingOptions {
  size: HeadingSize;
  before?: string;
  words: string[];
  after?: string;
  tag?: 'h1' | 'h2' | 'h3';
  className?: string;
  stepDuration?: number;
  block?: boolean; // true para frases largas (propia línea, multilínea)
}

const IN_DURATION = 0.75;
const OUT_DURATION = 0.6;

export function renderRotatingHeading(opts: RotatingHeadingOptions): HTMLElement {
  const { size, before = '', words, after = '', tag = 'h2', className, stepDuration, block = false } = opts;
  const el = document.createElement(tag);
  el.className = [`aa-h-${size}`, 'aa-rotating', className].filter(Boolean).join(' ');
  el.setAttribute('data-aa-rotating-title', '');
  if (stepDuration != null) el.setAttribute('data-step-duration', String(stepDuration));

  // La palabra/frase más larga se deja visible para medir bien antes de inyectar el stack.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? '');
  const span = document.createElement('span');
  span.className = block ? 'aa-rotating__highlight aa-rotating__block' : 'aa-rotating__highlight';
  span.setAttribute('data-aa-rotating-words', words.join(', '));
  span.textContent = longest;

  if (before) el.appendChild(document.createTextNode(`${before} `));
  el.appendChild(span);
  if (after && !block) el.appendChild(document.createTextNode(` ${after}`));
  return el;
}

const prefersReduced = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Loop activo por heading: se mata al re-iniciar (resize) para no acumular.
const loops = new WeakMap<Element, ReturnType<typeof gsap.delayedCall>>();

function parseWords(span: HTMLElement): string[] {
  return (span.getAttribute('data-aa-rotating-words') || '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
}

function buildWords(span: HTMLElement, words: string[]): HTMLElement[] {
  span.textContent = '';
  return words.map((word) => {
    const el = document.createElement('span');
    el.className = 'aa-rotating__word';
    el.textContent = word;
    span.appendChild(el);
    return el;
  });
}

// ── Modo bloque: frases largas, full-width, deslizan en bloque (pueden envolver) ───
function initBlock(heading: Element, span: HTMLElement, words: string[], stepDuration: number): void {
  const wordEls = buildWords(span, words);

  requestAnimationFrame(() => {
    const measure = (): number => Math.max(...wordEls.map((e) => e.getBoundingClientRect().height));
    let maxH = measure();
    span.style.height = `${maxH}px`;

    gsap.set(wordEls, { y: maxH, autoAlpha: 0 });
    let activeIndex = 0;
    gsap.set(wordEls[activeIndex], { y: 0, autoAlpha: 1 });

    // Reaccomoda la altura del mask cuando cambia el envolvimiento por resize.
    window.addEventListener('resize', () => {
      maxH = measure();
      span.style.height = `${maxH}px`;
    });

    const showNext = (): void => {
      const nextIndex = (activeIndex + 1) % wordEls.length;
      const prevEl = wordEls[activeIndex];
      const current = wordEls[nextIndex];
      if (prevEl !== current) {
        gsap.to(prevEl, { y: -maxH, autoAlpha: 0, duration: OUT_DURATION, ease: 'power4.inOut' });
      }
      gsap.fromTo(
        current,
        { y: maxH, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: IN_DURATION, ease: 'power4.inOut' },
      );
      activeIndex = nextIndex;
      loops.set(heading, gsap.delayedCall(stepDuration, showNext));
    };

    if (wordEls.length > 1) loops.set(heading, gsap.delayedCall(stepDuration, showNext));
  });
}

// ── Modo inline: palabras sueltas, máscara de línea vía SplitText, ancho animado ──
function initInline(heading: Element, span: HTMLElement, words: string[], stepDuration: number): void {
  // Split de líneas (máscara) una sola vez. SIN autoSplit/onSplit: con varias instancias
  // en la página, el revert asíncrono de autoSplit dejaba el rotatorio congelado en la
  // palabra más larga. El span se conserva tras el split; construimos el stack dentro.
  new SplitText(heading, { type: 'lines', mask: 'lines', linesClass: 'aa-rotating-line' });

  const wrapper = document.createElement('span');
  wrapper.className = 'aa-rotating__inner';
  const wordEls = words.map((word) => {
    const el = document.createElement('span');
    el.className = 'aa-rotating__word';
    el.textContent = word;
    wrapper.appendChild(el);
    return el;
  });
  span.textContent = '';
  span.appendChild(wrapper);

  requestAnimationFrame(() => {
    gsap.set(wordEls, { yPercent: 150, autoAlpha: 0 });
    let activeIndex = 0;
    gsap.set(wordEls[activeIndex], { yPercent: 0, autoAlpha: 1 });
    wrapper.style.width = `${wordEls[activeIndex].getBoundingClientRect().width}px`;

    const showNext = (): void => {
      const nextIndex = (activeIndex + 1) % wordEls.length;
      const prevEl = wordEls[activeIndex];
      const current = wordEls[nextIndex];
      gsap.to(wrapper, {
        width: current.getBoundingClientRect().width,
        duration: IN_DURATION,
        ease: 'power4.inOut',
      });
      if (prevEl !== current) {
        gsap.to(prevEl, { yPercent: -150, autoAlpha: 0, duration: OUT_DURATION, ease: 'power4.inOut' });
      }
      gsap.fromTo(
        current,
        { yPercent: 150, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: IN_DURATION, ease: 'power4.inOut' },
      );
      activeIndex = nextIndex;
      loops.set(heading, gsap.delayedCall(stepDuration, showNext));
    };

    if (wordEls.length > 1) loops.set(heading, gsap.delayedCall(stepDuration, showNext));
  });
}

export function initRotatingText(scope: Element): void {
  if (prefersReduced()) return; // sin animación: queda la palabra más larga estática

  scope.querySelectorAll<HTMLElement>('[data-aa-rotating-title]').forEach((heading) => {
    const stepDuration = parseFloat(heading.getAttribute('data-step-duration') || '1.75');
    const span = heading.querySelector<HTMLElement>('[data-aa-rotating-words]');
    if (!span) return;
    const words = parseWords(span);
    if (!words.length) return;

    if (span.classList.contains('aa-rotating__block')) initBlock(heading, span, words, stepDuration);
    else initInline(heading, span, words, stepDuration);
  });
}
