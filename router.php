<?php
// Router for UNICON SaaS - React SPA with PHP API
// - Serves React SPA for all frontend routes
// - Routes /api/* to api/index.php
// - Serves static assets directly

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static assets directly (images, CSS, JS, etc.)
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false; // let the built-in server handle it
}

// Route API requests
if (preg_match('#^/api(/.*)?$#', $uri)) {
    require __DIR__ . '/api/index.php';
    return true;
}

// Serve React SPA for all other routes
// This handles client-side routing
require __DIR__ . '/index.html';
return true;
