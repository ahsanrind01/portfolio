import { useEffect, useRef } from 'react';

/**
 * SignalTrace — a PCB-style "signal" line that runs the full height of the
 * page, threaded through the empty gutters beside the content column.
 *
 * Unlike MorphOrbBackground (fixed, z-0, behind everything), this layer is
 * absolutely positioned in normal document flow and sits ABOVE the section
 * panels (z-20) with its own opacity — so it scrolls at normal speed while
 * the particle field behind it stays fixed, giving a genuine parallax
 * separation between three depth planes: background (static), this trace
 * (moves with the page), and the content (also moves with the page, but is
 * drawn on top). It never crosses the readable text column, so it's always
 * decorative and never interferes with reading.
 *
 * The trace "draws itself in" as the page is scrolled (stroke-dashoffset
 * tied to scroll progress), a bright pulse continually travels along it
 * (like a signal moving through a circuit), and small chip-pad markers
 * brighten as the viewport passes each section — all recolored continuously
 * between the site's two accent tones depending on how much of the current
 * viewport is a dark vs. light section, using the same coverage math as the
 * WebGL background so the two layers always agree.
 */

interface Point {
  x: number;
  y: number;
}

const SECTION_IDS = ['hero', 'work', 'skills', 'about', 'contact'];

function smoothPath(points: Point[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
  }
  return d;
}

