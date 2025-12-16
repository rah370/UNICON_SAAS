<?php
// JWT Authentication Helper
require_once 'database.php';

class Auth {
    private $db;
    private $secretKey = 'unicon_saas_secret_key_2024'; // In production, use environment variable
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // Generate JWT token
    public function generateToken($userId, $email, $role, $schoolId) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $userId,
            'email' => $email,
            'role' => $role,
            'school_id' => $schoolId,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secretKey, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    // Verify JWT token
    public function verifyToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secretKey, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if (!hash_equals($expectedSignature, $base64Signature)) {
            return false;
        }
        
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64Payload)), true);
        
        if ($payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    // Authenticate user
    public function authenticate($email, $password, $schoolId = null) {
        try {
            $sql = "SELECT u.*, s.name as school_name, s.domain as school_domain 
                    FROM users u 
                    JOIN schools s ON u.school_id = s.id 
                    WHERE u.email = ? AND u.is_active = 1";
            
            if ($schoolId) {
                $sql .= " AND u.school_id = ?";
                $user = $this->db->fetch($sql, [$email, $schoolId]);
            } else {
                $user = $this->db->fetch($sql, [$email]);
            }
            
            if (!$user || !password_verify($password, $user['password_hash'])) {
                return ['success' => false, 'error' => 'Invalid credentials'];
            }
            
            // Update last login
            $this->db->query(
                "UPDATE users SET last_login = NOW() WHERE id = ?", 
                [$user['id']]
            );
            
            // Generate token
            $token = $this->generateToken(
                $user['id'], 
                $user['email'], 
                $user['role'], 
                $user['school_id']
            );
            
            // Store session
            $this->storeSession($user['id'], $token);
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'role' => $user['role'],
                    'school_id' => $user['school_id'],
                    'school_name' => $user['school_name'],
                    'avatar_url' => $user['avatar_url']
                ],
                'token' => $token
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Authentication failed'];
        }
    }
    
    // Register new user
    public function register($userData) {
        try {
            $this->db->getConnection()->beginTransaction();
            
            // Check if school exists or create new one
            $school = $this->db->fetch(
                "SELECT id FROM schools WHERE domain = ? OR name = ?", 
                [$userData['domain'] ?? '', $userData['school_name']]
            );
            
            // Normalize plan name (convert "Free Trial" to "free_trial")
            $plan = strtolower(str_replace(' ', '_', $userData['plan'] ?? 'free_trial'));
            if (!in_array($plan, ['free_trial', 'basic', 'pro', 'premium'])) {
                $plan = 'free_trial'; // Default to free_trial if invalid
            }
            
            if (!$school) {
                $schoolId = $this->db->query(
                    "INSERT INTO schools (name, domain, plan, primary_color, logo_url) VALUES (?, ?, ?, ?, ?)",
                    [
                        $userData['school_name'],
                        $userData['domain'] ?? null,
                        $plan,
                        $userData['primary_color'] ?? '#1D4E89',
                        $userData['logo_url'] ?? null
                    ]
                );
                $schoolId = $this->db->lastInsertId();
            } else {
                $schoolId = $school['id'];
            }
            
            // Check if user already exists
            $existingUser = $this->db->fetch(
                "SELECT id FROM users WHERE email = ? AND school_id = ?", 
                [$userData['email'], $schoolId]
            );
            
            if ($existingUser) {
                return ['success' => false, 'error' => 'User already exists'];
            }
            
            // Create user
            $userId = $this->db->query(
                "INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, year_level, major) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $schoolId,
                    $userData['email'],
                    password_hash($userData['password'], PASSWORD_DEFAULT),
                    $userData['first_name'],
                    $userData['last_name'],
                    $userData['role'] ?? 'student',
                    $userData['year_level'] ?? null,
                    $userData['major'] ?? null
                ]
            );
            $userId = $this->db->lastInsertId();
            
            // Create subscription with trial dates for free_trial plan
            if ($plan === 'free_trial') {
                $trialStart = date('Y-m-d H:i:s');
                $trialEnd = date('Y-m-d H:i:s', strtotime('+30 days'));
                $this->db->query(
                    "INSERT INTO subscriptions (school_id, plan, status, trial_started_at, trial_end_date) VALUES (?, ?, 'active', ?, ?)",
                    [$schoolId, $plan, $trialStart, $trialEnd]
                );
            } else {
                $this->db->query(
                    "INSERT INTO subscriptions (school_id, plan, status) VALUES (?, ?, 'active')",
                    [$schoolId, $plan]
                );
            }
            
            // Create default branding for the school
            $primaryColor = $userData['primary_color'] ?? '#1D4E89';
            $logoUrl = $userData['logo_url'] ?? null;
            
            $this->db->query(
                "INSERT INTO school_branding (
                    school_id, 
                    primary_color, 
                    secondary_color, 
                    background_color, 
                    text_color, 
                    accent_color,
                    font_family,
                    heading_font_weight,
                    body_font_weight,
                    base_font_size,
                    theme_mode,
                    logo_url,
                    version,
                    is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
                ON DUPLICATE KEY UPDATE school_id = school_id",
                [
                    $schoolId,
                    $primaryColor,
                    $userData['secondary_color'] ?? '#3B82F6',
                    $userData['background_color'] ?? '#FFFFFF',
                    $userData['text_color'] ?? '#1F2937',
                    $userData['accent_color'] ?? '#10B981',
                    $userData['font_family'] ?? 'Inter',
                    $userData['heading_font_weight'] ?? '700',
                    $userData['body_font_weight'] ?? '400',
                    $userData['base_font_size'] ?? '16px',
                    $userData['theme_mode'] ?? 'light',
                    $logoUrl
                ]
            );
            
            $this->db->getConnection()->commit();
            
            return ['success' => true, 'user_id' => $userId, 'school_id' => $schoolId];
            
        } catch (Exception $e) {
            $this->db->getConnection()->rollBack();
            return ['success' => false, 'error' => 'Registration failed: ' . $e->getMessage()];
        }
    }
    
    // Store user session
    private function storeSession($userId, $token) {
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', time() + (24 * 60 * 60));
        
        $this->db->query(
            "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
            [$userId, $tokenHash, $expiresAt]
        );
    }
    
    // Get current user from token
    public function getCurrentUser($token) {
        $payload = $this->verifyToken($token);
        if (!$payload) {
            return null;
        }
        
        $user = $this->db->fetch(
            "SELECT u.*, s.name as school_name, s.domain as school_domain, s.primary_color, s.logo_url as school_logo
             FROM users u 
             JOIN schools s ON u.school_id = s.id 
             WHERE u.id = ? AND u.is_active = 1",
            [$payload['user_id']]
        );
        
        return $user ? array_merge($user, $payload) : null;
    }
    
    // Logout user
    public function logout($token) {
        $tokenHash = hash('sha256', $token);
        $this->db->query(
            "DELETE FROM user_sessions WHERE token_hash = ?",
            [$tokenHash]
        );
        return ['success' => true];
    }
}
?>
