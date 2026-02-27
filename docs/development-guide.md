# CodeLens AI — Development Guide

## Architecture Overview

```
codelens-ai/
├── backend/                 # FastAPI Python backend
│   ├── api/                 # API route handlers
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── try_me.py        # Code execution & tracing
│   │   ├── debug.py         # Error analysis
│   │   ├── ideas.py         # Project planning
│   │   ├── practice.py      # Learning exercises
│   │   └── voice.py         # Voice processing
│   ├── config/              # Configuration
│   │   ├── settings.py      # App settings (env vars)
│   │   └── security.py      # JWT, password hashing
│   ├── models/              # Pydantic data models
│   ├── services/            # Business logic
│   │   ├── ai_engine.py     # Ollama AI integration
│   │   ├── execution_tracer.py  # Code tracing (sys.settrace)
│   │   ├── code_executor.py     # Safe code execution sandbox
│   │   ├── flowchart_generator.py  # Mermaid diagram generation
│   │   ├── assessment.py    # Code grading
│   │   ├── learning_path.py # Curriculum management
│   │   └── speech_processor.py  # Voice I/O
│   ├── database/            # SQLAlchemy DB connection
│   ├── utils/               # Helpers, validators, formatters
│   ├── tests/               # Pytest test suite
│   ├── app.py               # FastAPI application entry point
│   └── requirements.txt     # Python dependencies
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API client (Axios)
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx          # Main app with routing
│   │   └── index.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── docker/                  # Docker configuration
├── kubernetes/              # K8s manifests
└── scripts/                 # Setup & deploy scripts
```

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **Ollama** (for local AI inference)
- **Git**

---

## Local Development Setup

### 1. Clone and enter the project
```bash
git clone <repository-url>
cd codelens-ai
```

### 2. Backend setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Create environment file
```bash
cp .env.examples .env
# Edit .env with your settings
```

### 4. Start Ollama
```bash
ollama serve
ollama pull qwen3-coder:480b-cloud
```

### 5. Start backend
```bash
# From project root
python -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```
Verify: `http://localhost:8000/health`

### 6. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Verify: `http://localhost:3000`

---

## Tech Stack

| Layer      | Technology          | Purpose                        |
|------------|---------------------|--------------------------------|
| Backend    | FastAPI + Uvicorn   | Async REST API                 |
| Frontend   | React 18 + Vite     | Single-page application        |
| AI         | Ollama (qwen3-coder)| Local AI inference             |
| Auth       | JWT + bcrypt        | Token-based authentication     |
| DB         | SQLite + SQLAlchemy | Lightweight data persistence   |
| Code Editor| Monaco Editor       | VS Code-quality code editing   |
| Charts     | Mermaid.js + D3     | Flowcharts and visualizations  |
| Styling    | TailwindCSS         | Utility-first CSS              |

---

## Key Design Decisions

1. **Ollama-only AI**: No cloud API keys required — all AI runs locally
2. **sys.settrace**: Python's tracing mechanism for real-time execution visualization
3. **Pydantic v2**: Modern data validation with `pydantic-settings` for config
4. **Mock data**: Auth and exercises use in-memory mocks (swap to DB for production)
5. **SQLite default**: Zero-config database for development

---

## Running Tests

```bash
# From project root
python -m pytest backend/tests/ -v

# With coverage
python -m pytest backend/tests/ --cov=backend --cov-report=html
```

---

## Code Style

- **Python**: Follow PEP 8. Use `black` for formatting, `flake8` for linting
- **JavaScript**: Use ESLint with React plugin
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, `test:`)

```bash
# Format Python code
black backend/

# Lint Python code
flake8 backend/

# Lint JavaScript
cd frontend && npm run lint
```

---

## Adding a New API Endpoint

1. Create handler in `backend/api/<feature>.py`
2. Define Pydantic models in `backend/models/`
3. Add business logic in `backend/services/`
4. Register router in `backend/app.py`
5. Add tests in `backend/tests/test_<feature>.py`
6. Update API documentation in `docs/api-documentation.md`

---

## Environment Variables

| Variable                     | Default                        | Description                 |
|------------------------------|--------------------------------|-----------------------------|
| `SECRET_KEY`                 | `your-secret-key-here...`      | JWT signing secret          |
| `DATABASE_URL`               | `sqlite:///./codelens.db`      | Database connection string  |
| `OLLAMA_HOST`                | `http://localhost:11434`       | Ollama server URL           |
| `OLLAMA_MODEL`               | `qwen3-coder:480b-cloud`      | Ollama model name           |
| `REDIS_URL`                  | `redis://localhost:6379/0`     | Redis URL (rate limiting)   |
| `VOICE_ENABLED`              | `true`                         | Enable voice features       |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| `30`                           | JWT token lifetime          |
