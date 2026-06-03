// Core workflow type definitions

export type NodeType = 'timer' | 'api' | 'ai' | 'logger' | 'trade';

export type TriggerType = 'manual' | 'schedule' | 'webhook';
export type ConditionOperator = 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'startsWith' | 'endsWith';
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface NodeConfig {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface EdgeConfig {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowData {
  id: string;
  _id?: string;
  name: string;
  description: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ExecutionLog {
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input?: Record<string, JsonValue>;
  output?: Record<string, JsonValue>;
  error?: string;
  duration?: number;
}

export interface ExecutionState {
  workflowId: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: ExecutionLog[];
  variables: Record<string, JsonValue>;
  startTime?: string;
  endTime?: string;
}

export type Workflow = WorkflowData;

export interface Execution {
  _id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  nodeExecutions: Array<{
    nodeId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    input: Record<string, any>;
    output: Record<string, any>;
    error?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
  }>;
  finalOutput?: Record<string, any>;
  createdAt: string;
}

export interface LogEntry {
  _id: string;
  executionId: string;
  nodeId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

