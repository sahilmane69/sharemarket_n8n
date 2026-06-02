import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { WorkflowData, ExecutionLog } from '../types/workflow';

interface ExecutionPanelProps {
  workflow: WorkflowData;
}

export function ExecutionPanel({ workflow }: ExecutionPanelProps) {
  const [logs, setLogs] = useState<ExecutionLog[]>(() => {
    const key = `execution_logs_${workflow.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const getStatusIcon = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const recentLogs = logs.slice(-5).reverse();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded p-4">
      <h3 className="font-bold text-slate-100 mb-4">Execution Logs</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentLogs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No executions yet</p>
        ) : (
          recentLogs.map((log, idx) => (
            <div key={idx} className="bg-slate-800 p-3 rounded border border-slate-700">
              <div className="flex items-start gap-2">
                {getStatusIcon(log.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200">{log.nodeLabel}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                  {log.error && <p className="text-xs text-red-400 mt-1">{log.error}</p>}
                  {log.duration && <p className="text-xs text-slate-500">{log.duration}ms</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => {
          const key = `execution_logs_${workflow.id}`;
          localStorage.removeItem(key);
          setLogs([]);
        }}
        className="w-full mt-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition"
      >
        Clear Logs
      </button>
    </div>
  );
}
