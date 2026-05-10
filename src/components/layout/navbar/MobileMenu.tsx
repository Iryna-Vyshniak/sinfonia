import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * MobileMenu component optimized for Accessibility (WCAG 2.1 AA).
 * Adds dialog semantics, keyboard navigation support (Escape key),
 * and high-contrast focus rings matching the theme.
 */

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const navItems = [
        { href: "#about", label: "The Orchestra" },
        { href: "#repertoire", label: "Repertoire" },
        { href: "#tour", label: "Tour" },
    ];

    // Handle Escape key for better keyboard accessibility (WCAG 2.1.1)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent scrolling when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Semantic modal attributes for screen readers
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Menu"
                    className="fixed inset-0 z-60 bg-obsidian flex flex-col items-center justify-center p-6"
                >
                    <button
                        className={cn(
                            "absolute top-6 right-6 p-2 text-ivory transition-colors hover:text-gold-light",
                            // Accessible focus ring matching the brand theme
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm"
                        )}
                        onClick={onClose}
                        aria-label="Close mobile menu"
                    >
                        <X className="w-8 h-8" aria-hidden="true" />
                    </button>

                    <nav aria-label="Mobile Navigation" className="flex flex-col items-center gap-8 w-full">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "text-2xl font-serif italic text-ivory hover:text-gold-light transition-colors px-4 py-2",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm"
                                )}
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Decorative separator marked hidden for screen readers */}
                        <div aria-hidden="true" className="w-12 h-px bg-gold-light/30 my-4"></div>

                        <a
                            href="#tour"
                            onClick={onClose}
                            className={cn(
                                "text-sm uppercase tracking-widest text-gold-light font-medium transition-colors px-4 py-2",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm"
                            )}
                        >
                            Book Tickets
                        </a>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default MobileMenu;