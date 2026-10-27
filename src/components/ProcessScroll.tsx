"use client";

/**
 * Scroll-driven 3D sheet-metal manufacturing process.
 *
 * Procedural sheet-metal fabrication simulation built with Three.js / React Three Fiber.
 * Left-to-right on desktop (content on left, 3D on right),
 * Single-column on mobile (3D on top, content below).
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
const T = 0.07; // Sheet thickness
const X0 = -1.35; // Sheet left edge
const HINGE = 0.72; // 90-degree fold line
const EDGE = 1.28; // Flange outer edge after shear
const X1 = 1.62; // Sheet right edge before shear
const HZ = 0.72; // Half-depth (total depth = 1.44)
const D = HZ * 2;
const Y = T / 2 + 0.003;
const HI = 2.2;
const STRIP_CX = (EDGE + X1) / 2;

// Raw skeleton frame dimensions (more compact)
const FRAME_X = 2.15;
const FRAME_Z = 1.25;

/* ───────────────────── Industrial Laser Cutouts ───────────────────── */

// 4 Corner mounting holes
const MOUNT_HOLES = [
  { x: -1.12, z: -0.52, r: 0.065 },
  { x: -1.12, z: 0.52, r: 0.065 },
  { x: 0.48, z: -0.52, r: 0.065 },
  { x: 0.48, z: 0.52, r: 0.065 },
];

// Center circular aperture + 4 satellite bolt holes
const CENTER_HOLE = { x: 0.04, z: 0, r: 0.22 };
const SATELLITE_HOLES = [
  { x: 0.04, z: -0.34, r: 0.04 },
  { x: 0.04, z: 0.34, r: 0.04 },
  { x: -0.22, z: 0, r: 0.04 },
  { x: 0.30, z: 0, r: 0.04 },
];

// 3 Industrial ventilation slots (capsule shapes)
const SLOTS = [
  { x0: -0.92, x1: -0.42, z: -0.26, r: 0.045 },
  { x0: -0.92, x1: -0.42, z: 0.0, r: 0.045 },
  { x0: -0.92, x1: -0.42, z: 0.26, r: 0.045 },
];

/* ───────────────────────── helpers & contours ───────────────────────── */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => t * t * (3 - 2 * t);
const phase = (t: number, i: number, a: number, b: number) =>
  clamp01((t - i - a) / (b - a));

const v = (x: number, z: number) => new THREE.Vector3(x, 0, z);

function densify(points: THREE.Vector3[], step = 0.035) {
  const out = [points[0].clone()];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const n = Math.max(1, Math.ceil(a.distanceTo(b) / step));
    for (let k = 1; k <= n; k++) out.push(a.clone().lerp(b, k / n));
  }
  return out;
}

const circlePts = (cx: number, cz: number, r: number, segs = 32) =>
  Array.from({ length: segs + 1 }, (_, k) => {
    const a = (k / segs) * Math.PI * 2;
    return v(cx + Math.cos(a) * r, cz + Math.sin(a) * r);
  });

function createSlotPath(s: { x0: number; x1: number; z: number; r: number }) {
  const p = new THREE.Path();
  const cy = -s.z;
  p.moveTo(s.x0, cy + s.r);
  p.lineTo(s.x1, cy + s.r);
  p.absarc(s.x1, cy, s.r, Math.PI / 2, -Math.PI / 2, true);
  p.lineTo(s.x0, cy - s.r);
  p.absarc(s.x0, cy, s.r, -Math.PI / 2, -Math.PI * 1.5, true);
  p.closePath();
  return p;
}

function createCenteredSlotShape(w: number, r: number) {
  const hw = w / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, r);
  shape.lineTo(hw, r);
  shape.absarc(hw, 0, r, Math.PI / 2, -Math.PI / 2, true);
  shape.lineTo(-hw, -r);
  shape.absarc(-hw, 0, r, -Math.PI / 2, -Math.PI * 1.5, true);
  shape.closePath();
  return shape;
}

