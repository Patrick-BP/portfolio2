
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Portfolio<span className="text-primary/80">.</span></h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Full-stack developer crafting exceptional digital experiences with modern technologies.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
