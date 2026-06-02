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
import { TimerNode } from './nodes/TimerNode';
import { APINode } from './nodes/APINode';
import { AINode } from './nodes/AINode';
import { LoggerNode } from './nodes/LoggerNode';
import { NodePanel } from './NodePanel';
import { NodeSettingsPanel } from './NodeSettingsPanel';
import { ExecutionPanel } from './ExecutionPanel';

const nodeTypes = {
  timer: TimerNode,
  api: APINode,
  ai: AINode,
  logger: LoggerNode,
};

interface WorkflowCanvasProps {
  workflow: WorkflowData;
  onSave: (workflow: WorkflowData) => void;
  onExecute?: (workflow: WorkflowData) => void;
}

export function WorkflowCanvas({ workflow, onSave, onExecute }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    (workflow.nodes || []).map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { ...n.data, label: n.data?.label || n.label },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    (workflow.edges || []).map(e => ({
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

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const addNode = useCallback(
    (type: WFNodeType) => {
      const defaultData: Record<string, any> = {
        label: `${type.toUpperCase()} Node`,
      };

      if (type === 'timer') {
        defaultData.duration = 1000;
      } else if (type === 'api') {
        defaultData.method = 'GET';
        defaultData.url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
      } else if (type === 'ai') {
        defaultData.provider = 'openai';
        defaultData.model = 'gpt-4';
        defaultData.prompt = 'Check data: {{api-fetch.data}}';
      } else if (type === 'logger') {
        defaultData.level = 'info';
        defaultData.message = 'Workflow executed correctly.';
      }

      const newNode = {
        id: workflowUtils.generateId(type),
        type,
        position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
        data: defaultData,
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
    setTimeout(() => setIsRunning(false), 1000);
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
            (imported.nodes || []).map(n => ({
              id: n.id,
              type: n.type,
              position: n.position,
              data: { ...n.data, label: n.data?.label || n.label },
            }))
          );
          setEdges(
            (imported.edges || []).map(e => ({
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
    <div className="flex-1 flex flex-col bg-[#fafafa] text-black">
      {/* Toolbar */}
      <div className="bg-white border-b-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wide">{workflow.name}</h2>
          <p className="text-xs opacity-70 mt-0.5">{workflow.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={saveWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={executeWorkflow}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-white hover:text-black text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Execute'}
          </button>
          <button
            onClick={exportWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={importWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-white border-4 border-black overflow-hidden relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#000" gap={16} />
            <Controls className="border-2 border-black p-1 bg-white text-black shadow-sm" />
            <MiniMap className="border-2 border-black bg-white" />
          </ReactFlow>
        </div>

        {/* Side panels */}
        <div className="flex flex-col gap-6 w-80 shrink-0 overflow-y-auto max-h-full pb-6">
          {selectedNodeId ? (
            <NodeSettingsPanel
              node={nodes.find((n) => n.id === selectedNodeId)}
              onUpdate={(updatedData) => {
                setNodes((nds) =>
                  nds.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...updatedData } } : n))
                );
              }}
              onClose={() => setSelectedNodeId(null)}
              onDelete={deleteSelectedNode}
            />
          ) : (
            <NodePanel onAddNode={addNode} onDeleteNode={deleteSelectedNode} hasSelected={false} />
          )}
          <ExecutionPanel workflow={workflow} />
        </div>
      </div>
    </div>
  );
}
