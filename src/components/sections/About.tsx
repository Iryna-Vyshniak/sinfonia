import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import cellistImage from '../../assets/images/cellist-portrait.jpg';

import { MaestroGallery } from '../modals/MaestroGallery';

import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

export default function About() {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const imageAnimation = {
        initial: { opacity: 0, x: shouldReduceMotion ? 0 : -40 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
    };

    const imageHover = shouldReduceMotion ? {} : { scale: 1.12 };

    return (
        <Section
            id="about"
            dark
            className="relative"
            ariaLabel="About the Orchestra"
        >
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

                {/* Left: Image Box */}
                <motion.div
                    {...imageAnimation}
                    className="w-full lg:w-1/2 relative group/portrait"
                >
                    <div className="relative aspect-4/5 w-full max-w-lg mx-auto lg:ml-0 overflow-hidden shadow-2xl rounded-sm">
                        {/* Elegant outer border accent */}
                        <div
                            className="absolute inset-4 border border-gold-light/20 z-20 pointer-events-none"
                            aria-hidden="true"
                        />

                        <motion.img
                            src={cellistImage}
                            alt="Portrait of the Sinfonia Nobile cellist in deep focus during a performance"
                            className="w-full h-full object-cover object-center brightness-90 saturate-[0.8] will-change-transform"
                            initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                            whileHover={imageHover}
                            transition={{
                                duration: 1.5,
                                ease: [0.33, 1, 0.68, 1]
                            }}
                        />

                        {/* Gradient overlay for blending */}
                        <div
                            className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 mix-blend-multiply transition-opacity duration-700 group-hover/portrait:opacity-60 pointer-events-none"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Decorative floating text */}
                    <div
                        className="absolute -bottom-4 right-0 lg:-right-8 z-30 hidden sm:block"
                        aria-hidden="true" // A11Y: Hidden from screen readers as it's decorative/repetitive
                    >
                        <div className="bg-gold-light p-6 min-w-50 rounded-sm">
                            <p className="text-black text-[11px] uppercase tracking-[0.4em] font-bold">Est. 2012</p>
                            <p className="text-black font-serif italic text-xl mt-1 leading-tight">Vienna Philharmonie Hall</p>
                        </div>
                    </div>

                    <div
                        className="absolute -top-8 -left-8 w-1/2 h-1/2 border-l border-t border-gold-light/10 -z-10"
                        aria-hidden="true"
                    />
                </motion.div>

                {/* Right: Content */}
                <article className="w-full lg:w-1/2 flex flex-col justify-center">
                    <SectionHeader
                        subtitle="Resonating Excellence"
                        title={
                            <>
                                A Symphony <span className="text-gold-light">of</span> <br />
                                <span className="italic font-light">Extraordinary</span> Women
                            </>
                        }
                        className="mb-8"
                    />

                    <div className="space-y-8 text-ash font-light text-xl leading-relaxed">
                        <blockquote className="border-l-2 border-gold-light/40 pl-8 italic text-ash/90">
                            "We don't just perform masterpieces; we breathe new, sophisticated life into every composition, creating an atmosphere of pure, transcendent elegance."
                        </blockquote>
                        <p className="text-base font-sans leading-loose text-ash/80">
                            Born from a shared passion for uncompromising musical excellence, our ensemble brings together the finest classical virtuosos from across the globe. Every performance is a testament to the power of artistic devotion and the unyielding spirit of feminine grace.
                        </p>
                    </div>

                    <div className="pt-12">
                        <button
                            onClick={() => setIsGalleryOpen(true)}
                            className="group relative flex flex-col items-start focus-visible:outline focus-visible:outline-offset-8 focus-visible:outline-gold-light rounded-sm"
                            aria-label="View gallery of our Maestro"
                            aria-expanded={isGalleryOpen}
                            aria-controls="maestro-gallery-modal"
                        >
                            <span className="text-gold-light uppercase tracking-[0.6em] text-[11px] font-bold mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                                The Visionary
                            </span>
                            <div className="flex items-baseline gap-8" aria-hidden="true">
                                <span className="text-ivory font-serif text-3xl lg:text-4xl leading-none tracking-tight">
                                    Our <span className="italic font-light">Maestro</span>
                                </span>
                                <motion.span
                                    className="text-gold-light text-2xl inline-block"
                                    animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    &rarr;
                                </motion.span>
                            </div>
                            <div
                                className="mt-6 w-32 h-px bg-gold-light/40 group-hover:w-full transition-all duration-[1.2s] ease-[0.16,1,0.3,1]"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </article>
            </div>

            <MaestroGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
            />
        </Section>
    );
}
