// Sección de contacto — intro (heading + subheading) para el form de contacto (pendiente).
// Deliberadamente MUY espaciada y minimalista: baja la carga cognitiva, mucho aire vertical.

import { renderHeading, renderParagraph } from '../ui/text';
import { renderPill } from '../ui/atoms/pill';

export function renderContactSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-contact';
  section.id = 'contacto';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const intro = document.createElement('div');
  intro.className = 'aa-contact__intro';

  const eyebrow = renderPill('Contacto');

  // Heading + subheading en un wrapper row (lado a lado), alineados a la izquierda.
  const headRow = document.createElement('div');
  headRow.className = 'aa-contact__head-row';
  headRow.append(
    renderHeading({
      size: 'l',
      tag: 'h2',
      text: '¿Tienes preguntas? Hablemos.',
      highlight: 'Hablemos.',
      className: 'aa-text-balance',
    }),
    renderParagraph({
      size: 'l',
      text: 'Déjanos tus datos y te contactamos para resolver cualquier duda sobre Spark AI Summit México.',
      mark: 'resolver cualquier duda',
      className: 'aa-contact__sub',
    }),
  );

  intro.append(eyebrow, headRow);

  // Placeholder del form (el widget atfx-forms se reintegra después). Div vacío estilado
  // — el init del widget queda desactivado en index.ts mientras tanto.
  const mount = document.createElement('div');
  mount.className = 'aa-contact__form aa-contact__form--placeholder';
  mount.setAttribute('aria-hidden', 'true');

  // Separador horizontal centrado (no full-width) que marca la transición radial → contacto.
  const rule = document.createElement('div');
  rule.className = 'aa-contact__rule';
  rule.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'aa-contact__inner';
  inner.append(intro, mount);

  // Sin renderContainer: la strip es full-width y el ancho del contenido se simula con
  // padding lateral (--aa-aud-edge-pad), misma estrategia que #problema (¿es para ti?)
  // → ancho uniforme entre ambas secciones. Ver contact.css.
  section.append(rule, inner);
  root.appendChild(section);
}
