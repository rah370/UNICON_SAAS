<?php
// Enhanced API endpoints for UNICON SaaS
// These endpoints handle: sync, calendar/tasks, profile, comments CRUD, posts CRUD, reactions, notifications, search, admin, channels/clubs, and polls

class EnhancedEndpoints {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    // ========== PROFILE ENDPOINTS ==========
    
    public function getProfile($userId) {
        $user = $this->db->fetch(
            "SELECT id, school_id, email, first_name, last_name, role, avatar_url, 
                    background_image_url, bio, year_level, major, phone, birth_date, 
                    interests, is_verified, created_at 
             FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user) {
            return ['error' => 'User not found'];
        }
        
        // Get stats
        $postCount = $this->db->fetchOne(
            "SELECT COUNT(*) FROM posts WHERE user_id = ?",
            [$userId]
        );
        
        $commentCount = $this->db->fetchOne(
            "SELECT COUNT(*) FROM comments WHERE user_id = ?",
            [$userId]
        );
        
        $user['stats'] = [
            'posts' => $postCount,
            'comments' => $commentCount
        ];
        
        return ['user' => $user];
    }
    
    public function updateProfile($userId, $data) {
        $allowedFields = ['first_name', 'last_name', 'bio', 'year_level', 'major', 'phone', 'birth_date', 'interests', 'avatar_url', 'background_image_url'];
        $updates = [];
        $params = [];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        
        if (empty($updates)) {
            return ['error' => 'No valid fields to update'];
        }
        
        $params[] = $userId;
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $this->db->query($sql, $params);
        
        return ['success' => true];
    }
    
    // ========== COMMENTS CRUD ==========
    
    public function getComments($postId) {
        $comments = $this->db->fetchAll(
            "SELECT c.*, u.first_name, u.last_name, u.avatar_url 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.post_id = ? 
             ORDER BY c.created_at DESC",
            [$postId]
        );
        return ['comments' => $comments];
    }
    
    public function createComment($postId, $userId, $content, $parentId = null) {
        $this->db->query(
            "INSERT INTO comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)",
            [$postId, $userId, $content, $parentId]
        );
        
        // Update comment count
        $this->db->query(
            "UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?",
            [$postId]
        );
        
        return ['success' => true, 'comment_id' => $this->db->lastInsertId()];
    }
    
    public function updateComment($commentId, $userId, $content) {
        $this->db->query(
            "UPDATE comments SET content = ? WHERE id = ? AND user_id = ?",
            [$content, $commentId, $userId]
        );
        return ['success' => true];
    }
    
    public function deleteComment($commentId, $userId, $role) {
        // Check if user is owner or admin
        $comment = $this->db->fetch("SELECT user_id FROM comments WHERE id = ?", [$commentId]);
        
        if (!$comment) {
            return ['error' => 'Comment not found'];
        }
        
        if ($comment['user_id'] != $userId && $role !== 'admin' && $role !== 'super_admin') {
            return ['error' => 'Unauthorized'];
        }
        
        $this->db->query("DELETE FROM comments WHERE id = ?", [$commentId]);
        
        return ['success' => true];
    }
    
    // ========== POSTS CRUD ==========
    
    public function updatePost($postId, $userId, $data) {
        $updates = [];
        $params = [];
        
        if (isset($data['title'])) {
            $updates[] = "title = ?";
            $params[] = $data['title'];
        }
        if (isset($data['content'])) {
            $updates[] = "content = ?";
            $params[] = $data['content'];
        }
        if (isset($data['image_url'])) {
            $updates[] = "image_url = ?";
            $params[] = $data['image_url'];
        }
        if (isset($data['category'])) {
            $updates[] = "category = ?";
            $params[] = $data['category'];
        }
        
        if (empty($updates)) {
            return ['error' => 'No fields to update'];
        }
        
        $params[] = $postId;
        $params[] = $userId;
        
        $sql = "UPDATE posts SET " . implode(', ', $updates) . " WHERE id = ? AND user_id = ?";
        $this->db->query($sql, $params);
        
        return ['success' => true];
    }
    
    public function deletePost($postId, $userId, $role) {
        $post = $this->db->fetch("SELECT user_id FROM posts WHERE id = ?", [$postId]);
        
        if (!$post) {
            return ['error' => 'Post not found'];
        }
        
        if ($post['user_id'] != $userId && $role !== 'admin' && $role !== 'super_admin') {
            return ['error' => 'Unauthorized'];
        }
        
        $this->db->query("DELETE FROM posts WHERE id = ?", [$postId]);
        
        return ['success' => true];
    }
    
