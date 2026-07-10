// 8 · Beneficios — header normal (eyebrow + heading + sub) seguido del efecto MWG 087:
// tira horizontal de cards pinneada que se traslada con el scroll (scrub) y cada card
// recibe una inercia según la velocidad del scroll. Init en benefits-scroll.ts.

import { renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { renderModuleCard, type ModuleCardData } from '../ui/atoms/module-card';

const CARDS: ModuleCardData[] = [
  {
    tag: 'Expertos',
    title: 'Aprende de quienes operan',
    desc: 'Conocimiento directo del equipo de Blue Makers, que opera los mercados todos los días.',
  },
  {
    variant: 'accent',
    tag: 'Acción',
    title: 'Estrategias accionables',
    desc: 'Sales con pasos concretos para aplicar desde el día uno, no solo teoría.',
  },
  {
    variant: 'gradient',
    tag: 'Capital',
    title: 'Protege tu dinero',
    desc: 'Entiende cómo blindar tu capital frente a la inflación y el sistema financiero.',
  },
  {
    variant: 'light',
    tag: 'Networking',
    title: 'Conecta en persona',
    desc: 'Rodéate de inversionistas y personas que buscan hacer crecer su capital.',
  },
  {
    tag: 'Extras',
    title: 'Material y merchandising',
    desc: 'Te llevas material de apoyo y merchandising exclusivo del evento.',
  },
];

export function renderBenefitsSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-benefits';
  section.id = 'beneficios';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  // Header (pill + heading + sub) — va dentro del container pinneado, encima de las cards,
  // así el pin lo fija junto con ellas mientras la tira se desplaza.
  // Sin highlight → renderSectionHeader activa split:true (text-appear con SplitText).
  // El gradiente de acento y el split son excluyentes (el split rompe el clip del gradiente).
  const header = renderSectionHeader({
    eyebrow: 'Beneficios',
    heading: 'Por qué asistir',
    sub: 'Lo que te llevas de esta masterclass, en cinco claves. Desplázate para explorarlas.',
  });

  // Container pinneado (MWG 087): header fijo + tira de cards que lo recorre en X.
  const container = document.createElement('div');
  container.className = 'aa-benefits__container';

  const cards = document.createElement('div');
  cards.className = 'aa-benefits__cards';
  // Slot estable (trigger/geometría) + cara hija (.aa-mod-card) que recibe la inercia.
  CARDS.forEach((card) => {
    const slot = document.createElement('div');
    slot.className = 'aa-benefits__card';
    slot.appendChild(renderModuleCard(card));
    cards.appendChild(slot);
  });

  container.append(
    renderContainer({ size: 'default', className: 'aa-benefits__head', children: [header] }),
    cards,
  );
  section.appendChild(container);
  root.appendChild(section);
}
