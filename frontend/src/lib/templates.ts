import type { WorkflowData } from '../types/workflow';
import { workflowUtils } from './workflowUtils';

export const workflowTemplates: Record<string, WorkflowData> = {
  aiStockResearch: {
    id: workflowUtils.generateId('template'),
    name: 'AI Crypto Trading Assistant',
    description: 'Fetch coin price, analyze market signal with AI, and log recommendation',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'timer-trigger',
        type: 'timer',
        label: 'Timer (1s)',
        position: { x: 50, y: 150 },
        data: { duration: 1000, label: 'Timer (1s)' },
      },
      {
        id: 'api-fetch',
        type: 'api',
        label: 'Fetch Bitcoin Price',
        position: { x: 280, y: 150 },
        data: {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          headers: { 'Content-Type': 'application/json' },
          label: 'Fetch Bitcoin Price',
        },
      },
      {
        id: 'ai-analysis',
        type: 'ai',
        label: 'Analyze signal',
        position: { x: 510, y: 150 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Recommend BUY or SELL based on this price data: {{api-fetch.data}}',
          label: 'Analyze signal',
        },
      },
      {
        id: 'logger-log',
        type: 'logger',
        label: 'Log recommendation',
        position: { x: 740, y: 150 },
        data: {
          level: 'info',
          message: 'Signal successfully calculated by AI.',
          label: 'Log recommendation',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'timer-trigger', target: 'api-fetch' },
      { id: 'edge-2', source: 'api-fetch', target: 'ai-analysis' },
      { id: 'edge-3', source: 'ai-analysis', target: 'logger-log' },
    ],
  },
};

export const templateUtils = {
  getTemplates: () => Object.values(workflowTemplates),
  getTemplate: (key: string) => workflowTemplates[key],
  createWorkflowFromTemplate: (key: string): WorkflowData | null => {
    const template = workflowTemplates[key];
    if (!template) return null;
    return {
      ...template,
      id: workflowUtils.generateId('workflow'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
