// Botón — OSMO "Button 004" (portado de ATOM): dos copias del label (default visible +
// hover oculta), cada una spliteada en chars por initButton004(). El flip 3D de
// caracteres en hover es 100% CSS; el JS solo parte el texto y setea las variables.

export interface ButtonOptions {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm';
  target?: '_blank' | '_self';
}

export function renderButton(opts: ButtonOptions): HTMLElement {
  const { label, href, variant = 'primary', size = 'default', target } = opts;

  const tag = href ? 'a' : 'button';
  const el = document.createElement(tag) as HTMLAnchorElement | HTMLButtonElement;
  el.className = `aa-button aa-button--${variant} aa-button--${size}`;
  el.setAttribute('data-aa-btn004', '');

  if (href && el instanceof HTMLAnchorElement) {
    el.href = href;
    if (target) el.target = target;
    if (target === '_blank') el.rel = 'noopener noreferrer';
  }

  const inner = document.createElement('span');
  inner.className = 'aa-button__inner';

  // default = visible/accesible; hover = copia que entra (aria-hidden).
  const def = document.createElement('span');
  def.className = 'aa-button__text is--default';
  def.setAttribute('data-aa-btn004-text', '');
  def.textContent = label;

  const hov = document.createElement('span');
  hov.className = 'aa-button__text is--hover';
  hov.setAttribute('aria-hidden', 'true');
  hov.setAttribute('data-aa-btn004-text', '');
  hov.textContent = label;

  inner.append(def, hov);

  const bg = document.createElement('span');
  bg.className = 'aa-button__bg';

  el.append(inner, bg);
  return el;
}
