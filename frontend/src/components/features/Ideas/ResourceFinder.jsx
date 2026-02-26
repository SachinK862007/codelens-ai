// frontend/src/components/features/Ideas/ResourceFinder.jsx
import React, { useState } from 'react';
import { FaBook, FaVideo, FaCode, FaExternalLinkAlt, FaStar, FaClock } from 'react-icons/fa';

const ResourceFinder = ({ topic = '', onTopicChange }) => {
  const [searchQuery, setSearchQuery] = useState(topic);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock resources data
  const mockResources = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      type: "article",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      description: "Comprehensive guide to JavaScript basics",
      difficulty: "beginner",
      duration: "2 hours",
      rating: 4.8,
      tags: ["javascript", "fundamentals", "web"]
    },
    {
      id: 2,
      title: "React Hooks Tutorial",
      type: "video",
      url: "https://youtube.com/watch?v=...",
      description: "Learn React Hooks with practical examples",
      difficulty: "intermediate",
      duration: "45 min",
      rating: 4.9,
      tags: ["react", "hooks", "frontend"]
    },
    {
      id: 3,
      title: "Python Data Structures",
      type: "course",
      url: "https://coursera.org/...",
      description: "Master data structures in Python",
      difficulty: "intermediate",
      duration: "6 weeks",
      rating: 4.7,
      tags: ["python", "data-structures", "algorithms"]
    },
    {
      id: 4,
      title: "CSS Grid Layout",
      type: "interactive",
      url: "https://cssgrid.io",
      description: "Interactive tutorial on CSS Grid",
      difficulty: "beginner",
      duration: "1 hour",
      rating: 4.6,
      tags: ["css", "layout", "frontend"]
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    onTopicChange && onTopicChange(searchQuery);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockResources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
      );
      setResources(filtered);
      setIsLoading(false);
    }, 800);
  };

  const filteredResources = resources.filter(resource => {
    if (activeFilter === 'all') return true;
    return resource.type === activeFilter;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'article': return <FaBook className="text-blue-500" />;
      case 'video': return <FaVideo className="text-red-500" />;
      case 'course': return <FaBook className="text-green-500" />;
      case 'interactive': return <FaCode className="text-purple-500" />;
      default: return <FaExternalLinkAlt className="text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700 flex items-center">
          <FaBook className="mr-2 text-blue-500" />
          Resource Finder
        </h3>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for learning resources..."
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['all', 'article', 'video', 'course', 'interactive'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Finding the best resources...</span>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>Enter a topic to find relevant learning resources</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => setSearchQuery('javascript')}
                className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                JavaScript
              </button>
              <button 
                onClick={() => setSearchQuery('python')}
                className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Python
              </button>
              <button 
                onClick={() => setSearchQuery('react')}
                className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                React
              </button>
              <button 
                onClick={() => setSearchQuery('css')}
                className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                CSS
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Found {filteredResources.length} resources for "{searchQuery}"
            </div>
            
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {resource.title}
                        </a>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {resource.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm">
                      <FaStar className="text-yellow-500" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <FaClock />
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {resources.length > 0 ? `${resources.length} resources available` : 'No resources loaded'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setResources(mockResources)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Load Sample
            </button>
            <button
              onClick={() => setResources([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFinder;
