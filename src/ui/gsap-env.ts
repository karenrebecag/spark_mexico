// Setup único de GSAP: registra plugins, el easing firma de OSMO y los defaults
// canónicos (ease "osmo", duration 0.6). Lo comparten motion.ts y button-rotate.ts.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Draggable, InertiaPlugin, Observer);

// GSAP no parsea cubic-bezier como string → hay que registrarlo como CustomEase.
CustomEase.create('osmo', '0.625, 0.05, 0, 1');

// Valores canónicos de OSMO (main.js: staggerDefault 0.05, durationDefault 0.6).
export const EASE = 'osmo';
export const DURATION = 0.6;
export const STAGGER = 0.05;

gsap.defaults({ ease: EASE, duration: DURATION });

export { gsap, ScrollTrigger, SplitText, Draggable, Observer };
