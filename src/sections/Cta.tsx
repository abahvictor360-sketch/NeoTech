import { LiquidGlass } from '../components/LiquidGlass'
import { Play } from '../components/Icons'

export function Cta({ onWatch }: { onWatch: () => void }) {
  return (
    <section className="cta container" data-reveal>
      <div className="cta__card">
        <img src="/images/green-vr.webp" alt="" loading="lazy" />
        <h2 className="h2 cta__title">Dive into the<br />Future</h2>
        <LiquidGlass as="button" className="cta__play" aria-label="Play showreel" onClick={onWatch}>
          <Play width={18} height={18} />
        </LiquidGlass>
        <p className="cta__text">
          Immerse yourself in the groundbreaking world of NeoTech. Explore the limitless possibilities of futuristic
          technology and virtual reality.
        </p>
      </div>
    </section>
  )
}
