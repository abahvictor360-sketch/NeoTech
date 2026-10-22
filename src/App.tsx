import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { LiquidGlassFilter, enableRefractionIfSupported } from './components/LiquidGlass'
import { Showreel } from './components/Showreel'
import { startSmoothScroll } from './lib/scroll'
import { useReveal } from './lib/useReveal'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Services } from './sections/Services'
import { Possibilities } from './sections/Possibilities'
import { Testimonials } from './sections/Testimonials'
import { Cta } from './sections/Cta'
import { Footer } from './sections/Footer'

const ScrollWorld = lazy(() => import('./world/ScrollWorld'))

export default function App() {
  const [reel, setReel] = useState(false)
  const openReel = useCallback(() => setReel(true), [])
  const closeReel = useCallback(() => setReel(false), [])

  useEffect(() => {
    enableRefractionIfSupported()
    return startSmoothScroll()
  }, [])
  useReveal()

  return (
    <>
      <LiquidGlassFilter />
      <Suspense fallback={null}>
        <ScrollWorld />
      </Suspense>
      <Nav />
      <main>
        <Hero />
        <About onWatch={openReel} />
        <Services />
        <Possibilities />
        <Testimonials />
        <Cta onWatch={openReel} />
      </main>
      <Footer />
      <Showreel open={reel} onClose={closeReel} />
    </>
  )
}
