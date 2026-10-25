"use client";

/**
 * Scroll-driven 3D sheet-metal process.
 *
 * The sheet, tooling and cameras are fully procedural. Every pose is a pure
 * function of scroll progress, so scrolling backwards plays the process in
 * reverse. Written for the seven stages in `src/lib/process.ts`.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementRef,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Line,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import type { ProcessStage } from "@/lib/process";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { StageSnapshot } from "@/components/process/StageSnapshot";

/* ────────────────────────── part dimensions ────────────────────────── */

const N = 7;
const T = 0.08;
const X0 = -1.5;
const HINGE = 0.9;
const EDGE = 1.5;
const X1 = 1.85;
const HZ = 0.9;
const D = HZ * 2;
const Y = T / 2 + 0.003;
const HI = 2.4;
const STRIP_CX = (EDGE + X1) / 2;

const HOLES = [
  { x: -0.85, z: -0.4, r: 0.2 },
  { x: -0.85, z: 0.4, r: 0.2 },
  { x: 0.05, z: 0, r: 0.3 },
];

/* ───────────────────────── helpers & contours ───────────────────────── */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => t * t * (3 - 2 * t);
const phase = (t: number, i: number, a: number, b: number) =>
  clamp01((t - i - a) / (b - a));

const v = (x: number, z: number) => new THREE.Vector3(x, 0, z);

function densify(points: THREE.Vector3[], step = 0.04) {
  const out = [points[0].clone()];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const n = Math.max(1, Math.ceil(a.distanceTo(b) / step));
    for (let k = 1; k <= n; k++) out.push(a.clone().lerp(b, k / n));
  }
  return out;
}

const circle = (cx: number, cz: number, r: number) =>
  Array.from({ length: 65 }, (_, k) => {
    const a = (k / 64) * Math.PI * 2;
    return v(cx + Math.cos(a) * r, cz + Math.sin(a) * r);
  });

const RAW = [
  ...HOLES.map((h) => circle(h.x, h.z, h.r)),
  densify([v(X0, -HZ), v(X1, -HZ), v(X1, HZ), v(X0, HZ), v(X0, -HZ)]),
];
const TOTAL_PTS = RAW.reduce((n, p) => n + p.length, 0);

type Contour = { pts: THREE.Vector3[]; segs: number; start: number; share: number };
const CONTOURS: Contour[] = (() => {
  let acc = 0;
  return RAW.map((pts) => {
    const share = pts.length / TOTAL_PTS;
    const c = { pts, segs: pts.length - 1, start: acc, share };
    acc += share;
    return c;
  });
})();

const BEND_GUIDE = densify([v(HINGE, -HZ - 0.2), v(HINGE, HZ + 0.2)]);
const SHEAR_GUIDE = densify([v(EDGE, -HZ - 0.2), v(EDGE, HZ + 0.2)]);

const CAMS: [number, number, number][] = [
  [0.6, 3.6, 5.6],
  [0, 5.8, 2.4],
  [0.3, 4.8, 3.6],
  [3.4, 3.2, 3.8],
  [1.4, 2.6, 4.2],
  [0.2, 2.0, 3.4],
  [3.6, 2.4, 5.0],
];
const LOOK: [number, number, number][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [1.2, 0, 0],
  [0.7, 0.2, 0],
  [0.6, 0.2, 0],
  [0, 0.3, 0],
];

type LineRef = ElementRef<typeof Line>;

/* ───────────────────────────── 3D model ───────────────────────────── */

