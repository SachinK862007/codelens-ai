# backend/app.py
"""
Main FastAPI application for CodeLens AI
Central application configuration and startup
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

from backend.config.settings import settings
from backend.api import try_me, debug, practice
from backend.api.ideas import router as ideas_router
from backend.api.auth import router as auth_router
from backend.api.voice import router as voice_router

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI-powered coding tutor with visual execution tracing"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router)
app.include_router(try_me.router)
app.include_router(debug.router)
app.include_router(practice.router)
app.include_router(ideas_router)
app.include_router(voice_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.version,
        "debug": settings.debug
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to CodeLens AI API",
        "documentation": "/docs",
        "version": settings.version,
        "features": [
            "Try Me - Visual code execution",
            "Debug - Error analysis and correction",
            "Ideas - Project planning assistance",
            "Practice - Structured learning path"
        ]
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
