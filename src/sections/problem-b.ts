// "¿Para quién es Spark AI Summit?" — variante B de #problema (ref. Relume Layout 609):
// header centrado (eyebrow + heading + body) + lista de una columna centrada (fila con
// badge numerado + rol + descripción, separadas por línea) + CTA centrado. Mismo
// contenido que #problema (SEGMENTS, fotos de credibilidad), otra maquetación — strip
// temporal para comparar ambas antes de decidir con cuál quedarse.

import { renderSection, renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderButton036 } from '../ui/atoms/button036';
import { SEGMENTS, renderCredibilityPhotos, type Segment } from './problem';

function segmentRow(s: Segment, index: number): HTMLElement {
  const row = document.createElement('div');
  row.className = 'aa-aud-b__row';

  const badge = document.createElement('span');
  badge.className = 'aa-aud-b__badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = String(index + 1).padStart(2, '0');

  const text = document.createElement('div');
  text.className = 'aa-aud-b__row-text';

  const role = document.createElement('h3');
  role.className = 'aa-aud-b__role';
  role.textContent = s.role;

  const desc = document.createElement('p');
  desc.className = 'aa-aud-b__desc';
  desc.textContent = s.desc;

  text.append(role, desc);
  row.append(badge, text);
  return row;
}

export function renderProblemVariantSection(root: Element): void {
  const section = renderSection({ theme: 'light', className: 'aa-audience-b' });
  section.id = 'problema-b';

  const header = renderSectionHeader({
    eyebrow: '¿Es para ti?',
    heading: '¿Para quién es Spark AI Summit?',
    highlight: 'Spark AI Summit',
    sub: 'Si decides cómo tu empresa crece y conecta con sus clientes, este día es para ti: verás AI Agents resolviendo problemas reales de negocio, no teoría.',
    align: 'center',
  });

  // Card rosada (mismo patrón que la lista de #problema: dark theme + textura aa-topo),
  // aquí como card contenida en vez de banda full-bleed.
  const list = document.createElement('div');
  list.className = 'aa-aud-b__list aa-topo';
  list.setAttribute('data-aa-section-theme', 'dark');
  SEGMENTS.forEach((s, i) => list.appendChild(segmentRow(s, i)));

  const cta = document.createElement('div');
  cta.className = 'aa-aud-b__cta';
  cta.appendChild(renderButton036({ href: '#contacto', label: 'Reservar mi lugar' }));

  const photos = renderCredibilityPhotos();

  const inner = document.createElement('div');
  inner.className = 'aa-aud-b__inner';
  inner.append(header, list, cta);

  section.appendChild(renderContainer({ size: 'default', children: [inner] }));
  section.appendChild(photos);
  root.appendChild(section);
}
