"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.investment": "Inversión",
    "nav.trading": "Trading",
    "nav.innerCircle": "Inner Circle",
    "nav.membership": "Membresía",
    "nav.start": "Crear cuenta",

    // Hero
    "hero.title": "ESTÁS IMPROVISANDO. EL MERCADO LO SABE.",
    "hero.subtitle":
      "Aprendé a invertir y operar con metodología, criterio y acompañamiento real.",
    "hero.cta": "Encontrá por dónde empezar",
    "hero.stat1": "Caminos",
    "hero.stat2": "Etapas",
    "hero.stat3": "Módulos",

    // Protocol
    "protocol.title": "¿CÓMO FUNCIONA FLOWDEX?",
    "protocol.step1.title": "Canal de novedades",
    "protocol.step1.desc": "Telegram y Discord para novedades, ofertas y eventos",
    "protocol.step3.title": "Kickstart",
    "protocol.step3.desc": "Investment o Trading: base operativa real con clases en vivo y comunidad.",
    "protocol.step4.title": "Nivel Avanzado",
    "protocol.step4.desc": "Expert Investment o Trading Lab: profundización del método con caso aplicado.",
    "protocol.stepComunidad.title": "Comunidad",
    "protocol.stepComunidad.desc": "Acceso a Discord y Telegram para debatir entre alumnos, compartir avances y resolver dudas reales.",
    "protocol.step5.title": "Inner Circle",
    "protocol.step5.desc": "3 cursos + comunidad premium + reviews personalizadas",
    "protocol.telegramCta": "Unite a Telegram",
    "protocol.discordCta": "Unite a Discord",
    "protocol.instagramCta": "Seguinos en Instagram",

    // Two Paths
    "paths.title": "DOS CAMINOS, UN DESTINO.",
    "paths.investment": "INVERSIÓN",
    "paths.trading": "TRADING",
    "paths.investmentDesc":
      "Para el que quiere construir patrimonio en el tiempo: análisis fundamental, gestión de portafolio y decisiones de capital con criterio profesional.",
    "paths.tradingDesc":
      "Para el que quiere ejecutar el mercado: sistema propio sobre futuros US, prop firms o cuenta propia, lectura institucional y gestión profesional del riesgo.",

    // Courses
    "course.enroll": "Descubrí qué vas a aprender",
    "course.initial": "NIVEL INICIAL",
    "course.advanced": "NIVEL AVANZADO",
    "course.syllabus": "Temario completo",

    // Inner Circle
    "innerCircle.badge": "ACCESO EXCLUSIVO",
    "innerCircle.badgeSub": "Si ya completaste Kickstart + Avanzado, podés entrar",
    "innerCircle.title": "FLOWDEX INNER CIRCLE",
    "innerCircle.subtitle": "Donde tu operativa deja de ser intuición y empieza a ser método.",
    "innerCircle.descPrefix":
      "Tres cursos avanzados con acompañamiento de Franco y Augusto: dos disciplinas técnicas (Inversiones + Trading) y la ",
    "innerCircle.descHighlight": "Obra Maestra: 10 módulos de desarrollo personal y psicología del operador",
    "innerCircle.descSuffix": ".",
    "innerCircle.priceNote":
      "Pago único · Acceso completo al Inner Circle.",
    "innerCircle.priceNoteOption":
      "La membresía mensual de seguimiento es opcional ($50/mes · primer mes incluido).",
    "innerCircle.urgencyNote":
      "El acceso al Inner Circle se abre solo para un grupo limitado cada mes, priorizando calidad de seguimiento y comunidad.",
    "innerCircle.workTitle": "QUÉ TRABAJAMOS ADENTRO",
    "innerCircle.work1Title": "Las dos disciplinas exclusivas: Flowdex Portfolio Method (Inversiones) y ORB Breakout (Trading)",
    "innerCircle.work1Desc":
      "Sistema FPM propio para construir y gestionar portafolios, y Estrategia ORB Breakout con indicador exclusivo en TradingView. Las dos disciplinas exclusivas del círculo, sin elegir una u otra.",
    "innerCircle.work2Title": "Obra Maestra · 10 módulos del operador",
    "innerCircle.work2Desc":
      "Mindset fundacional, las 6 emociones maestras, sesgos cognitivos, decisiones bajo presión y filosofía aplicada. La parte mental que sostiene la consistencia.",
    "innerCircle.work3Title": "Revisión personalizada de tus trades",
    "innerCircle.work3Desc":
      "Subís tus trades en el canal privado del círculo. El equipo te responde rápido por texto, y cada semana Franco y Augusto revisan en vivo varios trades de varios alumnos. Cuando el caso lo amerita, te contestan con una revisión personal 1 a 1.",
    "innerCircle.work4Title": "Indicadores Propios Flowdex",
    "innerCircle.work4Desc":
      "Indicador de ORB Breakout y FVG Visual, desarrollados por Franco para Flowdex. Las herramientas que realmente usamos en cada sesión del círculo.",
    "innerCircle.work5Title": "Primer mes de membresía incluido",
    "innerCircle.work5Desc":
      "Activamos automáticamente tu primer mes de membresía mensual (USD 50/mes). Te da acceso completo al canal privado del IC, reviews del equipo y las 12 sesiones grupales del mes (3 por semana). La membresía no se debita automáticamente: a partir del segundo mes vos decidís si la renovás.",
    "innerCircle.cta": "VER EL SISTEMA COMPLETO",
    // Copy del rediseño de la card de IC en la home (mayo 2026).
    // Las llaves "card*" pertenecen al nuevo bloque visual alineado
    // con el lenguaje de CoursesGrid pero amplificado como tope de
    // gama. Las viejas (descPrefix/descHighlight/descSuffix, priceNote*,
    // urgencyNote, work*) se siguen usando en la página dedicada
    // /inner-circle, no se borran. priceAnchorNote se eliminó junto con
    // los precios tachados (junio 2026: anclas de oferta van contra la
    // filosofía Flowdex).
    "innerCircle.cardRibbon": "Tope de gama · Inner Circle",
    "innerCircle.cardChip": "Programa premium · 12 meses",
    "innerCircle.cardHighlight": "La Obra Maestra del operador",
    "innerCircle.cardTagline":
      "Mentoría continua, review personalizado y los métodos propios de Flowdex (FPM, ORB Breakout, Obra Maestra) durante 12 meses.",
    "innerCircle.cardOutcomeLabel": "Al terminar el año",
    "innerCircle.cardOutcome":
      "Pasás de operar con método propio a ejecutarlo bajo supervisión profesional continua, con review personalizado de tus operaciones y mentoría grupal frecuente.",
    "innerCircle.cardInclude1": "12 sesiones grupales en vivo al mes (3 por semana) — tu primer mes incluido, después vía la membresía mensual",
    "innerCircle.cardInclude2": "Review personalizado de tus operaciones",
    "innerCircle.cardInclude3": "3 cursos avanzados: Inversiones, Trading y Psicología del operador",
    "innerCircle.cardInclude4": "Indicadores propios en TradingView",
    "innerCircle.cardInclude5": "Comunidad cerrada del Inner Circle",
    "innerCircle.cardPrereq": "Requiere haber completado Expert Investment o Trading Lab",
    "innerCircle.cardInclude6": "12 meses de acceso al material del Inner Circle",
    "innerCircle.cardCta": "Conocer el programa",
    "innerCircle.prerequisites": "REQUISITOS PREVIOS",
    "innerCircle.prerequisitesNote": "Tenés que haber completado uno de estos caminos:",
    "innerCircle.prerequisitesInvestment": "Inversiones — Kickstart Investment + Expert Investment",
    "innerCircle.prerequisitesTrading": "Trading — Kickstart Trading + Trading Lab",
    "innerCircle.review1Quote":
      "La diferencia para mí fue la parte psicológica y la gestión de riesgo. Dejé de tradear por ansiedad y empecé a ejecutar un plan de verdad, con criterio y sin operar a lo loco.",
    "innerCircle.review1Name": "Nicolas V.",
    "innerCircle.review1Role": "Alumno activo · Inner Circle",
    "innerCircle.review2Quote":
      "Pasé de entrar sin contexto a tener un proceso claro. Con la estrategia ORB y el feedback en vivo, mi ejecución se volvió mucho más consistente semana tras semana.",
    "innerCircle.review2Name": "Camila R.",
    "innerCircle.review2Role": "Alumna activa · Inner Circle",

    // Membership
    "membership.title": "SÉ PARTE DEL CÍRCULO",
    "membership.desc":
      "Acompañamiento continuo para quienes ya eligieron su camino.",
    "membership.cta": "Suscribirme",
    "membership.badge": "EXCLUSIVO · SÉ PARTE DE ALGO MÁS GRANDE",
    "membership.item1": "Análisis del mercado cuando hay contexto relevante",
    "membership.item2": "Q&A en vivo todos los lunes",
    "membership.item3": "Acceso al canal privado de señales",
    "membership.item4": "Comunidad activa de traders e inversores",

    // Mentors
    "mentors.title": "QUIENES DIRIGEN EL PROGRAMA",
    "mentors.augusto.role": "Director de Inversiones",
    "mentors.augusto.focus":
      "Cinco años formando inversores que llegan exclusivamente por recomendación, sin redes sociales ni publicidad. Su método se transmite en la conversación de uno que aplicó y volvió a recomendar.",
    "mentors.augusto.focus2":
      "Combina análisis fundamental, lectura macroeconómica y disciplina de capital para construir carteras que se sostienen en el tiempo. Creador del Flowdex Portfolio Method (FPM).",
    "mentors.augusto.prestige":
      "Director del programa de inversiones · Creador del Flowdex Portfolio Method",
    "mentors.augusto.specialty1": "Análisis Fundamental Avanzado · WACC, ROIC y MOAT",
    "mentors.augusto.specialty2": "Flowdex Portfolio Method · Construcción y gestión de portafolios",
    "mentors.augusto.specialty3": "Estrategias clásicas: Value, Growth, All Weather, CAN SLIM",
    "mentors.augusto.specialty4": "Dividendos, REITs y ETFs como income profesional",
    "mentors.augusto.specialty5": "Lectura macroeconómica aplicada a decisiones de capital",
    "mentors.augusto.quote":
      "La diferencia entre perder y ganar está en el proceso, no en la suerte.",
    "mentors.frann.role": "Trader Profesional",
    "mentors.frann.focus":
      "Más de 10 años operando con método propio sobre futuros US. Lidera el programa de Trading de Flowdex y desarrolla los sistemas que se enseñan adentro del círculo.",
    "mentors.frann.focus2":
      "Resultados consistentes y verificables en prop firms: evaluaciones aprobadas y payouts cobrados a lo largo del tiempo. Sistema con proceso replicable, no fruto de la suerte. La misma operativa que aplica todos los días.",
    "mentors.frann.prestige":
      "Desarrollador de la Estrategia ORB Breakout y los Indicadores Flowdex",
    "mentors.frann.specialty1": "Estrategia ORB Breakout · Método propio sobre futuros US",
    "mentors.frann.specialty2": "Operativa intradía sobre MES y MNQ",
    "mentors.frann.specialty3": "FVG, Volume Profile y lectura de liquidez institucional",
    "mentors.frann.specialty4": "Prop Firms · Evaluación, gestión de drawdown y payout",
    "mentors.frann.specialty5": "Indicadores propios en TradingView (ORB · FVG Visual)",
    "mentors.mediaContext": "Prensa · Canal 12 Misiones",
    "mentors.featuredArticle": "Trading mediante plataformas online",
    "mentors.videoContext": "En video · Canal 12 Misiones",
    "mentors.featuredVideo": "#ElNoticiero: trading, el trabajo del futuro",
    "mentors.frann.quote":
      "El mercado premia la constancia y castiga la impaciencia.",

    // Testimonials
    "testimonials.kicker": "Beta testers · Fase pre-lanzamiento",
    "testimonials.title": "LO QUE DIJERON QUIENES PROBARON EL CONTENIDO",
    "testimonials.subtitle":
      "Beta testers que recorrieron los cursos antes del lanzamiento oficial. Sus testimonios reflejan la experiencia con el material y el método, no resultados financieros.",
    "testimonials.review1.name": "Matías R.",
    "testimonials.review1.role": "Beta tester · Trading Lab",
    "testimonials.review1.text":
      "Entré bastante perdido y en dos meses ordené toda la operativa. Lo mejor fue el seguimiento: te marcan qué ajustar sin vueltas y eso te ahorra mil errores boludos.",
    "testimonials.review2.name": "Camila S.",
    "testimonials.review2.role": "Beta tester · Kickstart Investment",
    "testimonials.review2.text":
      "Venía mirando videos sueltos por todos lados y no cerraba nada. Acá por fin entendí cómo armar cartera con criterio. Está explicado claro, bien al pie y sin humo.",
    "testimonials.review3.name": "Nicolás V.",
    "testimonials.review3.role": "Beta tester · Inner Circle · Trading",
    "testimonials.review3.text":
      "La diferencia para mí fue la parte psicológica y la gestión de riesgo. Dejé de tradear por ansiedad y empecé a ejecutar un plan de verdad, con criterio y sin operar a lo loco.",
    "testimonials.review4.name": "Florencia M.",
    "testimonials.review4.role": "Beta tester · Inner Circle · Inversiones",
    "testimonials.review4.text":
      "Las reviews semanales son clave. Aunque laburo todo el día, me conecto un rato y salgo con contexto claro. Sentís que no estás sola peleándola en el mercado.",

    // Footer trust microcopy
    "footer.trust": "Sitio seguro · Pagos protegidos",

    // FAQ
    "faq.title": "PREGUNTAS FRECUENTES",
    "faq.q1": "¿Necesito experiencia previa para empezar?",
    "faq.a1":
      "No, nuestros cursos Kickstart están diseñados para principiantes absolutos. Te guiamos paso a paso desde los fundamentos.",
    "faq.q2": "¿Cuál es la diferencia entre Inversión y Trading?",
    "faq.a2":
      "Inversión construye patrimonio a largo plazo con análisis fundamental y gestión de portafolios. Trading opera mercados en marcos temporales cortos con sistemas estructurados y gestión profesional de riesgo.",
    "faq.q3": "¿Puedo hacer upgrade entre niveles?",
    "faq.a3":
      "Sí, si compraste Kickstart podés hacer upgrade al nivel avanzado pagando solo la diferencia ($200 USD).",
    "faq.q4": "¿Cómo accedo al contenido después de pagar?",
    "faq.a4":
      "Recibís acceso inmediato al contenido completo en la plataforma. En Telegram vas a encontrar contenido adicional, novedades y extras para alumnos.",
    "faq.q5": "¿Los precios están en USD? ¿Puedo pagar en pesos?",
    "faq.a5":
      "Sí, los precios están en USD. MercadoPago te muestra el equivalente en pesos al momento del pago. También aceptamos pagos en criptomonedas a través de NowPayments.",
    "faq.q6": "¿Qué plataformas necesito para el curso de Trading?",
    "faq.a6":
      "Necesitás TradingView (versión gratuita funciona) y un broker. Te enseñamos a configurar todo en el curso.",

    // Certificates
    "certificates.title": "CERTIFICADO DE FINALIZACIÓN",
    "certificates.subtitle": "Obtené un Certificado de Finalización privado y verificable por cada fase que completes",
    "certificates.earnTitle": "Certificá tu Conocimiento",
    "certificates.earnDesc": "Al completar cada nivel de nuestros programas, recibís un Certificado de Finalización emitido por FLOWDEX que acredita tu progreso en los contenidos del programa. Es un certificado privado, no un título oficial reconocido por organismos del Estado.",
    "lang": "es",

    // CTA Final
    "ctaFinal.title": "EL CAMINO TE ESPERA.",
    "ctaFinal.subtitle":
      "Si llegaste hasta acá, ya viste todo lo que ofrecemos. El método empieza cuando lo decidís vos.",
    "ctaFinal.primary": "Empezá por acá",
    "ctaFinal.secondary": "Ver todos los cursos",

    // Footer
    "footer.disclaimer":
      "FLOWDEX es una plataforma de educación financiera. El contenido es exclusivamente educativo e informativo. NO constituye asesoramiento financiero, recomendación de compra o venta de instrumentos financieros, ni garantía de rendimiento. Los ejemplos numéricos y casos históricos se incluyen con fines pedagógicos: rendimientos pasados no garantizan rendimientos futuros. Operar en mercados financieros (acciones, futuros, Forex, criptomonedas) conlleva riesgo de pérdida total del capital invertido. Antes de tomar decisiones de inversión, consultá a un asesor financiero registrado en la Comisión Nacional de Valores (CNV). FLOWDEX no se responsabiliza por las decisiones que el usuario tome basándose en el contenido de los cursos.",
    "footer.rights": "Todos los derechos reservados.",
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.investment": "Investment",
    "nav.trading": "Trading",
    "nav.innerCircle": "Inner Circle",
    "nav.membership": "Membership",
    "nav.start": "Create account",

    // Hero
    "hero.title": "YOU'RE IMPROVISING. THE MARKET KNOWS.",
    "hero.subtitle":
      "Learn to invest and trade with method, criteria, and real mentoring.",
    "hero.cta": "Find where to start",
    "hero.stat1": "Tracks",
    "hero.stat2": "Stages",
    "hero.stat3": "Modules",

    // Protocol
    "protocol.title": "HOW DOES FLOWDEX WORK?",
    "protocol.step1.title": "News channel",
    "protocol.step1.desc": "Telegram and Discord for news, offers and events",
    "protocol.step3.title": "Kickstart",
    "protocol.step3.desc": "Investment or Trading: real operational foundation with live classes and community.",
    "protocol.step4.title": "Advanced Level",
    "protocol.step4.desc": "Expert Investment or Trading Lab: method deepening with applied case work.",
    "protocol.step5.title": "Inner Circle",
    "protocol.step5.desc": "3 courses + mentorship + monthly membership",
    "protocol.telegramCta": "Join Telegram",
    "protocol.discordCta": "Join Discord",
    "protocol.instagramCta": "Follow on Instagram",

    // Two Paths
    "paths.title": "TWO PATHS, ONE DESTINATION.",
    "paths.investment": "INVESTMENT TRACK",
    "paths.trading": "TRADING TRACK",
    "paths.investmentDesc":
      "For those who want to build wealth over time: fundamental analysis, portfolio management and capital decisions with professional criteria.",
    "paths.tradingDesc":
      "For those who want to execute the market: a proprietary system on US futures, prop firms or own account, institutional reading and professional risk management.",

    // Courses
    "course.enroll": "Discover what you'll learn",
    "course.initial": "BEGINNER LEVEL",
    "course.advanced": "ADVANCED LEVEL",
    "course.syllabus": "Full Syllabus",

    // Inner Circle
    "innerCircle.badge": "EXCLUSIVE ACCESS",
    "innerCircle.badgeSub": "If you've completed Kickstart + Advanced, you can apply",
    "innerCircle.title": "FLOWDEX INNER CIRCLE",
    "innerCircle.subtitle": "Where your execution stops being intuition and starts being method.",
    "innerCircle.descPrefix":
      "Three advanced courses with mentorship by Franco and Augusto: two technical disciplines (Investing + Trading) and the ",
    "innerCircle.descHighlight": "Obra Maestra: 10 modules of personal development and operator psychology",
    "innerCircle.descSuffix": ".",
    "innerCircle.priceNote":
      "One-time payment · Full Inner Circle access.",
    "innerCircle.priceNoteOption":
      "The monthly follow-up membership is optional ($50/mo · 1st month included).",
    "innerCircle.urgencyNote":
      "We keep monthly mentorship capacity intentionally limited to protect feedback quality.",
    "innerCircle.workTitle": "WHAT WE WORK ON INSIDE",
    "innerCircle.work1Title": "The two exclusive disciplines: Flowdex Portfolio Method (Investing) and ORB Breakout (Trading)",
    "innerCircle.work1Desc":
      "Proprietary FPM system to build and manage portfolios, plus the ORB Breakout strategy with an exclusive TradingView indicator. Both exclusive disciplines of the circle — no need to choose.",
    "innerCircle.work2Title": "Obra Maestra · 10 operator modules",
    "innerCircle.work2Desc":
      "Foundational mindset, the 6 master emotions, cognitive biases, decisions under pressure and applied philosophy. The mental layer that sustains consistency.",
    "innerCircle.work3Title": "Personalized review of your trades",
    "innerCircle.work3Desc":
      "You post your trades in the circle's private channel. The team replies quickly via text, and every week Franco and Augusto review several trades from several students live. When the case calls for it, they reply with a personal 1-on-1 review.",
    "innerCircle.work4Title": "Proprietary Flowdex Indicators",
    "innerCircle.work4Desc":
      "ORB Breakout indicator and FVG Visual, developed by Franco for Flowdex. The tools we actually use in every session of the circle.",
    "innerCircle.work5Title": "First month of membership included",
    "innerCircle.work5Desc":
      "We automatically activate your first month of the monthly membership (USD 50/mo). It gives you full access to the IC private channel, team reviews and the 12 group sessions of the month (3 per week). The membership is not auto-charged: from month two onwards, you decide whether to renew.",
    "innerCircle.cta": "SEE THE FULL SYSTEM",
    "innerCircle.cardRibbon": "Top tier · Inner Circle",
    "innerCircle.cardChip": "Premium program · 12 months",
    "innerCircle.cardHighlight": "The Operator's Masterpiece",
    "innerCircle.cardTagline":
      "Continuous mentorship, personalized review and Flowdex's proprietary methods (FPM, ORB Breakout, Masterpiece) for 12 months.",
    "innerCircle.cardOutcomeLabel": "By year's end",
    "innerCircle.cardOutcome":
      "You go from trading with your own method to executing it under continuous professional supervision, with personalized review of your trades and frequent group mentorship.",
    "innerCircle.cardInclude1": "12 live group sessions per month (3 per week) — first month included, then via the monthly membership",
    "innerCircle.cardInclude2": "Personalized review of your trades",
    "innerCircle.cardInclude3": "3 advanced courses: Investing, Trading and Operator Psychology",
    "innerCircle.cardInclude4": "Proprietary indicators on TradingView",
    "innerCircle.cardInclude5": "Closed Inner Circle community",
    "innerCircle.cardPrereq": "Requires having completed Expert Investment or Trading Lab",
    "innerCircle.cardInclude6": "12 months of access to the Inner Circle material",
    "innerCircle.cardCta": "Learn about the program",
    "innerCircle.prerequisites": "PREREQUISITES",
    "innerCircle.prerequisitesNote": "You must have completed one of these paths:",
    "innerCircle.prerequisitesInvestment": "Investments — Kickstart Investment + Expert Investment",
    "innerCircle.prerequisitesTrading": "Trading — Kickstart Trading + Trading Lab",
    "innerCircle.review1Quote":
      "For me, the game changer was the psychology and risk management layer. I stopped trading from anxiety and started executing a real plan. It shows in my numbers.",
    "innerCircle.review1Name": "Nicolas V.",
    "innerCircle.review1Role": "Active student · Inner Circle",
    "innerCircle.review2Quote":
      "I went from entering without context to having a clear process. With the ORB strategy and live feedback, my execution became much more consistent week after week.",
    "innerCircle.review2Name": "Camila R.",
    "innerCircle.review2Role": "Active student · Inner Circle",
    // Membership
    "membership.title": "BE PART OF THE CIRCLE",
    "membership.desc": "Ongoing support for those who have already chosen their path.",
    "membership.cta": "Subscribe",
    "membership.badge": "EXCLUSIVE · BE PART OF SOMETHING BIGGER",
    "membership.item1": "Market analysis when context is relevant",
    "membership.item2": "Live Q&A every Monday",
    "membership.item3": "Access to private signals channel",
    "membership.item4": "Active community of traders and investors",

    // Mentors
    "mentors.title": "WHO LEADS THE PROGRAM",
    "mentors.augusto.role": "Director of Investments",
    "mentors.augusto.focus":
      "Five years training investors who arrive exclusively through word-of-mouth, with no social media or paid advertising. His method spreads in the conversation of someone who applied it and chose to recommend it.",
    "mentors.augusto.focus2":
      "Combines fundamental analysis, macroeconomic reading and capital discipline to build portfolios that hold up over time. Creator of the Flowdex Portfolio Method (FPM).",
    "mentors.augusto.prestige":
      "Director of the investments program · Creator of the Flowdex Portfolio Method",
    "mentors.augusto.specialty1": "Advanced Fundamental Analysis · WACC, ROIC and MOAT",
    "mentors.augusto.specialty2": "Flowdex Portfolio Method · Portfolio construction and management",
    "mentors.augusto.specialty3": "Classical strategies: Value, Growth, All Weather, CAN SLIM",
    "mentors.augusto.specialty4": "Dividends, REITs and ETFs as professional income",
    "mentors.augusto.specialty5": "Applied macroeconomic reading for capital decisions",
    "mentors.augusto.quote":
      "The difference between losing and winning is in the process, not luck.",
    "mentors.frann.role": "Professional Trader",
    "mentors.frann.focus":
      "Over 10 years trading with a proprietary method on US futures. Leads the Trading program at Flowdex and develops the systems we teach inside the circle.",
    "mentors.frann.focus2":
      "Consistent, verifiable results in prop firms: approved evaluations and payouts collected over time. A system with a replicable process, not luck. The same operative he applies every day.",
    "mentors.frann.prestige":
      "Developer of the ORB Breakout Strategy and the Flowdex Indicators",
    "mentors.frann.specialty1": "ORB Breakout Strategy · Proprietary method on US futures",
    "mentors.frann.specialty2": "Intraday execution on MES and MNQ",
    "mentors.frann.specialty3": "FVG, Volume Profile and institutional liquidity reading",
    "mentors.frann.specialty4": "Prop Firms · Evaluation, drawdown management and payout",
    "mentors.frann.specialty5": "Proprietary TradingView indicators (ORB · FVG Visual)",
    "mentors.mediaContext": "Press · Canal 12 Misiones",
    "mentors.featuredArticle": "Trading through online platforms",
    "mentors.videoContext": "Video · Canal 12 Misiones",
    "mentors.featuredVideo": "#ElNoticiero: trading, the job of the future",
    "mentors.frann.quote":
      "The market rewards consistency and punishes impatience.",

    // Testimonials
    "testimonials.kicker": "Beta testers · Pre-launch phase",
    "testimonials.title": "WHAT EARLY TESTERS SAID ABOUT THE CONTENT",
    "testimonials.subtitle":
      "Beta testers who went through the courses before the official launch. Their testimonials reflect their experience with the material and the method, not financial results.",
    "testimonials.review1.name": "Matias R.",
    "testimonials.review1.role": "Beta tester · Trading Lab",
    "testimonials.review1.text":
      "I started out quite lost, and in two months my entire execution became structured. The best part was the follow-up: they point out exactly what to fix, no fluff.",
    "testimonials.review2.name": "Camila S.",
    "testimonials.review2.role": "Beta tester · Kickstart Investment",
    "testimonials.review2.text":
      "I used to watch random videos everywhere and still felt confused. Here I finally understood how to build a portfolio with clear criteria. Practical and direct.",
    "testimonials.review3.name": "Nicolas V.",
    "testimonials.review3.role": "Beta tester · Inner Circle · Trading",
    "testimonials.review3.text":
      "The key for me was the psychology and risk management work. I stopped trading out of anxiety and started executing a real plan, with discipline instead of impulse.",
    "testimonials.review4.name": "Florencia M.",
    "testimonials.review4.role": "Beta tester · Inner Circle · Investing",
    "testimonials.review4.text":
      "Weekly reviews are huge. Even with a full-time job, I can jump in for a bit and leave with a clear market read. You don't feel like you're doing this alone.",

    // FAQ
    "faq.title": "FREQUENTLY ASKED QUESTIONS",
    "faq.q1": "Do I need previous experience to start?",
    "faq.a1":
      "No, our Kickstart courses are designed for absolute beginners. We guide you step by step from the fundamentals.",
    "faq.q2": "What's the difference between Investment and Trading?",
    "faq.a2":
      "Investment builds long-term wealth with fundamental analysis and portfolio management. Trading operates markets in short time frames with structured systems and professional risk management.",
    "faq.q3": "Can I upgrade between levels?",
    "faq.a3":
      "Yes, if you bought Kickstart you can upgrade to advanced level by paying only the difference ($200 USD).",
    "faq.q4": "How do I access content after paying?",
    "faq.a4":
      "You get immediate access to the full content on the platform. Telegram includes additional content, updates, and extra material for students.",
    "faq.q5": "Are prices in USD? Can I pay in local currency?",
    "faq.a5":
      "Yes, prices are in USD. MercadoPago shows you the equivalent in local currency at checkout. We also accept cryptocurrency payments through NowPayments.",
    "faq.q6": "What platforms do I need for the Trading course?",
    "faq.a6":
      "You need TradingView (free version works) and a broker. We teach you how to set everything up in the course.",

    // Certificates
    "certificates.title": "CERTIFICATE OF COMPLETION",
    "certificates.subtitle": "Get a private, verifiable Certificate of Completion for each phase you finish",
    "certificates.earnTitle": "Certify Your Knowledge",
    "certificates.earnDesc": "Upon completing each level of our programs, you receive a FLOWDEX Certificate of Completion that accredits your progress through the program content. This is a private certificate, not an official title recognized by government bodies.",
    "lang": "en",

    // CTA Final
    "ctaFinal.title": "THE PATH AWAITS.",
    "ctaFinal.subtitle":
      "If you've made it this far, you've seen everything we offer. The method begins when you decide.",
    "ctaFinal.primary": "Start here",
    "ctaFinal.secondary": "See all courses",

    // Footer
    "footer.disclaimer":
      "FLOWDEX is a financial education platform. The content is exclusively educational and informative. It does NOT constitute financial advice, a recommendation to buy or sell financial instruments, or a guarantee of returns. Numerical examples and historical cases are included for pedagogical purposes: past performance does not guarantee future results. Trading in financial markets (stocks, futures, Forex, cryptocurrencies) carries a risk of total loss of capital. Before making investment decisions, consult a financial advisor registered with the corresponding regulatory body in your jurisdiction. FLOWDEX is not responsible for decisions users make based on the course content.",
    "footer.rights": "All rights reserved.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
