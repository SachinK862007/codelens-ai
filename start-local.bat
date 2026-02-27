@echo off
REM CodeLens AI - Local Startup Script for Windows
REM This script helps you start the application locally

echo ================================
echo CodeLens AI - Local Setup
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.9+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo [OK] Python version:
python --version
echo [OK] Node.js version:
node --version
echo.

REM Backend Setup
echo ================================
echo Setting up Backend...
echo ================================
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip -q
pip install -r requirements.txt

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.examples .env
    echo [WARNING] Please edit backend\.env file with your settings!
)

REM Initialize database
echo Initializing database...
python -c "from database.connection import Base, engine; Base.metadata.create_all(bind=engine)" 2>nul

echo [OK] Backend setup complete!
echo.

REM Frontend Setup
echo ================================
echo Setting up Frontend...
echo ================================
cd ..\frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
) else (
    echo [OK] Node modules already installed
)

echo [OK] Frontend setup complete!
echo.

REM Instructions
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application, open TWO command prompts:
echo.
echo Terminal 1 (Backend):
echo   cd codelens-ai\backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo Terminal 2 (Frontend):
echo   cd codelens-ai\frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:5173
echo.
pause
