"use client";

import { m as motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { fadeUpProps, fadeUpPropsWithDelay } from "@/lib/motion";

type AcreditacionItem = {
  badge: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  imageAlt: string;
  imageScale?: string;
};

export default function Certificates() {
  const { t } = useLanguage();
  const isEn = t("lang") === "en";

  const items: AcreditacionItem[] = [
    {
      badge: isEn ? "Completion" : "Finalización",
      title: isEn ? "Certificate of Completion" : "Certificado de Finalización",
      description: isEn
        ? "Private digital document issued by FLOWDEX when you finish each phase of the program."
        : "Documento digital privado emitido por FLOWDEX al completar cada fase del programa.",
      detail: isEn
        ? "With unique verification ID. Not an official title."
        : "Incluye ID único de verificación. No es título oficial.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado%20formato%20correcto.png-cUzqh5iD1YUo9q3gC1kLvPgr28DtMY.jpeg",
      imageAlt: "FLOWDEX Certificate of Completion",
    },
    {
      badge: isEn ? "Trading path" : "Ruta Trading",
      title: isEn ? "Trading badges" : "Badges Ruta Trading",
      description: isEn
        ? "A different digital badge for every level: Kickstart Trading, Trading Lab and Inner Circle."
        : "Una insignia digital distinta por cada nivel: Kickstart Trading, Trading Lab e Inner Circle.",
      detail: isEn
        ? "Shareable on LinkedIn, X, your CV and anywhere it makes sense."
        : "Para compartir en LinkedIn, X, CV y donde tenga sentido.",
      image: "/trading-badges-optimized.jpg",
      imageAlt: "Trading Badges — Kickstart Trading, Trading Lab, Inner Circle",
      imageScale: "scale-110",
    },
    {
      badge: isEn ? "Investment path" : "Ruta Inversión",
      title: isEn ? "Investment badges" : "Badges Ruta Inversión",
      description: isEn
        ? "A different digital badge for every level: Kickstart Investment, Expert Investment and Inner Circle."
        : "Una insignia digital distinta por cada nivel: Kickstart Investment, Expert Investment e Inner Circle.",
      detail: isEn
        ? "Shareable on LinkedIn, X, your CV and anywhere it makes sense."
        : "Para compartir en LinkedIn, X, CV y donde tenga sentido.",
      image: "/investment-badges-optimized.jpg",
      imageAlt: "Investment Badges — Kickstart Investment, Expert Investment, Inner Circle",
      imageScale: "scale-110",
    },
  ];

  return (
    <section className="section-divider-smooth py-20 md:py-24 px-4 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute top-1/2 left-[8%] h-72 w-72 -translate-y-1/2 rounded-full bg-[#5BB8D4]/[0.04] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-[8%] h-72 w-72 -translate-y-1/2 rounded-full bg-[#7DD4C0]/[0.04] blur-[140px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title block */}
        <motion.div
          {...fadeUpProps}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 px-3 py-1.5 rounded-full border border-[#2A2A2A] bg-[#111111] text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0]">
            {isEn ? "Accreditation · Certificates + Badges" : "Acreditación · Certificados + Badges"}
          </div>
          <h2 className="type-display-lg text-white">
            {isEn ? (
              <>
                Knowledge isn’t promised,
                <br className="hidden md:block" /> it’s accredited.
              </>
            ) : (
              <>
                El conocimiento no se promete, se acredita.
              </>
            )}
          </h2>
          <p className="mt-5 text-[#888888] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isEn
              ? "Each phase of the path has its proof: you get a private completion certificate and a digital badge to share wherever it makes sense."
              : "Cada fase del camino tiene su prueba: obtenés un certificado privado de finalización y un badge digital para compartir donde tenga sentido."}
          </p>
        </motion.div>

        {/* Stacked horizontal cards */}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              {...fadeUpPropsWithDelay(index * 0.08)}
              className="rounded-2xl border border-[#2A2A2A] bg-[#0D0D0D] overflow-hidden hover:border-[#7DD4C0]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-stretch">
                {/* Image on the left */}
                <div className="sm:w-[220px] sm:flex-shrink-0 relative bg-gradient-to-br from-[#111111] to-[#0A0A0A] flex items-center justify-center overflow-hidden">
                  <div className="relative aspect-square w-full sm:aspect-auto sm:h-full">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="220px"
                      className={`object-cover ${item.imageScale ?? ""}`}
                      quality={82}
                    />
                  </div>
                </div>

                {/* Text on the right */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#7DD4C0] font-semibold mb-2">
                    {item.badge}
                  </p>
                  <h3 className="type-headline text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">{item.description}</p>
                  <p className="mt-2 text-xs text-[#666666] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-center mt-8 text-[11px] uppercase tracking-[0.2em] text-[#555555]">
          {isEn
            ? "Certificate + digital badge included in every course"
            : "Certificado + badge digital incluidos en cada curso"}
        </p>
      </div>
    </section>
  );
}
