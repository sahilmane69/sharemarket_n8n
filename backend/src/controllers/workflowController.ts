import { Request, Response } from 'express';
import { workflowService } from '../services/workflowService.js';

export async function createWorkflow(req: Request, res: Response): Promise<void> {
  const workflow = await workflowService.createWorkflow(req.body);
  res.status(201).json({ success: true, data: workflow });
}

export async function getWorkflow(req: Request, res: Response): Promise<void> {
  const workflow = await workflowService.getWorkflow(req.params.id);
  res.json({ success: true, data: workflow });
}

export async function listWorkflows(req: Request, res: Response): Promise<void> {
  const workflows = await workflowService.listWorkflows();
  res.json({ success: true, data: workflows });
}

export async function updateWorkflow(req: Request, res: Response): Promise<void> {
  const workflow = await workflowService.updateWorkflow(req.params.id, req.body);
  res.json({ success: true, data: workflow });
}

export async function deleteWorkflow(req: Request, res: Response): Promise<void> {
  await workflowService.deleteWorkflow(req.params.id);
  res.json({ success: true, message: 'Workflow deleted' });
}
