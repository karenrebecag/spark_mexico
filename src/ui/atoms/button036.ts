// Button 036 (Osmo) — CTA principal. Reveal escalonado del fondo (5 spans con --index)
// + flip 3D del texto en hover. CSS puro (sin JS). Clases .aa-btn036, colores por tokens.

const FLAME_PATH =
  'M8 7C8.1 9.4 9 10 9 10C13.4 8.8 12.5 3 12.5 3C12.5 3 19.5 6.2 19.5 13C19.5 14.9891 18.7098 16.8968 17.3033 18.3033C15.8968 19.7098 13.9891 20.5 12 20.5C10.0109 20.5 8.10322 19.7098 6.6967 18.3033C5.29018 16.8968 4.5 14.9891 4.5 13C4.50074 11.7797 4.82507 10.5815 5.43992 9.52746C6.05478 8.47342 6.93816 7.60129 8 7Z';

// Contador para ids únicos de gradiente (evita colisión entre botones en el DOM).
let btnUid = 0;

// SVG de la flama. Con gradId → stroke en gradiente de marca (capa default);
// sin él → stroke = currentColor (capa hover = blanco sobre el reveal).
function flameSvg(gradId?: string): string {
  const stroke = gradId ? `url(#${gradId})` : 'currentColor';
  const defs = gradId
    ? `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">` +
      '<stop offset="0" style="stop-color:var(--aa-coral-500)"/>' +
      '<stop offset="1" style="stop-color:var(--aa-orange-400)"/>' +
      '</linearGradient></defs>'
    : '';
  return (
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    defs +
    `<path d="${FLAME_PATH}" stroke="${stroke}"/></svg>`
  );
}

export interface Button036Options {
  href: string;
  label: string;
  icon?: boolean; // default true (flama)
  size?: 'sm'; // variante compacta (navbar)
  variant?: 'secondary'; // invertido: blanco en reposo, gradiente en hover (para strips con bg gradient)
}

// El ícono en gradiente vive en la capa que muestra el gradiente sobre fondo claro:
// primary → capa hover (reveal blanco); secondary → capa default (reposo blanco).
function textLayer(
  layer: 'is--default' | 'is--hover',
  label: string,
  icon: boolean,
  gradId: string,
  gradientLayer: 'is--default' | 'is--hover',
): HTMLElement {
  const span = document.createElement('span');
  span.className = `aa-btn036__text ${layer}`;
  if (layer === 'is--hover') span.setAttribute('aria-hidden', 'true');

  if (icon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'aa-btn036__icon';
    iconWrap.innerHTML = flameSvg(layer === gradientLayer ? gradId : undefined);
    span.appendChild(iconWrap);
  }
  const lab = document.createElement('span');
  lab.className = 'aa-btn036__label';
  lab.textContent = label;
  span.appendChild(lab);
  return span;
}

export function renderButton036(opts: Button036Options): HTMLAnchorElement {
  const { href, label, icon = true, size, variant } = opts;
  const gradId = `aa-btn036-grad-${++btnUid}`;
  const gradientLayer = variant === 'secondary' ? 'is--default' : 'is--hover';

  const a = document.createElement('a');
  a.className = ['aa-btn036', size === 'sm' && 'aa-btn036--sm', variant === 'secondary' && 'aa-btn036--secondary']
    .filter(Boolean)
    .join(' ');
  a.href = href;
  a.setAttribute('data-button-036', '');

  // Fondo con 5 spans escalonados (reveal en hover).
  const bg = document.createElement('span');
  bg.className = 'aa-btn036__bg';
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.className = 'aa-btn036__bg-span';
    s.style.setProperty('--index', String(i));
    bg.appendChild(s);
  }

  // Dos capas de texto (default + hover) que hacen el flip.
  const inner = document.createElement('span');
  inner.className = 'aa-btn036__inner';
  inner.append(
    textLayer('is--default', label, icon, gradId, gradientLayer),
    textLayer('is--hover', label, icon, gradId, gradientLayer),
  );

  a.append(bg, inner);
  return a;
}
