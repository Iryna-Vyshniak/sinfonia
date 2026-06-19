import { motion } from 'motion/react';

const LINKS = ['About', 'Tour', 'Repertoire', 'Press'];

export function FooterNav() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8"
        >
            <h3 id="footer-nav-heading" className="text-[10px] uppercase tracking-[0.4em] text-gold-light font-bold">Navigation</h3>
            <nav aria-labelledby="footer-nav-heading">
                <ul className="flex flex-col space-y-4">
                    {LINKS.map((link) => (
                        <li key={link}>
                            <a
                                href={`#${link.toLowerCase()}`}
                                className="text-xs text-ash/80 hover:text-ivory focus-visible:text-gold-light transition-colors duration-300 w-fit relative group block outline-none"
                            >
                                {link}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-light transition-all duration-500 group-hover:w-full group-focus-visible:w-full"></span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.div>
    );
}
