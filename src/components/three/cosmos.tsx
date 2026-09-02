"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";

/* =========================================================================
   COSMOS — real WebGL depth.
   Two things live in here; everything else (bloom, vignette, shooting
   stars) stays in CSS so we're not paying for full-screen post-processing.

   1. <StarVolume/>  three star layers spread through actual Z depth. The
      camera drifts with the pointer, so near stars sweep and far stars
      barely move — genuine parallax, not a 2D fake.
   2. <Dome/>        a sphere cut at the equator with the lower half thrown
      away, sunk just under the bottom edge. Very dark blue body, electric
      blue fresnel rim, and a specular that travels the silhouette.
========================================================================= */

const DEEP = new THREE.Color("#03050d"); // near-black blue, the body centre
const MID = new THREE.Color("#0b1836"); // slightly lifted upper surface
const RIM = new THREE.Color("#0066ff"); // fresnel edge
const HOT = new THREE.Color("#cfe9ff"); // travelling specular
const GLOW = new THREE.Color("#00aaff"); // atmosphere shell

/* ----------------------------- star volume ----------------------------- */

function StarVolume({ reduced }: { reduced: boolean }) {
  const ref = React.useRef<THREE.Points>(null);

  const { positions, seeds, sizes, count } = React.useMemo(() => {
    const small =
      typeof window !== "undefined" && window.innerWidth < 768 ? true : false;

    // three discrete depth bands => three "layers", but in real Z
    const bands = [
      { n: small ? 700 : 1500, z: [-46, -26], s: [0.9, 1.7] }, // distant
      { n: small ? 300 : 620, z: [-24, -12], s: [1.5, 2.6] }, // mid
      { n: small ? 60 : 120, z: [-11, -5], s: [2.6, 4.4] }, // foreground
    ];

    const total = bands.reduce((a, b) => a + b.n, 0);
    const positions = new Float32Array(total * 3);
    const seeds = new Float32Array(total);
    const sizes = new Float32Array(total);

    let i = 0;
    for (const band of bands) {
      for (let k = 0; k < band.n; k++) {
        const z = band.z[0] + Math.random() * (band.z[1] - band.z[0]);
        // spread wide enough to cover the frustum at that depth
        const spread = Math.abs(z) * 1.5;
        positions[i * 3] = (Math.random() - 0.5) * spread * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.4;
        positions[i * 3 + 2] = z;
        sizes[i] = band.s[0] + Math.random() * (band.s[1] - band.s[0]);
        seeds[i] = Math.random();
        i++;
      }
    }
    return { positions, seeds, sizes, count: total };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.ShaderMaterial;
    if (!reduced) m.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const uniforms = React.useMemo(
    () => ({ uTime: { value: 0 }, uDpr: { value: 1 } }),
    [],
  );
  const { viewport } = useThree();
  uniforms.uDpr.value = Math.min(viewport.dpr ?? 1, 2);

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 1]}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
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
          attribute float aSize;
          uniform float uTime;
          uniform float uDpr;
          varying float vAlpha;
          varying float vWarm;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            float tw = 0.68 + 0.32 * sin(uTime * (0.35 + aSeed * 1.1) + aSeed * 24.0);
            // nearer stars are brighter; far band stays subtle
            float depth = clamp((abs(mv.z) - 5.0) / 42.0, 0.0, 1.0);
            vAlpha = tw * mix(0.95, 0.32, depth);
            vWarm = aSeed;
            gl_PointSize = aSize * uDpr * (260.0 / -mv.z);
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          varying float vWarm;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.0, d);
            vec3 white = vec3(1.0);
            vec3 icy   = vec3(0.78, 0.88, 1.0);
            vec3 col = mix(white, icy, step(0.72, vWarm));
            gl_FragColor = vec4(col, core * vAlpha);
          }
        `}
      />
    </points>
  );
}

/* -------------------------------- dome --------------------------------- */

function Dome({ reduced }: { reduced: boolean }) {
  const mat = React.useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // radius: wide enough to span the viewport, clamped so it never dwarfs text
  const radius = Math.max(viewport.width * 0.62, viewport.height * 0.52);
  // sink the cut plane just below the bottom edge so we read a horizon,
  // not a floating half-ball with a hard straight edge
  const y = -viewport.height / 2 - radius * 0.055;

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: DEEP },
      uMid: { value: MID },
      uRim: { value: RIM },
      uHot: { value: HOT },
    }),
    [],
  );

  useFrame((state) => {
    if (mat.current && !reduced)
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={[0, y, 0]}>
      {/* atmosphere shell — additive backface fresnel */}
      <mesh scale={radius * 1.045}>
        <sphereGeometry args={[1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uGlow: { value: GLOW } }}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vP;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vP = wp.xyz;
              vN = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uGlow;
            varying vec3 vN; varying vec3 vP;
            void main() {
              vec3 N = normalize(vN);
              vec3 V = normalize(cameraPosition - vP);
              float f = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.2);
              gl_FragColor = vec4(uGlow, f * 0.42);
            }
          `}
        />
      </mesh>

      {/* the dome body — upper hemisphere only (thetaLength = PI/2) */}
      <mesh scale={radius}>
        <sphereGeometry args={[1, 160, 80, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vP; varying vec3 vL;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vP = wp.xyz;
              vL = position;
              vN = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime;
            uniform vec3 uDeep, uMid, uRim, uHot;
            varying vec3 vN; varying vec3 vP; varying vec3 vL;

            void main() {
              vec3 N = normalize(vN);
              vec3 V = normalize(cameraPosition - vP);
              float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

              // body: almost black at the centre, a touch of blue toward the crown
              float up = clamp(vL.y, 0.0, 1.0);
              vec3 body = mix(uDeep, uMid, pow(up, 1.5) * 0.6);

              // one soft key light from above so it reads as a solid volume
              float key = clamp(dot(N, normalize(vec3(0.12, 1.0, 0.4))), 0.0, 1.0);
              body += uMid * pow(key, 5.0) * 0.16;

              vec3 col = body + uRim * fres * 0.9;

              // specular travelling around the silhouette (lighthouse sweep)
              float ang = atan(vL.z, vL.x);
              float sweep = uTime * 0.85;
              float d = abs(mod(ang - sweep + 3.14159265, 6.28318530) - 3.14159265);
              float hot = smoothstep(0.30, 0.0, d) * smoothstep(0.35, 0.95, fres);
              col += uHot * hot * 1.7;

              // dither out the banding you'd otherwise get on a huge dark gradient
              float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
              col += (g - 0.5) * 0.014;

              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------ parallax ------------------------------- */

function CameraDrift({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return;
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------- canvas -------------------------------- */

export default function Cosmos() {
  const [dpr, setDpr] = React.useState<number>(1.5);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 120 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      />
      <AdaptiveDpr />
      <CameraDrift reduced={reduced} />
      <StarVolume reduced={reduced} />
      <Dome reduced={reduced} />
    </Canvas>
  );
}
