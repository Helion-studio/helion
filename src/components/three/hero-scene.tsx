"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";

/* -------------------------------------------------------------------------
   Geometry: fibonacci sphere shell + inner swarm, coloured cyan -> violet
------------------------------------------------------------------------- */
function buildField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  const ice = new THREE.Color("#dce6ef");
  const steel = new THREE.Color("#8ba2b8");
  const slate = new THREE.Color("#5b7085");
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const onShell = i % 5 !== 0;
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * 2.399963229728653; // golden angle
    const radius = onShell ? 1 : 0.3 + Math.random() * 0.6;

    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;

    const t = (y + 1) / 2;
    tmp.copy(ice).lerp(steel, t);
    if (Math.random() > 0.9) tmp.lerp(slate, 0.65);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;

    seeds[i] = Math.random();
  }
  return { positions, colors, seeds };
}

/* -------------------------------------------------------------------------
   Points + custom shader (breathing, depth-faded, additively blended)
------------------------------------------------------------------------- */
function ParticleGlobe({
  count,
  reducedMotion,
}: {
  count: number;
  reducedMotion: boolean;
}) {
  const points = React.useRef<THREE.Points>(null);
  const { positions, colors, seeds } = React.useMemo(
    () => buildField(count),
    [count],
  );

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 2.6 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  const { viewport } = useThree();
  uniforms.uPixelRatio.value = Math.min(viewport.dpr ?? 1, 2);

  useFrame((state, delta) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    if (!reducedMotion) uniforms.uTime.value = t;

    // pointer parallax — eased, never snappy
    const px = state.pointer.x;
    const py = state.pointer.y;
    const target = points.current.rotation;
    target.y += (px * 0.45 - target.y + (reducedMotion ? 0 : t * 0.08)) * 0.02;
    target.x += (-py * 0.28 - target.x) * 0.04;
    if (!reducedMotion) target.y += delta * 0.06;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 1]}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uSize;
          uniform float uPixelRatio;
          varying vec3 vColor;
          varying float vFade;

          void main() {
            vec3 p = position;
            float wobble = sin(uTime * 0.7 + aSeed * 6.2831) * 0.035;
            p *= 1.0 + wobble;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float depth = clamp((mv.z + 2.4) / 4.0, 0.0, 1.0);
            vFade = depth;
            vColor = color;
            gl_PointSize = (uSize * (0.45 + depth)) * uPixelRatio * (300.0 / -mv.z) * 0.02;
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vColor;
          varying float vFade;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.02, d) * (0.18 + 0.82 * vFade);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
        vertexColors
      />
    </points>
  );
}

/* Two interlocking hex rings — a quiet nod to the Helion mark */
function HexRings({ reducedMotion }: { reducedMotion: boolean }) {
  const a = React.useRef<THREE.Mesh>(null);
  const b = React.useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (a.current) a.current.rotation.z += delta * 0.08;
    if (b.current) b.current.rotation.z -= delta * 0.05;
  });

  return (
    <group rotation={[0.5, 0.4, 0]}>
      <mesh ref={a} scale={1.5}>
        {/* radialSegments=6 => hexagonal ring */}
        <torusGeometry args={[1, 0.012, 3, 6]} />
        <meshBasicMaterial
          color="#b4c8d8"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={b} scale={1.5} rotation={[Math.PI / 2.4, 0, Math.PI / 6]}>
        <torusGeometry args={[1, 0.012, 3, 6]} />
        <meshBasicMaterial
          color="#8ba2b8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const [dpr, setDpr] = React.useState(1.5);
  const [count, setCount] = React.useState(4200);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);

    const small = window.matchMedia("(max-width: 768px)").matches;
    setCount(small ? 1800 : 5000);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 3.2], fov: 55 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* drop resolution instead of dropping frames on weak GPUs */}
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      />
      <AdaptiveDpr pixelated={false} />
      <ParticleGlobe count={count} reducedMotion={reducedMotion} />
      <HexRings reducedMotion={reducedMotion} />
      <Preload all />
    </Canvas>
  );
}
