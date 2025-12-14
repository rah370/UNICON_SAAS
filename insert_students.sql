-- Insert 4 students for UNICON University
-- Password for all: password123
-- This hash is for 'password123' using PHP password_hash()

USE unicon_saas;

-- Ensure school exists (UNICON University with id=1)
INSERT INTO schools (id, name, domain, plan, primary_color, is_active) 
VALUES (1, 'UNICON University', 'unicon.edu', 'pro', '#1D4E89', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Insert 4 students
-- Password hash for 'password123': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, is_verified, is_active, year_level, major) VALUES 
(1, 'kenshee@unicon.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kenshee', 'Student', 'student', TRUE, TRUE, 'Sophomore', 'Computer Science'),
(1, 'rahma@unicon.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rahma', 'Student', 'student', TRUE, TRUE, 'Junior', 'Business Administration'),
(1, 'brenn@unicon.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Brenn', 'Student', 'student', TRUE, TRUE, 'Senior', 'Engineering'),
(1, 'alex@unicon.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex', 'Johnson', 'student', TRUE, TRUE, 'Freshman', 'Mathematics');

-- Display the created users
SELECT id, email, first_name, last_name, role, year_level, major 
FROM users 
WHERE email IN ('kenshee@unicon.edu', 'rahma@unicon.edu', 'brenn@unicon.edu', 'alex@unicon.edu');

