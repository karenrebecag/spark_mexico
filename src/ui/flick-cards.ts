// Flick Cards Slider (Osmo Vault "Flick Cards") — baraja de cards apiladas que se abren en
// abanico y se arrastran. Portado del snippet original a GSAP centralizado (Draggable ya
// registrado en gsap-env; NO se carga el <script> externo de jsDelivr) y a clases .aa-*.
// Aquí las cards son speakers (foto + nombre + rol/empresa). Requiere >= 7 cards para
// habilitar el drag (con menos, quedan posicionadas pero estáticas).

import { gsap, Draggable, SplitText, STAGGER } from './gsap-env';
import { renderPill } from './atoms/pill';

export interface FlickCard {
  image: string;
  name: string;
  role: string;
  company: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function cardEl(c: FlickCard): HTMLElement {
  const item = document.createElement('div');
  item.className = 'aa-flick__item';
  item.setAttribute('data-aa-flick-item', '');
  item.setAttribute('data-aa-flick-status', '');

  const card = document.createElement('div');
  card.className = 'aa-flick-card';

  const before = document.createElement('div');
  before.className = 'aa-flick-card__before';

  const media = document.createElement('div');
  media.className = 'aa-flick-card__media';

  const avatar = document.createElement('div');
  avatar.className = 'aa-flick-card__avatar';
  avatar.textContent = initials(c.name); // fallback si la foto no carga

  const img = document.createElement('img');
  img.className = 'aa-flick-card__img';
  img.alt = c.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  // Sin foto (card "por anunciar"): revela las iniciales de una vez — un src vacío no
  // dispara `error` de forma fiable. Con foto, el fallback queda en el listener.
  if (c.image) {
    img.src = c.image;
    img.addEventListener('error', () => img.classList.add('is--broken'));
  } else {
    img.classList.add('is--broken');
  }
  avatar.appendChild(img);

  const scrim = document.createElement('div');
  scrim.className = 'aa-flick-card__scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const info = document.createElement('div');
  info.className = 'aa-flick-card__info';
  const company = renderPill(c.company); // chip de empresa (.aa-pill)
  company.classList.add('aa-flick-card__company');
  const name = document.createElement('h3');
  name.className = 'aa-flick-card__name';
  name.textContent = c.name;
  const role = document.createElement('span');
  role.className = 'aa-flick-card__role';
  role.textContent = c.role;
  // Orden = jerarquía visual (empresa eyebrow → nombre → rol); el cascade del split baja igual.
  info.append(company, name, role);

  media.append(avatar, scrim, info);
  card.append(before, media);
  item.appendChild(card);
  return item;
}

export function renderFlickCards(cards: FlickCard[]): HTMLElement {
  const group = document.createElement('div');
  group.className = 'aa-flick';
  group.setAttribute('data-aa-flick-init', '');

  // Spacer invisible: da el alto del grupo (ancho * ratio); la colección va absoluta encima.
  const spacer = document.createElement('div');
  spacer.className = 'aa-flick__spacer';
  spacer.setAttribute('aria-hidden', 'true');
  const spacerBefore = document.createElement('div');
  spacerBefore.className = 'aa-flick__spacer-before';
  spacer.appendChild(spacerBefore);

  const collection = document.createElement('div');
  collection.className = 'aa-flick__collection';
  const list = document.createElement('div');
  list.className = 'aa-flick__list';
  list.setAttribute('data-aa-flick-list', '');
  cards.forEach((c) => list.appendChild(cardEl(c)));
  collection.appendChild(list);

  group.append(spacer, collection);
  return group;
}

// ── Motor del slider (lógica del snippet, con gsap/Draggable del proyecto) ──────────
interface Cfg { x: number; y: number; rot: number; s: number; o: number; z: number }

function getConfig(i: number, currentIndex: number, total: number): Cfg {
  let diff = i - currentIndex;
  if (diff > total / 2) diff -= total;
  else if (diff < -total / 2) diff += total;

  switch (diff) {
    case 0: return { x: 0, y: 0, rot: 0, s: 1, o: 1, z: 5 };
    case 1: return { x: 25, y: 1, rot: 10, s: 0.9, o: 1, z: 4 };
    case -1: return { x: -25, y: 1, rot: -10, s: 0.9, o: 1, z: 4 };
    case 2: return { x: 45, y: 5, rot: 15, s: 0.8, o: 1, z: 3 };
    case -2: return { x: -45, y: 5, rot: -15, s: 0.8, o: 1, z: 3 };
    default: {
      const dir = diff > 0 ? 1 : -1;
      return { x: 55 * dir, y: 5, rot: 20 * dir, s: 0.6, o: 0, z: 2 };
    }
  }
}

// Draggable.pointerEvent puede ser Pointer/Mouse (clientX/Y directos) o Touch (coords en
// touches/changedTouches). Normaliza a {x, y}.
function coords(e: PointerEvent | TouchEvent | MouseEvent): { x: number; y: number } {
  if ('clientX' in e) return { x: e.clientX, y: e.clientY };
  const t = e.touches[0] ?? e.changedTouches[0];
  return { x: t?.clientX ?? 0, y: t?.clientY ?? 0 };
}

function statusFor(x: number): string {
  if (x === 0) return 'active';
  if (x === 25) return '2-after';
  if (x === -25) return '2-before';
  if (x === 45) return '3-after';
  if (x === -45) return '3-before';
  return 'hidden';
}

export function initFlickCards(scope: Element): void {
  scope.querySelectorAll<HTMLElement>('[data-aa-flick-init]').forEach((slider) => {
    const list = slider.querySelector<HTMLElement>('[data-aa-flick-list]');
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-aa-flick-item]'));
    const total = cards.length;
    let activeIndex = 0;

    const sliderWidth = slider.offsetWidth;
    const threshold = 0.1;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // SplitText montado sobre el texto de la card activa: en cada rotación se re-parte
    // (nombre + rol + empresa) y las words entran escalonadas. Solo una card activa a la
    // vez → un único split vivo; se revierte antes de crear el siguiente (sin fugas de DOM).
    let activeSplit: SplitText | null = null;
    const revealActiveText = (index: number): void => {
      const card = cards[index];
      if (!card) return;
      // El chip de empresa (.aa-pill) se anima como unidad (no se parte, rompería el chip);
      // nombre y rol sí van con SplitText (words escalonadas).
      const pill = card.querySelector<HTMLElement>('.aa-flick-card__company');
      const splitTargets = [
        card.querySelector<HTMLElement>('.aa-flick-card__name'),
        card.querySelector<HTMLElement>('.aa-flick-card__role'),
      ].filter((el): el is HTMLElement => el !== null);

      if (activeSplit) { activeSplit.revert(); activeSplit = null; }
      if (reduce) return;

      const tl = gsap.timeline();
      if (pill) tl.from(pill, { y: '0.6em', autoAlpha: 0, duration: 0.5, ease: 'osmo' }, 0);
      if (splitTargets.length) {
        activeSplit = new SplitText(splitTargets, {
          type: 'lines,words',
          mask: 'lines',
          linesClass: 'aa-flick-card__line',
        });
        tl.from(activeSplit.words, {
          yPercent: 110,
          rotate: 6,
          autoAlpha: 0,
          transformOrigin: 'bottom left',
          duration: 0.55,
          ease: 'osmo',
          stagger: STAGGER,
        }, 0.08);
      }
    };

    const renderCards = (currentIndex: number): void => {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex, total);
        card.setAttribute('data-aa-flick-status', statusFor(cfg.x));
        card.style.zIndex = String(cfg.z);
        gsap.to(card, {
          duration: 0.6,
          ease: 'elastic.out(1.2, 1)',
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
          opacity: cfg.o,
        });
      });
      revealActiveText(currentIndex);
    };

    renderCards(activeIndex);

    // ── Autoplay: avanza solo hacia adelante; pausa en hover/drag y reanuda al salir. ──
    const AUTOPLAY_MS = 1500;
    let timer: ReturnType<typeof setInterval> | null = null;
    const advance = (): void => {
      activeIndex = (activeIndex + 1) % total;
      renderCards(activeIndex);
    };
    const stopAuto = (): void => {
      if (timer !== null) { clearInterval(timer); timer = null; }
    };
    const startAuto = (): void => {
      if (reduce || total < 2 || timer !== null) return;
      timer = setInterval(advance, AUTOPLAY_MS);
    };
    slider.addEventListener('pointerenter', stopAuto);
    slider.addEventListener('pointerleave', startAuto);
    startAuto();

    if (total < 7) return; // sin drag: quedan posicionadas pero rotan solas (autoplay)

    // Un dragger transparente por card (recibe el gesto); se generan tras posicionar.
    const draggers = cards.map((card) => {
      const d = document.createElement('div');
      d.setAttribute('data-aa-flick-dragger', '');
      card.appendChild(d);
      return d;
    });

    slider.setAttribute('data-aa-flick-drag', 'grab');

    let pressX = 0;
    let pressY = 0;

    Draggable.create(draggers, {
      type: 'x',
      edgeResistance: 0.8,
      bounds: { minX: -sliderWidth / 2, maxX: sliderWidth / 2 },
      inertia: false,

      onPress(this: Draggable) {
        stopAuto();
        const p = coords(this.pointerEvent);
        pressX = p.x;
        pressY = p.y;
        slider.setAttribute('data-aa-flick-drag', 'grabbing');
      },

      onDrag(this: Draggable) {
        const rawProgress = this.x / sliderWidth;
        const progress = Math.min(1, Math.abs(rawProgress));
        const direction = rawProgress > 0 ? -1 : 1;
        const nextIndex = (activeIndex + direction + total) % total;

        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex, total);
          const to = getConfig(i, nextIndex, total);
          const mix = (prop: keyof Cfg): number => from[prop] + (to[prop] - from[prop]) * progress;
          gsap.set(card, {
            xPercent: mix('x'),
            yPercent: mix('y'),
            rotation: mix('rot'),
            scale: mix('s'),
            opacity: mix('o'),
          });
        });
      },

      onRelease(this: Draggable) {
        slider.setAttribute('data-aa-flick-drag', 'grab');

        const r = coords(this.pointerEvent);
        const releaseX = r.x;
        const releaseY = r.y;
        const dragDistance = Math.hypot(releaseX - pressX, releaseY - pressY);

        const raw = this.x / sliderWidth;
        let shift = 0;
        if (raw > threshold) shift = -1;
        else if (raw < -threshold) shift = 1;

        if (shift !== 0) {
          activeIndex = (activeIndex + shift + total) % total;
          renderCards(activeIndex);
        }

        gsap.to(this.target, { x: 0, duration: 0.3, ease: 'power1.out' });
        startAuto(); // reanuda el autoplay tras soltar

        // Tap (sin arrastre real): deja pasar el click al elemento debajo del dragger.
        if (dragDistance < 4) {
          const target = this.target as HTMLElement;
          target.style.pointerEvents = 'none';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(releaseX, releaseY);
              el?.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
              target.style.pointerEvents = 'auto';
            });
          });
        }
      },
    });
  });
}
