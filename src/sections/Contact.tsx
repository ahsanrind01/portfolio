import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContactLink {
  label: string;
  value: string;
  href: string;
  isExternal: boolean;
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: 'ahsanrind01@gmail.com',
    href: 'mailto:ahsanrind01@gmail.com',
    isExternal: false,
  },
  {
    label: 'Phone',
    value: '+92 345 700 9651',
    href: 'tel:+923457009651',
    isExternal: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ehsan-ul-haq-rind',
    href: 'https://linkedin.com/in/ehsan-ul-haq-rind',
    isExternal: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/ahsanrind01',
    href: 'https://github.com/ahsanrind01',
    isExternal: true,
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.contact-animate'), {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[120px] text-center">
        <p
          className="contact-animate font-mono text-[11px] font-medium uppercase tracking-[0.14em] mb-4"
          style={{ color: '#D4A853' }}
        >
          GET IN TOUCH
        </p>
        <h2
          className="contact-animate font-space font-bold uppercase"
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#0D0D12',
          }}
        >
          LET'S BUILD
        </h2>
        <p
          className="contact-animate mt-6 text-lg"
          style={{ color: '#6B6B7B', lineHeight: 1.65, letterSpacing: '0.01em' }}
        >
          Open to collaborations, freelance projects, and full-stack opportunities.
        </p>

        {/* Contact links */}
        <div className="contact-animate mt-12 flex flex-wrap justify-center gap-8 md:gap-10">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center gap-1.5 text-base font-medium"
              style={{ color: '#0D0D12' }}
            >
              <span className="relative">
                {link.value}
                <span
                  className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: '#D4A853' }}
                />
              </span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
