import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dada5hjp3/image/upload/v1747985668/Rashmi-logo-light_dtolbr.png" 
              alt="Rashmi Metaliks" 
              className="h-10 md:h-12 dark:hidden"
            />
            <img 
              src="https://res.cloudinary.com/dada5hjp3/image/upload/v1748081363/Rashmi-logo-dark_mzwfr8.png" 
              alt="Rashmi Metaliks" 
              className="h-10 md:h-12 hidden dark:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5">
            <a href="https://www.rashmigroup.com/" className="text-muted-foreground hover:text-rashmi-red transition-colors">Home</a>
            <a href="https://www.rashmigroup.com/about-us/" className="text-muted-foreground hover:text-rashmi-red transition-colors">About</a>
            <a href="https://www.rashmigroup.com/products/" className="text-muted-foreground hover:text-rashmi-red transition-colors">Products</a>
            <a href="https://www.rashmigroup.com/contact-us/" className="text-muted-foreground hover:text-rashmi-red transition-colors">Contact</a>
            
            <div className="ml-1 flex items-center justify-center">
              <ThemeToggle />
            </div>
            
            {/* CTA Button */}
            <a 
              href="#registration-form" 
              className="bg-rashmi-red text-white px-5 py-2 rounded-full hover:bg-rashmi-red/90 transition-colors shadow-sm hover:shadow-md ml-1"
            >
              Register Now
            </a>
          </nav>

          {/* Mobile Menu and Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button 
              className="text-foreground p-2 rounded-md"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white dark:bg-neutral-900 shadow-lg",
          isMenuOpen ? "block" : "hidden"
        )}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <a 
              href="https://www.rashmigroup.com/" 
              className="text-foreground hover:text-rashmi-red transition-colors py-2 border-b border-border/10 dark:border-neutral-800"
              onClick={closeMenu}
            >
              Home
            </a>
            <a 
              href="https://www.rashmigroup.com/about-us/" 
              className="text-foreground hover:text-rashmi-red transition-colors py-2 border-b border-border/10 dark:border-neutral-800"
              onClick={closeMenu}
            >
              About
            </a>
            <a 
              href="https://www.rashmigroup.com/products/" 
              className="text-foreground hover:text-rashmi-red transition-colors py-2 border-b border-border/10 dark:border-neutral-800"
              onClick={closeMenu}
            >
              Products
            </a>
            <a 
              href="https://www.rashmigroup.com/contact-us/" 
              className="text-foreground hover:text-rashmi-red transition-colors py-2 border-b border-border/10 dark:border-neutral-800"
              onClick={closeMenu}
            >
              Contact
            </a>
            
            {/* CTA Button */}
            <a 
              href="#registration-form" 
              className="bg-rashmi-red text-white px-5 py-3 rounded-full hover:bg-rashmi-red/90 transition-colors text-center shadow-sm"
              onClick={closeMenu}
            >
              Register Now
            </a>
          </nav>
        </div>
      </motion.div>
    </header>
  );
};

export default Header; 