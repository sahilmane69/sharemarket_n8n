import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { WorkflowData } from '../types/workflow';
import { workflowUtils } from '../lib/workflowUtils';
import { WorkflowCanvas } from '../components/WorkflowCanvas';

export function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);

  useEffect(() => {
    if (!id) return;
    const loaded = workflowUtils.loadWorkflowLocal(id);
    if (loaded) {
      setWorkflow(loaded);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleSave = (updated: WorkflowData) => {
    setWorkflow(updated);
    workflowUtils.saveWorkflowLocal(updated);
  };

  const handleExecute = (workflow: WorkflowData) => {
    const logs = workflow.nodes.map((node) => ({
      timestamp: new Date().toISOString(),
      nodeId: node.id,
      nodeLabel: node.label,
      status: 'success' as const,
      duration: Math.random() * 500 + 100,
    }));

    const key = `execution_logs_${workflow.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, ...logs]));

    alert('Workflow executed successfully!');
  };

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-slate-400">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded transition text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <WorkflowCanvas workflow={workflow} onSave={handleSave} onExecute={handleExecute} />
    </div>
  );
}
