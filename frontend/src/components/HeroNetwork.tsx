/** Anything with .get() works (framer-motion/motion MotionValue, or { get: () => 0 } for a static view). */
type MotionValue<T> = { get(): T };
import { useEffect, useRef } from "react";

type V3 = [number, number, number];

/** The Javian "J": a stem that curves into a forward-pointing hook. */
const J_KEYS: V3[] = [
  [1.0, 2.1, 0],
  [1.0, 0.2, 0],
  [0.6, -1.5, 0],
  [-0.5, -2.0, 0],
  [-1.7, -1.1, 0],
];

function catmull(keys: V3[], samples: number): V3[] {
  const k = [keys[0], ...keys, keys[keys.length - 1]];
  const out: V3[] = [];
  for (let s = 0; s < keys.length - 1; s++) {
    const [p0, p1, p2, p3] = [k[s], k[s + 1], k[s + 2], k[s + 3]];
    for (let i = 0; i < samples; i++) {
      const t = i / samples, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)) as V3);
    }
  }
  out.push(keys[keys.length - 1]);
  return out;
}

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

/**
 * Lightweight 2D-canvas network (no WebGL). Points are rigid in 3D, so neighbour links are
 * computed once; each frame only projects ~150 points and strokes ONE batched path.
 * Scroll drives camera travel and depth stretch; the pointer nudges rotation.
 */
export function HeroNetwork({ progress, className }: { progress?: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

    const rand = rng(11);
    const perHub = mobile ? 12 : 26;
    const pts: V3[] = J_KEYS.map((p) => [...p] as V3);
    J_KEYS.forEach((h) => {
      for (let i = 0; i < perHub; i++) {
        const r = 0.4 + Math.pow(rand(), 0.7) * 1.6, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        pts.push([h[0] + r * Math.sin(ph) * Math.cos(th), h[1] + r * Math.sin(ph) * Math.sin(th), h[2] + r * Math.cos(ph)]);
      }
    });
    const edges: [number, number][] = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]);
        if (d < 0.9) edges.push([i, j]);
      }
    const curve = catmull(J_KEYS, 24);
    const jx = new Float32Array(curve.length), jy = new Float32Array(curve.length);
    const sx = new Float32Array(pts.length), sy = new Float32Array(pts.length), sd = new Float32Array(pts.length);

    let w = 0, h = 0, raf = 0, visible = true, last = 0;
    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const p = Math.min(1, (progress?.get() ?? 0) / 0.7), e = p * p * (3 - 2 * p);
      cur.x += (mouse.x - cur.x) * 0.06; cur.y += (mouse.y - cur.y) * 0.06;
      const yaw = (reduced ? 0 : Math.sin(t * 0.0003) * 0.28) + cur.x * 0.3;
      const pitch = cur.y * 0.22;
      const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const cam = (mobile ? 9.5 : 7.5) + (-1.5 - (mobile ? 9.5 : 7.5)) * e;
      const f = h * 1.07, cx = w > 900 ? w * 0.68 : w / 2, cy = h / 2;
      const zs = 1 + e * 7, xs = 1 + e * 0.7;

      const proj = (v: V3, i: number) => {
        const x0 = v[0] * xs, y0 = v[1] * xs, z0 = v[2] * zs;
        const x1 = x0 * cy_ + z0 * sy_, z1 = -x0 * sy_ + z0 * cy_;
        const y1 = y0 * cp - z1 * sp, z2 = y0 * sp + z1 * cp;
        const depth = cam - z2;
        if (depth < 1.2) { sd[i] = 0; return; }
        sd[i] = depth;
        sx[i] = cx + (x1 * f) / depth;
        sy[i] = cy - (y1 * f) / depth;
        // far outside the viewport: cull instead of rasterising enormous lines
        if (sx[i] < -w || sx[i] > w * 2 || sy[i] < -h || sy[i] > h * 2) sd[i] = 0;
      };

      ctx.clearRect(0, 0, w, h);
      pts.forEach(proj);

      ctx.strokeStyle = "rgba(143,176,255,0.17)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [a, b] of edges) {
        if (!sd[a] || !sd[b]) continue;
        ctx.moveTo(sx[a], sy[a]); ctx.lineTo(sx[b], sy[b]);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(223,232,255,0.85)";
      for (let i = 0; i < pts.length; i++) {
        if (!sd[i]) continue;
        const s = Math.max(1, Math.min(3, 9 / sd[i]));
        ctx.fillRect(sx[i] - s / 2, sy[i] - s / 2, s, s);
      }

      // The J itself, projected with the same camera
      let ok = true;
      for (let i = 0; i < curve.length; i++) {
        const v = curve[i];
        const x0 = v[0] * xs, y0 = v[1] * xs, z0 = v[2] * zs;
        const x1 = x0 * cy_ + z0 * sy_, z1 = -x0 * sy_ + z0 * cy_;
        const y1 = y0 * cp - z1 * sp, z2 = y0 * sp + z1 * cp;
        const depth = cam - z2;
        if (depth < 1.2) { ok = false; break; }
        jx[i] = cx + (x1 * f) / depth; jy[i] = cy - (y1 * f) / depth;
        if (jx[i] < -w || jx[i] > w * 2 || jy[i] < -h || jy[i] > h * 2) { ok = false; break; }
      }
      if (!ok) return;
      ctx.strokeStyle = "rgba(207,220,255,0.8)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(jx[0], jy[0]);
      for (let i = 1; i < curve.length; i++) ctx.lineTo(jx[i], jy[i]);
      ctx.stroke();
      // forward motion: one point of light travelling the J
      const k = Math.floor(((reduced ? 0.4 : (t * 0.00012) % 1)) * (curve.length - 1));
      ctx.fillStyle = "#8fb0ff";
      ctx.beginPath(); ctx.arc(jx[k], jy[k], 3.5, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#fff";
      for (const q of [0, 24, 48, 72, curve.length - 1]) { ctx.beginPath(); ctx.arc(jx[q], jy[q], 3.5, 0, 6.283); ctx.fill(); }
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || t - last < (mobile ? 33 : 16)) return;
      last = t;
      draw(t);
    };

    const move = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    resize();
    if (reduced) { draw(0); } else raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(0); });
    ro.observe(canvas);
    if (!mobile) window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [progress]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className ?? ""}`} />;
}
