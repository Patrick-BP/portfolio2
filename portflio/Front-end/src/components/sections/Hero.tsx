
import { useRef, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchProfile } from '@/lib/apis';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const parallaxElements = sectionRef.current.querySelectorAll('.parallax');
      
      parallaxElements.forEach((el: Element) => {
        const speed = el.getAttribute('data-speed') || '5';
        const yPos = (scrollY - sectionTop) / parseInt(speed);
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    fetchProfile().then((data: any) => setProfile(data));
  }, []);
 
  return (
    <header 
      id="home" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/30 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 z-10 pt-2">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-block px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium animate-fade-in">
            {profile?.title}
          </div>
          
          <h1 className="heading-xl mb-6 text-balance animate-slide-down opacity-0" style={{ animationDelay: '0.2s' }}>
            
            {profile?.heading}
            
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-down opacity-0" style={{ animationDelay: '0.4s' }}>
            {profile?.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-down opacity-0" style={{ animationDelay: '0.6s' }}>
            <Button size="lg">
              View My Work
            </Button>
            <Button size="lg" variant="outline">
              Contact Me
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <a 
            href="#about" 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-sm text-muted-foreground hover:text-foreground transition-colors animate-pulse"
            aria-label="Scroll down"
          >
            <span className="mb-2">Scroll down</span>
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 parallax" data-speed="2"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 parallax" data-speed="3"></div>
    </header>
  );
};

export default Hero;
