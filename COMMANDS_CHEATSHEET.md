# 🎯 Commands Cheat Sheet

## 🚀 Start Application

### Backend (Terminal 1)
```bash
cd codelens-ai/backend
source venv/Scripts/activate
python app.py
```

### Frontend (Terminal 2)
```bash
cd codelens-ai/frontend
npm run dev
```

---

## 🔧 First Time Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.examples .env
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## 🛑 Stop Application

```bash
# In each terminal
Ctrl + C

# Deactivate venv
deactivate
```

---

## 🔍 Check Status

```bash
# Test environment
python test-setup.py

# Check backend health
curl http://localhost:8000/health

# Check if ports are in use
netstat -an | grep 8000
netstat -an | grep 5173
```

---

## 🗄️ Database Commands

```bash
cd backend

# Initialize database
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)"

# Run seeds
python database/seeds/run_seeds.py

# Alembic migrations
alembic upgrade head
alembic revision --autogenerate -m "description"
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Lint backend
cd backend
pylint backend/

# Lint frontend
cd frontend
npm run lint
```

---

## 📦 Build for Production

```bash
# Frontend build
cd frontend
npm run build

# Preview production build
npm run preview
```

---

## 🐳 Docker Commands

```bash
# Build and start
docker-compose -f docker/docker-compose.yml up --build

# Start in background
docker-compose -f docker/docker-compose.yml up -d

# Stop
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Rebuild specific service
docker-compose -f docker/docker-compose.yml build backend
docker-compose -f docker/docker-compose.yml build frontend
```

---

## 🔄 Restart Services

```bash
# Backend only
cd backend
source venv/Scripts/activate
python app.py

# Frontend only
cd frontend
npm run dev

# Both (use two terminals)
# Terminal 1: backend commands
# Terminal 2: frontend commands
```

---

## 🧹 Clean Up

```bash
# Remove Python cache
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Remove node_modules
rm -rf frontend/node_modules

# Remove virtual environment
rm -rf backend/venv

# Remove database
rm backend/codelens.db

# Remove build files
rm -rf frontend/dist
```

---

## 🔐 Environment Variables

```bash
# Edit backend environment
cd backend
notepad .env  # Windows
nano .env     # Linux/Mac

# Required variables:
# SECRET_KEY=your-secret-key
# DATABASE_URL=sqlite:///./codelens.db
# ALLOWED_ORIGINS=["http://localhost:5173"]
```

---

## 🐛 Troubleshooting

```bash
# Check Python version
python --version

# Check Node version
node --version
npm --version

# Check if virtual env is activated
which python  # Should show venv path

# Reinstall dependencies
cd backend
pip install -r requirements.txt --force-reinstall

cd frontend
rm -rf node_modules
npm install

# Check for port conflicts
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :8000
lsof -i :5173
```

---

## 📊 Logs & Debugging

```bash
# View backend logs
cd backend
tail -f test_output.log

# Run backend with debug
cd backend
uvicorn app:app --reload --log-level debug

# Check frontend console
# Open browser DevTools (F12)
# Check Console tab for errors
```

---

## 🔄 Update Dependencies

```bash
# Update Python packages
cd backend
pip install --upgrade -r requirements.txt

# Update Node packages
cd frontend
npm update

# Check for outdated packages
pip list --outdated
npm outdated
```

---

## 💾 Backup & Restore

```bash
# Backup database
cp backend/codelens.db backend/codelens.db.backup

# Restore database
cp backend/codelens.db.backup backend/codelens.db

# Export environment
cd backend
pip freeze > requirements-frozen.txt
```

---

## 🎯 Quick Actions

| Action | Command |
|--------|---------|
| Start backend | `cd backend && source venv/Scripts/activate && python app.py` |
| Start frontend | `cd frontend && npm run dev` |
| Stop all | `Ctrl + C` in both terminals |
| Check health | `curl http://localhost:8000/health` |
| View API docs | Open http://localhost:8000/docs |
| Reset database | `rm backend/codelens.db && restart backend` |
| Clean install | `rm -rf venv node_modules && setup again` |

---

## 📱 Platform-Specific

### Windows (bash)
```bash
source venv/Scripts/activate
```

### Windows (PowerShell)
```powershell
.\venv\Scripts\Activate.ps1
```

### Linux/Mac
```bash
source venv/bin/activate
```

---

## 🆘 Emergency Reset

```bash
# Complete reset (use with caution!)
cd codelens-ai

# Remove all generated files
rm -rf backend/venv
rm -rf backend/__pycache__
rm -rf backend/**/__pycache__
rm backend/codelens.db
rm -rf frontend/node_modules
rm -rf frontend/dist

# Start fresh
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.examples .env

cd ../frontend
npm install
```

---

**💡 Tip:** Bookmark this page for quick reference!
