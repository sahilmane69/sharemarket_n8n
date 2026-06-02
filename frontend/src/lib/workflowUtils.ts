import type { WorkflowData, ExecutionState, ExecutionLog } from '../types/workflow';

export const workflowUtils = {
  // Generate unique IDs
  generateId: (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create new workflow
  createWorkflow: (name: string, description: string): WorkflowData => ({
    id: workflowUtils.generateId('workflow'),
    name,
    description,
    nodes: [],
    edges: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: false,
  }),

  // Create execution state
  createExecutionState: (workflowId: string): ExecutionState => ({
    workflowId,
    status: 'idle',
    logs: [],
    variables: {},
  }),

  // Add execution log
  addExecutionLog: (state: ExecutionState, log: ExecutionLog): ExecutionState => ({
    ...state,
    logs: [...state.logs, log],
  }),

  // Validate workflow
  validateWorkflow: (workflow: WorkflowData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    const hasTrigger = workflow.nodes.some(n => n.type === 'timer');
    if (!hasTrigger) {
      errors.push('Workflow must have a timer trigger node');
    }

    // Check for orphaned nodes (nodes with no incoming or outgoing edges)
    const connectedNodeIds = new Set<string>();

    workflow.edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const triggerNode = workflow.nodes.find(n => n.type === 'timer');
    if (triggerNode && !connectedNodeIds.has(triggerNode.id)) {
      errors.push('Trigger node must be connected to other nodes');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Get workflow dependencies (execution order)
  getExecutionOrder: (workflow: WorkflowData): string[] => {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (nodeId: string): void => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) return; // Cycle detected, skip

      visiting.add(nodeId);

      // Find all nodes that this node connects to
      const outgoing = workflow.edges
        .filter(e => e.source === nodeId)
        .map(e => e.target);

      outgoing.forEach(visit);

      visiting.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    };

    // Start from timer nodes
    workflow.nodes
      .filter(n => n.type === 'timer')
      .forEach(n => visit(n.id));

    return order;
  },

  // Serialize workflow to JSON
  serializeWorkflow: (workflow: WorkflowData): string => {
    return JSON.stringify(workflow, null, 2);
  },

  // Deserialize workflow from JSON
  deserializeWorkflow: (json: string): WorkflowData => {
    return JSON.parse(json);
  },

  // Export workflow
  exportWorkflow: (workflow: WorkflowData): void => {
    const json = workflowUtils.serializeWorkflow(workflow);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import workflow from file
  importWorkflow: (file: File): Promise<WorkflowData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const workflow = workflowUtils.deserializeWorkflow(json);
          workflow.id = workflowUtils.generateId('workflow');
          workflow.createdAt = new Date().toISOString();
          workflow.updatedAt = new Date().toISOString();
          resolve(workflow);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  },

  // Store workflow locally
  saveWorkflowLocal: (workflow: WorkflowData): void => {
    const key = `workflow_${workflow.id}`;
    localStorage.setItem(key, workflowUtils.serializeWorkflow(workflow));
    // Update list of workflow IDs
    const workflowIds = JSON.parse(localStorage.getItem('workflow_ids') || '[]');
    if (!workflowIds.includes(workflow.id)) {
      workflowIds.push(workflow.id);
      localStorage.setItem('workflow_ids', JSON.stringify(workflowIds));
    }
  },

  // Load workflow from local storage
  loadWorkflowLocal: (workflowId: string): WorkflowData | null => {
    const key = `workflow_${workflowId}`;
    const json = localStorage.getItem(key);
    if (!json) return null;
    return workflowUtils.deserializeWorkflow(json);
  },

  // List all local workflows
  listWorkflowsLocal: (): WorkflowData[] => {
    const workflowIds = JSON.parse(localStorage.getItem('workflow_ids') || '[]');
    return workflowIds
      .map((id: string) => workflowUtils.loadWorkflowLocal(id))
      .filter((w: WorkflowData | null): w is WorkflowData => w !== null);
  },

  // Delete workflow from local storage
  deleteWorkflowLocal: (workflowId: string): void => {
    const key = `workflow_${workflowId}`;
    localStorage.removeItem(key);
    const workflowIds = JSON.parse(localStorage.getItem('workflow_ids') || '[]');
    const filtered = workflowIds.filter((id: string) => id !== workflowId);
    localStorage.setItem('workflow_ids', JSON.stringify(filtered));
  },
};
