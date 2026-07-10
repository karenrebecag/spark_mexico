// SpeakerCard — avatar (iniciales como placeholder) + nombre/rol/empresa. Trasladado
// del SpeakerCard de Spark. Sin imágenes externas: usar fotos reales al tenerlas.

import type { SpeakerData } from '../../constants/content';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function renderSpeakerCard(s: SpeakerData): HTMLElement {
  const card = document.createElement('div');
  card.className = 'aa-speaker-card';

  const avatar = document.createElement('div');
  avatar.className = 'aa-speaker-card__avatar';
  avatar.textContent = initials(s.name);

  const meta = document.createElement('div');
  meta.className = 'aa-speaker-card__meta';

  const name = document.createElement('p');
  name.className = 'aa-speaker-card__name';
  name.textContent = s.name;

  const role = document.createElement('p');
  role.className = 'aa-speaker-card__role';
  role.textContent = s.role;

  const company = document.createElement('p');
  company.className = 'aa-speaker-card__company';
  company.textContent = s.company;

  meta.append(name, role, company);

  if (s.bio) {
    const bio = document.createElement('p');
    bio.className = 'aa-speaker-card__bio';
    bio.textContent = s.bio;
    meta.appendChild(bio);
  }

  card.append(avatar, meta);
  return card;
}
