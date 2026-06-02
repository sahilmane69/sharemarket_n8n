import { useState } from 'react';
import { Handle, Position, type HandleType } from '@xyflow/react';
import { Zap } from 'lucide-react';

interface TriggerNodeProps {
  data: {
    label: string;
    triggerType?: 'manual' | 'schedule' | 'webhook';
    schedule?: string;
  };
  isConnectable: boolean;
}

export function TriggerNode({ data, isConnectable }: TriggerNodeProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-linear-to-br from-purple-900 to-purple-800 border-2 border-purple-500 rounded-lg p-4 w-48 shadow-lg hover:shadow-purple-500/50 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-yellow-300" />
        <h3 className="font-bold text-purple-100 text-sm">Trigger</h3>
      </div>

      {!isEditing ? (
        <div
          className="text-xs text-purple-200 cursor-pointer hover:text-purple-100"
          onClick={() => setIsEditing(true)}
        >
          <p className="font-semibold">{data.label || 'Manual Trigger'}</p>
          {data.triggerType === 'schedule' && <p className="text-purple-300">{data.schedule}</p>}
          {data.triggerType === 'webhook' && <p className="text-purple-300">Webhook</p>}
        </div>
      ) : (
        <input
          autoFocus
          type="text"
          value={data.label}
          onChange={() => {
            // Handle edit - parent component will manage this
          }}
          onBlur={() => setIsEditing(false)}
          className="w-full px-2 py-1 bg-purple-700 border border-purple-400 rounded text-xs text-purple-100 placeholder-purple-400"
          placeholder="Node label"
        />
      )}

      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
