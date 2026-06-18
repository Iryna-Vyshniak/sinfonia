import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuX } from 'react-icons/lu';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navItems = [
    { href: "#about", label: "The Orchestra" },
    { href: "#repertoire", label: "Repertoire" },
    { href: "#tour", label: "Tour" },
  ];

  // Prevent background scrolling while the mobile navigation is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 w-screen h-screen z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <button 
            className="absolute top-6 right-6 p-2 text-ivory hover:text-gold-light transition-colors outline-none focus:ring-1 focus:ring-gold-light rounded-full"
            onClick={onClose}
            aria-label="Close menu"
          >
            <LuX className="w-8 h-8" />
          </button>
          
          <nav className="flex flex-col items-center gap-8 w-full">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={onClose} 
                className="text-2xl font-serif italic text-ivory hover:text-gold-light transition-colors"
              >
                {item.label}
              </a>
            ))}
            
            <div className="w-12 h-[1px] bg-gold-light/30 my-4"></div>
            
            <a 
              href="#tour" 
              onClick={onClose} 
              className="text-sm uppercase tracking-widest text-gold-light font-medium transition-colors"
            >
              Book Tickets
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
