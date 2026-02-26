// frontend/src/hooks/useExecution.js
import { useState, useCallback } from 'react';

export const useExecution = () => {
  const [executionState, setExecutionState] = useState({
    isRunning: false,
    trace: [],
    output: '',
    error: null,
    flowchart: '',
    executionTime: 0
  });

  const executeCode = useCallback(async (code, language = 'python') => {
    setExecutionState(prev => ({
      ...prev,
      isRunning: true,
      error: null,
      output: '',
      trace: []
    }));

    try {
      // Simulate API call to backend
      // In real implementation: const response = await api.post('/try-me/execute', { code, language })
      
      // Mock response for demo
      const mockResponse = {
        success: true,
        output: "Code executed successfully!",
        trace: [
          { event: 'call', line_number: 1, function: 'main', locals: { x: 5 } },
          { event: 'line', line_number: 2, function: 'main', locals: { x: 5, y: 10 } },
          { event: 'line', line_number: 3, function: 'main', locals: { x: 5, y: 10, result: 15 } }
        ],
        flowchart: `graph TD
    A[Start] --> B[Initialize Variables]
    B --> C[Perform Calculation]
    C --> D[Output Result]
    D --> E[End]`,
        execution_time: 0.125
      };

      setExecutionState({
        isRunning: false,
        trace: mockResponse.trace,
        output: mockResponse.output,
        error: null,
        flowchart: mockResponse.flowchart,
        executionTime: mockResponse.execution_time
      });

      return mockResponse;
    } catch (error) {
      setExecutionState({
        isRunning: false,
        trace: [],
        output: '',
        error: error.message || 'Execution failed',
        flowchart: '',
        executionTime: 0
      });
      throw error;
    }
  }, []);

  const clearExecution = useCallback(() => {
    setExecutionState({
      isRunning: false,
      trace: [],
      output: '',
      error: null,
      flowchart: '',
      executionTime: 0
    });
  }, []);

  return {
    ...executionState,
    executeCode,
    clearExecution
  };
};
