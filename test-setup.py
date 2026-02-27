#!/usr/bin/env python3
"""
Quick setup verification script for CodeLens AI
Run this to check if your environment is ready
"""

import sys
import subprocess
import os

def check_command(command, name, min_version=None):
    """Check if a command exists and optionally verify version"""
    try:
        result = subprocess.run(
            [command, '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.strip() or result.stderr.strip()
            print(f"✅ {name}: {version.split()[0] if version else 'installed'}")
            return True
        else:
            print(f"❌ {name}: Not found")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        print(f"❌ {name}: Not found")
        return False

def check_file(filepath, name):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {name}: Found")
        return True
    else:
        print(f"⚠️  {name}: Not found")
        return False

def check_directory(dirpath, name):
    """Check if a directory exists"""
    if os.path.isdir(dirpath):
        print(f"✅ {name}: Found")
        return True
    else:
        print(f"⚠️  {name}: Not found")
        return False

def main():
    print("=" * 60)
    print("CodeLens AI - Setup Verification")
    print("=" * 60)
    print()
    
    # Check prerequisites
    print("Checking Prerequisites:")
    print("-" * 60)
    python_ok = check_command('python', 'Python')
    node_ok = check_command('node', 'Node.js')
    npm_ok = check_command('npm', 'npm')
    git_ok = check_command('git', 'Git')
    print()
    
    # Check project structure
    print("Checking Project Structure:")
    print("-" * 60)
    backend_ok = check_directory('backend', 'Backend directory')
    frontend_ok = check_directory('frontend', 'Frontend directory')
    docker_ok = check_directory('docker', 'Docker directory')
    print()
    
    # Check backend files
    print("Checking Backend Files:")
    print("-" * 60)
    app_ok = check_file('backend/app.py', 'Main app file')
    req_ok = check_file('backend/requirements.txt', 'Requirements file')
    env_example_ok = check_file('backend/.env.examples', 'Environment example')
    env_ok = check_file('backend/.env', 'Environment file')
    if not env_ok:
        print("   ℹ️  Run: cp backend/.env.examples backend/.env")
    print()
    
    # Check frontend files
    print("Checking Frontend Files:")
    print("-" * 60)
    package_ok = check_file('frontend/package.json', 'Package.json')
    index_ok = check_file('frontend/index.html', 'Index.html')
    print()
    
    # Check virtual environment
    print("Checking Virtual Environment:")
    print("-" * 60)
    venv_ok = check_directory('backend/venv', 'Virtual environment')
    if not venv_ok:
        print("   ℹ️  Run: cd backend && python -m venv venv")
    print()
    
    # Check node_modules
    print("Checking Node Modules:")
    print("-" * 60)
    node_modules_ok = check_directory('frontend/node_modules', 'Node modules')
    if not node_modules_ok:
        print("   ℹ️  Run: cd frontend && npm install")
    print()
    
    # Summary
    print("=" * 60)
    print("Summary:")
    print("=" * 60)
    
    all_checks = [
        python_ok, node_ok, npm_ok, backend_ok, frontend_ok,
        app_ok, req_ok, package_ok
    ]
    
    passed = sum(all_checks)
    total = len(all_checks)
    
    print(f"Passed: {passed}/{total} checks")
    print()
    
    if passed == total and env_ok and venv_ok and node_modules_ok:
        print("🎉 Your environment is ready!")
        print()
        print("Next steps:")
        print("1. Terminal 1: cd backend && source venv/Scripts/activate && python app.py")
        print("2. Terminal 2: cd frontend && npm run dev")
        print("3. Open browser: http://localhost:5173")
    elif passed == total:
        print("⚠️  Almost ready! Complete these steps:")
        if not env_ok:
            print("   • Create .env file: cp backend/.env.examples backend/.env")
        if not venv_ok:
            print("   • Create virtual env: cd backend && python -m venv venv")
        if not node_modules_ok:
            print("   • Install dependencies: cd frontend && npm install")
    else:
        print("❌ Some prerequisites are missing.")
        print("   Please install missing components and try again.")
    
    print()
    print("For detailed instructions, see: LOCAL_SETUP_GUIDE.md")
    print("=" * 60)

if __name__ == "__main__":
    main()
