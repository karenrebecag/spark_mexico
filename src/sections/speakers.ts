// Speakers — header centrado (ref. Relume Team 1: eyebrow + heading + sub) + un solo
// marquee horizontal de avatar circular + nombre + rol + compañía (el grid 4-col ocupaba
// demasiado alto). Strip dark (texto claro) sobre el gradiente de marca (--aa-gradient-bg,
// ver speaker-accordion.css) — con theme light el texto (tinta oscura) no contrastaba
// contra el gradiente coral/naranja.

import { renderSection, renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderMarquee } from '../ui/marquee';
import { renderPill } from '../ui/atoms/pill';
import { SPEAKERS, type Speaker } from '../constants/speakers';

// Iniciales para el avatar de fallback (imagen ausente/rota).
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function speakerCard(s: Speaker): HTMLElement {
  const card = document.createElement('div');
  card.className = 'aa-speaker-card';

  // Avatar: iniciales de fondo + foto encima (absolute). Si la foto falla, el fallback
  // (is--initials, cableado tras montar) oculta la img y deja ver las iniciales.
  const avatar = document.createElement('div');
  avatar.className = 'aa-speaker-card__avatar';
  avatar.textContent = initials(s.name);

  const img = document.createElement('img');
  img.className = 'aa-speaker-card__avatar-img';
  img.src = s.image;
  img.alt = s.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  avatar.appendChild(img);

  const company = renderPill(s.company);
  company.classList.add('aa-speaker-card__company');

  const name = document.createElement('span');
  name.className = 'aa-speaker-card__name';
  name.textContent = s.name;

  const role = document.createElement('span');
  role.className = 'aa-speaker-card__role';
  role.textContent = s.role;

  card.append(avatar, company, name, role);
  return card;
}

export function renderSpeakersSection(root: Element): void {
  const section = renderSection({ theme: 'dark', className: 'aa-speakers' });
  section.id = 'speakers';
  section.setAttribute('data-aa-nav-anchor', '');

  const header = renderSectionHeader({
    eyebrow: '( Speakers )',
    heading: 'Nuestros Speakers',
    sub: 'Líderes de marketing, ventas y tecnología de las marcas que ya están aplicando IA para vender, atender y crecer en la región.',
    align: 'center',
  });

  const marquee = renderMarquee({
    items: SPEAKERS.map(speakerCard),
    direction: 'forward',
    duration: '70s',
    gap: 'var(--aa-gap-m)',
    className: 'aa-speakers__marquee aa-marquee--masked',
  });

  // Header contenido (max-width 1280); el marquee sigue full-bleed, fuera del container.
  section.appendChild(renderContainer({ size: 'default', children: [header] }));
  section.appendChild(marquee);

  // Fallback de avatar: si la foto ya falló o falla al cargar, revela las iniciales.
  section.querySelectorAll<HTMLImageElement>('.aa-speaker-card__avatar-img').forEach((img) => {
    const reveal = () => img.closest('.aa-speaker-card__avatar')?.classList.add('is--initials');
    if (img.complete && img.naturalWidth === 0) reveal();
    else img.addEventListener('error', reveal);
  });

  root.appendChild(section);
}
