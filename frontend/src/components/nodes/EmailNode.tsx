import { Handle, Position, type HandleType } from '@xyflow/react';
import { Mail } from 'lucide-react';

interface EmailNodeProps {
  data: {
    label: string;
    to?: string;
  };
  isConnectable: boolean;
}

export function EmailNode({ data, isConnectable }: EmailNodeProps) {
  return (
    <div className="bg-linear-to-br from-green-900 to-green-800 border-2 border-green-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-green-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-green-300" />
        <h3 className="font-bold text-green-100 text-sm">Email</h3>
      </div>
      <p className="text-xs text-green-200 font-semibold">{data.label || 'Send Email'}</p>
      {data.to && <p className="text-xs text-green-300 truncate">{data.to}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
