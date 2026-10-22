import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshTransmissionMaterial, PerformanceMonitor, useFBO, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll'

const WORLD_DEPTH = 90
const BG = '#070709'
const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768
const isBelowDesktop = typeof window !== 'undefined' && window.innerWidth < 1100

/** Camera rig: flies forward through the world as the page scrolls, with pointer parallax. */
function Rig() {
  const smooth = useRef(0)
  const { camera, pointer } = useThree()
  useFrame((_, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, scrollState.progress, 3.2, dt)
    const p = smooth.current
    const z = 6 - p * WORLD_DEPTH
    camera.position.z = z
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(p * Math.PI * 3) * 1.2 + pointer.x * 0.6, 2.5, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, Math.cos(p * Math.PI * 2) * 0.5 + pointer.y * 0.4, 2.5, dt)
    camera.lookAt(camera.position.x * 0.4, 0, z - 10)
    camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.06
  })
  return null
}

function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 16
      const a = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = Math.sin(a) * r * 0.7
      arr[i * 3 + 2] = 12 - Math.random() * (WORLD_DEPTH + 40)
    }
    return arr
  }, [count])
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * (0.01 + Math.min(Math.abs(scrollState.velocity), 60) * 0.0015)
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#cfd6ff" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  )
}

const GATE_COLORS = ['#7c5cff', '#38e1ff', '#ff8a3d', '#b4ff6a']

