// PillarCard — card de pilar (variantes dark/gradient/light) con tags + título +
// underline (escala en activo) + texto. Trasladado del PillarCard de Spark.

import type { PillarData } from '../../constants/content';

export function renderPillarCard(p: PillarData): HTMLElement {
  const card = document.createElement('div');
  card.className = `aa-pcard aa-pcard--${p.variant}`;

  const inner = document.createElement('div');
  inner.className = 'aa-pcard__inner';

  const tags = document.createElement('div');
  tags.className = 'aa-pcard__tags';
  p.tags.forEach((t) => {
    const chip = document.createElement('span');
    chip.className = 'aa-pcard__tag';
    chip.textContent = t;
    tags.appendChild(chip);
  });

  const title = document.createElement('h3');
  title.className = 'aa-pcard__title';
  title.textContent = p.title;

  const underline = document.createElement('span');
  underline.className = 'aa-pcard__underline';

  const text = document.createElement('p');
  text.className = 'aa-pcard__text';
  text.textContent = p.text;

  inner.append(tags, title, underline, text);
  card.appendChild(inner);
  return card;
}
