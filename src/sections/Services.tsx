import { useRef } from 'react'
import { LiquidGlass } from '../components/LiquidGlass'
import { ArrowLeft, ArrowRight, Headset, Assistant, Gamepad, Ring, Car, Cube } from '../components/Icons'

const SERVICES = [
  { title: 'Reality Development', icon: Headset, img: '/images/vision-blue.webp', text: 'Step into the future with our custom VR development services, designed to create immersive digital experiences.' },
  { title: 'Digital Assistants', icon: Assistant, img: '/images/robot-hands.webp', text: 'Enhance customer engagement and operational efficiency with our AI-driven virtual assistants. These intelligent avatars never sleep.' },
  { title: 'Gaming Solutions', icon: Gamepad, img: '/images/green-vr.webp', text: 'Revolutionize the gaming industry with our next-generation VR game development experiences.' },
  { title: 'Smart Wearables', icon: Ring, img: '/images/ring-finger.webp', text: 'Health, identity and payments on your finger — rings and bands that read your world in real time.' },
  { title: 'Autonomous Mobility', icon: Car, img: '/images/car.webp', text: 'Hover-class concepts and in-cabin mixed reality for the vehicles of tomorrow.' },
  { title: 'Spatial Computing', icon: Cube, img: '/images/wrist.webp', text: 'Wrist-borne interfaces and spatial apps that put a computer wherever your hand goes.' },
]

export function Services() {
  const track = useRef<HTMLDivElement>(null)
  const slide = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.service')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: 'smooth' })
  }

  return (
    <section id="services" className="services container">
      <div className="section-head">
        <h2 className="h2" data-reveal>Our Service</h2>
        <div className="arrows">
          <LiquidGlass as="button" refract className="arrow" aria-label="Previous services" onClick={() => slide(-1)}><ArrowLeft width={16} height={16} /></LiquidGlass>
          <LiquidGlass as="button" refract className="arrow" aria-label="Next services" onClick={() => slide(1)}><ArrowRight width={16} height={16} /></LiquidGlass>
        </div>
      </div>
      <div className="services__track" ref={track}>
        {SERVICES.map(({ title, icon: Icon, img, text }, i) => (
          <LiquidGlass key={title} as="article" className="service" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="service__bg" style={{ backgroundImage: `url(${img})` }} />
            <span className="service__icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#contact" className="service__more">Learn More</a>
          </LiquidGlass>
        ))}
      </div>
    </section>
  )
}
