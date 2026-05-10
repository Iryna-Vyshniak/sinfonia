import { cn } from '../../../lib/utils';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("shrink-0", className)}>
            <a href="#" className="font-serif text-2xl text-ivory tracking-widest block focus:outline-none">
                Sinfonia
                <span className="text-[10px] block font-sans tracking-[0.3em] opacity-60 -mt-2 uppercase text-ivory">
                    Symphony Orchestra
                </span>
            </a>
        </div>
    );
}