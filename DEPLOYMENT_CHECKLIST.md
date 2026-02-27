# CodeLens AI - Deployment Checklist

Use this checklist to track your deployment progress.

## Phase 1: Local Development ✓

### Prerequisites
- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] Git installed
- [ ] Code editor (VS Code, etc.)

### Backend Setup
- [ ] Navigate to `backend` directory
- [ ] Create virtual environment (`python -m venv venv`)
- [ ] Activate virtual environment
- [ ] Install Python dependencies (`pip install -r requirements.txt`)
- [ ] Create `.env` file from `.env.examples`
- [ ] Edit `.env` with your settings
- [ ] Initialize database
- [ ] Start backend server (`python app.py`)
- [ ] Verify backend at `http://localhost:8000/health`
- [ ] Check API docs at `http://localhost:8000/docs`

### Frontend Setup
- [ ] Navigate to `frontend` directory
- [ ] Install Node dependencies (`npm install`)
- [ ] Start frontend server (`npm run dev`)
- [ ] Verify frontend at `http://localhost:5173`

### Testing
- [ ] Register a new user
- [ ] Login successfully
- [ ] Test "Try Me" feature
- [ ] Test "Debug" feature
- [ ] Test "Ideas" feature
- [ ] Test "Practice" feature
- [ ] Check browser console for errors
- [ ] Check backend logs for errors

---

## Phase 2: Docker Deployment 🐳

### Docker Prerequisites
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Docker daemon running

### Docker Setup
- [ ] Review `docker/docker-compose.yml`
- [ ] Review `docker/backend.Dockerfile`
- [ ] Review `docker/frontend.Dockerfile`
- [ ] Update environment variables in docker-compose
- [ ] Build Docker images
- [ ] Start containers with docker-compose
- [ ] Verify all containers are running
- [ ] Test application through Docker
- [ ] Check container logs

### Docker Commands
```bash
# Build and start
docker-compose -f docker/docker-compose.yml up --build

# Stop containers
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

---

## Phase 3: Kubernetes Deployment ☸️

### Kubernetes Prerequisites
- [ ] Kubernetes cluster available (minikube, k3s, or cloud)
- [ ] kubectl installed and configured
- [ ] Container registry access (Docker Hub, etc.)

### Kubernetes Setup
- [ ] Create Kubernetes manifests
  - [ ] Namespace
  - [ ] ConfigMaps
  - [ ] Secrets
  - [ ] Backend Deployment
  - [ ] Frontend Deployment
  - [ ] Services
  - [ ] Ingress (optional)
- [ ] Push Docker images to registry
- [ ] Apply Kubernetes manifests
- [ ] Verify pods are running
- [ ] Verify services are accessible
- [ ] Set up persistent volumes (if needed)
- [ ] Configure ingress/load balancer

### Kubernetes Commands
```bash
# Create namespace
kubectl create namespace codelens-ai

# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods -n codelens-ai
kubectl get services -n codelens-ai

# View logs
kubectl logs -f <pod-name> -n codelens-ai
```

---

## Phase 4: Production Readiness 🚀

### Security
- [ ] Change all default secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up authentication
- [ ] Enable rate limiting
- [ ] Review security policies

### Monitoring
- [ ] Set up logging
- [ ] Configure monitoring (Prometheus, etc.)
- [ ] Set up alerts
- [ ] Configure health checks
- [ ] Set up backup strategy

### Performance
- [ ] Load testing
- [ ] Database optimization
- [ ] Caching strategy (Redis)
- [ ] CDN for static assets
- [ ] Resource limits configured

### Documentation
- [ ] Update README with deployment info
- [ ] Document environment variables
- [ ] Create runbooks for common issues
- [ ] Document backup/restore procedures

---

## Current Status

**Date Started:** _____________

**Current Phase:** Phase 1 - Local Development

**Notes:**
- 
- 
- 

---

## Quick Reference

### Local Development URLs
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

### Important Files
- Backend config: `backend/.env`
- Frontend config: `frontend/vite.config.js`
- Docker compose: `docker/docker-compose.yml`
- Setup guide: `LOCAL_SETUP_GUIDE.md`

### Support
- Documentation: `docs/` folder
- Issues: Check logs in both terminals
- API Reference: http://localhost:8000/docs
