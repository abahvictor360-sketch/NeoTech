import { LiquidGlass } from '../components/LiquidGlass'

const VOICES = [
  { quote: 'NeoTech completely transformed the way I interact with virtual reality.', name: 'James Rizaki', img: '/images/avatar-2.webp' },
  { quote: 'Our team has adopted NeoTech’s VR collaboration tools — meetings feel like being in the same room.', name: 'Samantha Leonardo', img: '/images/avatar-1.webp' },
  { quote: 'I’ve been gaming in VR for years, but NeoTech’s technology is on another level.', name: 'Mark Trevor', img: '/images/avatar-5.webp' },
]

export function Testimonials() {
  return (
    <section className="voices container">
      <svg className="voices__wave" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 330 C 260 300, 380 170, 640 200 S 1060 330, 1460 120" />
      </svg>
      <div className="voices__intro">
        <h2 className="h2" data-reveal>Voices of the<br />Future</h2>
        <span className="rule" data-reveal />
        <p className="muted" data-reveal>
          Here, you’ll hear firsthand from users, pioneers, and tech enthusiasts who are shaping the next generation
          of virtual reality and futuristic technology. Explore their stories and discover how we are transforming
          the way we interact with the digital world.
        </p>
      </div>
      <div className="voices__list">
        {VOICES.map((v, i) => (
          <LiquidGlass key={v.name} as="figure" className="voice" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
            <blockquote>{v.quote}</blockquote>
            <figcaption>{v.name}</figcaption>
            <img src={v.img} alt="" width={56} height={56} loading="lazy" />
          </LiquidGlass>
        ))}
      </div>
    </section>
  )
}
