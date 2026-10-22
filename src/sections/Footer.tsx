import { LiquidGlass } from '../components/LiquidGlass'
import { LogoMark, Globe, Behance, Instagram, XLogo } from '../components/Icons'

const COLUMNS = [
  { title: 'Quick Links', links: ['Home', 'About Us', 'Services', 'Blog'] },
  { title: 'Explore', links: ['Product Demos', 'Case Studies', 'Testimonials', 'Media & Press', 'Events & Webinars'] },
]
const SOCIALS = [
  { label: 'Website', icon: Globe },
  { label: 'Behance', icon: Behance },
  { label: 'Instagram', icon: Instagram },
  { label: 'X', icon: XLogo },
]
const PARTNERS = ['Quantix', 'Hyperion', 'Vortexa', 'Nimbus', 'Axiom']

export function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <a href="#home" className="brand brand--light"><LogoMark /> <span>NeoTech</span></a>
        <div className="footer__grid">
          <div className="footer__contact">
            <h4>Email</h4>
            <a href="mailto:contact@neotech.com">contact@neotech.com</a>
            <h4>Address</h4>
            <p>NeoTech Technologies 123<br />FutureTech Blvd</p>
          </div>
          <div>
            <h4>Phone Number</h4>
            <a href="tel:+18001234567">+1 (800) 123-4567</a>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>{c.links.map((l) => <li key={l}><a href="#home">{l}</a></li>)}</ul>
            </div>
          ))}
          <div className="footer__about">
            <h4 className="footer__tag">Futuristic Tech &amp;<br />VR Website</h4>
            <p>Dive into a world where technology and virtual reality converge to create mind-blowing experiences.</p>
            <div className="socials">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <LiquidGlass key={label} as="a" href="#home" aria-label={label} refract className="social"><Icon width={16} height={16} /></LiquidGlass>
              ))}
            </div>
          </div>
        </div>
        <div className="partners">
          {PARTNERS.map((p) => <span key={p} className="logo-chip"><i /> {p}</span>)}
        </div>
        <p className="copyright">© {new Date().getFullYear()} NeoTech. All rights reserved.</p>
      </div>
    </footer>
  )
}
