// MediaPlayer 16:9 — port del reproductor del HeroStrip de Spark. Poster + botón play;
// el click reproduce con sonido y expone los controles nativos. Fuente mp4 (sin HLS).
// Pausa automática al salir del viewport para no reproducir fuera de vista.

export function renderMediaPlayer(src: string, poster: string): HTMLElement {
  const figure = document.createElement('figure');
  figure.className = 'aa-mediaplayer';

  const video = document.createElement('video');
  video.className = 'aa-mediaplayer__video';
  video.src = src;
  video.poster = poster;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');

  const scrim = document.createElement('span');
  scrim.className = 'aa-mediaplayer__scrim';

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'aa-mediaplayer__play';
  play.setAttribute('aria-label', 'Reproducir video');
  play.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  figure.append(video, scrim, play);
  return figure;
}

export function initMediaPlayer(root: Element): void {
  root.querySelectorAll<HTMLElement>('.aa-mediaplayer').forEach((figure) => {
    const video = figure.querySelector<HTMLVideoElement>('.aa-mediaplayer__video');
    const play = figure.querySelector<HTMLButtonElement>('.aa-mediaplayer__play');
    if (!video || !play) return;

    play.addEventListener('click', () => {
      video.controls = true;
      video.play().catch(() => {});
      figure.classList.add('is-playing'); // oculta scrim + botón vía CSS
    });

    // Pausa cuando el reproductor sale de vista (equivale al IO del MediaPlayer de Spark).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(figure);
  });
}
