import { useState } from 'react'

type Tab = 'deploy' | 'architecture' | 'commands' | 'monitoring' | 'files'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('deploy')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'deploy', label: 'Deploy Now', icon: '🚀' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'commands', label: 'Commands', icon: '⌨️' },
    { id: 'monitoring', label: 'Monitoring', icon: '📈' },
    { id: 'files', label: 'File Reference', icon: '📁' },
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
              <p className="text-xs text-gray-400">Deployment Guide — Code is on GitHub ✓</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-emerald-900/50 text-emerald-400 text-xs font-medium border border-emerald-700">
              ✓ Pushed to GitHub
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'deploy' && <DeployNow />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'commands' && <Commands />}
        {activeTab === 'monitoring' && <Monitoring />}
        {activeTab === 'files' && <FileReference />}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        Prakrit AI — Shy Bot • Next: Azure Setup → GitHub Secrets → Deploy
      </footer>
    </div>
  )
}

/* =========================================================
   DEPLOY NOW — The main action page
   ========================================================= */
function DeployNow() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (step: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step)
      else next.add(step)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-700 p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-white">🚀 Deploy Shy to Azure</h2>
            <p className="text-sm text-emerald-300">5 steps to production. Takes ~15 minutes.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{completedSteps.size}/5</div>
            <div className="text-xs text-gray-400">steps complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.size / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 0: Prerequisites Check */}
      <StepCard
        number={0}
        title="Prerequisites Check"
        description="Make sure you have these installed and ready"
        completed={completedSteps.has(0)}
        onToggle={() => toggleStep(0)}
        isPrereq
      >
        <div className="space-y-2">
          <CheckItem label="Azure CLI installed" command="az --version" />
          <CheckItem label="Logged into Azure" command="az login" />
          <CheckItem label="Docker installed" command="docker --version" />
          <CheckItem label="Node.js 18+ installed" command="node --version" />
          <CheckItem label="Deepgram API key ready" note="Get from console.deepgram.com" />
          <CheckItem label="Azure OpenAI deployment ready" note="GPT-4o model deployed in Azure Portal" />
        </div>
      </StepCard>

      {/* Step 1: Create Azure Infrastructure */}
      <StepCard
        number={1}
        title="Create Azure Infrastructure"
        description="Run the setup script to create all Azure resources in one go"
        completed={completedSteps.has(1)}
        onToggle={() => toggleStep(1)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            This creates: Resource Group, Container Registry, Container Apps Environment,
            Container App, Redis Cache, and Log Analytics Workspace.
          </p>
          <CodeBlock
            label="Make script executable and run it"
            commands={[
              'cd bot',
              'chmod +x scripts/azure-setup.sh',
              './scripts/azure-setup.sh',
            ]}
          />
          <WarningBox>
            The script uses default names (prakrit-ai-rg, prakritai, etc.).
            Edit the variables at the top of <code>scripts/azure-setup.sh</code> if you want different names.
          </WarningBox>
          <InfoBox>
            <strong>What gets created:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• <strong>Resource Group:</strong> prakrit-ai-rg</li>
              <li>• <strong>Container Registry:</strong> prakritai.azurecr.io</li>
              <li>• <strong>Container Apps Env:</strong> prakrit-ai-env</li>
              <li>• <strong>Container App:</strong> shy-bot</li>
              <li>• <strong>Redis:</strong> prakrit-redis (Basic C0)</li>
              <li>• <strong>Log Analytics:</strong> prakrit-ai-logs</li>
            </ul>
          </InfoBox>
        </div>
      </StepCard>

      {/* Step 2: Set Azure Container App Secrets */}
      <StepCard
        number={2}
        title="Set API Secrets in Azure"
        description="Add your Deepgram and Azure OpenAI keys to the Container App"
        completed={completedSteps.has(2)}
        onToggle={() => toggleStep(2)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            These are your actual API keys. They're stored securely in Azure Container App secrets
            and injected as environment variables at runtime.
          </p>
          <CodeBlock
            label="Set secrets (replace with your actual values)"
            commands={[
              'az containerapp secret set \\',
              '  --name shy-bot \\',
              '  --resource-group prakrit-ai-rg \\',
              '  --secrets \\',
              '    deepgram-api-key=YOUR_DEEPGRAM_KEY \\',
              '    azure-openai-endpoint=https://YOUR_RESOURCE.openai.azure.com \\',
              '    azure-openai-api-key=YOUR_AZURE_OPENAI_KEY \\',
              '    azure-openai-deployment=gpt-4o',
            ]}
          />
          <CodeBlock
            label="Link secrets to environment variables"
            commands={[
              'az containerapp update \\',
              '  --name shy-bot \\',
              '  --resource-group prakrit-ai-rg \\',
              '  --set-env-vars \\',
              '    "DEEPGRAM_API_KEY=secretref:deepgram-api-key" \\',
              '    "AZURE_OPENAI_ENDPOINT=secretref:azure-openai-endpoint" \\',
              '    "AZURE_OPENAI_API_KEY=secretref:azure-openai-api-key" \\',
              '    "AZURE_OPENAI_DEPLOYMENT=secretref:azure-openai-deployment" \\',
              '    "BOT_NAME=Shy" \\',
              '    "NODE_ENV=production" \\',
              '    "LOG_LEVEL=info" \\',
              '    "ADMIN_PHONE_NUMBER=91XXXXXXXXXX"',
            ]}
          />
          <WarningBox>
            Replace <code>91XXXXXXXXXX</code> with YOUR phone number (with country code, no +).
            This is the number that can use admin commands like /status, /clear, etc.
          </WarningBox>
        </div>
      </StepCard>

      {/* Step 3: Configure GitHub Secrets */}
      <StepCard
        number={3}
        title="Configure GitHub Secrets"
        description="Enable CI/CD by adding secrets to your GitHub repository"
        completed={completedSteps.has(3)}
        onToggle={() => toggleStep(3)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            Go to your GitHub repo → <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong> → <strong>New repository secret</strong>
          </p>

          <div className="space-y-3">
            <SecretBlock
              name="AZURE_CREDENTIALS"
              description="Service principal for GitHub Actions to deploy to Azure"
              getCommand={[
                '# Create service principal (replace {subscription-id})',
                'az ad sp create-for-rbac \\',
                '  --name "github-actions-shy-bot" \\',
                '  --role contributor \\',
                '  --scopes /subscriptions/{subscription-id}/resourceGroups/prakrit-ai-rg \\',
                '  --sdk-auth',
                '',
                '# Copy the ENTIRE JSON output as the secret value',
              ]}
            />
            <SecretBlock
              name="AZURE_ACR_USERNAME"
              description="Container Registry login username"
              getCommand={[
                'az acr credential show \\',
                '  --name prakritai \\',
                '  --query "username" -o tsv',
              ]}
            />
            <SecretBlock
              name="AZURE_ACR_PASSWORD"
              description="Container Registry login password"
              getCommand={[
                'az acr credential show \\',
                '  --name prakritai \\',
                '  --query "passwords[0].value" -o tsv',
              ]}
            />
          </div>

          <InfoBox>
            <strong>Tip:</strong> Your subscription ID can be found with: <code className="text-xs">az account show --query "id" -o tsv</code>
          </InfoBox>
        </div>
      </StepCard>

      {/* Step 4: Trigger Deployment */}
      <StepCard
        number={4}
        title="Trigger First Deployment"
        description="Push to main branch to trigger the CI/CD pipeline"
        completed={completedSteps.has(4)}
        onToggle={() => toggleStep(4)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            The GitHub Actions workflow will automatically:
          </p>
          <div className="flex flex-wrap items-center gap-2 py-2">
            <PipelineBadge label="Push to main" color="gray" />
            <span className="text-gray-600">→</span>
            <PipelineBadge label="Build & Test" color="blue" />
            <span className="text-gray-600">→</span>
            <PipelineBadge label="Docker Build" color="purple" />
            <span className="text-gray-600">→</span>
            <PipelineBadge label="Push to ACR" color="orange" />
            <span className="text-gray-600">→</span>
            <PipelineBadge label="Deploy" color="emerald" />
            <span className="text-gray-600">→</span>
            <PipelineBadge label="Health Check" color="green" />
          </div>
          <CodeBlock
            label="Make a small change and push to trigger the pipeline"
            commands={[
              '# If you already pushed, make a trivial change:',
              'echo "# Deploy trigger" >> bot/README.md',
              'git add .',
              'git commit -m "trigger deployment"',
              'git push origin main',
            ]}
          />
          <InfoBox>
            <strong>Monitor the deployment:</strong> Go to your GitHub repo → <strong>Actions</strong> tab.
            You'll see the workflow running. It takes about 3-5 minutes.
          </InfoBox>
        </div>
      </StepCard>

      {/* Step 5: WhatsApp Authentication */}
      <StepCard
        number={5}
        title="Authenticate WhatsApp (QR Code)"
        description="Scan the QR code to connect Shy to your WhatsApp"
        completed={completedSteps.has(5)}
        onToggle={() => toggleStep(5)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            OpenWA needs to authenticate with WhatsApp by scanning a QR code.
            This only needs to happen once — the session persists in the container.
          </p>
          <CodeBlock
            label="View container logs to find the QR code"
            commands={[
              '# Stream logs from Azure Container App',
              'az containerapp logs show \\',
              '  --name shy-bot \\',
              '  --resource-group prakrit-ai-rg \\',
              '  --follow',
            ]}
          />
          <div className="rounded-xl bg-gray-800 border border-gray-700 p-4">
            <div className="text-sm font-semibold text-white mb-2">📱 Then on your phone:</div>
            <ol className="space-y-1 text-xs text-gray-300 list-decimal list-inside">
              <li>Open WhatsApp</li>
              <li>Go to Settings → Linked Devices</li>
              <li>Tap "Link a Device"</li>
              <li>Scan the QR code shown in the terminal/logs</li>
            </ol>
          </div>
          <WarningBox>
            <strong>Important:</strong> The QR code expires quickly (~20 seconds). If it expires,
            the bot will generate a new one. Keep the logs open and scan immediately.
          </WarningBox>
          <InfoBox>
            <strong>Verify it worked:</strong> Send "Hey" to the WhatsApp number connected to Shy.
            You should get a health-focused greeting back within 2-5 seconds.
          </InfoBox>
        </div>
      </StepCard>

      {/* Post-Deploy Verification */}
      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">✅ Post-Deploy Verification</h3>
        <div className="space-y-3">
          <CodeBlock
            label="Get your bot's URL"
            commands={[
              'az containerapp show \\',
              '  --name shy-bot \\',
              '  --resource-group prakrit-ai-rg \\',
              '  --query "properties.configuration.ingress.fqdn" -o tsv',
            ]}
          />
          <CodeBlock
            label="Health check"
            commands={[
              'curl https://<your-fqdn>/health',
              'curl https://<your-fqdn>/ready',
              'curl https://<your-fqdn>/status',
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <VerifyCard
              title="Health Check"
              command="GET /health"
              expected='{"status":"ok"}'
            />
            <VerifyCard
              title="Readiness"
              command="GET /ready"
              expected='{"whatsapp":"connected"}'
            />
            <VerifyCard
              title="Status"
              command="GET /status"
              expected="Full bot status JSON"
            />
          </div>
        </div>
      </div>

      {/* Troubleshooting Quick Links */}
      <div className="rounded-2xl bg-amber-950/20 border border-amber-800 p-6">
        <h3 className="text-lg font-bold text-amber-400 mb-4">⚠️ Common Issues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <IssueCard
            issue="QR code not showing in logs"
            fix="Container might still be starting. Wait 60s and refresh logs. Check: az containerapp logs show --name shy-bot --resource-group prakrit-ai-rg --follow"
          />
          <IssueCard
            issue="CI/CD pipeline fails at deploy step"
            fix="Check AZURE_CREDENTIALS secret is valid JSON. Verify service principal has 'contributor' role on the resource group."
          />
          <IssueCard
            issue="Bot responds with errors"
            fix="Check secrets are set correctly: az containerapp secret list --name shy-bot --resource-group prakrit-ai-rg"
          />
          <IssueCard
            issue="WhatsApp disconnects after some time"
            fix="Normal — PM2/Docker auto-restarts the bot. Re-scan QR if session fully expired. Container Apps keeps it alive."
          />
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SHARED COMPONENTS
   ========================================================= */

function StepCard({ number, title, description, completed, onToggle, isPrereq, children }: {
  number: number; title: string; description: string; completed: boolean;
  onToggle: () => void; isPrereq?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      completed ? 'bg-emerald-950/20 border-emerald-700' : 'bg-gray-900 border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
            completed ? 'bg-emerald-600 text-white' : isPrereq ? 'bg-gray-700 text-gray-300' : 'bg-emerald-900 text-emerald-400 border border-emerald-700'
          }`}>
            {completed ? '✓' : number}
          </div>
          <div>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`text-xs px-3 py-1 rounded-full transition-all ${
            completed
              ? 'bg-emerald-800 text-emerald-300 hover:bg-emerald-700'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {completed ? '✓ Done' : 'Mark Done'}
        </button>
      </div>
      <div className={completed ? 'opacity-60' : ''}>
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ label, commands }: { label: string; commands: string[] }) {
  const [copied, setCopied] = useState(false)
  const fullCommand = commands.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-750 border-b border-gray-700">
        <span className="text-xs text-gray-400">{label}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className="p-3 text-sm text-emerald-300 font-mono overflow-x-auto">
        {commands.map((cmd, i) => (
          <div key={i} className={cmd === '' ? 'h-2' : ''}>{cmd}</div>
        ))}
      </pre>
    </div>
  )
}

function CheckItem({ label, command, note }: { label: string; command?: string; note?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-800/50 p-2">
      <div className="w-4 h-4 rounded border border-gray-600 mt-0.5 shrink-0"></div>
      <div className="flex-1">
        <div className="text-sm text-gray-200">{label}</div>
        {command && <code className="text-xs text-gray-500 font-mono">{command}</code>}
        {note && <div className="text-xs text-gray-500 mt-0.5">{note}</div>}
      </div>
    </div>
  )
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-amber-950/30 border border-amber-700 p-3 text-xs text-amber-300">
      ⚠️ {children}
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-blue-950/30 border border-blue-700 p-3 text-xs text-blue-300">
      💡 {children}
    </div>
  )
}

function SecretBlock({ name, description, getCommand }: { name: string; description: string; getCommand: string[] }) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <code className="text-sm text-emerald-300 font-mono font-bold">{name}</code>
          <div className="text-xs text-gray-400 mt-0.5">{description}</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-700 shrink-0">Secret</span>
      </div>
      <div className="mt-2">
        <div className="text-[10px] text-gray-500 mb-1">Get value with:</div>
        <pre className="text-xs text-gray-400 font-mono bg-gray-900 rounded p-2 overflow-x-auto">
          {getCommand.join('\n')}
        </pre>
      </div>
    </div>
  )
}

function PipelineBadge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-700 border-gray-600 text-gray-200',
    blue: 'bg-blue-900/50 border-blue-700 text-blue-300',
    purple: 'bg-purple-900/50 border-purple-700 text-purple-300',
    orange: 'bg-orange-900/50 border-orange-700 text-orange-300',
    emerald: 'bg-emerald-900/50 border-emerald-700 text-emerald-300',
    green: 'bg-green-900/50 border-green-700 text-green-300',
  }
  return (
    <span className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}

function VerifyCard({ title, command, expected }: { title: string; command: string; expected: string }) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <div className="text-xs font-semibold text-white mb-1">{title}</div>
      <code className="text-[10px] text-emerald-300 font-mono">{command}</code>
      <div className="text-[10px] text-gray-500 mt-1">Expected: {expected}</div>
    </div>
  )
}

