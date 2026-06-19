import React from 'react';
import { motion } from 'motion/react';

interface FooterNewsletterProps {
    email: string;
    setEmail: (email: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function FooterNewsletter({ email, setEmail, onSubmit }: FooterNewsletterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
        >
            <div className="space-y-4">
                <h3 id="inner-circle-heading" className="text-[10px] uppercase tracking-[0.4em] text-gold-light font-bold">The Inner Circle</h3>
                <p className="text-xs text-ash/90 italic font-serif leading-relaxed">
                    Receive invitations to private rehearsals and early access to digital scores.
                </p>
            </div>

            <form className="group relative" onSubmit={onSubmit} aria-labelledby="inner-circle-heading">
                <div className="relative overflow-hidden">
                    <input
                        id="footer-email"
                        type="email"
                        required
                        placeholder="E-mail Address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 py-4 text-xs font-sans tracking-wide text-ivory focus:outline-none focus:border-gold-light hover:border-gold-light transition-all duration-700 placeholder-white/40"
                        aria-label="Email address for newsletter"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-gold-light transition-all duration-700 group-focus-within:w-full"></div>
                </div>
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] gold-text uppercase font-bold tracking-[0.2em] opacity-40 group-hover:opacity-100 group-hover:text-gold-light focus-visible:opacity-100 focus-visible:text-gold-light transition-all duration-500 hover:tracking-[0.4em] pr-2 outline-none"
                    aria-label="Subscribe to newsletter"
                >
                    Join
                </button>
            </form>
        </motion.div>
    );
}