function Model({ progress }: { progress: MutableRefObject<number> }) {
  const sm = useRef(0);
  const root = useRef<THREE.Group>(null!);
  const frame = useRef<THREE.Group>(null!);
  const lines = useRef<THREE.Group>(null!);
  const hinge = useRef<THREE.Group>(null!);
  const strip = useRef<THREE.Mesh>(null!);
  const blade = useRef<THREE.Mesh>(null!);
  const punch = useRef<THREE.Mesh>(null!);
  const laser = useRef<THREE.Group>(null!);
  const torch = useRef<THREE.Group>(null!);
  const bead = useRef<THREE.Mesh>(null!);
  const beadMat = useRef<THREE.MeshStandardMaterial>(null!);
  const slugs = useRef<(THREE.Mesh | null)[]>([]);
  const design = useRef<(LineRef | null)[]>([]);
  const cut = useRef<(LineRef | null)[]>([]);
  const guides = useRef<(LineRef | null)[]>([]);

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#aab3bd",
        metalness: 1,
        roughness: 0.4,
      }),
    [],
  );
  const tool = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a424b",
        metalness: 0.85,
        roughness: 0.35,
      }),
    [],
  );

  const geo = useMemo(() => {
    const ex = (shape: THREE.Shape) => {
      const g = new THREE.ExtrudeGeometry(shape, {
        depth: T,
        bevelEnabled: false,
        curveSegments: 48,
      });
      g.rotateX(-Math.PI / 2);
      g.translate(0, -T / 2, 0);
      return g;
    };
    const rect = (
      x0: number,
      x1: number,
      z0: number,
      z1: number,
      path: THREE.Path,
    ) => {
      path.moveTo(x0, -z0);
      path.lineTo(x1, -z0);
      path.lineTo(x1, -z1);
      path.lineTo(x0, -z1);
      path.closePath();
      return path;
    };

    const frameShape = rect(-2.7, 2.7, -1.7, 1.7, new THREE.Shape()) as THREE.Shape;
    frameShape.holes.push(rect(X0, X1, -HZ, HZ, new THREE.Path()));

    const bodyShape = rect(X0, HINGE, -HZ, HZ, new THREE.Shape()) as THREE.Shape;
    HOLES.forEach((h) => {
      const path = new THREE.Path();
      path.absarc(h.x, -h.z, h.r, 0, Math.PI * 2, true);
      bodyShape.holes.push(path);
    });

    return {
      frame: ex(frameShape),
      body: ex(bodyShape),
      flange: new THREE.BoxGeometry(EDGE - HINGE, T, D),
      strip: new THREE.BoxGeometry(X1 - EDGE, T, D),
      slug: HOLES.map(
        (h) => new THREE.CylinderGeometry(h.r - 0.004, h.r - 0.004, T, 40),
      ),
    };
  }, []);

  const HOT = useMemo(() => new THREE.Color("#ff4a1c"), []);
  const STEEL = useMemo(() => new THREE.Color("#9aa3ad"), []);

  useFrame((state, dt) => {
    sm.current = THREE.MathUtils.damp(sm.current, progress.current * N, 4, dt);
    const t = sm.current;

    root.current.rotation.y =
      -0.35 * (1 - ease(phase(t, 0, 0.3, 1))) +
      ease(phase(t, 6, 0, 1)) * (Math.PI * 2 - 0.4);

    /* 02 · design — outline + bend / shear guides drawn on the sheet */
    const d = ease(phase(t, 1, 0.05, 0.85));
    /* 03 · laser — contours are cut one after another */
    const cutP = phase(t, 2, 0.05, 0.7);
    const fade = 1 - phase(t, 2, 0.72, 0.84);
    lines.current.visible = d > 0 && fade > 0;

    let head: THREE.Vector3 | null = null;
    for (let k = 0; k < CONTOURS.length; k++) {
      const c = CONTOURS[k];
      const f = clamp01((cutP - c.start) / c.share);
      const a = design.current[k];
      const b = cut.current[k];
      if (a) {
        a.geometry.instanceCount = Math.floor(d * c.segs);
        a.material.opacity = fade;
      }
      if (b) {
        b.geometry.instanceCount = Math.floor(f * c.segs);
        b.material.opacity = fade;
      }
      if (f > 0 && f < 1) {
        head = c.pts[Math.min(c.segs, Math.floor(f * c.segs))];
      }

      const slug = slugs.current[k];
      if (slug) {
        const g = ease(clamp01((cutP - c.start - c.share) / 0.1));
        slug.position.y = -g * 2.6;
        slug.rotation.x = g * 2.2;
        slug.visible = g < 1;
      }
    }
    guides.current.forEach((g, i) => {
      if (!g) return;
      const line = (i === 0 ? BEND_GUIDE : SHEAR_GUIDE).length - 1;
      g.geometry.instanceCount = Math.floor(d * line);
      g.material.opacity = fade;
    });

    laser.current.visible = head !== null;
    if (head) laser.current.position.set(head.x, Y, head.z);

    const sep = ease(phase(t, 2, 0.78, 1));
    frame.current.position.z = -sep * 7;
    frame.current.visible = sep < 1;

    /* 04 · shear — blade drops on the shear line, offcut falls away */
    const sDown = ease(phase(t, 3, 0.05, 0.35));
    const sFall = ease(phase(t, 3, 0.38, 0.7));
    const sUp = ease(phase(t, 3, 0.62, 0.85));
    blade.current.visible = t > 3 && t < 4;
    blade.current.position.y = HI - (HI - 0.25) * sDown + (HI - 0.25) * sUp;
    strip.current.position.set(STRIP_CX + sFall * 0.7, -sFall * 2.8, 0);
    strip.current.rotation.z = -sFall * 0.9;
    strip.current.visible = sFall < 1;

    /* 05 · bend — clamp comes down, flange folds up 90°, clamp lifts */
    const bDown = ease(phase(t, 4, 0.02, 0.22));
    const bFold = ease(phase(t, 4, 0.25, 0.75));
    const bUp = ease(phase(t, 4, 0.78, 0.98));
    const clampY = T / 2 + 0.25;
    punch.current.visible = t > 4 && t < 5;
    punch.current.position.y = HI - (HI - clampY) * bDown + (HI - clampY) * bUp;
    hinge.current.rotation.z = bFold * (Math.PI / 2);

    /* 06 · weld — torch travels the seam, bead cools and is dressed flat */
    const w = phase(t, 5, 0.05, 0.65);
    const cool = ease(phase(t, 5, 0.68, 0.95));
    const bx = HINGE - T / 2 - 0.03;
    torch.current.visible = w > 0 && w < 1;
    torch.current.position.set(bx, T / 2 + 0.03, -HZ + D * w);
    bead.current.visible = w > 0;
    bead.current.scale.set(
      1 - 0.5 * cool,
      Math.max(w, 0.001),
      1 - 0.5 * cool,
    );
    bead.current.position.z = -HZ + (D * w) / 2;
    beadMat.current.emissiveIntensity = 2.5 * (1 - cool);
    beadMat.current.color.lerpColors(HOT, STEEL, cool);

    /* camera: glide to this stage's pose during the first part of each stage */
    const i = Math.min(N - 1, Math.floor(t));
    const f = i === 0 ? 1 : ease(phase(t, i, 0, 0.4));
    const ca = CAMS[Math.max(0, i - 1)];
    const cb = CAMS[i];
    const la = LOOK[Math.max(0, i - 1)];
    const lb = LOOK[i];
    const asp = state.size.width / state.size.height;
    const zoom = asp < 0.8 ? 2.1 : asp < 1.2 ? 1.5 : 1;
    const m = THREE.MathUtils.lerp;
    state.camera.position.set(
      m(ca[0], cb[0], f) * zoom,
      m(ca[1], cb[1], f) * zoom,
      m(ca[2], cb[2], f) * zoom,
    );
    state.camera.lookAt(
      m(la[0], lb[0], f),
      m(la[1], lb[1], f),
      m(la[2], lb[2], f),
    );
  });

  return (
    <group ref={root}>
      <group position={[-0.175, 0, 0]}>
        <group ref={frame}>
          <mesh geometry={geo.frame} material={metal} />
        </group>
        <mesh geometry={geo.body} material={metal} />
        {HOLES.map((h, k) => (
          <mesh
            key={k}
            ref={(r) => {
              slugs.current[k] = r;
            }}
            geometry={geo.slug[k]}
            material={metal}
            position={[h.x, 0, h.z]}
          />
        ))}
        <group ref={hinge} position={[HINGE, 0, 0]}>
          <mesh
            geometry={geo.flange}
            material={metal}
            position={[(EDGE - HINGE) / 2, 0, 0]}
          />
        </group>
        <mesh
          ref={strip}
          geometry={geo.strip}
          material={metal}
          position={[STRIP_CX, 0, 0]}
        />

        <group ref={lines} position={[0, Y, 0]} visible={false}>
          {CONTOURS.map((c, k) => (
            <Line
              key={`d${k}`}
              ref={(r) => {
                design.current[k] = r;
              }}
              points={c.pts}
              color="#b6b8bd"
              lineWidth={1.6}
              transparent
            />
          ))}
          <Line
            ref={(r) => {
              guides.current[0] = r;
            }}
            points={BEND_GUIDE}
            color="#ff4a1c"
            lineWidth={1.5}
            dashed
            dashSize={0.09}
            gapSize={0.06}
            transparent
          />
          <Line
            ref={(r) => {
              guides.current[1] = r;
            }}
            points={SHEAR_GUIDE}
            color="#ff8a5c"
            lineWidth={1.5}
            dashed
            dashSize={0.09}
            gapSize={0.06}
            transparent
          />
          {CONTOURS.map((c, k) => (
            <Line
              key={`c${k}`}
              ref={(r) => {
                cut.current[k] = r;
              }}
              position={[0, 0.004, 0]}
              points={c.pts}
              color="#07080a"
              lineWidth={3.2}
              transparent
            />
          ))}
        </group>

        <group ref={laser} visible={false}>
          <mesh
            position={[0, 0.2, 0]}
            rotation={[Math.PI, 0, 0]}
            material={tool}
          >
            <coneGeometry args={[0.09, 0.4, 24]} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ffd9a8" />
          </mesh>
          <pointLight color="#ff4a1c" intensity={3} distance={2.5} />
          <Sparkles
            count={18}
            scale={[0.5, 0.3, 0.5]}
            size={4}
            speed={1.6}
            color="#ff4a1c"
            position={[0, 0.1, 0]}
          />
        </group>

        <mesh
          ref={blade}
          material={tool}
          position={[EDGE + 0.035, HI, 0]}
          visible={false}
        >
          <boxGeometry args={[0.07, 0.7, D + 0.5]} />
        </mesh>

        <mesh
          ref={punch}
          material={tool}
          position={[HINGE - 0.2, HI, 0]}
          visible={false}
        >
          <boxGeometry args={[0.3, 0.5, D + 0.2]} />
        </mesh>

        <mesh
          ref={bead}
          position={[HINGE - T / 2 - 0.03, T / 2 + 0.03, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
        >
          <cylinderGeometry args={[0.04, 0.04, D, 16]} />
          <meshStandardMaterial
            ref={beadMat}
            color="#ff4a1c"
            emissive="#ff6a00"
            emissiveIntensity={2.5}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
        <group ref={torch} visible={false}>
          <mesh
            position={[-0.17, 0.2, 0]}
            rotation={[0, 0, Math.PI + 0.7]}
            material={tool}
          >
            <coneGeometry args={[0.07, 0.45, 16]} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color="#ffd9a8" />
          </mesh>
          <pointLight color="#ff8a5c" intensity={4} distance={2.5} />
          <Sparkles
            count={24}
            scale={[0.5, 0.4, 0.5]}
            size={5}
            speed={2}
            color="#ffc27a"
            position={[0, 0.15, 0]}
          />
        </group>
      </group>
    </group>
  );
}

/* ─────────────────────────── static fallback ─────────────────────────── */

function StaticProcess({ stages }: { stages: ProcessStage[] }) {
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-window)] border border-white/10 bg-graphite">
          <StageSnapshot stage={6} />
        </div>
        <ol className="border-t border-white/10">
          {stages.map((stage) => (
            <li
              key={stage.id}
              className="grid gap-2 border-b border-white/10 py-5 sm:grid-cols-[4rem_1fr] sm:items-start"
            >
              <span className="font-mono text-sm text-steel-500">
                {stage.number}
              </span>
              <div>
                <p className="font-display text-xl leading-tight text-white">
                  {stage.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-steel-300">
                  {stage.description}
                </p>
                {stage.fact ? (
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-500">
                    {stage.fact}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ───────────────────────────── page section ───────────────────────────── */

export function ProcessScroll({ stages }: { stages: ProcessStage[] }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        const el = section.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? clamp01(-el.getBoundingClientRect().top / total) : 0;
        progress.current = p;
        setActive(Math.min(N - 1, Math.floor(p * N)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
        frame.current = 0;
      }
    };
  }, [reduced]);

  const jumpTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((i + 0.5) / N) * total,
      behavior: "smooth",
    });
  };

  if (reduced) {
    return <StaticProcess stages={stages} />;
  }

  const stage = stages[active];

  return (
    <section
      ref={section}
      className="ps"
      style={{ height: `${N * 68 + 100}vh` } as CSSProperties}
      aria-label="Our process"
    >
      <style>{CSS}</style>
      <div className="ps-stick">
        <Canvas
          className="ps-canvas"
          dpr={[1, 1.75]}
          camera={{ fov: 35, position: [0.6, 3.6, 5.6] }}
        >
          <ambientLight intensity={0.35} />
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={4}
              position={[0, 5, 0]}
              rotation-x={Math.PI / 2}
              scale={[10, 10, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              position={[-5, 2, 2]}
              rotation-y={Math.PI / 2}
              scale={[6, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              position={[5, 2, -2]}
              rotation-y={-Math.PI / 2}
              scale={[6, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[0, 2, 6]}
              rotation-y={Math.PI}
              scale={[8, 3, 1]}
            />
          </Environment>
          <Model progress={progress} />
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.2}
            scale={12}
            blur={2.6}
            far={3}
          />
        </Canvas>

        <div className="ps-scrim" aria-hidden="true" />
        <div className="ps-grain grain-layer" aria-hidden="true" />

        {stage && (
          <div className="ps-card" aria-live="polite">
            <div className="ps-meta">
              <span className="ps-num">{stage.number}</span>
              <span className="ps-count">
                / {String(stages.length).padStart(2, "0")}
              </span>
            </div>
            <div key={stage.id} className="ps-in">
              <h2 className="ps-title">{stage.label}</h2>
              <p className="ps-desc">{stage.description}</p>
              {stage.fact && <span className="ps-fact">{stage.fact}</span>}
            </div>
          </div>
        )}

        <nav className="ps-rail" aria-label="Process stages">
          {stages.map((s, i) => (
            <button
              key={s.id}
              className={`ps-dot${i === active ? " is-on" : ""}${i < active ? " is-done" : ""}`}
              onClick={() => jumpTo(i)}
              aria-label={`${s.number} ${s.label}`}
              aria-current={i === active}
            />
          ))}
        </nav>

        <div className="ps-hint">
          <span className="scroll-line h-4 w-px bg-white/20" />
          <span>Scroll to advance</span>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ps{--ps-bg1:#151517;--ps-bg2:#0a0a0b;--ps-ink:#ffffff;--ps-mute:#b6b8bd;--ps-accent:#ff4a1c;position:relative;color:var(--ps-ink)}
.ps-stick{position:sticky;top:0;height:100vh;height:100dvh;overflow:hidden;background:radial-gradient(110% 90% at 50% 35%,var(--ps-bg1),var(--ps-bg2))}
.ps-canvas{position:absolute!important;inset:0;z-index:0}
.ps-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(70% 60% at 70% 38%,transparent 30%,rgba(10,10,11,.55) 100%),linear-gradient(0deg,rgba(10,10,11,.65),transparent 48%)}
.ps-grain{z-index:1;opacity:.7}
.ps-card{position:absolute;left:clamp(20px,5vw,56px);bottom:clamp(22px,7vh,72px);max-width:min(390px,calc(100% - 80px));pointer-events:none;z-index:3}
.ps-meta{display:flex;align-items:baseline;gap:8px;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ps-accent)}
.ps-count{color:var(--ps-mute)}
.ps-title{margin:8px 0 10px;font-family:var(--font-display);font-size:clamp(34px,5.4vw,64px);font-weight:600;line-height:.95;letter-spacing:-.035em}
.ps-desc{margin:0;color:var(--ps-mute);font-size:clamp(15px,1.4vw,18px);line-height:1.55;max-width:36ch}
.ps-fact{display:inline-block;margin-top:14px;padding:7px 12px;border:1px solid rgba(255,255,255,.14);border-radius:9999px;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ps-ink);background:rgba(255,255,255,.05);backdrop-filter:blur(6px)}
.ps-in{animation:ps-up .45s cubic-bezier(.2,.7,.2,1) both}
@keyframes ps-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ps-rail{position:absolute;right:clamp(14px,2.5vw,32px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px;z-index:3}
.ps-dot{width:22px;height:22px;padding:0;border:0;background:none;cursor:pointer;position:relative}
.ps-dot::after{content:"";position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,.22);transition:all .25s}
.ps-dot.is-done::after{background:rgba(255,255,255,.6)}
.ps-dot.is-on::after{width:10px;height:10px;background:var(--ps-accent)}
.ps-dot:focus-visible{outline:2px solid var(--ps-accent);outline-offset:2px;border-radius:6px}
.ps-hint{position:absolute;right:clamp(20px,5vw,64px);bottom:clamp(26px,7vh,64px);z-index:3;display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ps-mute)}
@media (max-width:640px){
.ps-card{left:20px;right:20px;bottom:26px;max-width:none}
.ps-hint{display:none}
.ps-rail{right:10px;top:44%}
.ps-desc{font-size:14px}
}
@media (prefers-reduced-motion:reduce){.ps-in{animation:none}}
`;
