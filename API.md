# Comprehensive API Documentation

# 3.3.1 Issue Reporting

### 1. View Issues by Admin

**URL:** `GET /issues`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
[
    {
        "issue_id": "60f4a1bd0d1a2b3414b9c7e9",
        "type": "overflowing bins",
        "details": "Trash bin is full and overflowing.",
        "picture_url": "http://123.com/issue1.png",
        "is_solved": false,
        "hide_user": true,
        "location": "123 Main St",
        "created_at": "2024-05-10T10:00:00Z"
    },
    {
        "issue_id": "60f4a1bd0d1a2b3414b9c7ea",
        "type": "littering",
        "details": "People are throwing garbage on the street.",
        "picture_url": "http://123.com/issue2.png",
        "is_solved": true,
        "hide_user": false,
        "location": "456 Elm St",
        "created_at": "2024-05-11T12:00:00Z"
    }
]
```

**Example Response (Invalid or Missing Token or Not Admin - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Create Issue by User

**URL:** `POST /issues`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "type": "overflowing bins",
    "details": "Trash bin is full and overflowing.",
    "picture_url": "http://123.com/issue1.png",
    "location": "123 Main St",
    "hide_user": true
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Issue created"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.2 Notification System

### 1. View Notifications

**URL:** `GET /notifications`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "total_notifications": 2,
    "notifications": [
        {
            "id": "60f4a1bd0d1a2b3414b9c7e9",
            "title": "Garbage Collection Schedule Update",
            "message": "Garbage collection for Ward 4 is now on Monday and Thursday.",
            "category": "schedule"
        },
        {
            "id": "60f4a1bd0d1a2b3414b9c7ea",
            "title": "Recycling Guidelines",
            "message": "Please follow the new recycling guidelines for plastic waste.",
            "category": "guidelines"
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Set Notification Preferences

**URL:** `POST /notifications/preferences`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "categories": ["event", "schedule", "guidelines"]
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Notification preferences set successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Add a Notification (Admin Only)

**URL:** `POST /notifications`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "title": "Recycling Event Announcement",
    "message": "Join us for a recycling event on May 15th.",
    "category": "event"
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Notification created successfully"
}
```

