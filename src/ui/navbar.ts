// Navbar simple — logo de Spark a la izquierda y un CTA a la derecha, en space-between.
// Fijo bajo el topbar, fondo transparente. El logo cambia de versión según el tema de la
// sección detrás: white sobre dark, gradiente sobre light (initNavbar detecta la sección
// bajo la barra y setea data-nav-theme).

import { renderButton036 } from './atoms/button036';
import { NAV_CTA, NAV_LINKS } from '../constants/nav';
import { ASSETS } from '../constants/assets';

function logo(name: string, darkSrc: string, whiteSrc: string, modifier: string): HTMLElement {
  const wrap = document.createElement('span');
  wrap.className = `aa-nav__logo ${modifier}`;

  const dark = document.createElement('img');
  dark.className = 'aa-nav__logo-img aa-nav__logo-img--dark';
  dark.src = darkSrc;
  dark.alt = name;

  const white = document.createElement('img');
  white.className = 'aa-nav__logo-img aa-nav__logo-img--white';
  white.src = whiteSrc;
  white.alt = '';
  white.setAttribute('aria-hidden', 'true');

  wrap.append(dark, white);
  return wrap;
}

function renderNavLinks(): HTMLElement {
  const links = document.createElement('div');
  links.className = 'aa-nav__links';
  NAV_LINKS.forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.className = 'aa-nav__link';
    a.href = href;
    a.textContent = label;
    links.appendChild(a);
  });
  return links;
}

export function renderNavbar(root: Element): void {
  const nav = document.createElement('nav');
  nav.className = 'aa-nav';
  nav.setAttribute('aria-label', 'Principal');
  nav.setAttribute('data-nav-theme', 'dark'); // el hero arranca dark

  const logos = document.createElement('div');
  logos.className = 'aa-nav__logos';

  // dark slot = gradiente (sobre light) · white slot = blanco (sobre dark)
  logos.append(
    logo('Spark AI Summit México', ASSETS.logoLight, ASSETS.logoDark, 'aa-nav__logo--spark'),
  );

  const cta = document.createElement('div');
  cta.className = 'aa-nav__cta';
  cta.appendChild(renderButton036({ href: NAV_CTA.href, label: NAV_CTA.label, size: 'sm' }));

  // Cluster derecho: pill de links (glass) + CTA, agrupados con gap (logos quedan solos
  // a la izquierda — layout de referencia: marca aislada, resto agrupado a la derecha).
  const right = document.createElement('div');
  right.className = 'aa-nav__right';
  right.append(renderNavLinks(), cta);

  nav.append(logos, right);
  root.appendChild(nav);
}

export function initNavbar(root: Element): void {
  const nav = root.querySelector<HTMLElement>('.aa-nav');
  if (!nav) return;
  const topbar = document.querySelector<HTMLElement>('[data-aa-topbar]');

  let raf = 0;
  let lastY = window.scrollY;

  const update = (): void => {
    raf = 0;

    // Tema según la sección detrás. Probe bajo el topbar (referencia fija, no depende del
    // transform del nav al ocultarse); los logos son pointer-events:none → el hit-test pasa.
    const topbarBottom = topbar ? topbar.getBoundingClientRect().bottom : 0;
    // Probe al centro: capta las cards centradas con tema propio (FAQ navy) además de
    // los strips full-width. closest() sube hasta el ancestro con data-aa-section-theme.
    const el = document.elementFromPoint(window.innerWidth / 2, topbarBottom + 18);
    const section = el?.closest<HTMLElement>('[data-aa-section-theme]');
    nav.setAttribute('data-nav-theme', section?.getAttribute('data-aa-section-theme') ?? 'light');

    // Hide on scroll down (y no-top) · show en top y scroll up.
    const y = window.scrollY;
    if (y <= 4) nav.classList.remove('aa-nav--hidden');
    else if (y > lastY + 2 && y > 80) nav.classList.add('aa-nav--hidden');
    else if (y < lastY - 2) nav.classList.remove('aa-nav--hidden');
    lastY = y;
  };
  const onScroll = (): void => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  requestAnimationFrame(update);
}
