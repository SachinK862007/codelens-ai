# CodeLens AI - Local Setup Guide

This guide will help you run CodeLens AI on your localhost step-by-step.

## Prerequisites

Before starting, ensure you have:
- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- **Git** installed
- **Redis** (optional, for caching)

---

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd codelens-ai/backend
```

### 1.2 Create Python Virtual Environment
```bash
python -m venv venv
```

### 1.3 Activate Virtual Environment

**On Windows (bash):**
```bash
source venv/Scripts/activate
```

**On Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**On Linux/Mac:**
```bash
source venv/bin/activate
```

### 1.4 Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Note:** If you encounter issues with `pyaudio`, you can skip it for now:
```bash
pip install -r requirements.txt --no-deps
pip install fastapi uvicorn pydantic pydantic-settings python-jose python-multipart sqlalchemy alembic pylint sentence-transformers chromadb pyjwt bcrypt redis requests anthropic pyttsx3 SpeechRecognition
```

### 1.5 Create Environment File
Copy the example environment file:
```bash
cp .env.examples .env
```

Edit `.env` file with your settings:
```env
# Application Settings
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./codelens.db
REDIS_URL=redis://localhost:6379/0

# AI Settings (Optional - can leave empty for testing)
CLAUDE_API_KEY=
OLLAMA_HOST=http://localhost:11434

# Security
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:8000"]

# Voice Settings
VOICE_ENABLED=false
```

### 1.6 Initialize Database
```bash
alembic upgrade head
```

If alembic is not configured yet, you can skip this or initialize the database with:
```bash
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)"
```

### 1.7 (Optional) Seed Database
```bash
python database/seeds/run_seeds.py
```

### 1.8 Start Backend Server
```bash
python app.py
```

Or using uvicorn directly:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Backend should now be running at:** `http://localhost:8000`

Test it by visiting: `http://localhost:8000/health`

---

## Step 2: Frontend Setup

### 2.1 Open New Terminal
Keep the backend running and open a new terminal window.

### 2.2 Navigate to Frontend Directory
```bash
cd codelens-ai/frontend
```

### 2.3 Install Node Dependencies
```bash
npm install
```

If you encounter any errors, try:
```bash
npm install --legacy-peer-deps
```

### 2.4 Start Frontend Development Server
```bash
npm run dev
```

**Frontend should now be running at:** `http://localhost:5173`

---

## Step 3: Verify Everything Works

### 3.1 Check Backend
Open browser and visit:
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`
- Root endpoint: `http://localhost:8000/`

### 3.2 Check Frontend
Open browser and visit:
- Frontend app: `http://localhost:5173`

### 3.3 Test the Application
1. Try registering a new user
2. Login with your credentials
3. Test the "Try Me" feature with sample Python code
4. Test the "Debug" feature with buggy code

---

## Common Issues & Solutions

### Issue 1: PyAudio Installation Fails
**Solution:** PyAudio is only needed for voice features. You can skip it:
```bash
# Install without pyaudio
pip install -r requirements.txt --no-deps
# Then install packages individually (excluding pyaudio)
```

### Issue 2: Port Already in Use
**Solution:** Change the port in the command:
```bash
# Backend
uvicorn app:app --host 0.0.0.0 --port 8001 --reload

# Frontend (edit vite.config.js or use)
npm run dev -- --port 5174
```

### Issue 3: CORS Errors
**Solution:** Make sure your `.env` file has the correct ALLOWED_ORIGINS:
```env
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:8000"]
```

### Issue 4: Database Connection Error
**Solution:** The SQLite database will be created automatically. If issues persist:
```bash
rm codelens.db
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Issue 5: Redis Connection Error
**Solution:** Redis is optional. If not installed, the app should still work. To disable:
- Comment out Redis-related code or
- Install Redis: https://redis.io/docs/getting-started/installation/

---

## Quick Start Commands (Summary)

### Terminal 1 - Backend:
```bash
cd codelens-ai/backend
source venv/Scripts/activate  # Windows bash
pip install -r requirements.txt
cp .env.examples .env
# Edit .env file
python app.py
```

### Terminal 2 - Frontend:
```bash
cd codelens-ai/frontend
npm install
npm run dev
```

---

## Next Steps

Once everything is working locally:
1. ✅ Test all features thoroughly
2. ✅ Check the logs for any errors
3. ✅ Verify database operations
4. 🚀 Proceed to Docker deployment
5. 🚀 Then Kubernetes deployment

---

## Stopping the Application

### Stop Backend:
Press `Ctrl + C` in the backend terminal

### Stop Frontend:
Press `Ctrl + C` in the frontend terminal

### Deactivate Virtual Environment:
```bash
deactivate
```

---

## Need Help?

- Check logs in both terminals for error messages
- Visit API documentation at `http://localhost:8000/docs`
- Review the main README.md for more details
- Check the docs folder for additional documentation

Good luck! 🚀
