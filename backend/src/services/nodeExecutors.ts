import axios from 'axios';
import { sleep } from '../utils/helpers.js';
import { logService } from './logService.js';
import {
  NodeConfig,
  TimerNodeConfig,
  APINodeConfig,
  AINodeConfig,
  LoggerNodeConfig,
} from '../types/workflow.js';

export class NodeExecutor {
  async executeTimerNode(
    node: TimerNodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await logService.createLog({
      executionId,
      nodeId: node.id,
      level: 'info',
      message: `Timer node waiting for ${node.data.duration}ms`,
    });

    await sleep(node.data.duration);

    const output = {
      timestamp: new Date().toISOString(),
      duration: node.data.duration,
    };

    await logService.createLog({
      executionId,
      nodeId: node.id,
      level: 'info',
      message: `Timer completed after ${node.data.duration}ms`,
      metadata: output,
    });

    return output;
  }

  async executeAPINode(
    node: APINodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'info',
        message: `Making ${node.data.method} request to ${node.data.url}`,
      });

      const response = await axios({
        method: node.data.method,
        url: node.data.url,
        headers: node.data.headers,
        data: node.data.body,
      });

      const output = {
        statusCode: response.status,
        data: response.data,
      };

      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'info',
        message: `API request successful (${response.status})`,
        metadata: { dataSize: JSON.stringify(output).length },
      });

      return output;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'error',
        message: `API request failed: ${message}`,
      });
      throw error;
    }
  }

  async executeAINode(
    node: AINodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    try {
      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'info',
        message: `Calling AI model: ${node.data.provider}/${node.data.model}`,
      });

      // Simulated AI response (would call real API in production)
      const output = {
        provider: node.data.provider,
        model: node.data.model,
        response: `AI Analysis result for: "${node.data.prompt.substring(0, 50)}..."`,
        inputTokens: Math.floor(Math.random() * 100),
        outputTokens: Math.floor(Math.random() * 100),
      };

      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'info',
        message: `AI analysis completed`,
        metadata: output,
      });

      return output;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'error',
        message: `AI analysis failed: ${message}`,
      });
      throw error;
    }
  }

  async executeLoggerNode(
    node: LoggerNodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await logService.createLog({
      executionId,
      nodeId: node.id,
      level: node.data.level,
      message: node.data.message,
      metadata: input,
    });

    return {
      logged: true,
      level: node.data.level,
      message: node.data.message,
    };
  }

  async executeNode(
    node: NodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    switch (node.type) {
      case 'timer':
        return this.executeTimerNode(node as TimerNodeConfig, executionId, input);
      case 'api':
        return this.executeAPINode(node as APINodeConfig, executionId, input);
      case 'ai':
        return this.executeAINode(node as AINodeConfig, executionId, input);
      case 'logger':
        return this.executeLoggerNode(node as LoggerNodeConfig, executionId, input);
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }
}

export const nodeExecutor = new NodeExecutor();
