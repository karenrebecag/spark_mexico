// Hero (banner) — replica del HeroStrip de SparkSummit: grid 2-col (1fr / 1.4fr),
// video bg + overlay detrás. Izq: pill + logo + sede + CTA. Der: MediaPlayer 16:9.
// Layout/spacing referenciados de Spark + Relume Header3; tokens --aa-*.

import { renderPill } from '../ui/atoms/pill';
import { renderButton036 } from '../ui/atoms/button036';
import { renderMediaPlayer } from '../ui/media-player';
import { ASSETS } from '../constants/assets';

export function renderHero(root: Element): void {
  const hero = document.createElement('section');
  hero.className = 'aa-hero';
  hero.id = 'top';
  hero.setAttribute('data-aa-section-theme', 'dark'); // strip oscuro sobre el video
  hero.setAttribute('data-aa-nav-anchor', '');
  hero.setAttribute('data-aa-intro', ''); // sus hijos [data-aa-fade] animan al montar
  // Parallax de fondo: el video (target) se desplaza más lento que el scroll. Rango
  // sutil (±12) y desactivado en mobile para evitar jank. Ver ui/parallax.ts.
  hero.setAttribute('data-parallax', 'trigger');
  hero.setAttribute('data-parallax-start', '12');
  hero.setAttribute('data-parallax-end', '-12');
  hero.setAttribute('data-parallax-disable', 'mobile');

  // Fondo: video loop muteado (recurso de Spark) + overlay degradado.
  const bg = document.createElement('div');
  bg.className = 'aa-hero__bg';

  const video = document.createElement('video');
  video.className = 'aa-hero__video';
  video.setAttribute('data-parallax', 'target');
  video.src = ASSETS.heroVideo;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('aria-hidden', 'true');

  // Autoplay muteado robusto: en un <video> creado por JS el atributo `autoplay` a veces
  // no dispara. Llamar play() directamente arranca el buffering y la reproducción (con
  // preload=metadata, `canplay` no dispararía porque no se bufferiza hasta que hay play()).
  // Respaldo en loadedmetadata (sí dispara con preload=metadata); rechazo silenciado.
  const tryPlay = () => { void video.play().catch(() => {}); };
  tryPlay();
  video.addEventListener('loadedmetadata', tryPlay, { once: true });

  const overlay = document.createElement('div');
  overlay.className = 'aa-hero__overlay';
  bg.append(video, overlay);

  const grid = document.createElement('div');
  grid.className = 'aa-hero__grid';

  // ── Columna izquierda ──────────────────────────────────────────────────────
  const left = document.createElement('div');
  left.className = 'aa-hero__left';
  left.setAttribute('data-hero-left', '');

  const tag = renderPill('Próximamente · México');
  tag.classList.add('aa-hero__tag');
  tag.setAttribute('data-aa-fade', '');
  left.appendChild(tag);

  // H1 oculto para SEO — el logo cumple de titular visual.
  const h1 = document.createElement('h1');
  h1.className = 'aa-sr-only';
  h1.textContent = 'Spark AI Summit México';
  left.appendChild(h1);

  const logo = document.createElement('img');
  logo.className = 'aa-hero__logo';
  logo.src = ASSETS.bannerLogo;
  logo.alt = 'Spark AI Summit';
  logo.width = 220;
  logo.height = 80;
  logo.setAttribute('data-aa-fade', '');
  left.appendChild(logo);

  const where = document.createElement('p');
  where.className = 'aa-hero__where';
  where.setAttribute('data-aa-fade', '');
  where.textContent = 'Sede por confirmar · Ciudad de México';
  left.appendChild(where);

  const cta = document.createElement('div');
  cta.className = 'aa-hero__cta';
  cta.setAttribute('data-aa-fade', '');
  cta.appendChild(renderButton036({ href: '#contacto', label: 'Reservar mi lugar' }));
  left.appendChild(cta);

  // ── Columna derecha — MediaPlayer ──────────────────────────────────────────
  const right = document.createElement('div');
  right.className = 'aa-hero__right';
  right.setAttribute('data-hero-right', '');
  right.setAttribute('data-aa-fade', '');
  right.appendChild(renderMediaPlayer(ASSETS.playerSrc, ASSETS.playerPoster));

  grid.append(left, right);
  hero.append(bg, grid);
  root.appendChild(hero);
}
