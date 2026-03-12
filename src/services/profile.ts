import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

const supabase = createClient()

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data as Profile
}

export const updateProfile = async (userId: string, data: ProfileUpdate) => {
    const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return updatedData as Profile
}

export const markOnboarded = async (userId: string) => {
    return updateProfile(userId, { onboarded: true })
}

export const syncStreak = async (profile: Profile) => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.last_active_date;

    if (lastActive === today) return profile; // Already active today

    let newStreak = profile.streak_count || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
        newStreak += 1;
    } else {
        newStreak = 1; // Reset or start new streak
    }

    try {
        const updated = await updateProfile(profile.id, {
            streak_count: newStreak,
            last_active_date: today
        });
        return updated;
    } catch (err) {
        console.error("Failed to sync streak:", err);
        return profile;
    }
}
