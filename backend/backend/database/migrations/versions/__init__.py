# backend/database/migrations/versions/20240101_init_tables.py
"""
Initial database schema migration

Revision ID: 20240101_init
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float

# revision identifiers, used by Alembic.
revision = '20240101_init'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create users table
    op.create_table('users',
        Column('id', Integer, primary_key=True),
        Column('email', String(255), unique=True, nullable=False),
        Column('username', String(50), unique=True, nullable=False),
        Column('full_name', String(100)),
        Column('hashed_password', String(255), nullable=False),
        Column('is_active', Boolean, default=True),
        Column('created_at', DateTime),
        Column('last_login', DateTime),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create exercises table
    op.create_table('exercises',
        Column('id', Integer, primary_key=True),
        Column('title', String(255), nullable=False),
        Column('description', Text),
        Column('difficulty', String(20)),
        Column('language', String(20)),
        Column('solution_template', Text),
        Column('points', Integer, default=10),
        Column('level_number', Integer),
        Column('is_active', Boolean, default=True),
        Column('created_at', DateTime),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create submissions table
    op.create_table('submissions',
        Column('id', Integer, primary_key=True),
        Column('exercise_id', Integer),
        Column('user_id', Integer),
        Column('code_content', Text),
        Column('status', String(20)),
        Column('points_earned', Integer, default=0),
        Column('submitted_at', DateTime),
        Column('graded_at', DateTime),
        Column('feedback', Text),
        sa.ForeignKeyConstraint(['exercise_id'], ['exercises.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create conversations table
    op.create_table('conversations',
        Column('id', Integer, primary_key=True),
        Column('user_id', Integer),
        Column('title', String(255)),
        Column('feature', String(50)),
        Column('created_at', DateTime),
        Column('updated_at', DateTime),
        Column('is_active', Boolean, default=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create messages table
    op.create_table('messages',
        Column('id', Integer, primary_key=True),
        Column('conversation_id', Integer),
        Column('user_id', Integer),
        Column('content', Text),
        Column('message_type', String(20)),
        Column('timestamp', DateTime),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('messages')
    op.drop_table('conversations')
    op.drop_table('submissions')
    op.drop_table('exercises')
    op.drop_table('users')
