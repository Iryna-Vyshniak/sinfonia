import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    dark?: boolean;
}

export const Section = ({ children, className, id, dark = false }: SectionProps) => {
    return (
        <section id={id} className={cn("py-24 relative overflow-hidden",
            dark ? "bg-obsidian" : "bg-charcoal",
            className)}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-7xl mx-auto px-6 md:px-12"
            >
                {children}
            </motion.div>
        </section>
    );
 }