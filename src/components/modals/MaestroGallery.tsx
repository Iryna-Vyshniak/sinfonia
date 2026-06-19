import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuX } from 'react-icons/lu';

import conductorImg from '../../assets/images/conductor-focus.jpg';
import violinistImg from '../../assets/images/female-violinist.jpg';
import celloImg from '../../assets/images/singular-voice.jpg';
import harpsichordImg from '../../assets/images/virtuoso.jpg';
import violin2Img from '../../assets/images/harpsichord-details.jpg';
import violaImg from '../../assets/images/inner-resonance.jpg';
import trioImg from '../../assets/images/the-interplay.jpg';
import duetImg from '../../assets/images/chamber-duet.jpg';
import ensembleImg from '../../assets/images/resonant-strings.jpg';

import { cn } from '../../lib/utils';

const musicians = [
    {
        name: "Helen Fleur",
        role: "Principal Conductor",
        image: conductorImg,
        description: "Helen brings three decades of unparalleled passion and precision, leading the orchestra with a fiery yet meticulously controlled vision that breathes new life into classic compositions."
    },
    {
        name: "Clara Vane",
        role: "First Violin",
        image: violinistImg,
        description: "A prodigy turned master, Clara's violin sings with haunting beauty. Her interpretations of romantic-era concertos have earned her international acclaim."
    },
    {
        name: "Sophia Lin",
        role: "Principal Cello",
        image: celloImg,
        description: "Sophia anchors the string section with rich, resonant depth. Her performances are noted for their emotional intensity and flawless technical execution."
    },
    {
        name: "Isabella Rossi",
        role: "Harpsichordist",
        image: harpsichordImg,
        description: "Isabella transports audiences to the Baroque era with every keystroke. Her dedication to historical accuracy combined with a vivid modern flair makes her performances unforgettable."
    },
    {
        name: "Camille Laurent",
        role: "Violinist",
        image: violin2Img,
        description: "Known for her vibrant tone and virtuosic precision, Camille has performed as a soloist with major orchestras worldwide before joining our ensemble."
    },
    {
        name: "Yuna Satō",
        role: "Principal Viola",
        image: violaImg,
        description: "Yuna provides the warm, soulful core of our harmonic texture. Her deep understanding of chamber music dynamics enriches the orchestra's collective sound."
    },
    {
        name: "The Aurora Trio",
        role: "Chamber Ensemble",
        image: trioImg,
        wide: true,
        description: "Our premier chamber group, the Aurora Trio, explores the intimate connections between strings and woodwinds, bringing a delicate balance to our larger performances."
    },
    {
        name: "Strings in Dialogue",
        role: "Featured Duet",
        image: duetImg,
        wide: true,
        description: "This partnership captures the conversational nature of classical music, where two voices intertwine to create a narrative more powerful than any individual performer."
    },
    {
        name: "The Core Ensemble",
        role: "String Section",
        image: ensembleImg,
        wide: true,
        description: "The technical backbone of our orchestra, these virtuosos ensure that every note is delivered with perfect synchronicity and emotional resonant power."
    }
];

