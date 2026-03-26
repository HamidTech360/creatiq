'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Sparkles, BookmarkCheck, LayoutGrid, Search, Flame, RefreshCcw, Wand2, X } from 'lucide-react';
import { Skeleton, Select, Autocomplete } from '@mantine/core';

import { getTodaysTopics, Topic } from '@/services/topics';
import { saveTopic, unsaveTopic } from '@/services/savedTopics';
import { createClient } from '@/utils/supabase/client';
import { getErrorMessage } from '@/utils/errors';
import { useStore } from '@/store';
import { PlatformIcon } from '@/components/PlatformIcon';
import { EngagementBadge } from '@/components/EngagementBadge';
import { cn } from '@/lib/utils';
import { PLATFORMS, NICHES, TONES } from '@/utils/constants';

const platforms = [
    { id: 'all', label: 'All' },
    ...PLATFORMS.map(p => ({ id: p.value, label: p.label }))
];

export default function DashboardPage() {
    const router = useRouter();
    const { profile } = useStore();

    // Local overrides for niche and voice (not saved to DB)
    const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

    const [topics, setTopics] = useState<Topic[]>([]);
    const [activePlatform, setActivePlatform] = useState('all');
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize local overrides from profile
    useEffect(() => {
        if (profile && !selectedNiche) {
            setSelectedNiche(profile.niche);
            setSelectedVoice(profile.brand_voice);
        }
    }, [profile]);

    const fetchTopics = async (forceRefresh = false) => {
        const nicheToUse = selectedNiche || profile?.niche || 'technology';
        setLoading(!forceRefresh);
        if (forceRefresh) setIsGenerating(true);
        setError(null);

        try {
            // 1. Try fetching from DB first
            const { data: topicsData } = await getTodaysTopics(nicheToUse, 1, 50);

            // 2. Only generate if truly empty OR if forced
            if ((!topicsData || topicsData.length === 0) || forceRefresh) {
                const res = await fetch('/api/topics/generate', {
                    method: 'POST',
                    body: JSON.stringify({
                        niche: nicheToUse,
                        voice: selectedVoice || profile?.brand_voice,
                        force: forceRefresh
                    })
                });
                const gen = await res.json();

                if (gen.topics) {
                    setTopics(gen.topics);
                } else if (gen.error) {
                    throw new Error(gen.error);
                }
            } else {
                setTopics(topicsData || []);
            }

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: saved } = await supabase.from('saved_topics').select('topic_id').eq('user_id', user.id);
                setSavedIds(new Set(saved?.map(s => s.topic_id) || []));
            }
        } catch (err) {
            setError('Content generation failed. This can happen due to high traffic or service interruptions. Please try again shortly.');
            setTimeout(() => setError(null), 5000); // Auto dismiss after 5 seconds
        } finally {
            setLoading(false);
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (profile) {
            fetchTopics();
        }
    }, [profile]);

    const toggleSave = async (topicId: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (savedIds.has(topicId)) {
                await unsaveTopic(user.id, topicId);
                setSavedIds(prev => {
                    const next = new Set(prev);
                    next.delete(topicId);
                    return next;
                });
            } else {
                await saveTopic(user.id, topicId);
                setSavedIds(prev => {
                    const next = new Set(prev);
                    next.add(topicId);
                    return next;
                });
            }
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const filteredTopics = activePlatform === 'all'
        ? topics
        : topics.filter(t => t.suitable_platforms?.map(p => p.toLowerCase()).includes(activePlatform));

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    if (loading && !isGenerating) return (
        <div className="space-y-8 h-full">
            <div className="space-y-2">
                <Skeleton height={40} width={300} radius="xl" />
                <Skeleton height={20} width={450} radius="xl" />
            </div>
            <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={40} width={100} radius="full" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={240} radius="2rem" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-10 relative">
            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-destructive text-destructive-foreground font-black text-sm rounded-2xl shadow-2xl w-[90%] md:w-auto max-w-lg"
                    >
                        <Flame className="h-5 w-5 shrink-0" />
                        <span className="leading-tight">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto md:ml-4 p-1 rounded-full transition-colors hover:bg-black/10 shrink-0 text-destructive-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-2"
                    >
                        <Wand2 size={12} strokeWidth={3} />
                        <span className="text-[10px] uppercase tracking-widest font-black">AI Content Lab</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl font-black text-foreground tracking-tight"
                    >
                        {greeting}, {profile?.full_name?.split(' ')[0] || 'Creator'}.
                    </motion.h1>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
                        Explore daily trending topics curated for your niche.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <Autocomplete
                            placeholder="Niche"
                            data={NICHES}
                            value={selectedNiche || ''}
                            onChange={setSelectedNiche}
                            size="sm"
                            radius="xl"
                            styles={{ input: { backgroundColor: 'transparent', fontWeight: 700 } }}
                        />
                        <Select
                            placeholder="Voice"
                            data={TONES}
                            value={selectedVoice}
                            onChange={setSelectedVoice}
                            size="sm"
                            radius="xl"
                            styles={{ input: { backgroundColor: 'transparent', fontWeight: 700 } }}
                        />
                    </div>
                    <button
                        onClick={() => fetchTopics(true)}
                        disabled={isGenerating}
                        className="gradient-primary text-white font-black px-6 py-2.5 rounded-full shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale w-full md:w-auto"
                    >
                        {isGenerating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Generate Fresh
                    </button>
                </div>
            </div>

            {/* Platform Filters */}
            <div className="flex flex-wrap gap-2">
                {platforms.map((p, i) => (
                    <motion.button
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setActivePlatform(p.id)}
                        className={cn(
                            'rounded-lg border px-6 py-2 cursor-pointer text-sm font-bold transition-all duration-200 flex items-center gap-2',
                            activePlatform === p.id
                                ? 'bg-primary text-white shadow-glow'
                                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-primary'
                        )}
                    >
                        {p.id !== 'all' && <PlatformIcon platform={p.id} size={12} variant="solid" className="mr-2" />}
                        {p.label}
                    </motion.button>
                ))}
            </div>

            {/* Content Area */}
            {filteredTopics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] border-dashed border-2 border-border/50">
                    <div className="h-24 w-24 bg-accent/30 rounded-full flex items-center justify-center mb-6 text-primary shadow-xl">
                        <Search size={40} />
                    </div>
                    <h3 className="font-display text-2xl font-black text-foreground mb-2">No trending topics found</h3>
                    <p className="text-muted-foreground max-w-sm font-medium">
                        We haven't generated topics for this configuration yet. Hit the button below to spark some magic.
                    </p>
                    <button
                        onClick={() => fetchTopics(true)}
                        disabled={isGenerating}
                        className="mt-8 gradient-primary text-white font-black px-10 py-4 rounded-2xl shadow-glow hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        {isGenerating ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                        Spark Intelligence
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {filteredTopics.map((topic, i) => (
                            <motion.div
                                key={topic.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.03, duration: 0.3 }}
                                className="group relative flex flex-col rounded-[2.5rem] border border-border bg-card p-8 shadow-card transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <button
                                        onClick={() => toggleSave(topic.id)}
                                        className={cn(
                                            "shrink-0 p-3 rounded-2xl transition-all shadow-sm",
                                            savedIds.has(topic.id) ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:bg-accent hover:text-primary"
                                        )}
                                    >
                                        {savedIds.has(topic.id) ? <BookmarkCheck className="h-5 w-5" strokeWidth={3} /> : <Bookmark className="h-5 w-5" strokeWidth={2.5} />}
                                    </button>
                                </div>

                                <div className="flex-grow pt-4">
                                    <h3 className="font-display text-xl font-black text-foreground leading-tight pr-12 group-hover:text-primary transition-colors">
                                        {topic.headline}
                                    </h3>
                                    <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed font-medium line-clamp-3">
                                        {topic.why_trending}
                                    </p>
                                </div>

                                <div className="mt-8 space-y-6">
                                    <div className="h-px w-full bg-gradient-to-r from-border/0 via-border to-border/0" />

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <EngagementBadge score={topic.engagement_score || 0} />
                                            <div className="flex items-center -space-x-1.5">
                                                {topic.suitable_platforms?.map(p => (
                                                    <PlatformIcon
                                                        key={p}
                                                        platform={p}
                                                        size={12}
                                                        variant="solid"
                                                        className="border-2 border-card shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <Link href={`/generate/${topic.id}`} className="shrink-0">
                                            <button className="gradient-primary text-white font-black px-8 py-4 rounded-2xl shadow-glow text-sm flex items-center gap-2 transition-all hover:px-10 active:scale-95">
                                                <Sparkles className="h-4 w-4" />
                                                Generate
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
