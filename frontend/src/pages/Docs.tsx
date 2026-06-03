import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ExternalLink, Github, Terminal, DollarSign, Clock, HelpCircle, Key } from 'lucide-react';

export function Docs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans p-6 selection:bg-black selection:text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto border-4 border-black bg-white p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <h1 className="text-2xl font-black uppercase tracking-tight">AutoFlow Docs</h1>
            </div>
            <p className="text-xs font-semibold opacity-70 mt-1 uppercase">Platform User Manual & Configuration Guides</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold uppercase tracking-wider text-xs cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Platform Overview */}
        <section className="border-b-2 border-black pb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gray-700" />
            1. Platform Overview
          </h2>
          <p className="text-xs leading-relaxed text-gray-700 mb-4 normal-case">
            AutoFlow is a high-performance, web-based automated share market orchestration platform. It allows developers and traders to link real-time price checkers, sentiment analyzing artificial intelligence models, logging triggers, and trade routing engines together using an intuitive flow canvas.
          </p>
        </section>

        {/* Node Glossary */}
        <section className="border-b-2 border-black pb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-700" />
            2. Node Glossary & Inputs
          </h2>
          
          <div className="space-y-4">
            {/* Timer */}
            <div className="border border-black p-3 bg-[#fafafa]">
              <h3 className="font-bold text-xs uppercase flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                Timer Trigger Node
              </h3>
              <p className="text-[11px] text-gray-600 normal-case mb-2">
                Triggers the execution of the workflow after a specified duration. Must be the root node in every workflow.
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-700 normal-case space-y-1 pl-1">
                <li><strong>Duration (ms):</strong> The amount of delay before triggering the next node (e.g. 1000ms = 1 second).</li>
              </ul>
            </div>

            {/* API */}
            <div className="border border-black p-3 bg-[#fafafa]">
              <h3 className="font-bold text-xs uppercase flex items-center gap-1.5 mb-1.5">
                <Terminal className="w-3.5 h-3.5" />
                API Call Node
              </h3>
              <p className="text-[11px] text-gray-600 normal-case mb-2">
                Sends HTTP requests to fetch live asset data, market tickers, or trigger webhooks.
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-700 normal-case space-y-1 pl-1">
                <li><strong>Method:</strong> HTTP request method (GET, POST, PUT, DELETE, PATCH).</li>
                <li><strong>URL:</strong> Destination URL (e.g., Yahoo Finance Charts, CoinGecko, or your custom endpoints).</li>
              </ul>
            </div>

            {/* AI */}
            <div className="border border-black p-3 bg-[#fafafa]">
              <h3 className="font-bold text-xs uppercase flex items-center gap-1.5 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                AI Analysis Node
              </h3>
              <p className="text-[11px] text-gray-600 normal-case mb-2">
                Processes data using large language models. Allows output variables from preceding nodes to be parsed into the prompt.
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-700 normal-case space-y-1 pl-1">
                <li><strong>Provider:</strong> OpenAI, Anthropic, or Local models.</li>
                <li><strong>Model Name:</strong> Target model configuration (e.g. gpt-4, claude-3-opus).</li>
                <li><strong>Prompt Template:</strong> Instruction set. Use <code>{"{{node-id.property}}"}</code> to inject responses from preceding nodes.</li>
              </ul>
            </div>

            {/* Trade */}
            <div className="border border-black p-3 bg-[#fafafa]">
              <h3 className="font-bold text-xs uppercase flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Paper Trade Node
              </h3>
              <p className="text-[11px] text-gray-600 normal-case mb-2">
                Simulates buying and selling equities/currencies natively, or dispatches paper orders directly to the Alpaca Brokerage.
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-700 normal-case space-y-1 pl-1">
                <li><strong>Action:</strong> BUY or SELL.</li>
                <li><strong>Symbol:</strong> Asset ticker (e.g. AAPL, TSLA, BTCUSD).</li>
                <li><strong>Quantity:</strong> Number of shares or units.</li>
                <li><strong>Mode:</strong> Local Simulation (uses local MongoDB portfolio) or Alpaca Paper Trading API (live sandbox broker execution).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Setting up Broker Keys */}
        <section className="border-b-2 border-black pb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-gray-700" />
            3. Connecting your Alpaca Broker Keys
          </h2>
          <p className="text-xs leading-relaxed text-gray-700 mb-4 normal-case">
            Alpaca provides an open-access sandbox environment for testing trading algorithms. To hook up your live-simulated trades, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-[11px] text-gray-700 normal-case space-y-2 pl-1 mb-4">
            <li>Create a free account on the <a href="https://alpaca.markets/" target="_blank" rel="noreferrer" className="underline font-bold inline-flex items-center gap-0.5 hover:bg-black hover:text-white px-0.5">Alpaca Website <ExternalLink className="w-3 h-3" /></a>.</li>
            <li>Log in and switch your dashboard mode from <strong>Live Trading</strong> to <strong>Paper Trading</strong>.</li>
            <li>On the right sidebar, click **Generate New API Keys**.</li>
            <li>Copy your <strong>API Key ID</strong> and <strong>Secret Key</strong>.</li>
            <li>Paste them directly into the settings fields of the **Paper Trade** node inside your workflow.</li>
          </ol>
        </section>

        {/* Developer Info */}
        <section className="bg-black text-white p-5 border-2 border-black">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Github className="w-5 h-5" />
                Developer Information
              </h3>
              <p className="text-[11px] opacity-80 mt-1 normal-case">
                This project was created and is actively maintained by:
              </p>
              <p className="text-xs font-bold mt-2 uppercase tracking-wide">
                Sahil Mane (Software Engineer)
              </p>
            </div>
            <a
              href="https://github.com/sahilmane69"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border-2 border-white bg-white text-black hover:bg-black hover:text-white hover:border-white transition-all font-bold uppercase tracking-wider text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              github.com/sahilmane69
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
