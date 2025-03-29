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
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../components/CustomNode';
import { useRouter } from 'next/navigation';

const nodeTypes = {
  custom: CustomNode,
};

// Define a fixed layout grid with predefined positions
// This guarantees no overlap regardless of screen size
const GRID_LAYOUT: { [key: string]: { x: number, y: number } } = {
  // Root node (center)
  'finance': { x: 0, y: 0 },
  
  // Level 1 nodes - positioned far from center but not extreme
  'finance-investing': { x: 0, y: -800 },         // North
  'finance-personal-finance': { x: 800, y: 0 },   // East
  'finance-crypto': { x: -800, y: 0 },            // West
  
  // Level 2 nodes for "personal-finance" - clustered right side
  'finance-personal-finance-budgeting': { x: 1400, y: -500 },       // NE from personal-finance
  'finance-personal-finance-retirement': { x: 1400, y: 500 },       // SE from personal-finance
  'finance-personal-finance-insurance': { x: 1400, y: -200 },       // E from personal-finance, slightly north
  'finance-personal-finance-debt': { x: 1400, y: 200 },             // E from personal-finance, slightly south
  'finance-personal-finance-taxes': { x: 800, y: -800 },            // N from personal-finance
  
  // Level 2 nodes for "investing" - clustered top side
  'finance-investing-stocks': { x: -500, y: -1400 },               // NW from investing
  'finance-investing-crypto': { x: 500, y: -1400 },                // NE from investing
  'finance-investing-realestate': { x: -200, y: -1400 },           // N from investing, slightly west
  'finance-investing-bonds': { x: 200, y: -1400 },                 // N from investing, slightly east
  'finance-investing-alternatives': { x: 0, y: -1600 },            // Far N from investing
  
  // Level 2 nodes for "crypto" - clustered left side
  'finance-crypto-bitcoin': { x: -1400, y: -500 },                 // NW from crypto
  'finance-crypto-ethereum': { x: -1400, y: 500 },                 // SW from crypto
  'finance-crypto-defi': { x: -1400, y: -200 },                    // W from crypto, slightly north
  'finance-crypto-nfts': { x: -1400, y: 200 },                     // W from crypto, slightly south
};

// Default center positions - will be updated on client side
const DEFAULT_CENTER_X = 500;
const DEFAULT_CENTER_Y = 300;

const initialNodes: Node[] = [
  {
    id: 'finance',
    type: 'custom',
    position: { x: DEFAULT_CENTER_X, y: DEFAULT_CENTER_Y },
    data: { 
      label: 'Finance',
      description: 'Explore financial knowledge domains',
      expanded: false,
      children: [
        {
          id: 'investing',
          label: 'Investing',
          description: 'Building wealth through asset growth',
          topics: ['Stocks', 'Bonds', 'Real Estate', 'Alternatives'],
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
        },
        {
          id: 'personal-finance',
          label: 'Personal Finance',
          description: 'Managing your money effectively',
          topics: ['Budgeting', 'Retirement', 'Emergency Funds', 'Debt Management'],
          children: [
            {
              id: 'budgeting',
              label: 'Budgeting',
              description: 'Planning and tracking expenses',
              topics: ['50/30/20 Rule', 'Zero-Based Budgeting', 'Envelope System']
            },
            {
              id: 'retirement',
              label: 'Retirement Planning',
              description: 'Securing your financial future',
              topics: ['401(k)', 'IRA', 'Social Security', 'Pension Plans']
            },
            {
              id: 'insurance',
              label: 'Insurance',
              description: 'Protecting against financial risks',
              topics: ['Life Insurance', 'Health Insurance', 'Property Insurance']
            },
            {
              id: 'debt',
              label: 'Debt Management',
              description: 'Strategies for handling liabilities',
              topics: ['Student Loans', 'Mortgages', 'Credit Cards', 'Debt Snowball']
            },
            {
              id: 'taxes',
              label: 'Tax Planning',
              description: 'Minimizing tax burden legally',
              topics: ['Tax Deductions', 'Tax Credits', 'Tax-Advantaged Accounts']
            }
          ]
        },
        {
          id: 'crypto',
          label: 'Cryptocurrency',
          description: 'Digital currency and blockchain',
          topics: ['Bitcoin', 'Ethereum', 'DeFi', 'Blockchain Technology'],
          children: [
            {
              id: 'bitcoin',
              label: 'Bitcoin',
              description: 'The original cryptocurrency',
              topics: ['Mining', 'Halving', 'Lightning Network']
            },
            {
              id: 'ethereum',
              label: 'Ethereum',
              description: 'Programmable blockchain platform',
              topics: ['Smart Contracts', 'dApps', 'Proof of Stake']
            },
            {
              id: 'defi',
              label: 'Decentralized Finance',
              description: 'Financial services on blockchain',
              topics: ['Lending', 'DEXs', 'Yield Farming', 'Stablecoins']
            },
            {
              id: 'nfts',
              label: 'NFTs',
              description: 'Unique digital assets',
              topics: ['Digital Art', 'Collectibles', 'Gaming Assets']
            }
          ]
        }
      ]
    }
  }
];

