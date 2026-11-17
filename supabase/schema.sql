-- ==============================================================================
-- GURUSTUDY DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production Ready Schema for CBSE Class 10 NCERT Study Planner & Smart Alarms
-- URL: https://gurustudy.webguruji.online
-- Created by HarshGuruJi (contact@webguruji.online)
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Class 10 Student',
    school_name TEXT DEFAULT '',
    target_percentage INT DEFAULT 95 CHECK (target_percentage >= 50 AND target_percentage <= 100),
    medium TEXT NOT NULL DEFAULT 'English' CHECK (medium IN ('English', 'Hindi')),
    second_language TEXT NOT NULL DEFAULT 'Hindi Course A' CHECK (second_language IN ('Hindi Course A', 'Hindi Course B', 'English Core focus')),
    daily_start_time TIME NOT NULL DEFAULT '16:00:00',
    ai_sunday_enabled BOOLEAN NOT NULL DEFAULT true,
    streak_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. DAILY LOGS TABLE (88 Days: 2026-11-20 to 2027-02-15)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    study_date DATE NOT NULL CHECK (study_date >= '2026-11-20' AND study_date <= '2027-02-15'),
    day_type TEXT NOT NULL CHECK (day_type IN ('working', 'sunday')),
    maths_mins INT NOT NULL DEFAULT 0,
    science_mins INT NOT NULL DEFAULT 0,
    sst_mins INT NOT NULL DEFAULT 0,
    lang_mins INT NOT NULL DEFAULT 0,
    ai_mins INT NOT NULL DEFAULT 0,
    target_mins INT NOT NULL DEFAULT 300, -- 300 for Mon-Sat, 390 for Sunday
    is_completed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, study_date)
);

-- ------------------------------------------------------------------------------
-- 3. NCERT SYLLABUS PROGRESS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ncert_syllabus_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL CHECK (subject IN ('Maths', 'Science', 'SST', 'English', 'Hindi', 'AI')),
    chapter_number INT NOT NULL,
    chapter_name TEXT NOT NULL,
    ncert_reading BOOLEAN NOT NULL DEFAULT false,
    ncert_exercises BOOLEAN NOT NULL DEFAULT false,
    pyq_solved BOOLEAN NOT NULL DEFAULT false,
    revision_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, subject, chapter_number)
);

-- ------------------------------------------------------------------------------
-- 4. ALARM SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alarm_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_mins INT NOT NULL,
    voice_prompt TEXT DEFAULT '',
    ringtone TEXT NOT NULL DEFAULT 'Morning Bell',
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, subject)
);

-- ------------------------------------------------------------------------------
-- 5. SUNDAY MOCK TEST SCORES TABLE (Prompt 7)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sunday_mock_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_week INT NOT NULL CHECK (test_week >= 1 AND test_week <= 13),
    test_date DATE NOT NULL,
    subject TEXT NOT NULL,
    marks_scored NUMERIC(5,2) NOT NULL,
    max_marks INT NOT NULL DEFAULT 80,
    percentage NUMERIC(5,2) GENERATED ALWAYS AS (ROUND((marks_scored / max_marks) * 100, 2)) STORED,
    grade_prediction TEXT DEFAULT 'A1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, test_week, subject)
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ncert_syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alarm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_mock_scores ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Daily Logs: User scoped
CREATE POLICY "Users can manage own daily logs"
    ON public.daily_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Syllabus Progress: User scoped
CREATE POLICY "Users can manage own syllabus progress"
    ON public.ncert_syllabus_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Alarm Settings: User scoped
CREATE POLICY "Users can manage own alarm settings"
    ON public.alarm_settings FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Sunday Mock Scores: User scoped
CREATE POLICY "Users can manage own mock scores"
    ON public.sunday_mock_scores FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Class 10 Student'),
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
