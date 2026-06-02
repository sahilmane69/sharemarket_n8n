import axios, { AxiosInstance } from 'axios';
import type { Workflow, Execution, LogEntry } from '../types/workflow';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api',
      timeout: 30000,
    });
  }

  // Workflow endpoints
  async createWorkflow(data: any): Promise<Workflow> {
    const response = await this.client.post('/workflows', data);
    return response.data.data;
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await this.client.get(`/workflows/${id}`);
    return response.data.data;
  }

  async listWorkflows(): Promise<Workflow[]> {
    const response = await this.client.get('/workflows');
    return response.data.data;
  }

  async updateWorkflow(id: string, data: any): Promise<Workflow> {
    const response = await this.client.put(`/workflows/${id}`, data);
    return response.data.data;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.client.delete(`/workflows/${id}`);
  }

  // Execution endpoints
  async executeWorkflow(workflowId: string): Promise<Execution> {
    const response = await this.client.post(`/executions/${workflowId}/execute`);
    return response.data.data;
  }

  async getExecution(id: string): Promise<Execution> {
    const response = await this.client.get(`/executions/${id}`);
    return response.data.data;
  }

  async listExecutions(workflowId?: string): Promise<Execution[]> {
    const params = workflowId ? { workflowId } : {};
    const response = await this.client.get('/executions', { params });
    return response.data.data;
  }

  // Log endpoints
  async getExecutionLogs(executionId: string): Promise<LogEntry[]> {
    const response = await this.client.get(`/logs/${executionId}`);
    return response.data.data;
  }

  async getNodeLogs(executionId: string, nodeId: string): Promise<LogEntry[]> {
    const response = await this.client.get(`/logs/${executionId}/${nodeId}`);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
