# NeoTech

A futuristic VR / wearables landing page built with **React + Vite**, **React Three Fiber** and **liquid glass** UI.

## Highlights

- **Scroll world** (`src/world/ScrollWorld.tsx`): one fixed R3F canvas behind the page. Lenis smooth-scroll
  progress drives a camera flying through neon ring gates, a starfield, refracting glass shapes
  (drei `MeshTransmissionMaterial` sharing one render buffer) and a hover-car that cruises past mid-page.
- **Liquid glass** (`src/components/LiquidGlass.tsx`): frosted backdrop, rim lighting, pointer-tracked specular
  highlight, and true backdrop refraction through an SVG displacement filter on Chromium (frosted fallback elsewhere).
- **Type**: Orbitron (display) + Exo 2 (body), self-hosted via Fontsource.
- Sections: Hero, About, Services carousel, Possibilities tabs, Testimonials, CTA + showreel modal, Footer.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Images

Optimized images live in `public/images` (WebP). Originals are kept in `raw/`.
Cut-outs (`*-cut.webp`, `hero-helmet.webp`) had their backgrounds removed with the local tool:

```bash
cd tools/remove-bg
npm install
node remove-bg.mjs ./out ../../raw/your-image.jpg   # writes out/your-image.png
```

Run it from inside `tools/remove-bg` (the model files resolve relative to that folder).

## Deploy

Configured for Vercel (`vercel.json`): framework Vite, build `npm run build`, output `dist`.
