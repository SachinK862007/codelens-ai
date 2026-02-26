// frontend/src/components/core/FlowChart.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const FlowChart = ({ chartDefinition, title = "Flowchart" }) => {
  const chartRef = useRef(null);
  const chartId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (chartDefinition && chartRef.current) {
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
        },
      });

      // Render the chart
      const renderChart = async () => {
        try {
          await mermaid.run({
            nodes: [chartRef.current],
            suppressErrors: true,
          });
        } catch (error) {
          console.warn('Mermaid rendering error:', error);
          // Fallback to error display
          if (chartRef.current) {
            chartRef.current.innerHTML = `
              <div class="p-4 text-center text-red-500">
                <div class="text-lg font-medium mb-2">Chart Rendering Error</div>
                <div class="text-sm">${error.message}</div>
              </div>
            `;
          }
        }
      };

      renderChart();
    }
  }, [chartDefinition]);

  if (!chartDefinition) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium mb-2">No Flowchart Data</h3>
        <p>Execute code to generate flowchart visualization</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <div className="p-4 overflow-auto">
        <div 
          ref={chartRef} 
          className="mermaid flex justify-center"
          id={chartId}
        >
          {chartDefinition}
        </div>
      </div>
    </div>
  );
};

export default FlowChart;
