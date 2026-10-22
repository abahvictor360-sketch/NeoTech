import { useEffect, useState } from 'react'

const TABS = [
  { key: 'Innovation', img: '/images/sphere.webp', fit: 'contain', title: 'How VR is Transforming Our Digital World', text: 'Virtual Reality (VR) is no longer a concept of the future — it’s actively reshaping how we interact, work, and entertain ourselves.', date: '05 February 2026', author: 'Henry Leonardo' },
  { key: 'Technology', img: '/images/ring-dark.webp', fit: 'contain', title: 'The Future Is On Your Finger', text: 'Heart-rate, sleep, NFC payments and biometric identity, packed into a titanium ring that disappears into your day.', date: '18 March 2026', author: 'Amara Okafor' },
  { key: 'Experience', img: '/images/ar-glasses.webp', fit: 'cover', title: 'Augmented Reality, Everyday', text: 'Lightweight AR glasses layer live information over the world around you — directions, translation and data at a glance.', date: '02 May 2026', author: 'Kenji Watanabe' },
]

export function Possibilities() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((a) => (a + 1) % TABS.length), 6000)
    return () => clearInterval(id)
  }, [paused])

  const tab = TABS[active]
  return (
    <section className="poss container" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <h2 className="h2 poss__title" data-reveal>Limitless Possibilities<br />with NeoTech</h2>
      <div className="poss__grid" data-reveal>
        <div className="poss__tabs" role="tablist" aria-label="Topics">
          {TABS.map((t, i) => (
            <button key={t.key} role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)}>
              {t.key}
            </button>
          ))}
        </div>
        <div className="poss__media">
          {/* Portrait shots are shown whole over a blurred copy of themselves instead of being cropped to a strip. */}
          {TABS.map((t, i) => (
            <div key={t.key} className={`poss__slide poss__slide--${t.fit} ${i === active ? 'is-active' : ''}`}>
              {t.fit === 'contain' && <img src={t.img} alt="" aria-hidden="true" className="poss__fill" loading="lazy" />}
              <img src={t.img} alt={t.title} loading="lazy" />
            </div>
          ))}
        </div>
        <article className="poss__article" key={tab.key} role="tabpanel">
          <h3>{tab.title}</h3>
          <p className="muted">{tab.text}</p>
          <a href="#contact" className="link-more">Learn More</a>
          <footer>
            <span>{tab.date}</span>
            <span>{tab.author}</span>
          </footer>
        </article>
      </div>
    </section>
  )
}
