import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

const supabase = createClient()

export type CalendarEntry = {
    id: string;
    user_id: string;
    topic_id: string | null;
    draft_id: string | null;
    platform: string | null;
    scheduled_date: string;
    custom_title: string | null;
    status: string;
    created_at: string;
    topic_headline?: string;
    draft_content?: string;
};

export const getCalendarEntries = async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase
        .from('calendar_entries')
        .select('*, daily_topics(headline), saved_drafts(content)')
        .eq('user_id', userId);

    if (startDate) query = query.gte('scheduled_date', startDate);
    if (endDate) query = query.lte('scheduled_date', endDate);

    const { data, error } = await query;

    if (error) throw error;

    // Flatten the data for easier use
    return (data || []).map(entry => ({
        ...entry,
        topic_headline: (entry.daily_topics as any)?.headline,
        draft_content: (entry.saved_drafts as any)?.content
    })) as CalendarEntry[];
}

export const addCalendarEntry = async (userId: string, data: any) => {
    const { data: newEntry, error } = await supabase
        .from('calendar_entries')
        .insert({ ...data, user_id: userId })
        .select()
        .single()

    if (error) throw error
    return newEntry
}

export const updateCalendarEntry = async (entryId: string, scheduledDate: string) => {
    const { data, error } = await supabase
        .from('calendar_entries')
        .update({ scheduled_date: scheduledDate })
        .eq('id', entryId)
        .select()
        .single()

    if (error) throw error
    return data
}

export const updateCalendarEntryStatus = async (entryId: string, status: string) => {
    const { data, error } = await supabase
        .from('calendar_entries')
        .update({ status })
        .eq('id', entryId)
        .select()
        .single()

    if (error) throw error
    return data
}

export const deleteCalendarEntry = async (entryId: string) => {
    const { error } = await supabase
        .from('calendar_entries')
        .delete()
        .eq('id', entryId)

    if (error) throw error
}
