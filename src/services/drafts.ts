import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

export type Draft = Database['public']['Tables']['saved_drafts']['Row']

const supabase = createClient()

export const getDrafts = async (userId: string, platform: string | null = null, page: number = 1, pageSize: number = 20) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
        .from('saved_drafts')
        .select('*, daily_topics(headline)', { count: 'exact' })
        .eq('user_id', userId)
        .range(from, to)
        .order('created_at', { ascending: false })

    if (platform && platform !== 'all') {
        query = query.eq('platform', platform)
    }

    const { data, error, count } = await query

    if (error) throw error
    return { data, count }
}

export const getDraftById = async (draftId: string) => {
    const { data, error } = await supabase
        .from('saved_drafts')
        .select('*, daily_topics(*)')
        .eq('id', draftId)
        .single()

    if (error) throw error
    return data
}

export const saveDraft = async (
    userId: string,
    topicId: string | null,
    platform: string,
    content: string,
    tone: string | null,
    hashtags: string[] | null,
    cta: string | null
) => {
    const { data, error } = await supabase
        .from('saved_drafts')
        .insert({
            user_id: userId,
            topic_id: topicId,
            platform,
            content,
            tone,
            hashtags,
            cta
        })
        .select()
        .single()

    if (error) throw error
    return data as Draft
}

export const updateDraft = async (draftId: string, content: string) => {
    const { data, error } = await supabase
        .from('saved_drafts')
        .update({ content })
        .eq('id', draftId)
        .select()
        .single()

    if (error) throw error
    return data as Draft
}

export const deleteDraft = async (draftId: string) => {
    const { error } = await supabase
        .from('saved_drafts')
        .delete()
        .eq('id', draftId)

    if (error) throw error
}
