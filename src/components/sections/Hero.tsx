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

    // Create a smoothed version of scroll progress to prevent "jumping"
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
            className="relative h-screen min-h-175 w-full flex flex-col items-center justify-center overflow-hidden bg-black"
            aria-label="Hero Section"
        >
            {/* SEO Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
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
                })}
            </script>

            {/* Side Rails - Design Details */}
            <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-12 overflow-hidden py-10">
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
                    className="v-text text-[8px] uppercase tracking-[0.8em] text-gold-light/50 whitespace-nowrap"
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

            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-12 overflow-hidden py-10">
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
                    className="v-text text-[8px] uppercase tracking-[0.8em] text-ivory/20 whitespace-nowrap"
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

            {/* Cinematic Background Layer */}
            <motion.div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    y,
                    scale,
                    opacity
                }}
            >
                {/* Advanced Gradient Masking */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(74,59,50,0.4)_0%,transparent_70%)] z-10"></div>
                <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black z-20"></div>
                <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-black via-black/80 to-transparent z-20"></div>

                {/* Atmospheric Light Beams (Subtle) */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-white/5 blur-sm rotate-12 -translate-y-1/2"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-white/10 blur-md -rotate-12"></div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-30 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
            >
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 mb-8">
                    <div className="flex items-center gap-5">
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
                    className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-ivory leading-[0.85] tracking-tight mb-12"
                >
                    <span className="block italic font-light text-gold-light/90">Grace</span>
                    <span className="block relative">
                        <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-2xl font-sans font-light tracking-[0.5em] text-gold-light/20 hidden xl:block uppercase">Symphony</span>
                        Every Note
                        <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-2xl font-sans font-light tracking-[0.5em] text-gold-light/20 hidden xl:block uppercase">Ensemble</span>
                    </span>
                </motion.h1>

                <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-16">
                    <p className="text-base md:text-lg text-ash font-light leading-relaxed italic opacity-90 balance">
                        World-class symphony orchestra where feminine power meets musical elegance.
                        An evocative journey through the greatest compositions of our time.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10">
                    <a
                        href="#tour"
                        className="group relative px-14 py-5 overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95"
                    >
                        {/* Primary CTA with sophisticated backdrop */}
                        <div className="absolute inset-0 bg-gold-light/10 backdrop-blur-sm border border-gold-light/30"></div>
                        <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]"></div>
                        <span className="relative flex items-center gap-3 text-gold-light group-hover:text-black font-semibold uppercase tracking-[0.3em] text-[10px] transition-colors duration-500">
                            <Calendar className="w-3 h-3" />
                            Reserve Experience
                        </span>
                    </a>

                    <button className="flex items-center gap-5 text-ash hover:text-ivory transition-all duration-700 group focus:outline-none">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-ash/20 group-hover:border-gold-light transition-all duration-700 group-hover:scale-125"></div>
                            <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-gold-light/20 animate-pulse transition-all duration-700 group-hover:scale-150"></div>
                            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-gold-light group-hover:text-black transition-all duration-700">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Watch Overture</span>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-ash/40 font-medium">Autumn Session 2026</span>
                        </div>
                    </button>
                </motion.div>
            </motion.div>

            {/* Scroll indicator - Refined */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                aria-hidden="true"
            >
                <span className="text-[8px] uppercase tracking-[0.5em] text-gold-light/30 font-medium">Explore</span>
                <div className="w-px h-20 bg-linear-to-b from-gold-light/50 via-transparent to-transparent relative overflow-hidden">
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
            </motion.div>
        </section>
    );
}
