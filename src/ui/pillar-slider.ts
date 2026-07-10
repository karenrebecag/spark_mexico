// PillarSlider — slider rotario draggable (GSAP Draggable + InertiaPlugin). Port fiel
// del PillarSlider de Spark: las cards se apilan al centro y rotan según la posición
// del proxy (efecto carrusel/arco), con auto-advance y snap. Estados active/inview.

import { gsap, Draggable } from './gsap-env';

const ROTATE_STEP = 20;
const SLIDE_DURATION = 1.5;
const AUTO_INTERVAL = 4000;

export function renderPillarSlider(cards: HTMLElement[]): HTMLElement {
  const root = document.createElement('div');
  root.className = 'aa-pslider';

  const viewport = document.createElement('div');
  viewport.className = 'aa-pslider__viewport';

  const collection = document.createElement('div');
  collection.className = 'aa-pslider__collection';
  collection.setAttribute('data-pslider-collection', '');

  const track = document.createElement('div');
  track.className = 'aa-pslider__track';
  track.setAttribute('data-pslider-track', '');

  cards.forEach((card) => {
    const item = document.createElement('div');
    item.className = 'aa-pslider__item';
    item.appendChild(card);
    track.appendChild(item);
  });

  collection.appendChild(track);
  viewport.appendChild(collection);
  root.appendChild(viewport);
  return root;
}

const mod = (v: number, m: number): number => ((v % m) + m) % m;

function initOne(slider: HTMLElement): () => void {
  const collection = slider.querySelector<HTMLElement>('[data-pslider-collection]');
  const track = slider.querySelector<HTMLElement>('[data-pslider-track]');
  const items = track ? (Array.from(track.querySelectorAll<HTMLElement>(':scope > .aa-pslider__item')) ) : [];
  if (!collection || !track || !items.length) return () => {};

  const n = items.length;
  const spvRaw = parseFloat(getComputedStyle(collection).getPropertyValue('--slider-spv'));
  const spv = isNaN(spvRaw) ? 3 : Math.max(1, Math.min(spvRaw, n));
  const visCount = Math.ceil(spv);

  gsap.set(items, { clearProps: 'position,top,left,transform,rotate' });
  const rect = items[0].getBoundingClientRect();
  const itemH = rect.height;
  const slideW = rect.width;

  track.style.position = 'relative';
  track.style.height = `${itemH}px`;
  items.forEach((el) => gsap.set(el, { xPercent: -50, position: 'absolute', top: 0, left: '50%' }));

  const setRot = items.map((el) => gsap.quickSetter(el, 'rotate', 'deg'));
  const proxy = document.createElement('div');
  gsap.set(proxy, { x: 0 });

  const idxFromProxy = (): number => -Number(gsap.getProperty(proxy, 'x')) / slideW;
  const nearestDelta = (i: number, idxReal: number, len: number): number => {
    const k = Math.round((idxReal - i) / len);
    return i - (idxReal - k * len);
  };

  function setStatuses(idxReal: number): void {
    const idxMod = mod(Math.round(idxReal), n);
    const leftCount = Math.floor((visCount - 1) / 2);
    const rightCount = visCount - 1 - leftCount;
    items.forEach((el) => el.setAttribute('data-status', 'not-active'));
    items[idxMod].setAttribute('data-status', 'active');
    for (let k = 1; k <= rightCount; k++) items[mod(idxMod + k, n)].setAttribute('data-status', 'inview');
    for (let k = 1; k <= leftCount; k++) items[mod(idxMod - k, n)].setAttribute('data-status', 'inview');
  }

  function render(): void {
    const idxReal = idxFromProxy();
    for (let i = 0; i < n; i++) setRot[i](nearestDelta(i, idxReal, n) * ROTATE_STEP);
    setStatuses(idxReal);
  }

  const draggable = Draggable.create(proxy, {
    type: 'x',
    trigger: collection,
    inertia: true,
    maxDuration: 1,
    minDuration: 0.5,
    dragResistance: 0.025,
    throwResistance: 2000,
    edgeResistance: 0,
    snap: (v: number) => Math.round(v / slideW) * slideW,
    onDrag: render,
    onThrowUpdate: render,
    onThrowComplete: render,
    onPress: () => collection.setAttribute('data-drag', 'grabbing'),
    onDragStart: () => collection.setAttribute('data-drag', 'grabbing'),
    onRelease: () => collection.setAttribute('data-drag', 'grab'),
  })[0];

  render();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoTimer = 0;
  if (!reduce) {
    autoTimer = window.setInterval(() => {
      if (draggable.isDragging || draggable.isThrowing) return;
      const nextX = Number(gsap.getProperty(proxy, 'x')) - slideW;
      gsap.to(proxy, {
        x: Math.round(nextX / slideW) * slideW,
        duration: SLIDE_DURATION,
        ease: 'power3.inOut',
        onUpdate: render,
        onComplete: render,
      });
    }, AUTO_INTERVAL);
  }

  return () => {
    if (autoTimer) clearInterval(autoTimer);
    draggable.kill();
    proxy.remove();
    gsap.set(items, { clearProps: 'all' });
    track.style.height = '';
    track.style.position = '';
  };
}

export function initPillarSlider(root: Element): void {
  Array.from(root.querySelectorAll<HTMLElement>('.aa-pslider')).forEach((slider) => {
    let cleanup = initOne(slider);
    let prevW = window.innerWidth;
    let timer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth !== prevW) {
          prevW = window.innerWidth;
          cleanup();
          cleanup = initOne(slider);
        }
      }, 200);
    });
  });
}
