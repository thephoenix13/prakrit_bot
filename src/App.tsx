import { useState } from 'react'

type Tab = 'dashboard' | 'setup' | 'architecture' | 'code' | 'testing'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [botStatus] = useState<'ready' | 'connecting' | 'error'>('ready')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'setup', label: 'Setup Guide', icon: '🚀' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'code', label: 'Code Reference', icon: '💻' },
    { id: 'testing', label: 'Testing', icon: '🧪' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-lg">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Prakrit AI — Shy Bot</h1>
              <p className="text-xs text-gray-400">WhatsApp Healthcare Assistant • Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={botStatus} />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'setup' && <SetupGuide />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'code' && <CodeReference />}
        {activeTab === 'testing' && <Testing />}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        Prakrit AI — Shy Bot • Phase 1: Foundation & Text Flow Complete
      </footer>
    </div>
  )
}

function StatusBadge({ status }: { status: 'ready' | 'connecting' | 'error' }) {
  const config = {
    ready: { color: 'bg-emerald-500', text: 'Bot Ready', subtext: 'All systems go' },
    connecting: { color: 'bg-amber-500 animate-pulse', text: 'Connecting...', subtext: 'Waiting for QR scan' },
    error: { color: 'bg-red-500', text: 'Error', subtext: 'Check logs' },
  }
  const c = config[status]
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
      <div className={`w-2.5 h-2.5 rounded-full ${c.color}`}></div>
      <div>
        <div className="text-xs font-semibold text-white">{c.text}</div>
        <div className="text-[10px] text-gray-500">{c.subtext}</div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Messages Today" value="0" icon="💬" trend="—" />
        <StatCard label="Active Users" value="0" icon="👥" trend="—" />
        <StatCard label="Voice Notes" value="0" icon="🎙️" trend="—" />
        <StatCard label="Avg Response" value="—" icon="⚡" trend="ms" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Start Bot"
          description="Run the bot locally with npm"
          command="cd bot && npm install && npm run dev"
          color="emerald"
        />
        <ActionCard
          title="Production Deploy"
          description="Start with PM2 for auto-restart"
          command="cd bot && npm run pm2:start"
          color="blue"
        />
        <ActionCard
          title="View Logs"
          description="Monitor bot activity"
          command="cd bot && npm run pm2:logs"
          color="purple"
        />
      </div>

      {/* Bot Capabilities */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Bot Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CapabilityCard
            icon="💬"
            title="Text Messages"
            status="ready"
            description="Health Q&A with style mirroring"
          />
          <CapabilityCard
            icon="🎙️"
            title="Voice Notes"
            status="ready"
            description="Deepgram STT → multilingual"
          />
          <CapabilityCard
            icon="📄"
            title="Documents"
            status="ready"
            description="Lab reports, prescriptions"
          />
          <CapabilityCard
            icon="🖼️"
            title="Images"
            status="ready"
            description="GPT-4 Vision analysis"
          />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Conversations</h2>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-sm">No conversations yet. Start the bot and send a message!</p>
          <p className="text-xs mt-2 text-gray-600">Connect WhatsApp by scanning the QR code in your terminal.</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, trend }: { label: string; value: string; icon: string; trend: string }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-500">{trend}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function ActionCard({ title, description, command, color }: { title: string; description: string; command: string; color: string }) {
  const borderColors: Record<string, string> = {
    emerald: 'border-emerald-700 hover:border-emerald-500',
    blue: 'border-blue-700 hover:border-blue-500',
    purple: 'border-purple-700 hover:border-purple-500',
  }
  return (
    <div className={`rounded-xl bg-gray-900 border p-4 transition-all cursor-pointer ${borderColors[color]}`}>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{description}</p>
      <code className="text-xs bg-gray-800 text-emerald-300 px-2 py-1 rounded block overflow-x-auto">{command}</code>
    </div>
  )
}

function CapabilityCard({ icon, title, status, description }: { icon: string; title: string; status: string; description: string }) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          status === 'ready' ? 'bg-emerald-900 text-emerald-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {status === 'ready' ? '✓ Ready' : 'Pending'}
        </span>
      </div>
      <h4 className="font-semibold text-white text-sm">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  )
}

