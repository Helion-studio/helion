"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

/**
 * THE SPRING STAIRCASE — Top-notch Team's story section.
 *
 * Raw Three.js (no R3F, no physics, no texture files). A helix of 80 rounded
 * steps with a glowing rim on every tread's outer edge; an upgraded fresnel
 * energy sphere — animated surface veins, hot core, layered glow shells and
 * a travelling light — bounces down the helix, driven deterministically by
 * scroll and smoothed with lerp(0.12).
 *
 * Layout: desktop → the canvas owns the RIGHT half of the screen, content
 * panels ride the left half. Mobile → canvas full-width behind adjusted
 * solid dark panels.
 *
 * Panels: the team → the goal → how we help clients.
 */

const STEP_COUNT = 80;
const RADIUS = 4;
const TURNS = 2;
const TOTAL_HEIGHT = 12;
const STEP_WIDTH = 2.4;
const STEP_DEPTH = 1.2;
const STEP_HEIGHT = 0.25;
const BALL_RADIUS = 0.42;
const ON_STEP = STEP_HEIGHT / 2 + BALL_RADIUS + 0.01;

const ballVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vPos;

  void main() {
    vec3 transformed = position;
    float wave = sin(position.x * 5.0 + uTime * 2.0) * 0.015;
    transformed += normal * wave;

    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ballFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vPos;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 3.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0);

    // slow circulating energy veins across the surface
    float veins =
      sin(vPos.x * 8.0 + uTime * 1.2) *
      sin(vPos.y * 7.0 - uTime * 0.9) *
      sin(vPos.z * 9.0 + uTime * 0.6);

    vec3 baseColor = vec3(0.10, 0.34, 0.85);
    vec3 glowColor = vec3(0.30, 0.80, 1.00);
    vec3 hotColor  = vec3(0.85, 0.95, 1.00);

    vec3 color = baseColor;
    color += glowColor * fresnel * (0.6 + pulse * 0.4);            // rim energy
    color += hotColor * smoothstep(0.55, 0.95, veins) * 0.35;      // veins
    color += hotColor * pow(1.0 - fresnel, 2.0) * 0.22;            // hot core

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Scroll-driven Three scene. Owns its full lifecycle. */
function useStaircaseScene(
  hostRef: React.RefObject<HTMLDivElement | null>,
  hudRef: React.RefObject<HTMLSpanElement | null>,
  barRef: React.RefObject<HTMLDivElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const fine = window.matchMedia("(pointer: fine)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, fine ? 2 : 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030508, 0.038);

    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.4;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0x3b82f6, 0.9);
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    // staircase geometry — rounded treads + a glowing rim strip per step
    const totalAngle = Math.PI * 2 * TURNS;
    const angleStep = totalAngle / (STEP_COUNT - 1);
    const stepPositions: THREE.Vector3[] = [];
    const stepAngles: number[] = [];
    for (let i = 0; i < STEP_COUNT; i++) {
      const angle = i * angleStep;
      stepPositions.push(
        new THREE.Vector3(
          RADIUS * Math.cos(angle),
          (i / (STEP_COUNT - 1)) * TOTAL_HEIGHT,
          RADIUS * Math.sin(angle),
        ),
      );
      stepAngles.push(angle);
    }

    const stepGeometry = new RoundedBoxGeometry(
      STEP_WIDTH,
      STEP_HEIGHT,
      STEP_DEPTH,
      2,
      0.045,
    );
    const stepMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c2129,
      roughness: 0.28,
      metalness: 0.55,
    });
    const stairs = new THREE.InstancedMesh(stepGeometry, stepMaterial, STEP_COUNT);

    // rim light: thin bar pre-translated onto the tread's outer edge,
    // so it shares the exact same instance matrices as the steps
    const rimGeometry = new THREE.BoxGeometry(0.035, 0.055, STEP_DEPTH * 0.92);
    rimGeometry.translate(STEP_WIDTH / 2 - 0.035, 0.02, 0);
    const rimMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rims = new THREE.InstancedMesh(rimGeometry, rimMaterial, STEP_COUNT);

    const M = new THREE.Matrix4();
    const Q = new THREE.Quaternion();
    const E = new THREE.Euler();
    const ONE = new THREE.Vector3(1, 1, 1);
    stepPositions.forEach((p, i) => {
      E.set(0, -stepAngles[i], 0);
      Q.setFromEuler(E);
      M.compose(p, Q, ONE);
      stairs.setMatrixAt(i, M);
      rims.setMatrixAt(i, M);
    });
    stairs.instanceMatrix.needsUpdate = true;
    rims.instanceMatrix.needsUpdate = true;
    scene.add(stairs, rims);

    // the ball — shader core + two glow shells + light + micro-dust
    const ball = new THREE.Group();
    const ballUniforms = { uTime: { value: 0 } };
    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BALL_RADIUS, 48, 48),
      new THREE.ShaderMaterial({
        vertexShader: ballVertex,
        fragmentShader: ballFragment,
        uniforms: ballUniforms,
      }),
    );
    ball.add(ballMesh);

    const glowA = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x44aaff,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const glowB = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x2b6fd4,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ball.add(glowA, glowB);
    ball.add(new THREE.PointLight(0x44aaff, 8, 10));

    const dustCount = 150;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 0.9 + Math.random() * 1.5;
      const a = Math.random() * Math.PI * 2;
      dustPositions[i * 3] = Math.cos(a) * r;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      dustPositions[i * 3 + 2] = Math.sin(a) * r;
    }
    const dust = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.BufferAttribute(dustPositions, 3),
      ),
      new THREE.PointsMaterial({
        color: 0x66aaff,
        size: 0.045,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ball.add(dust);
    scene.add(ball);

    // scroll → progress, scoped to this section
    let scrollStart = 0;
    let scrollEnd = 1;
    let targetProgress = 0;
    let currentProgress = 0;
    let camDist = 1;

    const frame = () => {
      // half-width canvas on desktop needs more reach; portrait mobile even more
      const aspect = host.clientWidth / Math.max(1, host.clientHeight);
      camDist = aspect < 0.8 ? 1.45 : aspect < 1.1 ? 1.25 : 1;
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      scrollStart = rect.top + window.scrollY;
      scrollEnd = scrollStart + section.offsetHeight - window.innerHeight;
    };
    const onScroll = () => {
      targetProgress = THREE.MathUtils.clamp(
        (window.scrollY - scrollStart) / Math.max(1, scrollEnd - scrollStart),
        0,
        1,
      );
    };

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      frame();
      measure();
      onScroll();
    };

    const applyCamera = (progress: number) => {
      camera.position.set(9 * camDist, 5 + progress * 5, 9 * camDist);
    };

    measure();
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced && !raf) tick();
    });
    io.observe(host);

    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const desiredTarget = new THREE.Vector3();
    const clock = new THREE.Clock();
    let lastStep = -1;

    const placeBall = () => {
      const position = currentProgress * (STEP_COUNT - 1);
      const index = Math.min(Math.floor(position), STEP_COUNT - 2);
      const t = position - index;

      ball.position.lerpVectors(stepPositions[index], stepPositions[index + 1], t);
      ball.position.y += Math.sin(t * Math.PI) * 0.8 + ON_STEP;

      const airborne = Math.sin(t * Math.PI);
      ballMesh.rotation.x += 0.016 * 5 * (1 + airborne * 0.6);
      ballMesh.rotation.z += 0.016 * 3 * (1 + airborne * 0.6);

      const shown = index + 1;
      if (shown !== lastStep) {
        lastStep = shown;
        if (hudRef.current)
          hudRef.current.textContent = `STEP ${String(shown).padStart(3, "0")} / ${STEP_COUNT}`;
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      clock.getDelta();
      const t = clock.elapsedTime;
      ballUniforms.uTime.value = t;
      dust.rotation.y = t * 0.12;

      currentProgress = THREE.MathUtils.lerp(currentProgress, targetProgress, 0.12);
      placeBall();

      applyCamera(currentProgress);
      desiredTarget.set(0, currentProgress * TOTAL_HEIGHT * 0.5, 0);
      cameraTarget.lerp(desiredTarget, 0.06);
      camera.lookAt(cameraTarget);

      if (barRef.current) barRef.current.style.transform = `scaleX(${currentProgress})`;

      renderer.render(scene, camera);
    };

    if (reduced) {
      currentProgress = 0.12;
      placeBall();
      applyCamera(currentProgress);
      cameraTarget.set(0, currentProgress * TOTAL_HEIGHT * 0.5, 0);
      camera.lookAt(cameraTarget);
      if (hudRef.current) hudRef.current.textContent = `STEP 010 / ${STEP_COUNT}`;
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      [dust, glowA, glowB, ballMesh].forEach((o) => {
        o.geometry.dispose();
        ((o as THREE.Mesh).material as THREE.Material).dispose();
      });
      stepGeometry.dispose();
      stepMaterial.dispose();
      rimGeometry.dispose();
      rimMaterial.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [hostRef, sectionRef, hudRef, barRef]);
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const DISCIPLINES = [
  "Systems & infrastructure",
  "Product interfaces",
  "Developer tooling",
  "Performance & reliability",
];

const HELP = [
  {
    k: "Build",
    d: "New products and platforms, from first commit to real traffic.",
  },
  {
    k: "Level up",
    d: "Tooling and internal interfaces your team stops fighting.",
  },
  {
    k: "Rescue",
    d: "Latency and reliability work on systems that really can't fail.",
  },
];

function Panel({
  tag,
  children,
}: {
  tag: string;
  children: React.ReactNode;
}) {
  const rm = useReducedMotion();
  return (
    <div className="flex min-h-[115svh] items-center px-5 md:px-12">
      <motion.div
        initial={rm ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={rm ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="panel-fade w-full max-w-md p-5 md:p-8 lg:max-w-lg"
      >
        <p className="flex items-center gap-2 font-display text-tag font-medium tracking-[0.08em] text-white/40 uppercase">
          <span aria-hidden className="size-[5px] rounded-full bg-energy" />
          {tag}
        </p>
        {children}
      </motion.div>
    </div>
  );
}

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useStaircaseScene(hostRef, hudRef, barRef, sectionRef);

  return (
    <section ref={sectionRef} id="team" className="relative bg-void" aria-label="Our story">
      {/* scene lighting — one cool, dim wash over the whole story */}
      <div aria-hidden className="scene-wash pointer-events-none absolute inset-0" />
      {/* sticky 3D backdrop — right half on desktop, full-bleed on mobile */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2" ref={hostRef} aria-hidden />
        {/* blends the canvas into the page void */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-b from-void via-transparent to-void md:w-1/2 md:bg-gradient-to-r md:from-void md:via-void/60 md:to-transparent" />
        {/* flight HUD */}
        <div className="pointer-events-none absolute right-5 bottom-6 flex items-center gap-3 md:right-[52%]">
          <span
            ref={hudRef}
            className="font-mono text-micro tracking-[0.14em] text-white/50 uppercase"
          >
            STEP 001 / {STEP_COUNT}
          </span>
          <div className="h-px w-28 overflow-hidden bg-white/10 md:w-40">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-arc"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* panels ride the left half on desktop, overlay full-width on mobile */}
      <div className="relative">
        {/* the team */}
        <Panel tag="The team">
          <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
            A tight core.
            <br />
            <span className="font-medium">A deep bench.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-pretty text-body leading-relaxed tracking-[-0.01em] text-white/65">
            You'll work with the people actually writing your code, from the first call to
            the last deploy. No account managers in between. When a project grows, we pull in
            specialists we've shipped with for years — the team bends around the work, not the
            other way round.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {DISCIPLINES.map((d) => (
              <li
                key={d}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-micro font-medium tracking-[0.06em] text-white/60 uppercase"
              >
                {d}
              </li>
            ))}
          </ul>
        </Panel>

        {/* the goal */}
        <Panel tag="Our goal">
          <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
            Make software feel <span className="font-medium">like thought.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-pretty text-body leading-relaxed tracking-[-0.01em] text-white/65">
            Fast software is respectful software. That's really the whole philosophy: a screen
            should answer before you finish doubting it. We measure ourselves on that, then we
            measure again.
          </p>
          <p className="mt-4 max-w-[46ch] text-body leading-relaxed tracking-[-0.01em] text-white/65">
            Speed gets the attention. Reliability keeps it.
          </p>
        </Panel>

        {/* how we help */}
        <Panel tag="How we help">
          <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
            Build. Level up. <span className="font-medium">Rescue.</span>
          </h2>
          <ul className="mt-8 space-y-6">
            {HELP.map((h, i) => (
              <li key={h.k} className="border-l border-white/10 pl-5">
                <p className="font-display text-lead font-medium text-white">
                  <span className="mr-3 font-mono text-micro text-arc">0{i + 1}</span>
                  {h.k}
                </p>
                <p className="mt-1.5 max-w-[42ch] text-body leading-relaxed text-white/60">{h.d}</p>
              </li>
            ))}
          </ul>
          <a
            href="/contact"
            className="group mt-9 inline-flex items-center gap-2 font-display text-nav font-medium text-white transition-colors hover:text-accent"
          >
            Start a project
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Panel>
      </div>
    </section>
  );
}
