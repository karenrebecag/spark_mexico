// Input de texto — estructura .aa-field > label + input + slot de error (patrón OSMO).

export interface FieldOptions {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
}

export interface FieldParts {
  field: HTMLElement;
  input: HTMLInputElement;
  error: HTMLElement;
}

export function renderField(opts: FieldOptions): FieldParts {
  const id = `aa-${opts.name}`;

  const field = document.createElement('div');
  field.className = 'aa-field';

  const label = document.createElement('label');
  label.className = 'aa-label';
  label.htmlFor = id;
  label.textContent = opts.label;

  const input = document.createElement('input');
  input.className = 'aa-input';
  input.id = id;
  input.name = opts.name;
  input.type = opts.type ?? 'text';
  if (opts.placeholder) input.placeholder = opts.placeholder;
  if (opts.required) input.required = true;
  if (opts.autocomplete) input.setAttribute('autocomplete', opts.autocomplete);

  const error = document.createElement('span');
  error.className = 'aa-error';

  field.append(label, input, error);
  return { field, input, error };
}
