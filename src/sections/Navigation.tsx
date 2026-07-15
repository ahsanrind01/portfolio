import { useEffect, useState } from 'react';

interface NavigationProps {
  onNavigate: (id: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLight(entry.target.classList.contains('light-section'));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-60px 0px 0px 0px' }
    );

    const sections = document.querySelectorAll('section[data-nav-watch]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const links = [
    { label: 'WORK', target: 'work' },
    { label: 'SKILLS', target: 'skills' },
    { label: 'ABOUT', target: 'about' },
    { label: 'CONTACT', target: 'contact' },
  ];

  const textColor = isLight ? '#0D0D12' : '#F0EDE6';
  const mutedColor = isLight ? '#6B6B7B' : '#8A8A9A';

  return (
    <nav
      className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 transition-colors duration-300"
      style={{
        height: '60px',
        background: 'rgba(7, 7, 10, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <button
        onClick={() => onNavigate('hero')}
        className="font-space text-[13px] font-bold uppercase tracking-[0.18em] transition-colors duration-300"
        style={{ color: textColor }}
      >
        EHSAN
      </button>

      <div className="flex items-center gap-6 md:gap-8">
        {links.map((link) => (
          <button
            key={link.target}
            onClick={() => onNavigate(link.target)}
            className="font-space text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300"
            style={{ color: mutedColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#D4A853';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = mutedColor;
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
