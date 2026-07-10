// Speakers — datos reales del line-up (portados de SparkSummit2026). Las 4 primeras
// fotos viven en el CDN R2; el resto usa rutas del host (se resuelven contra el sitio
// donde se embebe la LP). Alimentan el grid de sections/speakers.ts.

const R2 = 'https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev';

export interface Speaker {
  image: string;
  name: string;
  role: string;
  company: string;
}

export const SPEAKERS: Speaker[] = [
  { image: `${R2}/Daniel%20Rojas%2C%20Davivienda.webp`, name: 'Daniel Mauricio Rojas', role: 'Líder de Growth Marketing', company: 'Davivienda' },
  { image: `${R2}/Gustavo-Hurtado-CTO.webp`, name: 'Gustavo Hurtado', role: 'Chief Technology Officer', company: 'VML' },
  { image: `${R2}/MarioSuarez.webp`, name: 'Mario Suárez', role: 'Field Marketing Manager', company: 'ATOM' },
  { image: `${R2}/DianaMartinez.webp`, name: 'Diana Martínez', role: 'Strategic Partner Manager WhatsApp', company: 'Meta' },
  { image: '/rene-mouynes.webp', name: 'René Mouynes', role: 'Cofounder & CTO', company: 'AtomChat' },
  { image: '/eduardo-quinonez.webp', name: 'Eduardo Quiñonez', role: 'CEO', company: 'Opres' },
  { image: '/lu-vasquez.webp', name: 'Lú Vásquez', role: 'Partner Data Transformation Lead', company: 'Google' },
  { image: '/carlos-pena.webp', name: 'Carlos Peña', role: 'AI Customer Engineer, Agents & AI Platform LATAM', company: 'Google' },
  { image: '/hector-lazcar.webp', name: 'Héctor Lascar', role: 'CEO Global & Founder', company: 'Cebra' },
  { image: '/cristian-borray.webp', name: 'Cristian Borray', role: 'Head of Digital Business', company: 'Avista' },
  { image: '/jose-farfan.webp', name: 'Jose Farfán', role: 'Product Manager', company: 'ATOM' },
  { image: '/natalia-jimenez.webp', name: 'Natalia Jiménez', role: 'Senior Regional Sales Director', company: 'Deel' },
  { image: '/wilmer-murcia.webp', name: 'Wilmar Murcia', role: 'Jefe Comercial Seccional', company: 'Fund. Universitaria del Área Andina' },
  { image: '/carlos-munoz.webp', name: 'Carlos Muñoz', role: 'Chief Marketing Officer', company: 'Nebula' },
];
