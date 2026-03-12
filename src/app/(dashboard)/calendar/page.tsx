'use client';

import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Zap, X, Trash2, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCalendarEntries, CalendarEntry, addCalendarEntry, deleteCalendarEntry, updateCalendarEntryStatus } from '@/services/calendar';
import { getTodaysTopics, Topic } from '@/services/topics';
import { getDrafts } from '@/services/drafts';
import { createClient } from '@/utils/supabase/client';
import { PLATFORMS } from '@/utils/constants';

type ScheduleMode = 'topic' | 'draft' | 'manual';

export default function CalendarPage() {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState<CalendarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Scheduling State
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('topic');
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
    const [availableDrafts, setAvailableDrafts] = useState<any[]>([]);

    // Form State
    const [formPlatform, setFormPlatform] = useState(PLATFORMS[0].value);
    const [formTopicId, setFormTopicId] = useState('');
    const [formDraftId, setFormDraftId] = useState('');
    const [formCustomTitle, setFormCustomTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchEntries = async (uid: string) => {
        const entriesData = await getCalendarEntries(uid);
        setEntries(entriesData || []);
    };

    useEffect(() => {
        const fetchAll = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            await fetchEntries(user.id);

            // Pre-fetch topics and drafts for scheduling modal
            const { data: topicsData } = await getTodaysTopics(undefined, 1, 50); // Fetch all user's topics
            setAvailableTopics(topicsData || []);

            const { data: draftsData } = await getDrafts(user.id);
            setAvailableDrafts(draftsData || []);

            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleScheduleSubmit = async () => {
        if (!userId) return;
        setSubmitting(true);
        try {
            const payload: any = {
                platform: formPlatform,
                scheduled_date: selectedDate.toISOString(),
                status: scheduleMode === 'draft' ? 'draft_ready' : 'planned',
            };

            if (scheduleMode === 'topic') payload.topic_id = formTopicId;
            if (scheduleMode === 'draft') {
                payload.draft_id = formDraftId;
                const selectedDraft = availableDrafts.find((d: any) => d.id === formDraftId);
                if (selectedDraft?.topic_id) {
                    payload.topic_id = selectedDraft.topic_id;
                }
            }
            if (scheduleMode === 'manual') payload.custom_title = formCustomTitle;

            await addCalendarEntry(userId, payload);
            await fetchEntries(userId);
            setIsScheduling(false);
            setFormCustomTitle('');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <CalendarIcon size={12} strokeWidth={3} /> Planning Station
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">Content Calendar</h1>
                    <p className="text-gray-500 font-medium">Schedule your posts and maintain a consistent presence.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm self-start">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-black text-foreground px-4 min-w-[140px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="hidden lg:grid grid-cols-7 mb-4">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-px bg-transparent lg:bg-secondary/30 rounded-[2.5rem] lg:p-px overflow-hidden shadow-none lg:shadow-inner">
                {days.map((day, i) => {
                    const dayEntries = entries.filter(e => isSameDay(new Date(e.scheduled_date), day));
                    return (
                        <div
                            key={i}
                            className={`
                min-h-[140px] bg-card p-4 relative transition-all cursor-pointer group
                ${!isSameMonth(day, monthStart) ? 'bg-secondary/30' : ''}
                ${isSameDay(day, selectedDate) ? 'ring-2 ring-inset ring-primary z-10' : 'hover:bg-primary/5'}
              `}
                            onClick={() => {
                                setSelectedDate(day);
                                setDrawerOpen(true);
                            }}
                        >
                            <span className={`
                text-sm font-black mb-2 block
                ${isSameDay(day, new Date()) ? 'text-primary bg-primary/10 inline-block px-2 py-1 rounded-lg' : isSameMonth(day, monthStart) ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                                <span className="lg:hidden text-[10px] uppercase mr-1 opacity-70">{format(day, 'EEE')}</span>
                                {format(day, 'd')}
                            </span>

                            <div className="space-y-1.5 mt-2">
                                {dayEntries
                                    .slice(0, 3)
                                    .map((e, idx) => {
                                        const title = e.custom_title || e.topic_headline || 'Untitled Post';
                                        let bg = 'bg-primary/10 border-primary/20 text-primary';
                                        if (e.status === 'posted') bg = 'bg-green-500/10 border-green-500/20 text-green-600';
                                        if (e.status === 'draft_ready') bg = 'bg-blue-500/10 border-blue-500/20 text-blue-600';

                                        return (
                                            <div key={idx} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold truncate border ${bg}`}>
                                                <span className="opacity-70 mr-1 uppercase">[{e.platform}]</span>
                                                {title}
                                            </div>
                                        )
                                    })}
                                {dayEntries.length > 3 && (
                                    <div className="text-[10px] font-black text-muted-foreground pl-2 pt-1">+{dayEntries.length - 3} more</div>
                                )}
                            </div>

                            <div className="absolute bottom-4 right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden">
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="py-2 relative min-h-[800px]">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Date Detail Drawer - Custom implemented */}
            {drawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white z-[110] shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="h-full flex flex-col pt-24 pb-12 px-8 sm:px-12">
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-12">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 italic">Scheduled Strategy</p>
                                <h2 className="text-3xl font-black text-gray-900">{format(selectedDate, 'MMMM d, yyyy')}</h2>
                            </div>

                            <div className="flex-grow space-y-4 overflow-y-auto no-scrollbar py-4 px-1">
                                {isScheduling ? (
                                    <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm space-y-6">
                                        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
                                            {(['topic', 'draft', 'manual'] as ScheduleMode[]).map(mode => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setScheduleMode(mode)}
                                                    className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${scheduleMode === mode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            {scheduleMode === 'topic' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Select AI Topic</label>
                                                    <select
                                                        value={formTopicId}
                                                        onChange={(e) => setFormTopicId(e.target.value)}
                                                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                                    >
                                                        <option value="">-- Choose a trending topic --</option>
                                                        {availableTopics.map(t => (
                                                            <option key={t.id} value={t.id}>{t.headline}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {scheduleMode === 'draft' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Select Saved Draft</label>
                                                    <select
                                                        value={formDraftId}
                                                        onChange={(e) => setFormDraftId(e.target.value)}
                                                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                                    >
                                                        <option value="">-- Choose a ready draft --</option>
                                                        {availableDrafts.map(d => (
                                                            <option key={d.id} value={d.id}>{d.daily_topics?.headline || 'Draft'}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {scheduleMode === 'manual' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Custom Post Title</label>
                                                    <input
                                                        type="text"
                                                        value={formCustomTitle}
                                                        onChange={(e) => setFormCustomTitle(e.target.value)}
                                                        placeholder="What's on your mind?"
                                                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Platform</label>
                                                <select
                                                    value={formPlatform}
                                                    onChange={(e) => setFormPlatform(e.target.value)}
                                                    className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                                >
                                                    {PLATFORMS.map(p => (
                                                        <option key={p.value} value={p.value}>{p.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {entries.filter(e => isSameDay(new Date(e.scheduled_date), selectedDate)).length > 0 ? (
                                            entries.filter(e => isSameDay(new Date(e.scheduled_date), selectedDate)).map((e, idx) => {
                                                const title = e.custom_title || e.topic_headline || 'Untitled Post';
                                                let iconColor = 'text-primary';
                                                let badgeColor = 'bg-primary/10 text-primary border-primary/20';

                                                if (e.status === 'posted') {
                                                    iconColor = 'text-green-500';
                                                    badgeColor = 'bg-green-500/10 text-green-600 border-green-500/20';
                                                }
                                                if (e.status === 'draft_ready') {
                                                    iconColor = 'text-blue-500';
                                                    badgeColor = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
                                                }

                                                return (
                                                    <div key={e.id} className="bg-card p-6 rounded-[2rem] border border-border relative group overflow-hidden shadow-sm flex flex-col gap-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-xl ${badgeColor}`}>
                                                                    <Clock size={16} className={iconColor} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-xs font-black text-muted-foreground tracking-widest uppercase">
                                                                    {e.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap sm:flex-nowrap gap-2 opacity-100 transition-opacity mt-2 sm:mt-0">
                                                                {e.topic_id && (
                                                                    <button
                                                                        onClick={() => router.push(`/generate/${e.topic_id}`)}
                                                                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors group/btn"
                                                                        title="Generate Content"
                                                                    >
                                                                        <Wand2 size={14} className="group-hover/btn:animate-pulse" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={async () => {
                                                                        await deleteCalendarEntry(e.id);
                                                                        if (userId) fetchEntries(userId);
                                                                    }}
                                                                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                                                                    title="Remove Entry"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <h4 className="font-display text-xl font-black text-foreground leading-tight">{title}</h4>

                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${badgeColor}`}>
                                                                {e.platform}
                                                            </span>
                                                            {e.status !== 'posted' && (
                                                                <button
                                                                    onClick={async () => {
                                                                        await updateCalendarEntryStatus(e.id, 'posted');
                                                                        if (userId) fetchEntries(userId);
                                                                    }}
                                                                    className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border bg-secondary hover:bg-green-500 hover:text-white transition-colors ml-auto"
                                                                >
                                                                    Mark Posted
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="h-60 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 bg-secondary/20">
                                                <Zap className="text-muted-foreground mb-6" size={40} />
                                                <p className="text-foreground font-black mb-1">Nothing scheduled yet</p>
                                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">Boost your engagement by planning your consistency.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border flex gap-3">
                                {isScheduling ? (
                                    <>
                                        <button
                                            onClick={() => setIsScheduling(false)}
                                            className="flex-1 py-4 bg-secondary text-foreground font-black rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleScheduleSubmit}
                                            disabled={submitting || (scheduleMode === 'topic' && !formTopicId) || (scheduleMode === 'draft' && !formDraftId) || (scheduleMode === 'manual' && !formCustomTitle)}
                                            className="flex-[2] py-4 bg-primary text-primary-foreground font-black rounded-[1.5rem] shadow-glow flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                                        >
                                            {submitting ? 'Saving...' : 'Save to Calendar'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsScheduling(true)}
                                        className="w-full py-5 bg-primary text-primary-foreground font-black rounded-[1.5rem] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        <Plus size={20} /> Schedule New Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
