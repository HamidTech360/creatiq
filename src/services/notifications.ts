import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

const supabase = createClient()

export const getNotificationSettings = async (userId: string) => {
    const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error
    return data
}

export const updateNotificationSettings = async (userId: string, data: any) => {
    const { data: updatedSettings, error } = await supabase
        .from('notification_settings')
        .upsert({ ...data, user_id: userId, updated_at: new Date().toISOString() })
        .select()
        .single()

    if (error) throw error
    return updatedSettings
}
