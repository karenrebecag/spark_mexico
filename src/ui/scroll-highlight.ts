// Scroll highlight — un marcador de acento se llena bajo las palabras marcadas con
// [data-aa-highlight] conforme suben por el viewport (background-size 0%→100%,
// scrubbeado a la posición de lectura). Port del scroll-highlight de Portfolio2026,
// adaptado al DS Spark: el marcador usa el accent coral (el cyan se eliminó del DS).
// El texto queda legible encima; respeta prefers-reduced-motion.

import { gsap, ScrollTrigger } from './gsap-env';
import { $$ } from '../core/dom';

export function initScrollHighlight(scope: Element): void {
  const marks = $$<HTMLElement>('[data-aa-highlight]', scope);
  if (!marks.length) return;

  // Reduced-motion: sin barrido; el marcador aparece lleno de una vez.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(marks, { backgroundSize: '100% 100%' });
    return;
  }

  // Por marca (no por sección): cada frase se llena atada a su propio paso por la
  // banda de lectura, así el relleno sigue al ojo en párrafos dispersos.
  marks.forEach((mark) => {
    gsap.set(mark, { backgroundSize: '0% 100%' });
    gsap.to(mark, {
      backgroundSize: '100% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: mark,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.35,
      },
    });
  });

  ScrollTrigger.refresh();
}
