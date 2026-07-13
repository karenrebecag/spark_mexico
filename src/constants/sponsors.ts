// Logos de patrocinadores + marcas aliadas (portados de SparkSummit2026 — posible
// mismatch de mercado, ver nota en el PR). De las 15 rutas originales solo Opres (R2,
// absoluta) carga en este entorno; el resto son rutas relativas al host de WP donde se
// embebe la LP (mismo patrón que las fotos 5-14 de constants/speakers.ts) y aún no
// resuelven aquí. Mientras se confirman los demás assets, se repite el logo que sí sirve.

export interface SponsorLogo {
  src: string;
  alt: string;
}
// `href` ancla el label del marquee a su fila en #patrocinios: la franja hace de teaser y
// la sección queda como única fuente de verdad de quién está en qué nivel.
export interface SponsorGroup {
  label: string;
  href: string;
  logos: SponsorLogo[];
}

const R2 = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';
const OPRES: SponsorLogo = { src: `${R2}/Opres_Logo_Sestylin_Verde0%20(1).webp`, alt: 'Opres' };

export const SPONSOR_GROUPS: SponsorGroup[] = [
  { label: 'Patrocinadores', href: '#patrocinios', logos: Array(8).fill(OPRES) },
  // "Marcas participantes" (no "aliadas"): el label es un CTA a su fila de la sección y el
  // destino tiene que llamarse igual que el link, o el salto se siente roto.
  { label: 'Marcas participantes', href: '#patrocinios-participantes', logos: Array(8).fill(OPRES) },
];

// ── Sección de patrocinios por tier (#patrocinios) ────────────────────────────────
// PENDIENTE DE CONTENIDO: los niveles, las marcas de cada nivel y los archivos de logo
// están sin confirmar. `slots` reserva la maqueta con huecos; cuando lleguen los assets
// se llena `logos` (mismo shape que el marquee) y la sección los pinta en su lugar.

// `display` decide el tratamiento visual del tier (ver sponsors.css): 'card' pone cada
// logo en una tarjeta sobre superficie (patrón Relume Logo 6) — los tiers de patrocinio;
// 'plain' los deja sueltos en una fila (patrón Relume Logo 1) — las marcas participantes,
// que deben leerse como contexto y no competir con quien sí patrocina.

export interface SponsorTier {
  id: string;
  label: string;
  slots: number;
  display: 'card' | 'plain';
  logos?: SponsorLogo[];
}

export const SPONSOR_TIERS: SponsorTier[] = [
  { id: 'diamante', label: 'Diamante', slots: 2, display: 'card' },
  { id: 'oro', label: 'Oro', slots: 3, display: 'card' },
  { id: 'plata', label: 'Plata', slots: 4, display: 'card' },
  { id: 'participantes', label: 'Marcas participantes', slots: 8, display: 'plain' },
];
