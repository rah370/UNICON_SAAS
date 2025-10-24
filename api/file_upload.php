<?php
// File Upload Handler
require_once 'database.php';
require_once 'auth.php';

class FileUpload {
    private $db;
    private $uploadDir = '../uploads/';
    private $maxFileSize = 5 * 1024 * 1024; // 5MB
    private $allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'application/zip'
    ];
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->ensureUploadDir();
    }
    
    private function ensureUploadDir() {
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
        
        // Create subdirectories
        $subdirs = ['avatars', 'posts', 'documents', 'logos'];
        foreach ($subdirs as $subdir) {
            $path = $this->uploadDir . $subdir;
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
        }
    }
    
    public function uploadFile($file, $userId, $schoolId, $uploadType = 'document') {
        try {
            // Validate file
            if (!$this->validateFile($file)) {
                return ['success' => false, 'error' => 'Invalid file'];
            }
            
            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '.' . $extension;
            
            // Determine upload path
            $subdir = $this->getSubdirectory($uploadType);
            $uploadPath = $this->uploadDir . $subdir . '/' . $filename;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                return ['success' => false, 'error' => 'Failed to upload file'];
            }
            
            // Save file info to database
            $fileId = $this->db->query(
                "INSERT INTO file_uploads (school_id, user_id, filename, original_filename, file_path, file_size, mime_type, upload_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $schoolId,
                    $userId,
                    $filename,
                    $file['name'],
                    $uploadPath,
                    $file['size'],
                    $file['type'],
                    $uploadType
                ]
            );
            $fileId = $this->db->lastInsertId();
            
            return [
                'success' => true,
                'file_id' => $fileId,
                'filename' => $filename,
                'original_filename' => $file['name'],
                'file_url' => '/uploads/' . $subdir . '/' . $filename,
                'file_size' => $file['size'],
                'mime_type' => $file['type']
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Upload failed: ' . $e->getMessage()];
        }
    }
    
    private function validateFile($file) {
        // Check if file was uploaded
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return false;
        }
        
        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            return false;
        }
        
        // Check file type
        if (!in_array($file['type'], $this->allowedTypes)) {
            return false;
        }
        
        // Check for PHP files
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $dangerousExtensions = ['php', 'php3', 'php4', 'php5', 'phtml', 'pl', 'py', 'jsp', 'asp', 'sh', 'cgi'];
        if (in_array($extension, $dangerousExtensions)) {
            return false;
        }
        
        return true;
    }
    
    private function getSubdirectory($uploadType) {
        switch ($uploadType) {
            case 'avatar':
                return 'avatars';
            case 'post_image':
                return 'posts';
            case 'logo':
                return 'logos';
            default:
                return 'documents';
        }
    }
    
    public function deleteFile($fileId, $userId) {
        try {
            $file = $this->db->fetch(
                "SELECT * FROM file_uploads WHERE id = ? AND user_id = ?",
                [$fileId, $userId]
            );
            
            if (!$file) {
                return ['success' => false, 'error' => 'File not found'];
            }
            
            // Delete physical file
            if (file_exists($file['file_path'])) {
                unlink($file['file_path']);
            }
            
            // Delete database record
            $this->db->query(
                "DELETE FROM file_uploads WHERE id = ?",
                [$fileId]
            );
            
            return ['success' => true];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Delete failed: ' . $e->getMessage()];
        }
    }
    
    public function getFileInfo($fileId) {
        return $this->db->fetch(
            "SELECT * FROM file_uploads WHERE id = ?",
            [$fileId]
        );
    }
    
    public function getUserFiles($userId, $uploadType = null) {
        $sql = "SELECT * FROM file_uploads WHERE user_id = ?";
        $params = [$userId];
        
        if ($uploadType) {
            $sql .= " AND upload_type = ?";
            $params[] = $uploadType;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        return $this->db->fetchAll($sql, $params);
    }
}
?>
