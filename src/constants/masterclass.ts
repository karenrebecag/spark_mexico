// Fotos de la Masterclass (sección "Sobre el evento"). Copiadas a public/masterclass/.
// BASE es relativa para el preview local (dev server sirve desde la raíz). En
// producción (jsDelivr/R2) cambiar BASE por la URL del CDN.

const BASE = 'https://pub-62c41549a44642efbcd3f775bdb039b3.r2.dev';

// 001–008, 010–026 (la 009 no existe en el set original)
const FILES = [
  '001', '002', '003', '004', '005', '006', '007', '008',
  '010', '011', '012', '013', '014', '015', '016', '017',
  '018', '019', '020', '021', '022', '023', '024', '025', '026',
];

export const MASTERCLASS_PHOTOS: string[] = FILES.map((n) => `${BASE}/foto_${n}.webp`);
