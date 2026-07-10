// Directional hover — un tile que entra desde el borde por donde el cursor entró/salió.
// Port del initDirectionalListHover de la referencia ATFX. data-type: 'y' | 'x' | 'all'.

const DIRECTION_MAP: Record<string, string> = {
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
};

function getDirection(e: MouseEvent, el: HTMLElement, type: string): string {
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  if (type === 'y') return y < r.height / 2 ? 'top' : 'bottom';
  if (type === 'x') return x < r.width / 2 ? 'left' : 'right';
  const d: Record<string, number> = { top: y, right: r.width - x, bottom: r.height - y, left: x };
  return Object.entries(d).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
}

export function initDirectionalHover(scope: Element): void {
  scope.querySelectorAll<HTMLElement>('[data-directional-hover]').forEach((container) => {
    const type = container.getAttribute('data-type') ?? 'all';
    container.querySelectorAll<HTMLElement>('[data-directional-hover-item]').forEach((item) => {
      const tile = item.querySelector<HTMLElement>('[data-directional-hover-tile]');
      if (!tile) return;

      item.addEventListener('mouseenter', (e) => {
        const dir = getDirection(e as MouseEvent, item, type);
        tile.style.transition = 'none';
        tile.style.transform = DIRECTION_MAP[dir];
        void tile.offsetHeight; // reflow → la entrada anima desde la dirección correcta
        tile.style.transition = '';
        tile.style.transform = 'translate(0%, 0%)';
      });
      item.addEventListener('mouseleave', (e) => {
        const dir = getDirection(e as MouseEvent, item, type);
        tile.style.transform = DIRECTION_MAP[dir];
      });
    });
  });
}
