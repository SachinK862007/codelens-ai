# 🚀 START HERE - CodeLens AI Local Setup

Welcome! This guide will help you run CodeLens AI on your local machine.

## 📋 What You Need

Before starting, make sure you have:
- ✅ Python 3.9 or higher
- ✅ Node.js 16 or higher
- ✅ Git
- ✅ A code editor (VS Code recommended)

## 🔍 Quick Check

Run this to verify your environment:
```bash
python test-setup.py
```

## 🎯 Three Ways to Get Started

### Option 1: Super Quick (5 minutes) ⚡
Follow **QUICK_START.md** - Just the essential commands

### Option 2: Detailed Guide (15 minutes) 📖
Follow **LOCAL_SETUP_GUIDE.md** - Step-by-step with explanations

### Option 3: Command Reference 📝
Use **RUN_COMMANDS.txt** - All commands in one place

## 🏃 Fastest Way to Start

### Terminal 1 - Backend:
```bash
cd codelens-ai/backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.examples .env
python app.py
```

### Terminal 2 - Frontend:
```bash
cd codelens-ai/frontend
npm install
npm run dev
```

### Open Browser:
Visit: http://localhost:5173

## ✅ Verify It Works

1. Backend health: http://localhost:8000/health
2. API docs: http://localhost:8000/docs
3. Frontend app: http://localhost:5173

## 📚 All Available Guides

| File | Purpose | When to Use |
|------|---------|-------------|
| **START_HERE.md** | You are here! | Starting point |
| **QUICK_START.md** | Fast setup | When you want to start quickly |
| **LOCAL_SETUP_GUIDE.md** | Detailed guide | When you need step-by-step help |
| **RUN_COMMANDS.txt** | Command reference | When you need specific commands |
| **DEPLOYMENT_CHECKLIST.md** | Progress tracker | Track your deployment progress |
| **test-setup.py** | Environment check | Verify prerequisites |

## 🐛 Having Issues?

### Common Problems:

1. **PyAudio won't install?**
   - Skip it for now (only needed for voice features)
   - See LOCAL_SETUP_GUIDE.md for workaround

2. **Port already in use?**
   - Backend: `uvicorn app:app --reload --port 8001`
   - Frontend: `npm run dev -- --port 5174`

3. **CORS errors?**
   - Check `backend/.env` has correct ALLOWED_ORIGINS

4. **Database errors?**
   - Delete `codelens.db` and restart backend

## 🎯 What's Next?

After getting it running locally:

1. ✅ Test all features (Try Me, Debug, Ideas, Practice)
2. ✅ Check logs for any errors
3. 🐳 Move to Docker deployment (see `docker/docker-compose.yml`)
4. ☸️ Then Kubernetes deployment

Use **DEPLOYMENT_CHECKLIST.md** to track your progress!

## 📞 Need Help?

- Check the logs in both terminals
- Review the documentation in `docs/` folder
- Visit API docs at http://localhost:8000/docs
- Check GitHub issues

## 🎉 Ready to Start?

Pick your preferred guide above and let's get CodeLens AI running!

---

**Quick Links:**
- [Quick Start](QUICK_START.md) - Fastest way
- [Detailed Guide](LOCAL_SETUP_GUIDE.md) - Step-by-step
- [Commands](RUN_COMMANDS.txt) - All commands
- [Checklist](DEPLOYMENT_CHECKLIST.md) - Track progress
