// Pill — etiqueta contenedora (eyebrow) usada en hero y secciones. Estilo en navbar.css.

export function renderPill(text: string): HTMLElement {
  const el = document.createElement('span');
  el.className = 'aa-pill';
  el.textContent = text;
  return el;
}
