'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Sparkles,
    Copy,
    Save,
    RefreshCw,
    Hash,
    Check,
    ArrowLeft,
    Clock,
    Zap
} from 'lucide-react';
import { Skeleton } from '@mantine/core';

import { getTopicById, Topic } from '@/services/topics';
import { saveDraft, getDraftById } from '@/services/drafts';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { PlatformIcon } from '@/components/PlatformIcon';

const TONES = ['Professional', 'Casual', 'Bold', 'Educational', 'Motivational', 'Humorous'];
const PLATFORMS = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'TikTok'];

export default function GeneratePostPage() {
    const { topicId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const draftId = searchParams.get('draftId');

    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [variations, setVariations] = useState<any[]>([]);
    const [platform, setPlatform] = useState('LinkedIn');
    const [tone, setTone] = useState('Professional');
    const [activeVariation, setActiveVariation] = useState('A');
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [wordCount, setWordCount] = useState<'Short' | 'Medium' | 'Long'>('Medium');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (topicId) {
            getTopicById(topicId as string).then((data) => {
                setTopic(data);
                setLoading(false);
            });
        }
    }, [topicId]);

    useEffect(() => {
        if (draftId) {
            getDraftById(draftId).then((draft) => {
                if (draft) {
                    setVariations([{
                        version: 'A',
                        content: draft.content,
                        hashtags: draft.hashtags || [],
                        cta: draft.cta || 'Editing your refined draft.'
                    }]);
                    setActiveVariation('A');

                    const matched = PLATFORMS.find(p => p.toLowerCase() === draft.platform.toLowerCase());
                    if (matched) setPlatform(matched);

                    if (draft.tone && TONES.includes(draft.tone)) {
                        setTone(draft.tone);
                    }
                }
            });
        }
    }, [draftId]);

    const handleGenerate = async () => {
        setGenerating(true);
        setVariations([]);
        setError(null);
        try {
            const response = await fetch('/api/generate-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicId,
                    topicHeadline: topic?.headline,
                    whyTrending: topic?.why_trending,
                    platform,
                    tone,
                    wordCount
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate post. Please try again.');
            }

            setVariations(data.variations || []);
            if (data.variations?.length > 0) setActiveVariation('A');
        } catch (error: any) {
            console.error(error);
            setError('Content generation failed. This can happen due to high traffic or service interruptions. Please try again shortly or with a different tone.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async (variation: any) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            await saveDraft(
                user.id,
                topicId as string,
                platform.toLowerCase(),
                variation.content,
                tone,
                variation.hashtags,
                variation.cta
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentVariation = variations.find(v => v.version === activeVariation);

    if (loading) return (
        <div className="space-y-8 h-full">
            <Skeleton height={20} width={100} radius="xl" />
            <Skeleton height={120} radius="2rem" />
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                <div className="space-y-4">
                    <Skeleton height={40} radius="xl" />
                    <Skeleton height={200} radius="xl" />
                </div>
                <Skeleton height={400} radius="2rem" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 font-body">
            {/* Breadcrumb */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors no-underline"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Intelligence
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-border rounded-[2.5rem] p-8 md:p-10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Zap className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Trend Insight</span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                    {topic?.headline}
                </h1>
                <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-4xl">
                    {topic?.why_trending}
                </p>
            </motion.div>

            {/* Workspace */}
            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                {/* Controls Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                        <p className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" /> Configuration
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3 block">Target Platform</label>
                                <div className="space-y-1.5">
                                    {PLATFORMS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPlatform(p)}
                                            className={cn(
                                                "w-full rounded-xl border-2 px-4 py-3 text-sm font-bold text-left transition-all flex items-center gap-3",
                                                platform === p
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center">
                                                <PlatformIcon platform={p} size={12} variant="solid" />
                                            </div>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3 block">Word Count</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Short', 'Medium', 'Long'] as const).map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setWordCount(w)}
                                            className={cn(
                                                "rounded-xl border-2 px-2 py-2 text-[11px] font-black transition-all",
                                                wordCount === w
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            )}
                                        >
                                            {w}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3 block">Choose Tone</label>
                                <div className="flex flex-wrap gap-2">
                                    {TONES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={cn(
                                                "rounded-full border-2 px-4 py-2 text-[11px] font-black tracking-tight transition-all",
                                                tone === t
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full gradient-primary text-white font-black py-4 rounded-2xl shadow-glow flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] disabled:opacity-50"
                            >
                                {generating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                                {generating ? 'Thinking...' : 'Generate Post'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Generation Tip</span>
                        </div>
                        <p className="text-xs text-primary/80 font-medium leading-relaxed">
                            Try the 'Bold' tone for engagement spikes, or 'Educational' to build authority on LinkedIn.
                        </p>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="min-h-[500px]">
                    {error && (
                        <div className="mb-6 p-6 bg-destructive/10 border border-destructive/20 rounded-3xl flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-destructive/20 rounded-full flex items-center justify-center mb-4 text-destructive">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="font-display text-lg font-black text-destructive mb-2">Generation Failed</h3>
                            <p className="text-sm font-medium text-destructive/80 max-w-sm mb-6">
                                {error}
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="px-6 py-2.5 bg-destructive text-white text-xs font-black rounded-xl hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20 flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" /> Try Again
                            </button>
                        </div>
                    )}

                    {!variations.length && !generating && !error && (
                        <div className="flex flex-col items-center justify-center h-full glass border-2 border-dashed border-border rounded-[3rem] p-12 text-center">
                            <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center mb-6 text-primary/30">
                                <Sparkles size={40} />
                            </div>
                            <h3 className="font-display text-2xl font-black text-foreground mb-3">Your content starts here.</h3>
                            <p className="text-muted-foreground max-w-sm font-medium">
                                Configure your destination and style on the left, then click generate to create high-engagement post alternatives.
                            </p>
                        </div>
                    )}

                    {generating && (
                        <div className="space-y-6">
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3].map(i => <Skeleton key={i} height={45} width={120} radius="xl" />)}
                            </div>
                            <Skeleton height={400} radius="3rem" />
                        </div>
                    )}

                    {variations.length > 0 && !generating && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Version Tabs */}
                            <div className="flex gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border">
                                {variations.map((v) => (
                                    <button
                                        key={v.version}
                                        onClick={() => setActiveVariation(v.version)}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all",
                                            activeVariation === v.version
                                                ? "bg-card text-primary shadow-sm border border-border"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Variation {v.version}
                                    </button>
                                ))}
                            </div>

                            {/* Main Card */}
                            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-card group">
                                <div className="relative">
                                    <textarea
                                        value={currentVariation?.content}
                                        onChange={(e) => {
                                            const newVariations = variations.map(v =>
                                                v.version === activeVariation ? { ...v, content: e.target.value } : v
                                            );
                                            setVariations(newVariations);
                                        }}
                                        className="w-full min-h-[300px] resize-none border-0 bg-transparent p-0 text-xl font-medium text-foreground leading-[1.6] focus:ring-0 selection:bg-primary/10"
                                        placeholder="Generating your post..."
                                    />
                                </div>

                                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row gap-10">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-4 block">Recommended Hashtags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {currentVariation?.hashtags?.map((h: string) => (
                                                <span key={h} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary rounded-xl text-xs font-black">
                                                    <Hash className="h-3 w-3" />{h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:w-1/3">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-4 block">Call to Action</label>
                                        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl">
                                            <p className="text-sm font-bold text-foreground leading-relaxed italic">
                                                {currentVariation?.cta}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        {currentVariation?.content?.length} characters · {currentVariation?.content?.split(/\s+/).length} words
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleCopy(currentVariation?.content)}
                                            className={cn(
                                                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black transition-all",
                                                copied ? "bg-green-500 text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
                                            )}
                                        >
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={() => handleSave(currentVariation)}
                                            className={cn(
                                                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black transition-all",
                                                saved ? "bg-green-500 text-white" : "border-2 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                                            )}
                                        >
                                            {saved ? <Check size={18} /> : <Save size={18} />}
                                            {saved ? 'Saved' : 'Save Draft'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={handleGenerate}
                                    className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" /> Regenerate Variations
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
