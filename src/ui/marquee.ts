// Marquee — track con loop infinito (dos copias para costura sin saltos). CSS-only,
// trasladado del Marquee de Spark. Animación en marquee/speakers.css.

interface MarqueeOptions {
  items: Node[];
  direction?: 'forward' | 'reverse';
  duration?: string;
  gap?: string;
  className?: string;
}

export function renderMarquee(opts: MarqueeOptions): HTMLElement {
  const { items, direction = 'forward', duration = '40s', gap = 'var(--aa-gap-s)', className } = opts;

  const wrap = document.createElement('div');
  wrap.className = className ? `aa-marquee ${className}` : 'aa-marquee';

  const track = document.createElement('div');
  track.className = `aa-marquee__track aa-marquee__track--${direction}`;
  track.style.setProperty('--aa-marquee-duration', duration);

  // Dos grupos idénticos: el track se desplaza -50% → loop continuo. El gap se aplica
  // como margin-inline-end por item (incluido el último) para que la costura sea exacta.
  for (let i = 0; i < 2; i++) {
    const group = document.createElement('div');
    group.className = 'aa-marquee__group';
    if (i > 0) group.setAttribute('aria-hidden', 'true');
    items.forEach((n) => {
      const c = n.cloneNode(true) as HTMLElement;
      c.style.marginInlineEnd = gap;
      group.appendChild(c);
    });
    track.appendChild(group);
  }

  wrap.appendChild(track);
  return wrap;
}
