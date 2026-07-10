// OSMO "Button 004" (portado de ATOM): parte cada copia del label en caracteres y
// setea las variables que el CSS usa para el flip 3D escalonado (--index = distancia
// al centro, --signed-index = lado/signo, --max-index = centro). La animación vive en
// el CSS.

import { SplitText } from './gsap-env';

export function initButton004(scope: Element): void {
  scope.querySelectorAll<HTMLElement>('[data-aa-btn004]').forEach((button) => {
    button.querySelectorAll<HTMLElement>('[data-aa-btn004-text]').forEach((textEl) => {
      const split = new SplitText(textEl, {
        type: 'chars',
        tag: 'span',
        charsClass: 'aa-button__split-char',
      });

      const chars = split.chars as HTMLElement[];
      const count = chars.length;
      const center = (count - 1) / 2;
      const maxIndex = Math.floor(center);

      textEl.style.setProperty('--max-index', String(maxIndex));

      chars.forEach((char, index) => {
        const distance = Math.floor(Math.abs(index - center));
        let signedIndex = 0;
        if (index < center) signedIndex = distance;
        else if (index > center) signedIndex = -distance;

        char.style.setProperty('--index', String(distance));
        char.style.setProperty('--signed-index', String(signedIndex));
      });
    });
  });
}
