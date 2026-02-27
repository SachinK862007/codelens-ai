# CodeLens AI — API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Health Check

### `GET /health`
Returns application health status.

**Response:**
```json
{
  "status": "healthy",
  "app_name": "CodeLens AI",
  "version": "1.0.0",
  "debug": true
}
```

---

## Auth Endpoints

### `POST /auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "newuser",
  "full_name": "New User",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "username": "newuser",
    "full_name": "New User",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "last_login": null
  }
}
```

### `POST /auth/login`
Authenticate and receive an access token.

**Request Body:**
```json
{
  "username": "demo",
  "password": "demo123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### `POST /auth/logout`
Log out the current user.

### `POST /auth/refresh-token` 🔒
Refresh an expiring access token. Requires valid Bearer token.

### `POST /auth/forgot-password`
Initiate password reset. **Request:** `{ "email": "user@example.com" }`

### `POST /auth/reset-password`
Complete password reset. **Request:** `{ "token": "...", "new_password": "..." }`

### `GET /auth/me` 🔒
Get current authenticated user profile.

---

## Try Me — Code Execution

### `POST /try-me/execute`
Execute Python code with visual tracing and AI explanation.

**Request Body:**
```json
{
  "code": "x = 5\nprint(x * 2)",
  "language": "python",
  "include_explanation": true,
  "include_flowchart": true
}
```

**Response (200):**
```json
{
  "success": true,
  "output": "10\n",
  "trace": [
    {
      "event": "line",
      "line_number": 1,
      "function": "<module>",
      "locals": { "x": "5" },
      "timestamp": 1700000000.0
    }
  ],
  "explanation": { "...": "AI-generated explanation" },
  "flowchart": "graph TD\n    A[Start] --> B[Initialize Variables]...",
  "execution_time": 0.05,
  "error": null
}
```

### `POST /try-me/predict-output`
Predict code output without executing. **Request:** raw string of code.

---

## Debug — Error Analysis

### `POST /debug/analyze`
Analyze code errors and provide corrected code with flowchart.

**Request Body:**
```json
{
  "code": "def divide(a, b):\n    return a / b\n\nresult = divide(10, 0)",
  "error_message": "ZeroDivisionError: division by zero",
  "language": "python"
}
```

**Response (200):**
```json
{
  "success": true,
  "error_analysis": {
    "type": "AI Analysis",
    "message": "ZeroDivisionError: division by zero",
    "ai_explanation": "..."
  },
  "corrected_code": "def divide(a, b):\n    if b == 0:\n        return 'Cannot divide by zero'\n    return a / b",
  "flowchart": "graph TD\n    A[Start] --> B[Check divisor]...",
  "explanation": "Added a check for zero before dividing",
  "suggestions": ["Test the corrected code", "..."]
}
```

### `POST /debug/identify-patterns`
Identify common error patterns in code. **Request:** raw string of code.

---

## Ideas — Project Planning

### `POST /ideas/generate-plan`
Generate a complete project plan from an idea.

**Request Body:**
```json
{
  "idea_description": "A todo list application with categories",
  "skill_level": "beginner",
  "preferred_language": "python",
  "time_constraint": "2 weeks",
  "existing_skills": ["html", "css"]
}
```

### `POST /ideas/recommend-resources`
Recommend learning resources. **Request:** `["python", "web development"]`

### `POST /ideas/suggest-architecture`
Suggest system architecture for an idea. Uses same `IdeaRequest` body.

### `GET /ideas/popular-ideas`
Get curated list of popular project ideas with metadata.

---

## Practice — Learning Exercises

### `POST /practice/get-exercises`
Get practice exercises for the current level.

**Request Body:**
```json
{
  "language": "python",
  "difficulty": "beginner",
  "current_level": 1
}
```

### `POST /practice/submit-exercise`
Submit an exercise solution for AI evaluation.

**Request Body:**
```json
{
  "exercise_id": 1,
  "code_submission": "print('Hello, World!')"
}
```

### `GET /practice/progress/{user_id}`
Get learning progress for a user.

---

## Voice — Speech Processing

### `POST /voice/transcribe`
Transcribe uploaded audio to text. **Content-Type:** `multipart/form-data`

| Field     | Type   | Description          |
|-----------|--------|----------------------|
| file      | File   | Audio file (WAV/MP3) |
| language  | string | Language code         |

### `POST /voice/synthesize`
Convert text to speech audio.

**Request Body:**
```json
{
  "text": "Hello, welcome to CodeLens AI",
  "language": "en-US",
  "voice_type": "female"
}
```

### `POST /voice/command`
Process voice commands. **Request:** `{ "command": "run code", "parameters": {} }`

### `GET /voice/audio/{audio_id}`
Serve generated audio file by ID.

### `POST /voice/detect-language`
Detect language from audio input.

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "detail": "Error description message"
}
```

| Status Code | Meaning                 |
|-------------|-------------------------|
| 400         | Bad Request             |
| 401         | Unauthorized            |
| 404         | Not Found               |
| 422         | Validation Error        |
| 500         | Internal Server Error   |

---

## Interactive Docs

FastAPI auto-generates interactive documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
