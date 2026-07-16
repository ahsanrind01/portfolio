import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  onNavigate: (id: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isLight, setIsLight] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const links = [
    { label: 'WORK', target: 'work' },
    { label: 'SKILLS', target: 'skills' },
    { label: 'ABOUT', target: 'about' },
    { label: 'CONTACT', target: 'contact' },
  ];

  const handleNavigate = (target: string) => {
    setDrawerOpen(false);
    onNavigate(target);
  };

  const textColor = isLight ? '#0D0D12' : '#F0EDE6';
  const mutedColor = isLight ? '#6B6B7B' : '#8A8A9A';
  const navBackground = isLight ? 'rgba(245, 243, 238, 0.7)' : 'rgba(7, 7, 10, 0.7)';

  return (
    <nav
      className="fixed top-0 w-full z-50 flex items-center justify-between gap-4 px-4 md:px-12 transition-colors duration-300"
      style={{
        height: '60px',
        background: navBackground,
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

      <div className="hidden sm:flex items-center gap-4 md:gap-8 overflow-x-auto whitespace-nowrap w-full sm:w-auto max-w-full sm:max-w-none pb-1 sm:pb-0">
        {links.map((link) => (
          <button
            key={link.target}
            onClick={() => handleNavigate(link.target)}
            className="font-space text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300"
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
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="font-space text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300"
          style={{ color: mutedColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#D4A853';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = mutedColor;
          }}
        >
          RESUME
        </a>
      </div>

      <button
        type="button"
        onClick={() => setDrawerOpen((open) => !open)}
        aria-expanded={drawerOpen}
        aria-label="Toggle navigation"
        className="sm:hidden inline-flex items-center justify-center"
        style={{ color: textColor }}
      >
        {drawerOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className="sm:hidden fixed left-0 right-0 top-[60px] z-50 transition-all duration-300"
        style={{
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
      >
        <button
          type="button"
          aria-label="Close navigation drawer"
          className="absolute inset-0 w-full h-[calc(100svh-60px)]"
          style={{ background: 'rgba(7, 7, 10, 0.36)' }}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className="absolute right-0 top-0 h-[calc(100svh-60px)] w-[78vw] max-w-[320px] px-5 py-6"
          style={{
            background: navBackground,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(240, 237, 230, 0.08)',
          }}
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavigate(link.target)}
                className="text-left font-space text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300"
                style={{ color: mutedColor }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="font-space text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300"
              style={{ color: mutedColor }}
              onClick={() => setDrawerOpen(false)}
            >
              RESUME
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
