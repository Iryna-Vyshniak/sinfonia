import { cn } from '../../../lib/utils';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("shrink-0", className)}>
            <a href="#" className={cn(
                "group block font-serif text-2xl text-ivory tracking-widest transition-opacity hover:opacity-80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm"
            )}
                aria-label="Sinfonia Symphony Orchestra - Home">
                Sinfonia
                <span aria-hidden="true"
                    className="text-[10px] block font-sans tracking-[0.3em] opacity-60 -mt-2 uppercase text-ivory">
                    Symphony Orchestra
                </span>
            </a>
        </div>
    );
}