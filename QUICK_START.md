# 🚀 Quick Start - CodeLens AI

## Run Locally in 5 Minutes

### Step 1: Backend (Terminal 1)
```bash
cd codelens-ai/backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.examples .env
python app.py
```

### Step 2: Frontend (Terminal 2)
```bash
cd codelens-ai/frontend
npm install
npm run dev
```

### Step 3: Open Browser
Visit: **http://localhost:5173**

---

## Verify It Works

1. **Backend Health Check:** http://localhost:8000/health
2. **API Documentation:** http://localhost:8000/docs
3. **Frontend App:** http://localhost:5173

---

## Common Commands

### Backend
```bash
# Start backend
cd backend
source venv/Scripts/activate
python app.py

# Alternative with uvicorn
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Initialize database
cd backend
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)"

# Run seeds
python database/seeds/run_seeds.py

# Alembic migrations
alembic upgrade head
```

---

## Troubleshooting

### Port Already in Use?
```bash
# Backend - use different port
uvicorn app:app --reload --port 8001

# Frontend - use different port
npm run dev -- --port 5174
```

### PyAudio Installation Issues?
Skip it for now (only needed for voice features):
```bash
pip install fastapi uvicorn pydantic sqlalchemy alembic
```

### CORS Errors?
Edit `backend/.env`:
```env
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:8000"]
```

---

## What's Next?

✅ **Local works?** → Check `DEPLOYMENT_CHECKLIST.md`  
🐳 **Ready for Docker?** → See `docker/docker-compose.yml`  
☸️ **Ready for Kubernetes?** → Create k8s manifests  

---

## Need Detailed Instructions?

See **LOCAL_SETUP_GUIDE.md** for complete step-by-step guide.
