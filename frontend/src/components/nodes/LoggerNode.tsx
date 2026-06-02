import { Handle, Position, type HandleType } from '@xyflow/react';
import { Terminal } from 'lucide-react';

interface LoggerNodeProps {
  data: {
    label: string;
    level?: string;
    message?: string;
  };
  isConnectable: boolean;
}

export function LoggerNode({ data, isConnectable }: LoggerNodeProps) {
  return (
    <div className="bg-white border-2 border-black text-black rounded p-3 w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-black">
        <Terminal className="w-4 h-4" />
        <h3 className="font-bold text-xs uppercase tracking-wider">Logger</h3>
      </div>
      <p className="text-xs font-semibold">{data.label || 'Logger Node'}</p>
      {data.level && <p className="text-[10px] text-gray-600 mt-1 uppercase">[{data.level}] {data.message}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
