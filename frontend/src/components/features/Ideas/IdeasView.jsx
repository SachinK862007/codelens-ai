// frontend/src/components/features/Ideas/IdeasView.jsx
import React, { useState } from 'react';
import { FaLightbulb, FaRocket, FaBook, FaCodeBranch, FaSearch } from 'react-icons/fa';
import FlowChart from '../../core/FlowChart';
import ChatInterface from '../../core/ChatInterface';
import ProgressBar from '../../core/ProgressBar';

const IdeasView = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [projectPlan, setProjectPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Popular project ideas
  const popularIdeas = [
    {
      id: 1,
      title: "Todo List Application",
      description: "A web app to manage daily tasks with categories and priorities",
      difficulty: "beginner",
      estimated_time: "1-2 weeks",
      tags: ["web", "productivity", "crud"]
    },
    {
      id: 2,
      title: "Weather Dashboard",
      description: "Display current weather and forecasts using API integration",
      difficulty: "intermediate",
      estimated_time: "2-3 weeks",
      tags: ["api", "data-visualization", "web"]
    },
    {
      id: 3,
      title: "Personal Finance Tracker",
      description: "Track income, expenses, and generate financial reports",
      difficulty: "intermediate",
      estimated_time: "3-4 weeks",
      tags: ["finance", "data-analysis", "charts"]
    },
    {
      id: 4,
      title: "Quiz Application",
      description: "Create and take quizzes with multiple question types",
      difficulty: "beginner",
      estimated_time: "2-3 weeks",
      tags: ["education", "games", "web"]
    }
  ];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setProjectPlan(null);
    
    try {
      // Simulate API call to backend
      // In real implementation: await api.post('/ideas/generate-plan', { 
      //   idea_description: projectIdea, 
      //   skill_level: skillLevel 
      // })
      
      // Mock response for demo
      setTimeout(() => {
        const mockPlan = {
          title: "Todo List Application",
          steps: [
            "Set up project structure with HTML, CSS, and JavaScript files",
            "Create basic HTML structure with input field and list container",
            "Add CSS styling for a clean, modern look",
            "Implement JavaScript functions to add, remove, and mark tasks",
            "Add local storage to persist tasks between sessions",
            "Implement filtering options (all, active, completed)",
            "Add responsive design for mobile devices"
          ],
          algorithm: `1. Initialize empty task array
2. Display input field and task list
3. On "Add" button click:
   - Get input value
   - Validate input (not empty)
   - Create task object with id, text, completed status
   - Add to task array
   - Update display
4. On task click:
   - Toggle completed status
   - Update display
5. On delete click:
   - Remove task from array
   - Update display
6. On filter change:
   - Show/hide tasks based on filter
7. Save to localStorage on every change`,
          language: "JavaScript",
          language_justification: "JavaScript is ideal for web-based applications and has excellent browser support",
          files: [
            { name: "index.html", purpose: "Main HTML structure", lines: 50 },
            { name: "style.css", purpose: "Styling and layout", lines: 100 },
            { name: "script.js", purpose: "Application logic", lines: 150 },
            { name: "README.md", purpose: "Project documentation", lines: 20 }
          ],
          resources: [
            { title: "MDN Web Docs - JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
            { title: "CSS Tricks", url: "https://css-tricks.com/" },
            { title: "freeCodeCamp", url: "https://www.freecodecamp.org/" }
          ],
          pitfalls: [
            { issue: "DOM manipulation errors", mitigation: "Use querySelector carefully and check for null" },
            { issue: "Event listener duplication", mitigation: "Remove listeners before adding new ones" },
            { issue: "localStorage quota exceeded", mitigation: "Implement cleanup and error handling" }
          ],
          mermaid: `graph TD
    A[Start] --> B[Initialize App]
    B --> C[Setup Event Listeners]
    C --> D[Load Tasks from Storage]
    D --> E[Display Tasks]
    E --> F{User Action}
    F -->|Add Task| G[Validate Input]
    G --> H[Create Task Object]
    H --> I[Add to Array]
    I --> J[Update Display]
    J --> K[Save to Storage]
    K --> E
    F -->|Complete Task| L[Toggle Status]
    L --> M[Update Display]
    M --> N[Save to Storage]
    N --> E
    F -->|Delete Task| O[Remove from Array]
    O --> P[Update Display]
    P --> Q[Save to Storage]
    Q --> E
    F -->|Filter Tasks| R[Apply Filter]
    R --> S[Update Display]
    S --> E`,
          estimated_time: "2-3 weeks",
          difficulty: "beginner"
        };
        
        setProjectPlan(mockPlan);
        setIsGenerating(false);
      }, 2000);
      
    } catch (err) {
      console.error('Plan generation error:', err);
      setIsGenerating(false);
    }
  };

  const handleSelectIdea = (idea) => {
    setProjectIdea(idea.title);
    setSelectedIdea(idea);
  };

  const handleSendMessage = (message) => {
    const newMessage = { sender: 'user', text: message };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        sender: 'assistant',
        text: `Great idea! For a ${projectIdea || 'project like this'}, I recommend starting with a simple prototype to validate your concept. Focus on core functionality first, then gradually add advanced features.`
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FaLightbulb className="text-yellow-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Project Ideas</h1>
            <p className="text-gray-600">Turn your ideas into actionable development plans</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Ideas Generated</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Projects Started</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">Currently Active</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input and Popular Ideas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-700 flex items-center">
                <FaRocket className="mr-2 text-blue-500" />
                Describe Your Project Idea
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="e.g., I want to build a weather app that shows forecasts..."
                className="w-full h-32 border rounded p-3 text-sm"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating || !projectIdea.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <FaRocket />
                <span>{isGenerating ? 'Generating Plan...' : 'Generate Plan'}</span>
              </button>
              
              <div className="text-xs text-gray-500">
                Get a complete roadmap including steps, resources, and implementation guide
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-700 flex items-center">
                <FaSearch className="mr-2 text-purple-500" />
                Popular Ideas to Try
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {popularIdeas.map((idea) => (
                <div 
                  key={idea.id}
                  className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedIdea?.id === idea.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectIdea(idea)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{idea.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{idea.description}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      idea.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      idea.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {idea.difficulty}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Est. time: {idea.estimated_time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Output and Chat */}
        <div className="lg:col-span-2 space-y-6">
          {projectPlan ? (
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">{projectPlan.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skillLevel}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {projectPlan.language}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <FaCodeBranch className="mr-2 text-blue-500" />
                      Implementation Steps
                    </h3>
                    <ol className="space-y-2">
                      {projectPlan.steps.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="font-bold text-blue-600 mr-2">{index + 1}.</span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <FaBook className="mr-2 text-green-500" />
                      Algorithm Overview
                    </h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {projectPlan.algorithm}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* File Structure */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-700">File Structure</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectPlan.files.map((file, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="font-medium text-blue-700">{file.name}</div>
                        <div className="text-sm text-gray-600">{file.purpose}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ~{file.lines} lines
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Resources */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-700">Learning Resources</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {projectPlan.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {resource.title}
                        </a>
                        <span className="text-xs text-gray-500">↗</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Common Pitfalls */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-700">Common Pitfalls & Solutions</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {projectPlan.pitfalls.map((pitfall, index) => (
                      <div key={index} className="border-l-4 border-red-300 pl-3">
                        <div className="font-medium text-red-700">{pitfall.issue}</div>
                        <div className="text-sm text-gray-600">Solution: {pitfall.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Flowchart */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-700">Project Flowchart</h3>
                </div>
                <div className="p-4">
                  <FlowChart 
                    chartDefinition={projectPlan.mermaid} 
                    title="Project Architecture"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              <FaLightbulb className="mx-auto text-4xl mb-4 text-yellow-400" />
              <h3 className="text-lg font-medium mb-2">Describe Your Project Idea</h3>
              <p>Enter your project concept above and click &quot;Generate Plan&quot; to get started</p>
              <div className="mt-6">
                <ProgressBar value={35} maxValue={100} label="Idea Inspiration" color="yellow" animated />
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={false}
              placeholder="Ask questions about your project idea or planning process..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeasView;
