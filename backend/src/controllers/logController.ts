import { Request, Response } from 'express';
import { logService } from '../services/logService.js';

export async function getExecutionLogs(req: Request, res: Response): Promise<void> {
  const logs = await logService.getExecutionLogs(req.params.executionId);
  res.json({ success: true, data: logs });
}

export async function getNodeLogs(req: Request, res: Response): Promise<void> {
  const logs = await logService.getNodeLogs(req.params.executionId, req.params.nodeId);
  res.json({ success: true, data: logs });
}
