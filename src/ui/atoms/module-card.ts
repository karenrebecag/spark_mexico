// Module card — réplica de la product-card de OSMO (portada de ATOM): spacer de
// aspect ratio (__before) + __content con __tags arriba y __center centrado. Sin la
// capa de textura del original. Variantes recoloreadas a la paleta ATFX.

export type ModuleCardVariant = 'accent' | 'gradient' | 'light';

export interface ModuleCardData {
  variant?: ModuleCardVariant; // omitido = navy (default)
  tag?: string;
  title: string;
  desc: string;
}

export function renderModuleCard(card: ModuleCardData): HTMLElement {
  const el = document.createElement('article');
  el.className = 'aa-mod-card';
  if (card.variant) el.classList.add(`aa-mod-card--${card.variant}`);

  const before = document.createElement('div');
  before.className = 'aa-mod-card__before';

  const content = document.createElement('div');
  content.className = 'aa-mod-card__content';

  const tags = document.createElement('div');
  tags.className = 'aa-mod-card__tags';
  if (card.tag) {
    const tag = document.createElement('span');
    tag.className = 'aa-mod-card__tag';
    tag.textContent = card.tag;
    tags.appendChild(tag);
  }

  const center = document.createElement('div');
  center.className = 'aa-mod-card__center';
  const title = document.createElement('h3');
  title.className = 'aa-mod-card__h';
  title.textContent = card.title;
  const desc = document.createElement('p');
  desc.className = 'aa-mod-card__p';
  desc.textContent = card.desc;
  center.append(title, desc);

  content.append(tags, center);
  el.append(before, content);
  return el;
}
