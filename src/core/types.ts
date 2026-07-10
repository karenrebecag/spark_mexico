export type Theme = 'light' | 'dark';
export type Lang = 'es' | 'en';

export interface LandingConfig {
  theme: Theme;
  lang: Lang;
}

export interface MountAttrs {
  theme: Theme;
  lang: Lang;
}
