import { Request, Response } from 'express';
import { Portfolio } from '../models/Portfolio.js';
import { Transaction } from '../models/Transaction.js';

export async function getPortfolio(req: Request, res: Response): Promise<void> {
  let portfolio = await Portfolio.findOne();
  if (!portfolio) {
    portfolio = await Portfolio.create({ cash: 100000, holdings: [] });
  }
  res.json({ success: true, data: portfolio });
}

export async function resetPortfolio(req: Request, res: Response): Promise<void> {
  await Portfolio.deleteMany({});
  await Transaction.deleteMany({});
  const portfolio = await Portfolio.create({ cash: 100000, holdings: [] });
  res.json({ success: true, message: 'Portfolio reset successfully', data: portfolio });
}

export async function getTransactions(req: Request, res: Response): Promise<void> {
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  res.json({ success: true, data: transactions });
}
