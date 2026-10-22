import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
type P = SVGProps<SVGSVGElement>

export const LogoMark = (p: P) => (
  <svg {...base} {...p}><path d="M12 2.5l8.5 4.9v9.2L12 21.5l-8.5-4.9V7.4z" /><path d="M3.5 7.4L12 12.3l8.5-4.9M12 12.3v9.2" /></svg>
)
export const Search = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>)
export const ArrowLeft = (p: P) => (<svg {...base} {...p}><path d="M15 6l-6 6 6 6" /></svg>)
export const ArrowRight = (p: P) => (<svg {...base} {...p}><path d="M9 6l6 6-6 6" /></svg>)
export const ArrowUpRight = (p: P) => (<svg {...base} {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>)
export const Play = (p: P) => (<svg {...base} {...p}><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>)
export const Close = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)
export const Menu = (p: P) => (<svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>)
export const Headset = (p: P) => (<svg {...base} {...p}><rect x="2.5" y="7" width="19" height="10" rx="4" /><path d="M10 15.5c.6-1 1.2-1.5 2-1.5s1.4.5 2 1.5" /></svg>)
export const Assistant = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 16l3.5-8 3.5 8M9.8 13.2h4.4" /></svg>)
export const Gamepad = (p: P) => (<svg {...base} {...p}><rect x="2.5" y="6" width="19" height="12" rx="3" /><path d="M7 10v4M5 12h4M15 11h.01M18 13h.01" /><path d="M12 6v12" /></svg>)
export const Ring = (p: P) => (<svg {...base} {...p}><ellipse cx="12" cy="13" rx="7" ry="7.5" /><ellipse cx="12" cy="13" rx="4" ry="4.5" /><path d="M10 3.5h4l-2 2.5z" /></svg>)
export const Car = (p: P) => (<svg {...base} {...p}><path d="M3 15l2-5c.4-1 1.3-1.5 2.3-1.5h9.4c1 0 1.9.5 2.3 1.5l2 5v2.5H3z" /><circle cx="7.5" cy="15.5" r="1" /><circle cx="16.5" cy="15.5" r="1" /><path d="M2 20.5h20" /></svg>)
export const Cube = (p: P) => (<svg {...base} {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" /></svg>)
export const Globe = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></svg>)
export const Behance = (p: P) => (<svg {...base} {...p}><path d="M3 7h5a2.5 2.5 0 010 5H3zM3 12h5.5a2.75 2.75 0 010 5.5H3zM14 13.5h7a3.5 3.5 0 10-1 2.5M15 7.5h5" /></svg>)
export const Instagram = (p: P) => (<svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><path d="M17 7h.01" /></svg>)
export const XLogo = (p: P) => (<svg {...base} {...p}><path d="M4 4l16 16M20 4L4 20" /></svg>)
