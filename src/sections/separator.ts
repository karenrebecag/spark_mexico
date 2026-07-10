// Separador full-bleed con imagen de fondo en parallax (reusa data-parallax del proyecto).
// Banda decorativa entre secciones. Strip dark (overlay navy) para cohesión de marca.

// NOTA: URL de LinkedIn con token de expiración + posible hotlink. Mover a R2 propio
// para producción (jsDelivr/dist no versiona esta imagen externa).
const SEPARATOR_IMG =
  'https://media.licdn.com/dms/image/v2/D4D22AQGbkbLgitfbtQ/feedshare-image-high-res/B4DZ8FJOSCGYAU-/0/1782497733319?e=1785369600&v=beta&t=rmttXVf8cbYp1DygLUGEHsPZ8QqLCyc3ytRlwIq6To0';

export function renderSeparator(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-separator';
  section.setAttribute('data-aa-section-theme', 'dark');
  section.setAttribute('aria-hidden', 'true'); // banda decorativa
  // Parallax: el media (target) se desplaza más lento que el scroll. Rango sutil y
  // desactivado en mobile (igual que el hero). Ver ui/parallax.ts.
  section.setAttribute('data-parallax', 'trigger');
  section.setAttribute('data-parallax-start', '12');
  section.setAttribute('data-parallax-end', '-12');
  section.setAttribute('data-parallax-disable', 'mobile');

  // Media sobredimensionado (140% alto, 20% overflow por lado) para que el recorrido
  // del parallax nunca revele los bordes.
  const media = document.createElement('div');
  media.className = 'aa-separator__media';
  media.setAttribute('data-parallax', 'target');
  media.style.backgroundImage = `url('${SEPARATOR_IMG}')`;

  const overlay = document.createElement('div');
  overlay.className = 'aa-separator__overlay';

  section.append(media, overlay);
  root.appendChild(section);
}