    // ========== REACTIONS ==========
    
    public function toggleReaction($userId, $targetType, $targetId, $reactionType = 'like') {
        // Check if reaction exists
        $existing = $this->db->fetch(
            "SELECT id FROM reactions WHERE user_id = ? AND target_type = ? AND target_id = ?",
            [$userId, $targetType, $targetId]
        );
        
        if ($existing) {
            // Remove reaction
            $this->db->query(
                "DELETE FROM reactions WHERE user_id = ? AND target_type = ? AND target_id = ?",
                [$userId, $targetType, $targetId]
            );
            
            // Update count
            $this->db->query(
                "UPDATE " . ($targetType === 'post' ? 'posts' : 'comments') . " SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?",
                [$targetId]
            );
            
            return ['success' => true, 'action' => 'removed'];
        } else {
            // Add reaction
            $this->db->query(
                "INSERT INTO reactions (user_id, target_type, target_id, reaction_type) VALUES (?, ?, ?, ?)",
                [$userId, $targetType, $targetId, $reactionType]
            );
            
            // Update count
            $this->db->query(
                "UPDATE " . ($targetType === 'post' ? 'posts' : 'comments') . " SET likes_count = likes_count + 1 WHERE id = ?",
                [$targetId]
            );
            
            return ['success' => true, 'action' => 'added'];
        }
    }
    
    public function getReactions($targetType, $targetId) {
        $reactions = $this->db->fetchAll(
            "SELECT r.*, u.first_name, u.last_name, u.avatar_url 
             FROM reactions r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.target_type = ? AND r.target_id = ?",
            [$targetType, $targetId]
        );
        return ['reactions' => $reactions];
    }
    
    // ========== CALENDAR/TASKS ==========
    
    public function getTasks($userId, $schoolId) {
        $tasks = $this->db->fetchAll(
            "SELECT * FROM tasks WHERE user_id = ? AND school_id = ? ORDER BY due_date ASC",
            [$userId, $schoolId]
        );
        return ['tasks' => $tasks];
    }
    
    public function createTask($userId, $schoolId, $data) {
        $this->db->query(
            "INSERT INTO tasks (school_id, user_id, title, description, due_date, priority, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$schoolId, $userId, $data['title'], $data['description'] ?? null, $data['due_date'], $data['priority'] ?? 'medium', $data['category'] ?? null]
        );
        
        return ['success' => true, 'task_id' => $this->db->lastInsertId()];
    }
    
    public function updateTask($taskId, $userId, $data) {
        $updates = [];
        $params = [];
        
        if (isset($data['title'])) $updates[] = "title = ?"; $params[] = $data['title'];
        if (isset($data['description'])) $updates[] = "description = ?"; $params[] = $data['description'];
        if (isset($data['due_date'])) $updates[] = "due_date = ?"; $params[] = $data['due_date'];
        if (isset($data['priority'])) $updates[] = "priority = ?"; $params[] = $data['priority'];
        if (isset($data['is_completed'])) $updates[] = "is_completed = ?"; $params[] = $data['is_completed'];
        
        if (empty($updates)) {
            return ['error' => 'No fields to update'];
        }
        
        $params[] = $taskId;
        $params[] = $userId;
        
        $this->db->query("UPDATE tasks SET " . implode(', ', $updates) . " WHERE id = ? AND user_id = ?", $params);
        
        return ['success' => true];
    }
    
