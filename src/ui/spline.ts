// Spline runtime (CDN, no npm) — inyecta el web component <spline-viewer> una sola vez,
// solo si hay una escena montada en el DOM. La escena se declara en ASSETS.splineScene
// (export .splinecode); el <spline-viewer url="..."> la carga.

import { SPLINE_RUNTIME } from '../constants/assets';

export function initSpline(): void {
  const viewer = document.querySelector<HTMLElement & { play?: () => void }>('spline-viewer');
  if (!viewer) return; // no hay escena montada

  if (!document.querySelector('script[data-spline-runtime]')) {
    const s = document.createElement('script');
    s.type = 'module';
    s.src = SPLINE_RUNTIME;
    s.setAttribute('data-spline-runtime', '');
    document.head.appendChild(s);
  }

  // ── Anti-freeze ──────────────────────────────────────────────────────────────
  // Al salir del viewport (y con la GPU presionada por el resto de animaciones), el
  // canvas WebGL del viewer puede PERDER su contexto. Sin preventDefault, la pérdida es
  // PERMANENTE y la escena queda congelada en el último frame. Con preventDefault el
  // navegador puede restaurarlo. El canvas vive en el shadow DOM del viewer → lo
  // enganchamos cuando la escena termina de cargar (evento 'load').
  viewer.addEventListener('load', () => {
    const canvas = viewer.shadowRoot?.querySelector('canvas');
    if (!canvas) return;
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
  });

  // Refuerzo: al re-entrar la escena al viewport, pedimos al viewer que reanude el render
  // (algunas versiones pausan el loop offscreen). play() es no-op si la API no lo expone.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) viewer.play?.();
    },
    { threshold: 0.05 },
  );
  io.observe(viewer);
}
