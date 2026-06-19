import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import tourBg from '../../assets/images/orchestra-silhouettes.jpg';

import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

import { tours } from '../../data/tours';
import { useTicketOffcanvas } from '../../context/useTicketOffcanvas';


export default function Tour() {
  const containerRef = useRef<HTMLElement>(null);
  const { openOffcanvas } = useTicketOffcanvas();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Section id="tour" ref={containerRef} className="relative overflow-hidden bg-charcoal" spacing="lg">
      <motion.div 
        className="absolute inset-[-15%] z-0 bg-cover bg-center bg-no-repeat opacity-20 grayscale"
        style={{ 
          backgroundImage: `url(${tourBg})`,
          y
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/80 to-transparent z-0"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <SectionHeader 
          subtitle="Tour Dates & Tickets"
          title={<>The <span className="italic text-gold-light">Continental</span> Tour</>}
          description="Season 2026-2027"
          className="mb-16"
        />

        <div className="flex flex-col space-y-2" role="list">
          {tours.map((tour, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group border-b border-white/5 py-6 transition-all duration-500 hover:bg-white/2 -mx-4 px-4 overflow-hidden relative"
              role="listitem"
            >
              {/* Background oversized number for depth */}
              <span className="absolute -left-2 top-0 text-[8rem] font-serif font-black text-white/2 pointer-events-none select-none italic transform -translate-y-1/4">
                0{i + 1}
              </span>

              <div className="flex justify-between items-center relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] md:items-center gap-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold-light/60 font-bold mb-1">Date</span>
                    <h3 className="font-serif text-xl text-ivory">{tour.date}</h3>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-ash/40 font-bold mb-1">Location</span>
                    <p className="text-sm font-sans tracking-wide text-ivory/80 uppercase">{tour.city}</p>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-ash/40 font-bold mb-1">Venue</span>
                    <p className="text-xs italic font-serif text-ash">{tour.venue}</p>
                  </div>
                </div>

                <div className="shrink-0 ml-4">
                  <button 
                    onClick={() => openOffcanvas(tour)}
                    className="relative group/btn overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xs block"
                    aria-label={`Book tickets for ${tour.city} on ${tour.date} at ${tour.venue}`}
                  >
                    <div className="absolute inset-0 bg-gold-light transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                    <div className="relative border border-gold-light/30 px-6 py-3 text-[9px] uppercase tracking-[0.3em] gold-text group-hover/btn:text-black font-bold transition-colors duration-500">
                      Reserve
                    </div>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}