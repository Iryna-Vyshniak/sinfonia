import { motion } from 'motion/react';

export function FooterContact() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
        >
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-gold-light font-bold">Contact</h3>
            <address className="flex flex-col space-y-4 not-italic" itemScope
                itemType="https://schema.org/Organization">
                <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-ash/30 font-bold">General Inquiries</p>
                    <a
                        href="mailto:office@sinfonianobile.com"
                        itemProp="email"
                        className="text-xs text-ash/60 hover:text-ivory focus-visible:text-gold-light outline-none transition-colors"
                    >
                        office@sinfonianobile.com
                    </a>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-ash/30 font-bold">Press & Bookings</p>
                    <a
                        href="tel:+4315131513"
                        itemProp="telephone"
                        className="text-[13px] text-ash/80 hover:text-gold-light focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-gold-light transition-colors"
                    >
                        +43 1 513 1513
                    </a>
                </div>
            </address>
        </motion.div>
    );
}
