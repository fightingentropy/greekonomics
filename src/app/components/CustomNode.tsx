'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Link from 'next/link';

function CustomNode({ data, id }: { data: any; id: string }) {
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.children) {
      const event = new CustomEvent('expandNode', { detail: id });
      window.dispatchEvent(event);
    }
  };

  const handleSubcategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigation will be handled by the Link component
  };

  // Map category IDs to URL parameters for filtering articles
  const categoryMap: {[key: string]: string} = {
    'investing': 'investing',
    'stocks': 'investing',
    'crypto': 'crypto',
    'realestate': 'investing',
    'bonds': 'investing',
    'alternatives': 'investing',
    'personal-finance': 'personal-finance',
    'budgeting': 'personal-finance',
    'retirement': 'personal-finance',
    'insurance': 'personal-finance',
    'taxes': 'personal-finance',
    'debt': 'personal-finance',
    'bitcoin': 'crypto',
    'ethereum': 'crypto',
    'defi': 'crypto',
    'nfts': 'crypto'
  };

  // Get category for URL from node ID (removing parent prefix if present)
  const getCategoryParam = () => {
    const baseId = id.includes('-') ? id.split('-').pop() : id;
    return baseId ? categoryMap[baseId] || 'all' : 'all';
  };

  return (
    <div 
      onClick={handleNodeClick}
      className={`
        flex flex-col items-center justify-center
        w-[220px] h-[220px]
        rounded-full shadow-lg border border-gray-700 
        bg-[rgb(26,26,26)] cursor-pointer 
        transition-all duration-300 
        hover:shadow-xl hover:scale-105 
        ${data.children ? 'hover:bg-indigo-900/20' : 'hover:bg-gray-800/50'}
      `}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-700" />
      
      <div className="text-center p-5 w-full max-w-[180px]">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">{data.label}</h2>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{data.description}</p>
        
        {data.children && !data.expanded && (
          <div className="mt-3 text-sm text-indigo-400">Click to explore</div>
        )}
        
        {!data.children && (
          <Link 
            href={`/?category=${getCategoryParam()}`}
            onClick={handleSubcategoryClick}
            className="mt-3 px-3 py-1 text-xs text-indigo-300 border border-indigo-900/50 
              rounded-full bg-indigo-900/20 hover:bg-indigo-800/30 inline-block transition-colors"
          >
            View Articles
          </Link>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-700" />
    </div>
  );
}

export default memo(CustomNode);
