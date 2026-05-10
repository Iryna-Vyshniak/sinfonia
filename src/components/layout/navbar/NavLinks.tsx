import type { ReactNode } from "react";

import { cn } from "../../../lib/utils";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
    return (
        <a
            href={href}
            onClick={onClick}
            className={cn(
                "text-[11px] uppercase tracking-[0.2em] font-semibold text-ivory opacity-70 hover:opacity-100 hover:text-gold-light transition-all hover:underline underline-offset-8 decoration-gold-light",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-sm",
                className
            )}
        >
            {children}
        </a>
    );
}

const navItems = [
    { href: "#about", label: "The Orchestra" },
    { href: "#repertoire", label: "Repertoire" },
    { href: "#tour", label: "Tour" },
];


export function DesktopNav() {
    return (
        <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-10"
        >
            {navItems.map((item) => (
                <NavLink key={item.label} href={item.href}>
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}

export default DesktopNav;