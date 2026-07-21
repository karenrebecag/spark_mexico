// Radial Cards Slider (GSAP) — port vanilla del componente Osmo. Draggable + Inertia
// rotan las cards sobre un círculo; un proxy invisible (círculo) captura el drag.
// El contrato de data-attributes `data-radial-slider-*` se conserva 1:1 (la lógica
// depende de él); solo las CLASES se prefijan .aa-* para el scoping del DS.

import { gsap, Draggable } from './gsap-env';
import { CustomEase } from 'gsap/CustomEase';

CustomEase.create('radial', '0.25, 0.1, 0, 1');

// Recibe las cards ya construidas (el slider solo aporta el item/órbita); así el
// componente de card es intercambiable.
export function renderRadialSlider(cards: HTMLElement[]): HTMLElement {
  const slider = document.createElement('div');
  slider.className = 'aa-radial-slider';
  slider.setAttribute('data-radial-slider-init', '');
  slider.setAttribute('data-radial-slider-drag-status', 'grab');

  const collection = document.createElement('div');
  collection.className = 'aa-radial-slider__collection';
  collection.setAttribute('data-radial-slider-collection', '');

  const list = document.createElement('div');
  list.className = 'aa-radial-slider__list';
  list.setAttribute('data-radial-slider-list', '');

  cards.forEach((card, i) => {
    const item = document.createElement('div');
    item.className = 'aa-radial-slider__item';
    item.setAttribute('data-radial-slider-item', '');
    item.setAttribute('data-radial-slider-item-status', i === 0 ? 'active' : 'inview');
    item.appendChild(card);
    list.appendChild(item);
  });

  collection.appendChild(list);

  const controls = document.createElement('div');
  controls.className = 'aa-radial-slider__controls';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'aa-radial-slider__control-btn';
  prev.setAttribute('data-radial-slider-control', 'prev');
  prev.textContent = 'Anterior';

  const dots = document.createElement('div');
  dots.className = 'aa-radial-slider__dots';
  dots.setAttribute('data-radial-slider-generate-dots', '');
  // Solo el primer dot como plantilla; el init genera el resto según nº de slides.
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'aa-radial-slider__control-dot';
  dot.setAttribute('data-radial-slider-control', '1');
  dot.setAttribute('data-radial-slider-control-status', 'active');
  dots.appendChild(dot);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'aa-radial-slider__control-btn is--next';
  next.setAttribute('data-radial-slider-control', 'next');
  next.textContent = 'Siguiente';

  controls.append(prev, dots, next);
  slider.append(collection, controls);
  return slider;
}

// ─── Init (port del initRadialCardsSlider del doc, tipado) ──────────────────────
const SLIDE_DURATION = 1;
const CLICK_EASE = 'radial';

interface RadialContainer extends HTMLElement {
  _radialSliderDraggable?: Draggable;
  _radialSliderProxy?: HTMLElement;
  _radialSliderProxyEl?: HTMLElement;
  _radialSliderAuto?: ReturnType<typeof setInterval> | null;
}

function mod(value: number, total: number): number {
  return ((value % total) + total) % total;
}

