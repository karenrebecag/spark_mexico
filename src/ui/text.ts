// Helpers de texto — contraparte programática de .aa-h-* / .aa-eyebrow / .aa-p-*.
// `split: true` marca el elemento con data-aa-split para el reveal de motion.ts.

export type HeadingSize = 'xxl' | 'xl' | 'l' | 'ml' | 'm';
export type ParagraphSize = 'l' | 'm';

interface HeadingOptions {
  size: HeadingSize;
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4';
  split?: boolean;
  className?: string;
  highlight?: string; // substring envuelto en gradiente (no usa SplitText, rompe el clip)
}

interface ParagraphOptions {
  size: ParagraphSize;
  text: string;
  className?: string;
  mark?: string; // substring envuelto en <span data-aa-highlight> (se llena al scroll)
  reveal?: boolean; // reveal por líneas al scroll (default true); false = estático
}

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

// Envuelve la primera aparición de `mark` en un <span data-aa-highlight> (marcador que
// barre al scroll vía ui/scroll-highlight.ts); el resto va como texto plano. No usa
// SplitText, que rompería el clip del marcador.
function appendWithMark(el: HTMLElement, text: string, mark: string): void {
  const idx = text.indexOf(mark);
  const before = text.slice(0, idx);
  const after = text.slice(idx + mark.length);
  if (before) el.appendChild(document.createTextNode(before));
  const span = document.createElement('span');
  span.setAttribute('data-aa-highlight', '');
  span.textContent = mark;
  el.appendChild(span);
  if (after) el.appendChild(document.createTextNode(after));
}

export function renderHeading(opts: HeadingOptions): HTMLElement {
  const { size, text, tag = 'h2', split = true, className, highlight } = opts;
  const el = document.createElement(tag);
  el.className = cx(`aa-h-${size}`, className);

  if (highlight && text.includes(highlight)) {
    const idx = text.indexOf(highlight);
    const before = text.slice(0, idx);
    const after = text.slice(idx + highlight.length);
    if (before) el.appendChild(document.createTextNode(before));
    const span = document.createElement('span');
    span.className = 'aa-text-gradient';
    span.textContent = highlight;
    el.appendChild(span);
    if (after) el.appendChild(document.createTextNode(after));
    // El gradiente NO impide el split: motion.ts detecta .aa-text-gradient y parte por
    // líneas (no words), lo que preserva el background-clip del degradado.
    if (split) el.setAttribute('data-aa-split', '');
  } else {
    el.textContent = text;
    if (split) el.setAttribute('data-aa-split', '');
  }

  return el;
}

export function renderEyebrow(text: string, className?: string): HTMLElement {
  const el = document.createElement('span');
  el.className = cx('aa-eyebrow', className);
  el.textContent = text;
  return el;
}

export function renderParagraph(opts: ParagraphOptions): HTMLElement {
  const { size, text, className, mark, reveal = true } = opts;
  const el = document.createElement('p');
  el.className = cx(`aa-p-${size}`, className);
  if (mark && text.includes(mark)) {
    appendWithMark(el, text, mark);
  } else {
    el.textContent = text;
  }
  // El reveal por líneas convive con el marcador: SplitText parte por renglones y el
  // span [data-aa-highlight] sobrevive dentro de su línea (el barrido corre aparte).
  if (reveal) el.setAttribute('data-aa-lines', '');
  return el;
}
