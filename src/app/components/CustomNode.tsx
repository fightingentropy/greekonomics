'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, id }: { data: any; id: string }) {
  const handleClick = () => {
    if (data.children) {
      const event = new CustomEvent('expandNode', { detail: id });
      window.dispatchEvent(event);
    }
  };

  const size = data.children ? 220 : 180;

  return (
    <div 
      onClick={handleClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`flex items-center justify-center rounded-full shadow-lg border border-gray-700 
        bg-[rgb(26,26,26)] cursor-pointer transition-all duration-300 hover:shadow-xl 
        hover:scale-105 relative overflow-hidden group
        ${data.children ? 'hover:bg-indigo-900/20' : 'hover:bg-gray-800/50'}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-700" />
      
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">{data.label}</h2>
        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{data.description}</p>
        
        {data.topics && (
          <div className="absolute inset-0 bg-[rgb(26,26,26)] opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 flex items-center justify-center">
            <div className="flex flex-wrap gap-2 justify-center content-center p-4">
              {data.topics.map((topic: string) => (
                <span 
                  key={topic}
                  className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 whitespace-nowrap"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {data.children && (
          <div className="mt-2 text-sm text-indigo-400">
            {data.expanded ? '−' : '+'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-700" />
    </div>
  );
}

export default memo(CustomNode);
