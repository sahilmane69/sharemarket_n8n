"use client";
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  type Connection,
  type Edge as FlowEdge,
  type Node as FlowNode,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './CreateWorkFlow.css';

export type NodeKind = {
  trigger: 'hyperliquid' | 'backpack' | 'lighter';
  action: 'hyperliquid' | 'backpack' | 'lighter';
  condition: 'hyperliquid' | 'backpack' | 'lighter';
};

type NodeData = {
  type: 'trigger' | 'action' | 'condition';
  kind: NodeKind;
};

export default function App() {
  const initialNodes: FlowNode<NodeData>[] = [
    {
      id: 'trigger-1',
      position: { x: 200, y: 140 },
      data: {
        type: 'trigger',
        kind: {
          trigger: 'hyperliquid',
          action: 'hyperliquid',
          condition: 'hyperliquid',
        },
      },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState<FlowNode<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges],
  );

  return (
    <div className="workflow-flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
