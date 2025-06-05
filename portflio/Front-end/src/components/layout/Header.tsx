
import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo',
        isScrolled ? 
          'py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100/50' : 
          'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="text-xl font-semibold tracking-tight">
            Portfolio<span className="text-primary/80">.</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-primary after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {item.name}
              </a>
            ))}
            <Button>
              Resume
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden transition-transform duration-300 ease-out-expo",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-8 items-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-lg font-medium text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <Button>
            Resume
          </Button>
        </nav>
      </div>

      {/* Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-primary/80 transition-all ease-out-expo"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  );
};

export default Header;
