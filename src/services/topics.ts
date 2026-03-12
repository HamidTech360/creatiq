import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

export type Topic = Database['public']['Tables']['daily_topics']['Row']

const supabase = createClient()

export const getTodaysTopics = async (niche?: string, page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("No authenticated user")
    }

    let query = supabase
        .from('daily_topics')
        .select('*', { count: 'exact' })
        .eq('date', new Date().toISOString().split('T')[0])
        .eq('user_id', user.id)
        .range(from, to)
        .order('created_at', { ascending: false });

    if (niche) {
        query = query.eq('niche', niche);
    }

    const { data, error, count } = await query;

    if (error) throw error
    return { data: data as Topic[], count }
}

export const getTopicById = async (topicId: string) => {
    const { data, error } = await supabase
        .from('daily_topics')
        .select('*')
        .eq('id', topicId)
        .single()

    if (error) throw error
    return data as Topic
}
