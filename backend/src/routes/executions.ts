import { Router } from 'express';
import {
  getExecution,
  listExecutions,
  executeWorkflow,
} from '../controllers/executionController.js';

const router = Router();

router.post('/:workflowId/execute', executeWorkflow);
router.get('/:id', getExecution);
router.get('/', listExecutions);

export default router;
