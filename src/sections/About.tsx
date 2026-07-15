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

  const coursework = [
    'Software Design & Architecture',
    'Requirements Engineering',
    'OOP',
    'Data Structures & Algorithms',
    'Database Systems',
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

            <div className="mt-8 space-y-5">
              <p
                className="about-animate text-[17px]"
                style={{ color: '#8A8A9A', lineHeight: 1.65, letterSpacing: '0.01em' }}
              >
                Software Engineering student at COMSATS University Islamabad with hands-on experience building full-stack and mobile applications. Proven ability to architect and deliver production-ready systems using React Native, Node.js, and MongoDB.
              </p>
              <p
                className="about-animate text-[17px]"
                style={{ color: '#8A8A9A', lineHeight: 1.65, letterSpacing: '0.01em' }}
              >
                Ranked 1st in class during Semester 1 with a CGPA of 3.45/4.0. Strong foundation in software design principles, data structures, and system architecture.
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
              <p className="mt-1 text-sm" style={{ color: '#8A8A9A' }}>
                CGPA: 3.45/4.0
              </p>
            </div>

            {/* Coursework */}
            <div className="about-animate mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-3" style={{ color: '#6B6B7B' }}>
                Key Coursework
              </p>
              <p className="font-mono text-[12px]" style={{ color: '#8A8A9A', lineHeight: 1.6 }}>
                {coursework.join(' · ')}
              </p>
            </div>
          </div>

          {/* Decorative column - 50% */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <span
              className="font-space font-bold select-none"
              style={{
                fontSize: 'clamp(140px, 16vw, 200px)',
                color: 'rgba(212, 168, 83, 0.06)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
              }}
            >
              01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
