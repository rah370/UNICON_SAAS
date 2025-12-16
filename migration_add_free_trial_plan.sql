-- Migration: Add free_trial plan option
-- Run this SQL to add free_trial to plan ENUMs

USE unicon_saas;

-- Update schools table to include free_trial
ALTER TABLE schools 
MODIFY COLUMN plan ENUM('free_trial', 'basic', 'pro', 'premium') DEFAULT 'free_trial';

-- Update subscriptions table to include free_trial
ALTER TABLE subscriptions 
MODIFY COLUMN plan ENUM('free_trial', 'basic', 'pro', 'premium') NOT NULL DEFAULT 'free_trial';

-- Add trial_end_date column to subscriptions for tracking trial expiration
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP NULL AFTER status,
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP NULL AFTER trial_end_date;

-- Set trial dates for existing free_trial subscriptions
UPDATE subscriptions 
SET trial_started_at = created_at, 
    trial_end_date = DATE_ADD(created_at, INTERVAL 30 DAY)
WHERE plan = 'free_trial' AND trial_started_at IS NULL;
