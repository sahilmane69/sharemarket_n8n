import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Play, FileJson } from 'lucide-react';
import type { WorkflowData } from '../types/workflow';
import { workflowUtils } from '../lib/workflowUtils';
import { templateUtils, workflowTemplates } from '../lib/templates';

export function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowData[]>(() => {
    return workflowUtils.listWorkflowsLocal();
  });

  const createNewWorkflow = () => {
    const workflow = workflowUtils.createWorkflow(
      'New Workflow',
      'Untitled workflow'
    );
    workflowUtils.saveWorkflowLocal(workflow);
    navigate(`/workflow/${workflow.id}`);
  };

  const createFromTemplate = (templateKey: string) => {
    const workflow = templateUtils.createWorkflowFromTemplate(templateKey);
    if (workflow) {
      workflowUtils.saveWorkflowLocal(workflow);
      setWorkflows([...workflows, workflow]);
      navigate(`/workflow/${workflow.id}`);
    }
  };

  const deleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this workflow?')) {
      workflowUtils.deleteWorkflowLocal(id);
      setWorkflows(workflows.filter(w => w.id !== id));
    }
  };

  const importFromFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await workflowUtils.importWorkflow(file);
          workflowUtils.saveWorkflowLocal(imported);
          setWorkflows([...workflows, imported]);
        } catch {
          alert('Failed to import workflow');
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">AutoFlow</h1>
            <p className="text-slate-400 mt-1">AI-Powered Workflow Automation</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={importFromFile}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded transition border border-slate-600"
            >
              <FileJson className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={createNewWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Templates Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templateUtils.getTemplates().map((template, idx) => (
              <div
                key={template.id}
                className="bg-slate-900 border border-slate-700 rounded p-6 hover:border-slate-600 transition hover:shadow-lg hover:shadow-purple-500/20"
              >
                <h3 className="text-lg font-bold text-slate-100 mb-2">{template.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                <button
                  onClick={() => {
                    const keys = Object.keys(workflowTemplates);
                    createFromTemplate(keys[idx]);
                  }}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition text-sm"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">My Workflows</h2>
          {workflows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">No workflows yet</p>
              <button
                onClick={createNewWorkflow}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                <Plus className="w-4 h-4" />
                Create Your First Workflow
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map(workflow => (
                <div
                  key={workflow.id}
                  onClick={() => navigate(`/workflow/${workflow.id}`)}
                  className="bg-slate-900 border border-slate-700 rounded p-6 hover:border-slate-600 cursor-pointer transition hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{workflow.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{workflow.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>{workflow.nodes.length} nodes</span>
                    <span>{workflow.edges.length} connections</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workflow/${workflow.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded text-xs transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-900 hover:bg-green-800 text-green-100 rounded text-xs transition"
                    >
                      <Play className="w-3 h-3" />
                      Run
                    </button>
                    <button
                      onClick={(e) => deleteWorkflow(workflow.id, e)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded text-xs transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
