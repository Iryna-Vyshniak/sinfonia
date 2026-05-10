import { motion, type Variants } from 'motion/react';

import { cn } from '../../lib/utils';

interface SectionHeaderProps {
    title: string | React.ReactNode;
    subtitle?: string;
    description?: string;
    align?: 'left' | 'center';
    className?: string;
    dark?: boolean;
    id?: string;
}

export function SectionHeader({
    title,
    subtitle,
    description,
    align = 'left',
    className,
    dark = false,
    id,
}: SectionHeaderProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.header
            id={id}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn(
                "mb-12 md:mb-16",
                align === 'center' ? "text-center mx-auto max-w-2xl" : "text-left",
                className
            )}
        >
            {subtitle && (
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                    <span className={cn(
                        "uppercase tracking-[0.5em] text-[9px] font-bold",
                        dark ? "text-gold-light" : "text-gold-light"
                    )}>
                        {subtitle}
                    </span>
                    {align === 'left' && <div className="h-[0.5px] flex-1 bg-gold-light/20"></div>}
                </motion.div>
            )}

            <motion.h2
                variants={itemVariants}
                className={cn(
                    "text-4xl md:text-5xl lg:text-7xl font-serif tracking-tight leading-[1.1]",
                    dark ? "text-ivory" : "text-ivory"
                )}
            >
                {title}
            </motion.h2>

            {description && (
                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-ash font-light text-lg md:text-xl leading-relaxed opacity-80"
                >
                    {description}
                </motion.p>
            )}
        </motion.header>
    );
}
