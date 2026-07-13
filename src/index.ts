// Entry point. Cada punto de montaje declara su configuración por atributos:
//   <div data-aa-mount
//        data-aa-theme="light|dark"
//        data-aa-lang="es|en"></div>
//
//   <script data-cfasync="false"
//     src="https://cdn.jsdelivr.net/gh/karenrebecag/spark_mexico@latest/loader.js"></script>
const _v = document.querySelector<HTMLScriptElement>('script[src*="spark_mexico@"]')?.src.match(/spark_mexico@([^/]+)/)?.[1] ?? 'dev';
console.log(`[spark-mexico-lp] v${_v} loaded`);

import { type Theme, type Lang } from './core/types';
import { initMotion } from './ui/motion';
import { renderNavbar, initNavbar } from './ui/navbar';
import { renderTopbar, initTopbar } from './ui/topbar';
import { renderScrollProgress, initScrollProgress } from './ui/scroll-progress';
import { initSpline } from './ui/spline';
import { initParallax } from './ui/parallax';
import { initDirectionalHover } from './ui/directional-hover';
import { renderHero } from './sections/hero';
import { renderSponsorMarquee, initSponsorMarquee } from './ui/sponsor-marquee';
// import { renderFormSection, initAtfxForm } from './sections/form'; // form OCULTO temporalmente
import { renderProblemSection } from './sections/problem';
// import { renderProblemVariantSection } from './sections/problem-b'; // variante B OCULTA temporalmente (Relume 609)
import { renderEditionSection } from './sections/edition';
import { initDriftGallery } from './ui/drift-gallery'; // MWG 094 — galería de #edicion-2025
// import { renderSpeakersSection } from './sections/speakers'; // strip A (marquee) OCULTA temporalmente
import { renderSpeakersVariantSection } from './sections/speakers-b'; // variante B — flick slider (elegida)
import { initFlickCards } from './ui/flick-cards';
import { renderSponsorsSection } from './sections/sponsors'; // #patrocinios — tiers (placeholders)
import { renderFaqSection } from './sections/faq';
import { renderFooterSection } from './sections/footer';
import { initAccordion } from './ui/accordion';
import { initPillarSlider } from './ui/pillar-slider';
import { initRotatingText } from './ui/rotating-text';
import { initScrollHighlight } from './ui/scroll-highlight';
import { initMomentumHover } from './ui/momentum-hover';
import { initButton004 } from './ui/button004';
import { initNumberOdometer } from './ui/odometer';
import { initMediaPlayer } from './ui/media-player';
import { renderRadialSection } from './sections/radial';
import { renderContactSection } from './sections/contact';
// import { initAtfxForm } from './sections/form'; // widget del form OCULTO (contacto usa placeholder)
import { renderCtaBanner, initCtaMarquee } from './sections/cta-banner';
// import { renderSeparator } from './sections/separator'; // separador OCULTO temporalmente
import { initRadialSlider } from './ui/radial-slider';
import { initGlobe } from './ui/globe';
import { renderColumnWipe, playColumnWipeIntro } from './ui/column-wipe';

// Scroll suave para anclas internas (#id) sin tocar CSS global de Elementor.
function initAnchorScroll(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    const target = root.querySelector(`#${CSS.escape(id)}`);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function resolveTheme(raw: string | undefined): Theme {
  return raw === 'dark' ? 'dark' : 'light';
}

function resolveLang(raw: string | undefined): Lang {
  return raw === 'en' ? 'en' : 'es';
}

function boot(): void {
  const mounts = document.querySelectorAll<HTMLElement>('[data-aa-mount]');
  mounts.forEach((mount) => {
    const theme = resolveTheme(mount.dataset.aaTheme);
    const lang = resolveLang(mount.dataset.aaLang);

    // Root wrapper — todo el CSS está scopeado a .aa-landing
    const root = document.createElement('div');
    root.className = 'aa-landing';
    root.setAttribute('data-aa-theme', theme);
    root.setAttribute('data-aa-lang', lang);

    // Navbar (fixed) + cada sección como módulo, recibiendo `root` como contenedor.
    renderTopbar(root); // barra fija superior (botón de registro permanente)
    renderScrollProgress(root);
    renderNavbar(root);
    renderHero(root);
    root.appendChild(renderSponsorMarquee('mobile-only', [0])); // Patrocinadores — mobile, tras hero
    // renderFormSection(root); // strip del form OCULTA temporalmente (la curva/overlap pasó al radial)
    renderRadialSection(root); // primera strip tras el hero — lleva la curva + overlap
    root.appendChild(renderSponsorMarquee('desktop-only', [0])); // Patrocinadores — desktop, sobre contacto
    renderContactSection(root); // intro contacto (heading + subheading; form pendiente)
    root.appendChild(renderSponsorMarquee('desktop-only', [1])); // Marcas aliadas — desktop, bajo contacto
    root.appendChild(renderSponsorMarquee('mobile-only', [1])); // Marcas aliadas — mobile, bajo contacto
    // renderSeparator(root); // banda parallax OCULTA temporalmente (se usará después)
    renderProblemSection(root);
    // renderProblemVariantSection(root); // variante B OCULTA temporalmente
    renderEditionSection(root);
    // renderSpeakersSection(root); // strip A (marquee) OCULTA temporalmente (ganó la variante B)
    renderSpeakersVariantSection(root); // #speakers-b — flick slider (variante elegida)
    renderSponsorsSection(root); // #patrocinios — tiers, complementa las franjas del marquee
    renderFaqSection(root);
    renderCtaBanner(root); // #bottom — banner final (imagen + marquee + cards + CTA)
    renderFooterSection(root);

    // Overlay de intro (último hijo → queda arriba por z-index). Se retira al montar.
    renderColumnWipe(root);

    mount.replaceChildren(root);
    initAnchorScroll(root);
    // Reveal del wipe en paralelo con playIntro (dentro de initMotion): el hero anima
    // oculto bajo el overlay, sin flash al despejar las columnas.
    playColumnWipeIntro(root);
    initMotion(root);
    initDriftGallery(root); // pin + drift horizontal de la galería de #edicion-2025
    initNavbar(root);
    initTopbar(root);
    initSponsorMarquee(root);
    initCtaMarquee(root);
    initScrollProgress(root);
    initSpline();
    initParallax(root);
    initDirectionalHover(root);
    initAccordion(root);
    initPillarSlider(root);
    initRotatingText(root);
    initScrollHighlight(root);
    initMomentumHover(root);
    initButton004(root);
    initNumberOdometer();
    initMediaPlayer(root);
    initRadialSlider();
    initFlickCards(root); // slider de la variante B de speakers (mide offsetWidth → tras montar)
    initGlobe();
    // initAtfxForm(); // widget del form OCULTO — contacto usa un placeholder por ahora
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
