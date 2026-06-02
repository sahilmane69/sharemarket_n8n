export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return prefix ? `${prefix}-${id}` : id;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function topologicalSort(
  nodeIds: string[],
  edges: Array<{ source: string; target: string }>
): string[] {
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize
  nodeIds.forEach((id) => {
    adjacencyList.set(id, []);
    inDegree.set(id, 0);
  });

  // Build graph
  edges.forEach((edge) => {
    if (nodeIds.includes(edge.source) && nodeIds.includes(edge.target)) {
      adjacencyList.get(edge.source)!.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  });

  // Kahn's algorithm
  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });

  const result: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    adjacencyList.get(node)!.forEach((neighbor) => {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result;
}

export function validateWorkflow(nodes: any[], edges: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if there's at least one node
  if (nodes.length === 0) {
    errors.push('Workflow must have at least one node');
    return { valid: false, errors };
  }

  // Check if there's a trigger node
  const hasTrigger = nodes.some((node) => node.type === 'timer');
  if (!hasTrigger) {
    errors.push('Workflow must have a timer trigger node');
  }

  // Check for orphaned nodes
  const connectedNodes = new Set<string>();
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  nodes.forEach((node) => {
    if (node.type !== 'timer' && !connectedNodes.has(node.id)) {
      errors.push(`Node "${node.label}" is not connected to the workflow`);
    }
  });

  return { valid: errors.length === 0, errors };
}