**Example Response (Invalid or Missing Token or Not Admin - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.3 Community Engagement

### 1. View Blog

**URL:** `GET /blogs`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "blogs": [
        {
            "post_id": "60f4a1bd0d1a2b3414b9c7e9",
            "picture_url": "https://example.com/blog-image.jpg",
            "details": "Blog post details go here...",
            "tags": ["recycling", "waste management"],
            "by_admin": true
        },
        {
            "post_id": "60f4a1bd0d1a2b3414b9c7ea",
            "picture_url": "https://example.com/another-blog-image.jpg",
            "details": "Another blog post details go here...",
            "tags": ["composting", "environment"],
            "by_admin": false
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Create a Post

**URL:** `POST /blogs`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "picture_url": "https://example.com/blog-image.jpg",
    "details": "Blog post details go here...",
    "tags": ["recycling", "waste management"]
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Blog post created successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Delete Post (Admin Only)

**URL:** `DELETE /blogs/{post_id}`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Blog post deleted successfully"
}
```

**Example Response (Invalid or Missing Token or Not Admin - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.4 Social Sharing and Educational Content

### 1. Get All Events

**URL:** `GET /events`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "events": [
        {
            "event_id": "60f4a1bd0d1a2b3414b9c7ef",
            "title": "Waste Management Seminar",
            "description": "An informative seminar on waste management practices.",
            "date": "2024-05-20T10:00:00Z",
            "location": "City Hall",
            "by_admin": true
        },
        {
            "event_id": "60f4a1bd0d1a2b3414b9c7f0",
            "title": "Recycling Workshop",
            "description": "A hands-on workshop about recycling techniques.",
            "date": "2024-06-15T14:00:00Z",
            "location": "Community Center",
            "by_admin": false
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Create an Event

**URL:** `POST /events`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "title": "Waste Management Seminar",
    "description": "An informative seminar on waste management practices.",
    "date": "2024-05-20T10:00:00Z",
    "location": "City Hall"
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Event created successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Register for an Event

**URL:** `POST /events/{event_id}/register`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 201 Created):**
```


{
    "message": "Successfully registered for the event"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 4. Delete an Event (Admin Only)

**URL:** `DELETE /events/{event_id}`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Event deleted successfully"
}
```

**Example Response (Invalid or Missing Token or Not Admin - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 5. Create a Quiz

**URL:** `POST /quizzes`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "title": "Waste Management Quiz",
    "description": "Test your knowledge on waste management.",
    "questions": [
        {
            "question_text": "Which item is recyclable?",
            "options": ["Plastic bottle", "Ceramic plate", "Metal can", "All of the above"],
            "correct_answer": 3
        },
        {
            "question_text": "What is composting?",
            "options": ["Burning waste", "Turning organic waste into fertilizer", "Recycling metal", "All of the above"],
            "correct_answer": 1
        }
    ]
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Quiz created successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 6. Submit Answers for a Quiz

**URL:** `POST /quizzes/{quiz_id}/submit`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "answers": [
        {
            "question_id": "60f4a1bd0d1a2b3414b9c7f1",
            "selected_option": 3
        },
        {
            "question_id": "60f4a1bd0d1a2b3414b9c7f2",
            "selected_option": 1
        }
    ]
}
```

**Example Response (Success - 200 OK):**
```
{
    "score": 2,
    "total": 2,
    "message": "Quiz submitted successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.5 Interactive Maps

### 1. Get Nearby Recycling Facilities

**URL:** `GET /maps/recycling-facilities`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "recycling_facilities": [
        {
            "facility_id": "60f4a1bd0d1a2b3414b9c7f3",
            "name": "Green Recycle Center",
            "address": "456 Elm St",
            "coordinates": [90.123456, 23.456789]
        },
        {
            "facility_id": "60f4a1bd0d1a2b3414b9c7f4",
            "name": "Eco-Friendly Recycling Hub",
            "address": "789 Maple St",
            "coordinates": [90.987654, 23.654321]
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Get Nearby Drop-off Points

**URL:** `GET /maps/drop-off-points`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "drop_off_points": [
        {
            "point_id": "60f4a1bd0d1a2b3414b9c7f5",
            "name": "East Drop-off Point",
            "address": "123 Oak St",
            "coordinates": [90.765432, 23.876543]
        },
        {
            "point_id": "60f4a1bd0d1a2b3414b9c7f6",
            "name": "West Drop-off Point",
            "address": "321 Pine St",
            "coordinates": [90.543210, 23.987654]
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Get Waste Management Centers

**URL:** `GET /maps/waste-management-centers`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "waste_management_centers": [
        {
            "center_id": "60f4a1bd0d1a2b3414b9c7f7",
            "name": "Main Waste Management Center",
            "address": "456 Birch St",
            "coordinates": [90.654321, 23.123456]
        },
        {
            "center_id": "60f4a1bd0d1a2b3414b9c7f8",
            "name": "South Waste Management Facility",
            "address": "789 Cedar St",
            "coordinates": [90.432109, 23.987654]
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.6 Volunteer Opportunities

### 1. Get All Volunteer Events

**URL:** `GET /volunteers/events`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "events": [
        {
            "event_id": "60f4a1bd0d1a2b3414b9c7f9",
            "title": "Cleanup Drive",
            "description": "A community cleanup drive to improve the neighborhood.",
            "date": "2024-07-01T09:00:00Z",
            "location": "Central Park"
        },
        {
            "event_id": "60f4a1bd0d1a2b3414b9c7fa",
            "title": "Recycling Campaign",
            "description": "A campaign to promote recycling in the community.",
            "date": "2024-08-15T10:00:00Z",
            "location": "City Hall"
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Register for a Volunteer Event

**URL:** `POST /volunteers/events/{event_id}/register`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Successfully registered for the event"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Create a Volunteer Event

**URL:** `POST /volunteers/events`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "title": "Cleanup Drive",
    "description": "A community cleanup drive to improve the neighborhood.",
    "date": "2024-07-01T09:00:00Z",
    "location": "Central Park"
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Volunteer event created successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 4. Delete a Volunteer Event (Admin Only / Creator)

**URL:** `DELETE /volunteers/events/{event_id}`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Volunteer event deleted successfully"
}
```

**Example Response (Invalid or Missing Token or Not Admin - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.7 Accessibility and Multilingual Support

### 1. Get Supported Languages

**URL:** `GET /languages`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "

languages": [
        {
            "language_code": "en",
            "name": "English"
        },
        {
            "language_code": "bn",
            "name": "Bengali"
        },
        {
            "language_code": "es",
            "name": "Spanish"
        }
    ]
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Set User Language Preference

**URL:** `PUT /languages/preference`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "language_code": "en"
}
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Language preference updated successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Get Accessibility Settings

**URL:** `GET /accessibility`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "accessibility_settings": {
        "high_contrast_mode": true,
        "text_to_speech_enabled": false,
        "font_size": "large"
    }
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 4. Update Accessibility Settings

**URL:** `PUT /accessibility`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "high_contrast_mode": true,
    "text_to_speech_enabled": false,
    "font_size": "large"
}
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Accessibility settings updated successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# 3.3.8 Privacy and Security

