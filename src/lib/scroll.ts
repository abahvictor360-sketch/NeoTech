import Lenis from 'lenis'

/** Shared scroll state, read every frame by the 3D world (no React re-renders). */
export const scrollState = { progress: 0, velocity: 0, y: 0 }

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function startSmoothScroll() {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.y = window.scrollY
    scrollState.progress = max > 0 ? window.scrollY / max : 0
  }

  if (prefersReducedMotion) {
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }

  lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1.2, touchMultiplier: 1.5, smoothWheel: true })
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity
    update()
  })
  let raf = 0
  const loop = (t: number) => {
    lenis?.raf(t)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  update()
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'string' ? -24 : 0 })
  else if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}
