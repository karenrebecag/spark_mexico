// Cursor personalizado — flecha que sigue el mouse, rota hacia la dirección del
// movimiento y escala sobre elementos interactivos. Portado de ATOM (vanilla TS).
// Adapta su color al tema de la sección bajo el puntero ([data-aa-section-theme]).
// Sobre zonas draggables (.aa-slider__track) muta a flecha de arrastre horizontal (↔).

import { gsap } from './gsap-env';

const INTERACTIVE = 'a, button, [role="button"], [data-aa-cursor]';
// Zonas que mutan el cursor en flecha de arrastre horizontal (↔).
const DRAG_ZONE = '.aa-slider__track, [data-aa-cursor="drag"]';

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Ángulo del movimiento → grados, con +90 para alinear la punta de la flecha.
function calcRotation(dx: number, dy: number): number {
  return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
}

function buildPointer(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'aa-cursor';
  el.setAttribute('aria-hidden', 'true');
  // Flecha por defecto (puntero que rota hacia el movimiento).
  const arrow =
    '<svg class="aa-cursor__arrow" viewBox="0 0 40 40" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"' +
    ' fill="currentColor" stroke="var(--aa-cursor-stroke)" stroke-width="1.5"/></svg>';
  // Flecha de arrastre horizontal (↔) en disco negro, sobre zonas draggables.
  const drag =
    '<span class="aa-cursor__drag">' +
    '<svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M9 12h30M9 12l6-6M9 12l6 6M39 12l-6-6M39 12l-6 6"' +
    ' stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</span>';
  el.innerHTML = arrow + drag;
  return el;
}

function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function initCursor(root: HTMLElement): (() => void) | void {
  // Bloqueado en mobile (además de touch/reduced-motion): en viewports angostos o híbridos
  // donde el touch-detect no dispara, igual no queremos el cursor personalizado.
  if (isTouchDevice() || isMobileViewport() || prefersReducedMotion()) return;

  const pointerEl = buildPointer();
  root.appendChild(pointerEl);

  // Offset de la punta vía GSAP (no CSS): el ticker escribe transform y borraría
  // un translate de CSS. left/top los anima quickTo aparte, sin tocar transform.
  gsap.set(pointerEl, { left: 0, top: 0, x: -4, y: -2, opacity: 0, scale: 1, rotation: 0 });

  let activated = false;
  let lastX = 0;
  let lastY = 0;
  let currentRotation = 0;
  let targetRotation = 0;

  let sectionRafId = 0;
  let pendingCx = 0;
  let pendingCy = 0;
  let dragMode = false;

  function setDragMode(on: boolean) {
    if (on === dragMode) return;
    dragMode = on;
    pointerEl.classList.toggle('aa-cursor--drag', on);
    if (on) targetRotation = 0; // la ↔ se mantiene horizontal, sin rotar
    gsap.to(pointerEl, { scale: on ? 1.1 : 1, duration: 0.2, ease: 'power2.out' });
  }

  // Un solo hit-test por frame: resuelve tema de sección y zona de arrastre.
  function detectUnderCursor() {
    const el = document.elementFromPoint(pendingCx, pendingCy);
    const section = el?.closest<HTMLElement>('[data-aa-section-theme]');
    root.setAttribute('data-aa-cursor-theme', section?.getAttribute('data-aa-section-theme') || 'light');
    setDragMode(!!el?.closest(DRAG_ZONE));
    sectionRafId = 0;
  }

  const pointerXTo = gsap.quickTo(pointerEl, 'left', { duration: 0.35, ease: 'power3' });
  const pointerYTo = gsap.quickTo(pointerEl, 'top', { duration: 0.35, ease: 'power3' });

  const tickerCb = () => {
    currentRotation += (targetRotation - currentRotation) * 0.1;
    gsap.set(pointerEl, { rotation: currentRotation });
  };
  gsap.ticker.add(tickerCb);

  function handleMouseMove(e: MouseEvent) {
    const cx = e.clientX;
    const cy = e.clientY;

    if (!activated) {
      activated = true;
      root.classList.add('is-cursor-active');
      // Mata un fade de salida pendiente para que no oculte el cursor al re-entrar.
      gsap.killTweensOf(pointerEl, 'opacity');
      gsap.set(pointerEl, { left: cx, top: cy, opacity: 1 });
      lastX = cx;
      lastY = cy;
      pendingCx = cx;
      pendingCy = cy;
      if (!sectionRafId) sectionRafId = requestAnimationFrame(detectUnderCursor);
      return;
    }

    pointerXTo(cx);
    pointerYTo(cy);

    pendingCx = cx;
    pendingCy = cy;
    if (!sectionRafId) sectionRafId = requestAnimationFrame(detectUnderCursor);

    const dx = cx - lastX;
    const dy = cy - lastY;
    if (!dragMode && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) targetRotation = calcRotation(dx, dy);
    lastX = cx;
    lastY = cy;
  }

  function handlePointerOver(e: PointerEvent) {
    if (dragMode || !(e.target as HTMLElement).closest(INTERACTIVE)) return;
    gsap.to(pointerEl, { scale: 1.4, duration: 0.25, ease: 'power2.out' });
  }

  function handlePointerOut(e: PointerEvent) {
    if (dragMode || !(e.target as HTMLElement).closest(INTERACTIVE)) return;
    gsap.to(pointerEl, { scale: 1, duration: 0.25, ease: 'power2.out' });
  }

  function handleMouseLeave() {
    activated = false;
    root.classList.remove('is-cursor-active');
    gsap.to(pointerEl, { opacity: 0, duration: 0.2 });
  }

  // Al hacer scroll el mouse no se mueve pero el contenido bajo el cursor sí:
  // reevaluamos en la última posición para no dejar el cursor pegado en modo drag
  // tras salir del slider deslizándolo.
  function handleScroll() {
    if (activated && !sectionRafId) sectionRafId = requestAnimationFrame(detectUnderCursor);
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('pointerover', handlePointerOver);
  document.addEventListener('pointerout', handlePointerOut);
  document.documentElement.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('pointerover', handlePointerOver);
    document.removeEventListener('pointerout', handlePointerOut);
    document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    gsap.ticker.remove(tickerCb);
    if (sectionRafId) cancelAnimationFrame(sectionRafId);
    root.classList.remove('is-cursor-active');
    root.removeAttribute('data-aa-cursor-theme');
    pointerEl.remove();
  };
}
