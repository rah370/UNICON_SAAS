<?php
/**
 * Script to insert 4 students into the database
 * Run this via browser: http://localhost:8001/scripts/insert_students.php
 * Or via command line: php scripts/insert_students.php
 */

require_once __DIR__ . '/../api/database.php';
require_once __DIR__ . '/../api/env_loader.php';

try {
    $db = Database::getInstance()->getConnection();
    
    echo "<h2>Inserting Students into Database</h2>\n";
    echo "<pre>\n";
    
    // Ensure school exists
    $stmt = $db->prepare("
        INSERT INTO schools (id, name, domain, plan, primary_color, is_active) 
        VALUES (1, 'UNICON University', 'unicon.edu', 'pro', '#1D4E89', TRUE)
        ON DUPLICATE KEY UPDATE name=name
    ");
    $stmt->execute();
    echo "✅ School 'UNICON University' ensured\n";
    
    // Password hash for 'password123'
    $passwordHash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    // Students to insert
    $students = [
        ['kenshee@unicon.edu', 'Kenshee', 'Student', 'Sophomore', 'Computer Science'],
        ['rahma@unicon.edu', 'Rahma', 'Student', 'Junior', 'Business Administration'],
        ['brenn@unicon.edu', 'Brenn', 'Student', 'Senior', 'Engineering'],
        ['alex@unicon.edu', 'Alex', 'Johnson', 'Freshman', 'Mathematics']
    ];
    
    $insertStmt = $db->prepare("
        INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, is_verified, is_active, year_level, major) 
        VALUES (1, ?, ?, ?, ?, 'student', TRUE, TRUE, ?, ?)
        ON DUPLICATE KEY UPDATE 
            first_name = VALUES(first_name),
            last_name = VALUES(last_name),
            year_level = VALUES(year_level),
            major = VALUES(major),
            is_verified = TRUE,
            is_active = TRUE
    ");
    
    $inserted = 0;
    $updated = 0;
    
    foreach ($students as $student) {
        list($email, $firstName, $lastName, $year, $major) = $student;
        
        // Check if user exists
        $checkStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->execute([$email]);
        $exists = $checkStmt->fetch();
        
        $insertStmt->execute([$email, $passwordHash, $firstName, $lastName, $year, $major]);
        
        if ($exists) {
            $updated++;
            echo "🔄 Updated: {$firstName} {$lastName} ({$email})\n";
        } else {
            $inserted++;
            echo "✅ Inserted: {$firstName} {$lastName} ({$email})\n";
        }
    }
    
    echo "\n📊 Summary:\n";
    echo "   • Inserted: {$inserted} new students\n";
    echo "   • Updated: {$updated} existing students\n";
    echo "   • Total: " . count($students) . " students\n";
    
    // Display all students
    echo "\n👥 All Students:\n";
    $selectStmt = $db->prepare("
        SELECT id, email, first_name, last_name, role, year_level, major 
        FROM users 
        WHERE email IN ('kenshee@unicon.edu', 'rahma@unicon.edu', 'brenn@unicon.edu', 'alex@unicon.edu')
        ORDER BY first_name
    ");
    $selectStmt->execute();
    $users = $selectStmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "   • {$user['first_name']} {$user['last_name']} ({$user['email']}) - {$user['year_level']}, {$user['major']}\n";
    }
    
    echo "\n✅ Done! Students can now login with:\n";
    echo "   Email: kenshee@unicon.edu, rahma@unicon.edu, brenn@unicon.edu, or alex@unicon.edu\n";
    echo "   Password: password123\n";
    
    echo "</pre>\n";
    
} catch (Exception $e) {
    echo "<pre>\n";
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "</pre>\n";
    http_response_code(500);
}

