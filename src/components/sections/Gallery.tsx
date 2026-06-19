import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';

import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

import gallery1 from '../../assets/images/the-grand-ambience.jpg';
import gallery2 from '../../assets/images/visual-composition.jpg';
import gallery3 from '../../assets/images/deep-artistry.jpg';
import gallery4 from '../../assets/images/before-a-concert.jpg';
import gallery5 from '../../assets/images/orchestra-silhouettes.jpg';
import gallery6 from '../../assets/images/sonata-partnership.jpg';
import gallery7 from '../../assets/images/the-interplay.jpg';
import gallery8 from '../../assets/images/before-a-concert.jpg';
import gallery9 from '../../assets/images/close-up-violin.jpg';
import gallery10 from '../../assets/images/legacy.jpg';
import gallery11 from '../../assets/images/allegro.jpg';
import gallery12 from '../../assets/images/crescendo.jpg';
import gallery13 from '../../assets/images/hero-orchestra-bg.jpg';
import gallery14 from '../../assets/images/cellist-portrait.jpg';

const galleryImages = [
    { url: gallery1, caption: "The Grand Ambience" },
    { url: gallery2, caption: "Visual Composition" },
    { url: gallery3, caption: "Deep Artistry" },
    { url: gallery4, caption: "The Backstage Quiet" },
    { url: gallery5, caption: "Orchestral Shadows" },
    { url: gallery6, caption: "Symphony of Three" },
    { url: gallery7, caption: "The Interplay" },
    { url: gallery8, caption: "Pure Expression" },
    { url: gallery9, caption: "Mastered Craft" },
    { url: gallery10, caption: "Vibrant Echoes" },
    { url: gallery11, caption: "Spirit of Allegro" },
    { url: gallery12, caption: "Breath Before the Bow" },
    { url: gallery13, caption: "Rising Intensity" },
    { url: gallery14, caption: "Timeless Artistry" },
];

export default function Gallery() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);

    const progress = useTransform(x, [0, -width], [0, 1]);

    const lineWidth1 = useTransform(progress, [0, 0.5, 1], [20, 60, 20]);
    const lineWidth2 = useTransform(progress, [0, 0.5, 1], [40, 20, 60]);
    const lineWidth3 = useTransform(progress, [0, 0.5, 1], [60, 40, 40]);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(Math.max(0, carouselRef.current.scrollWidth - carouselRef.current.offsetWidth));
        }

        const handleResize = () => {
            if (carouselRef.current) {
                setWidth(Math.max(0, carouselRef.current.scrollWidth - carouselRef.current.offsetWidth));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Section
            className="bg-charcoal overflow-hidden"
            spacing="lg"
            container={false}
            aria-labelledby="gallery-heading"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                <SectionHeader
                    id="gallery-heading"
                    title={<>Visual <span className="italic text-gold-light/90">Poetry</span></>}
                    align="left"
                    className="mb-12"
                    description="Drag to explore the unspoken moments."
                />
            </div>

            {/* Semantic wrapper: Region & Carousel roles for a11y */}
            <div
                className="pl-6 md:pl-12 lg:pl-24 mb-12"
                role="region"
                aria-roledescription="carousel"
                aria-label="Orchestra visual gallery"
            >
                <motion.div
                    ref={carouselRef}
                    className="cursor-grab active:cursor-grabbing overflow-hidden"
                    whileTap={{ cursor: "grabbing" }}
                    tabIndex={0} // Makes the drag area focusable for keyboard users
                    aria-live="polite"
                >
                    {/* Converted to a semantic list */}
                    <motion.ul
                        drag="x"
                        style={{ x }}
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6 pr-6 w-max m-0 p-0 list-none"
                    >
                        {galleryImages.map((img, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="w-70 md:w-100 h-87.5 md:h-125 relative overflow-hidden group border border-white/5 shrink-0 cursor-grab outline-none"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${galleryImages.length}`}
                                tabIndex={0}
                            >
                                <figure className="m-0 w-full h-full relative pointer-events-none">
                                    <img
                                        src={img.url}
                                        alt={`Photograph capturing: ${img.caption}`}
                                        loading={i < 3 ? "eager" : "lazy"} // Eager load LCP images, lazy load the rest
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-focus:grayscale-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:scale-110 group-focus:scale-110 transition-all duration-700 pointer-events-none"
                                    />
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        aria-hidden="true"
                                    ></div>

                                    {/* Semantic figcaption */}
                                    <figcaption className="absolute bottom-6 left-6 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 text-ivory pointer-events-none">
                                        <div className="w-6 h-px bg-gold-light mb-3" aria-hidden="true"></div>
                                        {img.caption}
                                    </figcaption>
                                </figure>
                            </motion.li>
                        ))}
                    </motion.ul>
                </motion.div>
            </div>

            <div
                className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex justify-start"
                aria-hidden="true" // Hide purely decorative progress indicator from screen readers
            >
                <div className="flex items-center gap-4">
                    <motion.div style={{ width: lineWidth1 }} className="h-0.5 bg-gold-light/60 rounded-full" />
                    <motion.div style={{ width: lineWidth2 }} className="h-0.5 bg-gold-light/40 rounded-full" />
                    <motion.div style={{ width: lineWidth3 }} className="h-0.5 bg-gold-light/20 rounded-full" />
                    <span className="text-[9px] uppercase tracking-widest text-ash/40 ml-4">Progressive Harmony</span>
                </div>
            </div>
        </Section>
    );
}