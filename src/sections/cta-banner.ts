// CTA Banner (#bottom) — port del CtaBannerStrip de Spark bajo el DS: bg image + overlay
// navy (parallax, técnica del separador) + pill + marquee de palabras con sparkle +
// heading + 3 glass cards + CTA. Todo con tokens --aa-* (sin hardcodear).

import { renderPill } from '../ui/atoms/pill';
import { renderButton036 } from '../ui/atoms/button036';
import { renderHeading } from '../ui/text';
import { gsap } from '../ui/gsap-env';
import { fillTrack } from '../ui/fill-track';

// Ángel de la Independencia (CDMX), servido desde el R2 de Spark (estable, sin expiración).
const CTA_BG =
  'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev/golden-angel-atop-monument-in-mexico-city-2026-03-25-08-37-12-utc_04c669b1ffca46305134ac62f1c3076e2a6bd78bee006c5fa6f7f282f117cf98.webp';

const SPARKLE =
  '<svg class="aa-cta__spark" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true">' +
  '<path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z"/></svg>';

const MARQUEE_WORDS = ['Conecta', 'Aprende', 'Crece'];

interface CtaCard {
  title: string;
  text: string;
}
const CARDS: CtaCard[] = [
  {
    title: 'Demos en vivo en tu celular',
    text: 'Interactúa en tiempo real con un AI Agent dentro de WhatsApp. No una presentación: una experiencia que puedes tocar.',
  },
  {
    title: 'Casos reales por industria',
    text: 'Automotriz, financiero y educación: cómo empresas resuelven problemas concretos con AI Agents, con números, no con frameworks.',
  },
  {
    title: 'Conversaciones ejecutivas',
    text: 'Líderes de Ventas, Marketing, CX y Transformación Digital. Acceso por aprobación para mantener el nivel de la conversación.',
  },
];

function wordItem(word: string): HTMLElement {
  const span = document.createElement('span');
  span.className = 'aa-cta__word';
  span.textContent = word;
  const spark = document.createElement('span');
  spark.className = 'aa-cta__spark-wrap';
  spark.setAttribute('aria-hidden', 'true');
  spark.innerHTML = SPARKLE;
  span.appendChild(spark);
  return span;
}

function ctaCard(c: CtaCard): HTMLElement {
  const card = document.createElement('div');
  card.className = 'aa-cta__card';
  const h = document.createElement('h3');
  h.className = 'aa-cta__card-h';
  h.textContent = c.title;
  const p = document.createElement('p');
  p.className = 'aa-cta__card-p';
  p.setAttribute('data-aa-fade', '');
  p.textContent = c.text;
  card.append(h, p);
  return card;
}

export function renderCtaBanner(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-cta';
  section.id = 'bottom';
  section.setAttribute('data-aa-section-theme', 'dark');
  section.setAttribute('data-aa-nav-anchor', '');
  // Parallax de la imagen de fondo (mismo contrato que hero/separador).
  section.setAttribute('data-parallax', 'trigger');
  section.setAttribute('data-parallax-start', '12');
  section.setAttribute('data-parallax-end', '-12');
  section.setAttribute('data-parallax-disable', 'mobile');

  // Fondo: imagen (target del parallax, sobredimensionada) + overlay navy diagonal.
  const bg = document.createElement('div');
  bg.className = 'aa-cta__bg';
  bg.setAttribute('aria-hidden', 'true');
  const media = document.createElement('div');
  media.className = 'aa-cta__media';
  media.setAttribute('data-parallax', 'target');
  media.style.backgroundImage = `url('${CTA_BG}')`;
  const overlay = document.createElement('div');
  overlay.className = 'aa-cta__overlay';
  bg.append(media, overlay);

  // Contenido.
  const inner = document.createElement('div');
  inner.className = 'aa-cta__inner';

  const pill = renderPill('29 de Octubre 2026 · Ciudad de México');
  pill.setAttribute('data-aa-fade', '');

  // Track relleno vía JS + loop a velocidad constante (initCtaMarquee) — la duración fija
  // del renderMarquee genérico daba ritmo desigual/gaps con solo 3 palabras cortas.
  const marquee = document.createElement('div');
  marquee.className = 'aa-cta__marquee';
  marquee.setAttribute('data-aa-cta-marquee', '');
  const track = document.createElement('div');
  track.className = 'aa-cta__marquee-track';
  MARQUEE_WORDS.forEach((w) => track.appendChild(wordItem(w)));
  marquee.appendChild(track);

  const heading = renderHeading({
    size: 'xl',
    tag: 'h2',
    text: 'Un solo día para ver cómo los AI Agents ya están cambiando la forma en que las empresas crecen.',
    split: true,
    className: 'aa-cta__heading aa-text-balance',
  });

  const cards = document.createElement('div');
  cards.className = 'aa-cta__cards';
  CARDS.forEach((c) => cards.appendChild(ctaCard(c)));

  const action = document.createElement('div');
  action.className = 'aa-cta__action';
  action.setAttribute('data-aa-fade', '');
  action.appendChild(renderButton036({ href: '#contacto', label: 'Reservar mi lugar' }));

  inner.append(pill, marquee, heading, cards, action);
  section.append(bg, inner);
  root.appendChild(section);
}

const SPEED = 40; // px/s — mismo criterio que el topbar (constante, no duración fija)

export function initCtaMarquee(scope: Element): void {
  const track = scope.querySelector<HTMLElement>('[data-aa-cta-marquee] .aa-cta__marquee-track');
  if (!track) return;

  const distance = fillTrack(track);
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  gsap.to(track, { x: -distance, ease: 'none', duration: distance / SPEED, repeat: -1 });
}
