// Speakers accordion (efecto MWG 035) — lista vertical de filas (una por speaker). Al
// hacer hover en una fila: crece, las demás se encogen, y la foto del speaker sube desde
// abajo (translateY 100% → 0) con stagger. La fila previa revierte su foto. Fila 0 activa
// por defecto. Port del recurso a gsap-env.
//
// Scopeado a desktop vía gsap.matchMedia: en mobile / reduced-motion el efecto no corre
// (se auto-revierte) y el CSS muestra la lista colapsada estática.

import { gsap } from './gsap-env';

export function initSpeakerAccordion(scope: Element): void {
  const list = scope.querySelector<HTMLElement>('.aa-speakers__list');
  if (!list) return;
  const rows = Array.from(list.querySelectorAll<HTMLElement>('.aa-speakers__row'));
  if (!rows.length) return;

  gsap.matchMedia().add(
    '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
    () => {
      // flex-basis colapsado/expandido: se leen de los tokens CSS del componente (em),
      // fuente única con speaker-accordion.css. GSAP convierte de px→em al animar.
      const style = getComputedStyle(list);
      const rowCollapsed = style.getPropertyValue('--aa-speaker-row').trim();
      const rowExpanded = style.getPropertyValue('--aa-speaker-row-active').trim();

      let lastIndex = 0;
      const timelines: gsap.core.Timeline[] = [];
      const handlers: Array<() => void> = [];

      rows.forEach((row, index) => {
        const medias = row.querySelectorAll<HTMLElement>('.aa-speakers__media');

        // Timeline de revelado de la(s) foto(s) de la fila. Solo la fila 0 arranca visible.
        const tl = gsap.timeline({ paused: index !== 0 });
        tl.to(medias, {
          y: 0,
          stagger: { each: 0.04, from: 'random' },
          duration: 0.4,
          ease: 'power4.out',
        });
        timelines.push(tl);

        const onEnter = () => {
          if (index === lastIndex) return;
          // Revierte rápido la foto de la fila previamente activa.
          timelines[lastIndex].timeScale(3).reverse();
          lastIndex = index;
          // Revela la foto de la nueva fila activa.
          timelines[index].timeScale(1).play();

          // Expande la fila activa, colapsa el resto (flex-basis animado).
          gsap.to(rows, { flexBasis: rowCollapsed, duration: 0.2, ease: 'power2.inOut' });
          gsap.to(row, { flexBasis: rowExpanded, duration: 0.2, ease: 'power2.inOut' });
        };
        row.addEventListener('mouseenter', onEnter);
        handlers.push(() => row.removeEventListener('mouseenter', onEnter));
      });

      // Cleanup al salir del breakpoint: quita listeners, mata timelines, limpia inline styles.
      return () => {
        handlers.forEach((off) => off());
        timelines.forEach((tl) => tl.kill());
        gsap.set(rows, { clearProps: 'flexBasis' });
        rows.forEach((row) => {
          gsap.set(row.querySelectorAll('.aa-speakers__media'), { clearProps: 'transform' });
        });
      };
    },
  );
}
