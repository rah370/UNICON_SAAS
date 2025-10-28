# UNICON SaaS - Backend API Documentation

## Overview

Complete backend implementation for UNICON SaaS with all major features and endpoints.

## Quick Start

### Database Setup

```bash
# Run the initial schema
mysql -u root < database_schema.sql

# Run the updates
mysql -u root < database_schema_update.sql
```

### Start Backend Server

```bash
php -S localhost:8000 -t . router.php
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profile Management

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

**Update Fields:**

- first_name, last_name
- bio, year_level, major
- phone, birth_date, interests
- avatar_url, background_image_url

### Posts

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `PUT /api/posts` - Update post
- `DELETE /api/posts?id={id}` - Delete post

### Comments

- `POST /api/comments` - Create comment
- `PUT /api/comments` - Update comment
- `DELETE /api/comments?id={id}` - Delete comment

**Request Body (POST):**

```json
{
  "post_id": 1,
  "content": "Great post!",
  "parent_id": null // For threaded comments
}
```

### Reactions

- `POST /api/reactions` - Toggle reaction

**Request Body:**

```json
{
  "target_type": "post",
  "target_id": 1,
  "reaction_type": "like" // like, love, laugh, wow, sad, angry
}
```

### Events

- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events` - Update event
- `DELETE /api/events?id={id}` - Delete event

### Tasks

- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks?id={id}` - Delete task

**Task Request Body:**

```json
{
  "title": "Complete project",
  "description": "Finish the assignment",
  "due_date": "2024-12-31 23:59:00",
  "priority": "high",
  "category": "academic"
}
```

### Notifications

- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark as read

**Request Body (PUT):**

```json
{
  "mark_all_read": true // or send notification_id
}
```

### Search

- `GET /api/search?q={query}&type={type}` - Search

**Types:** users, posts, events, marketplace, all

Example: `/api/search?q=test&type=all`

### Admin

- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users` - Update user status
- `DELETE /api/admin/users` - Delete user

**Update User Status:**

```json
{
  "user_id": 1,
  "status": false // Deactivate user
}
```

### Channels

- `GET /api/channels` - List channels
- `POST /api/channels` - Create channel
- `PUT /api/channels` - Join channel

### Polls

- `GET /api/polls` - Get polls
- `POST /api/polls` - Create poll
- `PUT /api/polls` - Vote

**Create Poll:**

```json
{
  "question": "What's your favorite color?",
  "description": "Help us decide!",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "expires_at": "2024-12-31 23:59:00"
}
```

### Marketplace

- `GET /api/marketplace` - List items
- `POST /api/marketplace` - Create listing

### Messages

- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

### Subscription

- `GET /api/subscription` - Get subscription status
- `POST /api/subscription` - Create subscription

### Sync (Offline)

- `POST /api/sync` - Sync pending actions

### Upload

- `POST /api/upload` - Upload file

## Authorization

All endpoints except `/api/health`, `/api/auth/login`, `/api/auth/register`, and `/api/pricing` require authentication.

**Header:**

```
Authorization: Bearer YOUR_TOKEN
```

## Response Format

### Success

```json
{
  "success": true,
  "data": {...}
}
```

### Error

```json
{
  "error": "Error message"
}
```

## Database Schema

### New Tables

- `reactions` - User reactions to content
- `tasks` - User personal tasks
- `notifications` - User notifications
- `channels` - Clubs/groups
- `channel_members` - Channel membership
- `polls` - Poll questions
- `poll_options` - Poll choices
- `poll_votes` - User votes
- `sync_queue` - Offline sync queue
- `admin_settings` - Admin configuration

## Testing

Use curl, Postman, or any HTTP client:

```bash
# Get profile
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","due_date":"2024-12-31","priority":"high"}'

# Search
curl "http://localhost:8000/api/search?q=john&type=users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Variables (TODO)

Configure these in a `.env` file or environment:

```env
# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Notes

- All timestamps are in UTC
- All IDs are auto-incrementing integers
- All DELETE operations are hard deletes (no soft deletes)
- Foreign key constraints maintain referential integrity
- Prepared statements prevent SQL injection
- Role-based access control enforced on admin endpoints
