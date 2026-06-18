import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import tourBg from '../../assets/images/orchestra-silhouettes.jpg';
import { BookingModal } from '../modals/BookingModal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

interface ITour {
  date: string;
  city: string;
  venue: string;
}

const tours: ITour[] = [
  { date: "Oct 15, 2026", city: "London, UK", venue: "Royal Albert Hall" },
  { date: "Nov 02, 2026", city: "New York, USA", venue: "Carnegie Hall" },
  { date: "Nov 18, 2026", city: "Vienna, Austria", venue: "Musikverein" },
  { date: "Dec 05, 2026", city: "Paris, France", venue: "Philharmonie de Paris" },
  { date: "Jan 12, 2027", city: "Tokyo, Japan", venue: "Suntory Hall" },
];

export default function Tour() {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedTour, setSelectedTour] = useState<ITour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const handleBook = (tour: ITour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  return (
    <Section id="tour" ref={containerRef} className="relative overflow-hidden bg-charcoal" spacing="lg">
      <motion.div 
        className="absolute inset-[-15%] z-0 bg-cover bg-center bg-no-repeat opacity-20 grayscale"
        style={{ 
          backgroundImage: `url(${tourBg})`,
          y: prefersReducedMotion ? 0 : y 
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <SectionHeader 
          subtitle="Tour Dates & Tickets"
          title={<>The <span className="italic text-gold-light">Continental</span> Tour</>}
          description="Season 2026-2027"
          className="mb-16"
        />

        <ul className="flex flex-col space-y-2">
          {tours.map((tour, i) => (
            <motion.li 
              key={`${tour.date}-${tour.city}`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: prefersReducedMotion ? 0 : i * 0.1, duration: 0.6 }}
              className="group relative px-4 py-6 -mx-4 overflow-hidden border-b transition-colors duration-500 border-white/5 hover:bg-white/[0.02]"
            >
              <span 
                className="absolute -left-2 top-0 transform -translate-y-1/4 font-serif font-black italic select-none pointer-events-none text-white/[0.02] text-[clamp(4rem,8vw,8rem)]"
                aria-hidden="true"
              >
                0{i + 1}
              </span>

              <div className="relative z-10 flex items-center justify-between">
                <article className="grid w-full grid-cols-1 gap-4 md:grid-cols-[160px_1fr_1fr] md:items-center">
                  <div className="flex flex-col">
                    <span className="mb-1 font-bold uppercase tracking-[0.2em] text-xs text-gold-light">Date</span>
                    <h3 className="font-serif text-xl text-ivory">{tour.date}</h3>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="mb-1 font-bold uppercase tracking-[0.2em] text-xs text-ash">Location</span>
                    <p className="font-sans text-sm tracking-wide uppercase text-ivory/80">{tour.city}</p>
                  </div>

                  <div className="flex flex-col">
                    <span className="mb-1 font-bold uppercase tracking-[0.2em] text-xs text-ash">Venue</span>
                    <p className="font-serif text-sm italic text-ash">{tour.venue}</p>
                  </div>
                </article>

                <div className="ml-4 shrink-0">
                  <button 
  onClick={() => handleBook(tour)}
  className="relative z-10 overflow-hidden px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-light border border-gold-light/30 transition-colors duration-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal min-h-[44px] min-w-[44px] before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-gold-light before:transition-transform before:duration-500 before:ease-in-out hover:before:translate-y-0 focus-visible:before:translate-y-0"
  aria-label={`Reserve tickets for ${tour.city} on ${tour.date} at ${tour.venue}`}
>
  Reserve
</button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedTour && (
        <BookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          tourDetails={selectedTour} 
        />
      )}
    </Section>
  );
}