// frontend/src/components/core/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaTrash, FaDownload } from 'react-icons/fa';

const ChatInterface = ({ 
  messages = [], 
  onSendMessage, 
  onClearChat, 
  isLoading = false,
  placeholder = "Ask me anything about your code..."
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codelens-chat-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 flex items-center">
          <FaRobot className="mr-2 text-blue-500" />
          Code Assistant
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={exportChat}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Export Chat"
          >
            <FaDownload size={14} />
          </button>
          <button
            onClick={onClearChat}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Clear Chat"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium mb-2">Start a Conversation</h3>
            <p className="text-center">Ask questions about your code, get explanations, or request help with debugging</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-4xl rounded-2xl px-4 py-3
                ${message.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.sender === 'user' ? (
                  <div className="flex items-start space-x-2">
                    <FaUser className="mt-1 text-sm" />
                    <div>
                      <div className="font-medium">You</div>
                      <div className="mt-1">{message.text}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <FaRobot className="mt-1 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-600">Assistant</div>
                      <div className="mt-1 whitespace-pre-wrap">{message.text}</div>
                      {message.code && (
                        <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                          {message.code}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-blue-500" />
                <div>
                  <div className="font-medium text-blue-600">Assistant</div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`self-end h-12 w-12 rounded-full flex items-center justify-center ${
              !input.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors`}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
