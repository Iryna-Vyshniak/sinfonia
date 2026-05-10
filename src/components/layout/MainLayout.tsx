import type { ReactNode } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';


interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="bg-obsidian min-h-screen text-ivory selection:bg-gold-dark selection:text-obsidian scroll-smooth relative">
            <Navbar />
            <main id="main-content" className="outline-none">
                {children}
            </main>
            <Footer />
        </div>
    );
}
