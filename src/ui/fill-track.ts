// Rellena un track (fila de marquee) clonando sus hijos hasta superar el ancho del
// viewport, y lo duplica una vez más (aria-hidden) para que animar a -mitad del ancho
// total encadene el loop sin costuras. Devuelve esa mitad (px) para usar como distancia
// de un tween a velocidad constante (ver ui/topbar.ts, donde nació esta técnica).

export function fillTrack(track: HTMLElement): number {
  const base = Array.from(track.children);
  let guard = 0;
  while (track.scrollWidth < window.innerWidth && guard++ < 40) {
    base.forEach((n) => track.appendChild(n.cloneNode(true)));
  }
  Array.from(track.children).forEach((n) => {
    const clone = n.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  return track.scrollWidth / 2;
}
