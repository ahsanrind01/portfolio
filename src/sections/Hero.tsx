import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (id: string) => void;
}

const GOLD = '#D4A853';
const GOLD_DIM = 'rgba(212, 168, 83, 0.35)';
const INK = '#F0EDE6';
const MUTE = '#8A8A9A';

const CAPABILITIES = [
  {
    label: 'Backend',
    detail: 'Event-driven services on Kafka, Postgres, and Redis.',
  },
  {
    label: 'Real-Time',
    detail: 'Sub-second state sync for live, high-stakes data.',
  },
  {
    label: 'Mobile',
    detail: 'React Native products built for feel, not just function.',
  },
  {
    label: 'AI Agents',
    detail: 'Autonomous systems that reason, decide, and act.',
  },
];

export default function Hero({ onNavigate }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const bylineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          eyebrowRef.current,
          ...lineInnerRefs.current,
          subtitleRef.current,
          capRef.current,
          ctaRowRef.current,
          bylineRef.current,
        ],
        { opacity: 1, y: 0, clearProps: 'transform,filter' }
      );
      gsap.set(scrollRef.current, { opacity: 0.5 });
      gsap.set(traceRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(eyebrowRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out',
    })
      // masked line-reveal for the headline — each line unmasks from behind its own clip box
      .to(
        lineInnerRefs.current,
        {
          y: 0,
          duration: 1.1,
          stagger: 0.13,
          ease: 'power4.out',
        },
        '-=0.35'
      )
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.55'
      )
      .to(
        capRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .to(
        ctaRowRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.35'
      )
      .to(
        bylineRef.current,
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .to(
        traceRef.current,
        { opacity: 1, duration: 1.4, ease: 'power2.out' },
        '-=1'
      )
      .to(
        scrollRef.current,
        { opacity: 0.5, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      );

    return () => {
      tl.kill();
    };
  }, []);

  const headline = [
    { text: 'Systems that stay ', bold: 'correct' },
    { text: 'when everything moves ', bold: 'at once.' },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-bg-theme="dark"
      className="relative z-10 flex flex-col items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Signature element: a faint distributed-trace line running behind the
          headline — a packet moving hop to hop, nodes lighting up as it lands.
          Reads as "engineering," stays quiet, never competes with the copy. */}
      <svg
        ref={traceRef}
        className="absolute pointer-events-none opacity-0"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          width: 'min(1100px, 130vw)',
          height: '260px',
        }}
        viewBox="0 0 1100 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          id="trace-path"
          d="M 40 210 L 260 210 L 340 130 L 620 130 L 700 50 L 1060 50"
          stroke={GOLD}
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        {[
          [40, 210],
          [340, 130],
          [700, 50],
          [1060, 50],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill={GOLD} fillOpacity="0.3">
            {!prefersReducedMotionStatic() && (
              <animate
                attributeName="fill-opacity"
                values="0.3;0.3;0.95;0.3;0.3"
                keyTimes="0;0.001;0.02;0.06;1"
                begin={`${i * 1.35}s`}
                dur="5.4s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
        {!prefersReducedMotionStatic() && (
          <circle r="3.2" fill={GOLD}>
            <animateMotion dur="5.4s" repeatCount="indefinite" rotate="auto">
              <mpath href="#trace-path" />
            </animateMotion>
          </circle>
        )}
      </svg>

      <div className="relative text-center px-4 max-w-[760px] mx-auto">
        {/* Eyebrow — leads with what he specializes in, not who he is */}
        <div
          ref={eyebrowRef}
          className="font-mono-jb flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] mb-8 opacity-0 translate-y-2.5"
          style={{ color: MUTE, filter: 'blur(6px)' }}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: GOLD,
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
          <span>DISTRIBUTED SYSTEMS</span>
          <span style={{ color: 'rgba(240, 237, 230, 0.2)' }}>·</span>
          <span>REAL-TIME</span>
          <span style={{ color: 'rgba(240, 237, 230, 0.2)' }}>·</span>
          <span>MOBILE</span>
          <span style={{ color: 'rgba(240, 237, 230, 0.2)' }}>·</span>
          <span>AI AGENTS</span>
        </div>

        {/* Headline — masked reveal, each line unmasks upward from its own box */}
        <h1 className="font-space font-bold" style={{ lineHeight: 1.04 }}>
          {headline.map((line, i) => (
            <div
              key={line.bold}
              ref={(el) => {
                lineWrapRefs.current[i] = el;
              }}
              className="overflow-hidden"
              style={{ paddingBottom: '0.08em' }}
            >
              <span
                ref={(el) => {
                  lineInnerRefs.current[i] = el;
                }}
                className="block"
                style={{
                  fontSize: 'clamp(32px, 6.4vw, 68px)',
                  letterSpacing: '-0.02em',
                  color: INK,
                  transform: 'translateY(112%)',
                  textShadow:
                    '0 0 40px rgba(7, 7, 10, 0.9), 0 0 80px rgba(7, 7, 10, 0.7), 0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                {line.text}
                <span style={{ color: GOLD }}>{line.bold}</span>
              </span>
            </div>
          ))}
        </h1>

        {/* Subtext — outcomes, not stack */}
        <p
          ref={subtitleRef}
          className="mt-7 opacity-0 translate-y-2.5"
          style={{
            color: MUTE,
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            lineHeight: 1.65,
            letterSpacing: '0.01em',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
            filter: 'blur(6px)',
          }}
        >
          I design backend and mobile systems for products where timing and
          order can't be approximated — the kind that move money, mirror
          live markets, and run autonomous agents in real time.
        </p>

        {/* Capability strip — what he actually builds, stated plainly */}
        <div
          ref={capRef}
          className="flex flex-wrap items-stretch justify-center mt-11 opacity-0 translate-y-2.5"
          style={{ gap: 0 }}
        >
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.label}
              className="group px-6 py-1 text-left"
              style={{
                borderLeft:
                  i === 0 ? 'none' : '1px solid rgba(240, 237, 230, 0.1)',
                maxWidth: '160px',
              }}
            >
              <p
                className="font-mono-jb text-[10.5px] font-semibold uppercase tracking-[0.1em] mb-1.5 transition-colors duration-300"
                style={{ color: INK }}
              >
                {cap.label}
                <span
                  className="block mt-1.5 transition-all duration-300 group-hover:w-6"
                  style={{ width: '14px', height: '1px', background: GOLD_DIM }}
                />
              </p>
              <p
                className="text-[11.5px] leading-snug"
                style={{ color: MUTE }}
              >
                {cap.detail}
              </p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          ref={ctaRowRef}
          className="flex items-center justify-center gap-8 mt-12 opacity-0 translate-y-2.5"
        >
          <button
            onClick={() => onNavigate('work')}
            className="group inline-flex items-center gap-2 font-space text-[13px] font-semibold uppercase tracking-[0.1em] transition-all duration-300"
            style={{
              color: '#07070A',
              background: GOLD,
              padding: '13px 26px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e3ba63';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = GOLD;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explore Case Studies
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="group inline-flex items-center gap-1.5 font-space text-[13px] font-medium uppercase tracking-[0.1em] transition-opacity duration-300 hover:opacity-70"
            style={{ color: INK }}
          >
            Get In Touch
            <ArrowUpRight size={14} color={MUTE} />
          </button>
        </div>

        {/* Quiet identity line — presence, not the pitch */}
        <div
          ref={bylineRef}
          className="font-mono-jb text-[10px] uppercase tracking-[0.15em] mt-10 opacity-0"
          style={{ color: 'rgba(138, 138, 154, 0.55)' }}
        >
          Ehsan ul Haq — engineering this, end to end
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        style={{
          width: '1px',
          height: '32px',
          background: 'rgba(212, 168, 83, 0.5)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }}
      />
    </section>
  );
}

// Evaluated once at module scope for the SMIL branches above — mirrors the
// same media query used in the entrance-animation effect.
function prefersReducedMotionStatic() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
