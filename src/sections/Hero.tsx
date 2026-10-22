import { useEffect, useRef } from 'react'
import { LiquidGlass } from '../components/LiquidGlass'
import { scrollState, scrollToTarget } from '../lib/scroll'

const AVATARS = ['/images/avatar-1.webp', '/images/avatar-3.webp', '/images/avatar-4.webp', '/images/avatar-5.webp']
const LOGOS = ['Quantix', 'Hyperion']

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null)

  // Parallax the helmet as the hero scrolls away.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const y = Math.min(scrollState.y, 900)
      if (imgRef.current) imgRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 + y * 0.0002})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="home" className="hero">
      <svg className="hero__rails" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 560 H520 L600 500 H1440" />
        <path d="M0 600 H540 L620 540 H1440" />
      </svg>

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow" data-reveal>Futuristic</p>
          <h1 className="hero__title" data-reveal>
            <span className="hero__index">05</span>
            New <span className="swoosh">Digital
              <svg viewBox="0 0 300 90" aria-hidden="true"><path d="M14 70 C 70 26, 220 6, 296 14 C 236 34, 130 62, 30 88" /></svg>
            </span>
            <br />Universe
          </h1>
          <div className="hero__cta" data-reveal>
            <a className="btn btn--dark" href="#services" onClick={(e) => { e.preventDefault(); scrollToTarget('#services') }}>Get Started</a>
            <a className="btn btn--link" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>Contact Us</a>
          </div>
        </div>

        <div className="hero__visual">
          <img ref={imgRef} src="/images/hero-helmet.webp" alt="Person wearing a white NeoTech VR headset" width={736} height={672} fetchPriority="high" />
          <LiquidGlass tone="light" className="hero__stat">
            <strong>47.2<small>%</small></strong>
            <span>Reality</span>
          </LiquidGlass>
        </div>

        <div className="hero__meta">
          <div className="trusted" data-reveal>
            <p>Trusted by Clients</p>
            <div className="trusted__row">
              <div className="avatars">
                {AVATARS.map((src) => <img key={src} src={src} alt="" width={40} height={40} loading="lazy" />)}
              </div>
              <strong>20+</strong>
            </div>
          </div>
          <div className="hero__blurb" data-reveal>
            <LiquidGlass tone="light" className="badge-round">8g</LiquidGlass>
            <p>In this futuristic realm, users can explore hyper-realistic virtual environments, interact with AI-driven avatars.</p>
          </div>
        </div>
      </div>

      <div className="hero__base">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H560 L640 80 H0 Z" /></svg>
        <div className="logos container">
          <span className="logos__line" />
          {LOGOS.map((l) => (
            <span key={l} className="logo-chip"><i /> {l}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