export default function SignalTrace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const tickPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  const padRefs = useRef<(SVGGElement | null)[]>([]);
  const waypointsRef = useRef<Point[]>([]);
  const sampledPointsRef = useRef<Point[]>([]);
  const pathLenRef = useRef(0);
  const padRenderStateRef = useRef<{ opacity: number; scale: number }[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const glowPath = glowPathRef.current;
    const corePath = corePathRef.current;
    const tickPath = tickPathRef.current;
    if (!svg || !glowPath || !corePath || !tickPath) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const buildPath = () => {
      const width = window.innerWidth;
      const docHeight = document.documentElement.scrollHeight;
      svg.setAttribute('height', String(docHeight));
      svg.setAttribute('viewBox', `0 0 ${width} ${docHeight}`);

      // Route through the empty gutter beside the 1200px content column —
      // never through the text itself.
      const gutter = Math.max(0, (width - 1200) / 2);
      const isMobile = width < 768;
      const inset = isMobile ? Math.max(10, width * 0.035) : gutter > 90 ? gutter * 0.4 : 22;
      const leftX = inset;
      const rightX = width - inset;

      const pts: Point[] = [{ x: width / 2, y: 0 }];
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const y = top + rect.height * (0.35 + (i % 2) * 0.2);
        const x = isMobile ? rightX : i % 2 === 0 ? rightX : leftX;
        pts.push({ x, y });
      });
      pts.push({ x: width / 2, y: docHeight });
      waypointsRef.current = pts;

      const d = smoothPath(pts);
      glowPath.setAttribute('d', d);
      corePath.setAttribute('d', d);
      tickPath.setAttribute('d', d);

      requestAnimationFrame(() => {
        const len = corePath.getTotalLength();
        pathLenRef.current = len;
        glowPath.setAttribute('stroke-dasharray', `${len}`);
        corePath.setAttribute('stroke-dasharray', `${len}`);

        const sampleCount = 200;
        const sampledPoints: Point[] = [];
        if (len > 0) {
          for (let i = 0; i < sampleCount; i++) {
            const sampleLength = (len * i) / (sampleCount - 1);
            const p = corePath.getPointAtLength(sampleLength);
            sampledPoints.push({ x: p.x, y: p.y });
          }
        }
        sampledPointsRef.current = sampledPoints;
      });

      padRefs.current.forEach((g, i) => {
        const p = pts[i + 1];
        if (g && p) g.setAttribute('transform', `translate(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
      });
    };

    buildPath();
    const lateRebuilds = [100, 500, 1400].map((t) => window.setTimeout(buildPath, t));

    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildPath, 200);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('load', buildPath);

    const themeEls = Array.from(document.querySelectorAll<HTMLElement>('[data-bg-theme]'));
    const dark = { r: 0xd4, g: 0xa8, b: 0x53 };
    const light = { r: 0x8a, g: 0x5a, b: 0x2b };
    let themeBlend = 0;

    const getTargetThemeBlend = () => {
      let darkCoverage = 0;
      let lightCoverage = 0;
      const vh = window.innerHeight;
      for (const el of themeEls) {
        const rect = el.getBoundingClientRect();
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible <= 0) continue;
        if (el.dataset.bgTheme === 'light') lightCoverage += visible;
        else darkCoverage += visible;
      }
      const total = darkCoverage + lightCoverage;
      return total > 0 ? lightCoverage / total : themeBlend;
    };

    const trail: Point[] = [];
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const len = pathLenRef.current;
      if (len <= 0) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;

      const dashoffset = len * (1 - progress);
      corePath.setAttribute('stroke-dashoffset', `${dashoffset}`);
      glowPath.setAttribute('stroke-dashoffset', `${dashoffset}`);

      const target = getTargetThemeBlend();
      themeBlend += (target - themeBlend) * 0.05;
      const r = Math.round(dark.r + (light.r - dark.r) * themeBlend);
      const g = Math.round(dark.g + (light.g - dark.g) * themeBlend);
      const b = Math.round(dark.b + (light.b - dark.b) * themeBlend);
      const color = `rgb(${r}, ${g}, ${b})`;
      svg.style.setProperty('--signal-color', color);

      if (!prefersReducedMotion) {
        const sampledPoints = sampledPointsRef.current;
        let ptX = 0;
        let ptY = 0;

        if (sampledPoints.length > 0) {
          if (sampledPoints.length === 1) {
            ptX = sampledPoints[0].x;
            ptY = sampledPoints[0].y;
          } else {
            const samplePos = progress * (sampledPoints.length - 1);
            const sampleIndex = Math.floor(samplePos);
            const sampleT = samplePos - sampleIndex;
            const p0 = sampledPoints[sampleIndex];
            const p1 = sampledPoints[Math.min(sampleIndex + 1, sampledPoints.length - 1)];
            ptX = p0.x + (p1.x - p0.x) * sampleT;
            ptY = p0.y + (p1.y - p0.y) * sampleT;
          }
        }

        if (dotRef.current) {
          dotRef.current.setAttribute('cx', `${ptX}`);
          dotRef.current.setAttribute('cy', `${ptY}`);
          dotRef.current.setAttribute('opacity', '1');
        }
        trail.unshift({ x: ptX, y: ptY });
        if (trail.length > 6) trail.length = 6;
        trailRefs.current.forEach((el, i) => {
          const tp = trail[i + 1];
          if (el && tp) {
            el.setAttribute('cx', `${tp.x}`);
            el.setAttribute('cy', `${tp.y}`);
            el.setAttribute('opacity', `${0.4 - i * 0.07}`);
          }
        });
      }

      // Pads brighten as the viewport passes each one.
      const viewCenter = window.scrollY + window.innerHeight / 2;
      const pts = waypointsRef.current;
      const padState = padRenderStateRef.current;
      for (let i = 1; i < pts.length - 1; i++) {
        const g = padRefs.current[i - 1];
        if (!g) continue;
        const dist = Math.abs(pts[i].y - viewCenter);
        const active = Math.max(0, 1 - dist / 260);
        const opacity = 0.3 + active * 0.7;
        const scale = 1 + active * 0.5;
        const last = padState[i - 1] || { opacity: -1, scale: -1 };
        if (Math.abs(opacity - last.opacity) > 0.01) {
          g.style.opacity = `${opacity}`;
          last.opacity = opacity;
        }
        if (Math.abs(scale - last.scale) > 0.01) {
          g.setAttribute(
            'transform',
            `translate(${pts[i].x.toFixed(1)}, ${pts[i].y.toFixed(1)}) scale(${scale.toFixed(2)})`
          );
          last.scale = scale;
        }
        padState[i - 1] = last;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', buildPath);
      window.clearTimeout(resizeTimer);
      lateRebuilds.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="signal-glow-soft" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
          </feMerge>
        </filter>
        <filter id="signal-glow-dot" x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft halo of the trace */}
      <path
        ref={glowPathRef}
        fill="none"
        stroke="var(--signal-color)"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.35}
        filter="url(#signal-glow-soft)"
      />

      {/* Fine resistor-style tick marks along the whole trace, static */}
      <path
        ref={tickPathRef}
        fill="none"
        stroke="var(--signal-color)"
        strokeWidth={1}
        strokeDasharray="1 13"
        opacity={0.3}
      />

      {/* Crisp core line, revealed by scroll */}
      <path
        ref={corePathRef}
        fill="none"
        stroke="var(--signal-color)"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* Chip-pad markers at each section */}
      {SECTION_IDS.map((id, i) => (
        <g key={id} ref={(el) => { padRefs.current[i] = el; }} style={{ transition: 'opacity 0.4s ease' }}>
          <rect x={-5} y={-5} width={10} height={10} fill="none" stroke="var(--signal-color)" strokeWidth={1.2} transform="rotate(45)" />
          <circle r={1.6} fill="var(--signal-color)" />
          <text
            x={10}
            y={4}
            fontFamily="'JetBrains Mono', monospace"
            fontSize={9}
            fill="var(--signal-color)"
            opacity={0.55}
          >
            {`0x0${i + 1}`}
          </text>
        </g>
      ))}

      {/* Traveling signal pulse + comet trail */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          r={2.2 - i * 0.3}
          fill="var(--signal-color)"
          opacity={0}
        />
      ))}
      <circle ref={dotRef} r={3.5} fill="var(--signal-color)" filter="url(#signal-glow-dot)" opacity={0} />
    </svg>
  );
}
