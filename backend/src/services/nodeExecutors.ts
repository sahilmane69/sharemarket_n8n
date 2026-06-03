import axios from 'axios';
import { sleep } from '../utils/helpers.js';
import { logService } from './logService.js';
import { Portfolio } from '../models/Portfolio.js';
import { Transaction } from '../models/Transaction.js';
import {
  NodeConfig,
  TimerNodeConfig,
  APINodeConfig,
  AINodeConfig,
  LoggerNodeConfig,
  TradeNodeConfig,
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

  async executeTradeNode(
    node: TradeNodeConfig,
    executionId: string,
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const symbol = (node.data.symbol || 'AAPL').toUpperCase();
    const action = node.data.action || 'buy';
    const quantity = node.data.quantity || 1;
    const mode = node.data.mode || 'simulation';

    await logService.createLog({
      executionId,
      nodeId: node.id,
      level: 'info',
      message: `Executing ${action.toUpperCase()} order for ${quantity} shares of ${symbol} (${mode} mode)...`,
    });

    try {
      let price = 0;
      
      if (input && Object.keys(input).length > 0) {
        const findPrice = (obj: any): number | null => {
          if (typeof obj === 'number') return obj;
          if (obj && typeof obj === 'object') {
            if (obj.regularMarketPrice !== undefined) return Number(obj.regularMarketPrice);
            if (obj.price !== undefined) return Number(obj.price);
            if (obj.usd !== undefined) return Number(obj.usd);
            for (const key of Object.keys(obj)) {
              const res = findPrice(obj[key]);
              if (res !== null) return res;
            }
          }
          return null;
        };
        const found = findPrice(input);
        if (found !== null) price = found;
      }

      if (!price || isNaN(price)) {
        try {
          const isCrypto = symbol.includes('USD') || ['BTC', 'ETH', 'SOL'].includes(symbol);
          if (isCrypto) {
            const cleanSym = symbol.replace('USD', '').toLowerCase();
            const lookup: Record<string, string> = { btc: 'bitcoin', eth: 'ethereum', sol: 'solana' };
            const coingeckoId = lookup[cleanSym] || cleanSym;
            const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
            if (res.data[coingeckoId]?.usd) {
              price = Number(res.data[coingeckoId].usd);
            }
          }

          if (!price) {
            const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
            price = Number(res.data.chart.result[0].meta.regularMarketPrice);
          }
        } catch (fetchErr) {
          console.error('Price fetch failed, falling back to mock price:', fetchErr);
          price = 150.0;
        }
      }

      if (!price || isNaN(price)) {
        price = 150.0;
      }

      const totalValue = price * quantity;

      if (mode === 'alpaca') {
        const apiKey = node.data.alpacaKeyId;
        const apiSecret = node.data.alpacaSecret;

        if (!apiKey || !apiSecret) {
          throw new Error('Alpaca API keys are missing from Trade Node settings.');
        }

        const res = await axios.post(
          'https://paper-api.alpaca.markets/v2/orders',
          {
            symbol: symbol,
            qty: String(quantity),
            side: action,
            type: 'market',
            time_in_force: 'gtc',
          },
          {
            headers: {
              'APCA-API-KEY-ID': apiKey,
              'APCA-API-SECRET-KEY': apiSecret,
              'Content-Type': 'application/json',
            },
          }
        );

        await logService.createLog({
          executionId,
          nodeId: node.id,
          level: 'info',
          message: `Alpaca Paper Trade executed successfully. Order ID: ${res.data.id}`,
          metadata: { order: res.data },
        });

        let portfolio = await Portfolio.findOne();
        if (!portfolio) {
          portfolio = await Portfolio.create({ cash: 100000, holdings: [] });
        }
        
        await Transaction.create({
          symbol,
          type: action,
          quantity,
          price,
          total: totalValue,
          mode: 'alpaca',
        });

        return {
          success: true,
          mode: 'alpaca',
          symbol,
          action,
          quantity,
          price,
          total: totalValue,
          alpacaOrderId: res.data.id,
        };
      } else {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) {
          portfolio = await Portfolio.create({ cash: 100000, holdings: [] });
        }

        if (action === 'buy') {
          if (portfolio.cash < totalValue) {
            throw new Error(`Insufficient cash balance. Required: $${totalValue.toFixed(2)}, Available: $${portfolio.cash.toFixed(2)}`);
          }

          portfolio.cash -= totalValue;
          const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
          if (holdingIndex >= 0) {
            const h = portfolio.holdings[holdingIndex];
            const totalQty = h.quantity + quantity;
            const avgPrice = ((h.quantity * h.averagePrice) + totalValue) / totalQty;
            h.quantity = totalQty;
            h.averagePrice = avgPrice;
          } else {
            portfolio.holdings.push({
              symbol,
              quantity,
              averagePrice: price,
            });
          }
        } else {
          const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
          if (holdingIndex < 0 || portfolio.holdings[holdingIndex].quantity < quantity) {
            const qtyHeld = holdingIndex >= 0 ? portfolio.holdings[holdingIndex].quantity : 0;
            throw new Error(`Insufficient asset holdings to sell. Attempted to sell ${quantity} shares of ${symbol}, but only hold ${qtyHeld}.`);
          }

          portfolio.cash += totalValue;
          const h = portfolio.holdings[holdingIndex];
          h.quantity -= quantity;
          if (h.quantity <= 0) {
            portfolio.holdings.splice(holdingIndex, 1);
          }
        }

        await portfolio.save();

        await Transaction.create({
          symbol,
          type: action,
          quantity,
          price,
          total: totalValue,
          mode: 'simulation',
        });

        const msg = `Successfully ${action.toUpperCase()} ${quantity} shares of ${symbol} at $${price.toFixed(2)} ($${totalValue.toFixed(2)})`;
        await logService.createLog({
          executionId,
          nodeId: node.id,
          level: 'info',
          message: msg,
          metadata: { portfolioCash: portfolio.cash, holdings: portfolio.holdings },
        });

        return {
          success: true,
          mode: 'simulation',
          symbol,
          action,
          quantity,
          price,
          total: totalValue,
          cashRemaining: portfolio.cash,
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await logService.createLog({
        executionId,
        nodeId: node.id,
        level: 'error',
        message: `Paper Trade failed: ${message}`,
      });
      throw error;
    }
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
      case 'trade':
        return this.executeTradeNode(node as TradeNodeConfig, executionId, input);
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }
}

export const nodeExecutor = new NodeExecutor();
