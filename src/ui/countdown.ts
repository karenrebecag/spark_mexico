// Countdown — 4 cajas (días/horas/minutos/segundos) que tickean en vivo hacia una
// fecha objetivo. Trasladado del Countdown de Spark; estilizado con tokens --aa-*.

interface Unit {
  key: 'days' | 'hours' | 'minutes' | 'seconds';
  label: string;
}

const UNITS: Unit[] = [
  { key: 'days', label: 'días' },
  { key: 'hours', label: 'horas' },
  { key: 'minutes', label: 'minutos' },
  { key: 'seconds', label: 'segundos' },
];

const pad = (n: number): string => String(Math.max(0, n)).padStart(2, '0');

export function renderCountdown(target: Date): HTMLElement {
  const el = document.createElement('div');
  el.className = 'aa-countdown';
  el.setAttribute('data-odometer-group', ''); // los números ruedan al entrar en viewport

  const nums = {} as Record<Unit['key'], HTMLElement>;
  UNITS.forEach((u) => {
    const unit = document.createElement('div');
    unit.className = 'aa-countdown__unit';

    const num = document.createElement('span');
    num.className = 'aa-countdown__num';
    num.setAttribute('data-odometer-element', '');
    num.setAttribute('data-odometer-duration', '1.4');
    num.textContent = '00';

    const label = document.createElement('span');
    label.className = 'aa-countdown__label';
    label.textContent = u.label;

    unit.append(num, label);
    el.appendChild(unit);
    nums[u.key] = num;
  });

  // No pisar el roll del odómetro: mientras hay rollers (animación de entrada en curso),
  // se omite el update; al limpiarse (sin rollers), el tick retoma el valor en vivo.
  const setNum = (node: HTMLElement, value: string): void => {
    if (node.querySelector('[data-odometer-part="roller"]')) return;
    if (node.textContent !== value) node.textContent = value;
  };

  function tick(): void {
    const totalSec = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    setNum(nums.days, pad(Math.floor(totalSec / 86400)));
    setNum(nums.hours, pad(Math.floor((totalSec % 86400) / 3600)));
    setNum(nums.minutes, pad(Math.floor((totalSec % 3600) / 60)));
    setNum(nums.seconds, pad(totalSec % 60));
    if (totalSec === 0) window.clearInterval(id);
  }

  tick();
  const id = window.setInterval(tick, 1000);
  return el;
}
