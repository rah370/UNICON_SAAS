<?php
// Simple router for PHP's built-in server.
// - Serves existing files directly
// - Routes /api/* to api/index.php
// - Falls back to index.html for the SPA

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$file = __DIR__ . $uri;

// Serve files that exist (assets, images, etc.)
if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // let the built-in server handle it
}

// Route API requests
if (preg_match('#^/api(/.*)?$#', $uri)) {
    require __DIR__ . '/api/index.php';
    return true;
}

// Default to SPA entry
require __DIR__ . '/index.html';
