export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    whatsapp_number: string | null
                    niche: string | null
                    selected_platforms: string[] | null
                    brand_voice: string | null
                    posting_frequency: string | null
                    plan: string
                    onboarded: boolean
                    streak_count: number
                    last_active_date: string | null
                    daily_generations_count: number
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    whatsapp_number?: string | null
                    niche?: string | null
                    selected_platforms?: string[] | null
                    brand_voice?: string | null
                    posting_frequency?: string | null
                    plan?: string
                    onboarded?: boolean
                    streak_count?: number
                    last_active_date?: string | null
                    daily_generations_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    whatsapp_number?: string | null
                    niche?: string | null
                    selected_platforms?: string[] | null
                    brand_voice?: string | null
                    posting_frequency?: string | null
                    plan?: string
                    onboarded?: boolean
                    streak_count?: number
                    last_active_date?: string | null
                    daily_generations_count?: number
                    created_at?: string
                }
            }
            daily_topics: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    niche: string
                    headline: string
                    why_trending: string | null
                    suitable_platforms: string[] | null
                    engagement_score: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    niche: string
                    headline: string
                    why_trending?: string | null
                    suitable_platforms?: string[] | null
                    engagement_score?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    niche?: string
                    headline?: string
                    why_trending?: string | null
                    suitable_platforms?: string[] | null
                    engagement_score?: number | null
                    created_at?: string
                }
            }
            saved_topics: {
                Row: {
                    id: string
                    user_id: string
                    topic_id: string
                    saved_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    topic_id: string
                    saved_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    topic_id?: string
                    saved_at?: string
                }
            }
            saved_drafts: {
                Row: {
                    id: string
                    user_id: string
                    topic_id: string | null
                    platform: string
                    content: string
                    tone: string | null
                    hashtags: string[] | null
                    cta: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    topic_id?: string | null
                    platform: string
                    content: string
                    tone?: string | null
                    hashtags?: string[] | null
                    cta?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    topic_id?: string | null
                    platform?: string
                    content?: string
                    tone?: string | null
                    hashtags?: string[] | null
                    cta?: string | null
                    created_at?: string
                }
            }
            calendar_entries: {
                Row: {
                    id: string
                    user_id: string
                    topic_id: string | null
                    draft_id: string | null
                    platform: string | null
                    scheduled_date: string
                    custom_title: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    topic_id?: string | null
                    draft_id?: string | null
                    platform?: string | null
                    scheduled_date: string
                    custom_title?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    topic_id?: string | null
                    draft_id?: string | null
                    platform?: string | null
                    scheduled_date?: string
                    custom_title?: string | null
                    status?: string
                    created_at?: string
                }
            }
            notification_settings: {
                Row: {
                    id: string
                    user_id: string
                    whatsapp_enabled: boolean
                    delivery_time: string
                    whatsapp_number: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    whatsapp_enabled?: boolean
                    delivery_time?: string
                    whatsapp_number?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    whatsapp_enabled?: boolean
                    delivery_time?: string
                    whatsapp_number?: string | null
                    updated_at?: string
                }
            }
        }
    }
}
