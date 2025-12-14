<?php
/**
 * Script to insert teacher Archievald Ranay into the database
 * Run this via browser: http://localhost:8001/scripts/insert_teacher.php
 * Or via command line: php scripts/insert_teacher.php
 */

require_once __DIR__ . '/../api/database.php';
require_once __DIR__ . '/../api/env_loader.php';

try {
    $db = Database::getInstance()->getConnection();
    
    echo "<h2>Inserting Teacher into Database</h2>\n";
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
    
    // Teacher details
    $email = 'archievald.ranay@unicon.edu';
    $firstName = 'Archievald';
    $lastName = 'Ranay';
    $role = 'teacher';
    
    // Check if teacher exists
    $checkStmt = $db->prepare("SELECT id, email, first_name, last_name, role FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    $exists = $checkStmt->fetch();
    
    // Insert or update teacher
    $insertStmt = $db->prepare("
        INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, is_verified, is_active) 
        VALUES (1, ?, ?, ?, ?, ?, TRUE, TRUE)
        ON DUPLICATE KEY UPDATE 
            first_name = VALUES(first_name),
            last_name = VALUES(last_name),
            role = VALUES(role),
            is_verified = TRUE,
            is_active = TRUE,
            password_hash = VALUES(password_hash)
    ");
    
    $insertStmt->execute([$email, $passwordHash, $firstName, $lastName, $role]);
    
    if ($exists) {
        echo "🔄 Updated: {$firstName} {$lastName} ({$email}) - Teacher\n";
    } else {
        echo "✅ Inserted: {$firstName} {$lastName} ({$email}) - Teacher\n";
    }
    
    // Display teacher info
    echo "\n👨‍🏫 Teacher Details:\n";
    $selectStmt = $db->prepare("
        SELECT id, email, first_name, last_name, role, is_verified, is_active 
        FROM users 
        WHERE email = ?
    ");
    $selectStmt->execute([$email]);
    $teacher = $selectStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($teacher) {
        echo "   • ID: {$teacher['id']}\n";
        echo "   • Name: {$teacher['first_name']} {$teacher['last_name']}\n";
        echo "   • Email: {$teacher['email']}\n";
        echo "   • Role: {$teacher['role']}\n";
        echo "   • Verified: " . ($teacher['is_verified'] ? 'Yes' : 'No') . "\n";
        echo "   • Active: " . ($teacher['is_active'] ? 'Yes' : 'No') . "\n";
    }
    
    echo "\n✅ Done! Teacher can now login with:\n";
    echo "   Email: {$email}\n";
    echo "   Password: password123\n";
    echo "\n💬 Teachers can message students and other teachers!\n";
    
    echo "</pre>\n";
    
} catch (Exception $e) {
    echo "<pre>\n";
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "</pre>\n";
    http_response_code(500);
}

