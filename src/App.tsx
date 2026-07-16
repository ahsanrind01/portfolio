import { lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import SignalTrace from './sections/SignalTrace';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Work from './sections/Work';
import Skills from './sections/Skills';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const MorphOrbBackground = lazy(() => import('./sections/MorphOrbBackground'));

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
    });

    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number) {
      if (!document.hidden) {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0 });
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <MorphOrbBackground />
      </Suspense>
      <SignalTrace />
      <Navigation onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
