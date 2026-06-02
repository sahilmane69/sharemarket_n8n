import { Handle, Position, type HandleType } from '@xyflow/react';
import { Globe } from 'lucide-react';

interface APINodeProps {
  data: {
    label: string;
    method?: string;
    url?: string;
  };
  isConnectable: boolean;
}

export function APINode({ data, isConnectable }: APINodeProps) {
  return (
    <div className="bg-linear-to-br from-blue-900 to-blue-800 border-2 border-blue-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-blue-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-blue-300" />
        <h3 className="font-bold text-blue-100 text-sm">API Call</h3>
      </div>
      <p className="text-xs text-blue-200 font-semibold">{data.label || 'HTTP Request'}</p>
      {data.method && <p className="text-xs text-blue-300">{data.method}</p>}
      {data.url && <p className="text-xs text-blue-300 truncate">{data.url}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