function SetupGuide() {
  const steps = [
    {
      step: 1,
      title: 'Install Dependencies',
      description: 'Install Node.js packages for the bot',
      code: `cd bot
npm install`,
      notes: 'Requires Node.js 18+. Also needs Chrome/Chromium for OpenWA.',
    },
    {
      step: 2,
      title: 'Configure Environment',
      description: 'Set up your API keys',
      code: `cp .env.example .env
# Edit .env with your keys:
# - DEEPGRAM_API_KEY (from console.deepgram.com)
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_API_KEY
# - AZURE_OPENAI_DEPLOYMENT (your GPT-4o deployment name)`,
      notes: 'Never commit .env to git. It contains your secrets.',
    },
    {
      step: 3,
      title: 'Start the Bot',
      description: 'Launch in development mode',
      code: `npm run dev`,
      notes: 'A QR code will appear in your terminal. Scan it with WhatsApp (Settings → Linked Devices → Link a Device).',
    },
    {
      step: 4,
      title: 'Test It',
      description: 'Send your first message',
      code: `# From WhatsApp, send:
"Hey, I have a headache since morning"

# Or send a voice note
# Or send a photo of a lab report`,
      notes: 'The bot should respond within 2-5 seconds depending on API latency.',
    },
    {
      step: 5,
      title: 'Deploy to Production',
      description: 'Use PM2 for process management',
      code: `# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# View logs
npm run pm2:logs

# Set up auto-start on server reboot
pm2 startup
pm2 save`,
      notes: 'PM2 handles auto-restart, log rotation, and memory management.',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 to-gray-900 border border-emerald-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🚀 Setup Guide</h2>
        <p className="text-gray-300">Get Shy running in 5 steps. Total time: ~10 minutes.</p>
      </div>

      {steps.map((s) => (
        <div key={s.step} className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white">
              {s.step}
            </div>
            <div>
              <h3 className="font-bold text-white">{s.title}</h3>
              <p className="text-xs text-gray-400">{s.description}</p>
            </div>
          </div>
          <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto text-emerald-300 font-mono mb-3">
            {s.code}
          </pre>
          <div className="text-xs text-amber-400 bg-amber-950/30 border border-amber-800 rounded-lg p-3">
            💡 {s.notes}
          </div>
        </div>
      ))}

      {/* Prerequisites */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Prerequisites</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Node.js 18+', status: 'Required', desc: 'Runtime for OpenWA' },
            { name: 'Deepgram API Key', status: 'Required', desc: 'Voice transcription' },
            { name: 'Azure OpenAI', status: 'Required', desc: 'GPT-4o deployment' },
            { name: 'Azure Doc Intelligence', status: 'Optional', desc: 'Document OCR' },
            { name: 'Redis', status: 'Optional', desc: 'Persistent memory' },
            { name: 'Chrome/Chromium', status: 'Required', desc: 'OpenWA headless browser' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
              <div className={`w-2 h-2 rounded-full ${item.status === 'Required' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <div>
                <div className="text-sm font-semibold text-gray-200">{item.name}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Architecture() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Architecture</h2>

      {/* Flow Diagram */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Message Processing Pipeline</h3>
        <div className="min-w-[700px] flex items-center gap-2">
          <FlowNode color="green" label="WhatsApp" sublabel="User sends message" />
          <FlowArrow />
          <FlowNode color="green" label="OpenWA" sublabel="Receives & downloads" />
          <FlowArrow />
          <FlowNode color="purple" label="Router" sublabel="Classifies type" />
          <FlowArrow />
          <FlowNode color="orange" label="Processor" sublabel="STT / OCR / Vision" />
          <FlowArrow />
          <FlowNode color="indigo" label="GPT-4o" sublabel="Generates response" />
          <FlowArrow />
          <FlowNode color="emerald" label="Formatter" sublabel="Plain text cleanup" />
          <FlowArrow />
          <FlowNode color="green" label="Reply" sublabel="Sent via WhatsApp" />
        </div>
      </div>

      {/* Type Routing */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Message Type Routing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RouteCard
            type="Text"
            color="blue"
            path="Router → Text Processor → Azure OpenAI → Response"
            services={['Azure OpenAI (GPT-4o)']}
          />
          <RouteCard
            type="Voice Note"
            color="orange"
            path="Router → Voice Processor → Deepgram STT → Text Processor → Azure OpenAI → Response"
            services={['Deepgram Nova-2', 'Azure OpenAI (GPT-4o)']}
          />
          <RouteCard
            type="Document"
            color="cyan"
            path="Router → Doc Processor → Azure Doc Intelligence → Azure OpenAI → Response"
            services={['Azure Document Intelligence', 'Azure OpenAI (GPT-4o)']}
          />
          <RouteCard
            type="Image"
            color="pink"
            path="Router → Image Processor → GPT-4 Vision → Azure OpenAI → Response"
            services={['Azure OpenAI GPT-4o Vision']}
          />
        </div>
      </div>

      {/* File Structure */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Project Structure</h3>
        <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono text-gray-300">
{`bot/
├── src/
│   ├── bot.js              ← Entry point (OpenWA + event handlers)
│   ├── router.js           ← Message type classifier
│   ├── config/
│   │   └── index.js        ← Environment config loader
│   ├── processors/
│   │   ├── text.js         ← Text → LLM
│   │   ├── voice.js        ← Voice → Deepgram → LLM
│   │   ├── document.js     ← Doc → Azure DI → LLM
│   │   └── image.js        ← Image → GPT-4 Vision
│   ├── services/
│   │   ├── azure-openai.js ← Chat + Vision API
│   │   ├── deepgram.js     ← Speech-to-text
│   │   ├── azure-docs.js   ← Document OCR
│   │   └── memory.js       ← Conversation history
│   ├── prompts/
│   │   └── system.js       ← Shy's system prompt
│   └── utils/
│       ├── formatter.js    ← Strip markdown, limit lines
│       ├── language.js     ← Detect user language
│       └── logger.js       ← Pino structured logging
├── .env.example
├── pm2.config.js
└── package.json`}
        </pre>
      </div>
    </div>
  )
}

function FlowNode({ color, label, sublabel }: { color: string; label: string; sublabel: string }) {
  const colors: Record<string, string> = {
    green: 'border-green-600 bg-green-950/40',
    purple: 'border-purple-600 bg-purple-950/40',
    orange: 'border-orange-600 bg-orange-950/40',
    indigo: 'border-indigo-600 bg-indigo-950/40',
    emerald: 'border-emerald-600 bg-emerald-950/40',
  }
  return (
    <div className={`rounded-xl border px-3 py-2 text-center min-w-[100px] ${colors[color]}`}>
      <div className="text-xs font-bold text-white">{label}</div>
      <div className="text-[10px] text-gray-400">{sublabel}</div>
    </div>
  )
}

function FlowArrow() {
  return <div className="text-gray-600 text-lg">→</div>
}

function RouteCard({ type, color, path, services }: { type: string; color: string; path: string; services: string[] }) {
  const colors: Record<string, string> = {
    blue: 'border-blue-700',
    orange: 'border-orange-700',
    cyan: 'border-cyan-700',
    pink: 'border-pink-700',
  }
  return (
    <div className={`rounded-xl border bg-gray-800/30 p-4 ${colors[color]}`}>
      <div className="font-semibold text-white text-sm mb-2">{type}</div>
      <div className="text-xs text-gray-400 mb-3 font-mono">{path}</div>
      <div className="flex flex-wrap gap-1">
        {services.map((s, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">{s}</span>
        ))}
      </div>
    </div>
  )
}

function CodeReference() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Code Reference</h2>

      {/* Key Files */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Key Implementation Files</h3>
        <div className="space-y-4">
          <CodeFile
            name="bot.js"
            description="Main entry point — initializes OpenWA, registers event handlers, manages lifecycle"
            highlights={['create() — OpenWA client creation', 'onMessage — incoming message handler', 'keepAlive — periodic status logging', 'shutdown — graceful cleanup']}
          />
          <CodeFile
            name="router.js"
            description="Classifies messages by type and dispatches to correct processor"
            highlights={['classifyMessage() — detects text/voice/doc/image', 'routeMessage() — calls appropriate processor', 'Handles unsupported types gracefully']}
          />
          <CodeFile
            name="services/azure-openai.js"
            description="Azure OpenAI client wrapper for chat and vision completions"
            highlights={['chatCompletion() — text-only messages', 'visionCompletion() — image + text messages', 'Uses @azure/openai SDK']}
          />
          <CodeFile
            name="services/deepgram.js"
            description="Deepgram STT wrapper for voice note transcription"
            highlights={['transcribe() — audio buffer → text', 'Uses Nova-2 model with multi-language', 'Returns text, language, confidence']}
          />
          <CodeFile
            name="services/memory.js"
            description="Conversation memory with Redis or in-memory fallback"
            highlights={['getHistory() — fetch user conversation', 'addMessage() — append to sliding window', 'TTL-based auto-expiry']}
          />
          <CodeFile
            name="processors/text.js"
            description="Text message processing — language detection, context building, LLM call"
            highlights={['isHealthRelated() — filters non-health queries', 'detectLanguage() — sets language rule', 'buildSystemPrompt() — dynamic prompt assembly']}
          />
        </div>
      </div>

      {/* Important Patterns */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Important Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PatternCard
            title="Style Mirroring"
            description="The system prompt instructs GPT-4o to match the user's writing style — short/long, formal/casual, language mix."
          />
          <PatternCard
            title="Plain Text Output"
            description="formatter.js strips all markdown, emojis, and limits to 3-5 lines. WhatsApp doesn't render markdown."
          />
          <PatternCard
            title="Language Detection"
            description="Both Deepgram (for voice) and franc (for text) detect language. The system prompt adapts dynamically."
          />
          <PatternCard
            title="Sliding Window Memory"
            description="Only the last N messages are kept per user. Older messages are automatically dropped."
          />
          <PatternCard
            title="Graceful Degradation"
            description="If Azure DI is unavailable, falls back to GPT-4 Vision. If Redis is unavailable, uses in-memory cache."
          />
          <PatternCard
            title="Health Gate"
            description="isHealthRelated() checks for health keywords. Non-health queries get a polite redirect on first message."
          />
        </div>
      </div>
    </div>
  )
}

function CodeFile({ name, description, highlights }: { name: string; description: string; highlights: string[] }) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald-400 font-mono text-sm font-bold">src/{name}</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{description}</p>
      <ul className="space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
            <span className="text-gray-600">•</span> {h}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PatternCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
      <h4 className="font-semibold text-emerald-400 text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}

function Testing() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Testing Checklist</h2>

      {/* Test Scenarios */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Test Scenarios</h3>
        <div className="space-y-3">
          {[
            {
              category: 'Text Messages',
              tests: [
                'Send "I have a headache" → should get health advice',
                'Send "hey whats up" → should redirect to health topics',
                'Send "mera sir dard kar raha hai" → should respond in Hinglish',
                'Send "मुझे बुखार है" → should respond in Hindi',
                'Send multiple messages → should maintain context',
                'Send very long message → response should still be 3-5 lines',
              ],
            },
            {
              category: 'Voice Notes',
              tests: [
                'Send English voice note → should transcribe and respond',
                'Send Hindi voice note → should detect language and respond in Hindi',
                'Send unclear audio → should ask to retry',
                'Send very short voice note → should handle gracefully',
              ],
            },
            {
              category: 'Documents',
              tests: [
                'Send photo of blood test report → should extract values',
                'Send PDF prescription → should read medication names',
                'Send blurry document photo → should ask for clearer image',
                'Send document with caption "what does this mean?" → should analyze',
              ],
            },
            {
              category: 'Images',
              tests: [
                'Send skin rash photo → should describe without diagnosing',
                'Send lab result screenshot → should read values',
                'Send non-health image (cat photo) → should redirect',
                'Send image with caption → should consider caption context',
              ],
            },
            {
              category: 'Edge Cases',
              tests: [
                'Send sticker → should handle unsupported type',
                'Send location → should handle unsupported type',
                'Send message while bot is processing → should queue or handle',
                'Send message after 24h gap → should start fresh conversation',
                'Send rapid messages → should not crash',
              ],
            },
          ].map((section, i) => (
            <div key={i} className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
              <h4 className="font-semibold text-white text-sm mb-3">{section.category}</h4>
              <div className="space-y-2">
                {section.tests.map((test, j) => (
                  <label key={j} className="flex items-start gap-2 text-xs text-gray-300 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500" />
                    {test}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Commands */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Debug Commands</h3>
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Check bot is running</div>
            <code className="text-sm text-emerald-300">pm2 list</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">View live logs</div>
            <code className="text-sm text-emerald-300">pm2 logs shy-bot --lines 100</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Restart after code change</div>
            <code className="text-sm text-emerald-300">pm2 restart shy-bot</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Check memory usage</div>
            <code className="text-sm text-emerald-300">pm2 monit</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Test Deepgram API directly</div>
            <code className="text-sm text-emerald-300">{`curl -X POST "https://api.deepgram.com/v1/listen?model=nova-2" \\
  -H "Authorization: Token $DEEPGRAM_API_KEY" \\
  -H "Content-Type: audio/wav" \\
  --data-binary @test.wav`}</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
