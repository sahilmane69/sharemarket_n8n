import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { Workflow } from '../types/workflow';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.listWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkflow = useCallback(
    async (workflow: any) => {
      setLoading(true);
      setError(null);
      try {
        const newWorkflow = await apiClient.createWorkflow(workflow);
        setWorkflows([newWorkflow, ...workflows]);
        return newWorkflow;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [workflows]
  );

  const updateWorkflow = useCallback(
    async (id: string, data: any) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await apiClient.updateWorkflow(id, data);
        setWorkflows(workflows.map((w) => (w._id === id ? updated : w)));
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [workflows]
  );

  const deleteWorkflow = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.deleteWorkflow(id);
        setWorkflows(workflows.filter((w) => w._id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [workflows]
  );

  return {
    workflows,
    loading,
    error,
    listWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}
