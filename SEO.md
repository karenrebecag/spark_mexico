# SEO / GEO — Spark AI Summit México

> Estado: **placeholder** (brief de México pendiente). Ciudad confirmada: **CDMX**.
> Fecha y sede: **por confirmar** — los campos marcados `REEMPLAZAR` se llenan al llegar el brief.

## Dónde va esto (crítico)

La landing se renderiza **100% con JS** vía mount point en Elementor. Por eso los meta tags,
el `<title>` y el JSON-LD **NO deben inyectarse desde `landing.js`**: cuando el crawler o el
scraper social (Facebook, WhatsApp, LinkedIn, Slack) leen el HTML, el bundle aún no corrió, así
que no ven nada. Los tags inyectados tarde por JS se ignoran para SEO y para las tarjetas OG.

**Colocar en el `<head>` server-rendered de la página de WordPress**, por una de estas vías:
- Plugin SEO (Yoast / RankMath): title, meta description, canonical, OG, Twitter y el schema.
- O un snippet de header (Elementor Custom Code, o plugin "Insert Headers and Footers") pegando
  el bloque completo de abajo.

El `<title>` y la meta description de WordPress deben coincidir con estos valores (no dejar que
Elementor ponga el título por defecto de la página).

---

## 1. Meta tags (pegar en `<head>`)

```html
<title>Spark AI Summit México | IA para líderes de negocio</title>
<meta name="description" content="Spark AI Summit llega a CDMX: líderes de marketing, ventas y dirección ven AI Agents resolver retos reales de negocio, en vivo. Presencial y con cupos limitados.">
<meta name="keywords" content="Spark AI Summit México, cumbre de inteligencia artificial México, evento de IA para empresas CDMX, AI Agents negocio, inteligencia artificial marketing ventas">
<link rel="canonical" href="https://REEMPLAZAR-con-url-final.com/">
<meta name="robots" content="index, follow, max-image-preview:large">

<!-- Open Graph (Facebook, WhatsApp, LinkedIn, Slack) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Spark AI Summit México">
<meta property="og:title" content="Spark AI Summit México | IA para líderes de negocio">
<meta property="og:description" content="Un día presencial en CDMX donde líderes de negocio ven AI Agents resolviendo problemas reales, no teoría. Cupos limitados por aprobación.">
<meta property="og:url" content="https://REEMPLAZAR-con-url-final.com/">
<meta property="og:image" content="https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev/og-spark-mexico.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_MX">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Spark AI Summit México | IA para líderes de negocio">
<meta name="twitter:description" content="Un día presencial en CDMX donde líderes de negocio ven AI Agents resolviendo problemas reales, no teoría. Cupos limitados.">
<meta name="twitter:image" content="https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev/og-spark-mexico.webp">
```

**Pendiente de asset:** no existe una OG card de 1200×630. Crear `og-spark-mexico.webp`
(1200×630, logo Spark + "Ciudad de México" sobre el mesh gradient de marca) y subirla al R2.
Mientras tanto, el scraper caerá al `bannerLogo` si se apunta ahí, pero la card se verá mal
recortada — priorizar la card dedicada.

Longitudes: title 51 car. (< 60 ✓) · description 156 car. (150–160 ✓).

---

## 2. JSON-LD — FAQPage (GEO: +40% de visibilidad en IA)

