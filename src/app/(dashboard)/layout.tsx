'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Bookmark,
    FileText,
    Calendar,
    BarChart3,
    Settings,
    LogOut,
    Flame,
    Menu,
    X,
    Sparkles,
    Bell
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useStore } from '@/store';
import { useState, useEffect } from 'react';
import { syncStreak } from '@/services/profile';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Saved Topics', path: '/saved', icon: Bookmark },
    { label: 'My Drafts', path: '/drafts', icon: FileText },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    // { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { profile, setProfile } = useStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        useStore.getState().clearProfile();
        router.push('/login');
        router.refresh();
    };

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profileRecord, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error || !profileRecord) {
                    handleLogout();
                } else {
                    const syncedProfile = await syncStreak(profileRecord);
                    setProfile(syncedProfile);
                    setIsCheckingProfile(false);
                }
            } else {
                router.push('/login');
            }
        };

        checkProfile();
    }, []);

    if (isCheckingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                    <p className="font-display text-sm font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
                        Syncing Profile...
                    </p>
                </div>
            </div>
        );
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col font-body">
            <div className="flex items-center gap-2.5 px-6 py-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                    <Sparkles className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
                <span className="font-display text-xl font-bold text-foreground">CreateIQ</span>
            </div>

            <div className="mx-4 mb-6 rounded-2xl bg-accent/50 p-4 border border-accent">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Main Streak</p>
                        <p className="font-display text-lg font-black text-foreground">{profile?.streak_count || 0} Days</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5 px-3">
                {navItems.map((item) => {
                    const active = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={`
                                flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all no-underline
                                ${active
                                    ? 'bg-primary text-white shadow-glow'
                                    : 'text-muted-foreground hover:bg-accent hover:text-primary'}
                            `}
                        >
                            <item.icon className={`h-[18px] w-[18px] ${active ? 'stroke-[3px]' : 'stroke-[2.5px]'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 bg-card p-2 rounded-2xl border border-border shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                        {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'CU'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-foreground truncate leading-tight">{profile?.full_name || 'Creator'}</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Pro Plan</p>
                    </div>
                    <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/5">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-background font-body selection:bg-primary/10">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
                <SidebarContent />
            </aside>

            {/* Mobile header */}
            <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between glass border-b border-border px-6 lg:hidden">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                        <Sparkles className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="font-display text-lg font-bold">CreateIQ</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-muted-foreground relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive border-2 border-background rounded-full"></span>
                    </button>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2 -mr-2">
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-[300px] bg-card shadow-2xl lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0">
                <div className="mx-auto max-w-7xl p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
