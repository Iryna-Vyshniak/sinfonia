import { motion, useReducedMotion, type Variants } from 'framer-motion';

export function FooterBottom() {
    const currentYear = new Date().getFullYear();
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
            role="contentinfo" // Standard A11Y role for footer sections
        >
            <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-[11px] uppercase tracking-[0.4em] text-ash/60">
                    &copy; {currentYear} Sinfonia Nobile Orchestra.
                    <span className="sr-only"> All Rights Reserved.</span>
                    <span aria-hidden="true"> All Rights Reserved.</span>
                </p>
            </div>

            <nav aria-label="Legal navigation">
                <ul className="flex gap-12">
                    <li>
                        <a
                            href="."
                            className="text-[11px] uppercase tracking-[0.4em] text-ash/60 hover:text-gold-light focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-gold-light transition-colors duration-300"
                        >
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a
                            href="."
                            className="text-[11px] uppercase tracking-[0.4em] text-ash/60 hover:text-gold-light focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-gold-light transition-colors duration-300"
                        >
                            Terms of Service
                        </a>
                    </li>
                </ul>
            </nav>
        </motion.div>
    );
}