### 1. Get Privacy Settings

**URL:** `GET /privacy`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "privacy_settings": {
        "profile_visibility": "public",
        "activity_visibility": "friends"
    }
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 2. Update Privacy Settings

**URL:** `PUT /privacy`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "profile_visibility": "private",
    "activity_visibility": "friends"
}
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Privacy settings updated successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 3. Send Friend Request

**URL:** `POST /friends/request`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "friend_id": "60f4a1bd0d1a2b3414b9c7e9"
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "Friend request sent successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 4. Accept Friend Request

**URL:** `POST /friends/accept`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Request Payload (JSON):**
```
{
    "friend_id": "60f4a1bd0d1a2b3414b9c7ea"
}
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Friend request accepted successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### 5. Remove Friend

**URL:** `DELETE /friends/{friend_id}`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "message": "Friend removed successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

# Authentication and Profile Management

### Register Endpoint

**URL:** `POST /register`

**Request Payload (JSON):**
```
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Example Response (Success - 201 Created):**
```
{
    "message": "User registered successfully"
}
```

**Example Response (User Already Exists - 400 Bad Request):**
```
{
    "message": "User already exists"
}
```

**Example Response (Validation Error - 400 Bad Request):**
```
{
    "message": "Invalid data."
}
```
### Login and Logout Endpoints

#### Login

**URL:** `POST /login`

**Request Payload (JSON):**
```
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Example Response (Success - 200 OK):**
```
{
    "access_token": "your_jwt_token_here"
}
```

**Example Response (Invalid Credentials or Missing Field - 401 Unauthorized):**
```
{
    "message": "Invalid credentials"
}
```

#### Logout

**URL:** `POST /logout`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "message": "User logged out successfully"
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

### Profile

**URL:** `GET /profile`

**Request Header:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Example Response (Success - 200 OK):**
```
{
    "username": "john_doe",
    "name": "John Doe",
    "email": "john@example.com",
    "is_admin": false,
    "issue_reporting": {
        "reported_issues": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7e9",
                "location": "123 Main St",
                "issue_type": "Overflowing Bin",
                "description": "Trash bin is full and overflowing.",
                "status": "pending"
            }
        ],
        "anonymous_reporting_enabled": true
    },
    "notification_system": {
        "subscribed_categories": [
            "schedule",
            "events",
            "guidelines"
        ]
    },
    "community_engagement": {
        "forum_posts": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7ea",
                "title": "Recycling Tips",
                "content": "Always rinse your recyclable containers."
            }
        ]
    },
    "social_sharing_and_educational_content": {
        "shared_content": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7eb",
                "title": "Waste Management Event",
                "type": "event",
                "url": "https://example.com/event"
            }
        ],
        "educational_resources": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7ec",
                "title": "Composting Techniques",
                "type": "article",
                "url": "https://example.com/composting"
            }
        ]
    },
    "interactive_maps": {
        "nearby_recycling_facilities": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7ed",
                "name": "Green Recycle Center",
                "location": "456 Elm St"
            }
        ]
    },
    "volunteer_opportunities": {
        "volunteered_events": [
            {
                "id": "60f4a1bd0d1a2b3414b9c7ee",
                "event": "Cleanup Drive"
            }
        ]
    }
}
```

**Example Response (Invalid or Missing Token - 403 Forbidden):**
```
{
    "msg": "Unauthorized"
}
```

**Example Response (User Doesn't Exist - 401 Unauthorized):**
```
{
    "message": "User not found"
}
```