const slotLaserPts = (s: (typeof SLOTS)[number]) => {
  const p = createSlotPath(s);
  const pts2d = p.getPoints(24);
  return densify(
    pts2d.map((pt) => v(pt.x, -pt.y)),
    0.03,
  );
};

// Build all laser cut paths in sequence
const RAW: THREE.Vector3[][] = [
  // 1. Four corner mounting holes
  ...MOUNT_HOLES.map((h) => circlePts(h.x, h.z, h.r)),
  // 2. Three industrial air cooling slots
  ...SLOTS.map((s) => slotLaserPts(s)),
  // 3. Center aperture & satellite holes
  circlePts(CENTER_HOLE.x, CENTER_HOLE.z, CENTER_HOLE.r),
  ...SATELLITE_HOLES.map((h) => circlePts(h.x, h.z, h.r, 20)),
  // 4. Outer blank perimeter
  densify([v(X0, -HZ), v(X1, -HZ), v(X1, HZ), v(X0, HZ), v(X0, -HZ)]),
];

const TOTAL_PTS = RAW.reduce((n, p) => n + p.length, 0);

type Contour = {
  pts: THREE.Vector3[];
  segs: number;
  start: number;
  share: number;
};

const CONTOURS: Contour[] = (() => {
  let acc = 0;
  return RAW.map((pts) => {
    const share = pts.length / TOTAL_PTS;
    const c = { pts, segs: pts.length - 1, start: acc, share };
    acc += share;
    return c;
  });
})();

const BEND_GUIDE = densify([v(HINGE, -HZ - 0.15), v(HINGE, HZ + 0.15)]);
const SHEAR_GUIDE = densify([v(EDGE, -HZ - 0.15), v(EDGE, HZ + 0.15)]);

const CAMS: [number, number, number][] = [
  [0.4, 3.4, 4.8], // 01 Raw sheet (compact overview)
  [0, 4.8, 1.8], // 02 Design (top-down CAD view)
  [0.2, 3.8, 3.2], // 03 Laser cut (isometric cut view)
  [2.4, 2.6, 3.4], // 04 Shear (shear blade angle)
  [1.2, 2.3, 3.6], // 05 Bend (press brake view)
  [0.35, 1.8, 2.8], // 06 Weld (focus on gusset joint)
  [2.4, 2.0, 4.2], // 07 Fabricate (beauty rotating angle)
];

