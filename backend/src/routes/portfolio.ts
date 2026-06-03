import { Router } from 'express';
import {
  getPortfolio,
  resetPortfolio,
  getTransactions,
} from '../controllers/portfolioController.js';

const router = Router();

router.get('/', getPortfolio);
router.post('/reset', resetPortfolio);
router.get('/transactions', getTransactions);

export default router;
