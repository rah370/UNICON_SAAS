-- Migration: Add status field to marketplace_items table
-- This fixes the bug where is_sold was incorrectly used to track rejection status
-- Status field will track approval status: 'pending', 'approved', 'rejected'
-- is_sold will only be used to track actual sales

USE unicon_saas;

-- Add status field if it doesn't exist
ALTER TABLE marketplace_items 
ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' 
AFTER is_verified;

-- Set default status for existing items (assuming they were approved if not sold)
UPDATE marketplace_items 
SET status = CASE 
    WHEN is_sold = 1 THEN 'rejected'  -- Migrate existing rejected items (incorrectly marked as sold)
    ELSE 'approved'  -- Assume existing visible items were approved
END
WHERE status IS NULL OR status = 'pending';

-- Reset is_sold for items that were incorrectly marked as sold due to rejection
UPDATE marketplace_items 
SET is_sold = 0 
WHERE status = 'rejected' AND is_sold = 1;

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_items(school_id, status, is_sold);

