import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuX, LuChevronLeft, LuPlus, LuMinus, LuCreditCard, LuMapPin, LuCalendar, LuCircleCheck } from 'react-icons/lu';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useTicketOffcanvas } from '../../context/useTicketOffcanvas';
import { tours } from '../../data/tours';
import { CheckoutForm } from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function TicketOffcanvas() {
  const { isOpen, closeOffcanvas, selectedTour: contextSelectedTour } = useTicketOffcanvas();
  // State for step and selection
  const [step, setStep] = useState<'tour-list' | 'ticket-select' | 'processing' | 'payment' | 'success'>('tour-list');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<{ [category: string]: number }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [prevContextTourId, setPrevContextTourId] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Synchronize state during render when offcanvas is opened or selected tour changes
  if (isOpen !== prevIsOpen || (contextSelectedTour?.id || null) !== prevContextTourId) {
    setPrevIsOpen(isOpen);
    setPrevContextTourId(contextSelectedTour?.id || null);

    if (isOpen) {
      if (contextSelectedTour) {
        setSelectedTourId(contextSelectedTour.id);
        setStep('ticket-select');
        setTickets({});
      } else {
        setSelectedTourId(null);
        setStep('tour-list');
        setTickets({});
      }
    }
  }

  const selectedTour = tours.find(t => t.id === selectedTourId) || null;

  const ticketCategories = [
    { id: 'vip', name: 'VIP Circle', price: 250, description: 'Premium seating, backstage pass, and complimentary champagne.' },
    { id: 'parterre', name: 'Parterre', price: 150, description: 'Excellent acoustic positioning.' },
    { id: 'balcony', name: 'Balcony', price: 90, description: 'Panoramic views of the orchestra.' },
  ];

  const totalTickets = Object.values(tickets).reduce((sum, curr) => sum + curr, 0);
  const totalPrice = Object.entries(tickets).reduce((sum, [catId, qty]) => {
    const cat = ticketCategories.find(c => c.id === catId);
    return sum + (cat ? cat.price * qty : 0);
  }, 0);

  // Focus trap & escape key handling
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeOffcanvas();
        
        if (e.key === 'Tab' && offcanvasRef.current) {
          const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusableContent = Array.from(offcanvasRef.current.querySelectorAll<HTMLElement>(focusableElements))
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.getAttribute('tabindex') !== '-1';
            });
          
          if (focusableContent.length === 0) return;
          const first = focusableContent[0];
          const last = focusableContent[focusableContent.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      const focusTimer = setTimeout(() => {
        offcanvasRef.current?.focus();
      }, 100);

      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    } else {
      // Reset state gracefully when closed
      const timer = setTimeout(() => {
        setStep('tour-list');
        setSelectedTourId(null);
        setTickets({});
        setIsProcessing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, closeOffcanvas]);

  const handleTourSelect = (tourId: string) => {
    setSelectedTourId(tourId);
    setStep('ticket-select');
    setTickets({});
  };

  const handleBackToTours = () => {
    setStep('tour-list');
    setSelectedTourId(null);
  };

  const handleUpdateTicket = (catId: string, delta: number) => {
    setTickets(prev => {
      const current = prev[catId] || 0;
      const nextValue = Math.max(0, current + delta);
      if (nextValue === 0) {
        const newTickets = { ...prev };
        delete newTickets[catId];
        return newTickets;
      }
      return { ...prev, [catId]: nextValue };
    });
  };

  const handleCheckout = async () => {
    if (totalTickets === 0) return;
    
    setStep('processing');
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourDetails: selectedTour,
          items: tickets,
        }),
      });
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
        setIsProcessing(false);
      } else {
        throw new Error(data.error || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setStep('ticket-select');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
            onClick={closeOffcanvas}
            aria-hidden="true"
          />
          <motion.div
            ref={offcanvasRef}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-110 w-full max-w-md bg-obsidian border-l border-white/10 shadow-2xl flex flex-col focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Ticket reservation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              {step === 'ticket-select' || step === 'processing' ? (
                <button 
                  onClick={handleBackToTours}
                  disabled={step === 'processing'}
                  className="p-2 -ml-2 text-ash hover:text-ivory transition-colors disabled:opacity-50 flex items-center gap-2 group"
                >
                  <LuChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs uppercase tracking-widest font-semibold">Tours</span>
                </button>
              ) : (
                <h2 className="text-xl font-serif text-ivory">Book Tickets</h2>
              )}
              
              <button 
                onClick={closeOffcanvas}
                className="p-2 -mr-2 text-ash hover:text-ivory transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
                aria-label="Close menu"
              >
                <LuX size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === 'tour-list' && (
                  <motion.div
                    key="tour-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-ash mb-8">Select a performance to secure your seats for the upcoming Continental Tour.</p>
                    {tours.map(tour => (
                      <div key={tour.id} className="group p-5 bg-white/5 border border-white/5 hover:border-gold-light/30 transition-all rounded-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 text-gold-light text-[10px] uppercase tracking-widest mb-2 font-bold">
                              <LuCalendar size={12} /> {tour.date}
                            </div>
                            <h3 className="text-lg font-serif text-ivory font-medium">{tour.city}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-ash mt-1">
                              <LuMapPin size={12} /> {tour.venue}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleTourSelect(tour.id)}
                          className="w-full border border-gold-light/30 hover:bg-gold-light hover:text-black py-3 text-[10px] uppercase tracking-[0.2em] text-gold-light font-bold transition-all"
                        >
                          Buy Tickets
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {(step === 'ticket-select' || step === 'processing') && selectedTour && (
                  <motion.div
                    key="ticket-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full"
                  >
                    <div className="mb-8">
                      <h3 className="text-2xl font-serif text-ivory mb-2">{selectedTour.city}</h3>
                      <div className="flex flex-col gap-2 text-sm text-ash bg-white/5 p-4 border border-white/5 rounded-sm">
                        <div className="flex justify-between">
                          <span className="text-white/40">Date</span>
                          <span className="text-white">{selectedTour.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Venue</span>
                          <span className="text-white">{selectedTour.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <h4 className="text-xs uppercase tracking-widest text-ash/70 font-semibold mb-4">Select Categories</h4>
                      {ticketCategories.map(cat => (
                        <div key={cat.id} className="p-4 bg-white/5 border border-white/5 rounded-sm flex justify-between items-center">
                          <div className="flex flex-col max-w-[55%]">
                            <span className="text-sm font-medium text-ivory">{cat.name}</span>
                            <span className="text-[10px] text-gold-light mt-1">${cat.price} / ticket</span>
                            {/* <span className="text-[10px] text-ash mt-1 leading-tight">{cat.description}</span> */}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleUpdateTicket(cat.id, -1)}
                              disabled={!tickets[cat.id]}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-ivory hover:bg-white/10 hover:border-white/50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                              aria-label={`Remove one ${cat.name} ticket`}
                            >
                              <LuMinus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm font-mono">{tickets[cat.id] || 0}</span>
                            <button 
                              onClick={() => handleUpdateTicket(cat.id, 1)}
                              aria-label={`Add one ${cat.name} ticket`}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-ivory hover:bg-white/10 hover:border-white/50 transition-colors"
                            >
                              <LuPlus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && clientSecret && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full -mx-6 -my-8"
                  >
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#C9A96E', colorBackground: '#1A1A1A' } } }}>
                      <CheckoutForm 
                        amount={totalPrice} 
                        onSuccess={() => setStep('success')} 
                        onCancel={() => setStep('ticket-select')} 
                      />
                    </Elements>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center justify-center h-full space-y-6"
                  >
                    <div className="w-20 h-20 bg-gold-light/10 text-gold-light flex items-center justify-center rounded-full mb-4">
                      <LuCircleCheck size={40} />
                    </div>
                    <h3 className="text-2xl font-serif text-ivory">Checkout Complete</h3>
                    <p className="text-sm text-ash">
                      Your reservation for <span className="text-ivory font-medium">{selectedTour?.city}</span> is confirmed. 
                    </p>
                    <p className="text-[10px] text-gold-light/80 italic border border-gold-light/20 bg-gold-light/5 p-4 rounded-sm mt-4">
                      (Note: This is a simulated Stripe checkout response since no API keys were provided.)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Checkout Button */}
            {(step === 'ticket-select' || step === 'processing') && (
              <div className="p-6 border-t border-white/10 bg-obsidian/95 backdrop-blur shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-ash">Selected</span>
                    <span className="text-sm text-ivory">{totalTickets} Ticket{totalTickets !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-ash">Subtotal</span>
                    <span className="text-xl font-serif text-gold-light">${totalPrice}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={totalTickets === 0 || isProcessing}
                  className="w-full gold-gradient py-4 flex items-center justify-center gap-2 text-black text-xs font-bold uppercase tracking-[0.2em] shadow-lg disabled:opacity-50 disabled:grayscale transition-all hover:shadow-gold-light/20 relative"
                >
                  {isProcessing ? (
                    <motion.div 
                      key="processing"
                      className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      Proceed to Checkout <LuCreditCard size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
            
            {step === 'success' && (
              <div className="p-6 shrink-0 mt-auto">
                <button
                  onClick={closeOffcanvas}
                  className="w-full border border-white/20 py-4 text-xs font-bold text-ivory uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
                >
                  Return to Site
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}