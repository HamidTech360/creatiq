'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    const navLinks = [
        { label: 'Features', href: '/#features' },
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Pricing', href: '/pricing' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 no-underline group">
                            <Sparkles className="w-8 h-8 text-blue-600 transition-transform group-hover:scale-110" />
                            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                CreateIQ
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors no-underline"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors no-underline"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 no-underline"
                            >
                                Sign up free
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 no-underline mb-6">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                                <span className="text-xl font-bold tracking-tight text-gray-900">CreateIQ</span>
                            </Link>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Empowering social media creators with AI-driven insights and effortless content generation.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Product</h4>
                            <ul className="space-y-4 list-none p-0">
                                {navLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Legal</h4>
                            <ul className="space-y-4 list-none p-0">
                                <li><Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline">Privacy Policy</Link></li>
                                <li><Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline">Terms of Service</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Connect</h4>
                            <ul className="space-y-4 list-none p-0">
                                <li><Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline">Twitter/X</Link></li>
                                <li><Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline">LinkedIn</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} CreateIQ. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
