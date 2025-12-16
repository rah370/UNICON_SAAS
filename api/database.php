<?php
// Load environment variables
require_once __DIR__ . '/env_loader.php';

// Database configuration - uses environment variables with fallbacks
define('DB_HOST', env('DB_HOST', 'localhost'));
define('DB_NAME', env('DB_NAME', 'unicon_saas'));
define('DB_USER', env('DB_USER', 'root'));
define('DB_PASS', env('DB_PASS', ''));
define('DB_CHARSET', env('DB_CHARSET', 'utf8mb4'));

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            // Get socket path from environment or use default XAMPP path
            $socket = env('DB_SOCKET', '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock');
            
            // Try socket connection first (for XAMPP)
            if (file_exists($socket)) {
                $dsn = "mysql:unix_socket=" . $socket . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            } else {
                // Fallback to TCP connection
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            }
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    public function fetch($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
}
?>