function IssueCard({ issue, fix }: { issue: string; fix: string }) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <div className="text-sm font-semibold text-amber-400">{issue}</div>
      <div className="text-xs text-gray-400 mt-1">→ {fix}</div>
    </div>
  )
}

/* =========================================================
   ARCHITECTURE TAB
   ========================================================= */
function Architecture() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Architecture</h2>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Message Processing Pipeline</h3>
        <div className="min-w-[750px]">
          <div className="flex items-center gap-2 mb-6">
            <ArchNode color="green" label="WhatsApp" sub="User sends" />
            <ArchArrow />
            <ArchNode color="green" label="OpenWA" sub="Receives" />
            <ArchArrow />
            <ArchNode color="yellow" label="Rate Limit" sub="20/min" />
            <ArchArrow />
            <ArchNode color="purple" label="Router" sub="Classify type" />
            <ArchArrow />
            <ArchNode color="indigo" label="GPT-4o" sub="Generate reply" />
            <ArchArrow />
            <ArchNode color="emerald" label="Reply" sub="Send back" />
          </div>
          <div className="grid grid-cols-4 gap-3 ml-[190px]">
            <ArchNode color="blue" label="Text" sub="Direct to LLM" />
            <ArchNode color="orange" label="Voice" sub="Deepgram STT" />
            <ArchNode color="cyan" label="Document" sub="Azure DI" />
            <ArchNode color="pink" label="Image" sub="GPT-4 Vision" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Azure Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfraCard
            icon="🚀"
            title="Container Apps"
            items={['Auto-scaling 1-3 replicas', 'Managed HTTPS', 'Health probes', 'Zero-downtime deploys']}
          />
          <InfraCard
            icon="🔴"
            title="Redis Cache"
            items={['Conversation memory', 'Per-user sliding window', 'TTL auto-expiry (24h)', 'SSL/TLS encrypted']}
          />
          <InfraCard
            icon="🐳"
            title="Container Registry"
            items={['Stores Docker images', 'CI/CD pushes here', 'GitHub Actions pulls', 'Private access']}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Graceful Degradation</h3>
        <div className="space-y-2">
          {[
            ['Redis unavailable', 'Falls back to in-memory (node-cache)'],
            ['Azure Doc Intelligence unavailable', 'Falls back to GPT-4 Vision'],
            ['Deepgram fails', 'Returns error message, asks user to type'],
            ['Azure OpenAI rate limited', 'Auto-retry with exponential backoff'],
          ].map(([primary, fallback], i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-3">
              <div className="flex-1 text-sm text-white">{primary}</div>
              <div className="text-gray-600">→</div>
              <div className="flex-1 text-sm text-amber-400 text-right">{fallback}</div>
            </div>
          ))}
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

