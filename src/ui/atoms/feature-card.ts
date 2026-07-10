// FeatureCard — card de la sección "AI enfocada en marketing y ventas" (ValueProp de
// Spark). Base: estructura de aa-mod-card/aa-pcard (spacer aspect + tags arriba +
// título con underline + texto). Mejora: imagen de fondo opcional con scrim para
// legibilidad. El underline se revela cuando la card está activa (contenedor con
// data-*-status="active"); ver feature-card.css.

export type FeatureCardVariant = 'light' | 'dark' | 'gradient' | 'accent';

export interface FeatureCardData {
  variant?: FeatureCardVariant; // omitido = dark
  tags: string[];
  title: string;
  text: string;
  image?: string; // fondo (opcional)
  imageAlt?: string;
}

export function renderFeatureCard(d: FeatureCardData): HTMLElement {
  const card = document.createElement('article');
  card.className = `aa-fcard aa-fcard--${d.variant ?? 'dark'}`;
  if (d.image) card.classList.add('aa-fcard--has-image');

  if (d.image) {
    const bg = document.createElement('img');
    bg.className = 'aa-fcard__bg';
    bg.src = d.image;
    bg.alt = d.imageAlt ?? '';
    bg.loading = 'lazy';
    if (!d.imageAlt) bg.setAttribute('aria-hidden', 'true');
    card.appendChild(bg);
  }

  const inner = document.createElement('div');
  inner.className = 'aa-fcard__inner';

  const tags = document.createElement('div');
  tags.className = 'aa-fcard__tags';
  d.tags.forEach((t) => {
    const chip = document.createElement('span');
    chip.className = 'aa-fcard__tag';
    chip.textContent = t;
    tags.appendChild(chip);
  });

  const center = document.createElement('div');
  center.className = 'aa-fcard__center';
  const title = document.createElement('h3');
  title.className = 'aa-fcard__h';
  title.textContent = d.title;
  const underline = document.createElement('span');
  underline.className = 'aa-fcard__underline';
  center.append(title, underline);

  const text = document.createElement('p');
  text.className = 'aa-fcard__text';
  text.textContent = d.text;

  inner.append(tags, center, text);
  card.appendChild(inner);
  return card;
}
