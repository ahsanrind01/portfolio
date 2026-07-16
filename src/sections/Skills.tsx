import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  label: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    label: 'Mobile / Frontend',
    skills: ['React Native (Expo)', 'Expo Router', 'React.js', 'Zustand', 'TanStack Query', 'Reanimated'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express.js', 'TypeScript', 'REST API Design', 'Socket.io', 'JWT Auth'],
  },
  {
    label: 'Distributed Systems',
    skills: ['Apache Kafka', 'Microservices Architecture', 'API Gateway Design', 'Event-Driven Systems', 'Docker'],
  },
  {
    label: 'Databases & Caching',
    skills: ['PostgreSQL', 'MongoDB', 'Drizzle ORM', 'Mongoose ODM', 'Redis'],
  },
  {
    label: 'AI & Agents',
    skills: ['OpenAI SDK', 'Anthropic Claude / Agent SDK', 'AI Agent Design', 'LLM Integration', 'Prompt Engineering'],
  },
  {
    label: 'Payments & Messaging',
    skills: ['Stripe', 'SendGrid', 'Push Notifications'],
  },
  {
    label: 'CS Foundations',
    skills: ['OOP', 'Data Structures & Algorithms', 'Software Design Patterns', 'System Design'],
  },
  {
    label: 'Tools',
    skills: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.from(leftRef.current, {
          x: -40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (rightRef.current) {
        const cards = rightRef.current.querySelectorAll('.skill-card');
        gsap.from(cards, {
          x: 40,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-nav-watch
      data-bg-theme="light"
      className="light-section relative z-10"
      style={{
        background: 'rgba(245, 243, 238, 0.93)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-20 md:py-[120px]">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20">
          {/* Left column - 38% */}
          <div ref={leftRef} className="md:w-[38%]">
            <p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] mb-4"
              style={{ color: '#D4A853' }}
            >
              EXPERTISE
            </p>
            <h2
              className="font-space font-bold uppercase"
              style={{
                fontSize: 'clamp(32px, 6vw, 64px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: '#0D0D12',
              }}
            >
              SKILLS
            </h2>
            <p
              className="mt-6 text-base md:text-lg"
              style={{ color: '#6B6B7B', lineHeight: 1.65, letterSpacing: '0.01em' }}
            >
              Full-stack engineer spanning mobile and distributed backend systems, with hands-on experience integrating AI agents into production applications.
            </p>
          </div>

          {/* Right column - 62% */}
          <div ref={rightRef} className="md:w-[62%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {skillCategories.map((category) => (
                <div
                  key={category.label}
                  className="skill-card"
                  style={{ borderLeft: '2px solid #D4A853', paddingLeft: '16px' }}
                >
                  <p
                    className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
                    style={{ color: '#6B6B7B' }}
                  >
                    {category.label}
                  </p>
                  <ul className="space-y-1.5">
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className="text-[15px]"
                        style={{ color: '#0D0D12', lineHeight: 1.5 }}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
