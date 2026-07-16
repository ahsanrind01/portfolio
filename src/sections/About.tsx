import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.about-animate'), {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const stack = [
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Kafka',
    'WebSockets',
    'Docker',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      data-nav-watch
      data-bg-theme="dark"
      className="relative z-10"
      style={{
        background: 'rgba(7, 7, 10, 0.93)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[120px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Text column - 50% */}
          <div className="md:w-1/2">
            <p
              className="about-animate font-mono text-[11px] font-medium uppercase tracking-[0.14em] mb-4"
              style={{ color: '#D4A853' }}
            >
              ABOUT ME
            </p>
            <h2
              className="about-animate font-space font-bold uppercase"
              style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: '#F0EDE6',
              }}
            >
              THE ENGINEER
            </h2>

            <div className="mt-9 space-y-5">
              <p
                className="about-animate"
                style={{
                  fontSize: '19px',
                  color: '#F0EDE6',
                  lineHeight: 1.55,
                  letterSpacing: '0.01em',
                  fontWeight: 500,
                }}
              >
                I don't start with a framework. I start with the constraints — how data moves, where it can fail, what happens under load — The implementation comes afterwards.
              </p>
              <p
                className="about-animate text-[17px]"
                style={{ color: '#8A8A9A', lineHeight: 1.65, letterSpacing: '0.01em' }}
              >
                My focus is backend engineering and distributed systems: I spend most of my time building systems where consistency, reliability and communication between services matter more than the UI they're powering., architectures that fail predictably instead of catastrophically. NexusTrade and Planora exist because reading about a matching engine or a real-time chat pipeline only explains so much — building one is where the design actually gets tested.
              </p>
              <p
                className="about-animate text-[17px]"
                style={{ color: '#8A8A9A', lineHeight: 1.65, letterSpacing: '0.01em' }}
              >
                I'm still early in this, studying Software Engineering at COMSATS, but the questions I ask are the ones I'll keep asking at any scale: why this tradeoff, why this boundary, why does it break here and not there.
              </p>
            </div>

            {/* Education */}
            <div
              className="about-animate mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(240, 237, 230, 0.08)' }}
            >
              <p className="text-[17px] font-semibold" style={{ color: '#F0EDE6' }}>
                COMSATS University Islamabad
              </p>
              <p className="mt-1 text-sm" style={{ color: '#8A8A9A' }}>
                BS Software Engineering · 2024 – Present · Expected 2028
              </p>
            </div>

            {/* Core stack */}
            <div className="about-animate mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-3" style={{ color: '#6B6B7B' }}>
                Core Stack
              </p>
              <p className="font-mono text-[12px]" style={{ color: '#8A8A9A', lineHeight: 1.6 }}>
                {stack.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}