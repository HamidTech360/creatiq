'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-background font-body">
            {/* Left Panel - Hero Section (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-16 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
                </div>

                <div className="max-w-md relative z-10 text-white">
                    <Link href="/" className="flex items-center gap-3 mb-10 no-underline cursor-pointer group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 transition-transform group-hover:scale-105">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-display text-3xl font-black tracking-tighter text-white">
                            CreateIQ
                        </span>
                    </Link>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-display text-5xl font-black leading-[1.1] tracking-tight mb-6"
                    >
                        Turn trending ideas into viral reality.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/80 text-lg font-medium leading-relaxed"
                    >
                        Join the next generation of pro creators using AI to dominate every social channel with data-backed intelligence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 p-6 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20"
                    >
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} size={14} className="text-white fill-white" />)}
                        </div>
                        <p className="text-sm font-medium italic text-white/90">
                            "CreateIQ cut my content research time by 80%. It's like having a full-time trend analyst in my pocket."
                        </p>
                        <p className="mt-3 text-xs font-black uppercase tracking-widest text-white/60">— Hammed Owolabi, Snr. Software Enginner & Content Strategist</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Auth Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-12 no-underline cursor-pointer group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow transition-transform group-hover:scale-105">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-2xl font-black tracking-tighter text-foreground">
                            CreateIQ
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>

                    <p className="mt-12 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                        Engineered for viral results. <br />
                        <Link href="/" className="text-primary hover:underline no-underline">Privacy</Link> • <Link href="/" className="text-primary hover:underline no-underline">Terms</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
