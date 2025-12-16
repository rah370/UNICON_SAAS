<?php
// School Branding Management
require_once 'database.php';
require_once 'auth.php';
require_once 'file_upload.php';

class SchoolBranding {
    private $db;
    private $fileUpload;
    
    // Approved font families
    private $approvedFonts = [
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
        'Poppins', 'Raleway', 'Nunito', 'Source Sans Pro', 'Ubuntu',
        'Playfair Display', 'Merriweather', 'Crimson Text', 'Lora'
    ];
    
    // Cache for branding (in-memory, could be replaced with Redis)
    private static $brandingCache = [];
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->fileUpload = new FileUpload();
    }
    
    /**
     * Get branding for a school
     */
    public function getBranding($schoolId) {
        // Check if table exists first
        try {
            $tableExists = $this->db->fetch(
                "SELECT COUNT(*) as count FROM information_schema.tables 
                 WHERE table_schema = DATABASE() AND table_name = 'school_branding'"
            );
            
            if (!$tableExists || $tableExists['count'] == 0) {
                // Table doesn't exist, return null branding
                return [
                    'success' => true,
                    'branding' => null
                ];
            }
        } catch (Exception $e) {
            // If we can't check, assume table doesn't exist
            return [
                'success' => true,
                'branding' => null
            ];
        }
        
        // Check cache first
        $cacheKey = "branding_{$schoolId}";
        if (isset(self::$brandingCache[$cacheKey])) {
            return self::$brandingCache[$cacheKey];
        }
        
        try {
            $branding = $this->db->fetch(
                "SELECT * FROM school_branding WHERE school_id = ? AND is_active = 1",
                [$schoolId]
            );
            
            if (!$branding) {
                // Create default branding if doesn't exist
                $this->createDefaultBranding($schoolId);
                $branding = $this->db->fetch(
                    "SELECT * FROM school_branding WHERE school_id = ? AND is_active = 1",
                    [$schoolId]
                );
            }
            
            // Format response
            $result = [
                'success' => true,
                'branding' => $branding ? $this->formatBrandingResponse($branding) : null
            ];
            
            // Cache it
            self::$brandingCache[$cacheKey] = $result;
            
            return $result;
        } catch (Exception $e) {
            // If table doesn't exist or other error, return null branding
            return [
                'success' => true,
                'branding' => null
            ];
        }
    }
    
    /**
     * Update branding for a school
     */
    public function updateBranding($schoolId, $brandingData, $userId) {
        // Validate user has permission
        $user = $this->db->fetch(
            "SELECT role, school_id FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user || ($user['school_id'] != $schoolId && !in_array($user['role'], ['super_admin', 'admin']))) {
            return ['success' => false, 'error' => 'Unauthorized'];
        }
        
        // Get current branding
        $current = $this->db->fetch(
            "SELECT * FROM school_branding WHERE school_id = ?",
            [$schoolId]
        );
        
        if (!$current) {
            $this->createDefaultBranding($schoolId);
            $current = $this->db->fetch(
                "SELECT * FROM school_branding WHERE school_id = ?",
                [$schoolId]
            );
        }
        
        // Validate inputs
        $validation = $this->validateBrandingData($brandingData);
        if (!$validation['valid']) {
            return ['success' => false, 'error' => $validation['error']];
        }
        
        // Save current version for history
        $this->saveBrandingVersion($schoolId, $current['version'], $current, $userId);
        
        // Prepare update data
        $updateData = [];
        $updateParams = [];
        
        // Colors
        if (isset($brandingData['primary_color'])) {
            $updateData[] = "primary_color = ?";
            $updateParams[] = $brandingData['primary_color'];
        }
        if (isset($brandingData['secondary_color'])) {
            $updateData[] = "secondary_color = ?";
            $updateParams[] = $brandingData['secondary_color'];
        }
        if (isset($brandingData['background_color'])) {
            $updateData[] = "background_color = ?";
            $updateParams[] = $brandingData['background_color'];
        }
        if (isset($brandingData['text_color'])) {
            $updateData[] = "text_color = ?";
            $updateParams[] = $brandingData['text_color'];
        }
        if (isset($brandingData['accent_color'])) {
            $updateData[] = "accent_color = ?";
            $updateParams[] = $brandingData['accent_color'];
        }
        
        // Typography
        if (isset($brandingData['font_family'])) {
            $updateData[] = "font_family = ?";
            $updateParams[] = $brandingData['font_family'];
        }
        if (isset($brandingData['heading_font_weight'])) {
            $updateData[] = "heading_font_weight = ?";
            $updateParams[] = $brandingData['heading_font_weight'];
        }
        if (isset($brandingData['body_font_weight'])) {
            $updateData[] = "body_font_weight = ?";
            $updateParams[] = $brandingData['body_font_weight'];
        }
        if (isset($brandingData['base_font_size'])) {
            $updateData[] = "base_font_size = ?";
            $updateParams[] = $brandingData['base_font_size'];
        }
        
        // Theme
        if (isset($brandingData['theme_mode'])) {
            $updateData[] = "theme_mode = ?";
            $updateParams[] = $brandingData['theme_mode'];
        }
        
        // Assets (URLs)
        if (isset($brandingData['logo_url'])) {
            $updateData[] = "logo_url = ?";
            $updateParams[] = $brandingData['logo_url'];
        }
        if (isset($brandingData['favicon_url'])) {
            $updateData[] = "favicon_url = ?";
            $updateParams[] = $brandingData['favicon_url'];
        }
        if (isset($brandingData['login_background_url'])) {
            $updateData[] = "login_background_url = ?";
            $updateParams[] = $brandingData['login_background_url'];
        }
        if (isset($brandingData['header_background_url'])) {
            $updateData[] = "header_background_url = ?";
            $updateParams[] = $brandingData['header_background_url'];
        }
        
        // Increment version
        $newVersion = $current['version'] + 1;
        $updateData[] = "version = ?";
        $updateParams[] = $newVersion;
        
        $updateParams[] = $schoolId;
        
        // Update branding
        $sql = "UPDATE school_branding SET " . implode(', ', $updateData) . " WHERE school_id = ?";
        $this->db->query($sql, $updateParams);
        
        // Update schools table
        $this->db->query(
            "UPDATE schools SET branding_updated_at = NOW() WHERE id = ?",
            [$schoolId]
        );
        
        // Clear cache
        $this->clearBrandingCache($schoolId);
        
        // Get updated branding
        $updated = $this->getBranding($schoolId);
        
        return [
            'success' => true,
            'message' => 'Branding updated successfully',
            'branding' => $updated['branding']
        ];
    }
    
    /**
     * Upload logo for a school
     */
    public function uploadLogo($schoolId, $file, $userId) {
        // Validate permission
        $user = $this->db->fetch(
            "SELECT role, school_id FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user || ($user['school_id'] != $schoolId && !in_array($user['role'], ['super_admin', 'admin']))) {
            return ['success' => false, 'error' => 'Unauthorized'];
        }
        
        // Validate file type and size
        $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        $maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!in_array($file['type'], $allowedTypes)) {
            return ['success' => false, 'error' => 'Invalid file type. Only PNG, JPG, or SVG allowed.'];
        }
        
        if ($file['size'] > $maxSize) {
            return ['success' => false, 'error' => 'File too large. Maximum size is 2MB.'];
        }
        
        // Upload file
        $uploadResult = $this->fileUpload->uploadFile($file, $userId, $schoolId, 'logo');
        
        if (!$uploadResult['success']) {
            return $uploadResult;
        }
        
        // Update branding with logo URL
        $this->updateBranding($schoolId, ['logo_url' => $uploadResult['file_url']], $userId);
        
        return [
            'success' => true,
            'logo_url' => $uploadResult['file_url'],
            'message' => 'Logo uploaded successfully'
        ];
    }
    
    /**
     * Create default branding for a school
     */
    private function createDefaultBranding($schoolId) {
        $school = $this->db->fetch(
            "SELECT primary_color, logo_url FROM schools WHERE id = ?",
            [$schoolId]
        );
        
        $primaryColor = $school['primary_color'] ?? '#1D4E89';
        $logoUrl = $school['logo_url'] ?? null;
        
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
                '#3B82F6',
                '#FFFFFF',
                '#1F2937',
                '#10B981',
                'Inter',
                '700',
                '400',
                '16px',
                'light',
                $logoUrl
            ]
        );
    }
    
    /**
     * Validate branding data
     */
    private function validateBrandingData($data) {
        // Validate colors (hex format)
        $colorFields = ['primary_color', 'secondary_color', 'background_color', 'text_color', 'accent_color'];
        foreach ($colorFields as $field) {
            if (isset($data[$field])) {
                if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $data[$field])) {
                    return ['valid' => false, 'error' => "Invalid {$field} format. Must be hex color (e.g., #1D4E89)"];
                }
            }
        }
        
        // Validate font family
        if (isset($data['font_family'])) {
            if (!in_array($data['font_family'], $this->approvedFonts)) {
                return ['valid' => false, 'error' => "Font family must be one of: " . implode(', ', $this->approvedFonts)];
            }
        }
        
        // Validate font weights
        $validWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
        if (isset($data['heading_font_weight']) && !in_array($data['heading_font_weight'], $validWeights)) {
            return ['valid' => false, 'error' => 'Invalid heading font weight'];
        }
        if (isset($data['body_font_weight']) && !in_array($data['body_font_weight'], $validWeights)) {
            return ['valid' => false, 'error' => 'Invalid body font weight'];
        }
        
        // Validate theme mode
        if (isset($data['theme_mode'])) {
            if (!in_array($data['theme_mode'], ['light', 'dark', 'auto'])) {
                return ['valid' => false, 'error' => 'Theme mode must be light, dark, or auto'];
            }
        }
        
        // Validate font size format
        if (isset($data['base_font_size'])) {
            if (!preg_match('/^\d+(\.\d+)?(px|rem|em)$/', $data['base_font_size'])) {
                return ['valid' => false, 'error' => 'Base font size must be in px, rem, or em format (e.g., 16px)'];
            }
        }
        
        return ['valid' => true];
    }
    
    /**
     * Format branding response for frontend
     */
    private function formatBrandingResponse($branding) {
        return [
            'colors' => [
                'primary' => $branding['primary_color'] ?? '#1D4E89',
                'secondary' => $branding['secondary_color'] ?? '#3B82F6',
                'background' => $branding['background_color'] ?? '#FFFFFF',
                'text' => $branding['text_color'] ?? '#1F2937',
                'accent' => $branding['accent_color'] ?? '#10B981',
            ],
            'typography' => [
                'font_family' => $branding['font_family'] ?? 'Inter',
                'heading_font_weight' => $branding['heading_font_weight'] ?? '700',
                'body_font_weight' => $branding['body_font_weight'] ?? '400',
                'base_font_size' => $branding['base_font_size'] ?? '16px',
            ],
            'assets' => [
                'logo_url' => $branding['logo_url'] ?? null,
                'favicon_url' => $branding['favicon_url'] ?? null,
                'login_background_url' => $branding['login_background_url'] ?? null,
                'header_background_url' => $branding['header_background_url'] ?? null,
            ],
            'theme' => [
                'mode' => $branding['theme_mode'] ?? 'light',
            ],
            'version' => $branding['version'] ?? 1,
        ];
    }
    
    /**
     * Save branding version for history
     */
    private function saveBrandingVersion($schoolId, $version, $brandingData, $userId) {
        $this->db->query(
            "INSERT INTO school_branding_versions (school_id, version, branding_data, created_by) VALUES (?, ?, ?, ?)",
            [
                $schoolId,
                $version,
                json_encode($brandingData),
                $userId
            ]
        );
    }
    
    /**
     * Clear branding cache for a school
     */
    private function clearBrandingCache($schoolId) {
        $cacheKey = "branding_{$schoolId}";
        unset(self::$brandingCache[$cacheKey]);
    }
    
    /**
     * Get approved fonts list
     */
    public function getApprovedFonts() {
        return $this->approvedFonts;
    }
}
?>
