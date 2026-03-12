import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

const supabase = createClient()

export const getSavedTopics = async (userId: string, page: number = 1, pageSize: number = 20) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('saved_topics')
        .select('*, daily_topics(*)', { count: 'exact' })
        .eq('user_id', userId)
        .range(from, to)
        .order('saved_at', { ascending: false })

    if (error) throw error
    return { data, count }
}

export const saveTopic = async (userId: string, topicId: string) => {
    const { data, error } = await supabase
        .from('saved_topics')
        .insert({ user_id: userId, topic_id: topicId })
        .select()
        .single()

    if (error) throw error
    return data
}

export const unsaveTopic = async (userId: string, topicId: string) => {
    const { error } = await supabase
        .from('saved_topics')
        .delete()
        .eq('user_id', userId)
        .eq('topic_id', topicId)

    if (error) throw error
}

export const isTopicSaved = async (userId: string, topicId: string) => {
    const { data, error } = await supabase
        .from('saved_topics')
        .select('id')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .maybeSingle()

    if (error) throw error
    return !!data
}
