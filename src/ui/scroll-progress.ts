// Scroll progress bar — barra superior fija que escala con el progreso de scroll.
// Trasladada de la página de referencia de ATFX (.progress-bar).

export function renderScrollProgress(root: Element): void {
  const wrap = document.createElement('div');
  wrap.className = 'aa-progress-bar-wrap';
  const bar = document.createElement('div');
  bar.className = 'aa-progress-bar';
  wrap.appendChild(bar);
  root.appendChild(wrap);
}

export function initScrollProgress(root: Element): void {
  const found = root.querySelector<HTMLElement>('.aa-progress-bar');
  if (!found) return;
  const bar = found; // estrechado a no-null para el closure (scroll/resize)

  let ticking = false;
  function update(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }
  function onScroll(): void {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
