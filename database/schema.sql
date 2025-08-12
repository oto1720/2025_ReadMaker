-- ReadMaker App - Complete Database Schema
-- This file contains the complete database schema for the ReadMaker application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- AUTHENTICATION TABLES
-- ==============================================

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_check CHECK (LENGTH(username) >= 3 AND username ~* '^[A-Za-z0-9_-]+$')
);

-- User sessions table for session management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verification tokens table
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- USER PROFILE TABLES
-- ==============================================

-- User profiles table for additional user information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    date_of_birth DATE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_preference VARCHAR(10) DEFAULT 'ja',
    notification_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    reading_goal_daily INTEGER DEFAULT 30, -- minutes per day
    reading_goal_weekly INTEGER DEFAULT 210, -- minutes per week
    reading_streak_current INTEGER DEFAULT 0,
    reading_streak_longest INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_profiles_reading_goals_check CHECK (
        reading_goal_daily >= 0 AND reading_goal_weekly >= 0
    )
);

-- Reading statistics table
CREATE TABLE reading_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reading_time_minutes INTEGER DEFAULT 0,
    words_read INTEGER DEFAULT 0,
    articles_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date),
    
    -- Constraints
    CONSTRAINT reading_stats_positive_values CHECK (
        reading_time_minutes >= 0 AND words_read >= 0 AND articles_completed >= 0
    )
);

-- User preferences for reading settings
CREATE TABLE user_reading_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    font_size INTEGER DEFAULT 16,
    font_family VARCHAR(50) DEFAULT 'default',
    line_height DECIMAL(3,2) DEFAULT 1.5,
    text_alignment VARCHAR(20) DEFAULT 'left',
    theme VARCHAR(20) DEFAULT 'light', -- light, dark, sepia
    background_color VARCHAR(7) DEFAULT '#FFFFFF',
    text_color VARCHAR(7) DEFAULT '#000000',
    reading_speed_wpm INTEGER DEFAULT 200, -- words per minute
    auto_scroll_enabled BOOLEAN DEFAULT FALSE,
    auto_scroll_speed INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT reading_prefs_font_size_check CHECK (font_size BETWEEN 8 AND 72),
    CONSTRAINT reading_prefs_line_height_check CHECK (line_height BETWEEN 0.5 AND 3.0),
    CONSTRAINT reading_prefs_theme_check CHECK (theme IN ('light', 'dark', 'sepia')),
    CONSTRAINT reading_prefs_alignment_check CHECK (text_alignment IN ('left', 'center', 'right', 'justify')),
    CONSTRAINT reading_prefs_speed_check CHECK (reading_speed_wpm BETWEEN 50 AND 1000)
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'reading_streak', 'words_read', 'articles_completed', etc.
    achievement_value INTEGER NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type, achievement_value)
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);

-- Profile indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_reading_stats_user_id ON reading_stats(user_id);
CREATE INDEX idx_reading_stats_date ON reading_stats(date);
CREATE INDEX idx_reading_stats_user_date ON reading_stats(user_id, date);
CREATE INDEX idx_user_reading_preferences_user_id ON user_reading_preferences(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);

-- ==============================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_stats_updated_at 
    BEFORE UPDATE ON reading_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reading_preferences_updated_at 
    BEFORE UPDATE ON user_reading_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create default user profile
CREATE OR REPLACE FUNCTION create_default_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    INSERT INTO user_reading_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default profile when user is created
CREATE TRIGGER create_user_profile_on_user_creation
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_profile();

-- Clean up functions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
    DELETE FROM email_verification_tokens WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- Function to update reading streak
CREATE OR REPLACE FUNCTION update_reading_streak(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
    yesterday_stats INTEGER;
    current_streak INTEGER;
    longest_streak INTEGER;
BEGIN
    -- Check if user read yesterday
    SELECT reading_time_minutes INTO yesterday_stats
    FROM reading_stats 
    WHERE user_id = p_user_id AND date = p_date - INTERVAL '1 day';
    
    -- Get current streak
    SELECT reading_streak_current, reading_streak_longest 
    INTO current_streak, longest_streak
    FROM user_profiles 
    WHERE user_id = p_user_id;
    
    -- Update streak
    IF yesterday_stats > 0 OR current_streak = 0 THEN
        current_streak := current_streak + 1;
    ELSE
        current_streak := 1;
    END IF;
    
    -- Update longest streak if necessary
    IF current_streak > longest_streak THEN
        longest_streak := current_streak;
    END IF;
    
    -- Update user profile
    UPDATE user_profiles 
    SET reading_streak_current = current_streak,
        reading_streak_longest = longest_streak
    WHERE user_id = p_user_id;
END;
$$ language 'plpgsql';