// FAQ — header centrado (ref. layout de SparkSummit2026) + accordion (cards redondeadas)
// + CTA. Reemplaza el intro/badge/mapa de Lima (leftover de ATFX Perú) — sin sede que
// mapear, el copy es el real de Spark AI Summit.

import { renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderAccordion } from '../ui/accordion';
import { renderButton036 } from '../ui/atoms/button036';
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

  // CTA a WhatsApp (agente de Q&A). PENDIENTE: el link wa.me aún no está definido — queda
  // apuntando a la propia sección para no publicar un destino roto.
  const cta = document.createElement('div');
  cta.className = 'aa-faq__cta';
  cta.setAttribute('data-aa-fade', '');
  cta.appendChild(renderButton036({ href: '#faq', label: '¿Otra duda? Escríbenos por WhatsApp' }));

  const inner = document.createElement('div');
  inner.className = 'aa-faq__inner';
  inner.append(header, acc, cta);

  section.appendChild(renderContainer({ size: 'm', children: [inner] }));
  root.appendChild(section);
}
