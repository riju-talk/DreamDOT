"use client"

import { useEffect, useRef, useState } from "react"

const CLIPS = [
  "https://res.cloudinary.com/diaoy8eua/video/upload/q_auto,w_1280/v1731766738/Pages/morning_cup_coffee.mp4",
  "https://res.cloudinary.com/diaoy8eua/video/upload/q_auto,w_1280/v1731766738/Pages/code_on_desktop.mp4",
  "https://res.cloudinary.com/diaoy8eua/video/upload/q_auto,w_1280/v1731766740/Pages/reading_in_library.mp4",
  "https://res.cloudinary.com/diaoy8eua/video/upload/q_auto,w_1280/v1731766743/Pages/car_in_dessert.mp4",
]

const HOLD_MS = 6000

/**
 * Full-bleed crossfading video montage used as the landing page backdrop.
 * All clips stay mounted (muted, looping, inline) so crossfades never wait on a network
 * request; only the active clip is visible. Honors prefers-reduced-motion by freezing on
 * the first clip.
 */
export function VideoMontage() {
  const [active, setActive] = useState(0)
  const refs = useRef<Array<HTMLVideoElement | null>>([])

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const timer = setInterval(() => setActive((i) => (i + 1) % CLIPS.length), HOLD_MS)
    return () => clearInterval(timer)
  }, [])

  // Restart the incoming clip from 0 and make sure it is playing.
  useEffect(() => {
    const el = refs.current[active]
    if (!el) return
    el.currentTime = 0
    el.play().catch(() => {})
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el
          }}
          src={src}
          muted
          loop
          playsInline
          autoPlay={i === 0}
          preload={i === 0 ? "auto" : "metadata"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Legibility scrim: keeps text readable in both themes, fades to page background. */}
      <div className="absolute inset-0 bg-background/70 dark:bg-background/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_100%)] opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      {/* Progress ticks */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 gap-2 sm:flex">
        {CLIPS.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-700 ${
              i === active ? "w-8 bg-[#5a8c5a] dark:bg-primary" : "w-3 bg-foreground/25"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
