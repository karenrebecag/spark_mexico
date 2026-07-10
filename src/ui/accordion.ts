// Accordion (FAQ) — técnica de OSMO: el body es un grid que anima grid-template-rows
// 0fr → 1fr (el inner con overflow:hidden). Toggle con un atributo data-open. Single-open.
// Maquetación portada de ATOM Academy: filas underline (sin caja de fondo) para que no se
// estiren como pills a lo ancho de la card.

import type { FaqItem } from '../constants/content';

export function renderAccordion(items: FaqItem[]): HTMLElement {
  const acc = document.createElement('div');
  acc.className = 'aa-accordion';

  items.forEach((it, i) => {
    const item = document.createElement('div');
    item.className = 'aa-accordion__item';
    item.setAttribute('data-aa-accordion-item', '');

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'aa-accordion__head';
    head.setAttribute('data-aa-accordion-toggle', '');
    head.setAttribute('aria-expanded', 'false');

    const q = document.createElement('h3');
    q.className = 'aa-accordion__q';
    q.textContent = it.question;

    const icon = document.createElement('span');
    icon.className = 'aa-accordion__icon';
    icon.setAttribute('aria-hidden', 'true');

    head.append(q, icon);

    const body = document.createElement('div');
    body.className = 'aa-accordion__body';
    body.id = `aa-faq-${i}`;
    head.setAttribute('aria-controls', body.id);

    const inner = document.createElement('div');
    inner.className = 'aa-accordion__inner';
    const a = document.createElement('p');
    a.className = 'aa-accordion__a';
    a.textContent = it.answer;
    inner.appendChild(a);
    body.appendChild(inner);

    item.append(head, body);
    acc.appendChild(item);
  });

  return acc;
}

export function initAccordion(scope: Element): void {
  scope.querySelectorAll<HTMLButtonElement>('[data-aa-accordion-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-aa-accordion-item]');
      if (!item) return;
      const isOpen = item.hasAttribute('data-open');

      // single-open: cerrar los demás del mismo accordion
      item.parentElement
        ?.querySelectorAll('[data-aa-accordion-item][data-open]')
        .forEach((other) => {
          if (other !== item) {
            other.removeAttribute('data-open');
            other.querySelector('[data-aa-accordion-toggle]')?.setAttribute('aria-expanded', 'false');
          }
        });

      if (isOpen) {
        item.removeAttribute('data-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
