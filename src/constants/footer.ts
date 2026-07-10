// Footer de Spark AI Summit México — redes oficiales y línea legal. Contenido de marca Spark.

export interface FooterSocial {
  label: string;
  href: string;
  icon: string; // inner SVG markup
  fill: boolean;
}

export const FOOTER_SOCIALS: FooterSocial[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/sparkaisummit/', fill: false, icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sparkaisummit/', fill: true, icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>' },
];

export const FOOTER_LEGAL = 'Spark AI Summit México 2026. Todos los derechos reservados.';
