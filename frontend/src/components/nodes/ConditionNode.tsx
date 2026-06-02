import { Handle, Position, type HandleType } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

interface ConditionNodeProps {
  data: {
    label: string;
    logic?: string;
  };
  isConnectable: boolean;
}

export function ConditionNode({ data, isConnectable }: ConditionNodeProps) {
  return (
    <div className="bg-linear-to-br from-cyan-900 to-cyan-800 border-2 border-cyan-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-cyan-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-cyan-300" />
        <h3 className="font-bold text-cyan-100 text-sm">Condition</h3>
      </div>
      <p className="text-xs text-cyan-200 font-semibold">{data.label || 'If/Then'}</p>
      {data.logic && <p className="text-xs text-cyan-300 uppercase">{data.logic}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
