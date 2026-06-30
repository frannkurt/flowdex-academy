// Filtro defensivo de intentos torpes de jailbreak / prompt extraction.
//
// No es una solución completa (un atacante con paciencia siempre encuentra
// formas creativas), pero corta el 80% de los intentos copy-paste típicos
// sin gastar una request a Gemini.
//
// Cuando detecta un patrón sospechoso devolvemos una respuesta canned
// directamente, sin pasar por el modelo.

const SUSPICIOUS_PATTERNS: RegExp[] = [
  // Override de instrucciones
  /ignor(a|á|e|en|are)\s+(las\s+)?(instrucciones|reglas|prompts?)/i,
  /olvid(a|á|e|en|are|ate)\s+(las\s+)?(instrucciones|reglas|prompts?)/i,
  /forget\s+(all\s+)?(previous|prior)\s+(instructions|prompts?|rules)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(instructions|prompts?|rules)/i,

  // Modos de "desbloqueo"
  /\bDAN\b/,
  /\bjailbreak/i,
  /modo\s+(desarrollador|admin|root|dev|developer)/i,
  /developer\s+mode/i,
  /actu(a|á)\s+como\s+si/i,
  /actuá\s+como\s+un\s+(trader|asesor)/i,
  /\bpretend\s+to\s+be\b/i,

  // Extracción del system prompt
  /(repet(í|i|e|ime|í)|mostr(á|a|ame))\s+(las\s+)?(instrucciones|el\s+prompt|el\s+system|tu\s+system)/i,
  /(repeat|show|reveal|print)\s+(your\s+)?(system\s+)?(prompt|instructions)/i,
  /qu(é|e)\s+(te|le)\s+(dijeron|pidieron|instruyeron)/i,
  /system\s+message/i,

  // Extracción de contenido del curso completo
  /(volcá|volca|dame|exportá|exporta|list(á|a|alos|alas))\s+(todo|todos|todas|el\s+curso\s+entero|el\s+contenido\s+completo|los\s+m(ó|o)dulos|las\s+secciones)/i,
  /transcrib(í|i|ime)\s+(el|todo|los)/i,
  /(dump|export)\s+(all|the\s+entire|the\s+full)\s+(course|content|modules|material)/i,

  // Identificación del modelo
  /qu(é|e)\s+modelo\s+(de\s+ia\s+)?(sos|eres|us(á|a)s)/i,
  /\b(sos|eres)\s+(gpt|chatgpt|claude|gemini|llama|grok)/i,
  /which\s+(ai\s+)?model\s+(are\s+you|do\s+you\s+use)/i,
]

export function isJailbreakAttempt(message: string): boolean {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(message))
}

// Respuesta canned para no gastar tokens en intentos torpes.
export const JAILBREAK_RESPONSE =
  "Soy el tutor IA de Flowdex y mi configuración no se discute ni se modifica. Si tenés una duda sobre el curso, encantado de ayudarte."
