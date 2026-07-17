// Sección de registro — intro (heading + subheading) + embed de Lu.ma (plataforma oficial
// de inscripción del evento). Destino de todos los CTAs "Reservar mi lugar" (#contacto).
// Deliberadamente MUY espaciada y minimalista: baja la carga cognitiva, mucho aire vertical.

import { renderHeading, renderParagraph } from '../ui/text';
import { renderPill } from '../ui/atoms/pill';

// Embed "simple" del evento en Lu.ma (card de registro compacta). Ver iframe original del brief.
const LUMA_EMBED = 'https://luma.com/embed/event/evt-JdsdhnKGS92S1vt/simple';

export function renderContactSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-contact';
  section.id = 'contacto';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const intro = document.createElement('div');
  intro.className = 'aa-contact__intro';

  const eyebrow = renderPill('Registro · Cupos limitados');

  // Heading + subheading en un wrapper row (lado a lado), alineados a la izquierda.
  const headRow = document.createElement('div');
  headRow.className = 'aa-contact__head-row';
  headRow.append(
    renderHeading({
      size: 'l',
      tag: 'h2',
      text: 'Asegura tu lugar.',
      highlight: 'tu lugar.',
      className: 'aa-text-balance',
    }),
    renderParagraph({
      size: 'l',
      text: 'Regístrate en Spark AI Summit México. El acceso es por aprobación con correo corporativo y recibirás la confirmación por correo.',
      mark: 'acceso es por aprobación',
      className: 'aa-contact__sub',
    }),
  );

  intro.append(eyebrow, headRow);

  // Embed de Lu.ma: card de registro oficial del evento. El iframe se sirve desde luma.com
  // (permitido; no es un asset del bundle). Alto fijo del embed "simple"; ancho fluido.
  const mount = document.createElement('div');
  mount.className = 'aa-contact__form aa-contact__luma';

  const frame = document.createElement('iframe');
  frame.className = 'aa-contact__luma-frame';
  frame.src = LUMA_EMBED;
  frame.title = 'Registro · Spark AI Summit México';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allow', 'fullscreen; payment');
  frame.setAttribute('loading', 'lazy');
  mount.appendChild(frame);

  // Separador horizontal centrado (no full-width) que marca la transición radial → contacto.
  const rule = document.createElement('div');
  rule.className = 'aa-contact__rule';
  rule.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'aa-contact__inner';
  inner.append(intro, mount);

  // Sin renderContainer: la strip es full-width y el ancho del contenido se simula con
  // padding lateral (--aa-aud-edge-pad), misma estrategia que #problema (¿es para ti?)
  // → ancho uniforme entre ambas secciones. Ver contact.css.
  section.append(rule, inner);
  root.appendChild(section);
}