    public function deleteTask($taskId, $userId) {
        $this->db->query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [$taskId, $userId]);
        return ['success' => true];
    }
    
    public function updateEvent($eventId, $userId, $data) {
        $updates = [];
        $params = [];
        
        if (isset($data['title'])) { $updates[] = "title = ?"; $params[] = $data['title']; }
        if (isset($data['description'])) { $updates[] = "description = ?"; $params[] = $data['description']; }
        if (isset($data['event_date'])) { $updates[] = "event_date = ?"; $params[] = $data['event_date']; }
        if (isset($data['location'])) { $updates[] = "location = ?"; $params[] = $data['location']; }
        
        if (empty($updates)) {
            return ['error' => 'No fields to update'];
        }
        
        $params[] = $eventId;
        $params[] = $userId;
        
        $this->db->query("UPDATE events SET " . implode(', ', $updates) . " WHERE id = ? AND created_by = ?", $params);
        
        return ['success' => true];
    }
    
    public function deleteEvent($eventId, $userId, $role) {
        $event = $this->db->fetch("SELECT created_by FROM events WHERE id = ?", [$eventId]);
        
        if (!$event) {
            return ['error' => 'Event not found'];
        }
        
        if ($event['created_by'] != $userId && $role !== 'admin' && $role !== 'super_admin') {
            return ['error' => 'Unauthorized'];
        }
        
        $this->db->query("DELETE FROM events WHERE id = ?", [$eventId]);
        
        return ['success' => true];
    }
    
    // ========== EVENT RSVP ==========
    
    public function rsvpEvent($eventId, $userId, $status) {
        // Validate status
        $allowedStatuses = ['attending', 'maybe', 'not_attending'];
        if (!in_array($status, $allowedStatuses)) {
            return ['error' => 'Invalid RSVP status'];
        }
        
        // Check if event exists
        $event = $this->db->fetch("SELECT id, max_attendees, attendees_count FROM events WHERE id = ?", [$eventId]);
        if (!$event) {
            return ['error' => 'Event not found'];
        }
        
        // Check if already RSVP'd
        $existing = $this->db->fetch(
            "SELECT id, status FROM event_attendees WHERE event_id = ? AND user_id = ?",
            [$eventId, $userId]
        );
        
        if ($existing) {
            // Update existing RSVP
            $oldStatus = $existing['status'];
            $this->db->query(
                "UPDATE event_attendees SET status = ? WHERE event_id = ? AND user_id = ?",
                [$status, $eventId, $userId]
            );
            
            // Update attendee count
            if ($oldStatus === 'attending' && $status !== 'attending') {
                $this->db->query(
                    "UPDATE events SET attendees_count = GREATEST(attendees_count - 1, 0) WHERE id = ?",
                    [$eventId]
                );
            } elseif ($oldStatus !== 'attending' && $status === 'attending') {
                $this->db->query(
                    "UPDATE events SET attendees_count = attendees_count + 1 WHERE id = ?",
                    [$eventId]
                );
            }
        } else {
            // Create new RSVP
            $this->db->query(
                "INSERT INTO event_attendees (event_id, user_id, status) VALUES (?, ?, ?)",
                [$eventId, $userId, $status]
            );
            
            // Update attendee count if attending
            if ($status === 'attending') {
                $this->db->query(
                    "UPDATE events SET attendees_count = attendees_count + 1 WHERE id = ?",
                    [$eventId]
                );
            }
        }
        
        return ['success' => true, 'status' => $status];
    }
    
    public function getEventAttendees($eventId) {
        $attendees = $this->db->fetchAll(
            "SELECT ea.status, ea.created_at, u.id, u.first_name, u.last_name, u.avatar_url, u.email
             FROM event_attendees ea
             JOIN users u ON ea.user_id = u.id
             WHERE ea.event_id = ?
             ORDER BY ea.created_at DESC",
            [$eventId]
        );
        return ['attendees' => $attendees];
    }
    
    public function getUserEventStatus($eventId, $userId) {
        $rsvp = $this->db->fetch(
            "SELECT status FROM event_attendees WHERE event_id = ? AND user_id = ?",
            [$eventId, $userId]
        );
        return ['status' => $rsvp ? $rsvp['status'] : null];
    }
    
    // ========== NOTIFICATIONS ==========
    
    public function getNotifications($userId) {
        $notifications = $this->db->fetchAll(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
            [$userId]
        );
        
        return ['notifications' => $notifications];
    }
    
    public function markNotificationRead($notificationId, $userId) {
        $this->db->query(
            "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
            [$notificationId, $userId]
        );
        return ['success' => true];
    }
    
    public function markAllNotificationsRead($userId) {
        $this->db->query(
            "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
            [$userId]
        );
        return ['success' => true];
    }
    
    public function createNotification($userId, $type, $title, $message, $link = null) {
        $this->db->query(
            "INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)",
            [$userId, $type, $title, $message, $link]
        );
        return ['success' => true, 'notification_id' => $this->db->lastInsertId()];
    }
    
    // ========== SEARCH ==========
    
    public function searchUsers($schoolId, $query, $limit = 20) {
        $query = trim($query);
        if (empty($query)) {
            return ['users' => []];
        }
        
        $searchTerm = "%$query%";
        try {
            $results = $this->db->fetchAll(
                "SELECT id, first_name, last_name, email, avatar_url, role, bio, is_active, is_verified
                 FROM users 
                 WHERE school_id = ? 
                 AND is_active = 1
                 AND (LOWER(first_name) LIKE LOWER(?) OR LOWER(last_name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER(?))
                 ORDER BY 
                     CASE 
                         WHEN LOWER(first_name) LIKE LOWER(?) THEN 1
                         WHEN LOWER(last_name) LIKE LOWER(?) THEN 2
                         WHEN LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER(?) THEN 3
                         ELSE 4
                     END,
                     first_name, last_name
                 LIMIT ?",
                [$schoolId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit]
            );
            return ['users' => $results ? $results : []];
        } catch (Exception $e) {
            error_log("Search users error: " . $e->getMessage());
            return ['users' => []];
        }
    }
    
    public function searchPosts($schoolId, $query, $limit = 20) {
        $results = $this->db->fetchAll(
            "SELECT p.*, u.first_name, u.last_name, u.avatar_url 
             FROM posts p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.school_id = ? AND (p.title LIKE ? OR p.content LIKE ?)
             ORDER BY p.created_at DESC 
             LIMIT ?",
            [$schoolId, "%$query%", "%$query%", $limit]
        );
        return ['posts' => $results];
    }
    
    public function searchEvents($schoolId, $query, $limit = 20) {
        $results = $this->db->fetchAll(
            "SELECT e.*, u.first_name, u.last_name 
             FROM events e 
             JOIN users u ON e.created_by = u.id 
             WHERE e.school_id = ? AND (e.title LIKE ? OR e.description LIKE ?)
             ORDER BY e.event_date ASC 
             LIMIT ?",
            [$schoolId, "%$query%", "%$query%", $limit]
        );
        return ['events' => $results];
    }
    
    public function searchMarketplace($schoolId, $query, $limit = 20) {
        $results = $this->db->fetchAll(
            "SELECT m.*, u.first_name, u.last_name 
             FROM marketplace_items m 
             JOIN users u ON m.seller_id = u.id 
             WHERE m.school_id = ? AND m.is_sold = 0 AND (m.title LIKE ? OR m.description LIKE ?)
             ORDER BY m.created_at DESC 
             LIMIT ?",
            [$schoolId, "%$query%", "%$query%", $limit]
        );
        return ['items' => $results];
    }
    
    // ========== ADMIN ENDPOINTS ==========
    
    public function getSchoolAnalytics($schoolId) {
        $userCount = $this->db->fetchOne("SELECT COUNT(*) FROM users WHERE school_id = ?", [$schoolId]);
        $postCount = $this->db->fetchOne("SELECT COUNT(*) FROM posts WHERE school_id = ?", [$schoolId]);
        $eventCount = $this->db->fetchAll("SELECT COUNT(*) as count FROM events WHERE school_id = ? AND event_date > NOW()", [$schoolId]);
        $messageCount = $this->db->fetchOne("SELECT COUNT(*) FROM messages WHERE school_id = ? AND DATE(created_at) = CURDATE()", [$schoolId]);
        
        return [
            'total_users' => $userCount,
            'total_posts' => $postCount,
            'upcoming_events' => $eventCount,
            'messages_today' => $messageCount
        ];
    }
    
    public function getUsers($schoolId, $limit = 50, $offset = 0) {
        $users = $this->db->fetchAll(
            "SELECT id, email, first_name, last_name, role, is_verified, is_active, created_at 
             FROM users 
             WHERE school_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?",
            [$schoolId, $limit, $offset]
        );
        return ['users' => $users];
    }
    
    public function updateUserStatus($userId, $status) {
        $this->db->query("UPDATE users SET is_active = ? WHERE id = ?", [$status, $userId]);
        return ['success' => true];
    }
    
    public function updateUserRole($userId, $role) {
        // Validate role
        $allowedRoles = ['student', 'teacher', 'staff', 'admin', 'super_admin'];
        if (!in_array($role, $allowedRoles)) {
            return ['success' => false, 'error' => 'Invalid role'];
        }
        
        $this->db->query("UPDATE users SET role = ? WHERE id = ?", [$role, $userId]);
        return ['success' => true];
    }
    
    public function deleteUser($userId) {
        $this->db->query("DELETE FROM users WHERE id = ?", [$userId]);
        return ['success' => true];
    }
    
    // ========== CHANNELS/CLUBS ==========
    
    public function getChannels($schoolId) {
        $channels = $this->db->fetchAll(
            "SELECT c.*, u.first_name, u.last_name 
             FROM channels c 
             JOIN users u ON c.created_by = u.id 
             WHERE c.school_id = ? 
             ORDER BY c.created_at DESC",
            [$schoolId]
        );
        return ['channels' => $channels];
    }
    
    public function createChannel($schoolId, $userId, $data) {
        $this->db->query(
            "INSERT INTO channels (school_id, created_by, name, description, category, is_public) VALUES (?, ?, ?, ?, ?, ?)",
            [$schoolId, $userId, $data['name'], $data['description'] ?? null, $data['category'] ?? null, $data['is_public'] ?? true]
        );
        
        $channelId = $this->db->lastInsertId();
        
        // Add creator as admin
        $this->db->query("INSERT INTO channel_members (channel_id, user_id, role) VALUES (?, ?, 'admin')", [$channelId, $userId]);
        
        return ['success' => true, 'channel_id' => $channelId];
    }
    
    public function joinChannel($channelId, $userId) {
        $this->db->query(
            "INSERT INTO channel_members (channel_id, user_id, role) VALUES (?, ?, 'member')",
            [$channelId, $userId]
        );
        
        $this->db->query("UPDATE channels SET member_count = member_count + 1 WHERE id = ?", [$channelId]);
        
        return ['success' => true];
    }
    
    // ========== POLLS ==========
    
    public function getPolls($schoolId) {
        $polls = $this->db->fetchAll(
            "SELECT p.*, u.first_name, u.last_name 
             FROM polls p 
             JOIN users u ON p.created_by = u.id 
             WHERE p.school_id = ? AND (p.expires_at IS NULL OR p.expires_at > NOW()) AND p.is_active = 1
             ORDER BY p.created_at DESC",
            [$schoolId]
        );
        
        // Get options for each poll
        foreach ($polls as &$poll) {
            $poll['options'] = $this->db->fetchAll("SELECT * FROM poll_options WHERE poll_id = ?", [$poll['id']]);
        }
        
        return ['polls' => $polls];
    }
    
    public function createPoll($schoolId, $userId, $data) {
        $this->db->query(
            "INSERT INTO polls (school_id, created_by, question, description, expires_at) VALUES (?, ?, ?, ?, ?)",
            [$schoolId, $userId, $data['question'], $data['description'] ?? null, $data['expires_at'] ?? null]
        );
        
        $pollId = $this->db->lastInsertId();
        
        // Insert options
        foreach ($data['options'] as $optionText) {
            $this->db->query("INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)", [$pollId, $optionText]);
        }
        
        return ['success' => true, 'poll_id' => $pollId];
    }
    
    public function votePoll($pollId, $optionId, $userId) {
        // Check if already voted
        $existing = $this->db->fetch("SELECT id FROM poll_votes WHERE user_id = ? AND poll_id = ?", [$userId, $pollId]);
        
        if ($existing) {
            return ['error' => 'Already voted'];
        }
        
        $this->db->query("INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)", [$pollId, $optionId, $userId]);
        
        $this->db->query("UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = ?", [$optionId]);
        
        return ['success' => true];
    }
    
    // ========== OFFLINE SYNC ==========
    
    public function addToSyncQueue($userId, $actionType, $resourceType, $resourceData) {
        $this->db->query(
            "INSERT INTO sync_queue (user_id, action_type, resource_type, resource_data) VALUES (?, ?, ?, ?)",
            [$userId, $actionType, $resourceType, json_encode($resourceData)]
        );
        return ['success' => true, 'queue_id' => $this->db->lastInsertId()];
    }
    
    public function syncPending($userId) {
        $pendingItems = $this->db->fetchAll(
            "SELECT * FROM sync_queue WHERE user_id = ? AND sync_status = 'pending' ORDER BY created_at ASC",
            [$userId]
        );
        
        $synced = 0;
        $failed = 0;
        
        foreach ($pendingItems as $item) {
            try {
                // Process sync item
                $resourceData = json_decode($item['resource_data'], true);
                
                // Mark as synced
                $this->db->query(
                    "UPDATE sync_queue SET sync_status = 'synced', synced_at = NOW() WHERE id = ?",
                    [$item['id']]
                );
                $synced++;
            } catch (Exception $e) {
                $this->db->query("UPDATE sync_queue SET sync_status = 'failed' WHERE id = ?", [$item['id']]);
                $failed++;
            }
        }
        
        return ['synced' => $synced, 'failed' => $failed];
    }
}

?>

