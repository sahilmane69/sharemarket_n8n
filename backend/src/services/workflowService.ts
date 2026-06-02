import { Workflow, IWorkflow } from '../models/Workflow.js';
import { WorkflowData } from '../types/workflow.js';
import { validateWorkflow } from '../utils/helpers.js';
import { ApiError } from '../utils/error.js';

export class WorkflowService {
  async createWorkflow(data: WorkflowData): Promise<IWorkflow> {
    const validation = validateWorkflow(data.nodes, data.edges);
    if (!validation.valid) {
      throw new ApiError(400, 'Invalid workflow', { errors: validation.errors });
    }

    const workflow = await Workflow.create(data);
    return workflow;
  }

  async getWorkflow(id: string): Promise<IWorkflow> {
    const workflow = await Workflow.findById(id);
    if (!workflow) {
      throw new ApiError(404, 'Workflow not found');
    }
    return workflow;
  }

  async listWorkflows(): Promise<IWorkflow[]> {
    return Workflow.find().sort({ createdAt: -1 });
  }

  async updateWorkflow(id: string, data: Partial<WorkflowData>): Promise<IWorkflow> {
    if (data.nodes && data.edges) {
      const validation = validateWorkflow(data.nodes, data.edges);
      if (!validation.valid) {
        throw new ApiError(400, 'Invalid workflow', { errors: validation.errors });
      }
    }

    const workflow = await Workflow.findByIdAndUpdate(id, data, { new: true });
    if (!workflow) {
      throw new ApiError(404, 'Workflow not found');
    }
    return workflow;
  }

  async deleteWorkflow(id: string): Promise<void> {
    const result = await Workflow.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, 'Workflow not found');
    }
  }
}

export const workflowService = new WorkflowService();
