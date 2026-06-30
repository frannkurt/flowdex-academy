"use client"

import { useState, useEffect, useRef } from "react"
import { m as motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, BookOpen, ChevronLeft, Lock, LayoutDashboard, Compass, User, LogOut, PlayCircle } from "lucide-react"
import Image from "next/image"

// Contenidos
import { kickstartInvestmentContent, Block } from "@/lib/courses/kickstart-investment-content"
import { expertInvestmentContent } from "@/lib/courses/expert-investment-content"
import { OrbitalIcon } from "@/components/OrbitalIcon"

// --- STYLES & AUDIO ---
const moduleColors = {
  teal: {
    badge: "bg-[#7DD4C0]/10 text-[#7DD4C0] border-[#7DD4C0]/20",
    number: "text-[#7DD4C0]",
    border: "border-l-[#7DD4C0]",
    dot: "bg-[#7DD4C0]",
    highlight: "bg-[#7DD4C0]/8 border-[#7DD4C0]/25 text-[#7DD4C0]",
    icon: "text-[#7DD4C0]",
  },
  blue: {
    badge: "bg-[#5BB8D4]/10 text-[#5BB8D4] border-[#5BB8D4]/20",
    number: "text-[#5BB8D4]",
    border: "border-l-[#5BB8D4]",
    dot: "bg-[#5BB8D4]",
    highlight: "bg-[#5BB8D4]/8 border-[#5BB8D4]/25 text-[#5BB8D4]",
    icon: "text-[#5BB8D4]",
  },
  gold: {
    badge: "bg-[#D4B86A]/10 text-[#D4B86A] border-[#D4B86A]/20",
    number: "text-[#D4B86A]",
    border: "border-l-[#D4B86A]",
    dot: "bg-[#D4B86A]",
    highlight: "bg-[#D4B86A]/8 border-[#D4B86A]/25 text-[#D4B86A]",
    icon: "text-[#D4B86A]",
  },
}

const playMechanicalClick = () => {
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioCtor) {
      return
    }

    const ctx = new AudioCtor()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = "square" 
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05)
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    filter.type = "lowpass"
    filter.frequency.value = 1500

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  } catch {
    console.log("Audio no soportado")
  }
}

