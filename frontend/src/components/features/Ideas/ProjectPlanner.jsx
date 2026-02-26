// frontend/src/components/features/Ideas/ProjectPlanner.jsx
import React, { useState } from 'react';
import { FaTasks, FaCalendar, FaUsers, FaChartLine } from 'react-icons/fa';
import ProgressBar, { CircularProgress } from '../../core/ProgressBar';

const ProjectPlanner = ({ plan, onPlanUpdate }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Project Setup', completed: true, dueDate: '2024-01-15' },
    { id: 2, title: 'Core Features', completed: false, dueDate: '2024-01-30' },
    { id: 3, title: 'Testing & Debugging', completed: false, dueDate: '2024-02-15' },
    { id: 4, title: 'Deployment', completed: false, dueDate: '2024-02-28' }
  ]);

  if (!plan) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-medium mb-2">No Project Plan</h3>
        <p>Generate a project idea to see planning details</p>
      </div>
    );
  }

  const completionPercentage = milestones.filter(m => m.completed).length / milestones.length * 100;

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Project Planner: {plan.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1 rounded text-sm ${
              activeSection === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('timeline')}
            className={`px-3 py-1 rounded text-sm ${
              activeSection === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveSection('resources')}
            className={`px-3 py-1 rounded text-sm ${
              activeSection === 'resources' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Resources
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <CircularProgress 
                  value={completionPercentage} 
                  maxValue={100} 
                  size="sm" 
                  color="blue"
                />
                <div className="text-sm font-medium text-blue-800 mt-2">Progress</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {plan.steps?.length || 0}
                </div>
                <div className="text-sm text-green-800">Steps</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {plan.files?.length || 0}
                </div>
                <div className="text-sm text-purple-800">Files</div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {plan.resources?.length || 0}
                </div>
                <div className="text-sm text-yellow-800">Resources</div>
              </div>
            </div>
            
            {/* Milestones */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <FaTasks className="mr-2 text-blue-500" />
                Project Milestones
              </h4>
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id} 
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => {
                          const updated = milestones.map(m => 
                            m.id === milestone.id ? {...m, completed: !m.completed} : m
                          );
                          setMilestones(updated);
                        }}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {milestone.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {milestone.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      milestone.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Key Metrics */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <FaChartLine className="mr-2 text-purple-500" />
                Project Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Estimated Time</div>
                  <div className="text-lg font-bold text-gray-800">
                    {plan.estimated_time || '2-3 weeks'}
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Difficulty Level</div>
                  <div className="text-lg font-bold text-gray-800">
                    {plan.difficulty || 'Intermediate'}
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Primary Language</div>
                  <div className="text-lg font-bold text-gray-800">
                    {plan.language || 'JavaScript'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'timeline' && (
          <div className="space-y-6">
            <h4 className="font-medium mb-3 flex items-center">
              <FaCalendar className="mr-2 text-green-500" />
              Project Timeline
            </h4>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-8 ml-12">
                {[
                  { week: 'Week 1', title: 'Project Setup', description: 'Initialize repository, set up development environment' },
                  { week: 'Week 2-3', title: 'Core Development', description: 'Implement main features and functionality' },
                  { week: 'Week 4', title: 'Testing', description: 'Unit tests, integration tests, bug fixes' },
                  { week: 'Week 5', title: 'Deployment', description: 'Deploy to production, documentation' }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="font-medium text-blue-600">{item.week}</div>
                      <div className="font-bold text-lg mt-1">{item.title}</div>
                      <div className="text-gray-600 mt-2">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'resources' && (
          <div className="space-y-6">
            <h4 className="font-medium mb-3 flex items-center">
              <FaUsers className="mr-2 text-purple-500" />
              Learning Resources & Team
            </h4>
            
            <div>
              <h5 className="font-medium mb-2">Recommended Resources</h5>
              <div className="space-y-2">
                {plan.resources?.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📄</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{resource.title}</div>
                        <div className="text-xs text-gray-500">{resource.url}</div>
                      </div>
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit
                    </a>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">
                    No resources available for this project
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Team Roles (Solo Project)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { role: 'Developer', responsibilities: 'Code implementation, debugging' },
                  { role: 'Designer', responsibilities: 'UI/UX design, styling' },
                  { role: 'Tester', responsibilities: 'Quality assurance, bug reporting' },
                  { role: 'Documenter', responsibilities: 'Documentation, README writing' }
                ].map((member, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-medium text-gray-800">{member.role}</div>
                    <div className="text-sm text-gray-600">{member.responsibilities}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPlanner;
