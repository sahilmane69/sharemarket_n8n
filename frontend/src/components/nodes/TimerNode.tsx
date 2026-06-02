import { Handle, Position, type HandleType } from '@xyflow/react';
import { Clock } from 'lucide-react';

interface TimerNodeProps {
  data: {
    label: string;
    duration?: number;
  };
  isConnectable: boolean;
}

export function TimerNode({ data, isConnectable }: TimerNodeProps) {
  return (
    <div className="bg-white border-2 border-black text-black rounded p-3 w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-black">
        <Clock className="w-4 h-4" />
        <h3 className="font-bold text-xs uppercase tracking-wider">Timer Trigger</h3>
      </div>
      <p className="text-xs font-semibold">{data.label || 'Timer (1s)'}</p>
      {data.duration !== undefined && <p className="text-[10px] text-gray-600 mt-1">{data.duration} ms</p>}

      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
