# Citizen Engagement App API

# 3.3.1 Issues

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
# 3.3.2 Notifications API

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




### Register Endpoint

**URL:** `POST /register`

**Request Payload (JSON):**
```
Content-Type: application/json
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

### Login Endpoint

**URL:** `POST /login`

**Request Payload (JSON):**
```
Content-Type: application/json
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
