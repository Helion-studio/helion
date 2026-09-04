"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

/**
 * THE SPRING STAIRCASE — Helion's story section.
 *
 * Raw Three.js (no R3F, no physics engine, no texture files — every surface
 * is code) mounted in an effect. A helix of 80 instanced steps; a glowing
 * fresnel sphere travels down it, bouncing step-to-step on a sine arc,
 * driven deterministically by scroll position and smoothed with lerp(0.12).
 *
 * Structure: a tall scroll track (3 × 120vh panels) with a sticky 100svh
 * canvas behind it — the section-level equivalent of the spec's fixed
 * canvas, scoped so it never fights the hero's WebGL layer.
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
const ON_STEP = STEP_HEIGHT / 2 + BALL_RADIUS + 0.01; // ball sits ON the tread

const ballVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 transformed = position;
    float wave = sin(position.x * 5.0 + uTime * 2.0) * 0.015;
    transformed += normal * wave;

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

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 3.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0);

    vec3 baseColor = vec3(0.15, 0.5, 1.0);
    vec3 glowColor = vec3(0.3, 0.8, 1.0);
    vec3 color = baseColor + glowColor * fresnel * (0.6 + pulse * 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Scroll-driven Three scene. Returns nothing; owns its full lifecycle. */
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
      return; // no WebGL — panels still render, staircase simply absent
    }

    const fine = window.matchMedia("(pointer: fine)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, fine ? 2 : 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030508, 0.04); // the helix reveals itself through fog

    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.set(9, 6, 9);

    // code-generated environment lighting — reflections without a single texture file
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.4;
    pmrem.dispose();

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0x3b82f6, 0.8); // Helion-blue sheen on the metal
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    // staircase — one InstancedMesh, one draw call
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

    const stepGeometry = new THREE.BoxGeometry(STEP_WIDTH, STEP_HEIGHT, STEP_DEPTH);
    const stepMaterial = new THREE.MeshStandardMaterial({
      color: 0x202025,
      roughness: 0.32,
      metalness: 0.45,
    });
    const stairs = new THREE.InstancedMesh(stepGeometry, stepMaterial, STEP_COUNT);
    const M = new THREE.Matrix4();
    const Q = new THREE.Quaternion();
    const E = new THREE.Euler();
    const ONE = new THREE.Vector3(1, 1, 1);
    stepPositions.forEach((p, i) => {
      E.set(0, -stepAngles[i], 0);
      Q.setFromEuler(E);
      M.compose(p, Q, ONE);
      stairs.setMatrixAt(i, M);
    });
    stairs.instanceMatrix.needsUpdate = true;
    scene.add(stairs);

    // ball — shader sphere + additive glow shell + travelling light + micro-dust
    const ball = new THREE.Group();
    const ballUniforms = { uTime: { value: 0 } };
    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BALL_RADIUS, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: ballVertex,
        fragmentShader: ballFragment,
        uniforms: ballUniforms,
      }),
    );
    ball.add(ballMesh);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x44aaff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ball.add(glow);
    ball.add(new THREE.PointLight(0x44aaff, 5, 8));

    const dustCount = 150;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 0.9 + Math.random() * 1.4;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.2;
      dustPositions[i * 3] = Math.cos(a) * r;
      dustPositions[i * 3 + 1] = y;
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

    // scroll → progress (scoped to this section, not the document)
    let scrollStart = 0;
    let scrollEnd = 1;
    let targetProgress = 0;
    let currentProgress = 0;

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
      measure();
      onScroll();
    };

    measure();
    onScroll();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // pause whenever the section leaves the viewport
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

      const from = stepPositions[index];
      const to = stepPositions[index + 1];
      ball.position.lerpVectors(from, to, t);
      ball.position.y += Math.sin(t * Math.PI) * 0.8 + ON_STEP; // the bounce arc

      const airborne = Math.sin(t * Math.PI); // spin faster mid-flight
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

      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      ballUniforms.uTime.value = t;
      dust.rotation.y = t * 0.12;

      currentProgress = THREE.MathUtils.lerp(currentProgress, targetProgress, 0.12);
      placeBall();

      camera.position.y = 5 + currentProgress * 5;
      desiredTarget.set(0, currentProgress * TOTAL_HEIGHT * 0.5, 0);
      cameraTarget.lerp(desiredTarget, 0.06);
      camera.lookAt(cameraTarget);

      if (barRef.current) barRef.current.style.transform = `scaleX(${currentProgress})`;

      renderer.render(scene, camera);
    };

    if (reduced) {
      // static composition — ball resting a few steps down, rendered once
      currentProgress = 0.12;
      placeBall();
      camera.position.y = 5 + currentProgress * 5;
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
      dust.geometry.dispose();
      (dust.material as THREE.Material).dispose();
      ballMesh.geometry.dispose();
      (ballMesh.material as THREE.Material).dispose();
      glow.geometry.dispose();
      (glow.material as THREE.Material).dispose();
      stepGeometry.dispose();
      stepMaterial.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [hostRef, sectionRef, hudRef, barRef]);
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const TEAM = [
  { name: "Alex", role: "Systems & real-time infrastructure", shade: "#0b1e3f", period: 3.2 },
  { name: "Sam", role: "Product engineering & interfaces", shade: "#123a6b", period: 3.8 },
  { name: "Jordan", role: "Developer tooling & platforms", shade: "#0d2848", period: 4.4 },
  { name: "Casey", role: "Performance & reliability", shade: "#10315e", period: 5.0 },
];