interface MaestroGalleryProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MaestroGallery({ isOpen, onClose }: MaestroGalleryProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Trap focus, handle Escape key, and restore focus on close
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                    return;
                }

                if (e.key === 'Tab' && modalRef.current) {
                    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                    const focusableContent = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableElements))
                        .filter(el => {
                            const style = window.getComputedStyle(el);
                            return style.display !== 'none' && style.visibility !== 'hidden' && el.getAttribute('tabindex') !== '-1';
                        });

                    if (focusableContent.length === 0) return;

                    const firstFocusableElement = focusableContent[0];
                    const lastFocusableElement = focusableContent[focusableContent.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            // Focus the close button when opened
            const focusTimer = setTimeout(() => {
                if (closeButtonRef.current) {
                    closeButtonRef.current.focus();
                } else if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 100);

            return () => {
                clearTimeout(focusTimer);
                document.removeEventListener('keydown', handleKeyDown);
                if (previousFocusRef.current) {
                    previousFocusRef.current.focus();
                }
            };
        }
    }, [isOpen, onClose]);

    // Handle body scroll locking cleanly and robustly
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
                    role="presentation"
                >
        
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={onClose}
                        aria-hidden="true"
                        tabIndex={-1}
                    ></div>

                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gallery-title"
                        aria-describedby="gallery-desc"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-7xl h-[90vh] bg-obsidian border border-white/10 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col rounded-2xl"
                    >
                        {/* Semantic Header */}
                        <header className="flex justify-between items-center p-8 bg-black/40 border-b border-white/5 relative z-20 shrink-0">
                            <div>
                                <h2 id="gallery-title" className="text-3xl font-serif text-ivory tracking-tight">
                                    Our Musicians
                                </h2>
                                <p className="text-gold-light text-[10px] uppercase tracking-[0.3em] font-medium mt-1">
                                    Virtuosos of the Modern Age
                                </p>
                            </div>
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                aria-label="Close musician gallery"
                                className="p-3 text-ash hover:text-ivory transition-all rounded-full hover:bg-white/10 group"
                            >
                                <LuX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </header>

                        {/* Scrollable Gallery - ultra-smooth scrolling */}
                        <div
                            className="overflow-y-auto p-6 md:p-12 lg:p-16 hide-scrollbar grow relative z-10 scroll-smooth overscroll-contain"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                            tabIndex={0}
                            aria-label="Musicians list scrollable area"
                        >
                            {/* Semantic List */}
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16 list-none m-0 p-0">
                                {musicians.map((musician, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
                                        className={cn(
                                            "flex flex-col gap-6 group p-4 md:p-6 bg-white/2 hover:bg-white/5 focus:bg-white/5 transition-all duration-500 border border-white/5 hover:border-gold-light/20 focus:border-gold-light/20 rounded-2xl shadow-lg cursor-pointer outline-none",
                                            musician.wide ? "lg:col-span-3 md:col-span-2" : "lg:col-span-2"
                                        )}
                                        tabIndex={0}
                                    >
                                        {/* Semantic Article for standalone content blocks */}
                                        <article className="flex flex-col h-full pointer-events-none">
                                            {/* Semantic Figure */}
                                            <figure className={cn(
                                                "relative overflow-hidden rounded-xl shadow-2xl transition-all duration-700 m-0",
                                                musician.wide ? "aspect-video" : "aspect-4/5"
                                            )}>
                                                <div className="absolute inset-0 border-[0.5px] border-gold-light/20 z-20 m-4 transition-all duration-500 group-hover:m-3 group-focus:m-3" aria-hidden="true"></div>
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>

                                                <img
                                                    src={musician.image}
                                                    alt={musician.name ? `Portrait of ${musician.name}, ${musician.role}` : ""}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-focus:grayscale-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-110 group-focus:scale-110"
                                                />
                                            </figure>

                                            {/* Content Block */}
                                            <div className="px-2 pb-2 mt-4 flex flex-col grow">
                                                <header className="flex flex-col gap-1 mb-4">
                                                    <h3 id={`musician-name-${idx}`} className="text-xl md:text-2xl font-serif text-ivory tracking-wide group-hover:text-gold-light group-focus:text-gold-light transition-colors duration-300">
                                                        {musician.name}
                                                    </h3>
                                                    <p className="text-gold-light/80 uppercase tracking-[0.2em] text-[9px] font-bold m-0">
                                                        {musician.role}
                                                    </p>
                                                </header>
                                                <p className="text-ash/90 font-light text-sm leading-relaxed max-w-prose m-0">
                                                    {musician.description}
                                                </p>
                                            </div>
                                        </article>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="h-24" aria-hidden="true"></div>
                        </div> {/* Ambient Background Accents */}
                        <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none" aria-hidden="true">
                            <div className="w-96 h-96 rounded-full bg-gold-light blur-[120px]"></div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}