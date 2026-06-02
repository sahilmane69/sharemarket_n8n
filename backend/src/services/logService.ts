import { Log, ILog } from '../models/Log.js';
import { ApiError } from '../utils/error.js';

export class LogService {
  async createLog(data: {
    executionId: string;
    nodeId: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<ILog> {
    return Log.create(data);
  }

  async getExecutionLogs(executionId: string): Promise<ILog[]> {
    return Log.find({ executionId }).sort({ timestamp: 1 });
  }

  async getNodeLogs(executionId: string, nodeId: string): Promise<ILog[]> {
    return Log.find({ executionId, nodeId }).sort({ timestamp: 1 });
  }

  async deleteExecutionLogs(executionId: string): Promise<void> {
    await Log.deleteMany({ executionId });
  }
}

export const logService = new LogService();