/** Neon ring gates the camera flies through. */
function Gates() {
  const group = useRef<THREE.Group>(null)
  const gates = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({ z: -8 - i * 11, color: GATE_COLORS[i % GATE_COLORS.length], r: 5 + (i % 3) * 0.8 })),
    [],
  )
  useFrame((state) => {
    group.current?.children.forEach((g, i) => {
      g.rotation.z = state.clock.elapsedTime * (i % 2 ? 0.08 : -0.06) + i
    })
  })
  return (
    <group ref={group}>
      {gates.map((g) => (
        <group key={g.z} position={[0, 0, g.z]}>
          <mesh>
            <torusGeometry args={[g.r, 0.012, 8, 160]} />
            <meshBasicMaterial color={g.color} toneMapped={false} transparent opacity={0.6} />
          </mesh>
          <mesh scale={1.04}>
            <torusGeometry args={[g.r, 0.004, 6, 160, Math.PI * 0.6]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

type ShardDef = { pos: [number, number, number]; geo: 'ico' | 'knot' | 'torus' | 'oct' | 'capsule' | 'sphere'; s: number }
const SHARDS: ShardDef[] = [
  { pos: [-5.8, 1.4, -4], geo: 'ico', s: 1 },
  { pos: [6.2, -1.3, -14], geo: 'knot', s: 0.8 },
  { pos: [-6.4, -1.6, -26], geo: 'torus', s: 1.05 },
  { pos: [6.0, 1.7, -38], geo: 'oct', s: 1.1 },
  { pos: [-5.8, 1.1, -52], geo: 'capsule', s: 0.85 },
  { pos: [6.3, -1.0, -64], geo: 'sphere', s: 1 },
  { pos: [-6.1, -1.4, -76], geo: 'knot', s: 0.7 },
  { pos: [5.4, 1.2, -88], geo: 'ico', s: 1.2 },
]

function Geometry({ kind }: { kind: ShardDef['geo'] }) {
  switch (kind) {
    case 'ico': return <icosahedronGeometry args={[1, 0]} />
    case 'knot': return <torusKnotGeometry args={[0.8, 0.28, 160, 24]} />
    case 'torus': return <torusGeometry args={[0.9, 0.36, 32, 96]} />
    case 'oct': return <octahedronGeometry args={[1, 0]} />
    case 'capsule': return <capsuleGeometry args={[0.55, 1.1, 8, 24]} />
    default: return <sphereGeometry args={[0.95, 48, 48]} />
  }
}

/**
 * Liquid-glass objects drifting along the path. They share a single
 * transmission buffer (the scene rendered once without them) so eight glass
 * meshes cost one extra render per frame instead of eight.
 */
function GlassShards() {
  const group = useRef<THREE.Group>(null)
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const buffer = useFBO(isSmallScreen ? 256 : 384, isSmallScreen ? 256 : 384)
  useFrame((state, dt) => {
    const spin = 0.2 + Math.min(Math.abs(scrollState.velocity), 80) * 0.02
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.x += dt * spin * (i % 2 ? 0.6 : 0.4)
      m.rotation.y += dt * spin * 0.5
    })
    if (!group.current) return
    group.current.visible = false
    state.gl.setRenderTarget(buffer)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
    group.current.visible = true
  })
  return (
    <group ref={group}>
      {SHARDS.map((s, i) => (
        <Float key={i} position={s.pos} speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh ref={(m) => { refs.current[i] = m }} scale={s.s}>
            <Geometry kind={s.geo} />
            <MeshTransmissionMaterial
              buffer={buffer.texture}
              samples={isSmallScreen ? 3 : 5}
              transmission={1}
              thickness={1.2}
              roughness={0.04}
              ior={1.3}
              chromaticAberration={0.35}
              anisotropicBlur={0.2}
              distortion={0.4}
              distortionScale={0.4}
              temporalDistortion={0.15}
              iridescence={1}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[100, 800]}
              clearcoat={1}
              envMapIntensity={2.2}
              color="#e9e6ff"
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/** The hover-car from the gallery cruises across the world mid-scroll. */
function FlyingCar() {
  const tex = useTexture('/images/car-cut.webp')
  tex.colorSpace = THREE.SRGBColorSpace
  const ref = useRef<THREE.Mesh>(null)
  const aspect = tex.image ? (tex.image as HTMLImageElement).width / (tex.image as HTMLImageElement).height : 2.4
  useFrame((state) => {
    if (!ref.current) return
    const local = THREE.MathUtils.clamp((scrollState.progress - 0.32) / 0.3, 0, 1)
    ref.current.position.x = THREE.MathUtils.lerp(-14, 14, local)
    ref.current.position.y = -1.6 + Math.sin(state.clock.elapsedTime * 1.6) * 0.12
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.03
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(local * Math.PI) * (isBelowDesktop ? 0.4 : 0.9)
  })
  return (
    <mesh ref={ref} position={[0, -1.6, -44]}>
      <planeGeometry args={[3.2 * aspect, 3.2]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/** Soft radial glow texture, generated once and shared by every cut-out halo. */
let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

type CutoutDef = {
  url: string
  /** scroll-progress window in which it flies past */
  window: [number, number]
  /** -1 = left screen edge, 1 = right screen edge */
  side: -1 | 1
  height: number
  glow: string
  /** radians per second of in-plane spin (the sphere turns, the rest just sway) */
  spin?: number
}

const CUTOUTS: CutoutDef[] = [
  { url: '/images/sphere-cut.webp', window: [0.18, 0.44], side: 1, height: 3.2, glow: '#9b7bff', spin: 0.12 },
  { url: '/images/robot-hands-cut.webp', window: [0.46, 0.72], side: -1, height: 3.4, glow: '#7c5cff' },
  { url: '/images/vision-blue-cut.webp', window: [0.74, 1.0], side: 1, height: 3, glow: '#38e1ff' },
]

const tmp = new THREE.Vector3()

/**
 * A background-removed product shot that flies past along a screen edge.
 * It is placed in camera space each frame, so it stays in the side margin
 * (clear of the page copy) whatever the camera is doing, travelling from far
 * and small to near and large across its scroll window, then fading out.
 */
function Cutout({ url, window: [p0, p1], side, height, glow, spin = 0 }: CutoutDef) {
  const tex = useTexture(url)
  tex.colorSpace = THREE.SRGBColorSpace
  const group = useRef<THREE.Group>(null)
  const art = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const img = tex.image as HTMLImageElement | undefined
  const aspect = img ? img.width / img.height : 0.6
  const peak = isSmallScreen ? 0.45 : isBelowDesktop ? 0.6 : 0.95

  useFrame((state) => {
    const g = group.current
    if (!g || !art.current || !halo.current) return
    const cam = state.camera as THREE.PerspectiveCamera
    // the rig's smoothed progress, recovered from the camera's travel
    const progress = (6 - cam.position.z) / WORLD_DEPTH
    const local = (progress - p0) / (p1 - p0)
    const opacity = local <= 0 || local >= 1 ? 0 : Math.sin(local * Math.PI) ** 0.8 * peak
    g.visible = opacity > 0.002
    if (!g.visible) return

    const t = state.clock.elapsedTime
    const depth = THREE.MathUtils.lerp(16, 4.6, local)
    const halfH = depth * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    // phones have no side margin, so there it only peeks in from the edge
    const ndcX = side * (isSmallScreen ? 0.98 : 0.9)
    const ndcY = THREE.MathUtils.lerp(-0.3, 0.2, local) + Math.sin(t * 0.8 + p0 * 10) * 0.03
    tmp.set(ndcX * halfH * cam.aspect, ndcY * halfH, -depth)
    g.position.copy(cam.localToWorld(tmp))
    g.quaternion.copy(cam.quaternion)
    art.current.rotation.z = spin ? t * spin : Math.sin(t * 0.5 + p0 * 10) * 0.05
    ;(art.current.material as THREE.MeshBasicMaterial).opacity = opacity
    ;(halo.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5
  })

  return (
    <group ref={group} visible={false}>
      <mesh ref={halo} position-z={-0.3} scale={height * 1.6}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={getGlowTexture()} color={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
      </mesh>
      <mesh ref={art}>
        <planeGeometry args={[height * aspect, height]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} fog={false} />
      </mesh>
    </group>
  )
}

function Cutouts() {
  return (
    <>
      {CUTOUTS.map((c) => <Cutout key={c.url} {...c} />)}
    </>
  )
}

function Lights() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#0b0b10']} />
      <Lightformer intensity={6} position={[0, 5, -9]} scale={[10, 10, 1]} form="ring" color="#ffffff" />
      <Lightformer intensity={3} position={[-6, 1, 3]} scale={[3, 12, 1]} color="#7c5cff" />
      <Lightformer intensity={3} position={[6, -1, 3]} scale={[3, 12, 1]} color="#38e1ff" />
      <Lightformer intensity={2} position={[0, -6, 0]} rotation-x={Math.PI / 2} scale={[20, 4, 1]} color="#ff8a3d" />
    </Environment>
  )
}

/** True once the page has scrolled far enough that the world is visible below the hero. */
function useWorldVisible() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('home')
    const check = () => setVisible(!hero || window.scrollY + window.innerHeight > hero.offsetHeight + 1)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])
  return visible
}

const MAX_DPR = isSmallScreen ? 1.25 : 1.5

export default function ScrollWorld() {
  const visible = useWorldVisible()
  const [dpr, setDpr] = useState(MAX_DPR)
  return (
    <div className="world" aria-hidden="true">
      <Canvas
        dpr={dpr}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 120 }}
        gl={{ antialias: !isSmallScreen, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(MAX_DPR, d + 0.25))}
        />
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 10, 42]} />
        <Rig />
        <Starfield count={isSmallScreen ? 1200 : 2800} />
        <Gates />
        <Suspense fallback={null}>
          <Lights />
          <GlassShards />
          <FlyingCar />
          <Cutouts />
        </Suspense>
      </Canvas>
    </div>
  )
}
