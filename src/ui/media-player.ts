// MediaPlayer 16:9 — port del reproductor del HeroStrip de Spark. Arranca solo, muteado
// y en loop al entrar al viewport; el sonido queda tras un botón explícito (los navegadores
// solo permiten autoplay sin sonido, y el arranque con volumen sorprendía al visitante).
// Fuente mp4 (sin HLS). Pausa automática al salir del viewport.

const SOUND_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

export function renderMediaPlayer(src: string, poster: string): HTMLElement {
  const figure = document.createElement('figure');
  figure.className = 'aa-mediaplayer';

  const video = document.createElement('video');
  video.className = 'aa-mediaplayer__video';
  video.src = src;
  video.poster = poster;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  // Atributos además de las props: en un <video> creado por JS el autoplay muteado de
  // Safari/iOS depende del atributo presente en el elemento, no solo de la prop.
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');

  const scrim = document.createElement('span');
  scrim.className = 'aa-mediaplayer__scrim';

  const sound = document.createElement('button');
  sound.type = 'button';
  sound.className = 'aa-mediaplayer__sound';
  sound.setAttribute('aria-label', 'Activar sonido del video');
  sound.innerHTML = `${SOUND_ICON}<span class="aa-mediaplayer__sound-label">Activar sonido</span>`;

  figure.append(video, scrim, sound);
  return figure;
}

export function initMediaPlayer(root: Element): void {
  root.querySelectorAll<HTMLElement>('.aa-mediaplayer').forEach((figure) => {
    const video = figure.querySelector<HTMLVideoElement>('.aa-mediaplayer__video');
    const sound = figure.querySelector<HTMLButtonElement>('.aa-mediaplayer__sound');
    if (!video || !sound) return;

    // El scrim solo cubre el poster: se despeja en cuanto hay imagen en movimiento.
    video.addEventListener('playing', () => figure.classList.add('is-playing'), { once: true });

    sound.addEventListener('click', () => {
      video.muted = false;
      video.removeAttribute('muted');
      video.controls = true; // el usuario ya interactuó: entrega el control del volumen
      figure.classList.add('is-unmuted'); // oculta el botón vía CSS
      void video.play().catch(() => {});
    });

    // Autoplay muteado al entrar en vista y pausa al salir (equivale al IO de Spark). Con
    // preload=metadata el buffering solo arranca al llamar play(), de ahí la llamada directa.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(figure);
  });
}
