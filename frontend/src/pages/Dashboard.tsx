import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Play, RotateCcw, DollarSign } from 'lucide-react';
import { useWorkflows } from '../hooks/useWorkflows';
import { useExecution } from '../hooks/useExecution';
import { templateUtils, workflowTemplates } from '../lib/templates';
import { convertLocalWorkflowToBackend } from '../types/backend';
import { apiClient } from '../services/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { workflows, loading, error, listWorkflows, createWorkflow, deleteWorkflow } = useWorkflows();
  const { executeWorkflow } = useExecution();

  const [portfolio, setPortfolio] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    setPortfolioLoading(true);
    try {
      const p = await apiClient.getPortfolio();
      const t = await apiClient.getTransactions();
      setPortfolio(p);
      setTransactions(t);
    } catch (err) {
      console.error('Failed to load paper trading portfolio:', err);
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  useEffect(() => {
    listWorkflows();
    fetchPortfolioData();
  }, [listWorkflows, fetchPortfolioData]);

  const createNewWorkflow = async () => {
    try {
      const initialWorkflow = {
        name: 'New Automation Workflow',
        description: 'Describe what this workflow does',
        nodes: [
          {
            id: 'timer-1',
            type: 'timer' as const,
            label: 'Timer (1s)',
            position: { x: 100, y: 150 },
            data: { duration: 1000, label: 'Timer (1s)' },
          },
        ],
        edges: [],
      };
      const saved = await createWorkflow(initialWorkflow);
      navigate(`/workflow/${saved._id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create workflow');
    }
  };

  const createFromTemplate = async (templateKey: string) => {
    const template = templateUtils.createWorkflowFromTemplate(templateKey);
    if (template) {
      try {
        const backendPayload = convertLocalWorkflowToBackend(template);
        const saved = await createWorkflow(backendPayload);
        navigate(`/workflow/${saved._id}`);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to create from template');
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete workflow');
      }
    }
  };

  const handleRun = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await executeWorkflow(id);
      alert('Workflow execution started on the backend!');
      setTimeout(() => {
        fetchPortfolioData();
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to execute workflow');
    }
  };

  const handleResetPortfolio = async () => {
    if (window.confirm('Are you sure you want to reset your Paper Trading account balance to $100,000 and clear all transaction logs?')) {
      try {
        await apiClient.resetPortfolio();
        await fetchPortfolioData();
        alert('Account reset successfully!');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to reset portfolio');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans p-6 selection:bg-black selection:text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto border-4 border-black bg-white p-6 mb-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">AutoFlow</h1>
            <p className="text-sm font-semibold opacity-70 mt-1 uppercase">Simple Workflow Automation Platform</p>
          </div>
          <button
            onClick={createNewWorkflow}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-white hover:text-black text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Paper Trading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Balance Card */}
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Paper Trade Account
                </h3>
                <button
                  onClick={handleResetPortfolio}
                  title="Reset Account"
                  className="p-1 hover:bg-black hover:text-white transition-all cursor-pointer border border-black"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Cash Balance</p>
              <h2 className="text-3xl font-black mt-1">
                ${portfolio?.cash?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '100,000.00'}
              </h2>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Simulated virtual funds for training and strategy testing.
              </p>
            </div>
          </div>

          {/* Asset Holdings Card */}
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-bold text-xs uppercase tracking-wider border-b border-black pb-2 mb-4">
              Current Holdings
            </h3>
            <div className="max-h-48 overflow-y-auto">
              {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
                <div className="text-center py-6 text-gray-500 italic text-[11px]">
                  No active holdings. Run a trade-enabled workflow to buy assets.
                </div>
              ) : (
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-black text-left font-bold uppercase text-[9px] opacity-75">
                      <th className="pb-1">Asset</th>
                      <th className="pb-1 text-right">Qty</th>
                      <th className="pb-1 text-right">Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((h: any, idx: number) => (
                      <tr key={idx} className="border-b border-dashed border-gray-200">
                        <td className="py-2 font-bold uppercase">{h.symbol}</td>
                        <td className="py-2 text-right">{h.quantity}</td>
                        <td className="py-2 text-right">${h.averagePrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Transactions Card */}
          <div className="lg:col-span-1 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-bold text-xs uppercase tracking-wider border-b border-black pb-2 mb-4">
              Recent Transactions
            </h3>
            <div className="max-h-48 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-6 text-gray-500 italic text-[11px]">
                  No transaction history yet.
                </div>
              ) : (
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-black text-left font-bold uppercase text-[9px] opacity-75">
                      <th className="pb-1">Asset</th>
                      <th className="pb-1">Type</th>
                      <th className="pb-1 text-right">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((t: any, idx: number) => (
                      <tr key={idx} className="border-b border-dashed border-gray-200">
                        <td className="py-2 font-bold uppercase">{t.symbol}</td>
                        <td className="py-2 font-semibold">
                          <span className={`px-1 py-0.2 text-[9px] uppercase border border-black rounded ${
                            t.type === 'buy' ? 'bg-black text-white' : 'bg-white text-black'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-2 text-right">{t.quantity}</td>
                        <td className="py-2 text-right">${t.price?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-1">
            Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(workflowTemplates).map(([key, template]) => (
              <div
                key={template.id}
                className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide mb-2">{template.name}</h3>
                  <p className="text-xs opacity-75 mb-6">{template.description}</p>
                </div>
                <button
                  onClick={() => createFromTemplate(key)}
                  className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border-2 border-black font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows Section */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-1">
            My Workflows
          </h2>

          {loading && <div className="text-center py-12 font-bold uppercase text-xs">Loading Workflows...</div>}
          {error && <div className="text-center py-12 text-red-600 font-bold uppercase text-xs">Error: {error}</div>}

          {!loading && !error && workflows.length === 0 ? (
            <div className="border-2 border-dashed border-black bg-white text-center py-16 p-6">
              <p className="text-sm font-semibold opacity-70 mb-4">No workflows found in database</p>
              <button
                onClick={createNewWorkflow}
                className="inline-flex items-center gap-2 px-5 py-3 bg-black hover:bg-white hover:text-black text-white border-2 border-black font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Your First Workflow
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((wf: any) => (
                <div
                  key={wf._id}
                  onClick={() => navigate(`/workflow/${wf._id}`)}
                  className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wide mb-2">{wf.name}</h3>
                    <p className="text-xs opacity-75 mb-6 line-clamp-2">{wf.description}</p>

                    <div className="flex items-center justify-between text-[10px] font-bold uppercase opacity-65 mb-6 border-t border-black pt-3">
                      <span>{wf.nodes?.length || 0} nodes</span>
                      <span>{wf.edges?.length || 0} connections</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workflow/${wf._id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleRun(wf._id, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      Run
                    </button>
                    <button
                      onClick={(e) => handleDelete(wf._id, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-red-600 bg-white hover:bg-red-600 hover:text-white text-red-600 font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
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
