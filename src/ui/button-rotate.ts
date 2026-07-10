// Rotación del botón (patrón OSMO): las copias del label rotan alrededor de un
// pivote lejano (--aa-btn-y, calculado por JS según el largo del texto). En hover,
// GSAP rota +--aa-btn-r con stagger → una copia sale girando y la otra entra.

import { gsap, EASE } from './gsap-env';

const YK = 30;
const COOLDOWN = 100;

function maxChars(btn: HTMLElement): number {
  const labels = Array.from(btn.querySelectorAll('.aa-button__label'));
  return Math.max(0, ...labels.map((l) => (l.textContent ?? '').trim().length));
}

// Pivote proporcional al texto: textos largos → pivote más lejano (arco más amplio).
function updateY(btn: HTMLElement): void {
  const y = Math.max(100, Math.min(Math.round(100 + YK * (12 + 6 * maxChars(btn))), 10000));
  btn.style.setProperty('--aa-btn-y', `${y}%`);
}

export function initButtonRotate(scope: Element): void {
  const btns = Array.from(scope.querySelectorAll<HTMLElement>('[data-aa-btn-rotate]'));
  if (!btns.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  btns.forEach((btn) => {
    updateY(btn);
    document.fonts?.ready?.then(() => updateY(btn)); // las fonts cambian las métricas
    if (reduce) return;

    const items = btn.querySelectorAll('.aa-button__label');
    if (!items.length) return;

    let last = 0;
    let tween: gsap.core.Tween | null = null;

    btn.addEventListener('pointerenter', () => {
      const now = performance.now();
      if (now - last < COOLDOWN) return;
      last = now;

      const r = parseFloat(getComputedStyle(btn).getPropertyValue('--aa-btn-r')) || 20;
      if (tween) {
        tween.kill();
        gsap.set(items, { clearProps: 'rotation' });
      }
      tween = gsap.to(items, {
        rotation: `+=${r}`,
        duration: 0.5,
        ease: EASE,
        stagger: 0.075,
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(items, { clearProps: 'rotation' });
          tween = null;
        },
      });
    });
  });
}
