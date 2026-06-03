import { Plus, Trash2 } from 'lucide-react';
import type { NodeType } from '../types/workflow';

const nodeTypes: { type: NodeType; label: string; description: string }[] = [
  { type: 'timer', label: 'Timer Trigger', description: 'Trigger workflow after delay' },
  { type: 'api', label: 'API Call', description: 'Make HTTP requests' },
  { type: 'ai', label: 'AI Node', description: 'AI processing & analysis' },
  { type: 'logger', label: 'Logger', description: 'Log messages to execution logs' },
  { type: 'trade', label: 'Paper Trade', description: 'Simulate buy/sell or route via Alpaca' },
];

interface NodePanelProps {
  onAddNode: (type: NodeType) => void;
  onDeleteNode: () => void;
  hasSelected: boolean;
}

export function NodePanel({ onAddNode, onDeleteNode, hasSelected }: NodePanelProps) {
  return (
    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b-2 border-black pb-1">
        Add Nodes
      </h3>
      <div className="space-y-3">
        {nodeTypes.map(({ type, label, description }) => (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            className="w-full text-left px-3 py-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wide">{label}</p>
                <p className="text-[10px] opacity-80 mt-0.5">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {hasSelected && (
        <button
          onClick={onDeleteNode}
          className="w-full mt-6 px-3 py-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected Node
        </button>
      )}
    </div>
  );
}
