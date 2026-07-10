// Accelerating Globe on Scroll (GSAP) — port vanilla del componente Osmo. Anillos que
// rotan en loop; la velocidad de scroll acelera el timeScale y luego vuelve a 1.
// Clases .aa-globe*; contrato de data-attributes conservado.

import { gsap } from './gsap-env';

export function renderGlobe(): HTMLElement {
  const globe = document.createElement('div');
  globe.className = 'aa-globe';
  globe.setAttribute('data-accelerating-globe', '');

  const before = document.createElement('div');
  before.className = 'aa-globe__before';

  const back = document.createElement('div');
  back.className = 'aa-globe__back';
  for (let i = 0; i <= 5; i++) {
    const c = document.createElement('div');
    c.className = i === 0 ? 'aa-globe__back-circle' : `aa-globe__back-circle is--${i}`;
    back.appendChild(c);
  }

  const front = document.createElement('div');
  front.className = 'aa-globe__front';
  for (let m = 0; m < 2; m++) {
    const mirror = document.createElement('div');
    mirror.className = m === 1 ? 'aa-globe__mirror is--duplicate' : 'aa-globe__mirror';
    for (let i = 0; i < 4; i++) {
      const circle = document.createElement('div');
      circle.className = 'aa-globe__circle';
      circle.setAttribute('data-accelerating-globe-circle', '');
      const inner = document.createElement('div');
      inner.className = 'aa-globe__circle-inner';
      circle.appendChild(inner);
      mirror.appendChild(circle);
    }
    front.appendChild(mirror);
  }

  globe.append(before, back, front);
  return globe;
}

const WIDTHS: Array<[string, string]> = [
  ['50%', '37.5%'],
  ['37.5%', '25%'],
  ['25%', '12.5%'],
  ['calc(12.5% + 1px)', 'calc(0% + 1px)'],
  ['calc(0% + 1px)', 'calc(12.5% + 1px)'],
  ['12.5%', '25%'],
  ['25%', '37.5%'],
  ['37.5%', '50%'],
];

export function initGlobe(): void {
  document.querySelectorAll<HTMLElement>('[data-accelerating-globe]').forEach((globe) => {
    const circles = globe.querySelectorAll<HTMLElement>('[data-accelerating-globe-circle]');
    if (circles.length < 8) return;

    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: 'none' } });
    circles.forEach((el, i) => {
      const [fromW, toW] = WIDTHS[i];
      tl.fromTo(el, { width: fromW }, { width: toW }, i === 0 ? 0 : '<');
    });

    let lastY = window.scrollY;
    let lastT = performance.now();
    let stopTimeout: ReturnType<typeof setTimeout>;

    const onScroll = (): void => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT;
      lastY = window.scrollY;
      lastT = now;

      const velocity = dt > 0 ? (dy / dt) * 1000 : 0; // px/s
      const boost = Math.abs(velocity * 0.005);
      tl.timeScale(boost + 1);

      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        gsap.to(tl, { timeScale: 1, duration: 0.6, ease: 'power2.out', overwrite: true });
      }, 100);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  });
}
