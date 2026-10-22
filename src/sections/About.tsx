import { LiquidGlass } from '../components/LiquidGlass'
import { Play } from '../components/Icons'

export function About({ onWatch }: { onWatch: () => void }) {
  return (
    <section id="about" className="about container">
      <div className="about__visual" data-reveal>
        <div className="about__halo" />
        <img src="/images/orange-visor-cut.webp" alt="Portrait with a glowing orange light visor" width={736} height={1308} loading="lazy" />
      </div>
      <div className="about__copy">
        <p className="eyebrow eyebrow--spaced" data-reveal>About us</p>
        <h2 className="h2" data-reveal>The Digital<br />Frontier</h2>
        <div className="tags" data-reveal>
          {['Digital', 'Reality', 'Next'].map((t) => <LiquidGlass key={t} as="span" className="tag">{t}</LiquidGlass>)}
        </div>
        <p className="muted" data-reveal>
          Step into The Digital Frontier, where the boundaries between reality and virtual innovation disappear.
          This is the next era of immersive technology — headsets, wearables and intelligent companions designed as one universe.
        </p>
        <div className="about__actions" data-reveal>
          <LiquidGlass as="a" href="#services" className="btn btn--glass">Learn More</LiquidGlass>
          <button className="btn btn--link btn--light" onClick={onWatch}>
            <span className="play-dot"><Play width={12} height={12} /></span> Watch a Video
          </button>
        </div>
      </div>
    </section>
  )
}
