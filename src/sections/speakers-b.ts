// Speakers — variante B de #speakers (ref. Relume Layout 637): grid 2-col. Izquierda =
// head transparente (eyebrow + heading + subheading + CTA, texto claro); derecha = Flick
// Cards Slider (Osmo Vault) con las speaker cards. Sección sobre el gradiente de marca +
// textura topográfica; las cards dark resaltan sobre el cálido. Mismo contenido que la A
// (SPEAKERS). El init del slider vive en index.ts (initFlickCards), tras el montaje.

import { renderSection, renderContainer } from '../ui/layout';
import { renderHeading, renderParagraph } from '../ui/text';
import { renderPill } from '../ui/atoms/pill';
import { renderButton036 } from '../ui/atoms/button036';
import { renderFlickCards, type FlickCard } from '../ui/flick-cards';
import { SPEAKERS } from '../constants/speakers';

export function renderSpeakersVariantSection(root: Element): void {
  // aa-topo: textura topográfica sobre el gradiente de marca (mismo recipe que #problema).
  const section = renderSection({ theme: 'dark', className: 'aa-speakers-b aa-topo' });
  section.id = 'speakers-b';

  // ── Columna izquierda: head transparente (hereda el tema dark de la sección → texto
  // claro sobre el gradiente), sin panel. ──
  const head = document.createElement('div');
  head.className = 'aa-speakers-b__head';

  const eyebrow = renderPill('( Speakers )');
  eyebrow.setAttribute('data-aa-fade', '');

  const heading = renderHeading({
    size: 'l',
    tag: 'h2',
    text: 'Nuestros Speakers',
    split: true,
  });

  const sub = renderParagraph({
    size: 'l',
    text: 'Líderes de marketing, ventas y tecnología de las marcas que ya están aplicando IA para vender, atender y crecer en la región.',
    className: 'aa-speakers-b__sub',
  });
  sub.setAttribute('data-aa-fade', '');

  const cta = document.createElement('div');
  cta.className = 'aa-speakers-b__cta';
  // Variante secondary (blanco → gradiente en hover): contrasta sobre el bg gradiente.
  cta.appendChild(renderButton036({ href: '#contacto', label: 'Reservar mi lugar', variant: 'secondary' }));

  head.append(eyebrow, heading, sub, cta);

  // ── Columna derecha: Flick Cards Slider ──
  const cards: FlickCard[] = SPEAKERS.map((s) => ({
    image: s.image,
    name: s.name,
    role: s.role,
    company: s.company,
  }));

  const slider = document.createElement('div');
  slider.className = 'aa-speakers-b__slider';
  slider.appendChild(renderFlickCards(cards));

  const grid = document.createElement('div');
  grid.className = 'aa-speakers-b__grid';
  grid.append(head, slider);

  section.appendChild(renderContainer({ size: 'default', children: [grid] }));
  root.appendChild(section);
}
