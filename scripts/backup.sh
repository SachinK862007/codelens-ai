#!/bin/bash

# CodeLens AI Backup Script
echo "💾 Starting backup process..."

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup database
echo "🗄️  Backing up database..."
if [ -f "backend/codelens.db" ]; then
  cp backend/codelens.db "$BACKUP_DIR/database_backup.db"
  echo "✅ Database backed up to $BACKUP_DIR/database_backup.db"
else
  echo "⚠️  Database file not found"
fi

# Backup environment files
echo "⚙️  Backing up environment files..."
if [ -f "backend/.env" ]; then
  cp backend/.env "$BACKUP_DIR/env_backup"
  echo "✅ Environment file backed up to $BACKUP_DIR/env_backup"
fi

# Backup user data (if exists)
echo "👥 Backing up user data..."
if [ -d "data" ]; then
  tar -czf "$BACKUP_DIR/user_data.tar.gz" data/
  echo "✅ User data backed up to $BACKUP_DIR/user_data.tar.gz"
fi

# Create backup archive
echo "📦 Creating backup archive..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

# Clean up temporary directory
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed successfully!"
echo "📁 Backup saved to ${BACKUP_DIR}.tar.gz"
