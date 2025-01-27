'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, id }: { data: any; id: string }) {
  const handleClick = () => {
    if (data.children) {
      // This will be handled by the parent component
      const event = new CustomEvent('expandNode', { detail: id });
      window.dispatchEvent(event);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`px-4 py-2 shadow-lg rounded-lg border border-gray-700 bg-[rgb(26,26,26)] cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:scale-105 min-w-[200px]
        ${data.children ? 'hover:bg-indigo-900/20' : 'hover:bg-gray-800/50'}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-700" />
      
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-100 mb-1">{data.label}</h2>
        <p className="text-sm text-gray-400 mb-2">{data.description}</p>
        
        {data.topics && (
          <div className="flex flex-wrap gap-2 justify-center">
            {data.topics.map((topic: string) => (
              <span 
                key={topic}
                className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
        
        {data.children && (
          <div className="mt-2 text-xs text-indigo-400">
            {data.expanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-700" />
    </div>
  );
}

export default memo(CustomNode);
