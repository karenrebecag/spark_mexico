// Navegación — labels + anclas. Las secciones destino se irán creando por fase;
// el indicador del navbar se activa solo cuando el ancla existe en el DOM.

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Para quién', href: '#problema' },
  { label: 'Edición 2025', href: '#edicion-2025' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'FAQ', href: '#faq' },
];

export const NAV_CTA = {
  label: 'Reservar lugar',
  href: '#registro',
};
