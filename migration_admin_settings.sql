-- Migration: Add admin settings columns to schools table
-- Run this SQL to add the necessary columns for admin settings

USE unicon_saas;

-- Add settings columns to schools table
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC' AFTER logo_url,
ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English' AFTER timezone,
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE AFTER language,
ADD COLUMN IF NOT EXISTS allow_student_posts BOOLEAN DEFAULT TRUE AFTER maintenance_mode,
ADD COLUMN IF NOT EXISTS require_email_verification BOOLEAN DEFAULT TRUE AFTER allow_student_posts,
ADD COLUMN IF NOT EXISTS auto_moderation BOOLEAN DEFAULT FALSE AFTER require_email_verification,
ADD COLUMN IF NOT EXISTS max_file_size_mb INT DEFAULT 10 AFTER auto_moderation,
ADD COLUMN IF NOT EXISTS allowed_file_types VARCHAR(255) DEFAULT 'jpg,png,pdf,doc' AFTER max_file_size_mb,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE AFTER allowed_file_types,
ADD COLUMN IF NOT EXISTS email_alerts_enabled BOOLEAN DEFAULT TRUE AFTER notifications_enabled,
ADD COLUMN IF NOT EXISTS settings_json TEXT AFTER email_alerts_enabled;

-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_school_created (school_id, created_at),
    INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

