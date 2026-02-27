# CodeLens AI - Simple Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    http://localhost:5173                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                                                              │
│  • React Components                                          │
│  • Monaco Editor (Code Editor)                               │
│  • D3.js (Visualizations)                                    │
│  • Mermaid (Flowcharts)                                      │
│  • Axios (API Client)                                        │
│                                                              │
│  Port: 5173                                                  │
│  Tech: Vite + React + TailwindCSS                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND (FastAPI)                          │
│                                                              │
│  API Endpoints:                                              │
│  ├── /auth          - Authentication                         │
│  ├── /try-me        - Code execution & visualization         │
│  ├── /debug         - Error analysis & fixing                │
│  ├── /ideas         - Project planning                       │
│  ├── /practice      - Learning exercises                     │
│  └── /voice         - Voice interaction                      │
│                                                              │
│  Port: 8000                                                  │
│  Tech: FastAPI + Python 3.9+                                │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
             │                       │
    ┌────────▼────────┐    ┌────────▼────────┐
    │   DATABASE      │    │    SERVICES     │
    │                 │    │                 │
    │  • SQLite       │    │  • AI Engine    │
    │  • Users        │    │  • Code Exec    │
    │  • Exercises    │    │  • Tracer       │
    │  • Submissions  │    │  • Flowchart    │
    │  • Conversations│    │  • Assessment   │
    │                 │    │  • Speech       │
    └─────────────────┘    └─────────────────┘
```

## Data Flow

### 1. Try Me Feature
```
User writes code → Frontend sends to /try-me
                 ↓
Backend receives code → Code Executor runs it
                 ↓
Execution Tracer captures each step
                 ↓
Returns execution trace → Frontend visualizes
```

### 2. Debug Feature
```
User submits buggy code → Frontend sends to /debug
                       ↓
Backend analyzes error → AI Engine identifies issue
                       ↓
Flowchart Generator creates visual
                       ↓
Returns fix + explanation → Frontend displays
```

### 3. Ideas Feature
```
User describes project → Frontend sends to /ideas
                      ↓
AI Engine creates plan → Generates roadmap
                      ↓
Returns structured plan → Frontend displays
```

### 4. Practice Feature
```
User requests exercise → Frontend sends to /practice
                      ↓
Backend fetches from DB → Returns exercise
                      ↓
User submits solution → Assessment service grades
                      ↓
Returns feedback → Frontend displays results
```

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Code Editor:** Monaco Editor
- **Visualizations:** D3.js, Mermaid
- **HTTP Client:** Axios
- **Routing:** React Router

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.9+
- **Database:** SQLite (SQLAlchemy ORM)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **AI Integration:** Anthropic Claude API
- **Code Execution:** subprocess (sandboxed)
- **Migrations:** Alembic

### Services
- **AI Engine:** Claude API / Ollama
- **Code Executor:** Python subprocess
- **Execution Tracer:** Custom Python tracer
- **Flowchart Generator:** Mermaid syntax generator
- **Assessment:** Automated grading logic
- **Speech Processor:** pyttsx3 + SpeechRecognition

## File Structure

```
codelens-ai/
│
├── backend/                    # Python FastAPI backend
│   ├── api/                   # API endpoints
│   │   ├── auth.py           # Authentication
│   │   ├── try_me.py         # Code execution
│   │   ├── debug.py          # Error fixing
│   │   ├── ideas.py          # Project planning
│   │   ├── practice.py       # Exercises
│   │   └── voice.py          # Voice features
│   │
│   ├── models/               # Database models
│   │   ├── user.py
│   │   ├── exercise.py
│   │   ├── submission.py
│   │   └── conversation.py
│   │
│   ├── services/             # Business logic
│   │   ├── ai_engine.py
│   │   ├── code_executor.py
│   │   ├── execution_tracer.py
│   │   ├── flowchart_generator.py
│   │   ├── assessment.py
│   │   └── speech_processor.py
│   │
│   ├── database/             # Database setup
│   │   ├── connection.py
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── config/               # Configuration
│   │   ├── settings.py
│   │   └── security.py
│   │
│   ├── utils/                # Utilities
│   │   ├── helpers.py
│   │   ├── validators.py
│   │   └── security_utils.py
│   │
│   └── app.py                # Main application
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── core/        # Main features
│   │   │   ├── common/      # Shared components
│   │   │   └── visualizations/
│   │   │
│   │   ├── services/         # API clients
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   │
│   └── public/               # Static assets
│
├── docker/                    # Docker configuration
│   ├── docker-compose.yml
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
│
└── docs/                      # Documentation
    ├── api-documentation.md
    ├── architecture.md
    └── user-manual.md
```

## Port Configuration

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend  | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/docs |
| Redis    | 6379 | localhost:6379 (optional) |

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./codelens.db
ALLOWED_ORIGINS=["http://localhost:5173"]
CLAUDE_API_KEY=optional-for-ai-features
REDIS_URL=redis://localhost:6379/0
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention (SQLAlchemy ORM)
- Code execution sandboxing
- Rate limiting (optional with Redis)

## Deployment Options

1. **Local Development** (Current)
   - Direct Python + Node.js

2. **Docker** (Next Step)
   - Containerized services
   - docker-compose for orchestration

3. **Kubernetes** (Production)
   - Scalable deployment
   - Load balancing
   - Auto-scaling

---

For more details, see the full documentation in the `docs/` folder.
