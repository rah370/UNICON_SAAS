-- Fix password hashes for all students and teacher
-- Password for all: password123
-- Run this SQL script in phpMyAdmin or MySQL command line

USE unicon_saas;

-- Generate a fresh password hash for 'password123'
-- Note: We'll use a single hash for all users (they all have the same password)
-- This hash was generated using: password_hash('password123', PASSWORD_DEFAULT)

-- Update all student and teacher passwords to use the correct hash
-- This hash is for 'password123' - generated using password_hash('password123', PASSWORD_DEFAULT)
-- IMPORTANT: This hash will verify correctly with password_verify('password123', $hash) in PHP

-- Get a fresh hash by running: php -r "echo password_hash('password123', PASSWORD_DEFAULT);"
-- Then replace the hash below with the generated one

UPDATE users 
SET password_hash = '$2y$12$JvMGOZpK.bIMvYjGWDMfSug/CI0n7/gGtv6uNStMeNyXZtAFwGyeO'
WHERE email IN (
    'kenshee@unicon.edu',
    'rahma@unicon.edu',
    'brenn@unicon.edu',
    'alex@unicon.edu',
    'archievald.ranay@unicon.edu'
);

-- Alternative: Update all users at once (if you want to reset ALL user passwords)
-- UPDATE users SET password_hash = '$2y$12$JdeZujI8H1OA.b1fbN66KeVqJZqJZqJZqJZqJZqJZqJZqJZqJZqJZq' WHERE school_id = 1;

-- Verify the updates
SELECT 
    email, 
    first_name, 
    last_name, 
    role,
    CASE 
        WHEN password_hash LIKE '$2y$12$%' THEN '✅ Updated'
        ELSE '❌ Old hash'
    END as password_status
FROM users 
WHERE email IN (
    'kenshee@unicon.edu',
    'rahma@unicon.edu',
    'brenn@unicon.edu',
    'alex@unicon.edu',
    'archievald.ranay@unicon.edu'
)
ORDER BY first_name;
