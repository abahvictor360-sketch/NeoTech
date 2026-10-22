import { useEffect, useState } from 'react'
import { LiquidGlass } from './LiquidGlass'
import { Close } from './Icons'

const FRAMES = [
  { src: '/images/vision-blue.webp', caption: 'Spatial computing', pos: '50% 45%' },
  { src: '/images/orange-visor.webp', caption: 'Light-field displays', pos: '50% 30%' },
  { src: '/images/sphere.webp', caption: 'Autonomous intelligence', pos: '50% 45%' },
  { src: '/images/ring-dark.webp', caption: 'Smart wearables', pos: '50% 45%' },
  { src: '/images/robot-hands.webp', caption: 'Digital assistants', pos: '50% 55%' },
  { src: '/images/car.webp', caption: 'Hover mobility', pos: '50% 55%' },
  { src: '/images/purple-vr.webp', caption: 'Immersive gaming', pos: '50% 35%' },
]

/** A Ken-Burns showreel of the NeoTech universe. */
export function Showreel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!open) return
    setI(0)
    const id = setInterval(() => setI((n) => (n + 1) % FRAMES.length), 3200)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearInterval(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="reel" role="dialog" aria-modal="true" aria-label="NeoTech showreel" onClick={onClose}>
      <div className="reel__stage" onClick={(e) => e.stopPropagation()}>
        {FRAMES.map((f, n) => (
          <img key={f.src} src={f.src} alt={f.caption} className={n === i ? 'is-active' : ''} style={{ objectPosition: f.pos }} />
        ))}
        <p className="reel__caption" key={i}>{FRAMES[i].caption}</p>
        <div className="reel__progress">
          {FRAMES.map((f, n) => <span key={f.src} className={n === i ? 'is-active' : n < i ? 'is-done' : ''} />)}
        </div>
        <LiquidGlass as="button" className="reel__close" aria-label="Close showreel" onClick={onClose}><Close width={18} height={18} /></LiquidGlass>
      </div>
    </div>
  )
}
