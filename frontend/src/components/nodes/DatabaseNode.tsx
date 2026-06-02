import { Handle, Position, type HandleType } from '@xyflow/react';
import { Database } from 'lucide-react';

interface DatabaseNodeProps {
  data: {
    label: string;
    operation?: string;
    table?: string;
  };
  isConnectable: boolean;
}

export function DatabaseNode({ data, isConnectable }: DatabaseNodeProps) {
  return (
    <div className="bg-linear-to-br from-red-900 to-red-800 border-2 border-red-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-red-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-red-300" />
        <h3 className="font-bold text-red-100 text-sm">Database</h3>
      </div>
      <p className="text-xs text-red-200 font-semibold">{data.label || 'DB Query'}</p>
      {data.operation && <p className="text-xs text-red-300 uppercase">{data.operation}</p>}
      {data.table && <p className="text-xs text-red-300">{data.table}</p>}

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
