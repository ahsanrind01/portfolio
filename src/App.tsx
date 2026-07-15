import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import MorphOrbBackground from './sections/MorphOrbBackground';
import SignalTrace from './sections/SignalTrace';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Work from './sections/Work';
import Skills from './sections/Skills';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
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
      <MorphOrbBackground />
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
