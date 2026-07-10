// NavCta — botón pill con letter-roll y, en variante standalone, círculo con flecha.
// Trasladado del NavCta de Spark; estilizado con tokens --aa-* (acento OSMO).

import { renderRoll } from './roll';

export interface NavCtaOptions {
  href: string;
  label: string;
  standalone?: boolean;
}

const cx = (...parts: (string | false | undefined)[]): string => parts.filter(Boolean).join(' ');

export function renderNavCta(opts: NavCtaOptions): HTMLAnchorElement {
  const { href, label, standalone } = opts;
  const a = document.createElement('a');
  a.className = cx('aa-nav-cta', standalone && 'aa-nav-cta--standalone');
  a.href = href;
  a.appendChild(renderRoll(label));

  if (standalone) {
    const icon = document.createElement('span');
    icon.className = 'aa-nav-cta__icon';
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    a.appendChild(icon);
  }
  return a;
}
