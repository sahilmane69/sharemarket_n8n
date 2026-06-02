import type { WorkflowData } from '../types/workflow';
import { workflowUtils } from './workflowUtils';

export const workflowTemplates: Record<string, WorkflowData> = {
  stockSentimentAnalysis: {
    id: workflowUtils.generateId('template'),
    name: 'AAPL Stock Sentiment Monitor',
    description: 'Fetch Apple Inc. (AAPL) stock data, perform AI market analysis, and log Buy/Sell signals.',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'timer-trigger',
        type: 'timer',
        label: 'Timer (5s)',
        position: { x: 50, y: 150 },
        data: { duration: 5000, label: 'Timer (5s)' },
      },
      {
        id: 'api-yahoo-finance',
        type: 'api',
        label: 'Yahoo Finance AAPL',
        position: { x: 280, y: 150 },
        data: {
          method: 'GET',
          url: 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=1d',
          headers: { 'Content-Type': 'application/json' },
          label: 'Yahoo Finance AAPL',
        },
      },
      {
        id: 'ai-sentiment-analysis',
        type: 'ai',
        label: 'AI Sentiment Analyst',
        position: { x: 510, y: 150 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'You are a stock analyst. Analyze the following Yahoo Finance AAPL data and advise if it is a BUY, SELL, or HOLD. Give a concise justification: {{api-yahoo-finance.data}}',
          label: 'AI Sentiment Analyst',
        },
      },
      {
        id: 'logger-signals',
        type: 'logger',
        label: 'Log Stock Signals',
        position: { x: 740, y: 150 },
        data: {
          level: 'info',
          message: 'Apple stock analysis completed. Trading signal logged.',
          label: 'Log Stock Signals',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'timer-trigger', target: 'api-yahoo-finance' },
      { id: 'edge-2', source: 'api-yahoo-finance', target: 'ai-sentiment-analysis' },
      { id: 'edge-3', source: 'ai-sentiment-analysis', target: 'logger-signals' },
    ],
  },
  cryptoBreakoutMonitor: {
    id: workflowUtils.generateId('template'),
    name: 'Crypto Breakout Alerts',
    description: 'Monitor Bitcoin & Ethereum prices, check for key level breakouts using AI, and trigger logger alerts.',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'timer-trigger',
        type: 'timer',
        label: 'Timer (10s)',
        position: { x: 50, y: 150 },
        data: { duration: 10000, label: 'Timer (10s)' },
      },
      {
        id: 'api-coingecko',
        type: 'api',
        label: 'CoinGecko Price API',
        position: { x: 280, y: 150 },
        data: {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
          headers: { 'Content-Type': 'application/json' },
          label: 'CoinGecko Price API',
        },
      },
      {
        id: 'ai-breakout-checker',
        type: 'ai',
        label: 'AI Breakout Detector',
        position: { x: 510, y: 150 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Look at the current prices of BTC and ETH: {{api-coingecko.data}}. Explain if there is a bullish breakout above $70,000 for BTC or $3,500 for ETH.',
          label: 'AI Breakout Detector',
        },
      },
      {
        id: 'logger-alerts',
        type: 'logger',
        label: 'Log Alert Signal',
        position: { x: 740, y: 150 },
        data: {
          level: 'warn',
          message: 'Level breakout evaluated by AI.',
          label: 'Log Alert Signal',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'timer-trigger', target: 'api-coingecko' },
      { id: 'edge-2', source: 'api-coingecko', target: 'ai-breakout-checker' },
      { id: 'edge-3', source: 'ai-breakout-checker', target: 'logger-alerts' },
    ],
  },
  portfolioRebalancer: {
    id: workflowUtils.generateId('template'),
    name: 'AI Portfolio Optimizer',
    description: 'Fetch mock index weights, ask AI for risk-based portfolio rebalancing targets, and log trade recommendations.',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'timer-trigger',
        type: 'timer',
        label: 'Timer (30s)',
        position: { x: 50, y: 150 },
        data: { duration: 30000, label: 'Timer (30s)' },
      },
      {
        id: 'api-index-weights',
        type: 'api',
        label: 'Get Index Weights',
        position: { x: 280, y: 150 },
        data: {
          method: 'GET',
          url: 'https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1d',
          headers: { 'Content-Type': 'application/json' },
          label: 'Get Index Weights',
        },
      },
      {
        id: 'ai-portfolio-rebalancer',
        type: 'ai',
        label: 'AI Asset Allocator',
        position: { x: 510, y: 150 },
        data: {
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Given index performance: {{api-index-weights.data}}, output a rebalanced allocation table for a conservative portfolio consisting of S&P500, Gold, and Cash.',
          label: 'AI Asset Allocator',
        },
      },
      {
        id: 'logger-rebalance-log',
        type: 'logger',
        label: 'Log Rebalance Advice',
        position: { x: 740, y: 150 },
        data: {
          level: 'info',
          message: 'Portfolio allocation calculated and stored.',
          label: 'Log Rebalance Advice',
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'timer-trigger', target: 'api-index-weights' },
      { id: 'edge-2', source: 'api-index-weights', target: 'ai-portfolio-rebalancer' },
      { id: 'edge-3', source: 'ai-portfolio-rebalancer', target: 'logger-rebalance-log' },
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
