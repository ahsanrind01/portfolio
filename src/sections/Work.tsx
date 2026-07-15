import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  tags: string[];
  description: string;
  image: string;
  links: { label: string; url: string }[];
  isMoreCard?: boolean;
}

const projects: Project[] = [
  {
    title: 'Planora',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Stripe', 'Socket.io'],
    description:
      'On-demand service booking platform with dual-role architecture for customers and business managers. Features real-time chat, Stripe payments, location-aware discovery, and push notifications.',
    image: '/images/planora-thumb.jpg',
    links: [
      { label: 'Live Demo', url: 'https://appetize.io/app/ios/com.ahsanrind.mobileapp?device=iphone15promax&osVersion=17.2&toolbar=true' },
      { label: 'GitHub', url: 'https://github.com/ahsanrind01/Planora' },
    ],
  },
  {
    title: 'NexusTrade',
    tags: ['React Native', 'Node.js', 'TypeScript', 'Kafka', 'PostgreSQL', 'Redis', 'Stripe'],
    description:
      'Production-grade cryptocurrency exchange platform built on a distributed microservices architecture with a native mobile trading app. Covers the full flow end-to-end — auth, wallet funding, order placement, in-memory order book matching, ledger settlement, and live market data streaming over WebSockets.',
    image: '/images/nexustrade-thumb.jpg',
    links: [
      { label: 'GitHub', url: 'https://github.com/ahsanrind01/NexusTrade' },
    ],
  },
  {
    title: 'Explore More',
    tags: [],
    description: '',
    image: '',
    links: [{ label: 'GitHub', url: 'https://github.com/ahsanrind01' }],
    isMoreCard: true,
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.work-header'), {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 50,
          opacity: 0,
          rotateX: 4,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
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
        {/* Section header */}
        <div className="mb-16">
          <p
            className="work-header font-mono text-[11px] font-medium uppercase tracking-[0.14em] mb-4"
            style={{ color: '#D4A853' }}
          >
            SELECTED WORK
          </p>
          <h2
            className="work-header font-space font-bold uppercase"
            style={{
              fontSize: 'clamp(40px, 6vw, 64px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#F0EDE6',
            }}
          >
            PROJECTS
          </h2>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`${project.isMoreCard ? 'md:col-span-2' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {project.isMoreCard ? (
                <a
                  href={project.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-16 px-8 rounded-md transition-all duration-[450ms]"
                  style={{
                    border: '1px dashed rgba(240, 237, 230, 0.15)',
                    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 168, 83, 0.4)';
                    e.currentTarget.style.background = 'rgba(212, 168, 83, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(240, 237, 230, 0.15)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <h3
                    className="font-space font-semibold transition-colors duration-300"
                    style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.1, letterSpacing: '-0.01em', color: '#8A8A9A' }}
                  >
                    {project.title}
                  </h3>
                  <span
                    className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em]"
                    style={{ color: '#D4A853' }}
                  >
                    {project.links[0].label} →
                  </span>
                </a>
              ) : (
                <div
                  className="rounded-md overflow-hidden transition-all duration-[450ms]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 24px 64px rgba(212, 168, 83, 0.08)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full aspect-video object-cover transition-transform duration-[450ms]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                      loading="lazy"
                    />
                  </div>

                  <div className="pt-6 pb-2">
                    <h3
                      className="font-space font-semibold"
                      style={{
                        fontSize: 'clamp(22px, 2.5vw, 36px)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                        color: '#F0EDE6',
                      }}
                    >
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] uppercase tracking-[0.08em]"
                          style={{
                            color: '#8A8A9A',
                            border: '1px solid rgba(240, 237, 230, 0.1)',
                            borderRadius: '4px',
                            padding: '3px 10px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p
                      className="mt-4 text-[17px]"
                      style={{ color: '#8A8A9A', lineHeight: 1.65, letterSpacing: '0.01em' }}
                    >
                      {project.description}
                    </p>

                    <div className="flex gap-6 mt-5">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-space text-[13px] uppercase tracking-[0.08em] transition-all duration-300 hover:underline"
                          style={{ color: '#D4A853' }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}