// --- RENDER BLOCK ---
function RenderBlock({ block, colors }: { block: Block; colors: (typeof moduleColors)["teal"] }) {
  if (block.type === "intro") return <p className="text-lg font-serif leading-relaxed text-[#E0E0E0] border-l-2 border-[#2A2A2A] pl-5 italic">{block.text}</p>
  if (block.type === "paragraph") return <p className="text-[15px] font-serif leading-relaxed text-[#CCCCCC]">{block.text}</p>
  if (block.type === "list") return (
    <ul className="space-y-3">
      {block.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] font-serif">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
          <span className="text-[#CCCCCC]">
            {item.label && <span className="font-sans font-medium text-white">{item.label}:{" "}</span>}
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  )
  if (block.type === "concept") return (
    <div className={`flex flex-col items-start gap-2 rounded-lg border px-5 py-4 sm:flex-row sm:items-center sm:gap-4 ${colors.highlight}`}>
      <span className="shrink-0 text-xs font-sans font-semibold uppercase tracking-wider">{block.label}</span>
      <span className="hidden h-5 w-px shrink-0 bg-current opacity-35 sm:inline-block" />
      <span className="text-[14px] font-serif leading-relaxed opacity-90">{block.text}</span>
    </div>
  )
  if (block.type === "highlight") return (
    <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-6 py-5">
      <p className="text-[15px] font-serif leading-relaxed text-[#E8E8E8]">{block.text}</p>
    </div>
  )
  if (block.type === "example") {
    const itemCount = block.items.length
    const cols = itemCount <= 5 ? itemCount : itemCount === 6 || itemCount === 9 ? 3 : 4
    return (
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden">
        <div className="border-b border-[#2A2A2A] px-5 py-3">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[#888888]">Ejemplo Práctico</p>
        </div>
        <div className="flex flex-wrap gap-px bg-[#2A2A2A]">
          {block.items.map((item, i) => (
            <div key={i} style={{ flexBasis: `calc(${100 / cols}% - 1px)`, minWidth: 140, flexGrow: 1, flexShrink: 0 }} className="flex flex-col items-center justify-start gap-2 bg-[#0F0F0F] px-5 py-4 text-center">
              <p className={`text-2xl font-sans font-bold leading-tight ${colors.number}`}>{item.label}</p>
              <p className="max-w-[24ch] text-xs font-sans leading-[1.45] text-[#888888]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (block.type === "image") return (
    <figure className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F]">
      <div className="min-h-[220px] flex items-center justify-center px-6 py-8 text-center text-sm font-sans text-[#8B8B8B]">
        [Imagen: {block.alt}]
      </div>
      {block.caption && <figcaption className="border-t border-[#2A2A2A] px-5 py-3 text-xs font-sans text-[#8E8E8E]">{block.caption}</figcaption>}
    </figure>
  )
  if (block.type === "callout") return (
    <div className="rounded-xl border border-[#3A3A3A] bg-[#141414] px-6 py-5">
      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#7DD4C0]">{block.label}</p>
      <p className="mt-2 text-[15px] font-serif leading-relaxed text-[#D5D5D5]">{block.text}</p>
    </div>
  )
  return null
}

// --- CURSOS METADATA ---
const coursesData = {
  "kickstart-investment": {
    title: "Kickstart Investment",
    slug: "kickstart-investment",
    description: "Fundamentos esenciales antes de invertir, mercados e instrumentos.",
    content: kickstartInvestmentContent,
    image: "/Flowdex kickstart investment 1x1.png"
  },
  "expert-investment": {
    title: "Expert Investment",
    slug: "expert-investment",
    description: "Asset allocation avanzado, análisis fundamental y gestión institucional de riesgo.",
    content: expertInvestmentContent,
    image: "/Flowdex expert investment 1x1.png"
  }
}

type ViewState = 'dashboard' | 'course' | 'reader'

export default function LaboratorioPage() {
  const [view, setView] = useState<ViewState>('dashboard')
  const [activeCourseId, setActiveCourseId] = useState<"kickstart-investment" | "expert-investment">("kickstart-investment")
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  
  // Progress state per course
  const [progress, setProgress] = useState<Record<string, number[]>>({
    "kickstart-investment": [],
    "expert-investment": []
  })

  const currentCourse = coursesData[activeCourseId]
  const currentCompletedModules = progress[activeCourseId] || []
  const totalModules = currentCourse.content.length
  const progressPercent = Math.min(100, Math.round((currentCompletedModules.length / totalModules) * 100))

  const handleComplete = () => {
    if (activeModuleIndex === null) return
    playMechanicalClick()
    
    if (!currentCompletedModules.includes(activeModuleIndex)) {
      setProgress(prev => ({
        ...prev,
        [activeCourseId]: [...(prev[activeCourseId] || []), activeModuleIndex]
      }))
    }
    
    setTimeout(() => {
      setActiveModuleIndex(null)
      setView('course')
    }, 1200)
  }

  const openCourse = (courseId: "kickstart-investment" | "expert-investment") => {
    setActiveCourseId(courseId)
    setView('course')
  }

  // --- VISTA 1: DASHBOARD (Místico) ---
  const renderDashboard = () => (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar Premium */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        className="hidden md:flex w-64 flex-col border-r border-[#1A1A1A] bg-[#0A0A0A]/50 backdrop-blur-xl relative z-20"
      >
        <div className="p-8">
          <OrbitalIcon size={40} />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A] text-white border border-[#2A2A2A]">
            <LayoutDashboard size={18} className="text-[#7DD4C0]" />
            <span className="text-sm font-medium tracking-wide">Panel de Control</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#888] hover:bg-[#111] hover:text-white transition-all">
            <Compass size={18} />
            <span className="text-sm tracking-wide">Catálogo Premium</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#888] hover:bg-[#111] hover:text-white transition-all">
            <User size={18} />
            <span className="text-sm tracking-wide">Mi Perfil</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#1A1A1A]">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#666] hover:text-white transition-all">
            <LogOut size={18} />
            <span className="text-sm tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#5BB8D4]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#7DD4C0]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7DD4C0] mb-3">Bienvenido de vuelta</p>
            <h1 className=" text-5xl text-white tracking-tight mb-2">Tu Ecosistema</h1>
            <p className="text-[#888] text-lg max-w-2xl">Continúa tu formación en alto rendimiento financiero.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm uppercase tracking-[0.2em] text-[#555]">Tus Programas Activos</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Course Card 1: Kickstart */}
              <div 
                onClick={() => openCourse('kickstart-investment')}
                className="group relative rounded-3xl border border-[#1A1A1A] bg-gradient-to-b from-[#111111] to-[#0A0A0A] overflow-hidden hover:border-[#5BB8D4]/40 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5BB8D4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5BB8D4] bg-[#5BB8D4]/10 px-3 py-1.5 rounded-full border border-[#5BB8D4]/20">Iniciación</span>
                  </div>
                  <h3 className=" text-3xl text-white mb-3 group-hover:text-[#5BB8D4] transition-colors">Kickstart Investment</h3>
                  <p className="text-sm text-[#888] line-clamp-2 min-h-[40px]">{coursesData["kickstart-investment"].description}</p>
                  
                  <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
                    <div className="flex justify-between items-center text-xs text-[#666] mb-3">
                      <span className="uppercase tracking-widest">Progreso</span>
                      <span className="font-mono text-white">
                        {Math.round((progress["kickstart-investment"].length / coursesData["kickstart-investment"].content.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#5BB8D4]" 
                        style={{ width: `${(progress["kickstart-investment"].length / coursesData["kickstart-investment"].content.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Card 2: Expert */}
              <div 
                onClick={() => openCourse('expert-investment')}
                className="group relative rounded-3xl border border-[#1A1A1A] bg-gradient-to-b from-[#111111] to-[#0A0A0A] overflow-hidden hover:border-[#D4B86A]/40 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4B86A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4B86A] bg-[#D4B86A]/10 px-3 py-1.5 rounded-full border border-[#D4B86A]/20">Avanzado</span>
                  </div>
                  <h3 className=" text-3xl text-white mb-3 group-hover:text-[#D4B86A] transition-colors">Expert Investment</h3>
                  <p className="text-sm text-[#888] line-clamp-2 min-h-[40px]">{coursesData["expert-investment"].description}</p>
                  
                  <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
                    <div className="flex justify-between items-center text-xs text-[#666] mb-3">
                      <span className="uppercase tracking-widest">Progreso</span>
                      <span className="font-mono text-white">
                        {Math.round((progress["expert-investment"].length / coursesData["expert-investment"].content.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D4B86A]" 
                        style={{ width: `${(progress["expert-investment"].length / coursesData["expert-investment"].content.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Courses / Labs */}
            <h2 className="text-sm uppercase tracking-[0.2em] text-[#555] mt-16 mb-6">Laboratorios Disponibles</h2>
            <div className="rounded-3xl border border-[#111] bg-[#0A0A0A] p-6 sm:p-8 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
                  <Lock size={24} className="text-[#555]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Práctica en Vivo</p>
                  <h3 className=" text-2xl text-white">Trading Lab</h3>
                </div>
              </div>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#555] border border-[#222] px-4 py-2 rounded-lg">Bloqueado</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )

  // --- VISTA 2: COURSE DETAIL ---
  const renderCourseDetail = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#050505] text-white">
      {/* Minimal Top Nav */}
      <div className="sticky top-0 z-50 flex items-center px-6 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-[#1A1A1A]">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-[#888] hover:text-white transition-colors group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-medium">Volver al Ecosistema</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* HEADER EPIC */}
        <div className="relative rounded-3xl border border-[#1A1A1A] bg-[#0A0A0A] overflow-hidden mb-16 p-8 md:p-12">
          {/* Subtle background glow based on course */}
          <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${activeCourseId === 'expert-investment' ? 'from-[#D4B86A]/10' : 'from-[#5BB8D4]/10'} to-transparent opacity-50`} />
          
          <div className="relative z-10 max-w-2xl">
            <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-4 ${activeCourseId === 'expert-investment' ? 'text-[#D4B86A]' : 'text-[#7DD4C0]'}`}>
              Programa de Estudio
            </p>
            <h1 className=" text-5xl md:text-6xl tracking-tight leading-tight mb-6">{currentCourse.title}</h1>
            <p className="text-[#AAA] text-lg leading-relaxed">{currentCourse.description}</p>
            
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-[#111] px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#CCC]">Acceso Verificado</span>
            </div>
          </div>
        </div>

        {/* INSTRUCTOR MISTICO */}
        <div className="mb-20 flex flex-col md:flex-row items-center md:items-start gap-8 py-10 border-y border-[#1A1A1A]">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-[#2A2A2A] shrink-0">
            <Image src="/augustoblancoynegro.jpg" alt="Augusto Holman" fill className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">Director de Inversiones</p>
            <h2 className=" text-4xl mb-4">Augusto Holman</h2>
            <p className="text-[15px] leading-relaxed text-[#888] font-serif max-w-2xl">
              Especialista en asset allocation, análisis fundamental y gestión de riesgo. En este programa Augusto te guía paso a paso para convertir fundamentos financieros en decisiones de inversión claras, medibles y sostenibles.
            </p>
          </div>
        </div>

        {/* INDICE / MODULES */}
        <div className="space-y-4">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#2A2A2A]">
            <h3 className=" text-3xl text-white">Contenido Temático</h3>
            <span className="text-xs font-mono text-[#666]">{progressPercent}% Completado</span>
          </div>
          
          {currentCourse.content.map((mod, idx) => {
            const isCompleted = currentCompletedModules.includes(idx)
            const colors = moduleColors[mod.color as keyof typeof moduleColors]
            
            return (
              <motion.div 
                key={mod.number} 
                whileHover={{ scale: 1.01 }}
                className={`relative group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isCompleted ? "border-[#2A2A2A] bg-[#0A0A0A]" : "border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#333]"
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCompleted ? colors.dot : 'bg-transparent group-hover:bg-[#2A2A2A]'}`} />
                
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pl-8">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#555] mb-2 font-bold">
                      {mod.number === 0 ? "Fase 00" : `Fase ${String(mod.number).padStart(2, "0")}`}
                    </p>
                    <h4 className=" text-2xl text-[#EAEAEA] mb-2">{mod.title}</h4>
                    <p className="text-sm text-[#777] leading-relaxed max-w-xl">{mod.subtitle}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setActiveModuleIndex(idx)
                      setView('reader')
                    }}
                    className={`shrink-0 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border transition-all ${
                      isCompleted 
                        ? `border-${mod.color === 'blue' ? '[#5BB8D4]' : mod.color === 'gold' ? '[#D4B86A]' : '[#7DD4C0]'}/30 bg-white/5 text-white` 
                        : "border-[#2A2A2A] bg-[#111] text-[#AAA] hover:text-white hover:bg-[#1A1A1A]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={18} className={colors.icon} /> : <PlayCircle size={18} />}
                    <span className="text-sm font-medium tracking-wide">{isCompleted ? "Completado" : "Iniciar Inmersión"}</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )

  // --- VISTA 3: CINEMATIC READER ---
  const readerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (view === 'reader' && readerRef.current) {
      readerRef.current.scrollTo(0, 0)
    }
  }, [view])

  const renderCinematicReader = () => {
    if (activeModuleIndex === null) return null
    const activeModule = currentCourse.content[activeModuleIndex]
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-[#020202] overflow-y-auto"
        ref={readerRef}
      >
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sticky top-0 w-full flex justify-between items-center px-6 py-6 bg-gradient-to-b from-[#020202] via-[#020202]/90 to-transparent z-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setActiveModuleIndex(null)
                setView('course')
              }}
              className="px-4 py-2 text-[#666] hover:text-white transition-colors rounded-full hover:bg-white/5 flex items-center gap-2 border border-transparent hover:border-[#222]"
            >
              <ChevronLeft size={16} />
              <span className="text-xs uppercase tracking-widest font-medium">Cerrar Lector</span>
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#444] font-bold">
              {currentCourse.title}
            </span>
            <span className="text-xs text-[#888] font-mono mt-1">Módulo {activeModule.number}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-[700px] mx-auto px-6 py-12 pb-40"
        >
          {/* Reader Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-2 h-2 rounded-full ${moduleColors[activeModule.color as keyof typeof moduleColors].dot}`} />
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#555] font-bold">
                {activeModule.number === 0 ? "Apertura" : `Fase ${activeModule.number}`}
              </p>
            </div>
            <h2 className=" text-4xl md:text-5xl tracking-tight text-[#EDEDED] mb-4">
              {activeModule.title}
            </h2>
            <p className="text-lg font-serif text-[#888] leading-relaxed">{activeModule.subtitle}</p>
          </div>

          <div className="flex flex-col gap-12">
            {activeModule.sections.map((section, sIdx) => {
              const colors = moduleColors[activeModule.color as keyof typeof moduleColors]
              return (
                <div key={sIdx} className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    {section.icon && <span className={`text-2xl opacity-80 ${colors.icon}`}>{section.icon}</span>}
                    <h3 className=" text-[#FFF] text-2xl tracking-wide">{section.title}</h3>
                  </div>
                  <div className="space-y-6">
                    {section.blocks.map((block, bIdx) => (
                      <RenderBlock key={bIdx} block={block} colors={colors} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-24 pt-12 border-t border-[#111] flex flex-col items-center">
            <motion.button
              onClick={handleComplete}
              disabled={currentCompletedModules.includes(activeModuleIndex)}
              whileHover={!currentCompletedModules.includes(activeModuleIndex) ? { scale: 1.02 } : {}}
              whileTap={!currentCompletedModules.includes(activeModuleIndex) ? { scale: 0.98 } : {}}
              className={`relative overflow-hidden flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-2xl border transition-all duration-500 ${
                currentCompletedModules.includes(activeModuleIndex) 
                  ? "border-[#7DD4C0]/40 bg-[#7DD4C0]/5 text-[#7DD4C0]" 
                  : "border-[#333] bg-[#0A0A0A] text-[#AAA] hover:text-white hover:border-[#5BB8D4]/60 hover:bg-[#111]"
              }`}
            >
              <AnimatePresence mode="wait">
                {currentCompletedModules.includes(activeModuleIndex) ? (
                  <motion.div key="check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">Registrado con éxito</span>
                  </motion.div>
                ) : (
                  <motion.div key="text" exit={{ opacity: 0, y: -20 }} className="flex items-center gap-3">
                    <BookOpen size={18} className="opacity-70" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase">Marcar como aprendido</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentCompletedModules.includes(activeModuleIndex) && (
                <motion.div initial={{ opacity: 0.5, scale: 1 }} animate={{ opacity: 0, scale: 3 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-[#7DD4C0] mix-blend-screen pointer-events-none" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#5BB8D4]/30 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && <motion.div key="dashboard" className="w-full min-h-screen">{renderDashboard()}</motion.div>}
        {view === 'course' && <motion.div key="course" className="w-full min-h-screen">{renderCourseDetail()}</motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {view === 'reader' && renderCinematicReader()}
      </AnimatePresence>
    </div>
  )
}
