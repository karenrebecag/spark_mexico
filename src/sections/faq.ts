// FAQ — header centrado (ref. layout de SparkSummit2026) + accordion (cards redondeadas)
// + CTA. Reemplaza el intro/badge/mapa de Lima (leftover de ATFX Perú) — sin sede que
// mapear, el copy es el real de Spark AI Summit.

import { renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderAccordion } from '../ui/accordion';
// import { renderButton036 } from '../ui/atoms/button036'; // CTA OCULTO temporalmente
import { FAQS } from '../constants/content';

export function renderFaqSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-section aa-faq';
  section.id = 'faq';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const header = renderSectionHeader({
    eyebrow: 'Preguntas frecuentes',
    heading: 'Todo lo que necesitas saber antes de reservar.',
    align: 'center',
  });

  const acc = renderAccordion(FAQS);
  acc.setAttribute('data-aa-fade', '');

  // CTA OCULTO temporalmente (antes: renderButton036 "Solicitar inscripción").
  const inner = document.createElement('div');
  inner.className = 'aa-faq__inner';
  inner.append(header, acc);

  section.appendChild(renderContainer({ size: 'm', children: [inner] }));
  root.appendChild(section);
}
