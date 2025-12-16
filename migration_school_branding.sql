-- Migration: School Branding System
-- Run this SQL to add branding tables

USE unicon_saas;

-- School branding table (1 row per school)
CREATE TABLE IF NOT EXISTS school_branding (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL UNIQUE,
    -- Logo and assets
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    login_background_url VARCHAR(500),
    header_background_url VARCHAR(500),
    -- Colors
    primary_color VARCHAR(7) DEFAULT '#1D4E89',
    secondary_color VARCHAR(7) DEFAULT '#3B82F6',
    background_color VARCHAR(7) DEFAULT '#FFFFFF',
    text_color VARCHAR(7) DEFAULT '#1F2937',
    accent_color VARCHAR(7) DEFAULT '#10B981',
    -- Typography
    font_family VARCHAR(100) DEFAULT 'Inter',
    heading_font_weight VARCHAR(20) DEFAULT '700',
    body_font_weight VARCHAR(20) DEFAULT '400',
    base_font_size VARCHAR(10) DEFAULT '16px',
    -- Theme
    theme_mode ENUM('light', 'dark', 'auto') DEFAULT 'light',
    -- Metadata
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id),
    INDEX idx_is_active (is_active)
);

-- School branding versions (for history and rollback)
CREATE TABLE IF NOT EXISTS school_branding_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    version INT NOT NULL,
    -- Store full branding snapshot as JSON
    branding_data JSON NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_school_version (school_id, version)
);

-- Update schools table if needed (add branding-related columns if missing)
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS branding_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS branding_updated_at TIMESTAMP NULL;

-- Create default branding for existing schools
INSERT INTO school_branding (school_id, primary_color, secondary_color, font_family)
SELECT id, '#1D4E89', '#3B82F6', 'Inter'
FROM schools
WHERE id NOT IN (SELECT school_id FROM school_branding)
ON DUPLICATE KEY UPDATE school_id = school_id;
