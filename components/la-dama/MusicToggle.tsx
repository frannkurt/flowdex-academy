"use client"

import { useEffect, useRef, useState } from "react"
import { Music2, Pause, Play, RotateCcw, Volume2, X } from "lucide-react"

// ID del video de YouTube. Lo encontrás en la URL: youtube.com/watch?v=<ID>
// Por ejemplo, en https://www.youtube.com/watch?v=Th5_SOnXFp4, el ID es Th5_SOnXFp4.
const YOUTUBE_VIDEO_ID = "vaXNdVTGT0k"

// Volumen inicial (0-100)
const INITIAL_VOLUME = 50

// Tipado mínimo para la API global de YouTube
type YouTubePlayerApi = {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  setVolume: (volume: number) => void
  getPlayerState: () => number
  destroy: () => void
}

type YouTubePlayerEvent = {
  target: YouTubePlayerApi
  data: number
}

type YouTubeApi = {
  Player: new (
    el: HTMLElement | string,
    config: {
      height?: string | number
      width?: string | number
      videoId: string
      playerVars?: Record<string, unknown>
      events?: {
        onReady?: (event: YouTubePlayerEvent) => void
        onStateChange?: (event: YouTubePlayerEvent) => void
        onError?: (event: { data: number }) => void
      }
    }
  ) => YouTubePlayerApi
}

declare global {
  interface Window {
    YT: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

export function MusicToggle() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(INITIAL_VOLUME)
  const [ready, setReady] = useState(false)

  const playerRef = useRef<YouTubePlayerApi | null>(null)
  const mountRef = useRef<HTMLDivElement | null>(null)

  // Cargar la API de YouTube una sola vez y crear el player
  useEffect(() => {
    if (typeof window === "undefined") return

    let isMounted = true

    const createPlayer = () => {
      if (!isMounted || !mountRef.current || playerRef.current) return
      
      try {
        playerRef.current = new window.YT.Player(mountRef.current, {
          height: "1",
          width: "1",
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            start: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return
              event.target.setVolume(INITIAL_VOLUME)
              setReady(true)
            },
            onStateChange: (event) => {
              if (!isMounted) return
              // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
              if (event.data === 1) setPlaying(true)
              if (event.data === 2 || event.data === 0) setPlaying(false)
            },
            onError: (event) => {
              console.error("YouTube Player Error:", event.data)
            }
          },
        })
      } catch (error) {
        console.error("Error creating YouTube Player:", error)
      }
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      const existing = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
      if (!existing) {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        tag.async = true
        document.body.appendChild(tag)
      }
      
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback()
        createPlayer()
      }
    }

    return () => {
      isMounted = false
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch {}
        playerRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    const player = playerRef.current
    if (!player || !ready) return
    if (playing) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    playerRef.current?.setVolume(value)
  }

  const restartTrack = () => {
    const player = playerRef.current
    if (!player || !ready) return
    player.seekTo(0, true)
    player.playVideo()
  }

  return (
    <>
      {/* Mount oculto del player de YouTube — el iframe se monta acá y queda invisible */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div key="yt-mount" ref={mountRef} />
      </div>

      <div className="relative inline-flex flex-col items-center">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar música" : "Abrir música"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4B86A]/50 bg-[#0A0A0A]/70 text-[#D4B86A] backdrop-blur-md transition duration-300 hover:border-[#D4B86A] hover:bg-[#161616]"
        >
          <Music2 size={16} />
        </button>

        {open && (
          <div className="absolute left-1/2 top-full z-30 mt-3 w-[300px] -translate-x-1/2 overflow-hidden rounded-xl border border-[#D4B86A]/20 bg-[#0A0A0A]/95 shadow-2xl backdrop-blur-md sm:left-full sm:top-1/2 sm:ml-3 sm:mt-0 sm:translate-x-0 sm:-translate-y-1/2">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4B86A]/70">
                Bandoneón
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar reproductor"
                className="text-[#666666] transition-colors hover:text-[#E8E8E8]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-4 py-4">
              {/* Play / Restart */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  disabled={!ready}
                  aria-label={playing ? "Pausa" : "Reproducir"}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4B86A]/50 bg-[#161616] text-[#D4B86A] transition hover:border-[#D4B86A] hover:bg-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {playing ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={restartTrack}
                  disabled={!ready}
                  aria-label="Volver al inicio"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#888888] transition hover:border-[#D4B86A]/40 hover:text-[#D4B86A]/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={12} />
                </button>
                <div className="ml-auto text-right">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#666666]">
                    {ready ? (playing ? "Sonando" : "En pausa") : "Cargando"}
                  </p>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <Volume2 size={12} className="text-[#666666]" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  disabled={!ready}
                  className="flex-1 accent-[#D4B86A] disabled:opacity-40"
                  aria-label="Volumen"
                />
                <span className="w-7 text-right text-[10px] tabular-nums text-[#666666]">
                  {volume}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
