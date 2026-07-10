// Styleguide — referencia viva del design system (como /styleguide en OSMO).
// Demuestra headings, eyebrow, paragraphs, buttons y grid de cards.
// Sirve para validar el design language en el navegador; se quita al construir la landing real.

import { renderSection, renderContainer, renderGrid } from '../ui/layout';
import { renderHeading, renderEyebrow, renderParagraph } from '../ui/text';
import { renderButton } from '../ui/atoms/button';

function block(children: Node[], gap = 'var(--aa-gap-m)'): HTMLElement {
  const el = document.createElement('div');
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.gap = gap;
  children.forEach((c) => el.appendChild(c));
  return el;
}

function row(children: Node[]): HTMLElement {
  const el = document.createElement('div');
  el.style.display = 'flex';
  el.style.flexWrap = 'wrap';
  el.style.gap = 'var(--aa-gap-s)';
  el.style.alignItems = 'center';
  children.forEach((c) => el.appendChild(c));
  return el;
}

export function renderStyleguide(root: Element): void {
  // ── Hero ──────────────────────────────────────────────────────────────────
  const hero = renderSection({
    variant: 'hero',
    children: [
      renderContainer({
        size: 'm',
        children: [
          block([
            renderEyebrow('ATOM Academy · Design System'),
            renderHeading({ size: 'xxl', text: 'Aprende. Construye. Domina.', tag: 'h1', split: true }),
            renderParagraph({
              size: 'l',
              text: 'Un design language inspirado en OSMO: tokens em-fluidos, easing firma y micro-interacciones que respiran.',
              className: 'aa-text-balance',
            }),
            row([
              renderButton({ label: 'Empezar ahora', variant: 'primary' }),
              renderButton({ label: 'Ver programa', variant: 'ghost' }),
            ]),
          ], 'var(--aa-gap-l)'),
        ],
      }),
    ],
  });

  // ── Tipografía ───────────────────────────────────────────────────────────
  const typography = renderSection({
    children: [
      renderContainer({
        children: [
          block([
            renderEyebrow('Escala tipográfica'),
            renderHeading({ size: 'xxl', text: 'Heading XXL' }),
            renderHeading({ size: 'xl', text: 'Heading XL' }),
            renderHeading({ size: 'l', text: 'Heading L' }),
            renderHeading({ size: 'ml', text: 'Heading ML' }),
            renderHeading({ size: 'm', text: 'Heading M' }),
            renderParagraph({ size: 'l', text: 'Paragraph L — texto introductorio de mayor jerarquía para subtítulos y leads.' }),
            renderParagraph({ size: 'm', text: 'Paragraph M — cuerpo de texto estándar para descripciones y contenido general.' }),
          ]),
        ],
      }),
    ],
  });

  // ── Botones ──────────────────────────────────────────────────────────────
  const buttons = renderSection({
    variant: 'sm',
    children: [
      renderContainer({
        children: [
          block([
            renderEyebrow('Botones — patrón 038 (hover para ver el efecto)'),
            row([
              renderButton({ label: 'Primary', variant: 'primary' }),
              renderButton({ label: 'Secondary', variant: 'secondary' }),
              renderButton({ label: 'Ghost', variant: 'ghost' }),
              renderButton({ label: 'Small', variant: 'primary', size: 'sm' }),
            ]),
          ]),
        ],
      }),
    ],
  });

  // ── Cards (grid) ──────────────────────────────────────────────────────────
  const cards = renderSection({
    children: [
      renderContainer({
        children: [
          block([
            renderEyebrow('Grid de cards'),
            renderGrid({
              cols: 3,
              attrs: { 'data-aa-stagger': '' },
              children: ['Tokens', 'Componentes', 'Animación'].map((title, i) => {
                const card = document.createElement('div');
                card.className = 'aa-card';
                const h = renderHeading({ size: 'm', text: title, tag: 'h3' });
                const p = renderParagraph({
                  size: 'm',
                  text: `Módulo ${i + 1} del design system — escalable, scopeado y listo para Elementor.`,
                });
                card.append(h, p);
                return card;
              }),
            }),
          ]),
        ],
      }),
    ],
  });

  root.append(hero, typography, buttons, cards);
}
