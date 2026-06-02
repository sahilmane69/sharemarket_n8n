import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import type { WorkflowData, Execution } from '../types/workflow';
import { apiClient } from '../services/api';

interface ExecutionPanelProps {
  workflow: WorkflowData;
}

export function ExecutionPanel({ workflow }: ExecutionPanelProps) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExecutions = useCallback(async () => {
    try {
      const data = await apiClient.listExecutions(workflow.id);
      setExecutions(data);
    } catch (err) {
      console.error('Failed to fetch executions', err);
    }
  }, [workflow.id]);

  useEffect(() => {
    setLoading(true);
    fetchExecutions().finally(() => setLoading(false));
  }, [fetchExecutions]);

  // Poll for updates if any execution is running or pending
  useEffect(() => {
    const hasActive = executions.some(
      (e) => e.status === 'running' || e.status === 'pending'
    );
    if (!hasActive) return;

    const interval = setInterval(() => {
      fetchExecutions();
    }, 2000);

    return () => clearInterval(interval);
  }, [executions, fetchExecutions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-black shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'running':
        return <Clock className="w-4 h-4 text-black animate-spin shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
        <h3 className="font-bold text-xs uppercase tracking-wider">
          Execution History
        </h3>
        <button
          onClick={fetchExecutions}
          className="p-1 hover:bg-black hover:text-white transition-all cursor-pointer border border-black"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {loading && executions.length === 0 ? (
          <p className="text-center py-6 text-xs font-bold uppercase opacity-70">
            Loading history...
          </p>
        ) : executions.length === 0 ? (
          <p className="text-center py-6 text-xs font-bold uppercase opacity-70">
            No runs recorded
          </p>
        ) : (
          executions.map((exec) => (
            <div key={exec._id} className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(exec.status)}
                  <span className="text-[10px] font-bold uppercase">
                    {new Date(exec.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 border border-black ${
                  exec.status === 'completed' ? 'bg-black text-white' : 
                  exec.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-white'
                }`}>
                  {exec.status}
                </span>
              </div>

              {/* Node status list */}
              {exec.nodeExecutions && exec.nodeExecutions.length > 0 ? (
                <div className="space-y-1.5">
                  {exec.nodeExecutions.map((nodeExec) => {
                    const nodeLabel = workflow.nodes.find(n => n.id === nodeExec.nodeId)?.label || nodeExec.nodeId;
                    return (
                      <div key={nodeExec.nodeId} className="flex items-center justify-between text-[9px] font-semibold">
                        <span className="truncate max-w-[120px]">{nodeLabel}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="opacity-60">{nodeExec.duration !== undefined ? `${nodeExec.duration}ms` : ''}</span>
                          <span className={`uppercase font-bold ${
                            nodeExec.status === 'completed' ? 'text-black' : 
                            nodeExec.status === 'failed' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {nodeExec.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[9px] opacity-70 italic">Initializing nodes...</p>
              )}

              {exec.error && (
                <div className="mt-2 pt-2 border-t border-dashed border-red-300 text-[9px] text-red-600 font-bold uppercase normal-case">
                  Error: {exec.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
