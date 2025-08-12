-- ReadMaker App - User Profile and Reading Preferences
-- Migration: 002_create_user_profiles.sql

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    UNIQUE(user_id, date)
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_reading_stats_user_id ON reading_stats(user_id);
CREATE INDEX idx_reading_stats_date ON reading_stats(date);
CREATE INDEX idx_reading_stats_user_date ON reading_stats(user_id, date);
CREATE INDEX idx_user_reading_preferences_user_id ON user_reading_preferences(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);

-- Trigger to automatically update updated_at for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at for reading_stats
CREATE TRIGGER update_reading_stats_updated_at 
    BEFORE UPDATE ON reading_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at for user_reading_preferences
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