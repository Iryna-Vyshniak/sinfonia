import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuX, LuMail, LuSend, LuCircleCheck, LuMessageSquare } from 'react-icons/lu';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourDetails: {
    date: string;
    city: string;
    venue: string;
  } | null;
}

type Step = 'form' | 'sending' | 'success' | 'error';

export function BookingModal({ isOpen, onClose, tourDetails }: BookingModalProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track previous focus and handle Escape key to close + Focus Trap
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusableContent = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableElements))
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.getAttribute('tabindex') !== '-1';
            });

          if (focusableContent.length === 0) return;

          const firstFocusableElement = focusableContent[0];
          const lastFocusableElement = focusableContent[focusableContent.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      // Programmatic focus lock on mount
      const focusTimer = setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    } else {
      const timer = setTimeout(() => {
        setStep('form');
        setEmail('');
        setErrorMessage(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Handle body scroll locking cleanly and robustly
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clean up any remaining AbortController on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStep('sending');
    setIsLocalFallback(false);

    // Abort previous request if still in progress
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tourDetails,
        }),
        signal: controller.signal,
      });

      // Check if response is empty or not JSON
      const contentType = response.headers.get('content-type');
      let data: { error?: string; success?: boolean; isSimulated?: boolean } = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, it might be a 404 or 500 HTML page
        const text = await response.text();
        if (!response.ok) {
          if (response.status === 404) {
            console.warn("API route not found (404). Falling back to client-only simulation.");
            setIsLocalFallback(true);
            setStep('success');
            return;
          }
          throw new Error(`Server status ${response.status}: ${text.slice(0, 50)}...`);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process reservation');
      }

      setIsLocalFallback(!!data.isSimulated);
      setStep('success');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Submission fetch request aborted.');
        return;
      }
      console.error('Booking Error:', error);
      // In case of connection refused or other fetch error, fall back to simulation gracefully
      if (error instanceof TypeError || (error instanceof Error && error.message.toLowerCase().includes('fetch'))) {
        console.warn("Connection refused. Falling back to client-only simulation.");
        setIsLocalFallback(true);
        setStep('success');
        return;
      }
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(message);
      setStep('error');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [email, tourDetails]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Overlay backdrop (aria-hidden removes it from screen readers, avoiding redundant triggers) */}
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true"></div>

          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-obsidian border border-white/10 shadow-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h3 id="modal-title" className="text-xl font-serif text-ivory">Reserve Your Tickets</h3>
                {tourDetails && (
                  <p className="text-gold-light text-[10px] uppercase tracking-widest mt-1">
                    {tourDetails.city} — {tourDetails.date}
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-ash hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light rounded"
                aria-label="Close modal"
              >
                <LuX size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8" aria-live="polite">
              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs uppercase tracking-widest text-ash">
                        Connect Your Experience
                      </label>
                      <div className="relative">
                        <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-ash/50 w-4 h-4" aria-hidden="true" />
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 px-10 py-3 text-sm text-ivory focus:outline-none focus:border-gold-light/50 focus-visible:ring-1 focus-visible:ring-gold-light transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-ash/60 italic">
                        Access details and digital programs will be sent to this address.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      className="w-full gold-gradient py-4 text-black text-xs font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian transition-all flex items-center justify-center gap-2"
                    >
                      Process Reservation <LuSend size={14} aria-hidden="true" />
                    </button>
                  </motion.form>
                )}

                {step === 'sending' && (
                  <motion.div 
                    key="sending"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center justify-center py-12 space-y-6"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-2 border-gold-light/20 border-t-gold-light rounded-full"
                      />
                      <LuMail className="absolute inset-0 m-auto text-gold-light w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <p className="text-ivory font-serif text-lg">Synchronizing Orchestra Data</p>
                      <p className="text-ash text-[10px] uppercase tracking-widest mt-2">Securing your seat in the symphony...</p>
                    </div>
                  </motion.div>
                )}

                {step === 'error' && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 space-y-6 text-center"
                  >
                    <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-full">
                      <LuX className="text-red-500 w-8 h-8" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif text-ivory">Connection Failed</h4>
                      <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">Transmission Error</p>
                    </div>
                    <p className="text-xs text-ash/80 leading-relaxed italic px-4">
                      {errorMessage || "We encountered an unexpected interruption. Please verify your details or try again."}
                    </p>
                    <button 
                      onClick={() => setStep('form')}
                      className="w-full gold-gradient py-4 text-black text-xs font-bold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian transition-all"
                    >
                      Retry Reservation
                    </button>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-gold-light/10 flex items-center justify-center rounded-full">
                        <LuCircleCheck className="text-gold-light w-8 h-8" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif text-ivory">Reservation Confirmed</h4>
                        <p className="text-gold-light text-[10px] uppercase tracking-widest mt-1">
                          {isLocalFallback ? "Simulation Mode (Client Only Dev)" : "Check your inbox for step-by-step guidance"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-5 space-y-4 rounded-sm">
                      <div className="flex items-start gap-4">
                        <div className="bg-gold-light/20 p-2 rounded-full mt-1 shrink-0">
                          <LuMail className="text-gold-light w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs text-ivory font-medium">Digital Program Transmitted</p>
                          <div className="text-[10px] text-ash mt-1 leading-relaxed">
                            {isLocalFallback ? (
                              <p>A confirmation link and access code would be sent to your email. <span className="text-gold-light/60">(Note: running client-only dev mode - backend not detected, simulated successfully)</span>.</p>
                            ) : (
                              <p>A confirmation link and your unique access code have been sent to <span className="text-gold-light font-bold">{email}</span>. Please verify your inbox.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-white/5" />

                      <div className="flex items-start gap-4">
                        <div className="bg-gold-light/20 p-2 rounded-full mt-1 shrink-0">
                          <LuMessageSquare className="text-gold-light w-4 h-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs text-ivory font-medium">Instant Community Access</p>
                          <p className="text-[10px] text-ash mt-1 leading-relaxed">
                            Join our exclusive Telegram channel for live updates and behind-the-scenes content.
                          </p>
                        </div>
                      </div>
                    </div>

                    <a 
                      href="https://t.me/+MlIOqCcF0-RlMGNi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#26A5E4] hover:bg-[#208ecc] py-4 text-white text-xs font-bold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26A5E4] focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian transition-all flex items-center justify-center gap-3 group"
                    >
                      Connect on Telegram <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                    </a>

                    <button 
                      onClick={onClose}
                      className="w-full text-center text-[10px] uppercase tracking-[0.3em] text-ash/40 hover:text-ash focus-visible:text-ash transition-colors"
                    >
                      Return to Symphony
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-light to-transparent opacity-50" aria-hidden="true"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
