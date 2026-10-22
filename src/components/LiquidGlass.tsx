import { useCallback, type ElementType, type ComponentPropsWithoutRef, type PointerEvent } from 'react'

type Props<T extends ElementType> = {
  as?: T
  tone?: 'dark' | 'light'
  /** Warp the backdrop through the SVG filter. Costly: use on small elements only. */
  refract?: boolean
} & ComponentPropsWithoutRef<T>

/**
 * Liquid glass surface: frosted backdrop, edge refraction (SVG displacement on
 * Chromium, see <LiquidGlassFilter/>), rim lighting and a specular highlight
 * that follows the pointer.
 */
export function LiquidGlass<T extends ElementType = 'div'>({
  as,
  tone = 'dark',
  refract = false,
  className = '',
  onPointerMove,
  ...rest
}: Props<T>) {
  const Tag = (as ?? 'div') as ElementType
  const handleMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
      onPointerMove?.(e)
    },
    [onPointerMove],
  )
  return <Tag className={`lg lg--${tone} ${refract ? 'lg--refract' : ''} ${className}`} onPointerMove={handleMove} {...rest} />
}

/** SVG filter used for refraction; rendered once at the app root. */
export function LiquidGlassFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="lg-refract" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

/** SVG-in-backdrop-filter only renders on Chromium; elsewhere we keep the frosted fallback. */
export function enableRefractionIfSupported() {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands
  if (brands?.some((b) => /Chromium/i.test(b.brand))) document.documentElement.classList.add('lg-refract')
}
