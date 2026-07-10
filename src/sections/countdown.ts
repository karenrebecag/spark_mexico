// Countdown section — sección inferior al hero. Replica el ProgramaWrapper de Spark:
// overlap (margin negativo) sobre el hero + esquinas superiores redondeadas + theming
// light. Contenido: label + countdown en vivo + nota.

import { renderContainer } from '../ui/layout';
import { renderCountdown } from '../ui/countdown';
import { EVENT_DATE } from '../constants/event';

export function renderCountdownSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-countdown-section';
  section.id = 'registro'; // ancla del nav "Registro"
  section.setAttribute('data-aa-section-theme', 'dark');
  section.setAttribute('data-aa-nav-anchor', '');

  const inner = document.createElement('div');
  inner.className = 'aa-countdown-section__inner';
  inner.setAttribute('data-aa-fade', '');

  const label = document.createElement('p');
  label.className = 'aa-countdown-section__label';
  label.textContent = 'El evento comienza en:';

  const note = document.createElement('p');
  note.className = 'aa-countdown-section__note';
  note.textContent = 'No pierdas tu lugar en esta masterclass presencial.';

  inner.append(label, renderCountdown(EVENT_DATE), note);
  section.appendChild(renderContainer({ size: 'm', children: [inner] }));
  root.appendChild(section);
}
