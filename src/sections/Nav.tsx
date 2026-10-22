import { useEffect, useState } from 'react'
import { LiquidGlass } from '../components/LiquidGlass'
import { LogoMark, Menu, Close, Search } from '../components/Icons'
import { scrollToTarget } from '../lib/scroll'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('home')
    const onScroll = () => setDark(!!hero && window.scrollY > hero.offsetHeight - 70)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <header className={`nav ${dark ? 'nav--dark' : ''} ${open ? 'nav--open' : ''}`}>
      <LiquidGlass tone={dark ? 'dark' : 'light'} className="nav__bar">
        <a href="#home" className="brand" onClick={go('#home')}>
          <LogoMark /> <span>NeoTech</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={go(l.href)}>{l.label}</a>
          ))}
        </nav>
        <form className="nav__search" role="search" onSubmit={(e) => e.preventDefault()}>
          <input type="search" placeholder="I am looking for..." aria-label="Search" />
          <button type="submit" aria-label="Search"><Search width={16} height={16} /></button>
        </form>
        <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <Close /> : <Menu />}
        </button>
      </LiquidGlass>
    </header>
  )
}