const initialEdges: Edge[] = [];

function MindMapContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const router = useRouter();

  // Keep track of expanded nodes to avoid duplicates
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const expandNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const targetNode = nds.find((n) => n.id === nodeId);
      if (!targetNode || !targetNode.data.children) return nds;

      // Check if the node is already expanded
      const isExpanded = targetNode.data.expanded;
      let updatedNodes;

      if (isExpanded) {
        // Collapse: Remove all child nodes and edges
        updatedNodes = nds.filter(node => {
          // Keep the node itself and any nodes that aren't its direct children
          const isChild = edges.some(edge => 
            edge.source === nodeId && edge.target === node.id
          );
          return !isChild || node.id === nodeId;
        });

        // Update the expanded state of the target node
        updatedNodes = updatedNodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, expanded: false } };
          }
          return node;
        });

        // Remove all edges from this node
        setEdges(edges.filter(edge => edge.source !== nodeId));
        
        // Update expanded nodes tracking
        setExpandedNodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(nodeId);
          return newSet;
        });

        return updatedNodes;
      } else {
        // Expand: Add child nodes and connect with edges
        const childNodes: Node[] = [];
        const childEdges: Edge[] = [];
        
        // Create child nodes with preset fixed positions
        targetNode.data.children.forEach((child: any) => {
          // Create a unique ID for this node path
          const childId = `${nodeId}-${child.id}`;
          
          // Get preset position or use a default one far away if not defined
          let position;
          if (GRID_LAYOUT[childId]) {
            // Get the fixed position from our layout grid
            position = {
              x: GRID_LAYOUT[childId].x + (window.innerWidth / 2),
              y: GRID_LAYOUT[childId].y + (window.innerHeight / 2)
            };
          } else {
            // Fallback position - put it far away
            // This should rarely happen if we've defined all positions
            const randomAngle = Math.random() * Math.PI * 2;
            position = {
              x: targetNode.position.x + (Math.cos(randomAngle) * 1200),
              y: targetNode.position.y + (Math.sin(randomAngle) * 1200)
            };
          }
          
          // Create the child node
          const childNode: Node = {
            id: childId,
            type: 'custom',
            position: position,
            data: {
              ...child,
              expanded: false,
            },
          };
          
          // Create the edge connecting parent to child
          const edge: Edge = {
            id: `${nodeId}-${childNode.id}`,
            source: nodeId,
            target: childNode.id,
            type: 'default',
            style: { stroke: '#6366f1', strokeWidth: 2 },
            animated: true,
          };
          
          childNodes.push(childNode);
          childEdges.push(edge);
        });
        
        // Add the new child edges
        setEdges([...edges, ...childEdges]);
        
        // Update expanded nodes tracking
        setExpandedNodes(prev => {
          const newSet = new Set(prev);
          newSet.add(nodeId);
          return newSet;
        });

        // Update the expanded state of the target node and add child nodes
        return nds.map(node => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, expanded: true } };
          }
          return node;
        }).concat(childNodes);
      }
    });

    // Fit the view after node expansion/collapse
    setTimeout(() => {
      fitView({ 
        padding: 250,
        duration: 800,
        minZoom: 0.3,
        maxZoom: 1.0
      });
    }, 50);
  }, [setNodes, setEdges, edges, fitView, expandedNodes]);

  useEffect(() => {
    const handleExpandNode = (event: CustomEvent) => {
      expandNode(event.detail);
    };

    window.addEventListener('expandNode', handleExpandNode as EventListener);
    return () => {
      window.removeEventListener('expandNode', handleExpandNode as EventListener);
    };
  }, [expandNode]);

  useEffect(() => {
    // Center the main node on page load
    const CENTER_X = window.innerWidth / 2;
    const CENTER_Y = window.innerHeight / 2;
    
    setNodes((nds) => nds.map((node) => {
      if (node.id === 'finance') {
        return { ...node, position: { x: CENTER_X, y: CENTER_Y } };
      }
      return node;
    }));

    // Fit view on initial load with more balanced viewport settings
    setTimeout(() => {
      fitView({ 
        padding: 250,
        duration: 800,
        minZoom: 0.3,
        maxZoom: 1.0
      });
    }, 100);
  }, [setNodes, fitView]);

  return (
    <div className="w-full h-screen bg-[rgb(20,20,24)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }} // Start with a more reasonable zoom
        minZoom={0.2} // Allow zoom out but not extreme
        maxZoom={1.5}
        fitView
        fitViewOptions={{
          padding: 250,
          minZoom: 0.3,
        }}
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
