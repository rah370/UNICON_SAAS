<?php
/**
 * Reset or create demo users (admin and student) for local development.
 *
 * Usage (from project root):
 *   php scripts/reset_demo_users.php
 *
 * This script uses the existing `api/database.php` Database class to insert
 * or update a demo school and two demo users. Passwords are hashed with
 * PHP's password_hash() and set to known values so you can use the
 * existing `api/auth.php` login flow.
 */

require_once __DIR__ . '/../api/database.php';

try {
    $db = Database::getInstance();

    // Ensure a demo school exists (id will be returned)
    $school = $db->fetch("SELECT id FROM schools WHERE domain = ? OR name = ?", ['demo.local', 'Demo School']);
    if ($school) {
        $schoolId = $school['id'];
        echo "Using existing school id={$schoolId}\n";
    } else {
        $db->query("INSERT INTO schools (name, domain, plan, primary_color, created_at, updated_at) VALUES (?, ?, 'basic', '#1D4E89', NOW(), NOW())", ['Demo School', 'demo.local']);
        $schoolId = $db->lastInsertId();
        echo "Created demo school id={$schoolId}\n";
    }

    // Demo accounts and desired passwords
    $demoUsers = [
        ['email' => 'admin@demo.local', 'first' => 'Demo', 'last' => 'Admin', 'role' => 'admin', 'password' => 'AdminDemo123!'],
        ['email' => 'student@demo.local', 'first' => 'Demo', 'last' => 'Student', 'role' => 'student', 'password' => 'StudentDemo123!'],
    ];

    foreach ($demoUsers as $u) {
        $existing = $db->fetch("SELECT id FROM users WHERE email = ? AND school_id = ?", [$u['email'], $schoolId]);
        $hash = password_hash($u['password'], PASSWORD_DEFAULT);

        if ($existing) {
            $db->query("UPDATE users SET password_hash = ?, first_name = ?, last_name = ?, role = ?, is_active = 1, updated_at = NOW() WHERE id = ?", [$hash, $u['first'], $u['last'], $u['role'], $existing['id']]);
            echo "Updated user {$u['email']} (id={$existing['id']}) with password {$u['password']}\n";
        } else {
            $db->query("INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, is_verified, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())", [$schoolId, $u['email'], $hash, $u['first'], $u['last'], $u['role']]);
            $newId = $db->lastInsertId();
            echo "Created user {$u['email']} (id={$newId}) with password {$u['password']}\n";
        }
    }

    echo "\nDemo users are ready. Use these credentials to log in via /api/auth/login:\n";
    foreach ($demoUsers as $u) {
        echo " - {$u['email']} / {$u['password']}\n";
    }

    echo "\nRun (from project root): php scripts/reset_demo_users.php\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

?>
