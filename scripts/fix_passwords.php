<?php
/**
 * Script to fix password hashes for all students and teacher
 * Run this via browser: http://localhost:8001/scripts/fix_passwords.php
 * Or via command line: php scripts/fix_passwords.php
 */

require_once __DIR__ . '/../api/database.php';
require_once __DIR__ . '/../api/env_loader.php';

try {
    $db = Database::getInstance()->getConnection();
    
    echo "<h2>Fixing Password Hashes</h2>\n";
    echo "<pre>\n";
    
    // Generate proper password hash for 'password123'
    $passwordHash = password_hash('password123', PASSWORD_DEFAULT);
    echo "✅ Generated new password hash for 'password123'\n";
    echo "   Hash: " . substr($passwordHash, 0, 30) . "...\n\n";
    
    // List of users to update
    $users = [
        'kenshee@unicon.edu',
        'rahma@unicon.edu',
        'brenn@unicon.edu',
        'alex@unicon.edu',
        'archievald.ranay@unicon.edu'
    ];
    
    $updateStmt = $db->prepare("
        UPDATE users 
        SET password_hash = ? 
        WHERE email = ?
    ");
    
    $updated = 0;
    foreach ($users as $email) {
        $updateStmt->execute([$passwordHash, $email]);
        if ($updateStmt->rowCount() > 0) {
            $updated++;
            echo "✅ Updated password for: {$email}\n";
        } else {
            echo "⚠️  User not found: {$email}\n";
        }
    }
    
    echo "\n📊 Summary:\n";
    echo "   • Updated: {$updated} users\n";
    
    // Verify passwords work
    echo "\n🔍 Verifying passwords:\n";
    $verifyStmt = $db->prepare("SELECT email, password_hash FROM users WHERE email = ?");
    foreach ($users as $email) {
        $verifyStmt->execute([$email]);
        $user = $verifyStmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $matches = password_verify('password123', $user['password_hash']);
            echo "   " . ($matches ? "✅" : "❌") . " {$email}: " . ($matches ? "Password matches!" : "Password does NOT match!") . "\n";
        }
    }
    
    echo "\n✅ Done! All users can now login with:\n";
    echo "   Password: password123\n";
    
    echo "</pre>\n";
    
} catch (Exception $e) {
    echo "<pre>\n";
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "</pre>\n";
    http_response_code(500);
}

