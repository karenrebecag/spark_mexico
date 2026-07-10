// Parallax — port del sistema de Portfolio2026: un [data-parallax="trigger"] mueve su
// [data-parallax="target"] en yPercent/xPercent scrubbeado al scroll. Configurable por
// data-attrs y por breakpoint (matchMedia). Respeta prefers-reduced-motion.

import { gsap, ScrollTrigger } from './gsap-env';

export function initParallax(scope: Element): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mm = gsap.matchMedia();
  mm.add(
    {
      isMobile: '(max-width:479px)',
      isMobileLandscape: '(max-width:767px)',
      isTablet: '(max-width:991px)',
      isDesktop: '(min-width:992px)',
    },
    (context) => {
      const c = (context.conditions ?? {}) as Record<string, boolean>;
      const ctx = gsap.context(() => {
        scope.querySelectorAll<HTMLElement>('[data-parallax="trigger"]').forEach((trigger) => {
          const disable = trigger.getAttribute('data-parallax-disable');
          if (
            (disable === 'mobile' && c.isMobile) ||
            (disable === 'mobileLandscape' && c.isMobileLandscape) ||
            (disable === 'tablet' && c.isTablet)
          ) {
            return;
          }

          const target = trigger.querySelector<HTMLElement>('[data-parallax="target"]') ?? trigger;
          const direction = trigger.getAttribute('data-parallax-direction') ?? 'vertical';
          const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent';
          const scrubAttr = trigger.getAttribute('data-parallax-scrub');
          const scrub = scrubAttr ? parseFloat(scrubAttr) : true;
          const startVal = parseFloat(trigger.getAttribute('data-parallax-start') ?? '20');
          const endVal = parseFloat(trigger.getAttribute('data-parallax-end') ?? '-20');
          const scrollStart = `clamp(${trigger.getAttribute('data-parallax-scroll-start') ?? 'top bottom'})`;
          const scrollEnd = `clamp(${trigger.getAttribute('data-parallax-scroll-end') ?? 'bottom top'})`;

          const fromVars: gsap.TweenVars = { [prop]: startVal };
          const toVars: gsap.TweenVars = {
            [prop]: endVal,
            ease: 'none',
            scrollTrigger: { trigger, start: scrollStart, end: scrollEnd, scrub },
          };
          gsap.fromTo(target, fromVars, toVars);
        });
      }, scope);
      return () => ctx.revert();
    },
  );

  ScrollTrigger.refresh();
}
