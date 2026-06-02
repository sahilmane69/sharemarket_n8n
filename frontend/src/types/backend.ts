import type { WorkflowData } from './workflow';

export type BackendNodeType = 'timer' | 'api' | 'ai' | 'logger';

export interface BackendNode {
  id: string;
  type: BackendNodeType;
  label: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface BackendEdge {
  id: string;
  source: string;
  target: string;
}

export interface BackendWorkflow {
  _id: string;
  name: string;
  description: string;
  nodes: BackendNode[];
  edges: BackendEdge[];
  status: 'draft' | 'active' | 'archived';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NodeExecutionState {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  error?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface BackendExecution {
  _id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  nodeExecutions: NodeExecutionState[];
  finalOutput: Record<string, unknown>;
  createdAt: string;
}

export interface BackendLogEntry {
  _id: string;
  executionId: string;
  nodeId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Conversion functions
export function convertBackendWorkflowToLocal(backend: BackendWorkflow): WorkflowData {
  return {
    id: backend._id,
    name: backend.name,
    description: backend.description,
    nodes: backend.nodes as any,
    edges: backend.edges as any,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
    isActive: backend.status === 'active',
  };
}

export function convertLocalWorkflowToBackend(local: WorkflowData) {
  const { id, isActive, ...rest } = local;
  return {
    ...rest,
    status: isActive ? 'active' : 'draft',
  };
}
