// Logos de patrocinadores + marcas aliadas (portados de SparkSummit2026 — posible
// mismatch de mercado, ver nota en el PR). De las 15 rutas originales solo Opres (R2,
// absoluta) carga en este entorno; el resto son rutas relativas al host de WP donde se
// embebe la LP (mismo patrón que las fotos 5-14 de constants/speakers.ts) y aún no
// resuelven aquí. Mientras se confirman los demás assets, se repite el logo que sí sirve.

export interface SponsorLogo {
  src: string;
  alt: string;
}
export interface SponsorGroup {
  label: string;
  logos: SponsorLogo[];
}

const R2 = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';
const OPRES: SponsorLogo = { src: `${R2}/Opres_Logo_Sestylin_Verde0%20(1).webp`, alt: 'Opres' };

export const SPONSOR_GROUPS: SponsorGroup[] = [
  { label: 'Patrocinadores', logos: Array(8).fill(OPRES) },
  { label: 'Marcas aliadas', logos: Array(8).fill(OPRES) },
];
