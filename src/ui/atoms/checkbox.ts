// Checkbox — caja visual custom (input oculto + box + icono), accent al marcar.
// Replica el patrón radiocheck de OSMO. labelHtml permite enlaces (ej. política).

const CHECK_ICON =
  '<svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

export interface CheckboxOptions {
  name: string;
  labelHtml: string;
  required?: boolean;
}

export interface CheckboxParts {
  field: HTMLElement;
  input: HTMLInputElement;
}

export function renderCheckbox(opts: CheckboxOptions): CheckboxParts {
  const field = document.createElement('div');
  field.className = 'aa-field';

  const label = document.createElement('label');
  label.className = 'aa-check';

  const input = document.createElement('input');
  input.className = 'aa-check__input';
  input.type = 'checkbox';
  input.name = opts.name;
  if (opts.required) input.required = true;

  // input + box deben ser hermanos adyacentes (selector :checked + .aa-check__box)
  const box = document.createElement('span');
  box.className = 'aa-check__box';
  const icon = document.createElement('span');
  icon.className = 'aa-check__icon';
  icon.innerHTML = CHECK_ICON;
  box.appendChild(icon);

  const text = document.createElement('span');
  text.className = 'aa-check__label';
  text.innerHTML = opts.labelHtml;

  label.append(input, box, text);
  field.appendChild(label);
  return { field, input };
}