const HELP = [
  {
    k: "Build",
    d: "Greenfield products and real-time platforms — from first commit to production traffic.",
  },
  {
    k: "Level up",
    d: "Developer tooling and internal interfaces your team stops fighting and starts enjoying.",
  },
  {
    k: "Rescue",
    d: "Latency, reliability and performance work on systems that cannot afford to fail.",
  },
];

function Panel({
  align,
  tag,
  children,
  className,
}: {
  align: "left" | "right";
  tag: string;
  children: React.ReactNode;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <div
      className={`flex min-h-[120svh] items-center px-5 md:px-12 ${
        align === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <motion.div
        initial={rm ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={rm ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md md:p-10 ${className ?? ""}`}
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
      {/* sticky 3D backdrop */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={hostRef} className="absolute inset-0" aria-hidden />
        {/* edge fades so the helix melts into the page void */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-void to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-void to-transparent" />
        {/* flight HUD */}
        <div className="pointer-events-none absolute bottom-6 left-5 flex items-center gap-3 md:left-12">
          <span
            ref={hudRef}
            className="font-mono text-micro tracking-[0.14em] text-white/50 uppercase"
          >
            STEP 001 / {STEP_COUNT}
          </span>
          <div className="h-px w-28 overflow-hidden bg-white/10 md:w-40">
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0 bg-arc"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* scrolling panels over the staircase */}
      <div className="relative">
        {/* the team */}
        <Panel align="left" tag="The team">
          <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
            Four builders.
            <br />
            Zero handoffs.
          </h2>
          <p className="mt-5 max-w-[46ch] text-body leading-relaxed tracking-[-0.01em] text-white/65">
            Helion is deliberately small. The people you meet on day one are the people who ship —
            no account managers, no layers, no telephone game. Senior engineers who own outcomes
            end to end.
          </p>
          <ul className="mt-8 space-y-4">
            {TEAM.map((m) => (
              <li key={m.name} className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-medium text-[#cfe4ff] ring-2 ring-void"
                  style={{ backgroundColor: m.shade }}
                >
                  {m.name[0]}
                </span>
                <span className="text-body font-medium text-white">{m.name}</span>
                <span className="text-micro tracking-wide text-white/45 uppercase">{m.role}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* the goal */}
        <Panel align="right" tag="Our goal">
          <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
            Software that feels instant —{" "}
            <span className="font-medium">and holds under load.</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-body leading-relaxed tracking-[-0.01em] text-white/65">
            We build the kind of software people forget exists — real-time platforms and tooling
            that respond in milliseconds and stay boringly reliable at 3 a.m. Speed is the
            feature. Reliability is the promise.
          </p>
          <p className="mt-4 max-w-[46ch] text-body leading-relaxed tracking-[-0.01em] text-white/65">
            Every decision — architecture, interface, infrastructure — is measured against one
            question: does this feel immediate on every device a client touches?
          </p>
        </Panel>

        {/* how we help */}
        <Panel align="left" tag="How we help">
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
            href="#contact"
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
