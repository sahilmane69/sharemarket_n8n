import { Execution, IExecution } from '../models/Execution.js';
import { Workflow } from '../models/Workflow.js';
import { ApiError } from '../utils/error.js';

export class ExecutionService {
  async getExecution(id: string): Promise<IExecution> {
    const execution = await Execution.findById(id);
    if (!execution) {
      throw new ApiError(404, 'Execution not found');
    }
    return execution;
  }

  async listExecutions(workflowId?: string): Promise<IExecution[]> {
    const query = workflowId ? { workflowId } : {};
    return Execution.find(query).sort({ createdAt: -1 });
  }

  async createExecution(workflowId: string): Promise<IExecution> {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      throw new ApiError(404, 'Workflow not found');
    }

    const execution = await Execution.create({
      workflowId,
      nodeExecutions: workflow.nodes.map((node: any) => ({
        nodeId: node.id,
        status: 'pending',
        input: {},
        output: {},
      })),
    });

    return execution;
  }

  async updateExecution(id: string, data: Partial<IExecution>): Promise<IExecution> {
    const execution = await Execution.findByIdAndUpdate(id, data, { new: true });
    if (!execution) {
      throw new ApiError(404, 'Execution not found');
    }
    return execution;
  }

  async deleteExecution(id: string): Promise<void> {
    const result = await Execution.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, 'Execution not found');
    }
  }
}

export const executionService = new ExecutionService();
