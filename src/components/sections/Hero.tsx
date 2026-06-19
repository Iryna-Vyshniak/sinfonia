import { motion, useScroll, useTransform, useSpring, type Variants } from 'motion/react';
import { useRef } from 'react';
import { Play, Calendar, Music } from 'lucide-react';

import heroBg from '../../assets/images/hero-orchestra-bg.jpg';

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    const y = useTransform(smoothProgress, [0, 1], ["0%", "35%"]);
    const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.5], [1, 1.05]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-svh w-full flex flex-col items-center bg-black overflow-hidden"
            aria-label="Hero Section"
        >

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MusicGroup",
                        "name": "Sinfonia Nobile",
                        "description": "World-class women's symphony orchestra dedicated to musical elegance and power.",
                        "url": "https://sinfonia-symphony-orchestra.vercel.app/",
                        "genre": "Classical",
                        "member": [
                            {
                                "@type": "Organization",
                                "name": "Sinfonia Nobile Ensemble"
                            }
                        ]
                    })
                }}
            />

            <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-12 py-10 pointer-events-none" aria-hidden="true">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="w-px bg-linear-to-b from-transparent via-gold-light/40 to-transparent"
                />
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="v-text text-[8px] uppercase tracking-[0.8em] text-gold-light/50 whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,0,0,1)]"
                >
                    Exclusive Symphony Ensemble • Est. 2012
                </motion.div>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="w-px bg-linear-to-b from-transparent via-gold-light/40 to-transparent"
                />
            </div>

            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-12 py-10 pointer-events-none" aria-hidden="true">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                    className="w-px bg-linear-to-b from-transparent via-gold-light/20 to-transparent"
                />
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 1 }}
                    className="v-text text-[8px] uppercase tracking-[0.8em] text-ivory/20 whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,0,0,1)]"
                >
                    Vienna • Paris • New York • Tokyo • London
                </motion.div>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.6 }}
                    className="w-px bg-linear-to-b from-transparent via-gold-light/20 to-transparent"
                />
            </div>

            <motion.div
                className="absolute inset-0 z-0 pointer-events-none will-change-transform"
                style={{ y, scale, opacity }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: `
            /* Новий шар: затемнення зліва та справа */
            linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.8) 100%),
            /* Існуючі шари */
            linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, transparent 50%),
            linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,1) 100%),
            radial-gradient(circle at 50% 40%, rgba(74,59,50,0.5) 0%, rgba(0,0,0,0.4) 70%)
        `
                    }}
                />
                <div className="absolute top-0 left-1/4 w-px h-full bg-white/5 blur-sm rotate-12 -translate-y-1/2" aria-hidden="true"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-white/10 blur-md -rotate-12" aria-hidden="true"></div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-30 grow flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto w-full pt-20"
            >
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 mb-8">
                    <div className="flex items-center gap-5" aria-hidden="true">
                        <span className="w-8 h-px bg-gold-light/40"></span>
                        <Music className="w-3 h-3 text-gold-light/60" />
                        <span className="w-8 h-px bg-gold-light/40"></span>
                    </div>
                    <p className="text-gold-light uppercase tracking-[1em] text-[11px] font-semibold">
                        Sinfonia Nobile
                    </p>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-ivory leading-[0.85] tracking-tight mb-12 [text-shadow:0_10px_40px_rgba(0,0,0,0.8),0_2px_10px_rgba(0,0,0,0.8)]"
                >
                    <span className="block italic font-light text-gold-light/90">Grace</span>
                    <span className="block relative">
                        <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-2xl font-sans font-light tracking-[0.5em] text-gold-light/20 hidden xl:block uppercase pointer-events-none" aria-hidden="true">Symphony</span>
                        Every Note
                        <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-2xl font-sans font-light tracking-[0.5em] text-gold-light/20 hidden xl:block uppercase pointer-events-none" aria-hidden="true">Ensemble</span>
                    </span>
                </motion.h1>

                <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-16 px-4">
                    <p className="text-base md:text-lg text-white font-normal leading-relaxed italic drop-shadow-xl text-balance [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">
                        World-class symphony orchestra where feminine power meets musical elegance.
                        An evocative journey through the greatest compositions of our time.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10">
                    <a
                        href="#tour"
                        className="group relative px-14 py-5 overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                        aria-label="Reserve Experience: View upcoming tour dates"
                    >
                        <div className="absolute inset-0 bg-gold-light/10 backdrop-blur-sm border border-gold-light/30"></div>
                        <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]"></div>
                        <span className="relative flex items-center gap-3 text-gold-light group-hover:text-black font-semibold uppercase tracking-[0.3em] text-[10px] transition-colors duration-500">
                            <Calendar className="w-3 h-3" aria-hidden="true" />
                            Reserve Experience
                        </span>
                    </a>

                    <button
                        className="flex items-center gap-5 text-ash hover:text-ivory transition-all duration-700 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
                        aria-label="Watch Overture: Autumn Session 2026"
                    >
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-ash/20 group-hover:border-gold-light transition-all duration-700 group-hover:scale-125"></div>
                            <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-gold-light/20 animate-pulse transition-all duration-700 group-hover:scale-150"></div>
                            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-gold-light group-hover:text-black transition-all duration-700">
                                <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Watch Overture</span>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-ash/40 font-medium">Autumn Session 2026</span>
                        </div>
                    </button>
                </motion.div>
            </motion.div>

            <motion.a
                href="#about"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="relative z-30 mt-auto mb-6 flex flex-col items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light rounded-sm px-4 py-2 hover:opacity-80 transition-opacity"
                aria-label="Explore: Scroll to About section"
            >
                <span className="text-[8px] uppercase tracking-[0.5em] text-gold-light/50 font-medium">Explore</span>
                <div className="w-px h-16 md:h-20 bg-linear-to-b from-gold-light/50 via-transparent to-transparent relative overflow-hidden" aria-hidden="true">
                    <motion.div
                        animate={{
                            y: ["-100%", "300%"],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 left-0 w-full h-1/3 bg-linear-to-b from-gold-light to-transparent"
                    />
                </div>
            </motion.a>
        </section>
    );
}