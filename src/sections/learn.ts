// 5 · Contenido / Qué aprenderás — layout "info" portado de ATOM (statement con
// heading rotativo en bloque a la izquierda + lista de filas título/descripción a la
// derecha). Items derivados de los temas reales del brief. Strip light.

import { renderContainer } from '../ui/layout';
import { renderParagraph } from '../ui/text';
import { renderRotatingHeading } from '../ui/rotating-text';
import { renderPill } from '../ui/atoms/pill';

interface LearnItem {
  title: string;
  desc: string;
}

const LEARN_ITEMS: LearnItem[] = [
  {
    title: 'Plazo fijo vs. inflación',
    desc: 'Compara el rendimiento del plazo fijo frente a la inflación y descubre si tu dinero realmente gana o pierde valor.',
  },
  {
    title: 'El costo de no hacer nada',
    desc: 'Entiende cómo tus ingresos y ahorros pierden poder adquisitivo con el paso del tiempo.',
  },
  {
    title: 'Qué hace el banco con tu dinero',
    desc: 'Conoce cómo trabaja un banco con tus depósitos y los pros y contras de dejarlo ahí.',
  },
  {
    title: 'Invertir por tu cuenta',
    desc: 'Aprende si conviene invertir desde el banco o hacerlo tú mismo, y cómo dar el primer paso.',
  },
  {
    title: 'Oportunidades y estrategias',
    desc: 'Explora alternativas de inversión y estrategias para hacer crecer tu capital con criterio.',
  },
  {
    title: 'Nuestro fondo de inversión',
    desc: 'Conoce el fondo de inversión de Blue Makers y cómo funciona por dentro.',
  },
];

export function renderLearnSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-section aa-learn';
  section.id = 'aprenderas';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  // Columna izquierda: eyebrow + heading rotativo (bloque) + sub
  const head = document.createElement('div');
  head.className = 'aa-info__head';

  const pill = renderPill('Contenido');
  pill.setAttribute('data-aa-fade', '');

  const heading = renderRotatingHeading({
    size: 'l',
    tag: 'h2',
    block: true,
    before: 'Qué aprenderás',
    words: ['a leer la inflación', 'a proteger tu capital', 'a invertir con criterio', 'a decidir con estrategia'],
    className: 'aa-info__title',
  });

  const sub = renderParagraph({
    size: 'l',
    text: 'Esto es lo que te llevarás de la masterclass.',
    className: 'aa-info__sub',
  });
  sub.setAttribute('data-aa-fade', '');

  head.append(pill, heading, sub);

  // Columna derecha: lista de items título/descripción
  const list = document.createElement('ul');
  list.className = 'aa-info__list';
  LEARN_ITEMS.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'aa-info__li';
    li.setAttribute('data-aa-fade', '');

    const title = document.createElement('h3');
    title.className = 'aa-info__li-title aa-h-m';
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'aa-info__li-desc';
    desc.textContent = item.desc;

    li.append(title, desc);
    list.appendChild(li);
  });

  const grid = document.createElement('div');
  grid.className = 'aa-info__large-col';
  grid.append(head, list);

  const wrap = document.createElement('div');
  wrap.className = 'aa-info__wrap';
  wrap.appendChild(grid);

  section.appendChild(renderContainer({ size: 'default', children: [wrap] }));
  root.appendChild(section);
}
