import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle2, MessageSquare } from 'lucide-react';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

type Step = 'sending' | 'success' | 'error';

export function NewsletterModal({ isOpen, onClose, email }: NewsletterModalProps) {
    const [step, setStep] = useState<Step>('sending');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const subscriptionStarted = useRef(false);

    const handleSubscribe = useCallback(async () => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    type: 'newsletter'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join circle');
            }

            setStep('success');
        } catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            setErrorMessage(message);
            setStep('error');
        }
    }, [email]);

    // Effect for triggering subscription
    useEffect(() => {
        if (isOpen && !subscriptionStarted.current) {
            subscriptionStarted.current = true;
            handleSubscribe();
        }

        if (!isOpen) {
            subscriptionStarted.current = false;
        }
    }, [isOpen, handleSubscribe]);

    // Effect for UI synchronization (Escape key, scrolling, focus)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            const focusTimer = setTimeout(() => {
                modalRef.current?.focus();
            }, 100);

            return () => {
                clearTimeout(focusTimer);
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        } else {
            const timer = setTimeout(() => {
                setStep('sending');
                setErrorMessage(null);
            }, 500);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="newsletter-modal-title"
                    aria-describedby="newsletter-modal-desc"
                >
                    {/* aria-hidden hides the backdrop from screen readers, preventing redundant announcements */}
                    <div className="absolute inset-0" onClick={onClose} aria-hidden="true"></div>

                    <motion.div
                        ref={modalRef}
                        tabIndex={-1} // Makes the wrapper focusable programmatically without breaking tab flow
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-black border border-white/10 shadow-2xl overflow-hidden focus:outline-none"
                    >
                        <div className="p-12" aria-live="polite" aria-atomic="true">
                            <AnimatePresence mode="wait">
                                {step === 'sending' ? (
                                    <motion.div
                                        key="sending"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center space-y-8"
                                    >
                                        <div className="relative" aria-hidden="true">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-16 h-16 border border-gold-light/20 border-t-gold-light rounded-full"
                                            />
                                            <Mail className="absolute inset-0 m-auto text-gold-light w-5 h-5" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h2 id="newsletter-modal-title" className="text-gold-light uppercase tracking-[0.5em] text-[10px] font-bold">
                                                Initiating Sequence
                                            </h2>
                                            <p id="newsletter-modal-desc" className="text-ash font-serif italic text-lg">
                                                Synchronizing your access...
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : step === 'error' ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8 text-center"
                                    >
                                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center rounded-full mx-auto" aria-hidden="true">
                                            <X className="text-red-500 w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 id="newsletter-modal-title" className="text-2xl font-serif text-ivory">
                                                Connection Interrupted
                                            </h2>
                                            <p className="text-red-500 uppercase tracking-[0.4em] text-[9px] font-bold">
                                                Error Detected
                                            </p>
                                        </div>
                                        <p id="newsletter-modal-desc" className="text-sm text-ash/80 leading-relaxed italic px-4">
                                            {errorMessage || "We encountered an unexpected overture. Please verify your details or try again."}
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="w-full bg-gold-light py-4 text-black text-center text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-ivory transition-all focus-visible:outline focus-visible:outline-gold-light focus-visible:outline-offset-2"
                                            aria-label="Close modal and retry connection"
                                        >
                                            Retry Connection
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-6">
                                            <div className="w-20 h-20 bg-gold-light/5 border border-gold-light/20 flex items-center justify-center rounded-full" aria-hidden="true">
                                                <CheckCircle2 className="text-gold-light w-10 h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h2 id="newsletter-modal-title" className="text-2xl font-serif text-ivory">
                                                    Welcome to the Circle
                                                </h2>
                                                <p className="text-gold-light uppercase tracking-[0.4em] text-[9px] font-bold">
                                                    Priority Status Activated
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/5 p-6 space-y-6">
                                            <div className="flex gap-4">
                                                <div className="bg-gold-light/10 p-2 h-fit rounded-full" aria-hidden="true">
                                                    <MessageSquare className="text-gold-light w-4 h-4" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xs text-ivory font-medium">Digital Programs Delivered</h3>
                                                    <p id="newsletter-modal-desc" className="text-[10px] text-ash/60 leading-loose">
                                                        An exclusive collection of repertoire annotations has been sent to <span className="text-gold-light">{email}</span>.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <a
                                                href="https://t.me/+MlIOqCcF0-RlMGNi"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full bg-[#26A5E4] py-4 text-white text-center text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#208ecc] transition-all focus-visible:outline focus-visible:outline-[#26A5E4] focus-visible:outline-offset-2"
                                                aria-label="Join our priority channel on Telegram (Opens in a new tab)"
                                            >
                                                Join Priority Channel
                                            </a>
                                            <button
                                                onClick={onClose}
                                                className="w-full text-center text-[10px] uppercase tracking-[0.4em] text-ash/30 hover:text-ash/60 transition-colors focus-visible:outline-2 focus-visible:outline-gold-light focus-visible:outline-offset-2 rounded"
                                                aria-label="Close modal and return to main site"
                                            >
                                                Return to Symphony
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gold-light/50 to-transparent" aria-hidden="true"></div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
