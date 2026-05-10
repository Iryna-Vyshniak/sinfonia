import { motion, useReducedMotion, type Variants } from 'motion/react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../lib/utils';

export interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'as'> {
    /** Whether to use the dark obsidian background */
    dark?: boolean;
    /** Vertical padding size */
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    /** Whether to wrap children in a constrained 7xl container */
    container?: boolean;
    /** A11Y: Providing a label helps screen readers identify the purpose of this section landmark */
    ariaLabel?: string;
    /** A11Y: If the section has a visible title, pass its ID here to link them semantically */
    ariaLabelledBy?: string;
    /** Motion variants to override default fade-up animation */
    variants?: Variants;
    /** HTML tag to use for the section */
    as?: 'section' | 'div' | 'header' | 'footer' | 'article' | 'aside';
}

export const Section = forwardRef<HTMLElement, SectionProps>(({
    children,
    className,
    dark = false,
    spacing = 'md',
    container = true,
    ariaLabel,
    ariaLabelledBy,
    variants: customVariants,
    as: Component = 'section',
    ...props
}, ref) => {
    const shouldReduceMotion = useReducedMotion();

    const spacingClasses = {
        none: "py-0",
        sm: "py-12",
        md: "py-24",
        lg: "py-32 md:py-48"
    };

    const defaultVariants: Variants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98] // Custom swift ease
            }
        }
    };

    const ComponentTag = Component as React.ElementType;

    return (
        <ComponentTag
            ref={ref}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(
                "relative overflow-hidden",
                spacingClasses[spacing],
                dark ? "bg-obsidian" : "bg-charcoal",
                className
            )}
            {...props}
        >
            <motion.div
                variants={customVariants || defaultVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: true,
                    margin: "-100px",
                    amount: 0.1
                }}
                className={cn(
                    container && "max-w-7xl mx-auto px-6 md:px-12"
                )}
            >
                {children}
            </motion.div>
        </ComponentTag>
    );
});

Section.displayName = 'Section';
