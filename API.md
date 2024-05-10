
# Citizen Engagement App API

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

### Login Endpoint

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

**Example Response (User Doesn't Exist - 401 Unauthorized):**
```
{
    "message": "User not found"
}
```