function buildSlider(container: RadialContainer): void {
  if (container._radialSliderDraggable) container._radialSliderDraggable.kill();
  if (container._radialSliderProxy) gsap.killTweensOf(container._radialSliderProxy);
  if (container._radialSliderProxyEl) container._radialSliderProxyEl.remove();
  if (container._radialSliderAuto) {
    clearInterval(container._radialSliderAuto);
    container._radialSliderAuto = null;
  }

  // Bajo 768px el CSS oculta la rueda (se usa el stack). Montarla ahí mediría todo en 0
  // y dejaría el auto-advance corriendo sin nada visible; el resize handler la reconstruye
  // al volver a desktop.
  if (!container.getClientRects().length) return;

  const collection = container.querySelector<HTMLElement>('[data-radial-slider-collection]');
  const track = container.querySelector<HTMLElement>('[data-radial-slider-list]');
  if (!collection || !track) return;

  container.querySelectorAll('[data-radial-slider-clone]').forEach((el) => el.remove());

  const originalItems = Array.from(
    container.querySelectorAll<HTMLElement>('[data-radial-slider-item]:not([data-radial-slider-clone])'),
  );
  if (!originalItems.length) return;

  // Genera los dots según el nº de slides originales (deja el primero como plantilla).
  const dotsWrap = container.querySelector<HTMLElement>('[data-radial-slider-generate-dots]');
  if (dotsWrap) {
    const dots = Array.from(dotsWrap.querySelectorAll<HTMLElement>('[data-radial-slider-control]'));
    if (dots.length) {
      const firstDot = dots[0];
      dots.slice(1).forEach((d) => d.remove());
      firstDot.setAttribute('data-radial-slider-control', '1');
      firstDot.setAttribute('data-radial-slider-control-status', 'not-active');
      for (let i = 2; i <= originalItems.length; i++) {
        const clone = firstDot.cloneNode(true) as HTMLElement;
        clone.setAttribute('data-radial-slider-control', String(i));
        clone.setAttribute('data-radial-slider-control-status', 'not-active');
        dotsWrap.appendChild(clone);
      }
    }
  }

  const controls = Array.from(container.querySelectorAll<HTMLElement>('[data-radial-slider-control]'));
  const indicators = Array.from(container.querySelectorAll<HTMLElement>('[data-radial-slider-active-slide]'));
  const totalEl = container.querySelector<HTMLElement>('[data-radial-slider-total-slide]');

  originalItems.forEach((item, index) => {
    item.removeAttribute('data-radial-slider-item-status');
    item.setAttribute('role', 'group');
    item.setAttribute('aria-label', `Slide ${index + 1} of ${originalItems.length}`);
  });

  track.style.height = '';

  const setNumber = (el: HTMLElement | null, value: number): void => {
    if (!el) return;
    el.textContent = value < 10 ? '0' + value : String(value);
  };
  setNumber(totalEl, originalItems.length);

  const styles = getComputedStyle(container);
  const rotateStep = Math.abs(parseFloat(styles.getPropertyValue('--slider-rotate'))) || 18;
  const maxLoopItems = Math.max(1, Math.floor(360 / rotateStep));

  const firstRect = originalItems[0].getBoundingClientRect();
  const itemWidth = firstRect.width;
  const itemHeight = firstRect.height;

  const originParts = getComputedStyle(originalItems[0]).transformOrigin.split(' ');
  const originY = parseFloat(originParts[1]) || itemHeight * 3.75;
  const wheelRadius = Math.max(0, originY - itemHeight / 2);
  const proxyRadius = wheelRadius + Math.max(itemWidth, itemHeight) * 0.525;

  const getBoundsAtAngle = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.sin(rad) * wheelRadius,
      y: originY - Math.cos(rad) * wheelRadius,
      halfWidth: (Math.abs(Math.cos(rad)) * itemWidth) / 2 + (Math.abs(Math.sin(rad)) * itemHeight) / 2,
      halfHeight: (Math.abs(Math.sin(rad)) * itemWidth) / 2 + (Math.abs(Math.cos(rad)) * itemHeight) / 2,
    };
  };

  const isOffsetInsideContainer = (offset: number): boolean => {
    const cRect = container.getBoundingClientRect();
    const tRect = track.getBoundingClientRect();
    const originX = tRect.left + tRect.width / 2;
    const originYTop = tRect.top;
    const leftLimit = cRect.left - originX;
    const rightLimit = cRect.right - originX;
    const topLimit = cRect.top - originYTop;
    const bottomLimit = cRect.bottom - originYTop;
    const b = getBoundsAtAngle(offset * rotateStep);
    return (
      b.x + b.halfWidth >= leftLimit &&
      b.x - b.halfWidth <= rightLimit &&
      b.y + b.halfHeight >= topLimit &&
      b.y - b.halfHeight <= bottomLimit
    );
  };

  const getVisibleOffsets = (): number[] => {
    const offsets = [0];
    const maxSide = Math.ceil(maxLoopItems / 2);
    let leftEdge = 0;
    let rightEdge = 0;
    for (let i = 1; i <= maxSide; i++) {
      if (!isOffsetInsideContainer(i)) break;
      offsets.push(i);
      rightEdge = i;
    }
    for (let i = 1; i <= maxSide; i++) {
      if (!isOffsetInsideContainer(-i)) break;
      offsets.unshift(-i);
      leftEdge = -i;
    }
    const nextLeft = leftEdge - 1;
    const nextRight = rightEdge + 1;
    if (Math.abs(nextLeft) <= maxSide) offsets.unshift(nextLeft);
    if (Math.abs(nextRight) <= maxSide) offsets.push(nextRight);
    return offsets;
  };

  const visibleOffsets = getVisibleOffsets();
  const minItemsNeeded = Math.min(maxLoopItems, Math.max(originalItems.length, visibleOffsets.length));
  const neededItems = Math.ceil(minItemsNeeded / originalItems.length) * originalItems.length;

  const currentItems = Array.from(
    container.querySelectorAll<HTMLElement>('[data-radial-slider-item]:not([data-radial-slider-clone])'),
  );
  for (let i = currentItems.length; i < neededItems; i++) {
    const clone = currentItems[i % currentItems.length].cloneNode(true) as HTMLElement;
    clone.setAttribute('data-radial-slider-clone', '');
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  const items = Array.from(track.querySelectorAll<HTMLElement>(':scope > [data-radial-slider-item]'));
  const totalItems = items.length;

  track.style.height = itemHeight + 'px';
  items.forEach((item) => item.setAttribute('data-radial-slider-item-status', 'not-active'));
  container.setAttribute('data-radial-slider-drag-status', 'grab');

  // Proxy invisible: círculo que Draggable rota; los items copian su rotación.
  const cRect = container.getBoundingClientRect();
  const colRect = collection.getBoundingClientRect();
  const tRect = track.getBoundingClientRect();

  const proxyWrap = document.createElement('div');
  proxyWrap.setAttribute('data-radial-slider-proxy-wrap', '');
  Object.assign(proxyWrap.style, {
    position: 'absolute',
    left: cRect.left - colRect.left + 'px',
    top: cRect.top - colRect.top + 'px',
    width: cRect.width + 'px',
    height: cRect.height + 'px',
    overflow: 'hidden',
    pointerEvents: 'none',
  });

  const proxy = document.createElement('div');
  proxy.setAttribute('data-radial-slider-proxy', '');
  Object.assign(proxy.style, {
    position: 'absolute',
    width: proxyRadius * 2 + 'px',
    height: proxyRadius * 2 + 'px',
    left: tRect.left + tRect.width / 2 - cRect.left + 'px',
    top: tRect.top - cRect.top + originY - proxyRadius + 'px',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    pointerEvents: 'auto',
    opacity: '0',
  });

  proxyWrap.appendChild(proxy);
  collection.appendChild(proxyWrap);
  container._radialSliderProxy = proxy;
  container._radialSliderProxyEl = proxyWrap;

  const setRotation = items.map((item) => gsap.quickSetter(item, 'rotation', 'deg') as (v: number) => void);
  gsap.set(proxy, { rotation: 0 });

  const getIndexFromProxy = (): number => -(gsap.getProperty(proxy, 'rotation') as number) / rotateStep;

  const nearestDelta = (index: number, realIndex: number, total: number): number => {
    const loop = Math.round((realIndex - index) / total);
    return index - (realIndex - loop * total);
  };

  const nearestDeltaToSlideNumber = (targetNumber: number, realIndex: number): number => {
    let bestDelta = 0;
    let bestDistance = Infinity;
    items.forEach((_item, index) => {
      if (index % originalItems.length !== targetNumber) return;
      const delta = nearestDelta(index, realIndex, totalItems);
      if (Math.abs(delta) < bestDistance) {
        bestDistance = Math.abs(delta);
        bestDelta = delta;
      }
    });
    return bestDelta;
  };

  let lastActiveIndex: number | null = null;

  const setIndicator = (index: number): void => {
    const value = index + 1;
    const text = value < 10 ? '0' + value : String(value);
    indicators.forEach((el) => (el.textContent = text));
  };

  const updateControlStatus = (activeIndex: number): void => {
    controls.forEach((btn) => {
      const value = btn.getAttribute('data-radial-slider-control') ?? '';
      if (!/^\d+$/.test(value)) return;
      const index = Math.max(0, Math.min(originalItems.length - 1, parseInt(value, 10) - 1));
      const isActive = index === activeIndex;
      btn.setAttribute('data-radial-slider-control-status', isActive ? 'active' : 'not-active');
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const updateActiveUI = (activeIndex: number): void => {
    if (activeIndex === lastActiveIndex) return;
    setIndicator(activeIndex);
    updateControlStatus(activeIndex);
    lastActiveIndex = activeIndex;
  };

  const render = (): void => {
    const realIndex = getIndexFromProxy();
    const activeIndex = mod(Math.round(realIndex), totalItems);
    const activeSlideIndex = activeIndex % originalItems.length;
    items.forEach((item, index) => {
      const rotation = nearestDelta(index, realIndex, totalItems) * rotateStep;
      item.setAttribute('data-radial-slider-item-status', index === activeIndex ? 'active' : 'inview');
      setRotation[index](rotation);
    });
    updateActiveUI(activeSlideIndex);
  };

  // ── Auto-advance (timer) — avanza solo; pausa en hover y durante el arrastre. ──
  const AUTO_MS = 3000;
  const autoEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goNext = (): void => {
    gsap.killTweensOf(proxy);
    const targetIndex = Math.round(getIndexFromProxy()) + 1;
    gsap.to(proxy, { rotation: -targetIndex * rotateStep, duration: SLIDE_DURATION, ease: CLICK_EASE, onUpdate: render });
  };
  // El timer se guarda en el container → el re-init por resize puede limpiarlo (si no,
  // seguiría corriendo sobre un proxy muerto).
  const stopAuto = (): void => {
    if (container._radialSliderAuto) {
      clearInterval(container._radialSliderAuto);
      container._radialSliderAuto = null;
    }
  };
  const startAuto = (): void => {
    if (!autoEnabled || container._radialSliderAuto) return;
    container._radialSliderAuto = setInterval(goNext, AUTO_MS);
  };
  const resetAuto = (): void => {
    stopAuto();
    startAuto();
  };

  controls.forEach((btn) => {
    btn.removeAttribute('disabled');
    const value = btn.getAttribute('data-radial-slider-control') ?? '';

    if (value === 'next' || value === 'prev') {
      btn.onclick = () => {
        gsap.killTweensOf(proxy);
        const currentIndex = getIndexFromProxy();
        const targetIndex = Math.round(currentIndex) + (value === 'next' ? 1 : -1);
        gsap.to(proxy, {
          rotation: -targetIndex * rotateStep,
          duration: SLIDE_DURATION,
          ease: CLICK_EASE,
          onUpdate: render,
        });
        resetAuto();
      };
    }

    if (/^\d+$/.test(value)) {
      const targetSlideNumber = Math.max(0, Math.min(originalItems.length - 1, parseInt(value, 10) - 1));
      btn.onclick = () => {
        gsap.killTweensOf(proxy);
        const currentIndex = getIndexFromProxy();
        const delta = nearestDeltaToSlideNumber(targetSlideNumber, currentIndex);
        gsap.to(proxy, {
          rotation: -(currentIndex + delta) * rotateStep,
          duration: SLIDE_DURATION,
          ease: CLICK_EASE,
          onUpdate: render,
        });
        resetAuto();
      };
    }
  });

  container._radialSliderDraggable = Draggable.create(proxy, {
    type: 'rotation',
    trigger: [proxy, ...items],
    inertia: true,
    throwResistance: 2000,
    dragResistance: 0.05,
    maxDuration: 1,
    minDuration: 0.5,
    edgeResistance: 0.75,
    overshootTolerance: 0,
    snap: (value: number) => Math.round(value / rotateStep) * rotateStep,
    onDrag: render,
    onThrowUpdate: render,
    onThrowComplete: () => {
      container.setAttribute('data-radial-slider-drag-status', 'grab');
      render();
      startAuto();
    },
    onPress: () => {
      stopAuto();
      container.setAttribute('data-radial-slider-drag-status', 'grabbing');
    },
    onDragStart: () => container.setAttribute('data-radial-slider-drag-status', 'grabbing'),
    onRelease: () => {
      container.setAttribute('data-radial-slider-drag-status', 'grab');
      startAuto();
    },
  })[0];

  // Pausa en hover (puntero sobre las cards) y arranque del ciclo automático.
  collection.addEventListener('pointerenter', stopAuto);
  collection.addEventListener('pointerleave', startAuto);
  startAuto();

  render();
}

let resizeHandler: (() => void) | null = null;

export function initRadialSlider(): void {
  document
    .querySelectorAll<RadialContainer>('[data-radial-slider-init]')
    .forEach((container) => buildSlider(container));

  // Re-init solo cuando cambia el ANCHO (evita el jitter por barras de móvil en scroll).
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  let lastWidth = window.innerWidth;
  let timer: ReturnType<typeof setTimeout>;
  resizeHandler = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      initRadialSlider();
    }, 200);
  };
  window.addEventListener('resize', resizeHandler);
}
