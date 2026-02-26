// frontend/src/pages/Home.jsx
import React from 'react';
import { FaCode, FaBug, FaLightbulb, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import Card from '../components/common/Card';
import ProgressBar from '../components/core/ProgressBar';

const Home = () => {
  const features = [
    {
      icon: <FaCode className="text-blue-500 text-2xl" />,
      title: "Try Me",
      description: "Visualize code execution step-by-step with real-time variable tracking",
      path: "/try-me",
      color: "blue"
    },
    {
      icon: <FaBug className="text-red-500 text-2xl" />,
      title: "Debug",
      description: "Find and fix errors with AI-powered assistance and visual flowcharts",
      path: "/debug",
      color: "red"
    },
    {
      icon: <FaLightbulb className="text-yellow-500 text-2xl" />,
      title: "Ideas",
      description: "Turn your project ideas into actionable development plans",
      path: "/ideas",
      color: "yellow"
    },
    {
      icon: <FaGraduationCap className="text-green-500 text-2xl" />,
      title: "Practice",
      description: "Level up your coding skills with guided exercises and challenges",
      path: "/practice",
      color: "green"
    }
  ];

  const stats = [
    { label: "Exercises Completed", value: "24", progress: 75, color: "green" },
    { label: "Concepts Mastered", value: "18", progress: 90, color: "blue" },
    { label: "Days Streak", value: "12", progress: 85, color: "yellow" },
    { label: "Points Earned", value: "850", progress: 70, color: "purple" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeLens AI</h1>
          <p className="text-xl mb-6">
            Your AI-powered coding tutor that makes programming concepts visible and understandable
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
            <div className="text-gray-600 mb-3">{stat.label}</div>
            <ProgressBar 
              value={stat.progress} 
              maxValue={100} 
              color={stat.color}
              size="sm"
              showPercentage={false}
            />
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full bg-${feature.color}-100 mb-4 group-hover:bg-${feature.color}-200 transition-colors`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className={`text-${feature.color}-600 font-medium group-hover:text-${feature.color}-800 transition-colors`}>
                  Learn More →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {[
              { action: "Completed exercise", item: "Variables and Data Types", time: "2 hours ago" },
              { action: "Earned achievement", item: "First Steps", time: "1 day ago" },
              { action: "Used feature", item: "Debug Assistant", time: "2 days ago" },
              { action: "Submitted project", item: "Todo List App", time: "3 days ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.item}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Learning Path">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Python Basics</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <ProgressBar value={85} maxValue={100} color="blue" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Control Structures</span>
                <span className="text-sm text-gray-500">60%</span>
              </div>
              <ProgressBar value={60} maxValue={100} color="green" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Functions</span>
                <span className="text-sm text-gray-500">30%</span>
              </div>
              <ProgressBar value={30} maxValue={100} color="yellow" />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">Overall Progress</span>
                <span className="text-lg font-bold text-blue-600">62%</span>
              </div>
              <ProgressBar value={62} maxValue={100} color="blue" size="lg" className="mt-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
