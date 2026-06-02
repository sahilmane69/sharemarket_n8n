import { Router } from 'express';
import {
  getExecutionLogs,
  getNodeLogs,
} from '../controllers/logController.js';

const router = Router();

router.get('/:executionId', getExecutionLogs);
router.get('/:executionId/:nodeId', getNodeLogs);

export default router;
