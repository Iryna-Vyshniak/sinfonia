import React, { useState } from 'react';
import { motion } from 'motion/react';

import { NewsletterModal } from '../modals/NewsletterModal';
import { FooterBrand } from './footer/FooterBrand';
import { FooterNav } from './footer/FooterNav';
import { FooterContact } from './footer/FooterContact';
import { FooterNewsletter } from './footer/FooterNewsletter';
import { FooterBottom } from './footer/FooterBottom';


function FooterBackground() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute right-0 bottom-0 text-[18rem] md:text-[25rem] font-serif font-black text-white/1 pointer-events-none select-none italic transform translate-y-1/3 translate-x-1/4 leading-none"
        >
            Nobile
        </motion.div>
    );
}

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsModalOpen(true);
    };

    return (
        <footer
            role="contentinfo"
            className="bg-black border-t border-white/5 px-6 md:px-12 pt-24 pb-12 relative overflow-hidden"
        >
            <FooterBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Main Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
                    <FooterBrand />
                    <FooterNav />
                    <FooterContact />
                    <FooterNewsletter
                        email={email}
                        setEmail={setEmail}
                        onSubmit={handleNewsletterSubmit}
                    />
                </div>

                <FooterBottom />
            </div>

            {/* Portal/Modal Logic colocated with consumer */}
            <NewsletterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                email={email}
            />
        </footer>
    );
}

