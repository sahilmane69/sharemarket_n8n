import { Request, Response } from 'express';
import { executionService } from '../services/executionService.js';
import { workflowService } from '../services/workflowService.js';
import { nodeExecutor } from '../services/nodeExecutors.js';
import { topologicalSort } from '../utils/helpers.js';

export async function getExecution(req: Request, res: Response): Promise<void> {
  const execution = await executionService.getExecution(req.params.id);
  res.json({ success: true, data: execution });
}

export async function listExecutions(req: Request, res: Response): Promise<void> {
  const workflowId = req.query.workflowId as string | undefined;
  const executions = await executionService.listExecutions(workflowId);
  res.json({ success: true, data: executions });
}

export async function executeWorkflow(req: Request, res: Response): Promise<void> {
  const { workflowId } = req.params;

  // Create execution record
  const execution = await executionService.createExecution(workflowId);
  const workflow = await workflowService.getWorkflow(workflowId);

  // Update execution status to running
  await executionService.updateExecution(execution._id.toString(), { status: 'running' });

  // Execute workflow asynchronously
  executeWorkflowAsync(execution._id.toString(), workflow, nodeExecutor).catch(() => {
    // Error already logged
  });

  res.status(202).json({ success: true, data: execution });
}

export async function executeWorkflowAsync(
  executionId: string,
  workflow: any,
  nodeExecutor: any
): Promise<void> {
  try {
    const nodeMap = new Map(workflow.nodes.map((node: any) => [node.id, node]));
    const executionOrder = topologicalSort(
      workflow.nodes.map((n: any) => n.id),
      workflow.edges
    );

    const nodeExecutions = new Map<string, any>();
    let finalOutput: Record<string, unknown> = {};
    const startTime = new Date();

    // Initialize node executions
    workflow.nodes.forEach((node: any) => {
      nodeExecutions.set(node.id, {
        nodeId: node.id,
        status: 'pending',
        input: {},
        output: {},
        startTime: undefined,
        endTime: undefined,
      });
    });

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodeMap.get(nodeId);
      if (!node) continue;

      const nodeExec = nodeExecutions.get(nodeId)!;
      nodeExec.status = 'running';
      nodeExec.startTime = new Date();

      try {
        // Get input from previous nodes
        let nodeInput: Record<string, unknown> = {};
        const previousNodes = workflow.edges
          .filter((e: any) => e.target === nodeId)
          .map((e: any) => e.source);

        previousNodes.forEach((prevNodeId: string) => {
          const prevExec = nodeExecutions.get(prevNodeId);
          if (prevExec && prevExec.output) {
            nodeInput[prevNodeId] = prevExec.output;
          }
        });

        nodeExec.input = nodeInput;

        // Execute node
        nodeExec.output = await nodeExecutor.executeNode(node, executionId, nodeInput);
        nodeExec.status = 'completed';
        finalOutput = nodeExec.output;
      } catch (error) {
        nodeExec.status = 'failed';
        nodeExec.error = error instanceof Error ? error.message : 'Unknown error';
        nodeExec.output = {};
      } finally {
        nodeExec.endTime = new Date();
        nodeExec.duration = nodeExec.endTime.getTime() - nodeExec.startTime.getTime();
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const allCompleted = Array.from(nodeExecutions.values()).every((ne) => ne.status !== 'pending');
    const hasError = Array.from(nodeExecutions.values()).some((ne) => ne.status === 'failed');

    await executionService.updateExecution(executionId, {
      status: hasError ? 'failed' : allCompleted ? 'completed' : 'running',
      nodeExecutions: Array.from(nodeExecutions.values()),
      finalOutput,
      endTime,
      duration,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await executionService.updateExecution(executionId, {
      status: 'failed',
      error: message,
      endTime: new Date(),
    });
  }
}
