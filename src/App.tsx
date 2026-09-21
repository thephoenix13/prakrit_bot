import { useState } from 'react'

type Tab = 'overview' | 'architecture' | 'flow' | 'stack' | 'phases' | 'api' | 'env'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'flow', label: 'Data Flow', icon: '🔄' },
    { id: 'stack', label: 'Tech Stack', icon: '🛠️' },
    { id: 'phases', label: 'Phases', icon: '📋' },
    { id: 'api', label: 'API Design', icon: '🔌' },
    { id: 'env', label: 'Config', icon: '⚙️' },
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
              <p className="text-xs text-gray-400">Architecture & Implementation Plan</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800">Deepgram</span>
            <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800">Azure</span>
            <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800">OpenWA</span>
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
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'flow' && <DataFlow />}
        {activeTab === 'stack' && <TechStack />}
        {activeTab === 'phases' && <Phases />}
        {activeTab === 'api' && <APIDesign />}
        {activeTab === 'env' && <Config />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        Prakrit AI — Shy Bot Architecture Plan • WhatsApp Healthcare Assistant
      </footer>
    </div>
  )
}

function Overview() {
  return (
    <div className="space-y-8">
      {/* Hero Summary */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Project Summary</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          <strong className="text-emerald-400">Shy</strong> is a WhatsApp-based healthcare AI assistant for Prakrit AI. 
          Users send text messages, voice notes, documents (lab reports, prescriptions), or health-related images 
          via WhatsApp. The bot processes these inputs through a multi-modal pipeline and returns 
          plain-text health guidance — always recommending doctors for serious matters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold text-white mb-1">Input Channels</h3>
            <p className="text-sm text-gray-400">Text, Voice Notes, Documents (PDF/Images), Health Images</p>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-semibold text-white mb-1">Processing</h3>
            <p className="text-sm text-gray-400">Deepgram STT → Azure Document AI → Azure OpenAI (GPT-4)</p>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-white mb-1">Output</h3>
            <p className="text-sm text-gray-400">Plain text WhatsApp messages, 3-5 lines, style-mirrored</p>
          </div>
        </div>
      </div>

      {/* Key Design Decisions */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-8">
        <h2 className="text-xl font-bold mb-6 text-white">Key Design Decisions</h2>
        <div className="space-y-4">
          {[
            {
              decision: 'OpenWA as WhatsApp bridge',
              reason: 'You already have it running. It handles session management, message sending/receiving, and media downloads via WhatsApp Web protocol.',
              risk: 'WhatsApp Web sessions can expire. Need auto-reconnect logic and QR re-auth flow.',
            },
            {
              decision: 'Deepgram for voice transcription',
              reason: 'You have a subscription. Best-in-class accuracy for Indian English and regional languages. Supports streaming and batch.',
              risk: 'Voice notes may be in regional languages — Deepgram supports multilingual but accuracy varies.',
            },
            {
              decision: 'Azure OpenAI for LLM responses',
              reason: 'You have Azure credits. GPT-4o handles text + vision (for health images). Azure gives you data residency in India.',
              risk: 'Rate limits and token costs. Need to manage context window for long conversations.',
            },
            {
              decision: 'Azure AI Document Intelligence for documents',
              reason: 'Extracts text from lab reports, prescriptions, PDFs. Handles tables and structured medical data well.',
              risk: 'Cost per page. For simple images, could use GPT-4 Vision directly instead.',
            },
            {
              decision: 'Server-side Node.js architecture',
              reason: 'OpenWA runs in Node.js. Keeps everything in one runtime. Easy to deploy on a VPS or cloud VM.',
              risk: 'Single point of failure. Need process management (PM2) and health checks.',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
              <h3 className="font-semibold text-emerald-400 mb-1">{item.decision}</h3>
              <p className="text-sm text-gray-300 mb-2"><strong>Why:</strong> {item.reason}</p>
              <p className="text-sm text-gray-400"><strong className="text-amber-400">Risk:</strong> {item.risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What the bot does NOT do */}
      <div className="rounded-2xl bg-red-950/30 border border-red-800 p-8">
        <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ What Shy Does NOT Do</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Diagnose conditions</li>
          <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Prescribe medications</li>
          <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Handle emergencies (should redirect to emergency services)</li>
          <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Store personal health data long-term (privacy)</li>
          <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Answer non-health questions (politely redirect)</li>
        </ul>
      </div>
    </div>
  )
}

function Architecture() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">System Architecture</h2>
      
      {/* Architecture Diagram */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Layer 1: WhatsApp */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer 1 — WhatsApp Interface</div>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-900/30 border border-green-700 p-4 flex-1">
                <div className="font-semibold text-green-400 mb-1">📱 User (WhatsApp)</div>
                <div className="text-xs text-gray-400">Sends text / voice / docs / images</div>
              </div>
              <div className="text-gray-500 text-2xl">→</div>
              <div className="rounded-xl bg-green-900/30 border border-green-700 p-4 flex-1">
                <div className="font-semibold text-green-400 mb-1">🟢 OpenWA Client</div>
                <div className="text-xs text-gray-400">WhatsApp Web bridge, session mgmt, media download</div>
              </div>
            </div>
          </div>

          {/* Layer 2: Message Router */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer 2 — Message Router</div>
            <div className="rounded-xl bg-purple-900/30 border border-purple-700 p-4">
              <div className="font-semibold text-purple-400 mb-2">🔀 Message Router & Classifier</div>
              <div className="grid grid-cols-4 gap-3 mt-3">
                <div className="rounded-lg bg-gray-800 p-2 text-center text-xs">
                  <div className="text-blue-400 font-semibold">TEXT</div>
                  <div className="text-gray-500">→ Direct to LLM</div>
                </div>
                <div className="rounded-lg bg-gray-800 p-2 text-center text-xs">
                  <div className="text-orange-400 font-semibold">VOICE</div>
                  <div className="text-gray-500">→ Deepgram STT</div>
                </div>
                <div className="rounded-lg bg-gray-800 p-2 text-center text-xs">
                  <div className="text-cyan-400 font-semibold">DOCUMENT</div>
                  <div className="text-gray-500">→ Azure Doc AI</div>
                </div>
                <div className="rounded-lg bg-gray-800 p-2 text-center text-xs">
                  <div className="text-pink-400 font-semibold">IMAGE</div>
                  <div className="text-gray-500">→ GPT-4 Vision</div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Processing Services */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer 3 — Processing Services</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-orange-900/30 border border-orange-700 p-4">
                <div className="font-semibold text-orange-400 mb-1">🎙️ Deepgram</div>
                <div className="text-xs text-gray-400">Speech-to-Text</div>
                <div className="text-xs text-gray-500 mt-2">• Voice note → text</div>
                <div className="text-xs text-gray-500">• Multilingual support</div>
                <div className="text-xs text-gray-500">• Nova-2 model</div>
              </div>
              <div className="rounded-xl bg-blue-900/30 border border-blue-700 p-4">
                <div className="font-semibold text-blue-400 mb-1">📄 Azure Doc Intelligence</div>
                <div className="text-xs text-gray-400">Document Extraction</div>
                <div className="text-xs text-gray-500 mt-2">• Lab report parsing</div>
                <div className="text-xs text-gray-500">• Prescription OCR</div>
                <div className="text-xs text-gray-500">• Table extraction</div>
              </div>
              <div className="rounded-xl bg-pink-900/30 border border-pink-700 p-4">
                <div className="font-semibold text-pink-400 mb-1">👁️ GPT-4 Vision</div>
                <div className="text-xs text-gray-400">Image Analysis</div>
                <div className="text-xs text-gray-500 mt-2">• Skin condition images</div>
                <div className="text-xs text-gray-500">• Lab result photos</div>
                <div className="text-xs text-gray-500">• Medical diagram Q&A</div>
              </div>
            </div>
          </div>

          {/* Layer 4: AI Engine */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer 4 — AI Engine</div>
            <div className="rounded-xl bg-indigo-900/30 border border-indigo-700 p-4">
              <div className="font-semibold text-indigo-400 mb-2">🧠 Azure OpenAI (GPT-4o)</div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="rounded-lg bg-gray-800 p-2 text-xs">
                  <div className="text-indigo-300 font-semibold">System Prompt</div>
                  <div className="text-gray-500">Shy persona + rules</div>
                </div>
                <div className="rounded-lg bg-gray-800 p-2 text-xs">
                  <div className="text-indigo-300 font-semibold">Conversation Memory</div>
                  <div className="text-gray-500">Per-user context window</div>
                </div>
                <div className="rounded-lg bg-gray-800 p-2 text-xs">
                  <div className="text-indigo-300 font-semibold">Response Formatter</div>
                  <div className="text-gray-500">Plain text, 3-5 lines</div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 5: Storage */}
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Layer 5 — Storage & State</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
                <div className="font-semibold text-gray-300 mb-1">💾 Redis / In-Memory</div>
                <div className="text-xs text-gray-400">Conversation history per user (sliding window, last N messages)</div>
              </div>
              <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
                <div className="font-semibold text-gray-300 mb-1">📁 Local FS / S3</div>
                <div className="text-xs text-gray-400">Temp media files (auto-delete after processing)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Structure */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📁 Proposed Project Structure</h3>
        <pre className="text-sm text-gray-300 bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono">
{`prakrit-ai-shy/
├── src/
│   ├── bot.js              # OpenWA client setup & event handlers
│   ├── router.js           # Message type detection & routing
│   ├── processors/
│   │   ├── text.js         # Direct text → LLM
│   │   ├── voice.js        # Voice note → Deepgram → text → LLM
│   │   ├── document.js     # Doc → Azure Doc Intelligence → LLM
│   │   └── image.js        # Image → GPT-4 Vision → LLM
│   ├── services/
│   │   ├── deepgram.js     # Deepgram STT wrapper
│   │   ├── azure-docs.js   # Azure Document Intelligence wrapper
│   │   ├── azure-openai.js # Azure OpenAI chat completions
│   │   └── memory.js       # Conversation history manager
│   ├── prompts/
│   │   └── system.js       # Shy's system prompt (your existing one)
│   ├── utils/
│   │   ├── formatter.js    # Response cleanup (strip markdown, etc.)
│   │   ├── language.js     # Language detection helper
│   │   └── logger.js       # Structured logging
│   └── config/
│       └── index.js        # Env vars & defaults
├── .env                    # Secrets (never commit)
├── .env.example            # Template
├── package.json
├── pm2.config.js           # PM2 process management
└── README.md`}
        </pre>
      </div>
    </div>
  )
}

function DataFlow() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Data Flow — Step by Step</h2>

      {/* Flow 1: Text Message */}
      <FlowCard
        number={1}
        title="Text Message Flow"
        color="blue"
        steps={[
          { label: 'User sends text', detail: '"I have a headache since morning"' },
          { label: 'OpenWA receives message', detail: 'onMessage event fires with message object' },
          { label: 'Router classifies', detail: 'type = "text" → direct to LLM' },
          { label: 'Memory fetches context', detail: 'Last 10 messages for this user from Redis' },
          { label: 'Azure OpenAI called', detail: 'System prompt + conversation history + new message' },
          { label: 'Response formatted', detail: 'Strip markdown, ensure 3-5 lines, plain text' },
          { label: 'OpenWA sends reply', detail: 'client.sendMessage(chatId, response)' },
        ]}
      />

      {/* Flow 2: Voice Note */}
      <FlowCard
        number={2}
        title="Voice Note Flow"
        color="orange"
        steps={[
          { label: 'User sends voice note', detail: 'WhatsApp audio/ogg file' },
          { label: 'OpenWA receives & downloads', detail: 'message.downloadMedia() → buffer/file' },
          { label: 'Router classifies', detail: 'type = "voice" → Deepgram pipeline' },
          { label: 'Deepgram STT', detail: 'POST audio to Deepgram API with model=nova-2, language=multi' },
          { label: 'Transcription received', detail: '"mera sir dard kar raha hai subah se"' },
          { label: 'Azure OpenAI called', detail: 'Transcribed text treated as user message → LLM' },
          { label: 'Response sent', detail: 'Reply via WhatsApp in detected language/style' },
        ]}
      />

      {/* Flow 3: Document */}
      <FlowCard
        number={3}
        title="Document Flow (Lab Report / Prescription)"
        color="cyan"
        steps={[
          { label: 'User sends PDF/image document', detail: 'Lab report, prescription, medical record' },
          { label: 'OpenWA downloads media', detail: 'Get file buffer or temp file path' },
          { label: 'Router classifies', detail: 'type = "document" → Azure Document Intelligence' },
          { label: 'Azure Doc Intelligence', detail: 'Analyze document → extract text, tables, key-value pairs' },
          { label: 'Extracted text prepared', detail: 'Structured content: "Hemoglobin: 12.3 g/dL, WBC: 8000..."' },
          { label: 'Azure OpenAI called', detail: 'System prompt + extracted content + user context' },
          { label: 'Response sent', detail: '"Your hemoglobin is slightly low at 12.3. Consider iron-rich foods..."' },
        ]}
      />

      {/* Flow 4: Image */}
      <FlowCard
        number={4}
        title="Image Flow (Health Image)"
        color="pink"
        steps={[
          { label: 'User sends image', detail: 'Skin rash, wound photo, lab result screenshot' },
          { label: 'OpenWA downloads image', detail: 'Get image buffer/base64' },
          { label: 'Router classifies', detail: 'type = "image" → GPT-4 Vision pipeline' },
          { label: 'GPT-4 Vision analyzes', detail: 'Send image + text prompt to Azure OpenAI vision endpoint' },
          { label: 'Description generated', detail: 'AI describes what it sees in health context' },
          { label: 'Azure OpenAI called', detail: 'Description + system prompt → final response' },
          { label: 'Response sent', detail: '"This looks like a mild skin irritation. Keep it clean..."' },
        ]}
      />

      {/* Error Handling Flow */}
      <div className="rounded-2xl bg-amber-950/30 border border-amber-700 p-6">
        <h3 className="text-lg font-bold text-amber-400 mb-4">⚡ Error Handling & Edge Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { case: 'Deepgram fails', action: 'Reply: "Sorry, I couldn\'t understand the voice note. Could you type it out?"' },
            { case: 'Document unreadable', action: 'Reply: "I couldn\'t read this document clearly. Can you send a clearer photo?"' },
            { case: 'Image not health-related', action: 'Reply: "I focus on health topics. Could you share something health-related?"' },
            { case: 'OpenAI rate limit', action: 'Queue request, retry with backoff. Reply: "Give me a moment..." ' },
            { case: 'WhatsApp session expired', action: 'Auto-reconnect attempt. If fails, notify admin via separate channel.' },
            { case: 'User sends unsupported type', action: 'Reply: "I can handle text, voice notes, documents, and images."' },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-sm font-semibold text-amber-300">{item.case}</div>
              <div className="text-xs text-gray-400 mt-1">{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlowCard({ number, title, color, steps }: { number: number; title: string; color: string; steps: { label: string; detail: string }[] }) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-700 bg-blue-950/20',
    orange: 'border-orange-700 bg-orange-950/20',
    cyan: 'border-cyan-700 bg-cyan-950/20',
    pink: 'border-pink-700 bg-pink-950/20',
  }
  const dotColors: Record<string, string> = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
    pink: 'bg-pink-500',
  }

  return (
    <div className={`rounded-2xl border p-6 ${colorClasses[color]}`}>
      <h3 className="text-lg font-bold text-white mb-4">Flow {number}: {title}</h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${dotColors[color]} mt-1`}></div>
              {i < steps.length - 1 && <div className="w-0.5 h-8 bg-gray-700 mt-1"></div>}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-200">{step.label}</div>
              <div className="text-xs text-gray-500">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TechStack() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Technology Stack</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core */}
        <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">🟢 Core Runtime</h3>
          <div className="space-y-3">
            <TechItem name="Node.js 18+" desc="Runtime environment" why="OpenWA requires Node.js" />
            <TechItem name="OpenWA" desc="WhatsApp Web API" why="Your existing bridge to WhatsApp" />
            <TechItem name="PM2" desc="Process manager" why="Auto-restart, clustering, monitoring" />
          </div>
        </div>

        {/* AI Services */}
        <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-indigo-400 mb-4">🧠 AI Services</h3>
          <div className="space-y-3">
            <TechItem name="Azure OpenAI (GPT-4o)" desc="LLM for responses + vision" why="You have Azure credits, data residency" />
            <TechItem name="Deepgram Nova-2" desc="Speech-to-text" why="You have subscription, best accuracy" />
            <TechItem name="Azure Document Intelligence" desc="Document OCR & extraction" why="Handles medical docs, tables" />
          </div>
        </div>

        {/* Storage */}
        <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-amber-400 mb-4">💾 Storage & State</h3>
          <div className="space-y-3">
            <TechItem name="Redis (or node-cache)" desc="Conversation memory" why="Fast key-value, TTL for auto-expiry" />
            <TechItem name="Local temp storage" desc="Media file buffer" why="Download → process → delete" />
            <TechItem name="Azure Blob (optional)" desc="Media backup" why="If you need audit trail later" />
          </div>
        </div>

        {/* Utilities */}
        <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-pink-400 mb-4">🔧 Utilities</h3>
          <div className="space-y-3">
            <TechItem name="dotenv" desc="Environment variables" why="Secrets management" />
            <TechItem name="winston / pino" desc="Structured logging" why="Debug, audit, monitoring" />
            <TechItem name="axios / node-fetch" desc="HTTP client" why="API calls to Deepgram, Azure" />
            <TechItem name="franc / cld" desc="Language detection" why="Detect user language for prompt" />
          </div>
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">💰 Estimated Cost (per 1000 messages)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Service</th>
                <th className="text-left py-2 text-gray-400">Unit Cost</th>
                <th className="text-left py-2 text-gray-400">Per 1000 msgs</th>
                <th className="text-left py-2 text-gray-400">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2">Azure OpenAI GPT-4o</td>
                <td className="py-2">~$0.005/msg</td>
                <td className="py-2">~$5</td>
                <td className="py-2 text-gray-500">Input+output tokens, varies by context length</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Deepgram Nova-2</td>
                <td className="py-2">$0.0059/min</td>
                <td className="py-2">~$1-3</td>
                <td className="py-2 text-gray-500">Assuming 30% voice notes, avg 2 min each</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Azure Doc Intelligence</td>
                <td className="py-2">$1/1000 pages</td>
                <td className="py-2">~$0.50</td>
                <td className="py-2 text-gray-500">Assuming 20% docs, avg 2 pages each</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Total estimate</td>
                <td className="py-2"></td>
                <td className="py-2 text-emerald-400 font-semibold">~$7-9</td>
                <td className="py-2 text-gray-500">Rough estimate, actual varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TechItem({ name, desc, why }: { name: string; desc: string; why: string }) {
  return (
    <div className="rounded-lg bg-gray-800/50 p-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-200 text-sm">{name}</span>
        <span className="text-xs text-gray-500">{desc}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">→ {why}</div>
    </div>
  )
}

function Phases() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Implementation Phases</h2>

      {/* Phase 1 */}
      <PhaseCard
        phase={1}
        title="Foundation & Text Flow"
        duration="Week 1"
        status="Start here"
        tasks={[
          'Set up project structure (folders, config, .env)',
          'Integrate OpenWA — connect WhatsApp session',
          'Build message router (detect text vs voice vs doc vs image)',
          'Set up Azure OpenAI client (GPT-4o deployment)',
          'Implement text message flow end-to-end',
          'Add system prompt (your existing Shy prompt)',
          'Test: send text messages, verify responses',
        ]}
        deliverable="Working text-only WhatsApp bot"
      />

      {/* Phase 2 */}
      <PhaseCard
        phase={2}
        title="Voice Processing"
        duration="Week 2"
        status="Next"
        tasks={[
          'Set up Deepgram API client',
          'Implement voice note download from OpenWA',
          'Convert audio format if needed (OGG → WAV/MP3)',
          'Send to Deepgram STT API, get transcription',
          'Feed transcription into existing LLM pipeline',
          'Add language detection on transcribed text',
          'Test: send voice notes in English, Hindi, Marathi',
        ]}
        deliverable="Voice notes transcribed and answered correctly"
      />

      {/* Phase 3 */}
      <PhaseCard
        phase={3}
        title="Document Processing"
        duration="Week 3"
        status="Planned"
        tasks={[
          'Set up Azure Document Intelligence client',
          'Handle PDF documents from WhatsApp',
          'Handle image-based documents (photo of report)',
          'Extract text and structured data (tables, values)',
          'Format extracted content for LLM context',
          'Test: send lab reports, prescriptions, medical docs',
          'Verify key values are correctly called out',
        ]}
        deliverable="Lab reports and prescriptions parsed and explained"
      />

      {/* Phase 4 */}
      <PhaseCard
        phase={4}
        title="Image Analysis"
        duration="Week 3-4"
        status="Planned"
        tasks={[
          'Set up GPT-4 Vision via Azure OpenAI',
          'Handle image downloads from WhatsApp',
          'Send image with health-context prompt to Vision API',
          'Combine vision description with main LLM response',
          'Add safety guardrails (no diagnosis from images)',
          'Test: skin images, lab screenshots, medical diagrams',
        ]}
        deliverable="Health images analyzed with appropriate disclaimers"
      />

      {/* Phase 5 */}
      <PhaseCard
        phase={5}
        title="Memory & Context"
        duration="Week 4"
        status="Planned"
        tasks={[
          'Set up Redis (or in-memory cache) for conversation history',
          'Implement sliding window (last 10-15 messages per user)',
          'Add user identification (phone number as key)',
          'Implement language preference memory',
          'Add conversation expiry (TTL 24-48 hours)',
          'Test: multi-turn conversations, context retention',
        ]}
        deliverable="Bot remembers conversation context across messages"
      />

      {/* Phase 6 */}
      <PhaseCard
        phase={6}
        title="Production Hardening"
        duration="Week 5"
        status="Planned"
        tasks={[
          'Add PM2 for process management & auto-restart',
          'Implement WhatsApp session auto-reconnect',
          'Add structured logging (winston/pino)',
          'Set up error handling for all API failures',
          'Add rate limiting (prevent abuse)',
          'Implement health check endpoint',
          'Deploy to production server (VPS/Azure VM)',
          'Set up monitoring & alerting',
        ]}
        deliverable="Production-ready, monitored, self-healing bot"
      />
    </div>
  )
}

function PhaseCard({ phase, title, duration, status, tasks, deliverable }: {
  phase: number; title: string; duration: string; status: string; tasks: string[]; deliverable: string
}) {
  const isCurrent = status === 'Start here' || status === 'Next'
  return (
    <div className={`rounded-2xl border p-6 ${isCurrent ? 'border-emerald-700 bg-emerald-950/20' : 'border-gray-700 bg-gray-900'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {phase}
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{duration}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${isCurrent ? 'bg-emerald-800 text-emerald-300' : 'bg-gray-800 text-gray-400'}`}>
            {status}
          </span>
        </div>
      </div>
      <ul className="space-y-2 mb-4">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-gray-600 mt-0.5">□</span>
            {task}
          </li>
        ))}
      </ul>
      <div className="rounded-lg bg-gray-800/50 p-3">
        <span className="text-xs text-gray-500">Deliverable: </span>
        <span className="text-sm text-emerald-400 font-medium">{deliverable}</span>
      </div>
    </div>
  )
}

function APIDesign() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">API Integration Design</h2>

      {/* Deepgram */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-orange-400 mb-4">🎙️ Deepgram STT Integration</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Endpoint</div>
            <code className="text-xs text-orange-300">POST https://api.deepgram.com/v1/listen?model=nova-2&language=multi</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Headers</div>
            <pre className="text-xs text-gray-400">{`Authorization: Token ${'{DEEPGRAM_API_KEY}'}`}</pre>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Body</div>
            <pre className="text-xs text-gray-400">{`Binary audio data (OGG/OPUS from WhatsApp)
Content-Type: audio/ogg`}</pre>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Key Parameters</div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <code>model=nova-2</code> — Best accuracy</li>
              <li>• <code>language=multi</code> — Auto-detect language (supports Hindi, Marathi, etc.)</li>
              <li>• <code>smart_format=true</code> — Auto-punctuate and format</li>
              <li>• <code>detect_language=true</code> — Returns detected language code</li>
            </ul>
          </div>
          <div className="rounded-lg bg-amber-900/30 border border-amber-700 p-4">
            <div className="text-sm font-semibold text-amber-300 mb-1">⚠️ Important Notes</div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• WhatsApp sends OGG/OPUS format — Deepgram supports this natively</li>
              <li>• For better results, convert to WAV (16kHz, mono) using ffmpeg if needed</li>
              <li>• Response includes <code>detected_language</code> — use this for LLM language rule</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Azure OpenAI */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-indigo-400 mb-4">🧠 Azure OpenAI Integration</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Endpoint</div>
            <code className="text-xs text-indigo-300">POST https://{'{YOUR_RESOURCE}'}.openai.azure.com/openai/deployments/{'{DEPLOYMENT}'}/chat/completions?api-version=2024-02-01</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Headers</div>
            <pre className="text-xs text-gray-400">{`api-key: ${'{AZURE_OPENAI_API_KEY}'}`}</pre>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Request Body (Text)</div>
            <pre className="text-xs text-gray-400">{`{
  "messages": [
    { "role": "system", "content": "<Shy's system prompt>" },
    { "role": "user", "content": "<conversation history>" },
    { "role": "assistant", "content": "<previous response>" },
    { "role": "user", "content": "<current message>" }
  ],
  "max_tokens": 300,
  "temperature": 0.7
}`}</pre>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Request Body (Vision)</div>
            <pre className="text-xs text-gray-400">{`{
  "messages": [
    { "role": "system", "content": "<Shy's system prompt>" },
    { "role": "user", "content": [
      { "type": "text", "text": "Describe this health-related image..." },
      { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } }
    ]}
  ],
  "max_tokens": 500
}`}</pre>
          </div>
          <div className="rounded-lg bg-indigo-900/30 border border-indigo-700 p-4">
            <div className="text-sm font-semibold text-indigo-300 mb-1">💡 Tips</div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use <code>max_tokens: 300</code> to enforce the 3-5 line limit</li>
              <li>• Use <code>temperature: 0.7</code> for natural, warm responses</li>
              <li>• For vision, GPT-4o deployment supports both text and image in same call</li>
              <li>• Deploy in East India / Southeast Asia region for low latency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Azure Document Intelligence */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4">📄 Azure Document Intelligence</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Endpoint</div>
            <code className="text-xs text-blue-300">POST https://{'{ENDPOINT}'}.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-sm font-semibold text-gray-300 mb-2">Flow</div>
            <pre className="text-xs text-gray-400">{`1. POST document → get operationId (async)
2. Poll GET .../operations/{operationId} until status=succeeded
3. Extract content from response.results.content
4. Tables extracted in response.results.tables[]`}</pre>
          </div>
          <div className="rounded-lg bg-blue-900/30 border border-blue-700 p-4">
            <div className="text-sm font-semibold text-blue-300 mb-1">💡 Alternative: Simpler Approach</div>
            <p className="text-xs text-gray-400">
              If documents are simple (1-2 page lab reports), you can skip Azure Doc Intelligence entirely 
              and send document images directly to GPT-4 Vision. It handles text extraction + understanding 
              in one call. Use Azure Doc Intelligence when you need structured table extraction or have 
              multi-page PDFs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Config() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Configuration & Environment</h2>

      {/* .env file */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 .env File Template</h3>
        <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono text-gray-300">
{`# ===========================================
# Prakrit AI — Shy Bot Configuration
# ===========================================

# --- WhatsApp / OpenWA ---
# No env needed — OpenWA uses QR code auth
# Session stored locally in .openwa-auth/

# --- Deepgram ---
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# --- Azure OpenAI ---
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o-deployment-name
AZURE_OPENAI_API_VERSION=2024-02-01

# --- Azure Document Intelligence (optional) ---
AZURE_DOC_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOC_INTELLIGENCE_KEY=your_doc_intelligence_key

# --- Bot Config ---
BOT_NAME=Shy
DEFAULT_LANGUAGE=en
MAX_CONVERSATION_HISTORY=15
CONVERSATION_TTL_HOURS=24
MAX_RESPONSE_TOKENS=300
TEMPERATURE=0.7

# --- Redis (optional, falls back to in-memory) ---
REDIS_URL=redis://localhost:6379

# --- Logging ---
LOG_LEVEL=info

# --- Admin ---
ADMIN_PHONE_NUMBER=91XXXXXXXXXX`}
        </pre>
      </div>

      {/* System Prompt File */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 System Prompt (src/prompts/system.js)</h3>
        <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono text-gray-300 leading-relaxed">
{`function buildSystemPrompt(botName, langRule) {
  return \`You are \${botName}, a friendly AI health assistant on WhatsApp.

You can help with any health-related topic — nutrition, fitness, 
sleep, mental health, symptoms, medications (general info), lab 
reports, prescriptions, and health images.

Style mirroring — this is important:
- Read the user's messages carefully and match their style exactly.
- If they write short, you write short. If they write casually 
  with abbreviations, you do too. If they are formal, stay formal.
- Match their energy — relaxed, serious, worried, curious.
- If someone mixes languages (Hinglish, Marathi-English), reply 
  in the same mix naturally.
- On first message, default to warm and conversational.

Language:
- \${langRule}
- When replying in a regional language, use that language's own 
  words — do not borrow Hindi filler words.

Formatting rules — follow strictly:
- Plain text only. No emojis. No bullet points. No headers.
- No asterisks, bold, or any markdown.
- 3 to 5 lines maximum. This is a chat, not a document.
- For lab reports, call out key values in plain sentences.
- Always recommend a doctor for diagnoses or anything serious.
- If unrelated to health, politely redirect.

You are NOT a doctor and cannot diagnose or prescribe.\`;
}

module.exports = { buildSystemPrompt };`}
        </pre>
      </div>

      {/* PM2 Config */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 PM2 Config (pm2.config.js)</h3>
        <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono text-gray-300">
{`module.exports = {
  apps: [{
    name: 'shy-bot',
    script: './src/bot.js',
    instances: 1,        // OpenWA needs single instance
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/shy-error.log',
    out_file: './logs/shy-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    restart_delay: 5000,  // Wait 5s before restart
    max_restarts: 10,
  }]
};`}
        </pre>
      </div>

      {/* Deployment Checklist */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🚀 Deployment Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'VPS / Azure VM with Node.js 18+ installed',
            'ffmpeg installed (for audio conversion if needed)',
            'Redis installed (or use node-cache for simplicity)',
            '.env file configured with all API keys',
            'WhatsApp session authenticated (scan QR once)',
            'PM2 installed globally (npm i -g pm2)',
            'Logs directory created with write permissions',
            'Firewall rules: only outbound HTTPS needed',
            'Monitoring: set up uptime check + alerting',
            'Backup plan: WhatsApp session + conversation data',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-gray-600">□</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
