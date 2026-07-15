import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroProps {
  onNavigate: (id: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(labelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .to(nameRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3')
    .to(underlineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2')
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .to(ctaRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.15')
    .to(scrollRef.current, {
      opacity: 0.5,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.1');

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="hero"
      data-bg-theme="dark"
      className="relative z-10 flex flex-col items-center justify-center min-h-screen"
    >
      <div className="text-center px-4">
        {/* Label */}
        <p
          ref={labelRef}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] mb-6 opacity-0 translate-y-2.5"
          style={{ color: '#8A8A9A' }}
        >
          SOFTWARE ENGINEER
        </p>

        {/* Name */}
        <h1
          ref={nameRef}
          className="font-space font-bold uppercase text-center opacity-0 translate-y-5"
          style={{
            fontSize: 'clamp(48px, 10vw, 110px)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            color: '#F0EDE6',
            textShadow: '0 0 40px rgba(7, 7, 10, 0.9), 0 0 80px rgba(7, 7, 10, 0.7), 0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          EHSAN UL HAQ
        </h1>

        {/* Golden underline */}
        <div
          ref={underlineRef}
          className="mx-auto mt-4"
          style={{
            width: '60px',
            height: '2px',
            background: '#D4A853',
            transform: 'scaleX(0)',
            transformOrigin: 'center',
          }}
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 text-xl font-normal opacity-0 translate-y-2.5"
          style={{
            color: '#8A8A9A',
            letterSpacing: '0.01em',
            lineHeight: 1.6,
          }}
        >
          Full-Stack & Mobile Developer
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={() => onNavigate('work')}
          className="mt-12 inline-flex flex-col items-center gap-2 group opacity-0"
        >
          <span
            className="font-space text-[13px] font-medium uppercase tracking-[0.1em]"
            style={{ color: '#D4A853' }}
          >
            View My Work
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-y-1"
          >
            <path
              d="M7 2L7 11M7 11L3 7M7 11L11 7"
              stroke="#D4A853"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
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
