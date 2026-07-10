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

// ⚠️ URLs firmadas de media.licdn.com (feedshare-image) — expiran el 30 de julio de 2026
// (parámetro `e=` de la query string). Pasada esa fecha estas 5 URLs devuelven 403/404.
// Hay que re-subirlas a un bucket propio (R2, como el resto de assets del proyecto) antes
// de esa fecha. Usadas solo por la galería de #edicion-2025 (no por #problema).
export const EDITION_LINKEDIN_PHOTOS: string[] = [
  'https://media.licdn.com/dms/image/v2/D4D22AQGbkbLgitfbtQ/feedshare-image-high-res/B4DZ8FJOSCGYAU-/0/1782497733319?e=1785369600&v=beta&t=rmttXVf8cbYp1DygLUGEHsPZ8QqLCyc3ytRlwIq6To0',
  'https://media.licdn.com/dms/image/v2/D4D22AQFU-Ds3KNrojA/feedshare-image-high-res/B4DZ8FJN2pI4Ac-/0/1782497730772?e=1785369600&v=beta&t=1sfhHmrcgJ3xKsRyhGRN3KnBw5pXx2uAEX504sFDcHY',
  'https://media.licdn.com/dms/image/v2/D4D22AQGlb0lqVW72ZA/feedshare-image-high-res/B4DZ8FJOpSGkAU-/0/1782497733965?e=1785369600&v=beta&t=r7Zfd9_XzrdFciDTGRs4j0Ezv4NJqTyTPZmwxc16MKc',
  'https://media.licdn.com/dms/image/v2/D4D22AQGXi72QMkJl-g/feedshare-image-high-res/B4DZ8FJOfuIYAY-/0/1782497733322?e=1785369600&v=beta&t=knPeq0sPiAmkcVx8TpT-L-N0sohSwNfyVdI598P1OTQ',
  'https://media.licdn.com/dms/image/v2/D4D22AQGfSdONDQ-LVQ/feedshare-shrink_1280/B4DZ8FJODQJAAM-/0/1782497732031?e=1785369600&v=beta&t=-FrhivScJnIjacuXPD-SMpmXCnVoMInBnwGnCvcQXVQ',
];

interface EditionStat {
  number: string;
  label: string;
}

export const EDITION_STATS: EditionStat[] = [
  { number: '+80', label: 'eventos' },
  { number: '+5000', label: 'asistentes' },
  { number: '+500', label: 'empresas' },
];
