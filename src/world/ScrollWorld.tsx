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
        </Suspense>
      </Canvas>
    </div>
  )
}
