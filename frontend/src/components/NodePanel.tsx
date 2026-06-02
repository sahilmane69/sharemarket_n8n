import { Plus, Trash2 } from 'lucide-react';
import type { NodeType } from '../types/workflow';

const nodeTypes: { type: NodeType; label: string; description: string }[] = [
  { type: 'trigger', label: 'Trigger', description: 'Start your workflow' },
  { type: 'api', label: 'API Call', description: 'Make HTTP requests' },
  { type: 'ai', label: 'AI', description: 'AI processing & analysis' },
  { type: 'condition', label: 'Condition', description: 'Branch logic' },
  { type: 'email', label: 'Email', description: 'Send emails' },
  { type: 'database', label: 'Database', description: 'Query databases' },
];

interface NodePanelProps {
  onAddNode: (type: NodeType) => void;
  onDeleteNode: () => void;
  hasSelected: boolean;
}

export function NodePanel({ onAddNode, onDeleteNode, hasSelected }: NodePanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded p-4">
      <h3 className="font-bold text-slate-100 mb-4">Add Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, description }) => (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm rounded transition border border-slate-600 hover:border-slate-500"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-slate-400">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {hasSelected && (
        <button
          onClick={onDeleteNode}
          className="w-full mt-4 px-3 py-2 bg-red-900 hover:bg-red-800 text-red-100 text-sm rounded transition flex items-center justify-center gap-2 border border-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected Node
        </button>
      )}
    </div>
  );
}
