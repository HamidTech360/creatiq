'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, Bookmark, BookmarkX, ArrowRight, Zap } from 'lucide-react';
import { Skeleton, Pagination } from '@mantine/core';

import { getSavedTopics, unsaveTopic } from '@/services/savedTopics';
import { createClient } from '@/utils/supabase/client';
import { PlatformIcon } from '@/components/PlatformIcon';
import { EngagementBadge } from '@/components/EngagementBadge';
import { cn } from '@/lib/utils';

export default function SavedTopicsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 12;

    const fetchSaved = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: topics, count } = await getSavedTopics(user.id, page, pageSize);
            setData(topics || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, [page]);

    const handleRemove = async (topicId: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            await unsaveTopic(user.id, topicId);
            setData(prev => prev.filter(t => t.topic_id !== topicId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton height={40} width={250} radius="xl" />
                <Skeleton height={20} width={350} radius="xl" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={100} radius="2xl" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 font-body">
            {/* Header */}
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4"
                >
                    <Bookmark size={12} strokeWidth={3} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Library</span>
                </motion.div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Saved Topics</h1>
                <p className="mt-2 text-muted-foreground font-medium">Your curated collection of trending ideas ready for generation.</p>
            </div>

            {/* List */}
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] border-dashed border-2">
                    <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center mb-6 text-primary/30">
                        <BookmarkX size={40} />
                    </div>
                    <h3 className="font-display text-2xl font-black text-foreground mb-2">Your library is empty</h3>
                    <p className="text-muted-foreground max-w-sm font-medium">
                        Bookmark interesting topics from your feed to see them here later.
                    </p>
                    <Link href="/dashboard" className="no-underline mt-8">
                        <button className="gradient-primary text-white font-black px-8 py-4 rounded-2xl shadow-glow hover:scale-105 transition-transform">
                            Browse Intelligence
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {data.map((item, i) => (
                            <motion.div
                                key={item.topic_id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.daily_topics?.niche}</span>
                                        <span className="h-1 w-1 bg-border rounded-full" />
                                        <span className="text-[11px] font-bold text-muted-foreground">
                                            Saved {new Date(item.saved_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                        {item.daily_topics?.headline}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-4">
                                        <EngagementBadge score={item.daily_topics?.engagement_score || 0} />
                                        <div className="flex items-center gap-2">
                                            {item.daily_topics?.suitable_platforms?.map((p: string) => (
                                                <PlatformIcon key={p} platform={p} size={12} variant="solid" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Link href={`/generate/${item.topic_id}`} className="no-underline">
                                        <button className="gradient-primary text-white font-black px-6 py-3 rounded-xl shadow-glow text-sm flex items-center gap-2 transition-all hover:px-8">
                                            <Sparkles className="h-4 w-4" />
                                            Generate
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(item.topic_id)}
                                        className="p-3 rounded-xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {totalCount > pageSize && (
                        <div className="flex justify-center pt-10">
                            <Pagination
                                total={Math.ceil(totalCount / pageSize)}
                                value={page}
                                onChange={setPage}
                                color="teal"
                                size="lg"
                                radius="xl"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
