"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { BloomEffect } from "postprocessing";

/**
 * The Arc — Helion Studio hero centrepiece.
 *
 * Layered additive tubes around one shared shader:
 *   halo  — fat fresnel tube, deep blue → electric blue at the rim
 *   core  — razor-thin near-white line riding the same radius
 *   echo  — two dim offset arcs in other planes for spatial depth
 *
 * Lifecycle (clock starts when the WebGL canvas mounts):
 *   0.20s → 1.40s  arc draws itself in (uReveal, hot tip at the front)
 *   0.80s → 2.00s  brightness + Unreal-style bloom ramp up
 *   every 5s       an energy pulse travels along the curve (ease-in-out)
 *
 * Motion: slow ambient Y spin, arc drifts opposite the cursor (±15px feel),
 * camera tilts ±2deg, first 50vh of scroll swings the arc 15deg.
 */

const ARC = Math.PI * 1.25; // 225° sweep, centred on +X → ")" hugging the right side

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalV;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uReveal; // 0 → 1 draw-on
  uniform float uBoost;  // global brightness ramp (bloom kick-in)
  uniform float uAlpha;  // layer opacity
  uniform vec3 uCore;    // deep blue at the centre of the tube
  uniform vec3 uEdge;    // electric blue at the rim (fresnel)
  uniform vec3 uHot;     // pulse / tip highlight colour

  varying vec2 vUv;
  varying vec3 vNormalV;
  varying vec3 vViewDir;

  void main() {
    if (vUv.x > uReveal) discard;

    float fres = pow(1.0 - abs(dot(normalize(vNormalV), normalize(vViewDir))), 1.6);
    vec3 col = mix(uCore, uEdge, fres);

    // energy pulse travelling along the arc every 5s, ease-in-out
    float cycle = mod(uTime, 5.0) / 5.0;
    float trav = clamp(cycle / 0.55, 0.0, 1.0);
    trav = trav * trav * (3.0 - 2.0 * trav);
    float d = vUv.x - trav;
    col += uHot * exp(-d * d * 700.0) * 1.5;

    // hot tip while the arc is still drawing itself in
    float tip = exp(-pow((uReveal - vUv.x) * 34.0, 2.0));
    col += uHot * tip * step(uReveal, 0.999) * 1.4;

    gl_FragColor = vec4(col * uBoost * uAlpha, 1.0);
  }
`;

type Shared = { uTime: { value: number }; uReveal: { value: number }; uBoost: { value: number } };

function useArcMaterials(): { shared: Shared; mats: Record<"halo" | "core" | "echo", THREE.ShaderMaterial> } {
  // one uniforms object shared by every material → update once, all layers follow
  const shared = useMemo<Shared>(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 }, uBoost: { value: 0 } }),
    [],
  );

  const mats = useMemo(() => {
    const make = (core: string, edge: string, hot: string, alpha: number) =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: shared.uTime,
          uReveal: shared.uReveal,
          uBoost: shared.uBoost,
          uCore: { value: new THREE.Color(core) },
          uEdge: { value: new THREE.Color(edge) },
          uHot: { value: new THREE.Color(hot) },
          uAlpha: { value: alpha },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

    return {
      halo: make("#1e3a8a", "#3b82f6", "#bfe3ff", 0.5),
      core: make("#e8f4ff", "#9ccbff", "#ffffff", 0.85),
      echo: make("#123577", "#1e5fce", "#7fb5ff", 0.16),
    };
  }, [shared]);

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  return { shared, mats };
}

function Arc({
  shared,
  mats,
  bloomRef,
}: {
  shared: Shared;
  mats: Record<string, THREE.ShaderMaterial>;
  bloomRef: React.RefObject<BloomEffect | null>;
}) {
  const parallax = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0, scroll: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      smooth.current.scroll = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    shared.uTime.value = t;

    // draw-on (200ms → 1.4s) and brightness ramp (800ms → 2s)
    const r = Math.min(1, Math.max(0, (t - 0.2) / 1.2));
    shared.uReveal.value = r * r * (3 - 2 * r);
    const b = Math.min(1, Math.max(0, (t - 0.8) / 1.2));
    shared.uBoost.value = 0.45 + 0.75 * b;
    if (bloomRef.current) bloomRef.current.intensity = 0.85 * b;

    // ambient spin (0.06 rad/s ≈ 0.001 rad/frame) + 15° scroll swing
    if (spin.current) spin.current.rotation.y = t * 0.06 + smooth.current.scroll * 0.26;

    // parallax — arc drifts opposite the cursor, camera tilts ±2°
    const s = smooth.current;
    const k = 1 - Math.exp(-6 * delta); // frame-rate independent damping
    s.x += (pointer.current.x - s.x) * k;
    s.y += (pointer.current.y - s.y) * k;
    if (parallax.current) {
      parallax.current.position.x = 1.55 - s.x * 0.3;
      parallax.current.position.y = -0.15 + s.y * 0.22;
    }
    state.camera.rotation.x = -s.y * 0.035;
    state.camera.rotation.y = s.x * 0.035;
  });

  const tipMat = (
    <meshBasicMaterial
      color="#9ccbff"
      transparent
      opacity={0.9}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  );

  return (
    <group ref={parallax} position={[1.55, -0.15, -0.3]}>
      <group ref={spin}>
        <group rotation={[-0.12, 0, -ARC / 2]}>
          {/* halo */}
          <mesh material={mats.halo}>
            <torusGeometry args={[2.7, 0.05, 24, 256, ARC]} />
          </mesh>
          {/* razor core line */}
          <mesh material={mats.core}>
            <torusGeometry args={[2.7, 0.016, 12, 256, ARC]} />
          </mesh>
          {/* echo arcs in offset planes — spatial depth */}
          <mesh material={mats.echo}>
            <torusGeometry args={[3.08, 0.011, 8, 220, ARC * 0.92]} />
          </mesh>
          <mesh material={mats.echo} rotation={[0.42, 0.85, 0.2]}>
            <torusGeometry args={[2.3, 0.009, 8, 200, ARC * 0.8]} />
          </mesh>
          {/* glowing end caps */}
          <mesh position={[2.7, 0, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            {tipMat}
          </mesh>
          <mesh position={[2.7 * Math.cos(ARC), 2.7 * Math.sin(ARC), 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            {tipMat}
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function ArcScene() {
  const { shared, mats } = useArcMaterials();
  const bloom = useRef<BloomEffect | null>(null);

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Arc shared={shared} mats={mats} bloomRef={bloom} />
      <EffectComposer multisampling={4}>
        <Bloom
          ref={bloom}
          intensity={0}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.2}
          radius={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

export default ArcScene;
