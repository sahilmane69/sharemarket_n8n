import { Trash2, X } from 'lucide-react';

interface NodeSettingsPanelProps {
  node: any;
  onUpdate: (data: any) => void;
  onClose: () => void;
  onDelete: () => void;
}

export function NodeSettingsPanel({ node, onUpdate, onClose, onDelete }: NodeSettingsPanelProps) {
  if (!node) return null;

  const type = node.type;
  const data = node.data || {};

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  const handleDataChange = (key: string, value: any) => {
    onUpdate({ ...data, [key]: value });
  };

  return (
    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
        <h3 className="font-bold text-xs uppercase tracking-wider">
          Node Settings
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black hover:text-white transition-all cursor-pointer border border-black"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 text-xs font-semibold uppercase">
        {/* Label */}
        <div>
          <label className="block mb-1 text-[10px] tracking-wide opacity-80">Label</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={handleLabelChange}
            className="w-full p-2 bg-white border-2 border-black text-black font-medium"
          />
        </div>

        {/* Timer Config */}
        {type === 'timer' && (
          <div>
            <label className="block mb-1 text-[10px] tracking-wide opacity-80">Duration (ms)</label>
            <input
              type="number"
              value={data.duration !== undefined ? data.duration : 1000}
              onChange={(e) => handleDataChange('duration', parseInt(e.target.value, 10) || 0)}
              className="w-full p-2 bg-white border-2 border-black text-black font-medium"
            />
          </div>
        )}

        {/* API Config */}
        {type === 'api' && (
          <>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Method</label>
              <select
                value={data.method || 'GET'}
                onChange={(e) => handleDataChange('method', e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">URL</label>
              <input
                type="text"
                value={data.url || ''}
                onChange={(e) => handleDataChange('url', e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium normal-case"
                placeholder="https://api.example.com"
              />
            </div>
          </>
        )}

        {/* AI Config */}
        {type === 'ai' && (
          <>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Provider</label>
              <select
                value={data.provider || 'openai'}
                onChange={(e) => handleDataChange('provider', e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="local">Local Model</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Model</label>
              <input
                type="text"
                value={data.model || 'gpt-4'}
                onChange={(e) => handleDataChange('model', e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium normal-case"
              />
            </div>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Prompt</label>
              <textarea
                value={data.prompt || ''}
                onChange={(e) => handleDataChange('prompt', e.target.value)}
                rows={3}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium normal-case"
                placeholder="Recommend action based on bitcoin price: {{api-fetch.data}}"
              />
            </div>
          </>
        )}

        {/* Logger Config */}
        {type === 'logger' && (
          <>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Level</label>
              <select
                value={data.level || 'info'}
                onChange={(e) => handleDataChange('level', e.target.value)}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium"
              >
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
                <option value="debug">DEBUG</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[10px] tracking-wide opacity-80">Message</label>
              <textarea
                value={data.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
                rows={3}
                className="w-full p-2 bg-white border-2 border-black text-black font-medium normal-case"
                placeholder="Log message..."
              />
            </div>
          </>
        )}

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="w-full mt-6 px-3 py-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
}
