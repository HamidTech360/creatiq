-- CreateIQ Initial Schema Migration (Idempotent Version)
-- Aligning with src/types/database.ts

/*
  USAGE INSTRUCTIONS:
  1. Go to your Supabase Dashboard -> SQL Editor.
  2. Paste this entire script and run it.
  3. This script is SAFE to run multiple times. It will only create what's missing.
*/

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    whatsapp_number TEXT,
    niche TEXT DEFAULT 'Technology',
    selected_platforms TEXT[],
    brand_voice TEXT,
    posting_frequency TEXT,
    plan TEXT DEFAULT 'free',
    onboarded BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    last_active_date DATE,
    daily_generations_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Topics Table
CREATE TABLE IF NOT EXISTS public.daily_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    niche TEXT NOT NULL,
    headline TEXT NOT NULL,
    why_trending TEXT,
    suitable_platforms TEXT[],
    engagement_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Saved Topics Table
CREATE TABLE IF NOT EXISTS public.saved_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES public.daily_topics ON DELETE CASCADE NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- 4. Saved Drafts Table
CREATE TABLE IF NOT EXISTS public.saved_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES public.daily_topics ON DELETE SET NULL,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    tone TEXT,
    hashtags TEXT[],
    cta TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Calendar Entries Table
CREATE TABLE IF NOT EXISTS public.calendar_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES public.daily_topics ON DELETE SET NULL,
    draft_id UUID REFERENCES public.saved_drafts ON DELETE CASCADE,
    platform TEXT,
    scheduled_date TEXT NOT NULL,
    custom_title TEXT,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notification Settings Table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    delivery_time TEXT DEFAULT '07:00' NOT NULL,
    whatsapp_number TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Safe Creation)
DO $$ 
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;

    -- Daily Topics
    -- Drop old global policy if it exists to replace with user-specific one
    DROP POLICY IF EXISTS "Authenticated users can view daily topics" ON public.daily_topics;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_topics' AND policyname = 'Users can manage own daily topics') THEN
        CREATE POLICY "Users can manage own daily topics" ON public.daily_topics FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Saved Topics
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_topics' AND policyname = 'Users can manage own saved topics') THEN
        CREATE POLICY "Users can manage own saved topics" ON public.saved_topics FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Saved Drafts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_drafts' AND policyname = 'Users can manage own drafts') THEN
        CREATE POLICY "Users can manage own drafts" ON public.saved_drafts FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Calendar Entries
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_entries' AND policyname = 'Users can manage own calendar') THEN
        CREATE POLICY "Users can manage own calendar" ON public.calendar_entries FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Notification Settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_settings' AND policyname = 'Users can manage own notification settings') THEN
        CREATE POLICY "Users can manage own notification settings" ON public.notification_settings FOR ALL USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_settings' AND policyname = 'Users can insert own notification settings') THEN
        CREATE POLICY "Users can insert own notification settings" ON public.notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 8. Functions and Triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Notification Settings Trigger
DROP TRIGGER IF EXISTS set_notification_settings_updated_at ON public.notification_settings;
CREATE TRIGGER set_notification_settings_updated_at 
    BEFORE UPDATE ON public.notification_settings 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Auth Trigger Function (with recursive insert handling)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        whatsapp_number, 
        niche, 
        selected_platforms
    )
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'whatsapp_number',
        COALESCE(NEW.raw_user_meta_data->>'niche', 'Other'),
        (SELECT ARRAY_AGG(x) FROM jsonb_array_elements_text(NEW.raw_user_meta_data->'selected_platforms') x)
    )
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.notification_settings (user_id, whatsapp_number)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'whatsapp_number')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Global Auth Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
