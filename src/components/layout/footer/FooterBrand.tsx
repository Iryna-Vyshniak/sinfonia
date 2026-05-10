import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { SiInstagram, SiYoutube, SiX, SiThreads } from 'react-icons/si';



interface SocialLink {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
}

const socialLinks: SocialLink[] = [
    { Icon: SiInstagram, label: 'Follow Sinfonia Nobile on Instagram', href: '.' },
    { Icon: SiThreads, label: 'Subscribe to our Threads', href: '.' },
    { Icon: SiYoutube, label: 'Subscribe to our Youtube channel', href: '.' },
    { Icon: SiX, label: 'Follow our updates on X', href: '.' }
];

export function FooterBrand() {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10 lg:col-span-1"
        >
            <div className="space-y-4">
                {/* SEO: H2 is perfect here for brand identity in the footer */}
                <h2 className="font-serif text-3xl text-ivory tracking-tight italic">
                    Sinfonia <span className="not-italic font-medium text-gold-light">Nobile</span>
                </h2>

                <p className="text-[11px] text-ash/60 uppercase tracking-[0.5em] font-medium leading-relaxed max-w-65">
                    The <strong className="font-bold text-ivory">Zenith</strong> of Classical Artistry.
                    <span className="block mt-1">Performance. Poise. Perfection.</span>
                </p>
            </div>

            <nav aria-label="Social media links">
                <ul className="flex items-center gap-6">
                    {socialLinks.map(({ Icon, label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ash/50 hover:text-gold-light hover:border-gold-light/30 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-gold-light transition-all duration-500 group"
                                aria-label={label}
                            >
                                <Icon
                                    className="w-4 h-4 transition-transform group-hover:scale-110"
                                    aria-hidden="true"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.div>
    );
}