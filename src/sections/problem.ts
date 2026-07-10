// "¿Para quién es Spark AI Summit?" (AudienceStrip de Spark). Layout split 2-col
// referenciado de Relume Layout 617: izq = eyebrow + heading + CTA; der = lista de
// segmentos con ícono/rol/descripción. Strip dark. Tokens --aa-*.

import { renderHeading, renderParagraph } from '../ui/text';
import { renderPill } from '../ui/atoms/pill';
import { renderButton036 } from '../ui/atoms/button036';
import { renderMarquee } from '../ui/marquee';
import { renderGlobe } from '../ui/globe';
import { EDITION_PHOTOS } from '../constants/edition';

export interface Segment {
  role: string;
  desc: string;
}

export const SEGMENTS: Segment[] = [
  {
    role: 'Marketing y Ventas',
    desc: 'Directores de marketing, ventas y transformación digital que buscan optimizar la adquisición y conversión de clientes.',
  },
  {
    role: 'C-Level y Líderes',
    desc: 'Que buscan liderar la transformación de sus organizaciones a través de la Inteligencia Artificial.',
  },
  {
    role: 'Teams',
    desc: 'Equipos de innovación en Educación, Retail, Finanzas, Automotriz, Seguros y Bienes raíces.',
  },
  {
    role: 'Servicio al Cliente',
    desc: 'Empresas que buscan implementar IA para mejorar la personalización, eficiencia y crecimiento de sus negocios.',
  },
];

// Credibilidad: fotos reales de la edición 2025 (mismo set que #edicion-2025), en
// miniatura, como prueba social dentro de "¿para quién es". No son logos de marca →
// object-fit:cover, sin caja blanca (ver problem.css).
function photoChip(src: string): HTMLElement {
  const chip = document.createElement('div');
  chip.className = 'aa-aud__photo';
  const img = document.createElement('img');
  img.className = 'aa-aud__photo-img';
  img.src = src;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.loading = 'lazy';
  img.decoding = 'async';
  chip.appendChild(img);
  return chip;
}

function photoRow(photos: string[], direction: 'forward' | 'reverse'): HTMLElement {
  return renderMarquee({
    items: photos.map(photoChip),
    direction,
    duration: '36s',
    gap: 'var(--aa-gap-s)',
    className: 'aa-aud__marquee',
  });
}

// Dos filas de fotos de la edición 2025 (direcciones opuestas), como prueba social.
// Extraída para reusarse tal cual en la variante de layout de esta strip (#problema-b).
export function renderCredibilityPhotos(): HTMLElement {
  const mid = Math.ceil(EDITION_PHOTOS.length / 2);
  const photos = document.createElement('div');
  photos.className = 'aa-aud__logos-wrap';
  photos.setAttribute('data-aa-fade', '');
  photos.append(
    photoRow(EDITION_PHOTOS.slice(0, mid), 'forward'),
    photoRow(EDITION_PHOTOS.slice(mid), 'reverse'),
  );
  return photos;
}

// Ítem índice (estilo MWG 105): rol en texto grande + descripción. El barrido y el
// highlight los maneja audience-index.ts al scroll.
function segmentItem(s: Segment): HTMLElement {
  const item = document.createElement('li');
  item.className = 'aa-aud__item';

  const role = document.createElement('span');
  role.className = 'aa-aud__item-role';
  role.textContent = s.role;

  const desc = document.createElement('p');
  desc.className = 'aa-aud__item-desc';
  desc.textContent = s.desc;

  item.append(role, desc);
  return item;
}

export function renderProblemSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-section aa-audience';
  section.id = 'problema';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const grid = document.createElement('div');
  grid.className = 'aa-aud__grid';

  // ── Columna izquierda: panel claro (más claro que el fondo) con globe sutil detrás ──
  const head = document.createElement('div');
  head.className = 'aa-aud__head';

  const globeWrap = document.createElement('div');
  globeWrap.className = 'aa-aud__globe';
  globeWrap.setAttribute('aria-hidden', 'true');
  globeWrap.appendChild(renderGlobe());

  const eyebrow = renderPill('¿Es para ti?');
  eyebrow.setAttribute('data-aa-fade', '');

  const heading = renderHeading({
    size: 'l',
    tag: 'h2',
    text: '¿Para quién es Spark AI Summit?',
    highlight: 'Spark AI Summit',
    className: 'aa-text-balance',
  });

  const cta = document.createElement('div');
  cta.className = 'aa-aud__head-cta';
  cta.appendChild(renderButton036({ href: '#contacto', label: 'Reservar mi lugar' }));

  // eyebrow + heading en un bloque de texto (la barra sticky los alinea a la izquierda,
  // el CTA a la derecha).
  const headText = document.createElement('div');
  headText.className = 'aa-aud__head-text';
  headText.append(eyebrow, heading);

  // Credibilidad: dos filas de fotos de la edición 2025 (direcciones opuestas).
  const photos = renderCredibilityPhotos();

  // Body text (puente heading → CTA): invita a reconocerse en los perfiles.
  const body = renderParagraph({
    size: 'l',
    text: 'Si decides cómo tu empresa crece y conecta con sus clientes, este día es para ti: verás AI Agents resolviendo problemas reales de negocio, no teoría.',
    mark: 'problemas reales de negocio',
    className: 'aa-aud__head-body',
  });

  // Wrapper con el padding lateral (texto + CTA); los marquees quedan full-bleed.
  const headContent = document.createElement('div');
  headContent.className = 'aa-aud__head-content';
  headContent.append(headText, body, cta);

  head.append(globeWrap, headContent, photos);

  // ── Índice de segmentos (efecto MWG 105) ────────────────────────────────────
  // Panel rosado dark: data-aa-section-theme="dark" remapea tokens (fg → blanco); el CSS
  // sobreescribe --aa-bg al acento (rosado). El barrido/highlight → audience-index.ts.
  const list = document.createElement('ul');
  list.className = 'aa-aud__list aa-topo'; // aa-topo: textura topográfica sobre el rosado
  list.setAttribute('data-aa-section-theme', 'dark');
  SEGMENTS.forEach((s) => list.appendChild(segmentItem(s)));

  // El separador (banda parallax) ya hace el descanso visual radial↔audiencia; el
  // divisor .aa-divider quedaba redundante justo debajo del band, así que se retiró.
  // Head (barra sticky full-width, sobre la lista) + índice, apilados sin gap.
  grid.append(head, list);
  section.appendChild(grid);
  root.appendChild(section);
}
