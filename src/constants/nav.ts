// Navegación — labels + anclas. Las secciones destino se irán creando por fase;
// el indicador del navbar se activa solo cuando el ancla existe en el DOM.

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Para quién', href: '#problema' },
  { label: 'Ediciones anteriores', href: '#ediciones-anteriores' },
  { label: 'Speakers', href: '#speakers-b' },
  { label: 'Patrocinios', href: '#patrocinios' },
  { label: 'FAQ', href: '#faq' },
];

// Todos los CTAs de la LP llevan al embed de Lu.ma en #contacto (el form atfx está oculto).
export const NAV_CTA = {
  label: 'Reservar lugar',
  href: '#contacto',
};
