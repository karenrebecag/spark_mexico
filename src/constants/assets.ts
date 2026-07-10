// Assets externos (CDN R2 de Spark Summit). Recursos de marca/video reutilizados 1:1.

const CDN = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';

export const ASSETS = {
  logoDark:   `${CDN}/SparkWhte.webp`,
  logoLight:  `${CDN}/SparkGradient.webp`,
  bannerLogo: `${CDN}/SparkWCityWhite.webp`,
  heroVideo:   `${CDN}/mexico-city-aerial.mp4`,   // fondo del hero (loop muteado)
  meshBg:      `${CDN}/image-mesh-gradient%20(1).webp`,
  ctaBg:       `${CDN}/bogota-skyline-in-colombia-2026-03-26-06-09-24-utc.webp`,
  playerSrc:   `${CDN}/ES_ADS_1920x1080_Spark-Junio-2026_Awareness_Generico_04_05_26%20(2).mp4`,
  playerPoster:`${CDN}/image-mesh-gradient%20(1).webp`,
  // Vacío = el hero usa el <video> bg en vez de una escena Spline.
  splineScene: '',
};

// Runtime de Spline vía CDN (no npm). Se inyecta solo si hay una <spline-viewer> montada.
export const SPLINE_RUNTIME = 'https://unpkg.com/@splinetool/viewer@1.12.97/build/spline-viewer.js';
