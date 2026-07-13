// Anteriores ediciones — efecto MWG 094 (drift gallery): sección pinneada con el texto (label +
// heading + sub) centrado fijo, mientras una tira de fotos reales del evento deriva
// alrededor del centro al scrollear. Init en ui/drift-gallery.ts. Estilos .aa-drift* en
// sections.css. Usa el set estable EDITION_PHOTOS (R2), no las LinkedIn que expiran.

import { renderHeading, renderParagraph } from '../ui/text';
import { renderPill } from '../ui/atoms/pill';
import { EDITION_PHOTOS } from '../constants/edition';

export function renderEditionSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-drift';
  section.id = 'ediciones-anteriores';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const container = document.createElement('div');
  container.className = 'aa-drift__container';

  // Texto centrado (queda fijo en el centro mientras las fotos derivan alrededor).
  const text = document.createElement('div');
  text.className = 'aa-drift__text';

  const pill = renderPill('Anteriores ediciones');

  const heading = renderHeading({
    size: 'l',
    tag: 'h2',
    text: 'Más de 1000 líderes ya vivieron Spark AI Summit',
    highlight: 'Spark AI Summit',
  });

  const sub = renderParagraph({
    size: 'l',
    text: 'En julio de 2025 en Panamá y junio de 2026 en Bogotá, directores de marketing, gerentes de ventas y CTOs se dieron cita para ver en vivo cómo la inteligencia artificial ya está cambiando la forma de vender, atender y retener clientes en la región.',
    // Sin reveal por líneas: el split de este párrafo largo fija cortes de renglón
    // erróneos (queda partido a media frase). Se muestra estático.
    reveal: false,
    className: 'aa-drift__sub',
  });

  text.append(pill, heading, sub);

  // Tira horizontal de placeholders (GSAP la traslada en X durante el pin). Placeholders
  // (divs con bg de token) en vez de las fotos reales: 14 imágenes DSC full-res animándose
  // con scale+rotación en el pin saturan el compositor y laguean el scroll. Se sustituyen
  // por assets optimizados (thumbnails ligeros) antes de publicar. Se conserva el count de
  // EDITION_PHOTOS para no alterar la geometría de la tira.
  const cards = document.createElement('div');
  cards.className = 'aa-drift__cards';
  EDITION_PHOTOS.forEach(() => {
    const card = document.createElement('div');
    card.className = 'aa-drift__card';
    card.setAttribute('aria-hidden', 'true');
    cards.appendChild(card);
  });

  container.append(text, cards);
  section.appendChild(container);
  root.appendChild(section);
}
