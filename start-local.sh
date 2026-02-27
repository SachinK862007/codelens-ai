#!/bin/bash
# CodeLens AI - Local Startup Script
# This script helps you start the application locally

echo "🚀 CodeLens AI - Local Setup"
echo "=============================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python version: $(python --version)"
echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.examples .env
    echo "⚠️  Please edit backend/.env file with your settings!"
fi

# Initialize database
echo "Initializing database..."
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)" 2>/dev/null

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "✅ Node modules already installed"
fi

echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "=============================="
echo "🎉 Setup Complete!"
echo "=============================="
echo ""
echo "To start the application, open TWO terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd codelens-ai/backend"
echo "  source venv/Scripts/activate"
echo "  python app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd codelens-ai/frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
