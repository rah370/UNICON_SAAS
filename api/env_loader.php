<?php
/**
 * Simple Environment Variable Loader
 * Loads variables from .env file if it exists, otherwise uses system environment variables
 */

function loadEnv($filePath = null) {
    // Default to .env in the project root (one level up from api/)
    if ($filePath === null) {
        $filePath = dirname(__DIR__) . '/.env';
    }
    
    // If .env file exists, load it
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Parse KEY=VALUE format
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                $value = trim($value, '"\'');
                
                // Set environment variable if not already set
                if (!getenv($key)) {
                    putenv("$key=$value");
                    $_ENV[$key] = $value;
                }
            }
        }
    }
}

// Auto-load .env file when this file is included
loadEnv();

/**
 * Get environment variable with optional default value
 * 
 * @param string $key Environment variable name
 * @param mixed $default Default value if not found
 * @return mixed
 */
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        $value = $_ENV[$key] ?? $default;
    }
    return $value !== false ? $value : $default;
}

