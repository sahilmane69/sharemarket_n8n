import { Handle, Position, type HandleType } from '@xyflow/react';
import { DollarSign } from 'lucide-react';

interface TradeNodeProps {
  data: {
    label: string;
    symbol?: string;
    action?: 'buy' | 'sell';
    quantity?: number;
    mode?: 'simulation' | 'alpaca';
  };
  isConnectable: boolean;
}

export function TradeNode({ data, isConnectable }: TradeNodeProps) {
  const symbol = (data.symbol || 'AAPL').toUpperCase();
  const action = (data.action || 'buy').toUpperCase();
  const qty = data.quantity ?? 1;
  const mode = data.mode || 'simulation';

  return (
    <div className="bg-white border-2 border-black text-black rounded p-3 w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-black">
        <DollarSign className="w-4 h-4" />
        <h3 className="font-bold text-xs uppercase tracking-wider">Paper Trade</h3>
      </div>
      <p className="text-xs font-semibold">{data.label || 'Trade Node'}</p>
      
      <div className="mt-2 space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500">Action:</span>
          <span className={`font-bold px-1 py-0.2 border border-black rounded text-[9px] uppercase ${
            action === 'BUY' ? 'bg-black text-white' : 'bg-white text-black'
          }`}>
            {action}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500">Asset:</span>
          <span className="font-bold">{symbol}</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500">Quantity:</span>
          <span className="font-bold">{qty}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] text-gray-400 italic pt-1 border-t border-dashed border-gray-300">
          <span>Mode:</span>
          <span>{mode === 'alpaca' ? 'Alpaca Paper' : 'Local Sim'}</span>
        </div>
      </div>

      <Handle type={'target' as HandleType} position={Position.Left} isConnectable={isConnectable} />
      <Handle type={'source' as HandleType} position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
