// Sección "AI enfocada en marketing y ventas" (ValueProp de Spark) sobre el Radial
// Cards Slider. Strip light, un step más oscuro en el cluster claro. Header (eyebrow +
// heading + sub) + radial con FeatureCards. Contenido de las pillars de Spark (placeholder).

import { renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderRadialSlider } from '../ui/radial-slider';
import { renderFeatureCard, type FeatureCardData } from '../ui/atoms/feature-card';

// Backgrounds sólidos del trío de marca (navy / coral / snow) — coherencia visual:
// sin gradientes ni imágenes que rompan la unidad.
const CARDS: FeatureCardData[] = [
  {
    variant: 'dark',
    tags: ['WhatsApp', 'Demo en vivo'],
    title: 'Interactúa',
    text: 'Interacciones en vivo desde tu propio celular: un AI Agent inicia, sostiene y cierra conversaciones dentro de WhatsApp en tiempo real, no en slides.',
  },
  {
    variant: 'accent',
    tags: ['Journey completo', 'Sin fricción'],
    title: 'Convierte',
    text: 'El journey completo del cliente sin fricción: del primer contacto a la conversión, con recuperación automática de leads que parecían perdidos.',
  },
  {
    variant: 'light',
    tags: ['Chat · Voz · Imagen', 'Multimodal'],
    title: 'Adáptate',
    text: 'Multimodalidad aplicada: chat, voz e imagen trabajando juntos según el contexto del cliente. El AI Agent responde en el canal que el cliente prefiere.',
  },
];

export function renderRadialSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-radial-section';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const header = renderSectionHeader({
    eyebrow: 'AI enfocada en marketing y ventas',
    heading: 'IA que convierte conversaciones en clientes',
    highlight: 'convierte',
    sub: 'Spark AI Summit México es el evento clave en LATAM para líderes que quieren transformar la forma en que conectan con sus prospectos y clientes.',
  });

  // Dos presentaciones de las mismas cards: rueda (desktop) y columna (<768px). Ambas
  // viven en el DOM y el switch lo hace CSS — así el cambio de breakpoint no re-renderiza.
  // Las instancias no se pueden compartir: un nodo solo existe en un punto del DOM.
  const stack = document.createElement('div');
  stack.className = 'aa-radial-section__stack';
  CARDS.forEach((c) => stack.appendChild(renderFeatureCard(c)));

  section.append(
    renderContainer({ size: 'default', className: 'aa-radial-section__head', children: [header] }),
    renderRadialSlider(CARDS.map((c) => renderFeatureCard(c))),
    renderContainer({ size: 'default', children: [stack] }),
  );
  root.appendChild(section);
}
