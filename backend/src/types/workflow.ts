export type NodeType = 'timer' | 'api' | 'ai' | 'logger' | 'trade';

// Node Configuration Types
export interface BaseNodeConfig {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
}

export interface TimerNodeConfig extends BaseNodeConfig {
  type: 'timer';
  data: {
    duration: number; // milliseconds
  };
}

export interface APINodeConfig extends BaseNodeConfig {
  type: 'api';
  data: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  };
}

export interface AINodeConfig extends BaseNodeConfig {
  type: 'ai';
  data: {
    provider: 'openai' | 'anthropic';
    model: string;
    prompt: string;
    temperature?: number;
  };
}

export interface LoggerNodeConfig extends BaseNodeConfig {
  type: 'logger';
  data: {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
  };
}

export interface TradeNodeConfig extends BaseNodeConfig {
  type: 'trade';
  data: {
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    mode: 'simulation' | 'alpaca';
    alpacaKeyId?: string;
    alpacaSecret?: string;
  };
}

export type NodeConfig = TimerNodeConfig | APINodeConfig | AINodeConfig | LoggerNodeConfig | TradeNodeConfig;

// Edge Configuration
export interface EdgeConfig {
  id: string;
  source: string;
  target: string;
}

// Workflow
export interface WorkflowData {
  name: string;
  description: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  status: 'draft' | 'active' | 'archived';
  tags?: string[];
}

// Execution
export interface NodeExecutionState {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface ExecutionState {
  executionId: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  nodeStates: Map<string, NodeExecutionState>;
  finalOutput: Record<string, unknown>;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

// Log
export interface LogEntry {
  executionId: string | Date;
  nodeId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
