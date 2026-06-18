import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';
import repBg from '../../assets/images/before-a-concert.jpg';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

const repertoire = [
  {
    id: 1,
    composer: "Antonio Vivaldi",
    title: "Le Quattro Stagioni",
    description: "A breathtaking reimagining emphasizing the raw, turbulent energy of nature. Our string section brings unprecedented dynamic contrast, drawing out the visceral emotion buried within this beloved classic."
  },
  {
    id: 2,
    composer: "Wolfgang Amadeus Mozart",
    title: "Requiem in D minor, K. 626",
    description: "Performed with a chilling, transcendent purity. By stripping away extraneous force and focusing on precise tonal clarity, we invite profound contemplation of mortality and grace."
  },
  {
    id: 3,
    composer: "Pyotr Ilyich Tchaikovsky",
    title: "Symphony No. 6 'Pathétique'",
    description: "An unapologetically emotional interpretation. We lean into the agonizing beauty of Tchaikovsky's final opus, shaping each phrase with deep, resonant strings that linger long after the final note."
  }
];

export default function Repertoire() {
  const [openId, setOpenId] = useState<number | null>(1);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const accordionId = useId();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Section id="repertoire" ref={containerRef} dark className="relative overflow-hidden" spacing="lg">
      <motion.div 
        className="absolute inset-[-10%] z-0 bg-cover bg-center bg-no-repeat opacity-[0.09] grayscale mix-blend-screen"
        style={{ 
          backgroundImage: `url(${repBg})`,
          y: prefersReducedMotion ? 0 : y
        }}
      />
      
      <div className="relative z-10 w-full max-w-4xl px-6 mx-auto md:px-10">
        <SectionHeader 
          subtitle="Curated Selections"
          title={<>The <span className="font-light italic">Repertoire</span></>}
          align="center"
          className="mb-16 lg:mb-24"
          dark
        />

        <div className="relative before:absolute before:left-[3.5px] before:md:left-[7.5px] before:top-4 before:bottom-4 before:w-px before:bg-white/10 before:hidden before:sm:block">
          <ul className="flex flex-col" aria-label="Repertoire Selection">
            {repertoire.map((item, index) => {
              const isActive = openId === item.id;
              const isLast = index === repertoire.length - 1;
              const panelId = `repertoire-panel-${accordionId}-${item.id}`;
              const triggerId = `repertoire-trigger-${accordionId}-${item.id}`;
              
              return (
                <li key={item.id} className="relative flex items-start gap-6 md:gap-10">
                  <div className="relative z-10 flex-col items-center hidden w-2 pt-10 shrink-0 sm:flex md:pt-14" aria-hidden="true">
                    <motion.div
                      animate={{
                        rotate: isActive ? (prefersReducedMotion ? 0 : 135) : (prefersReducedMotion ? 0 : 45),
                        backgroundColor: isActive ? "var(--color-gold-light)" : "transparent"
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "w-2 h-2 border transition-colors duration-500",
                        isActive ? "border-gold-light" : "border-white/30"
                      )}
                    />
                  </div>

                  <div className={cn("flex-1 py-10 md:py-12", isLast ? "" : "border-b border-white/10")}>
                    <h3>
                      <button
                        id={triggerId}
                        onClick={() => setOpenId(isActive ? null : item.id)}
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        className="flex flex-row items-start w-full gap-4 text-left md:items-center justify-between group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold-light md:gap-8"
                      >
                        <div className="flex flex-col gap-3 md:gap-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className={cn(
                              "text-xs font-sans uppercase tracking-[0.2em] font-bold transition-colors duration-500",
                              isActive ? "text-gold-light" : "text-ash/60 group-hover:text-gold-light/80"
                            )}>
                              0{item.id}
                            </span>
                            <span className={cn(
                              "h-px transition-all duration-700 ease-[0.16,1,0.3,1]",
                              isActive ? "w-12 bg-gold-light" : "w-6 bg-white/20 group-hover:w-8 group-hover:bg-gold-light/40"
                            )}></span>
                            <span className={cn(
                              "text-xs font-sans uppercase tracking-[0.2em] transition-colors duration-500",
                              isActive ? "text-ivory" : "text-ash/50 group-hover:text-ivory/80"
                            )}>
                              {item.composer}
                            </span>
                          </div>
                          
                          <span className={cn(
                            "font-serif text-[clamp(1.875rem,4vw,3rem)] transition-all duration-700 leading-tight",
                            isActive ? "text-ivory italic" : "text-ash/70 group-hover:text-ivory"
                          )}>
                            {item.title}
                          </span>
                        </div>

                        <div className="pt-2 md:pt-4">
                          <motion.div
                           animate={{ rotate: isActive ? (prefersReducedMotion ? 0 : 180) : 0 }}
                           transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                           className={cn(
                             "transition-colors duration-500 shrink-0",
                             isActive ? "text-gold-light" : "text-ash/30 group-hover:text-ivory"
                           )}
                           aria-hidden="true"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </motion.div>
                        </div>
                      </button>
                    </h3>

                    <AnimatePresence>
                      {isActive && (
                        <motion.article
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 md:pt-10">
                            <div className="max-w-xl">
                              <header className="flex items-center gap-4 mb-6">
                                <h4 className="text-gold-light/80 uppercase tracking-[0.2em] text-xs font-bold">
                                  Director's Notes
                                </h4>
                              </header>
                              <p className="pl-6 mb-8 font-serif text-lg italic leading-relaxed border-l md:text-xl text-ash border-gold-light/30">
                                "{item.description}"
                              </p>
                              
                              <footer className="flex flex-wrap items-center pl-6 gap-6 opacity-80">
                                <div className="flex items-center gap-3">
                                  <span className="w-[2px] h-3 bg-gold-light/60 skew-x-[30deg]" aria-hidden="true"></span>
                                  <span className="text-xs uppercase tracking-[0.2em] text-ivory/80 font-medium">Full Ensemble</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="w-[2px] h-3 bg-gold-light/60 skew-x-[30deg]" aria-hidden="true"></span>
                                  <span className="text-xs uppercase tracking-[0.2em] text-ivory/80 font-medium">Acoustic Hall</span>
                                </div>
                              </footer>
                            </div>
                          </div>
                        </motion.article>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}