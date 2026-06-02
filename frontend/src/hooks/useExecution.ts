import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { Execution } from '../types/workflow';

export function useExecution() {
  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWorkflow = useCallback(async (workflowId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.executeWorkflow(workflowId);
      setExecution(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExecution = useCallback(async (executionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.getExecution(executionId);
      setExecution(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get execution');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll execution status
  useEffect(() => {
    if (!execution || execution.status === 'completed' || execution.status === 'failed') {
      return;
    }

    const interval = setInterval(() => {
      getExecution(execution._id);
    }, 1000);

    return () => clearInterval(interval);
  }, [execution, getExecution]);

  return {
    execution,
    loading,
    error,
    executeWorkflow,
    getExecution,
  };
}
