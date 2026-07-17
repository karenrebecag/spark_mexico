// Speakers — line-up de CDMX 2026. El brief solo confirma a Mario Suárez (keynote Atom);
// el resto del line-up se revela el 1 de octubre (speaker reveal). Los "por anunciar" se
// generan en sections/speakers-b.ts para llenar el abanico del slider mientras tanto.

const R2 = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';

export interface Speaker {
  image: string;
  name: string;
  role: string;
  company: string;
}

export const SPEAKERS: Speaker[] = [
  { image: `${R2}/MarioSuarez.webp`, name: 'Mario Suárez', role: 'Field Marketing Manager', company: 'ATOM' },
];
