'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Viewport,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../components/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

// Center position for the viewport
const CENTER_X = window.innerWidth / 2;
const CENTER_Y = window.innerHeight / 2;

const initialNodes: Node[] = [
  {
    id: 'investing',
    type: 'custom',
    position: { x: CENTER_X - 110, y: CENTER_Y - 110 }, // Center the node accounting for its size
    data: { 
      label: 'Investing',
      description: 'The art and science of growing wealth',
      expanded: false,
      children: [
        {
          id: 'stocks',
          label: 'Stocks',
          description: 'Ownership in companies',
          topics: ['Value Investing', 'Growth Stocks', 'Dividends', 'Market Analysis']
        },
        {
          id: 'crypto',
          label: 'Cryptocurrency',
          description: 'Digital assets and blockchain',
          topics: ['Bitcoin', 'Ethereum', 'DeFi', 'NFTs']
        },
        {
          id: 'realestate',
          label: 'Real Estate',
          description: 'Property investment',
          topics: ['Residential', 'Commercial', 'REITs', 'Property Development']
        },
        {
          id: 'bonds',
          label: 'Bonds',
          description: 'Fixed income securities',
          topics: ['Government Bonds', 'Corporate Bonds', 'Municipal Bonds', 'Bond Yields']
        },
        {
          id: 'alternatives',
          label: 'Alternative Investments',
          description: 'Non-traditional assets',
          topics: ['Commodities', 'Private Equity', 'Hedge Funds', 'Art & Collectibles']
        }
      ]
    }
  }
];

const initialEdges: Edge[] = [];

function MindMapContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setViewport, getViewport, fitView } = useReactFlow();

  const expandNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const centerNode = nds.find((n) => n.id === nodeId);
      if (!centerNode || !centerNode.data.children) return nds;

      const expanded = !centerNode.data.expanded;
      const childNodes: Node[] = [];
      const childEdges: Edge[] = [];

      if (expanded) {
        const radius = 400;
        const childCount = centerNode.data.children.length;
        const startAngle = -Math.PI / 2;
        
        centerNode.data.children.forEach((child: any, index: number) => {
          const angle = startAngle + (index * (2 * Math.PI)) / childCount;
          const x = centerNode.position.x + radius * Math.cos(angle);
          const y = centerNode.position.y + radius * Math.sin(angle);

          const childNode: Node = {
            id: child.id,
            type: 'custom',
            position: { x, y },
            data: {
              label: child.label,
              description: child.description,
              topics: child.topics,
            },
          };

          const edge: Edge = {
            id: `${nodeId}-${child.id}`,
            source: nodeId,
            target: child.id,
            type: 'default',
            style: { stroke: '#6366f1', strokeWidth: 2 },
            animated: true,
          };

          childNodes.push(childNode);
          childEdges.push(edge);
        });
      }

      setEdges(expanded ? childEdges : []);
      
      // Use setTimeout to ensure the nodes are updated before fitting the view
      setTimeout(() => {
        if (expanded) {
          fitView({ 
            padding: 30,
            duration: 800,
            minZoom: 0.9,
            maxZoom: 1.5
          });
        }
      }, 50);

      // When collapsing, remove all child nodes
      if (!expanded) {
        return nds.filter(node => node.id === nodeId).map(node => ({
          ...node,
          data: { ...node.data, expanded: false }
        }));
      }

      // When expanding, add the new child nodes
      return nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, expanded: true } };
        }
        return node;
      }).concat(childNodes);
    });
  }, [setNodes, setEdges, fitView]);

  useEffect(() => {
    const handleExpandNode = (event: CustomEvent) => {
      expandNode(event.detail);
    };

    window.addEventListener('expandNode', handleExpandNode as EventListener);
    return () => {
      window.removeEventListener('expandNode', handleExpandNode as EventListener);
    };
  }, [expandNode]);

  return (
    <div className="w-full h-screen bg-[rgb(20,20,24)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.6}
        maxZoom={1.5}
      >
        <Background color="#444" gap={16} />
        <Controls 
          className="bg-[rgb(26,26,26)] border-gray-700 fill-gray-300"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}

// Wrap the component with ReactFlowProvider
export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapContent />
    </ReactFlowProvider>
  );
}
