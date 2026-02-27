#!/bin/bash

# CodeLens AI Deployment Script
echo "🚀 Deploying CodeLens AI..."

# Check if running in correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "❌ Error: This script must be run from the project root directory"
  exit 1
fi

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

# Push to registry (if credentials exist)
if [ -n "$DOCKER_USERNAME" ]; then
  echo "📤 Pushing images to registry..."
  docker-compose push
fi

# Deploy to Kubernetes
echo "☸️  Deploying to Kubernetes..."
kubectl apply -f kubernetes/

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/codelens-backend
kubectl rollout status deployment/codelens-frontend

echo "✅ Deployment completed successfully!"
echo "🌐 Access your application at http://codelens.local"
