// Waitlist — manifiesto (copy de contexto) + formulario de lista de espera.
// Inputs/checkbox/submit con el design language del newsletter de OSMO.
// Ancla destino del CTA del hero (#aa-waitlist).

import { renderSection, renderContainer } from '../ui/layout';
import { renderEyebrow, renderHeading, renderParagraph } from '../ui/text';
import { renderField } from '../ui/atoms/input';
import { renderCheckbox } from '../ui/atoms/checkbox';
import { renderButton } from '../ui/atoms/button';

const BODY: string[] = [
  'WhatsApp dejó de ser solo un canal de atención. Hoy es el punto donde los leads preguntan, comparan, deciden, compran o desaparecen.',
  'Por eso nace la primera formación para quienes quieren entender, diseñar y optimizar estrategias de WhatsApp Marketing con una mirada real de negocio: captación, automatización, IA, trazabilidad, conversión y ventas.',
  'La formación se lanza en julio y, en esta primera edición, estará disponible solo para quienes se registren en la lista de espera.',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(field: HTMLElement, error: HTMLElement | null, message: string): void {
  field.classList.add('has-error');
  if (error) error.textContent = message;
}

function clearError(field: HTMLElement, error: HTMLElement | null): void {
  field.classList.remove('has-error');
  if (error) error.textContent = '';
}

export function renderWaitlist(root: Element): void {
  // ── Manifiesto (copy de contexto) ──────────────────────────────────────────
  const intro = document.createElement('div');
  intro.className = 'aa-flex-col aa-text-center';
  intro.style.gap = 'var(--aa-gap-m)';
  intro.style.maxWidth = '44em';
  intro.style.marginInline = 'auto';
  intro.setAttribute('data-aa-fade', '');

  intro.appendChild(renderEyebrow('Lista de espera · Lanzamiento julio'));
  intro.appendChild(renderHeading({ size: 'l', text: 'Únete a la lista de espera', tag: 'h2', split: true }));
  BODY.forEach((text) =>
    intro.appendChild(renderParagraph({ size: 'l', text, className: 'aa-text-balance' })),
  );

  // ── Formulario ───────────────────────────────────────────────────────────────
  const form = document.createElement('form');
  form.className = 'aa-form';
  form.noValidate = true;
  form.setAttribute('data-aa-fade', '');
  form.setAttribute('data-aa-delay', '0.15');

  const nameParts = renderField({
    name: 'name',
    label: 'Nombre',
    placeholder: 'Tu nombre',
    required: true,
    autocomplete: 'given-name',
  });
  const emailParts = renderField({
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'tunombre@email.com',
    required: true,
    autocomplete: 'email',
  });

  const row = document.createElement('div');
  row.className = 'aa-form__row';
  row.append(nameParts.field, emailParts.field);

  const check = renderCheckbox({
    name: 'privacy',
    required: true,
    labelHtml: 'Acepto recibir información sobre la formación y la <a href="#" rel="noopener">política de privacidad</a>.',
  });

  const submitWrap = document.createElement('div');
  submitWrap.className = 'aa-form__submit';
  const submit = renderButton({ label: 'Únete a la lista de espera', variant: 'primary' });
  // renderButton sin href crea <button>; forzamos submit para enviar el form.
  if (submit instanceof HTMLButtonElement) submit.type = 'submit';
  submitWrap.appendChild(submit);

  const note = document.createElement('p');
  note.className = 'aa-form__note';
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');

  form.append(row, check.field, submitWrap, note);

  // ── Validación cliente ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    let ok = true;

    if (!nameParts.input.value.trim()) {
      setError(nameParts.field, nameParts.error, 'Ingresa tu nombre.');
      ok = false;
    } else clearError(nameParts.field, nameParts.error);

    if (!EMAIL_RE.test(emailParts.input.value.trim())) {
      setError(emailParts.field, emailParts.error, 'Ingresa un email válido.');
      ok = false;
    } else clearError(emailParts.field, emailParts.error);

    if (!check.input.checked) {
      check.field.classList.add('has-error');
      ok = false;
    } else check.field.classList.remove('has-error');

    return ok;
  };

  [nameParts.input, emailParts.input].forEach((el) =>
    el.addEventListener('input', () => clearError(el.closest('.aa-field') as HTMLElement, el.nextElementSibling as HTMLElement)),
  );
  check.input.addEventListener('change', () => check.field.classList.remove('has-error'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.className = 'aa-form__note';
    note.textContent = '';
    if (!validate()) {
      note.classList.add('is--error');
      note.textContent = 'Revisa los campos marcados.';
      return;
    }
    // TODO: conectar al endpoint real (Elementor admin-ajax / API) al integrar en WP.
    note.classList.add('is--success');
    note.textContent = '¡Listo! Te avisaremos antes del lanzamiento.';
    form.reset();
  });

  // ── Sección ───────────────────────────────────────────────────────────────
  const content = document.createElement('div');
  content.className = 'aa-flex-col';
  content.style.gap = 'var(--aa-gap-xl)';
  content.append(intro, form);

  const section = renderSection({
    theme: 'dark', // strip oscuro (contrasta con el hero claro)
    children: [renderContainer({ size: 'sm', children: [content] })],
  });
  section.id = 'aa-waitlist';

  root.appendChild(section);
}
