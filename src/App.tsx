import { useState } from 'react'

type Tab = 'dashboard' | 'deploy' | 'architecture' | 'commands' | 'monitoring'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'deploy', label: 'Deploy', icon: '🚀' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'commands', label: 'Commands', icon: '⌨️' },
    { id: 'monitoring', label: 'Monitoring', icon: '📈' },
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
              <p className="text-xs text-gray-400">Production-Ready WhatsApp Healthcare Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-emerald-900/50 text-emerald-400 text-xs font-medium border border-emerald-700">
              ✓ Production Ready
            </span>
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
        {activeTab === 'deploy' && <Deploy />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'commands' && <Commands />}
        {activeTab === 'monitoring' && <Monitoring />}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        Prakrit AI — Shy Bot • All phases complete • Ready for GitHub + Azure deployment
      </footer>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Completion Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-700 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">✅</div>
          <div>
            <h2 className="text-xl font-bold text-white">All Phases Complete</h2>
            <p className="text-sm text-emerald-300">Bot is production-ready for GitHub + Azure deployment</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-4">
          {['Foundation', 'Voice', 'Documents', 'Images', 'Memory', 'Hardening'].map((phase, i) => (
            <div key={i} className="rounded-lg bg-emerald-900/30 border border-emerald-700 px-3 py-2 text-center">
              <div className="text-[10px] text-emerald-400">Phase {i + 1}</div>
              <div className="text-xs font-medium text-white">{phase}</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">✓ Done</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Source Files" value="15" icon="📁" />
        <StatCard label="API Integrations" value="3" icon="🔌" />
        <StatCard label="Message Types" value="4" icon="💬" />
        <StatCard label="Admin Commands" value="7" icon="⌨️" />
      </div>

      {/* File Overview */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Project Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileGroup
            title="Core Bot"
            files={[
              { name: 'src/bot.js', desc: 'Entry point, OpenWA, lifecycle' },
              { name: 'src/router.js', desc: 'Message type classifier' },
              { name: 'src/server.js', desc: 'Health check HTTP server' },
              { name: 'src/config/index.js', desc: 'Environment config' },
            ]}
          />
          <FileGroup
            title="Processors"
            files={[
              { name: 'processors/text.js', desc: 'Text → LLM' },
              { name: 'processors/voice.js', desc: 'Voice → Deepgram → LLM' },
              { name: 'processors/document.js', desc: 'Doc → Azure DI → LLM' },
              { name: 'processors/image.js', desc: 'Image → GPT-4 Vision' },
            ]}
          />
          <FileGroup
            title="Services"
            files={[
              { name: 'services/azure-openai.js', desc: 'Chat + Vision API' },
              { name: 'services/deepgram.js', desc: 'Speech-to-text' },
              { name: 'services/azure-docs.js', desc: 'Document OCR' },
              { name: 'services/memory.js', desc: 'Conversation history' },
              { name: 'services/metrics.js', desc: 'Performance metrics' },
            ]}
          />
          <FileGroup
            title="Middleware & Utils"
            files={[
              { name: 'middleware/rateLimit.js', desc: 'Rate limiting' },
              { name: 'middleware/admin.js', desc: 'Admin commands' },
              { name: 'utils/formatter.js', desc: 'Plain text cleanup' },
              { name: 'utils/language.js', desc: 'Language detection' },
              { name: 'utils/logger.js', desc: 'Structured logging' },
            ]}
          />
        </div>
      </div>

      {/* Deployment Files */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Deployment & CI/CD</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileGroup
            title="Docker"
            files={[
              { name: 'Dockerfile', desc: 'Multi-stage production build' },
              { name: 'docker-compose.yml', desc: 'Local dev with Redis' },
              { name: '.dockerignore', desc: 'Docker build exclusions' },
            ]}
          />
          <FileGroup
            title="Azure & GitHub"
            files={[
              { name: '.github/workflows/ci-cd.yml', desc: 'Build, push, deploy' },
              { name: 'scripts/azure-setup.sh', desc: 'One-click Azure setup' },
              { name: 'docs/AZURE_DEPLOYMENT.md', desc: 'Complete deploy guide' },
              { name: 'docs/GITHUB_SECRETS.md', desc: 'Secrets configuration' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function FileGroup({ title, files }: { title: string; files: { name: string; desc: string }[] }) {
  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-emerald-400 mb-3">{title}</h3>
      <div className="space-y-2">
        {files.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gray-600 text-xs mt-0.5">📄</span>
            <div>
              <code className="text-xs text-gray-200 font-mono">{f.name}</code>
              <div className="text-[10px] text-gray-500">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Deploy() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Deployment Guide</h2>

      {/* Quick Deploy */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-950/50 to-gray-900 border border-blue-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">🚀 Quick Deploy (3 Steps)</h3>
        <p className="text-sm text-gray-300 mb-4">Get Shy running on Azure in under 15 minutes.</p>
        <div className="space-y-4">
          <Step number={1} title="Create Azure Resources" command="./scripts/azure-setup.sh" />
          <Step number={2} title="Configure GitHub Secrets" command="See docs/GITHUB_SECRETS.md" />
          <Step number={3} title="Push to main" command="git push origin main" />
        </div>
      </div>

      {/* Azure Resources Created */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Azure Resources Created by Setup Script</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Resource Group', desc: 'prakrit-ai-rg', icon: '📦' },
            { name: 'Container Registry', desc: 'prakritai.azurecr.io', icon: '🐳' },
            { name: 'Container Apps Env', desc: 'prakrit-ai-env', icon: '🌐' },
            { name: 'Container App', desc: 'shy-bot', icon: '🚀' },
            { name: 'Redis Cache', desc: 'prakrit-redis', icon: '🔴' },
            { name: 'Log Analytics', desc: 'prakrit-ai-logs', icon: '📊' },
          ].map((r, i) => (
            <div key={i} className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{r.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                  <code className="text-[10px] text-gray-400">{r.desc}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CI/CD Pipeline */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">CI/CD Pipeline (GitHub Actions)</h3>
        <div className="flex flex-wrap items-center gap-2">
          <PipelineStep label="Push to main" color="gray" />
          <PipelineArrow />
          <PipelineStep label="CI: Build & Test" color="blue" />
          <PipelineArrow />
          <PipelineStep label="Build Docker" color="purple" />
          <PipelineArrow />
          <PipelineStep label="Push to ACR" color="orange" />
          <PipelineArrow />
          <PipelineStep label="Deploy to Azure" color="emerald" />
          <PipelineArrow />
          <PipelineStep label="Health Check" color="green" />
        </div>
        <div className="mt-4 rounded-lg bg-gray-800 p-3">
          <div className="text-xs text-gray-400 mb-1">Triggers on:</div>
          <code className="text-xs text-emerald-300">push to main, pull request to main</code>
        </div>
      </div>

      {/* GitHub Secrets */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Required GitHub Secrets</h3>
        <div className="space-y-3">
          <SecretRow name="AZURE_CREDENTIALS" desc="Service principal JSON for Azure deployment" />
          <SecretRow name="AZURE_ACR_USERNAME" desc="Container Registry username" />
          <SecretRow name="AZURE_ACR_PASSWORD" desc="Container Registry password" />
        </div>
        <div className="mt-4 rounded-lg bg-amber-950/30 border border-amber-700 p-3">
          <div className="text-xs text-amber-300">
            💡 Create service principal: <code className="text-amber-200">az ad sp create-for-rbac --name "github-actions" --role contributor --scopes /subscriptions/&#123;sub-id&#125;/resourceGroups/prakrit-ai-rg --sdk-auth</code>
          </div>
        </div>
      </div>

      {/* Docker Commands */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Docker Commands</h3>
        <div className="space-y-3">
          <CodeBlock label="Local development (with Redis)" command="cd bot && docker-compose up -d" />
          <CodeBlock label="Build image" command="cd bot && docker build -t shy-bot:latest ." />
          <CodeBlock label="View logs" command="cd bot && docker-compose logs -f shy-bot" />
          <CodeBlock label="Stop" command="cd bot && docker-compose down" />
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, command }: { number: number; title: string; command: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{title}</div>
        <code className="text-xs bg-gray-800 text-emerald-300 px-2 py-1 rounded mt-1 inline-block">{command}</code>
      </div>
    </div>
  )
}

function PipelineStep({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-700 border-gray-600',
    blue: 'bg-blue-900/50 border-blue-700',
    purple: 'bg-purple-900/50 border-purple-700',
    orange: 'bg-orange-900/50 border-orange-700',
    emerald: 'bg-emerald-900/50 border-emerald-700',
    green: 'bg-green-900/50 border-green-700',
  }
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs font-medium text-white ${colors[color]}`}>
      {label}
    </div>
  )
}

function PipelineArrow() {
  return <div className="text-gray-600">→</div>
}

function SecretRow({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <div>
        <code className="text-sm text-emerald-300 font-mono">{name}</code>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-700">Required</span>
    </div>
  )
}

function CodeBlock({ label, command }: { label: string; command: string }) {
  return (
    <div className="rounded-lg bg-gray-800 p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <code className="text-sm text-emerald-300 font-mono">{command}</code>
    </div>
  )
}

function Architecture() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Architecture</h2>

      {/* Pipeline */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Message Processing Pipeline</h3>
        <div className="min-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
            <ArchNode color="green" label="WhatsApp" sub="User" />
            <ArchArrow />
            <ArchNode color="green" label="OpenWA" sub="Bridge" />
            <ArchArrow />
            <ArchNode color="yellow" label="Rate Limit" sub="Middleware" />
            <ArchArrow />
            <ArchNode color="purple" label="Router" sub="Classifier" />
          </div>
          <div className="flex items-start gap-2 ml-[200px]">
            <div className="flex flex-col gap-2">
              <ArchNode color="blue" label="Text" sub="→ GPT-4o" />
              <ArchNode color="orange" label="Voice" sub="→ Deepgram → GPT-4o" />
              <ArchNode color="cyan" label="Document" sub="→ Azure DI → GPT-4o" />
              <ArchNode color="pink" label="Image" sub="→ GPT-4 Vision" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <ArchNode color="indigo" label="Azure OpenAI" sub="GPT-4o" />
            <ArchArrow />
            <ArchNode color="emerald" label="Formatter" sub="Plain text" />
            <ArchArrow />
            <ArchNode color="green" label="Reply" sub="WhatsApp" />
          </div>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Production Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-950/30 border border-blue-700 p-4">
            <h4 className="font-semibold text-blue-400 mb-3">Azure Container Apps</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Auto-scaling (1-3 replicas)</li>
              <li>• Health probes (/health, /ready)</li>
              <li>• Managed HTTPS ingress</li>
              <li>• Log Analytics integration</li>
              <li>• Revision management</li>
            </ul>
          </div>
          <div className="rounded-xl bg-red-950/30 border border-red-700 p-4">
            <h4 className="font-semibold text-red-400 mb-3">Azure Cache for Redis</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Conversation memory per user</li>
              <li>• Sliding window (last 15 msgs)</li>
              <li>• TTL auto-expiry (24h)</li>
              <li>• SSL/TLS encryption</li>
              <li>• Fallback to in-memory</li>
            </ul>
          </div>
          <div className="rounded-xl bg-purple-950/30 border border-purple-700 p-4">
            <h4 className="font-semibold text-purple-400 mb-3">GitHub Actions CI/CD</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Auto build on push to main</li>
              <li>• Docker image → ACR</li>
              <li>• Auto deploy to Container Apps</li>
              <li>• Health check verification</li>
              <li>• PR validation</li>
            </ul>
          </div>
          <div className="rounded-xl bg-emerald-950/30 border border-emerald-700 p-4">
            <h4 className="font-semibold text-emerald-400 mb-3">Health & Monitoring</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• HTTP health server (port 3000)</li>
              <li>• /health — liveness check</li>
              <li>• /ready — WhatsApp connected?</li>
              <li>• /metrics — performance data</li>
              <li>• /status — human-readable</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Graceful Degradation */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Graceful Degradation</h3>
        <div className="space-y-3">
          <DegradeRow primary="Redis" fallback="In-memory (node-cache)" note="Conversation memory persists vs. lost on restart" />
          <DegradeRow primary="Azure Document Intelligence" fallback="GPT-4 Vision" note="Structured extraction vs. general image understanding" />
          <DegradeRow primary="Deepgram STT" fallback="Error message to user" note="Ask user to type instead" />
          <DegradeRow primary="Azure OpenAI" fallback="Retry with backoff" note="Handles rate limits and transient errors" />
        </div>
      </div>
    </div>
  )
}

function ArchNode({ color, label, sub }: { color: string; label: string; sub: string }) {
  const colors: Record<string, string> = {
    green: 'border-green-600 bg-green-950/40',
    yellow: 'border-yellow-600 bg-yellow-950/40',
    purple: 'border-purple-600 bg-purple-950/40',
    blue: 'border-blue-600 bg-blue-950/40',
    orange: 'border-orange-600 bg-orange-950/40',
    cyan: 'border-cyan-600 bg-cyan-950/40',
    pink: 'border-pink-600 bg-pink-950/40',
    indigo: 'border-indigo-600 bg-indigo-950/40',
    emerald: 'border-emerald-600 bg-emerald-950/40',
  }
  return (
    <div className={`rounded-lg border px-3 py-2 text-center min-w-[90px] ${colors[color]}`}>
      <div className="text-xs font-bold text-white">{label}</div>
      <div className="text-[10px] text-gray-400">{sub}</div>
    </div>
  )
}

function ArchArrow() {
  return <div className="text-gray-600 text-sm">→</div>
}

function DegradeRow({ primary, fallback, note }: { primary: string; fallback: string; note: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{primary}</div>
        <div className="text-[10px] text-gray-500">{note}</div>
      </div>
      <div className="text-gray-600">→</div>
      <div className="flex-1 text-right">
        <div className="text-sm text-amber-400">{fallback}</div>
      </div>
    </div>
  )
}

function Commands() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Admin Commands & Testing</h2>

      {/* Admin Commands */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">⌨️ Admin Commands</h3>
        <p className="text-sm text-gray-400 mb-4">
          Send these from your admin phone number (set in <code className="text-emerald-300">ADMIN_PHONE_NUMBER</code>).
          Non-admin users' commands are silently ignored.
        </p>
        <div className="space-y-3">
          {[
            { cmd: '/status', desc: 'Show bot uptime, active users, memory usage, Node version' },
            { cmd: '/metrics', desc: 'Show message counts, response times (avg/p95/p99), errors' },
            { cmd: '/users', desc: 'List all active users with conversation history' },
            { cmd: '/clear <phone>', desc: 'Clear conversation history for a specific user' },
            { cmd: '/clearall', desc: 'Clear ALL conversation histories (use with caution)' },
            { cmd: '/ratelimit', desc: 'Show rate limit stats — who is being throttled' },
            { cmd: '/ping', desc: 'Quick liveness check — returns "Pong!"' },
            { cmd: '/help', desc: 'List all available admin commands' },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-800/50 border border-gray-700 p-3">
              <code className="text-sm text-emerald-300 font-mono font-bold shrink-0">{c.cmd}</code>
              <span className="text-xs text-gray-400">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🧪 Test Scenarios</h3>
        <div className="space-y-4">
          <TestGroup
            title="Text Messages"
            tests={[
              '"I have a headache since morning" → Health advice',
              '"hey whats up" → Polite redirect to health topics',
              '"mera sir dard kar raha hai" → Hinglish response',
              '"मुझे बुखार है" → Hindi response',
              'Multiple messages → Context maintained',
            ]}
          />
          <TestGroup
            title="Voice Notes"
            tests={[
              'English voice note → Transcribe + respond',
              'Hindi voice note → Detect language + respond in Hindi',
              'Unclear audio → Ask to retry or type',
            ]}
          />
          <TestGroup
            title="Documents & Images"
            tests={[
              'Blood test report photo → Extract values, explain',
              'Prescription PDF → Read medications',
              'Skin rash photo → Describe without diagnosing',
              'Non-health image → Polite redirect',
            ]}
          />
          <TestGroup
            title="Edge Cases"
            tests={[
              'Rapid messages → Rate limited after 20/min',
              'Sticker/location → Unsupported type message',
              '24h gap → Fresh conversation (TTL expiry)',
              'Very long message → Still 3-5 line response',
            ]}
          />
        </div>
      </div>

      {/* Health Endpoints */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🏥 Health Endpoints</h3>
        <div className="space-y-3">
          <EndpointRow method="GET" path="/health" desc="Liveness — always 200 if process running" />
          <EndpointRow method="GET" path="/ready" desc="Readiness — 200 only if WhatsApp connected" />
          <EndpointRow method="GET" path="/metrics" desc="JSON metrics — messages, timing, errors" />
          <EndpointRow method="GET" path="/status" desc="Human-readable status with all details" />
        </div>
      </div>
    </div>
  )
}

function TestGroup({ title, tests }: { title: string; tests: string[] }) {
  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-4">
      <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
      <div className="space-y-1">
        {tests.map((t, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
            <input type="checkbox" className="mt-0.5 rounded border-gray-600 bg-gray-700 text-emerald-500" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-400 font-mono font-bold">{method}</span>
      <code className="text-sm text-gray-200 font-mono">{path}</code>
      <span className="text-xs text-gray-500 ml-auto">{desc}</span>
    </div>
  )
}

function Monitoring() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Monitoring & Operations</h2>

      {/* Metrics Explained */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Collected Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricGroup
            title="Message Counters"
            metrics={['totalMessages', 'textMessages', 'voiceMessages', 'documentMessages', 'imageMessages']}
          />
          <MetricGroup
            title="Performance"
            metrics={['avgResponseTime (ms)', 'p95ResponseTime (ms)', 'p99ResponseTime (ms)', 'messagesPerHour']}
          />
          <MetricGroup
            title="Health"
            metrics={['errors', 'rateLimits', 'adminCommands', 'uptime']}
          />
          <MetricGroup
            title="System"
            metrics={['memoryUsage (heap)', 'nodeVersion', 'environment', 'whatsappStatus']}
          />
        </div>
      </div>

      {/* Logging */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 Logging</h3>
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Development (console)</div>
            <code className="text-sm text-emerald-300">npm run dev</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Production (PM2)</div>
            <code className="text-sm text-emerald-300">npm run pm2:logs</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Docker</div>
            <code className="text-sm text-emerald-300">docker-compose logs -f shy-bot</code>
          </div>
          <div className="rounded-lg bg-gray-800 p-3">
            <div className="text-xs text-gray-400 mb-1">Azure Container Apps</div>
            <code className="text-sm text-emerald-300">az containerapp logs show --name shy-bot --resource-group prakrit-ai-rg --follow</code>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-gray-800/50 p-3">
          <div className="text-xs text-gray-400 mb-2">Log Levels (set via LOG_LEVEL env var):</div>
          <div className="flex flex-wrap gap-2">
            {['error', 'warn', 'info', 'debug', 'trace'].map((level) => (
              <span key={level} className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300 font-mono">{level}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Tracking */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">💰 Cost Estimation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Service</th>
                <th className="text-left py-2 text-gray-400">Low Usage</th>
                <th className="text-left py-2 text-gray-400">Medium</th>
                <th className="text-left py-2 text-gray-400">High</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2">Azure Container Apps</td>
                <td className="py-2">$20</td>
                <td className="py-2">$30</td>
                <td className="py-2">$40</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Redis (Basic)</td>
                <td className="py-2">$15</td>
                <td className="py-2">$15</td>
                <td className="py-2">$15</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Azure OpenAI (per 1K msgs)</td>
                <td className="py-2">$5</td>
                <td className="py-2">$150</td>
                <td className="py-2">$1500</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Deepgram (per 1K msgs)</td>
                <td className="py-2">$1</td>
                <td className="py-2">$30</td>
                <td className="py-2">$300</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2 text-white">Total/month</td>
                <td className="py-2 text-emerald-400">~$70</td>
                <td className="py-2 text-emerald-400">~$245</td>
                <td className="py-2 text-emerald-400">~$1900</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔧 Common Issues</h3>
        <div className="space-y-3">
          <IssueRow
            issue="WhatsApp session expired"
            fix="Restart bot (pm2 restart shy-bot), re-scan QR code from logs"
          />
          <IssueRow
            issue="Deepgram transcription fails"
            fix="Check API key, verify audio format (OGG/OPUS), check quota"
          />
          <IssueRow
            issue="Azure OpenAI rate limited"
            fix="Bot auto-retries. If persistent, upgrade TPM tier in Azure Portal"
          />
          <IssueRow
            issue="High memory usage"
            fix="Reduce MAX_CONVERSATION_HISTORY, reduce CONVERSATION_TTL_HOURS"
          />
          <IssueRow
            issue="Redis connection lost"
            fix="Bot falls back to in-memory automatically. Check Redis health."
          />
          <IssueRow
            issue="Container won't start"
            fix="Check secrets are set, check logs: az containerapp logs show"
          />
        </div>
      </div>
    </div>
  )
}

function MetricGroup({ title, metrics }: { title: string; metrics: string[] }) {
  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-4">
      <h4 className="text-sm font-semibold text-emerald-400 mb-2">{title}</h4>
      <div className="space-y-1">
        {metrics.map((m, i) => (
          <div key={i} className="text-xs text-gray-300 font-mono">{m}</div>
        ))}
      </div>
    </div>
  )
}

function IssueRow({ issue, fix }: { issue: string; fix: string }) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <div className="text-sm font-semibold text-amber-400">{issue}</div>
      <div className="text-xs text-gray-400 mt-1">→ {fix}</div>
    </div>
  )
}

export default App
