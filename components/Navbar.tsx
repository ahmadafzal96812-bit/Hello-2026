import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Gamepad2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Countdown', id: 'home' },
    { name: 'Wishes', id: 'wishes' },
    { name: 'Events', id: 'events' },
    { name: 'Play', id: 'game', icon: <Gamepad2 size={16} className="ml-1" /> },
  ];

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <Sparkles className="text-yellow-400" size={28} />
            <span className="text-xl md:text-2xl font-bold font-serif bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Hello2026
            </span>
          </button>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium transition-colors tracking-wide flex items-center text-gray-300 hover:text-yellow-400"
              >
                {link.name}
                {link.icon}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl absolute top-full left-0 w-full border-t border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="flex items-center w-full text-left px-3 py-4 text-base font-medium border-b border-gray-800 text-gray-300 hover:text-yellow-400"
              >
                {link.name}
                {link.icon && <span className="ml-2">{link.icon}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;