function InfraCard({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-400">• {item}</li>
        ))}
      </ul>
    </div>
  )
}

/* =========================================================
   COMMANDS TAB
   ========================================================= */
function Commands() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Admin Commands & Testing</h2>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">⌨️ Admin Commands</h3>
        <p className="text-xs text-gray-400 mb-4">
          Send these from your admin phone number (set in ADMIN_PHONE_NUMBER). Non-admin commands are silently ignored.
        </p>
        <div className="space-y-2">
          {[
            ['/status', 'Bot uptime, active users, memory usage'],
            ['/metrics', 'Message counts, response times (avg/p95/p99), errors'],
            ['/users', 'List all active users with conversation history'],
            ['/clear <phone>', 'Clear conversation for a specific user'],
            ['/clearall', 'Clear ALL conversations (use carefully)'],
            ['/ratelimit', 'Show who is being rate-limited'],
            ['/ping', 'Quick liveness check'],
            ['/help', 'List all admin commands'],
          ].map(([cmd, desc], i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-800/50 border border-gray-700 p-3">
              <code className="text-sm text-emerald-300 font-mono font-bold shrink-0 min-w-[120px]">{cmd}</code>
              <span className="text-xs text-gray-400">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🧪 Test Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Text', tests: ['"I have a headache"', '"hey whats up" (redirect)', 'Hinglish message', 'Hindi message (Devanagari)'] },
            { title: 'Voice', tests: ['English voice note', 'Hindi voice note', 'Unclear audio (retry prompt)'] },
            { title: 'Documents', tests: ['Lab report photo', 'Prescription PDF', 'Blurry document (retry)'] },
            { title: 'Edge Cases', tests: ['Rapid messages (rate limit)', 'Sticker (unsupported)', '24h gap (fresh context)'] },
          ].map((group, i) => (
            <div key={i} className="rounded-xl bg-gray-800/30 border border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-white mb-2">{group.title}</h4>
              {group.tests.map((t, j) => (
                <label key={j} className="flex items-start gap-2 text-xs text-gray-300 cursor-pointer py-0.5">
                  <input type="checkbox" className="mt-0.5 rounded border-gray-600 bg-gray-700 text-emerald-500" />
                  {t}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🏥 Health Endpoints</h3>
        <div className="space-y-2">
          {[
            ['GET', '/health', 'Liveness — 200 if process running'],
            ['GET', '/ready', 'Readiness — 200 if WhatsApp connected'],
            ['GET', '/metrics', 'JSON metrics — messages, timing, errors'],
            ['GET', '/status', 'Human-readable full status'],
          ].map(([method, path, desc], i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-800/50 border border-gray-700 p-3">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-400 font-mono font-bold">{method}</span>
              <code className="text-sm text-gray-200 font-mono">{path}</code>
              <span className="text-xs text-gray-500 ml-auto">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MONITORING TAB
   ========================================================= */
function Monitoring() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Monitoring & Operations</h2>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Metrics Collected</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Messages', icon: '💬' },
            { label: 'Avg Response Time', icon: '⚡' },
            { label: 'P95 Response Time', icon: '📈' },
            { label: 'Active Users', icon: '👥' },
            { label: 'Errors', icon: '❌' },
            { label: 'Rate Limits', icon: '🚫' },
            { label: 'Memory Usage', icon: '💾' },
            { label: 'Uptime', icon: '⏱️' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-center">
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-xs text-gray-300">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📝 Viewing Logs</h3>
        <div className="space-y-3">
          <CodeBlock label="Azure Container Apps (production)" commands={[
            'az containerapp logs show \\',
            '  --name shy-bot \\',
            '  --resource-group prakrit-ai-rg \\',
            '  --follow',
          ]} />
          <CodeBlock label="Docker (local)" commands={['docker-compose logs -f shy-bot']} />
          <CodeBlock label="PM2 (VPS)" commands={['npm run pm2:logs']} />
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">💰 Monthly Cost Estimate</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Service</th>
                <th className="text-right py-2 text-gray-400">Low</th>
                <th className="text-right py-2 text-gray-400">Medium</th>
                <th className="text-right py-2 text-gray-400">High</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ['Azure Container Apps', '$20', '$30', '$40'],
                ['Redis (Basic C0)', '$15', '$15', '$15'],
                ['ACR + Log Analytics', '$10', '$10', '$10'],
                ['Azure OpenAI (per 1K msgs)', '$5', '$150', '$1500'],
                ['Deepgram (per 1K msgs)', '$1', '$30', '$300'],
              ].map(([service, low, med, high], i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-2">{service}</td>
                  <td className="py-2 text-right">{low}</td>
                  <td className="py-2 text-right">{med}</td>
                  <td className="py-2 text-right">{high}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2 text-white">Total/month</td>
                <td className="py-2 text-right text-emerald-400">~$70</td>
                <td className="py-2 text-right text-emerald-400">~$245</td>
                <td className="py-2 text-right text-emerald-400">~$1900</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">Low = 100 msgs/day, Medium = 1000 msgs/day, High = 10000 msgs/day</p>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔧 Common Issues & Fixes</h3>
        <div className="space-y-2">
          {[
            ['WhatsApp session expired', 'Restart container, re-scan QR from logs'],
            ['Deepgram transcription fails', 'Check API key, verify audio format, check quota'],
            ['Azure OpenAI rate limited', 'Bot auto-retries. If persistent, upgrade TPM tier'],
            ['High memory usage', 'Reduce MAX_CONVERSATION_HISTORY or CONVERSATION_TTL_HOURS'],
            ['Redis connection lost', 'Bot auto-falls back to in-memory cache'],
            ['Container won\'t start', 'Check secrets: az containerapp secret list'],
          ].map(([issue, fix], i) => (
            <div key={i} className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
              <div className="text-sm font-semibold text-amber-400">{issue}</div>
              <div className="text-xs text-gray-400 mt-1">→ {fix}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FILE REFERENCE TAB
   ========================================================= */
function FileReference() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">File Reference</h2>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Complete Project Structure</h3>
        <pre className="text-sm bg-gray-800 rounded-xl p-4 overflow-x-auto font-mono text-gray-300 leading-relaxed">
{`prakrit-ai-shy/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions: build → push → deploy
│
├── bot/                            # ← The WhatsApp bot
│   ├── src/
│   │   ├── bot.js                 # Entry point — OpenWA setup, event handlers
│   │   ├── router.js              # Message type classifier (text/voice/doc/image)
│   │   ├── server.js              # HTTP health check server (:3000)
│   │   │
│   │   ├── config/
│   │   │   └── index.js           # Env loader + validation
│   │   │
│   │   ├── processors/
│   │   │   ├── text.js            # Text → language detect → GPT-4o
│   │   │   ├── voice.js           # Voice → Deepgram STT → text processor
│   │   │   ├── document.js        # Doc → Azure DI / Vision → GPT-4o
│   │   │   └── image.js           # Image → GPT-4 Vision → GPT-4o
│   │   │
│   │   ├── services/
│   │   │   ├── azure-openai.js    # Azure OpenAI client (chat + vision)
│   │   │   ├── deepgram.js        # Deepgram STT (Nova-2, multilingual)
│   │   │   ├── azure-docs.js      # Azure Document Intelligence
│   │   │   ├── memory.js          # Conversation memory (Redis / in-memory)
│   │   │   └── metrics.js         # Performance metrics collector
│   │   │
│   │   ├── middleware/
│   │   │   ├── rateLimit.js       # Rate limiter (20 msgs/min per user)
│   │   │   └── admin.js           # Admin commands (/status, /clear, etc.)
│   │   │
│   │   ├── prompts/
│   │   │   └── system.js          # Shy's system prompt (parameterized)
│   │   │
│   │   └── utils/
│   │       ├── formatter.js       # Strip markdown, limit to 3-5 lines
│   │       ├── language.js        # Language detection (franc + heuristics)
│   │       └── logger.js          # Pino structured logging
│   │
│   ├── scripts/
│   │   └── azure-setup.sh         # One-click Azure infrastructure setup
│   │
│   ├── docs/
│   │   ├── AZURE_DEPLOYMENT.md    # Complete Azure deployment guide
│   │   └── GITHUB_SECRETS.md      # GitHub secrets configuration
│   │
│   ├── Dockerfile                  # Multi-stage production Docker build
│   ├── docker-compose.yml          # Local dev (bot + Redis)
│   ├── .dockerignore
│   ├── .env.example                # Environment template
│   ├── .gitignore
│   ├── pm2.config.js               # PM2 process manager config
│   ├── package.json
│   └── README.md
│
├── src/                            # React dashboard (this page)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── README.md                       # Root README
├── package.json                    # Dashboard dependencies
└── vite.config.js`}
        </pre>
      </div>

      <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Files Explained</h3>
        <div className="space-y-3">
          {[
            { file: 'bot.js', desc: 'The heart of the bot. Initializes OpenWA, registers message handler, starts health server, manages lifecycle. Every incoming message flows through here.' },
            { file: 'router.js', desc: 'Looks at message.type to decide: is this text, voice, document, or image? Then calls the right processor. Also handles unsupported types.' },
            { file: 'processors/text.js', desc: 'The most-used processor. Detects language, builds system prompt with language rule, fetches conversation history, calls GPT-4o, formats response.' },
            { file: 'services/azure-openai.js', desc: 'Wrapper around @azure/openai SDK. Two functions: chatCompletion (text) and visionCompletion (image + text). Handles errors and retries.' },
            { file: 'services/memory.js', desc: 'Per-user conversation history. Uses Redis if available, falls back to node-cache. Sliding window of last 15 messages. Auto-expires after 24 hours.' },
            { file: 'middleware/rateLimit.js', desc: 'Prevents abuse. Limits each user to 20 messages per minute. Returns friendly "please wait" message when exceeded.' },
            { file: 'middleware/admin.js', desc: 'Special commands only the bot owner can use. Checks sender phone number against ADMIN_PHONE_NUMBER. Supports /status, /clear, /users, etc.' },
            { file: 'server.js', desc: 'Lightweight HTTP server on port 3000. Exposes /health (liveness), /ready (WhatsApp connected?), /metrics (JSON), /status (human-readable).' },
            { file: 'Dockerfile', desc: 'Multi-stage build. Stage 1: install deps. Stage 2: production image with Chromium, ffmpeg, regional fonts. Runs as non-root user. Includes HEALTHCHECK.' },
            { file: 'ci-cd.yml', desc: 'GitHub Actions workflow. On push to main: build Docker image → push to ACR → update Container App → verify health check. Fully automated.' },
            { file: 'azure-setup.sh', desc: 'Bash script that creates all Azure resources in one shot. Resource group, ACR, Container Apps env, Redis, Container app. Edit variables at top to customize.' },
          ].map((f, i) => (
            <div key={i} className="rounded-lg bg-gray-800/30 border border-gray-700 p-3">
              <code className="text-sm text-emerald-300 font-mono font-bold">{f.file}</code>
              <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
