// frontend/src/components/core/CodeEditor.jsx
import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa';

const CodeEditor = ({ 
  code, 
  setCode, 
  language = 'python',
  onRun,
  onStop,
  isRunning = false,
  height = '400px'
}) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  const handleRunClick = () => {
    if (onRun && editorRef.current) {
      const currentCode = editorRef.current.getValue();
      onRun(currentCode);
    }
  };

  const handleStopClick = () => {
    if (onStop) {
      onStop();
    }
  };

  const handleResetClick = () => {
    if (editorRef.current) {
      editorRef.current.setValue(code || '');
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Code Editor</span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {language.toUpperCase()}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRunClick}
            disabled={!isEditorReady || isRunning}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
              isRunning 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <FaPlay size={12} />
            <span>Run</span>
          </button>
          
          {isRunning && (
            <button
              onClick={handleStopClick}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              <FaStop size={12} />
              <span>Stop</span>
            </button>
          )}
          
          <button
            onClick={handleResetClick}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
          >
            <FaRedo size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={setCode}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          lineNumbers: 'on',
          folding: true,
          renderLineHighlight: 'all'
        }}
      />
    </div>
  );
};

export default CodeEditor;
