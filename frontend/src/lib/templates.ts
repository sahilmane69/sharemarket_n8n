import type { WorkflowData } from '../types/workflow';
import { workflowUtils } from './workflowUtils';

export const workflowTemplates: Record<string, WorkflowData> = {
  aiStockResearch: {
    id: workflowUtils.generateId('template'),
    name: 'AI Stock Research Agent',
    description: 'Fetch stock data, gather news, analyze sentiment with AI, generate trading plan, and send report',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        label: 'Manual Trigger',
        position: { x: 50, y: 200 },
        data: { triggerType: 'manual' },
      },
      {
        id: 'api-stock-data',
        type: 'api',
        label: 'Fetch Stock Data',
        position: { x: 300, y: 50 },
        data: {
          method: 'GET',
          url: 'https://api.example.com/stocks/AAPL',
          headers: { 'Content-Type': 'application/json' },
        },
      },
      {
        id: 'api-news',
        type: 'api',
        label: 'Gather News',
        position: { x: 300, y: 150 },
        data: {
          method: 'GET',
          url: 'https://api.example.com/news?ticker=AAPL',
          headers: { 'Content-Type': 'application/json' },
        },
      },
      {
        id: 'ai-sentiment',
        type: 'ai',
        label: 'Analyze Sentiment',
        position: { x: 550, y: 100 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Analyze the sentiment of the following news articles and provide a score from -1 to 1',
        },
      },
      {
        id: 'ai-trading-plan',
        type: 'ai',
        label: 'Generate Trading Plan',
        position: { x: 800, y: 100 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Based on stock data and sentiment analysis, generate a trading recommendation',
        },
      },
      {
        id: 'email-report',
        type: 'email',
        label: 'Send Report',
        position: { x: 1050, y: 100 },
        data: {
          to: 'trader@example.com',
          subject: 'Daily Stock Research Report - {ticker}',
          body: 'Research Summary:\n\n{summary}',
        },
      },
      {
        id: 'db-log',
        type: 'database',
        label: 'Log Results',
        position: { x: 1050, y: 250 },
        data: {
          operation: 'insert',
          table: 'stock_analysis_logs',
          database: 'analytics',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'trigger-1', target: 'api-stock-data' },
      { id: 'edge-2', source: 'trigger-1', target: 'api-news' },
      { id: 'edge-3', source: 'api-stock-data', target: 'ai-sentiment' },
      { id: 'edge-4', source: 'api-news', target: 'ai-sentiment' },
      { id: 'edge-5', source: 'ai-sentiment', target: 'ai-trading-plan' },
      { id: 'edge-6', source: 'ai-trading-plan', target: 'email-report' },
      { id: 'edge-7', source: 'ai-trading-plan', target: 'db-log' },
    ],
  },

  dataProcessing: {
    id: workflowUtils.generateId('template'),
    name: 'Data Processing Pipeline',
    description: 'Fetch data from API, transform with AI, and store in database',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        label: 'Scheduled Daily',
        position: { x: 50, y: 200 },
        data: { triggerType: 'schedule', schedule: '0 0 * * *' },
      },
      {
        id: 'api-fetch',
        type: 'api',
        label: 'Fetch Data',
        position: { x: 300, y: 200 },
        data: {
          method: 'GET',
          url: 'https://api.example.com/data',
        },
      },
      {
        id: 'ai-transform',
        type: 'ai',
        label: 'Transform Data',
        position: { x: 550, y: 200 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Clean and normalize the following data',
        },
      },
      {
        id: 'db-save',
        type: 'database',
        label: 'Save to Database',
        position: { x: 800, y: 200 },
        data: {
          operation: 'insert',
          table: 'processed_data',
          database: 'main',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'trigger-1', target: 'api-fetch' },
      { id: 'edge-2', source: 'api-fetch', target: 'ai-transform' },
      { id: 'edge-3', source: 'ai-transform', target: 'db-save' },
    ],
  },

  conditionalNotification: {
    id: workflowUtils.generateId('template'),
    name: 'Conditional Notification',
    description: 'Check conditions and send notification if criteria are met',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        label: 'Webhook Trigger',
        position: { x: 50, y: 200 },
        data: { triggerType: 'webhook' },
      },
      {
        id: 'condition-1',
        type: 'condition',
        label: 'Check Threshold',
        position: { x: 300, y: 200 },
        data: {
          conditions: [
            {
              field: 'value',
              operator: 'gte',
              value: 100,
            },
          ],
          logic: 'and',
        },
      },
      {
        id: 'email-alert',
        type: 'email',
        label: 'Send Alert Email',
        position: { x: 550, y: 100 },
        data: {
          to: 'alert@example.com',
          subject: 'Alert: Threshold Exceeded',
          body: 'The value has exceeded the threshold',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'trigger-1', target: 'condition-1' },
      { id: 'edge-2', source: 'condition-1', target: 'email-alert' },
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