Refleja **exactamente** las FAQs visibles (`src/constants/content.ts` → `FAQS`). Google exige
que el texto del schema coincida con el de la página. Si editas una FAQ en el código, actualiza
este bloque. Pegar como `<script type="application/ld+json">` en el `<head>`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Esto es para mí si no soy técnico?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí, y es exactamente para ti. Spark no es una conferencia de ingeniería: es un evento para líderes de negocio que toman decisiones sobre marketing, ventas, operaciones y crecimiento. No necesitas saber programar. Necesitas entender qué hace la IA, cómo ya la están usando empresas de tu sector en la región, y qué deberías hacer tú el lunes siguiente." }
    },
    {
      "@type": "Question",
      "name": "¿Cuándo y dónde es el evento?",
      "acceptedAnswer": { "@type": "Answer", "text": "Spark AI Summit México se realiza de forma presencial en la Ciudad de México. La fecha y la sede exactas se confirman próximamente; la información de sala y acceso se envía tras validar tu inscripción." }
    },
    {
      "@type": "Question",
      "name": "¿Por qué el acceso requiere aprobación?",
      "acceptedAnswer": { "@type": "Answer", "text": "Para mantener el nivel de la conversación. Solo se aceptan inscripciones con correo corporativo, y cada perfil es evaluado según rol, industria y seniority. No es exclusividad por exclusividad: es para garantizar que las conversaciones en el evento sean entre pares que enfrentan los mismos retos." }
    },
    {
      "@type": "Question",
      "name": "¿Puedo llevar a mi equipo?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí, y tiene mucho sentido hacerlo. Cuando varias personas de la misma empresa asisten, la conversación de implementación cambia: ya no es \"te cuento lo que vi\" sino \"qué hacemos con esto\". Cada persona necesita su propia inscripción con correo corporativo." }
    },
    {
      "@type": "Question",
      "name": "¿Hay transmisión online o acceso remoto?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Spark es un evento 100% presencial y no habrá streaming. Lo más valioso del día no está en las slides, está en las conversaciones entre sesiones, en los workshops donde trabajas sobre tu negocio real, y en el networking con personas que enfrentan los mismos retos que tú." }
    },
    {
      "@type": "Question",
      "name": "¿Se comparten grabaciones o materiales después?",
      "acceptedAnswer": { "@type": "Answer", "text": "Los asistentes Full Access VIP reciben acceso a las grabaciones de las charlas principales después del evento. Todos los asistentes reciben el material digital de cada presentación. Los workshops no se graban: el formato es interactivo y el valor está en la sesión en vivo." }
    },
    {
      "@type": "Question",
      "name": "¿Qué pasa si reservo y no puedo asistir?",
      "acceptedAnswer": { "@type": "Answer", "text": "Puedes transferir tu lugar a otro profesional de la misma empresa hasta 48 horas antes del evento, siempre que el perfil cumpla con los criterios del evento. Si sabes con anticipación que no podrás asistir, te agradecemos liberar tu cupo para que otra persona pueda aprovecharlo." }
    },
    {
      "@type": "Question",
      "name": "¿Cómo reservo mi lugar?",
      "acceptedAnswer": { "@type": "Answer", "text": "Usa el botón \"Solicitar inscripción\" en cualquier punto de esta página. Solo se aceptan correos corporativos. Tu perfil será evaluado y recibirás confirmación por correo. Los cupos son limitados y el acceso no está garantizado hasta recibir la aprobación." }
    }
  ]
}
</script>
```

---

## 3. JSON-LD — Event (PLANTILLA, no publicar hasta tener el brief)

`Event` exige `startDate` y `location` reales. Con datos placeholder, Google lo marca como
error o lo ignora, y una fecha falsa puede penalizar. **Dejar fuera del head hasta confirmar
fecha + sede.** Cuando lleguen, reemplazar `REEMPLAZAR` y publicar:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Spark AI Summit México",
  "description": "Cumbre presencial de inteligencia artificial para líderes de negocio: AI Agents resolviendo problemas reales de marketing, ventas, operaciones y crecimiento.",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "startDate": "REEMPLAZAR-2026-MM-DDTHH:MM:00-06:00",
  "endDate": "REEMPLAZAR-2026-MM-DDTHH:MM:00-06:00",
  "location": {
    "@type": "Place",
    "name": "REEMPLAZAR-nombre-de-la-sede",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad de México",
      "addressRegion": "CDMX",
      "addressCountry": "MX"
    }
  },
  "image": "https://pub-09dc8675a13e4b6d9ff1f7e15d49ade2.r2.dev/og-spark-mexico.webp",
  "organizer": {
    "@type": "Organization",
    "name": "Spark AI Summit",
    "url": "https://REEMPLAZAR-con-url-final.com/"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/LimitedAvailability",
    "url": "https://REEMPLAZAR-con-url-final.com/#contacto"
  }
}
</script>
```

> Nota horaria: CDMX es **UTC-6** (`-06:00`). Ojo: `src/constants/event.ts` todavía tiene
> `2026-07-14 ... -05:00` (Lima) — corregir a la fecha/tz de México cuando se defina.

---

## 4. GEO — por qué esta página se cita bien en buscadores de IA

Ya cumple varios de los métodos Princeton de GEO (ChatGPT, Perplexity, Gemini, Copilot):

- **Answer-first + FAQ**: las FAQs responden directo, sin rodeos → formato ideal para citación.
- **Estadística concreta**: "400+ líderes ya vivieron Spark AI Summit" (edición 2025) es un dato
  citable. Mantenerlo en texto visible, no solo en imagen.
- **Tono autoritativo y término técnico**: "AI Agents", "problemas reales de negocio" — vocabulario
  de dominio que ancla la relevancia semántica.

Pendientes para subir citación:
- [ ] Crear la OG card 1200×630 (`og-spark-mexico.webp`).
- [ ] `robots.txt` de WordPress debe permitir bots de IA: `GPTBot`, `ChatGPT-User`, `PerplexityBot`,
      `ClaudeBot`, `anthropic-ai`, además de `Googlebot`/`Bingbot`.
- [ ] Incluir la página en el `sitemap.xml` del sitio.
- [ ] Cuando haya fecha/sede: publicar el `Event` schema (paso 3).
- [ ] Validar en https://validator.schema.org y https://search.google.com/test/rich-results.
