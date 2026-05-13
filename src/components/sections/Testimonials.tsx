import { useEffect, useState, useCallback, useRef, useId } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Quote } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Section } from '../ui/Section';

interface Testimonial {
  id: string;
  quote: string;
  source: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'A breathtaking display of technique and profound emotional depth. The epitome of classical sophistication.',
    source: 'The Symphonic Times',
    role: 'Lead Music Critic',
  },
  {
    id: 't-2',
    quote:
      'They do not merely play the music; they conjure it from the very air. Exquisitely powerful.',
    source: 'Le Figaro Culture',
    role: 'Editorial Staff',
  },
  {
    id: 't-3',
    quote:
      'Redefining the modern orchestra. A masterclass in elegance, precision, and unified breath.',
    source: 'Classical Review',
    role: 'Chief Editor',
  },
];

const AUTOPLAY_INTERVAL = 7000;

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionId = useId();

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case ' ':
        case 'Enter':
          // Toggle pause on space/enter if focus is within
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
      }
    },
    [handleNext, handlePrevious],
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  const variants: Variants = {
    initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -20, filter: 'blur(8px)' },
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Section
      dark
      className='flex items-center justify-center border-t border-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03)_0%,transparent_70%)]'
      spacing='lg'
      aria-labelledby={`${regionId}-title`}
    >
      {/* Hidden heading for screen readers to describe the section */}
      <h2 id={`${regionId}-title`} className='sr-only'>
        Critical Acclaim
      </h2>

      <div
        ref={containerRef}
        className='max-w-4xl mx-auto text-center w-full px-4 sm:px-6 md:px-8'
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        // ARIA attributes for a carousel-like region
        role='region'
        aria-roledescription='carousel'
        aria-label='Testimonials'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='flex justify-center mb-8 md:mb-12'
          aria-hidden='true' // Decorative icon
        >
          <div className='relative group'>
            <div className='absolute inset-0 bg-gold-light/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
            <div className='relative w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm'>
              <Quote className='text-gold-light w-5 h-5 md:w-6 md:h-6 fill-gold-light/10' />
            </div>
          </div>
        </motion.div>
        <div className='sr-only' aria-live='polite' aria-atomic='true'>
          {`Testimonial ${currentIndex + 1} of ${testimonials.length}: ${currentTestimonial.quote} - ${currentTestimonial.source}`}
        </div>

        <div className='relative min-h-70 sm:min-h-55 md:min-h-50 flex items-center justify-center mb-12 md:mb-16'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTestimonial.id}
              variants={variants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className='w-full focus:outline-none'
              // ARIA attributes for the current slide
              role='group'
              aria-roledescription='slide'
              aria-label={`Testimonial ${currentIndex + 1} of ${testimonials.length}`}
              tabIndex={0} // Make the active slide focusable for keyboard users
            >
              <figure className='m-0 flex flex-col items-center gap-6 md:gap-10'>
                <blockquote className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-ivory italic leading-relaxed sm:leading-[1.3] tracking-tight m-0'>
                  <p className='m-0'>"{currentTestimonial.quote}"</p>
                </blockquote>

                <motion.figcaption
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='flex flex-col items-center gap-1.5'
                >
                  <cite className='not-italic text-[10px] sm:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold-light font-bold'>
                    {currentTestimonial.source}
                  </cite>
                  <span className='text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-ash/60 font-medium'>
                    {currentTestimonial.role}
                  </span>
                </motion.figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='flex flex-col items-center gap-4 md:gap-6'>
          <div
            className='flex justify-center items-center gap-3 md:gap-4'
            role='tablist'
            aria-label='Testimonial navigation'
          >
            {testimonials.map((testimonial, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={testimonial.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    'group relative p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded',
                    'transition-opacity hover:opacity-100',
                    isActive ? 'opacity-100' : 'opacity-50',
                  )}
                  role='tab'
                  aria-selected={isActive}
                  aria-controls={`testimonial-panel-${i}`}
                  aria-label={`Go to testimonial ${i + 1} from ${testimonial.source}`}
                  tabIndex={isActive ? 0 : -1}
                >
                  <div className='relative w-8 sm:w-10 md:w-12 h-1 px-1 bg-white/10 overflow-hidden rounded-full'>
                    {/* Active Indicator & Progress */}
                    {isActive && (
                      <motion.div
                        initial={!isPaused ? { left: '-100%' } : { left: '0%' }}
                        animate={!isPaused ? { left: '0%' } : undefined}
                        transition={
                          !isPaused
                            ? { duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }
                            : undefined
                        }
                        className='absolute inset-0 bg-gold-light rounded-full'
                        style={{ left: isPaused ? '0%' : undefined }} // Keep full when paused
                      />
                    )}
                    {/* Hover state for inactive tabs */}
                    {!isActive && (
                      <div className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full' />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className='text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-ash/40 hover:text-ash/70 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-light rounded px-2 py-1'
              aria-label={isPaused ? 'Play testimonials' : 'Pause testimonials'}
            >
              {isPaused ? 'Paused' : 'Hover to Pause'}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
