#!/bin/bash

# CodeLens AI Setup Script
echo "🚀 Setting up CodeLens AI development environment..."

# Check if running on supported OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux detected"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected"
else
    echo "⚠️  Unsupported OS. Please use Linux or macOS."
    exit 1
fi

# Install system dependencies
echo "📦 Installing system dependencies..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip nodejs npm git curl
elif command -v brew &> /dev/null; then
    brew install python node git
else
    echo "⚠️  Package manager not found. Please install dependencies manually."
    exit 1
fi

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Install Node.js dependencies
echo "🌐 Installing Node.js dependencies..."
cd ../frontend
npm install

# Create environment files
echo "🔧 Creating environment configuration..."
cd ../backend
cp .env.example .env
echo "DATABASE_URL=sqlite:///./codelens.db" >> .env
echo "SECRET_KEY=$(openssl rand -hex 32)" >> .env

# Initialize database
echo "🗄️  Initializing database..."
alembic upgrade head

# Download AI models (using Ollama for local inference)
echo "🤖 Downloading AI models..."
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama for local AI models..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ollama
    fi
fi

# Pull required models
ollama pull codellama
ollama pull whisper
ollama pull stablelm-zephyr

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run backend: cd backend && source venv/bin/activate && uvicorn app:app --reload"
echo "2. Run frontend: cd frontend && npm run dev"
echo "3. Access the app at http://localhost:3000"
echo ""
echo "🎉 Happy coding with CodeLens AI!"
