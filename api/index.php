<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include required files
require_once 'database.php';
require_once 'auth.php';
require_once 'file_upload.php';
require_once 'stripe_payment.php';
require_once 'email_verification.php';
require_once 'enhanced_endpoints.php';

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$path = trim($path, '/');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

// Get authorization header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

// Initialize classes
$auth = new Auth();
$fileUpload = new FileUpload();
$stripePayment = new StripePayment();
$emailVerification = new EmailVerification();
$db = Database::getInstance();
$enhanced = new EnhancedEndpoints($db);

// Helper function to get current user
function getCurrentUser($token, $auth) {
    if (!$token) return null;
    return $auth->getCurrentUser($token);
}

// Helper function to require authentication
function requireAuth($token, $auth) {
    $user = getCurrentUser($token, $auth);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    return $user;
}

// Route handling
switch ($path) {
    case 'health':
        echo json_encode([
            'status' => 'ok',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '2.0.0'
        ]);
        break;
        
    case 'auth/login':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $schoolId = $input['school_id'] ?? null;
        
        $result = $auth->authenticate($email, $password, $schoolId);
        echo json_encode($result);
        break;
        
    case 'auth/register':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $result = $auth->register($input);
        echo json_encode($result);
        break;
        
    case 'auth/logout':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $result = $auth->logout($token);
        echo json_encode($result);
        break;
        
    case 'auth/me':
        $user = requireAuth($token, $auth);
        echo json_encode(['user' => $user]);
        break;
        
    case 'auth/verify-email':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $token = $input['token'] ?? '';
        $result = $emailVerification->verifyEmail($token);
        echo json_encode($result);
        break;
        
    case 'auth/send-verification':
        $user = requireAuth($token, $auth);
        $result = $emailVerification->sendVerificationEmail(
            $user['id'],
            $user['email'],
            $user['first_name']
        );
        echo json_encode($result);
        break;
        
    case 'auth/forgot-password':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $email = $input['email'] ?? '';
        $result = $emailVerification->sendPasswordResetEmail($email);
        echo json_encode($result);
        break;
        
    case 'auth/reset-password':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $token = $input['token'] ?? '';
        $password = $input['password'] ?? '';
        $result = $emailVerification->resetPassword($token, $password);
        echo json_encode($result);
        break;
        
    case 'posts':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $posts = $db->fetchAll(
                "SELECT p.*, u.first_name, u.last_name, u.avatar_url 
                 FROM posts p 
                 JOIN users u ON p.user_id = u.id 
                 WHERE p.school_id = ? 
                 ORDER BY p.created_at DESC 
                 LIMIT 50",
                [$user['school_id']]
            );
            echo json_encode(['posts' => $posts]);
        } elseif ($method === 'POST') {
            $title = $input['title'] ?? '';
            $content = $input['content'] ?? '';
            $imageUrl = $input['image_url'] ?? null;
            $category = $input['category'] ?? 'general';
            
            $postId = $db->query(
                "INSERT INTO posts (school_id, user_id, title, content, image_url, category) VALUES (?, ?, ?, ?, ?, ?)",
                [$user['school_id'], $user['id'], $title, $content, $imageUrl, $category]
            );
            $postId = $db->lastInsertId();
            
            echo json_encode(['success' => true, 'post_id' => $postId]);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updatePost($input['post_id'], $user['id'], $input);
            echo json_encode($result);
        } elseif ($method === 'DELETE') {
            $postId = $_GET['id'] ?? '';
            $result = $enhanced->deletePost($postId, $user['id'], $user['role']);
            echo json_encode($result);
        }
        break;
        
    case 'events':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $events = $db->fetchAll(
                "SELECT e.*, u.first_name, u.last_name 
                 FROM events e 
                 JOIN users u ON e.created_by = u.id 
                 WHERE e.school_id = ? 
                 ORDER BY e.event_date ASC 
                 LIMIT 50",
                [$user['school_id']]
            );
            echo json_encode(['events' => $events]);
        } elseif ($method === 'POST') {
            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';
            $eventDate = $input['event_date'] ?? '';
            $location = $input['location'] ?? '';
            $maxAttendees = $input['max_attendees'] ?? null;
            
            $eventId = $db->query(
                "INSERT INTO events (school_id, created_by, title, description, event_date, location, max_attendees) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$user['school_id'], $user['id'], $title, $description, $eventDate, $location, $maxAttendees]
            );
            $eventId = $db->lastInsertId();
            
            echo json_encode(['success' => true, 'event_id' => $eventId]);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updateEvent($input['event_id'], $user['id'], $input);
            echo json_encode($result);
        } elseif ($method === 'DELETE') {
            $eventId = $_GET['id'] ?? '';
            $result = $enhanced->deleteEvent($eventId, $user['id'], $user['role']);
            echo json_encode($result);
        }
        break;
        
    case 'messages':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $conversations = $db->fetchAll(
                "SELECT DISTINCT 
                    CASE 
                        WHEN sender_id = ? THEN recipient_id 
                        ELSE sender_id 
                    END as other_user_id,
                    u.first_name, u.last_name, u.avatar_url,
                    m.content as last_message,
                    m.created_at as last_message_time,
                    COUNT(CASE WHEN recipient_id = ? AND is_read = 0 THEN 1 END) as unread_count
                 FROM messages m
                 JOIN users u ON (CASE WHEN sender_id = ? THEN recipient_id ELSE sender_id END) = u.id
                 WHERE sender_id = ? OR recipient_id = ?
                 GROUP BY other_user_id
                 ORDER BY last_message_time DESC",
                [$user['id'], $user['id'], $user['id'], $user['id'], $user['id']]
            );
            echo json_encode(['conversations' => $conversations]);
        } elseif ($method === 'POST') {
            $recipientId = $input['recipient_id'] ?? '';
            $content = $input['content'] ?? '';
            
            $messageId = $db->query(
                "INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)",
                [$user['id'], $recipientId, $content]
            );
            $messageId = $db->lastInsertId();
            
            echo json_encode(['success' => true, 'message_id' => $messageId]);
        }
        break;
        
    case 'marketplace':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $items = $db->fetchAll(
                "SELECT m.*, u.first_name, u.last_name 
                 FROM marketplace_items m 
                 JOIN users u ON m.seller_id = u.id 
                 WHERE m.school_id = ? AND m.is_sold = 0 
                 ORDER BY m.created_at DESC 
                 LIMIT 50",
                [$user['school_id']]
            );
            echo json_encode(['items' => $items]);
        } elseif ($method === 'POST') {
            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';
            $price = $input['price'] ?? 0;
            $category = $input['category'] ?? '';
            $condition = $input['condition'] ?? '';
            $imageUrl = $input['image_url'] ?? null;
            
            $itemId = $db->query(
                "INSERT INTO marketplace_items (school_id, seller_id, title, description, price, category, condition, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$user['school_id'], $user['id'], $title, $description, $price, $category, $condition, $imageUrl]
            );
            $itemId = $db->lastInsertId();
            
            echo json_encode(['success' => true, 'item_id' => $itemId]);
        }
        break;
        
    case 'upload':
        $user = requireAuth($token, $auth);
        
        if ($method === 'POST' && isset($_FILES['file'])) {
            $uploadType = $input['upload_type'] ?? 'document';
            $result = $fileUpload->uploadFile($_FILES['file'], $user['id'], $user['school_id'], $uploadType);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded']);
        }
        break;
        
    case 'subscription':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $stripePayment->getSubscriptionStatus($user['school_id']);
            echo json_encode($result);
        } elseif ($method === 'POST') {
            $plan = $input['plan'] ?? '';
            $customerId = $input['customer_id'] ?? '';
            $priceId = $input['price_id'] ?? '';
            
            $result = $stripePayment->createSubscription($customerId, $priceId, $user['school_id']);
            echo json_encode($result);
        }
        break;
        
    case 'pricing':
        $plans = $stripePayment->getPricingPlans();
        echo json_encode(['plans' => $plans]);
        break;
        
    case 'webhook/stripe':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
        
        $payload = file_get_contents('php://input');
        $signature = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
        
        $result = $stripePayment->handleWebhook($payload, $signature);
        echo json_encode($result);
        break;
        
    case 'profile':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $enhanced->getProfile($user['id']);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updateProfile($user['id'], $input);
            echo json_encode($result);
        }
        break;
        
    case 'comments':
        $user = requireAuth($token, $auth);
        
        if ($method === 'POST') {
            $result = $enhanced->createComment($input['post_id'], $user['id'], $input['content'], $input['parent_id'] ?? null);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updateComment($input['comment_id'], $user['id'], $input['content']);
            echo json_encode($result);
        } elseif ($method === 'DELETE') {
            $commentId = $_GET['id'] ?? '';
            $result = $enhanced->deleteComment($commentId, $user['id'], $user['role']);
            echo json_encode($result);
        }
        break;
        
    case 'reactions':
        $user = requireAuth($token, $auth);
        
        if ($method === 'POST') {
            $result = $enhanced->toggleReaction($user['id'], $input['target_type'], $input['target_id'], $input['reaction_type'] ?? 'like');
            echo json_encode($result);
        }
        break;
        
    case 'tasks':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $enhanced->getTasks($user['id'], $user['school_id']);
            echo json_encode($result);
        } elseif ($method === 'POST') {
            $result = $enhanced->createTask($user['id'], $user['school_id'], $input);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updateTask($input['task_id'], $user['id'], $input);
            echo json_encode($result);
        } elseif ($method === 'DELETE') {
            $taskId = $_GET['id'] ?? '';
            $result = $enhanced->deleteTask($taskId, $user['id']);
            echo json_encode($result);
        }
        break;
        
    case 'notifications':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $enhanced->getNotifications($user['id']);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            if (isset($input['mark_all_read'])) {
                $result = $enhanced->markAllNotificationsRead($user['id']);
            } else {
                $result = $enhanced->markNotificationRead($input['notification_id'], $user['id']);
            }
            echo json_encode($result);
        }
        break;
        
    case 'search':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $query = $_GET['q'] ?? '';
            $type = $_GET['type'] ?? 'all';
            
            $result = [];
            if ($type === 'users' || $type === 'all') {
                $result['users'] = $enhanced->searchUsers($user['school_id'], $query)['users'];
            }
            if ($type === 'posts' || $type === 'all') {
                $result['posts'] = $enhanced->searchPosts($user['school_id'], $query)['posts'];
            }
            if ($type === 'events' || $type === 'all') {
                $result['events'] = $enhanced->searchEvents($user['school_id'], $query)['events'];
            }
            if ($type === 'marketplace' || $type === 'all') {
                $result['marketplace'] = $enhanced->searchMarketplace($user['school_id'], $query)['items'];
            }
            
            echo json_encode($result);
        }
        break;
        
    case 'admin/analytics':
        $user = requireAuth($token, $auth);
        
        if ($user['role'] !== 'admin' && $user['role'] !== 'super_admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            break;
        }
        
        $result = $enhanced->getSchoolAnalytics($user['school_id']);
        echo json_encode($result);
        break;
        
    case 'admin/users':
        $user = requireAuth($token, $auth);
        
        if ($user['role'] !== 'admin' && $user['role'] !== 'super_admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            break;
        }
        
        if ($method === 'GET') {
            $result = $enhanced->getUsers($user['school_id']);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->updateUserStatus($input['user_id'], $input['status']);
            echo json_encode($result);
        } elseif ($method === 'DELETE') {
            $result = $enhanced->deleteUser($input['user_id']);
            echo json_encode($result);
        }
        break;
        
    case 'channels':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $enhanced->getChannels($user['school_id']);
            echo json_encode($result);
        } elseif ($method === 'POST') {
            $result = $enhanced->createChannel($user['school_id'], $user['id'], $input);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->joinChannel($input['channel_id'], $user['id']);
            echo json_encode($result);
        }
        break;
        
    case 'polls':
        $user = requireAuth($token, $auth);
        
        if ($method === 'GET') {
            $result = $enhanced->getPolls($user['school_id']);
            echo json_encode($result);
        } elseif ($method === 'POST') {
            $result = $enhanced->createPoll($user['school_id'], $user['id'], $input);
            echo json_encode($result);
        } elseif ($method === 'PUT') {
            $result = $enhanced->votePoll($input['poll_id'], $input['option_id'], $user['id']);
            echo json_encode($result);
        }
        break;
        
    case 'sync':
        $user = requireAuth($token, $auth);
        
        if ($method === 'POST') {
            $result = $enhanced->syncPending($user['id']);
            echo json_encode($result);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}
?>