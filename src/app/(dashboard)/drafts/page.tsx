'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    Copy,
    FileText,
    Check,
    ChevronDown,
    ChevronUp,
    Pencil,
    Hash,
    Zap,
    ArrowRight,
    Calendar
} from 'lucide-react';
import { Skeleton, Pagination } from '@mantine/core';

import { getDrafts, deleteDraft } from '@/services/drafts';
import { addCalendarEntry } from '@/services/calendar';
import { createClient } from '@/utils/supabase/client';
import { PlatformIcon } from '@/components/PlatformIcon';
import { cn } from '@/lib/utils';

export default function MyDraftsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const scheduleDate = searchParams.get('scheduleDate');

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [platform, setPlatform] = useState('all');
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [editing, setEditing] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const pageSize = 12;

    const platforms = [
        { label: 'All', value: 'all' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
    ];

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: drafts, count } = await getDrafts(user.id, platform, page, pageSize);
            setData(drafts || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (draft: any) => {
        if (!scheduleDate) return;

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await addCalendarEntry(user.id, {
                topic_id: draft.topic_id,
                draft_id: draft.id,
                platform: draft.platform,
                scheduled_at: scheduleDate
            });

            router.push('/calendar');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, [page, platform]);

    const handleDelete = async (id: string) => {
        try {
            await deleteDraft(id);
            setData(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const toggleExpand = (id: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (loading) return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton height={40} width={250} radius="xl" />
                <Skeleton height={20} width={350} radius="xl" />
            </div>
            <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={40} width={100} radius="xl" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={200} radius="2xl" />)}
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
                    <FileText size={12} strokeWidth={3} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Archive</span>
                </motion.div>
                <h1 className="font-display text-3xl font-black text-foreground tracking-tight">My Drafts</h1>
                <p className="mt-2 text-muted-foreground font-medium">Your collection of AI-generated post variations across all channels.</p>
            </div>

            {/* Platform Filter */}
            <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => { setPlatform(p.value); setPage(1); }}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2",
                            platform === p.value
                                ? "bg-primary text-white shadow-glow"
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        {p.value !== 'all' && (
                            <PlatformIcon
                                platform={p.value}
                                size={14}
                                variant={platform === p.value ? 'solid' : 'outline'}
                            />
                        )}
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] border-dashed border-2">
                    <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center mb-6 text-primary/30">
                        <FileText size={40} />
                    </div>
                    <h3 className="font-display text-2xl font-black text-foreground mb-2">No drafts found</h3>
                    <p className="text-muted-foreground max-w-sm font-medium">
                        Generated posts will appear here for you to copy or edit later.
                    </p>
                    <Link href="/dashboard" className="no-underline mt-8">
                        <button className="gradient-primary text-white font-black px-8 py-4 rounded-2xl shadow-glow hover:scale-105 transition-transform">
                            Go to Intelligence
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {data.map((draft, i) => (
                            <motion.div
                                key={draft.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-card border border-border rounded-3xl p-6 shadow-sm transition-all hover:shadow-md h-fit"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center">
                                            <PlatformIcon platform={draft.platform} size={12} variant="solid" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest text-foreground">{draft.platform}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground">{new Date(draft.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleCopy(draft.content, draft.id)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                copied === draft.id ? "bg-green-500 text-white" : "text-muted-foreground hover:bg-secondary hover:text-primary"
                                            )}
                                        >
                                            {copied === draft.id ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(draft.id)}
                                            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <p className={cn(
                                        "text-sm font-medium text-foreground leading-[1.6] whitespace-pre-wrap",
                                        !expanded.has(draft.id) && "line-clamp-[6]"
                                    )}>
                                        {draft.content}
                                    </p>
                                    {draft.content.length > 300 && (
                                        <button
                                            onClick={() => toggleExpand(draft.id)}
                                            className="mt-2 text-[11px] font-black text-primary hover:underline flex items-center gap-1"
                                        >
                                            {expanded.has(draft.id) ? (
                                                <><ChevronUp size={12} /> Show Less</>
                                            ) : (
                                                <><ChevronDown size={12} /> Read More</>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {draft.hashtags?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {draft.hashtags.map((h: string) => (
                                            <span key={h} className="inline-flex items-center gap-0.5 px-3 py-1 bg-secondary text-muted-foreground rounded-full text-[10px] font-bold">
                                                <Hash size={10} />{h}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                                    <Link href={`/generate/${draft.topic_id}`} className="no-underline">
                                        <span className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                            <Zap size={10} /> {draft.daily_topics?.headline || 'View Details'}
                                        </span>
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        {scheduleDate && (
                                            <button
                                                onClick={() => handleSchedule(draft)}
                                                className="text-[11px] font-black bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                                            >
                                                <Calendar size={12} /> Schedule
                                            </button>
                                        )}
                                        <Link
                                            href={`/generate/${draft.topic_id}?draftId=${draft.id}`}
                                            className="no-underline"
                                        >
                                            <button className="text-[11px] font-black text-primary hover:gap-2 transition-all flex items-center gap-1">
                                                Refine <ArrowRight size={12} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

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
    );
}
