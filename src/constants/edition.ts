// Edición 2025 — fotos reales del evento + stats. Las stats alimentan el odometer.

const CDN = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';

// Set completo (14 fotos) — usado por el marquee de credibilidad en #problema ("¿para
// quién es"). NO reemplazar por otro set sin revisar ese uso también.
export const EDITION_PHOTOS: string[] = [
  `${CDN}/DSC04447.webp`,
  `${CDN}/DSC04460.webp`,
  `${CDN}/DSC04477.webp`,
  `${CDN}/DSC04496.webp`,
  `${CDN}/DSC04502.webp`,
  `${CDN}/DSC04507.webp`,
  `${CDN}/DSC04513.webp`,
  `${CDN}/DSC04514.webp`,
  `${CDN}/DSC04515.webp`,
  `${CDN}/DSC04519.webp`,
  `${CDN}/DSC04524.webp`,
  `${CDN}/DSC04535.webp`,
  `${CDN}/DSC04552.webp`,
  `${CDN}/DSC04556.webp`,
];

// Fotos reales del drift gallery en #ediciones-anteriores. Re-subidas a R2 (ya no
// dependen de URLs firmadas de LinkedIn que expiraban).
export const EDITION_GALLERY_PHOTOS: string[] = [
  `${CDN}/DSC02609-reduced.webp`,
  `${CDN}/DSC02618-reduced.webp`,
  `${CDN}/DSC02621-reduced.webp`,
  `${CDN}/DSC02633-reduced.webp`,
  `${CDN}/DSC02653-reduced.webp`,
  `${CDN}/DSC02665-reduced.webp`,
  `${CDN}/DSC02713-reduced.webp`,
  `${CDN}/DSC02747-reduced.webp`,
  `${CDN}/DSC02749-reduced.webp`,
  `${CDN}/DSC02787-reduced.webp`,
  `${CDN}/DSC02835-reduced.webp`,
  `${CDN}/DSC02931-reduced.webp`,
  `${CDN}/DSC02942-reduced.webp`,
  `${CDN}/DSC02968-reduced.webp`,
];

interface EditionStat {
  number: string;
  label: string;
}

export const EDITION_STATS: EditionStat[] = [
  { number: '+80', label: 'eventos' },
  { number: '+6000', label: 'asistentes' },
  { number: '+500', label: 'empresas' },
];
