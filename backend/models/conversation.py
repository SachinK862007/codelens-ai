# backend/models/conversation.py
"""
Chat history and conversation models
Handles user interactions and conversation tracking
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    ERROR = "error"

class MessageBase(BaseModel):
    content: str
    message_type: MessageType
    feature: str  # try_me, debug, ideas, practice

class MessageCreate(MessageBase):
    conversation_id: Optional[int] = None
    user_id: int

class Message(MessageBase):
    id: int
    conversation_id: int
    user_id: int
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None  # Store code, trace data, etc.
    
    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: Optional[str] = None
    feature: str

class ConversationCreate(ConversationBase):
    user_id: int

class Conversation(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    message_count: int = 0
    
    class Config:
        from_attributes = True

class ConversationWithMessages(Conversation):
    messages: List[Message]

class ConversationSummary(BaseModel):
    id: int
    title: str
    feature: str
    message_count: int
    created_at: datetime
    updated_at: datetime

class ChatSession(BaseModel):
    conversation_id: int
    user_id: int
    current_feature: str
    session_start: datetime
    last_activity: datetime
    is_active: bool = True

class ChatAnalytics(BaseModel):
    total_conversations: int
    total_messages: int
    avg_messages_per_conversation: float
    most_used_feature: str
    conversation_duration_stats: Dict[str, float]  # avg, min, max duration
    user_engagement_score: float  # Based on frequency and duration

class Feedback(BaseModel):
    id: int
    user_id: int
    conversation_id: Optional[int] = None
    message_id: Optional[int] = None
    rating: int  # 1-5 stars
    comment: Optional[str] = None
    feature: str
    submitted_at: datetime
    
    class Config:
        from_attributes = True

class ConversationExport(BaseModel):
    conversation: Conversation
    messages: List[Message]
    export_format: str  # json, pdf, txt
    export_timestamp: datetime

class ConversationSearchResult(BaseModel):
    conversation_id: int
    title: str
    excerpt: str  # Snippet of relevant message
    relevance_score: float
    timestamp: datetime
