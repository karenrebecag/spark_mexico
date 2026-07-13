// Navegación — labels + anclas. Las secciones destino se irán creando por fase;
// el indicador del navbar se activa solo cuando el ancla existe en el DOM.

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Para quién', href: '#problema' },
  { label: 'Ediciones anteriores', href: '#ediciones-anteriores' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Patrocinios', href: '#patrocinios' },
  { label: 'FAQ', href: '#faq' },
];

export const NAV_CTA = {
  label: 'Reservar lugar',
  href: '#registro',
};
