import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
}

export function CheckoutForm({ onSuccess, onCancel, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Securely construct target return paths
    const targetUrl = new URL(window.location.origin);
    targetUrl.searchParams.set('checkout', 'success');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: targetUrl.toString(),
      },
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent) {
      switch (paymentIntent.status) {
        case 'succeeded':
          onSuccess();
          break;
        case 'processing':
          setMessage('Your payment is processing. We will update you once confirmed.');
          break;
        default:
          setMessage('Payment status unhandled or incomplete.');
          break;
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {/* Adjusted to h2 for semantic hierarchy consistency */}
        <h2 className="text-xl font-serif text-ivory mb-6">Payment Details</h2>
        
        <div className="bg-white/5 p-4 rounded-sm mb-6 border border-white/5">
           <PaymentElement 
             options={{
               layout: "tabs",
               wallets: {
                 link: "never",
                 applePay: "never",
                 googlePay: "never"
               }
             }} 
           />
        </div>
        
        {message && (
          <div 
            role="alert" 
            className="text-red-200 text-xs mt-4 p-3 bg-red-950/80 border border-red-500/40 rounded-sm"
          >
            {message}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 shrink-0 bg-obsidian/95 backdrop-blur">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border border-white/20 py-4 text-xs font-bold text-ivory uppercase tracking-wider hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="flex-1 gold-gradient py-4 flex items-center justify-center gap-2 text-black text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" aria-hidden="true"></div>
            ) : (
              `Pay $${amount}`
            )}
          </button>
        </div>
      </div>
    </form>
  );
}