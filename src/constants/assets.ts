// Assets externos (CDN R2 de Spark Summit). Recursos de marca/video reutilizados 1:1.

const CDN = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';

export const ASSETS = {
  logoDark:   `${CDN}/SparkWhte.webp`,
  logoLight:  `${CDN}/SparkGradient.webp`,
  bannerLogo: `${CDN}/aisummitmexico_4df4e18195e104e0c0de20f8fa34893cd5f1d29eadf7e9d0ed23f836f8dd48c9.webp`,
  heroVideo:   `${CDN}/mexico-city-aerial.mp4`,   // fondo del hero (loop muteado)
  meshBg:      `${CDN}/image-mesh-gradient%20(1).webp`,
  ctaBg:       `${CDN}/bogota-skyline-in-colombia-2026-03-26-06-09-24-utc.webp`,
  playerSrc:   `${CDN}/spark-summit-recap-2026-lite.mp4`,
  playerPoster:`${CDN}/image-mesh-gradient%20(1).webp`,
  // Vacío = el hero usa el <video> bg en vez de una escena Spline.
  splineScene: '',
};

// Runtime de Spline vía CDN (no npm). Se inyecta solo si hay una <spline-viewer> montada.
export const SPLINE_RUNTIME = 'https://unpkg.com/@splinetool/viewer@1.12.97/build/spline-viewer.js';
