export const $ = <T extends Element = Element>(s: string, r: ParentNode = document): T | null =>
  r.querySelector<T>(s);

export const $$ = <T extends Element = Element>(s: string, r: ParentNode = document): T[] =>
  Array.from(r.querySelectorAll<T>(s));

export const has = (s: string, r: ParentNode = document): boolean => !!$(s, r);
