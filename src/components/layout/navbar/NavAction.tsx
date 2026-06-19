import { cn } from '../../../lib/utils';
import { useTicketOffcanvas } from '../../../context/useTicketOffcanvas';

interface NavActionProps {
  className?: string;
}

export default function NavAction({ className }: NavActionProps) {
  const { openOffcanvas } = useTicketOffcanvas();

  return (
    <div className={cn("hidden md:flex items-center", className)}>
      <button 
        onClick={() => openOffcanvas()}
        className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ivory opacity-70 hover:opacity-100 hover:text-gold-light transition-all"
        aria-label="Book Tickets"
      >
        Book Tickets
      </button>
    </div>
  );
}
