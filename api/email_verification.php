<?php
// Email Verification System
require_once 'database.php';

class EmailVerification {
    private $db;
    private $smtpHost = 'smtp.gmail.com';
    private $smtpPort = 587;
    private $smtpUsername = 'your-email@gmail.com'; // Replace with actual email
    private $smtpPassword = 'your-app-password'; // Replace with actual app password
    private $fromEmail = 'noreply@unicon.edu';
    private $fromName = 'UNICON Platform';
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    // Send verification email
    public function sendVerificationEmail($userId, $email, $firstName) {
        try {
            // Generate verification token
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 hours
            
            // Store verification token
            $this->db->query(
                "INSERT INTO email_verifications (user_id, email, token, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?",
                [$userId, $email, $token, $expiresAt, $token, $expiresAt]
            );
            
            // Prepare email content
            $verificationUrl = "http://localhost:3000/verify-email?token=" . $token;
            $subject = "Verify Your UNICON Account";
            $message = $this->getVerificationEmailTemplate($firstName, $verificationUrl);
            
            // Send email
            $result = $this->sendEmail($email, $firstName, $subject, $message);
            
            if ($result) {
                return ['success' => true, 'message' => 'Verification email sent'];
            } else {
                return ['success' => false, 'error' => 'Failed to send verification email'];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Email verification failed: ' . $e->getMessage()];
        }
    }
    
    // Verify email token
    public function verifyEmail($token) {
        try {
            $verification = $this->db->fetch(
                "SELECT * FROM email_verifications WHERE token = ? AND expires_at > NOW()",
                [$token]
            );
            
            if (!$verification) {
                return ['success' => false, 'error' => 'Invalid or expired verification token'];
            }
            
            // Update user verification status
            $this->db->query(
                "UPDATE users SET is_verified = 1 WHERE id = ?",
                [$verification['user_id']]
            );
            
            // Delete verification token
            $this->db->query(
                "DELETE FROM email_verifications WHERE token = ?",
                [$token]
            );
            
            return ['success' => true, 'message' => 'Email verified successfully'];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Email verification failed: ' . $e->getMessage()];
        }
    }
    
    // Send password reset email
    public function sendPasswordResetEmail($email) {
        try {
            $user = $this->db->fetch(
                "SELECT id, first_name, last_name FROM users WHERE email = ? AND is_active = 1",
                [$email]
            );
            
            if (!$user) {
                return ['success' => false, 'error' => 'User not found'];
            }
            
            // Generate reset token
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', time() + (60 * 60)); // 1 hour
            
            // Store reset token
            $this->db->query(
                "INSERT INTO password_resets (user_id, email, token, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?",
                [$user['id'], $email, $token, $expiresAt, $token, $expiresAt]
            );
            
            // Prepare email content
            $resetUrl = "http://localhost:3000/reset-password?token=" . $token;
            $subject = "Reset Your UNICON Password";
            $message = $this->getPasswordResetEmailTemplate($user['first_name'], $resetUrl);
            
            // Send email
            $result = $this->sendEmail($email, $user['first_name'], $subject, $message);
            
            if ($result) {
                return ['success' => true, 'message' => 'Password reset email sent'];
            } else {
                return ['success' => false, 'error' => 'Failed to send password reset email'];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Password reset failed: ' . $e->getMessage()];
        }
    }
    
    // Reset password
    public function resetPassword($token, $newPassword) {
        try {
            $reset = $this->db->fetch(
                "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
                [$token]
            );
            
            if (!$reset) {
                return ['success' => false, 'error' => 'Invalid or expired reset token'];
            }
            
            // Update password
            $this->db->query(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                [password_hash($newPassword, PASSWORD_DEFAULT), $reset['user_id']]
            );
            
            // Delete reset token
            $this->db->query(
                "DELETE FROM password_resets WHERE token = ?",
                [$token]
            );
            
            return ['success' => true, 'message' => 'Password reset successfully'];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Password reset failed: ' . $e->getMessage()];
        }
    }
    
    private function sendEmail($to, $name, $subject, $message) {
        try {
            // Use PHPMailer or similar library in production
            // For now, we'll use a simple mail() function
            $headers = [
                'From: ' . $this->fromName . ' <' . $this->fromEmail . '>',
                'Reply-To: ' . $this->fromEmail,
                'Content-Type: text/html; charset=UTF-8',
                'X-Mailer: PHP/' . phpversion()
            ];
            
            return mail($to, $subject, $message, implode("\r\n", $headers));
            
        } catch (Exception $e) {
            return false;
        }
    }
    
    private function getVerificationEmailTemplate($firstName, $verificationUrl) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Verify Your Account</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1D4E89; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 24px; background: #1D4E89; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Welcome to UNICON!</h1>
                </div>
                <div class='content'>
                    <h2>Hi " . htmlspecialchars($firstName) . ",</h2>
                    <p>Thank you for registering with UNICON. To complete your account setup, please verify your email address by clicking the button below:</p>
                    <a href='" . $verificationUrl . "' class='button'>Verify Email Address</a>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p><a href='" . $verificationUrl . "'>" . $verificationUrl . "</a></p>
                    <p>This verification link will expire in 24 hours.</p>
                    <p>If you didn't create an account with UNICON, please ignore this email.</p>
                </div>
                <div class='footer'>
                    <p>© " . date('Y') . " UNICON Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";
    }
    
    private function getPasswordResetEmailTemplate($firstName, $resetUrl) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Reset Your Password</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1D4E89; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 24px; background: #1D4E89; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Password Reset Request</h1>
                </div>
                <div class='content'>
                    <h2>Hi " . htmlspecialchars($firstName) . ",</h2>
                    <p>We received a request to reset your password for your UNICON account. Click the button below to reset your password:</p>
                    <a href='" . $resetUrl . "' class='button'>Reset Password</a>
                    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                    <p><a href='" . $resetUrl . "'>" . $resetUrl . "</a></p>
                    <p>This reset link will expire in 1 hour.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                </div>
                <div class='footer'>
                    <p>© " . date('Y') . " UNICON Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
?>
