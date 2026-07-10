// Momentum-based hover (inertia) — port de ATOM. En contenedores con
// [data-momentum-hover-init] rastrea la velocidad del puntero; al entrar en cada
// [data-momentum-hover-element] lanza un tween de inercia (x/y/rotation) sobre su
// [data-momentum-hover-target], que vuelve a 0 con momentum. InertiaPlugin ya está
// registrado en gsap-env.

import { gsap } from './gsap-env';

const XY_MULTIPLIER = 30; // multiplica la velocidad del puntero para x/y
const ROTATION_MULTIPLIER = 20; // multiplica el torque normalizado para la rotación
const INERTIA_RESISTANCE = 200; // mayor = frena antes

export function initMomentumHover(scope: Element): void {
  // Solo en dispositivos con hover fino (desktop con mouse/trackpad).
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const clampXY = gsap.utils.clamp(-1080, 1080);
  const clampRot = gsap.utils.clamp(-60, 60);

  scope.querySelectorAll<HTMLElement>('[data-momentum-hover-init]').forEach((root) => {
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;
    let rafId: number | null = null;

    root.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        rafId = null;
      });
    });

    root.querySelectorAll<HTMLElement>('[data-momentum-hover-element]').forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        const target = el.querySelector<HTMLElement>('[data-momentum-hover-target]');
        if (!target) return;

        const { left, top, width, height } = target.getBoundingClientRect();
        const offsetX = e.clientX - (left + width / 2);
        const offsetY = e.clientY - (top + height / 2);

        // Torque crudo → normalizado por el brazo de palanca (rotación ∝ velocidad).
        const rawTorque = offsetX * velY - offsetY * velX;
        const leverDist = Math.hypot(offsetX, offsetY) || 1;
        const angularForce = rawTorque / leverDist;

        gsap.to(target, {
          inertia: {
            x: { velocity: clampXY(velX * XY_MULTIPLIER), end: 0 },
            y: { velocity: clampXY(velY * XY_MULTIPLIER), end: 0 },
            rotation: { velocity: clampRot(angularForce * ROTATION_MULTIPLIER), end: 0 },
            resistance: INERTIA_RESISTANCE,
          },
        });
      });
    });
  });
}
