import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

import { cn } from '../../lib/utils';

import { Logo } from './navbar/Logo';
import { DesktopNav } from './navbar/NavLinks';
import MobileMenu  from './navbar/MobileMenu';
import NavAction  from './navbar/NavAction';


/**
 * Main NavBar component.
 * Features:
 * - WCAG 2.1 AA Compliance (Landmarks, ARIA labels, Keyboard Nav).
 * - Sticky positioning with glassmorphism.
 * - Integrated Mobile and Desktop views.
 */
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12",
                scrolled ? "bg-obsidian/90 backdrop-blur-md border-b border-ivory/5 py-3" : "bg-transparent"
            )}
        >
            {/* Skip to Content for a11y */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-light text-obsidian px-4 py-2 font-bold z-100 rounded-sm">
                Skip to content
            </a>

            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Logo />
                <DesktopNav />
                <NavAction />

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden -mr-2 p-2 bg-white/5 text-ivory hover:text-gold-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light rounded-sm"
                    onClick={() => setIsMenuOpen(true)}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}