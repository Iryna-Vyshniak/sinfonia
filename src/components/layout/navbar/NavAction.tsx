import { cn } from "../../../lib/utils";

interface NavActionProps {
    className?: string;
    href?: string;
}

export function NavAction({ className, href = "#tour" }: NavActionProps) {
    return (
        <div className={cn("hidden md:flex items-center", className)}>
            <a
                href={href}
                className={cn(
                    "text-[11px] uppercase tracking-[0.2em] font-semibold text-ivory opacity-70 transition-all",
                    "hover:opacity-100 hover:text-gold-light",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm"
                )}
            >
                Book Tickets
            </a>
        </div>
    );
}

export default NavAction;