import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Save, Upload, Download } from 'lucide-react';
import type { WorkflowData, NodeType as WFNodeType } from '../types/workflow';
import { workflowUtils } from '../lib/workflowUtils';
import { TriggerNode } from './nodes/TriggerNode';
import { APINode } from './nodes/APINode';
import { AINode } from './nodes/AINode';
import { ConditionNode } from './nodes/ConditionNode';
import { EmailNode } from './nodes/EmailNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { NodePanel } from './NodePanel';
import { ExecutionPanel } from './ExecutionPanel';

const nodeTypes = {
  trigger: TriggerNode,
  api: APINode,
  ai: AINode,
  condition: ConditionNode,
  email: EmailNode,
  database: DatabaseNode,
};

interface WorkflowCanvasProps {
  workflow: WorkflowData;
  onSave: (workflow: WorkflowData) => void;
  onExecute?: (workflow: WorkflowData) => void;
}

export function WorkflowCanvas({ workflow, onSave, onExecute }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }))
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: workflowUtils.generateId('edge'),
        source: connection.source || '',
        target: connection.target || '',
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    []
  );

  const addNode = useCallback(
    (type: WFNodeType) => {
      const newNode = {
        id: workflowUtils.generateId(type),
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  const saveWorkflow = useCallback(() => {
    const updatedWorkflow: WorkflowData = {
      ...workflow,
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type as WFNodeType,
        label: String(n.data.label || n.type),
        position: n.position,
        data: n.data,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
      updatedAt: new Date().toISOString(),
    };
    workflowUtils.saveWorkflowLocal(updatedWorkflow);
    onSave(updatedWorkflow);
  }, [workflow, nodes, edges, onSave]);

  const executeWorkflow = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    
    const updatedWorkflow: WorkflowData = {
      ...workflow,
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type as WFNodeType,
        label: String(n.data.label || n.type),
        position: n.position,
        data: n.data,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };

    onExecute?.(updatedWorkflow);
    setTimeout(() => setIsRunning(false), 500);
  }, [workflow, nodes, edges, onExecute, isRunning]);

  const exportWorkflow = useCallback(() => {
    const updatedWorkflow: WorkflowData = {
      ...workflow,
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type as WFNodeType,
        label: String(n.data.label || n.type),
        position: n.position,
        data: n.data,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    };
    workflowUtils.exportWorkflow(updatedWorkflow);
  }, [workflow, nodes, edges]);

  const importWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await workflowUtils.importWorkflow(file);
          setNodes(
            imported.nodes.map(n => ({
              id: n.id,
              type: n.type,
              position: n.position,
              data: n.data,
            }))
          );
          setEdges(
            imported.edges.map(e => ({
              id: e.id,
              source: e.source,
              target: e.target,
            }))
          );
        } catch {
          alert('Failed to import workflow');
        }
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-screen bg-slate-950">
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">{workflow.name}</h2>
            <p className="text-sm text-slate-400">{workflow.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveWorkflow}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={executeWorkflow}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Execute'}
            </button>
            <button
              onClick={exportWorkflow}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={importWorkflow}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 p-4 overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 bg-slate-900 rounded border border-slate-700 overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {/* Side panels */}
          <div className="flex flex-col gap-4 w-80">
            <NodePanel onAddNode={addNode} onDeleteNode={deleteSelectedNode} hasSelected={selectedNodeId !== null} />
            <ExecutionPanel workflow={workflow} />
          </div>
        </div>
      </div>
    </div>
  );
}
