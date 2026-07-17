// Patrocinios (#patrocinios) — sección dedicada, complementaria a las franjas del marquee.
// Layout combinado de Relume: los tiers de patrocinio usan el grid de tarjetas de Logo 6
// (logo sobre superficie propia) y las marcas participantes la fila suelta de Logo 1. La
// jerarquía se lee por tres señales a la vez —tarjeta, nº de columnas y tamaño de logo—,
// sin necesidad de anunciar precios. Contenido pendiente: los tiers se montan con
// placeholders hasta que lleguen los logos (ver constants/sponsors.ts).

import { renderContainer } from '../ui/layout';
import { renderSectionHeader } from '../ui/section-header';
import { SPONSOR_TIERS, type SponsorTier } from '../constants/sponsors';

function renderSlot(): HTMLElement {
  const slot = document.createElement('div');
  slot.className = 'aa-sponsors__slot is--empty';
  slot.setAttribute('aria-hidden', 'true'); // hueco de maqueta: nada que anunciar todavía
  return slot;
}

function renderLogo(src: string, alt: string): HTMLElement {
  const slot = document.createElement('div');
  slot.className = 'aa-sponsors__slot';

  const img = document.createElement('img');
  img.className = 'aa-sponsors__logo';
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';

  slot.appendChild(img);
  return slot;
}

function renderTier(tier: SponsorTier): HTMLElement {
  const row = document.createElement('div');
  row.className = `aa-sponsors__tier aa-sponsors__tier--${tier.id} is--${tier.display}`;
  // Destino de los labels del marquee (ver SPONSOR_GROUPS.href): cada franja cae en su fila.
  row.id = `patrocinios-${tier.id}`;
  row.setAttribute('data-aa-fade', '');

  const label = document.createElement('h3');
  label.className = 'aa-sponsors__label';
  label.textContent = tier.label;

  const grid = document.createElement('div');
  grid.className = 'aa-sponsors__grid';

  if (tier.logos?.length) {
    tier.logos.forEach((logo) => grid.appendChild(renderLogo(logo.src, logo.alt)));
  } else {
    for (let i = 0; i < tier.slots; i++) grid.appendChild(renderSlot());
  }

  row.append(label, grid);
  return row;
}

export function renderSponsorsSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-section aa-sponsors';
  section.id = 'patrocinios';
  section.setAttribute('data-aa-section-theme', 'light');
  section.setAttribute('data-aa-nav-anchor', '');

  const header = renderSectionHeader({
    eyebrow: 'Patrocinios',
    heading: 'Las marcas que hacen posible Spark AI Summit',
    sub: 'Patrocinadores y marcas participantes de la edición de México.',
    align: 'center',
  });

  const tiers = document.createElement('div');
  tiers.className = 'aa-sponsors__tiers';
  SPONSOR_TIERS.forEach((tier) => tiers.appendChild(renderTier(tier)));

  // Tiers sin confirmar: se conservan en el DOM (oculto vía CSS: .aa-sponsors__tiers) y en
  // su lugar va un placeholder "Por Anunciar" hasta que lleguen niveles y logos reales.
  const reveal = document.createElement('div');
  reveal.className = 'aa-sponsors__reveal';
  reveal.setAttribute('data-aa-fade', '');
  reveal.textContent = 'Por Anunciar';

  const inner = document.createElement('div');
  inner.className = 'aa-sponsors__inner';
  inner.append(header, tiers, reveal);

  section.appendChild(renderContainer({ size: 'm', children: [inner] }));
  root.appendChild(section);
}
