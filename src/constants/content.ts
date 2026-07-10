// Contenido SCAFFOLD (placeholder on-topic) para las secciones portadas de Spark.
// La ESTRUCTURA es definitiva; el copy/data se reemplaza por el real de ATFX Perú.

export interface SpeakerData {
  name: string;
  role: string;
  company: string;
  bio?: string;
}
export interface BenefitData {
  title: string;
  text: string;
}
export interface FaqItem {
  question: string;
  answer: string;
}
export interface StatData {
  value: string;
  label: string;
}
export interface SocialData {
  label: string;
  href: string;
  icon: string; // inner SVG markup
  fill: boolean;
}

// 5 · Qué aprenderás (8 puntos reales del brief)
export const LEARN_POINTS: string[] = [
  'Comparación entre el plazo fijo y la inflación',
  'Cómo tus ingresos pierden valor con el tiempo',
  'Pros y contras de dejar tu dinero en el banco',
  'Qué hace el banco con tu dinero',
  '¿Es rentable invertir directamente desde el banco?',
  'Cómo trabaja un banco y cómo hacerlo por tu cuenta',
  'Oportunidades de inversión y estrategias',
  'Conoce nuestro fondo de inversión',
];

// 6 · Aliados / instructores (Blue Makers — datos reales del brief)
export const SPEAKERS: SpeakerData[] = [
  {
    name: 'Álvaro Matos',
    role: 'CEO de Blue Makers',
    company: 'Certificado Bloomberg',
    bio: 'Trader e inversionista con experiencia en mercados financieros, criptomonedas y análisis macroeconómico. Lidera un fondo de inversión basado en trading cuantitativo algorítmico, una academia de formación y programas de mentoría presencial.',
  },
  {
    name: 'Josué Flores',
    role: 'Fundador y CEO de Blue Makers · Co-CEO de SkillyFund',
    company: 'Certificado Bloomberg 2026',
    bio: 'Trader profesional con 6 años de experiencia, especializado en índices americanos. Analista fundamental y macroeconómico, ponente en eventos a nivel LATAM, con operativa diaria y sesiones presenciales semanales.',
  },
];

// 7 · Sobre el evento (datos reales del brief)
export const ABOUT_STATS: StatData[] = [
  { value: 'Presencial', label: 'Cámara de Comercio de Lima' },
  { value: '3 h', label: '14 de julio · 9:00–12:00' },
  { value: '+5 años', label: 'Blue Makers en trading' },
];

// 8 · Beneficios (placeholder)
export const BENEFITS: BenefitData[] = [
  { title: 'Aprende de especialistas', text: 'Conocimiento directo de quienes operan en los mercados todos los días.' },
  { title: 'Estrategias accionables', text: 'Sales con pasos concretos para aplicar, no solo teoría.' },
  { title: 'Networking', text: 'Conecta con otras personas que buscan hacer crecer su capital.' },
];

// 8 · Beneficios como slider de pilares (PillarSlider) — placeholder
export interface PillarData {
  variant: 'dark' | 'gradient' | 'light';
  tags: string[];
  title: string;
  text: string;
}
export const PILLARS: PillarData[] = [
  { variant: 'dark', tags: ['Mercados'], title: 'Anticípate', text: 'Aprende a leer las señales del mercado antes que la mayoría.' },
  { variant: 'gradient', tags: ['Estrategia'], title: 'Invierte', text: 'Construye una estrategia con criterio y objetivos claros.' },
  { variant: 'light', tags: ['Patrimonio'], title: 'Protege', text: 'Resguarda el valor de tu capital frente a la inflación.' },
  { variant: 'dark', tags: ['Networking'], title: 'Conecta', text: 'Rodéate de personas que buscan hacer crecer su capital.' },
  { variant: 'gradient', tags: ['Acción'], title: 'Aplica', text: 'Sal con pasos concretos para empezar a invertir hoy.' },
];

// 9 · FAQ — copy real de Spark AI Summit (portado del layout de SparkSummit2026).
export const FAQS: FaqItem[] = [
  {
    question: '¿Esto es para mí si no soy técnico?',
    answer:
      'Sí, y es exactamente para ti. Spark no es una conferencia de ingeniería: es un evento para líderes de negocio que toman decisiones sobre marketing, ventas, operaciones y crecimiento. No necesitas saber programar. Necesitas entender qué hace la IA, cómo ya la están usando empresas de tu sector en la región, y qué deberías hacer tú el lunes siguiente.',
  },
  {
    question: '¿Cuándo y dónde es el evento?',
    answer:
      'Spark AI Summit México se realiza de forma presencial en la Ciudad de México. La fecha y la sede exactas se confirman próximamente; la información de sala y acceso se envía tras validar tu inscripción.',
  },
  {
    question: '¿Por qué el acceso requiere aprobación?',
    answer:
      'Para mantener el nivel de la conversación. Solo se aceptan inscripciones con correo corporativo, y cada perfil es evaluado según rol, industria y seniority. No es exclusividad por exclusividad: es para garantizar que las conversaciones en el evento sean entre pares que enfrentan los mismos retos.',
  },
  {
    question: '¿Puedo llevar a mi equipo?',
    answer:
      'Sí, y tiene mucho sentido hacerlo. Cuando varias personas de la misma empresa asisten, la conversación de implementación cambia: ya no es "te cuento lo que vi" sino "qué hacemos con esto". Cada persona necesita su propia inscripción con correo corporativo.',
  },
  {
    question: '¿Hay transmisión online o acceso remoto?',
    answer:
      'No. Spark es un evento 100% presencial y no habrá streaming. Lo más valioso del día no está en las slides, está en las conversaciones entre sesiones, en los workshops donde trabajas sobre tu negocio real, y en el networking con personas que enfrentan los mismos retos que tú.',
  },
  {
    question: '¿Se comparten grabaciones o materiales después?',
    answer:
      'Los asistentes Full Access VIP reciben acceso a las grabaciones de las charlas principales después del evento. Todos los asistentes reciben el material digital de cada presentación. Los workshops no se graban: el formato es interactivo y el valor está en la sesión en vivo.',
  },
  {
    question: '¿Qué pasa si reservo y no puedo asistir?',
    answer:
      'Puedes transferir tu lugar a otro profesional de la misma empresa hasta 48 horas antes del evento, siempre que el perfil cumpla con los criterios del evento. Si sabes con anticipación que no podrás asistir, te agradecemos liberar tu cupo para que otra persona pueda aprovecharlo.',
  },
  {
    question: '¿Cómo reservo mi lugar?',
    answer:
      'Usa el botón "Solicitar inscripción" en cualquier punto de esta página. Solo se aceptan correos corporativos. Tu perfil será evaluado y recibirás confirmación por correo. Los cupos son limitados y el acceso no está garantizado hasta recibir la aprobación.',
  },
];

// 10 · Redes (placeholder hrefs — reemplazar por las cuentas reales de ATFX Perú)
export const SOCIALS: SocialData[] = [
  {
    label: 'Instagram',
    href: '#',
    icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    fill: false,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    fill: true,
  },
];

// 10 · Aliados (placeholder — reemplazar por logos reales)
export const ALLIES: string[] = ['Aliado 1', 'Aliado 2', 'Aliado 3', 'Aliado 4', 'Aliado 5'];
