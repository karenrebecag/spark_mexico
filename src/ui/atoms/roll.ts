// Roll — dos copias del label apiladas verticalmente (patrón letter-roll de Spark:
// en hover ambas suben translateY(-100%), una sale y la otra entra). Hover en CSS.

export function renderRoll(label: string): HTMLElement {
  const roll = document.createElement('span');
  roll.className = 'aa-roll';
  for (let i = 0; i < 2; i++) {
    const item = document.createElement('span');
    item.className = 'aa-roll__item';
    item.textContent = label;
    if (i > 0) item.setAttribute('aria-hidden', 'true');
    roll.appendChild(item);
  }
  return roll;
}
