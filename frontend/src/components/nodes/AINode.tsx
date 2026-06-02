import { Handle, Position, type HandleType } from '@xyflow/react';
import { Cpu } from 'lucide-react';

interface AINodeProps {
  data: {
    label: string;
    provider?: string;
    model?: string;
  };
  isConnectable: boolean;
}

export function AINode({ data, isConnectable }: AINodeProps) {
  return (
    <div className="bg-linear-to-br from-orange-900 to-orange-800 border-2 border-orange-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-orange-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-4 h-4 text-orange-300" />
        <h3 className="font-bold text-orange-100 text-sm">AI</h3>
      </div>
      <p className="text-xs text-orange-200 font-semibold">{data.label || 'AI Processing'}</p>
      {data.provider && <p className="text-xs text-orange-300">{data.provider}</p>}
      {data.model && <p className="text-xs text-orange-300">{data.model}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