const LOOK: [number, number, number][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0.9, 0, 0],
  [0.55, 0.2, 0],
  [0.55, 0.18, 0],
  [0, 0.15, 0],
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
  const gusset = useRef<THREE.Group>(null!);
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
        metalness: 0.95,
        roughness: 0.38,
      }),
    [],
  );

  const tool = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#353d45",
        metalness: 0.85,
        roughness: 0.35,
      }),
    [],
  );

  const geo = useMemo(() => {
    const ex = (shape: THREE.Shape, depth = T) => {
      const g = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 36,
      });
      g.rotateX(-Math.PI / 2);
      g.translate(0, -depth / 2, 0);
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

    // Scrap frame around the initial blank
    const frameShape = rect(
      -FRAME_X,
      FRAME_X,
      -FRAME_Z,
      FRAME_Z,
      new THREE.Shape(),
    ) as THREE.Shape;
    frameShape.holes.push(rect(X0, X1, -HZ, HZ, new THREE.Path()));

    // Body with industrial cutouts
    const bodyShape = rect(
      X0,
      HINGE,
      -HZ,
      HZ,
      new THREE.Shape(),
    ) as THREE.Shape;

    // Add circular holes
    const allCircles = [
      ...MOUNT_HOLES,
      CENTER_HOLE,
      ...SATELLITE_HOLES,
    ];
    allCircles.forEach((h) => {
      const p = new THREE.Path();
      p.absarc(h.x, -h.z, h.r, 0, Math.PI * 2, true);
      bodyShape.holes.push(p);
    });

    // Add slot cutouts
    SLOTS.forEach((s) => {
      bodyShape.holes.push(createSlotPath(s));
    });

    // Generate slug geometries for holes & slots
    const slugGeos: THREE.BufferGeometry[] = [];

    // 1. Mount holes slugs
    MOUNT_HOLES.forEach((h) => {
      slugGeos.push(
        new THREE.CylinderGeometry(h.r - 0.003, h.r - 0.003, T, 24),
      );
    });

    // 2. Slot slugs (centered so they sit perfectly at their position)
    SLOTS.forEach((s) => {
      const w = s.x1 - s.x0;
      slugGeos.push(ex(createCenteredSlotShape(w, s.r)));
    });

    // 3. Center hole slug
    slugGeos.push(
      new THREE.CylinderGeometry(
        CENTER_HOLE.r - 0.003,
        CENTER_HOLE.r - 0.003,
        T,
        32,
      ),
    );

    // 4. Satellite slugs
    SATELLITE_HOLES.forEach((h) => {
      slugGeos.push(
        new THREE.CylinderGeometry(h.r - 0.003, h.r - 0.003, T, 16),
      );
    });

    const gBase = 0.28;
    const gHeight = 0.36;
    const weldInset = 0.05;
    const weldLen = gBase - weldInset;

    const gussetShape = new THREE.Shape();
    gussetShape.moveTo(-gBase, 0);
    gussetShape.lineTo(0, 0);
    gussetShape.lineTo(0, gHeight);
    gussetShape.closePath();

    const gussetGeo = new THREE.ExtrudeGeometry(gussetShape, {
      depth: 0.05,
      bevelEnabled: false,
    });
    // Center in Z
    gussetGeo.translate(0, 0, -0.025);

    return {
      frame: ex(frameShape),
      body: ex(bodyShape),
      flange: new THREE.BoxGeometry(EDGE - HINGE, T, D),
      strip: new THREE.BoxGeometry(X1 - EDGE, T, D),
      slugs: slugGeos,
      gusset: gussetGeo,
      weldBead: new THREE.CylinderGeometry(0.016, 0.016, weldLen, 12),
    };
  }, []);

  const HOT = useMemo(() => new THREE.Color("#ff4a1c"), []);
  const STEEL = useMemo(() => new THREE.Color("#9aa3ad"), []);

  useFrame((state, dt) => {
    sm.current = THREE.MathUtils.damp(sm.current, progress.current * N, 4, dt);
    const t = sm.current;

    // Smooth turntable rotation
    root.current.rotation.y =
      -0.35 * (1 - ease(phase(t, 0, 0.3, 1))) +
      ease(phase(t, 6, 0, 1)) * (Math.PI * 2 - 0.4);

    /* 02 · Design — outline + bend / shear guides */
    const d = ease(phase(t, 1, 0.05, 0.85));

    /* 03 · Laser — contours are cut sequentially */
    const cutP = phase(t, 2, 0.05, 0.72);
    const fade = 1 - phase(t, 2, 0.74, 0.86);
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
        slug.position.y = -g * 2.4;
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
    frame.current.position.z = -sep * 6;
    frame.current.visible = sep < 1;

    /* 04 · Shear — blade drops, offcut strip falls away */
    const sDown = ease(phase(t, 3, 0.05, 0.35));
    const sFall = ease(phase(t, 3, 0.38, 0.7));
    const sUp = ease(phase(t, 3, 0.62, 0.85));
    blade.current.visible = t > 3 && t < 4;
    blade.current.position.y = HI - (HI - 0.25) * sDown + (HI - 0.25) * sUp;
    strip.current.position.set(STRIP_CX + sFall * 0.7, -sFall * 2.6, 0);
    strip.current.rotation.z = -sFall * 0.9;
    strip.current.visible = sFall < 1;

    /* 05 · Bend — clamp drops, flange folds up 90° */
    const bDown = ease(phase(t, 4, 0.02, 0.22));
    const bFold = ease(phase(t, 4, 0.25, 0.75));
    const bUp = ease(phase(t, 4, 0.78, 0.98));
    const clampY = T / 2 + 0.25;
    punch.current.visible = t > 4 && t < 5;
    punch.current.position.y = HI - (HI - clampY) * bDown + (HI - clampY) * bUp;
    hinge.current.rotation.z = bFold * (Math.PI / 2);

    /* 06 · Weld — Reinforcing corner gusset installed and welded */
    const gAppear = ease(phase(t, 5, 0.0, 0.15));
    const w = phase(t, 5, 0.16, 0.72);
    const cool = ease(phase(t, 5, 0.74, 0.96));

    gusset.current.visible = t >= 5;
    if (t >= 5 && t < 6) {
      gusset.current.position.y = Y + (1 - gAppear) * 0.8;
      gusset.current.scale.setScalar(gAppear);
    } else if (t >= 6) {
      gusset.current.position.y = Y;
      gusset.current.scale.setScalar(1);
    }

    const gBase = 0.28;
    const weldInset = 0.05;
    const weldLen = gBase - weldInset;
    const weldStartX = HINGE - gBase + weldInset;
    const weldEndX = HINGE;
    const currentTorchX = weldStartX + (weldEndX - weldStartX) * w;

    torch.current.visible = w > 0 && w < 1;
    torch.current.position.set(currentTorchX, Y + 0.02, 0);

    bead.current.visible = w > 0;
    bead.current.scale.set(
      1 - 0.3 * cool,
      Math.max(w, 0.001),
      1 - 0.3 * cool,
    );
    // Center bead over the welded portion so far
    const currentBeadCenter = weldStartX + (weldLen * w) / 2;
    bead.current.position.set(currentBeadCenter, Y + 0.015, 0);

    beadMat.current.emissiveIntensity = 2.5 * (1 - cool);
    beadMat.current.color.lerpColors(HOT, STEEL, cool);

    /* Camera glide */
    const i = Math.min(N - 1, Math.floor(t));
    const f = i === 0 ? 1 : ease(phase(t, i, 0, 0.4));
    const ca = CAMS[Math.max(0, i - 1)];
    const cb = CAMS[i];
    const la = LOOK[Math.max(0, i - 1)];
    const lb = LOOK[i];

    const asp = state.size.width / state.size.height;
    const zoom = asp < 0.8 ? 1.55 : asp < 1.15 ? 1.2 : 1.0;
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

  // Calculate slug positions
  const slugPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // 1. Mount holes
    MOUNT_HOLES.forEach((h) => list.push([h.x, 0, h.z]));
    // 2. Slots (center of slot)
    SLOTS.forEach((s) => list.push([(s.x0 + s.x1) / 2, 0, s.z]));
    // 3. Center hole
    list.push([CENTER_HOLE.x, 0, CENTER_HOLE.z]);
    // 4. Satellites
    SATELLITE_HOLES.forEach((h) => list.push([h.x, 0, h.z]));
    return list;
  }, []);

  return (
    <group ref={root}>
      <group position={[-0.15, 0, 0]}>
        {/* Scrap skeleton frame */}
        <group ref={frame}>
          <mesh geometry={geo.frame} material={metal} />
        </group>

        {/* Main sheet body */}
        <mesh geometry={geo.body} material={metal} />

        {/* Fallaway slugs */}
        {geo.slugs.map((g, k) => (
          <mesh
            key={k}
            ref={(r) => {
              slugs.current[k] = r;
            }}
            geometry={g}
            material={metal}
            position={slugPositions[k]}
          />
        ))}

        {/* Bending Flange */}
        <group ref={hinge} position={[HINGE, 0, 0]}>
          <mesh
            geometry={geo.flange}
            material={metal}
            position={[(EDGE - HINGE) / 2, 0, 0]}
          />
        </group>

        {/* Sheared Offcut Strip */}
        <mesh
          ref={strip}
          geometry={geo.strip}
          material={metal}
          position={[STRIP_CX, 0, 0]}
        />

        {/* Welded Corner Gusset (structural joint) */}
        <group ref={gusset} position={[HINGE, Y, 0]} visible={false}>
          <mesh geometry={geo.gusset} material={metal} />
        </group>

        {/* Welded Fillet Bead along the Gusset Joint */}
        <mesh
          ref={bead}
          position={[HINGE - 0.14, Y + 0.015, 0]}
          rotation={[0, 0, Math.PI / 2]}
          geometry={geo.weldBead}
          visible={false}
        >
          <meshStandardMaterial
            ref={beadMat}
            color="#ff4a1c"
            emissive="#ff6a00"
            emissiveIntensity={2.5}
            metalness={0.65}
            roughness={0.45}
          />
        </mesh>

        {/* Laser & Tooling Guides */}
        <group ref={lines} position={[0, Y, 0]} visible={false}>
          {CONTOURS.map((c, k) => (
            <Line
              key={`d${k}`}
              ref={(r) => {
                design.current[k] = r;
              }}
              points={c.pts}
              color="#b6b8bd"
              lineWidth={1.5}
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
            dashSize={0.08}
            gapSize={0.05}
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
            dashSize={0.08}
            gapSize={0.05}
            transparent
          />
          {CONTOURS.map((c, k) => (
            <Line
              key={`c${k}`}
              ref={(r) => {
                cut.current[k] = r;
              }}
              position={[0, 0.003, 0]}
              points={c.pts}
              color="#07080a"
              lineWidth={3}
              transparent
            />
          ))}
        </group>

        {/* Laser Head Tool */}
        <group ref={laser} visible={false}>
          <mesh
            position={[0, 0.18, 0]}
            rotation={[Math.PI, 0, 0]}
            material={tool}
          >
            <coneGeometry args={[0.08, 0.38, 24]} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#ffd9a8" />
          </mesh>
          <pointLight color="#ff4a1c" intensity={3} distance={2.5} />
          <Sparkles
            count={20}
            scale={[0.45, 0.25, 0.45]}
            size={4}
            speed={1.6}
            color="#ff4a1c"
            position={[0, 0.08, 0]}
          />
        </group>

        {/* Shearing Blade */}
        <mesh
          ref={blade}
          material={tool}
          position={[EDGE + 0.035, HI, 0]}
          visible={false}
        >
          <boxGeometry args={[0.07, 0.65, D + 0.4]} />
        </mesh>

        {/* Press Brake Punch */}
        <mesh
          ref={punch}
          material={tool}
          position={[HINGE - 0.18, HI, 0]}
          visible={false}
        >
          <boxGeometry args={[0.26, 0.45, D + 0.2]} />
        </mesh>

        {/* Welding Torch Tool */}
        <group ref={torch} visible={false}>
          <mesh
            position={[-0.12, 0.16, 0]}
            rotation={[0, 0, Math.PI + 0.65]}
            material={tool}
          >
            <coneGeometry args={[0.065, 0.4, 16]} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#ffd9a8" />
          </mesh>
          <pointLight color="#ff8a5c" intensity={4} distance={2.5} />
          <Sparkles
            count={24}
            scale={[0.4, 0.35, 0.4]}
            size={5}
            speed={2}
            color="#ffc27a"
            position={[0, 0.1, 0]}
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
        const p =
          total > 0 ? clamp01(-el.getBoundingClientRect().top / total) : 0;
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
        {/* Subtle background gradient glow */}
        <div className="ps-bg-glow" aria-hidden="true" />
        <div className="ps-grain grain-layer" aria-hidden="true" />

        {/* ══ Responsive Split Layout: Desktop 2-Col (Content Left, 3D Right), Mobile Single-Col (3D Top, Content Below) ══ */}
        <div className="ps-layout">
          {/* ── Content Panel (Left on Desktop, Below on Mobile) ── */}
          <div className="ps-content-panel">
            <div className="ps-meta">
              <span className="ps-num">{stage.number}</span>
              <span className="ps-count">
                / {String(stages.length).padStart(2, "0")}
              </span>
              <span className="ps-bullet">·</span>
              <span className="ps-stage-pill">{stage.label}</span>
            </div>

            <div key={stage.id} className="ps-in">
              <h2 className="ps-title">{stage.label}</h2>
              <p className="ps-desc">{stage.description}</p>
              {stage.fact && (
                <div className="ps-fact-wrap">
                  <span className="ps-fact">{stage.fact}</span>
                </div>
              )}
            </div>

            {/* Stage timeline buttons */}
            <div className="ps-rail-wrap">
              <div className="ps-rail" aria-label="Process stages">
                {stages.map((s, i) => (
                  <button
                    key={s.id}
                    className={`ps-dot-btn ${i === active ? "is-on" : ""}${
                      i < active ? " is-done" : ""
                    }`}
                    onClick={() => jumpTo(i)}
                    aria-label={`${s.number} ${s.label}`}
                    aria-current={i === active}
                  >
                    <span className="ps-dot-indicator" />
                    <span className="ps-dot-name">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 3D Viewport Panel (Right on Desktop, Top on Mobile) ── */}
          <div className="ps-canvas-panel">
            <div className="ps-canvas-card">
              <Canvas
                className="ps-canvas"
                dpr={[1, 1.75]}
                camera={{ fov: 35, position: [0.4, 3.4, 4.8] }}
              >
                <ambientLight intensity={0.4} />
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
                    intensity={2.2}
                    position={[-5, 2, 2]}
                    rotation-y={Math.PI / 2}
                    scale={[6, 3, 1]}
                  />
                  <Lightformer
                    form="rect"
                    intensity={2.2}
                    position={[5, 2, -2]}
                    rotation-y={-Math.PI / 2}
                    scale={[6, 3, 1]}
                  />
                  <Lightformer
                    form="rect"
                    intensity={1.6}
                    position={[0, 2, 6]}
                    rotation-y={Math.PI}
                    scale={[8, 3, 1]}
                  />
                </Environment>

                <Model progress={progress} />

                <ContactShadows
                  position={[0, -0.65, 0]}
                  opacity={0.25}
                  scale={10}
                  blur={2.4}
                  far={3}
                />
              </Canvas>

              {/* Viewport header tags */}
              <div className="ps-canvas-tag">
                <span className="ps-pulse-dot" />
                <span>Fabrication Simulation</span>
              </div>

              {/* Scroll advance hint */}
              <div className="ps-hint">
                <span className="scroll-line h-4 w-px bg-white/20" />
                <span>Scroll to advance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ps {
  --ps-bg1: #14161a;
  --ps-bg2: #08090b;
  --ps-ink: #ffffff;
  --ps-mute: #a2a8b3;
  --ps-accent: #ff4a1c;
  position: relative;
  color: var(--ps-ink);
}

.ps-stick {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: radial-gradient(110% 90% at 50% 35%, var(--ps-bg1), var(--ps-bg2));
}

.ps-bg-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(70% 60% at 70% 40%, rgba(255, 74, 28, 0.035), transparent 70%);
  z-index: 1;
}

.ps-grain {
  z-index: 1;
  opacity: 0.6;
}

/* ══ Layout ══ */
.ps-layout {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Desktop layout (default min-width: 1024px) */
@media (min-width: 1024px) {
  .ps-layout {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 3.5rem;
    gap: 3.5rem;
  }

  .ps-content-panel {
    flex: 0 0 42%;
    max-width: 490px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .ps-canvas-panel {
    flex: 1;
    height: calc(100vh - 6rem);
    max-height: 720px;
    min-height: 480px;
    position: relative;
  }
}

/* ── Content Panel Elements ── */
.ps-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.ps-num {
  color: var(--ps-accent);
  font-weight: 600;
}

.ps-count {
  color: var(--ps-mute);
}

.ps-bullet {
  color: rgba(255, 255, 255, 0.2);
}

.ps-stage-pill {
  color: var(--ps-mute);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.ps-title {
  margin: 12px 0 14px;
  font-family: var(--font-display);
  font-size: clamp(34px, 4.4vw, 56px);
  font-weight: 600;
  line-height: 0.96;
  letter-spacing: -0.035em;
  color: #ffffff;
}

.ps-desc {
  margin: 0;
  color: var(--ps-mute);
  font-size: clamp(15px, 1.25vw, 17px);
  line-height: 1.6;
  max-width: 40ch;
}

.ps-fact-wrap {
  margin-top: 16px;
}

.ps-fact {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e4e7eb;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.ps-in {
  animation: ps-up 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes ps-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ── Interactive Stage Timeline ── */
.ps-rail-wrap {
  margin-top: 2rem;
}

.ps-rail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ps-dot-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: opacity 0.25s ease;
  opacity: 0.45;
}

.ps-dot-btn:hover {
  opacity: 0.85;
}

.ps-dot-btn.is-on {
  opacity: 1;
}

.ps-dot-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.ps-dot-btn.is-done .ps-dot-indicator {
  background: rgba(255, 255, 255, 0.65);
}

.ps-dot-btn.is-on .ps-dot-indicator {
  width: 18px;
  border-radius: 9999px;
  background: var(--ps-accent);
  box-shadow: 0 0 10px rgba(255, 74, 28, 0.6);
}

.ps-dot-name {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ps-mute);
  transition: color 0.25s ease;
}

.ps-dot-btn.is-on .ps-dot-name {
  color: #ffffff;
  font-weight: 500;
}

/* ── 3D Viewport Card ── */
.ps-canvas-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(130% 110% at 50% 20%, rgba(26, 29, 34, 0.6), rgba(9, 10, 12, 0.95));
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.ps-canvas {
  position: absolute !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
}

.ps-canvas-tag {
  position: absolute;
  top: 18px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ps-mute);
  pointer-events: none;
  background: rgba(10, 10, 12, 0.6);
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.ps-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ps-accent);
  box-shadow: 0 0 8px var(--ps-accent);
  animation: ps-pulse 2s infinite ease-in-out;
}

@keyframes ps-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.ps-hint {
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ps-mute);
  pointer-events: none;
  background: rgba(10, 10, 12, 0.6);
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* ══ Mobile Responsive: Single Column Layout (3D on Top, Content Below) ══ */
@media (max-width: 1023px) {
  .ps-layout {
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 1.5rem;
    gap: 1rem;
    justify-content: flex-start;
  }

  .ps-canvas-panel {
    order: 1;
    width: 100%;
    height: 44vh;
    min-height: 240px;
    max-height: 380px;
  }

  .ps-canvas-card {
    border-radius: 1rem;
  }

  .ps-content-panel {
    order: 2;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem 0.25rem 0;
  }

  .ps-title {
    margin: 8px 0 10px;
    font-size: clamp(26px, 6vw, 36px);
  }

  .ps-desc {
    font-size: 14px;
    line-height: 1.5;
  }

  .ps-rail-wrap {
    margin-top: 1rem;
  }

  .ps-rail {
    flex-direction: row;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .ps-dot-btn {
    gap: 6px;
  }

  .ps-dot-name {
    display: none;
  }

  .ps-dot-btn.is-on .ps-dot-indicator {
    width: 14px;
  }

  .ps-hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ps-in {
    animation: none;
  }
}
`;
