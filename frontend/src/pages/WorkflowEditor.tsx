import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { WorkflowData } from '../types/workflow';
import { apiClient } from '../services/api';
import { convertBackendWorkflowToLocal, convertLocalWorkflowToBackend } from '../types/backend';
import { WorkflowCanvas } from '../components/WorkflowCanvas';

export function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    apiClient.getWorkflow(id)
      .then((data) => {
        setWorkflow(convertBackendWorkflowToLocal(data as any));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load workflow');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (updated: WorkflowData) => {
    if (!id) return;
    try {
      const backendPayload = convertLocalWorkflowToBackend(updated);
      const saved = await apiClient.updateWorkflow(id, backendPayload);
      setWorkflow(convertBackendWorkflowToLocal(saved as any));
      alert('Workflow saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save workflow');
    }
  };

  const handleExecute = async (_workflow: WorkflowData) => {
    if (!id) return;
    try {
      await apiClient.executeWorkflow(id);
      alert('Workflow execution started on the backend!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to execute workflow');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fafafa] text-black font-sans uppercase font-bold text-xs">
        <div>Loading workflow...</div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa] text-black font-sans p-6">
        <div className="text-red-600 font-bold uppercase text-xs mb-4">Error: {error || 'Workflow not found'}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] text-black font-sans">
      <div className="bg-white border-b-4 border-black p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white font-bold uppercase tracking-wider text-xs transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <WorkflowCanvas workflow={workflow} onSave={handleSave} onExecute={handleExecute} />
    </div>
  );
}
