// Core workflow type definitions

export type NodeType = 'timer' | 'api' | 'ai' | 'logger';

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

// Node-specific configurations
export interface TriggerNodeConfig extends NodeConfig {
  type: 'trigger';
  data: {
    triggerType: TriggerType;
    schedule?: string; // cron expression
    webhookUrl?: string;
  };
}

export interface APINodeConfig extends NodeConfig {
  type: 'api';
  data: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    headers?: Record<string, string>;
    body?: Record<string, JsonValue>;
    params?: Record<string, string>;
  };
}

export interface AINodeConfig extends NodeConfig {
  type: 'ai';
  data: {
    provider: 'openai' | 'anthropic' | 'local';
    model: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ConditionNodeConfig extends NodeConfig {
  type: 'condition';
  data: {
    conditions: {
      field: string;
      operator: ConditionOperator;
      value: string | number | boolean;
    }[];
    logic: 'and' | 'or';
  };
}

export interface EmailNodeConfig extends NodeConfig {
  type: 'email';
  data: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    attachments?: string[];
  };
}

export interface DatabaseNodeConfig extends NodeConfig {
  type: 'database';
  data: {
    operation: 'query' | 'insert' | 'update' | 'delete';
    database: string;
    query?: string;
    table?: string;
    where?: Record<string, JsonValue>;
    values?: Record<string, JsonValue>;
  };
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

