// 10 · Footer de Spark AI Summit México — logo + redes + línea legal. Strip dark.

import { renderContainer } from '../ui/layout';
import { FOOTER_SOCIALS, FOOTER_LEGAL } from '../constants/footer';
import { ASSETS } from '../constants/assets';

function renderSocialLink({ label, href, icon, fill }: { label: string; href: string; icon: string; fill: boolean }): HTMLAnchorElement {
  const a = document.createElement('a');
  a.className = 'aa-footer__social';
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', label);
  a.innerHTML = `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="${fill ? 0 : 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
  return a;
}

export function renderFooterSection(root: Element): void {
  const section = document.createElement('section');
  section.className = 'aa-section aa-footer aa-topo'; // aa-topo: textura topográfica sobre el navy
  section.id = 'footer';
  section.setAttribute('data-aa-section-theme', 'dark');
  section.setAttribute('data-aa-nav-anchor', '');

  // Logo de Spark — footer dark → versión white.
  const top = document.createElement('div');
  top.className = 'aa-footer__top';

  const logos = document.createElement('div');
  logos.className = 'aa-footer__logos';

  const sparkLink = document.createElement('a');
  sparkLink.href = '#top';
  sparkLink.setAttribute('aria-label', 'Spark AI Summit México');
  const spark = document.createElement('img');
  spark.className = 'aa-footer__logo aa-footer__logo--spark';
  spark.src = ASSETS.logoDark;
  spark.alt = 'Spark AI Summit México';
  spark.loading = 'lazy';
  sparkLink.appendChild(spark);

  logos.appendChild(sparkLink);

  // Redes oficiales de Spark, alineadas a la derecha del logo (space-between).
  const socials = document.createElement('div');
  socials.className = 'aa-footer__socials';
  FOOTER_SOCIALS.forEach((s) => socials.appendChild(renderSocialLink(s)));

  top.append(logos, socials);

  // Línea legal
  const legal = document.createElement('div');
  legal.className = 'aa-footer__legal';
  const legalText = document.createElement('p');
  legalText.textContent = FOOTER_LEGAL;
  legal.appendChild(legalText);

  const inner = document.createElement('div');
  inner.className = 'aa-footer__inner';
  inner.append(top, legal);

  section.appendChild(renderContainer({ children: [inner] }));
  root.appendChild(section);
}
