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
    <div className="bg-white border-2 border-black text-black rounded p-3 w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-black">
        <Globe className="w-4 h-4" />
        <h3 className="font-bold text-xs uppercase tracking-wider">API Call</h3>
      </div>
      <p className="text-xs font-semibold">{data.label || 'HTTP Request'}</p>
      {data.method && <p className="text-[10px] text-gray-600 mt-1 uppercase">{data.method}</p>}
      {data.url && <p className="text-[9px] text-gray-500 truncate mt-0.5">{data.url}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
