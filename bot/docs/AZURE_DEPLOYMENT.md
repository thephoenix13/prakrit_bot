# Azure Deployment Guide

Complete guide to deploy Shy Bot on Azure using Container Apps.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Azure Cloud                           │
│                                                         │
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │ Container Apps   │    │ Azure Cache for Redis    │  │
│  │                  │    │                          │  │
│  │  ┌────────────┐  │    │  • Conversation memory   │  │
│  │  │ Shy Bot    │──┼────│  • Session data          │  │
│  │  │ Container  │  │    │  • Auto-expiry (TTL)     │  │
│  │  └────────────┘  │    └──────────────────────────┘  │
│  │         │        │                                   │
│  │         ▼        │    ┌──────────────────────────┐  │
│  │  ┌────────────┐  │    │ Azure Container Registry │  │
│  │  │ Health     │  │    │                          │  │
│  │  │ Endpoint   │  │    │  • Docker images         │  │
│  │  │ :3000      │  │    │  • CI/CD pushes here     │  │
│  │  └────────────┘  │    └──────────────────────────┘  │
│  └──────────────────┘                                   │
│                                                         │
│  External Services (not in Azure):                      │
│  • Deepgram API (voice transcription)                   │
│  • Azure OpenAI (GPT-4o, Vision)                        │
│  • Azure Document Intelligence (optional)               │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Azure Subscription** — [Create free account](https://azure.microsoft.com/free)
2. **Azure CLI** — [Install Azure CLI](https://aka.ms/installazurecli)
3. **Docker** — [Install Docker](https://docs.docker.com/get-docker)
4. **GitHub Account** — For CI/CD
5. **API Keys**:
   - Deepgram API key
   - Azure OpenAI deployment (GPT-4o)
   - (Optional) Azure Document Intelligence

## Step 1: Create Azure Resources

### Option A: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x scripts/azure-setup.sh

# Run setup script
./scripts/azure-setup.sh
```

This creates:
- Resource Group
- Azure Container Registry
- Log Analytics Workspace
- Container Apps Environment
- Azure Cache for Redis
- Container App (initial deployment)

### Option B: Manual Setup

```bash
# 1. Create resource group
az group create --name prakrit-ai-rg --location eastus

# 2. Create container registry
az acr create \
  --name prakritai \
  --resource-group prakrit-ai-rg \
  --sku Basic \
  --admin-enabled true

# 3. Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group prakrit-ai-rg \
  --workspace-name prakrit-ai-logs

# 4. Get Log Analytics ID
LOG_ID=$(az monitor log-analytics workspace show \
  --resource-group prakrit-ai-rg \
  --workspace-name prakrit-ai-logs \
  --query "id" -o tsv)

# 5. Create Container Apps environment
az containerapp env create \
  --name prakrit-ai-env \
  --resource-group prakrit-ai-rg \
  --location eastus \
  --logs-workspace-id "$LOG_ID"

# 6. Create Redis cache
az redis create \
  --name prakrit-redis \
  --resource-group prakrit-ai-rg \
  --location eastus \
  --sku Basic \
  --vm-size c0

# 7. Create Container App
az containerapp create \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --environment prakrit-ai-env \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3
```

## Step 2: Configure Secrets

### Azure Container App Secrets

Set your API keys as secrets in Azure:

```bash
az containerapp secret set \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --secrets \
    deepgram-api-key=YOUR_DEEPGRAM_KEY \
    azure-openai-endpoint=https://YOUR_RESOURCE.openai.azure.com \
    azure-openai-api-key=YOUR_AZURE_OPENAI_KEY \
    azure-openai-deployment=gpt-4o
```

### Environment Variables

Set non-secret environment variables:

```bash
az containerapp update \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --set-env-vars \
    "BOT_NAME=Shy" \
    "NODE_ENV=production" \
    "LOG_LEVEL=info" \
    "MAX_CONVERSATION_HISTORY=15" \
    "CONVERSATION_TTL_HOURS=24" \
    "MAX_RESPONSE_TOKENS=300" \
    "TEMPERATURE=0.7" \
    "DEEPGRAM_API_KEY=secretref:deepgram-api-key" \
    "AZURE_OPENAI_ENDPOINT=secretref:azure-openai-endpoint" \
    "AZURE_OPENAI_API_KEY=secretref:azure-openai-api-key" \
    "AZURE_OPENAI_DEPLOYMENT=secretref:azure-openai-deployment"
```

### Get Redis Connection String

```bash
# Get Redis key
REDIS_KEY=$(az redis list-keys \
  --name prakrit-redis \
  --resource-group prakrit-ai-rg \
  --query "primaryKey" -o tsv)

# Get Redis host
REDIS_HOST=$(az redis show \
  --name prakrit-redis \
  --resource-group prakrit-ai-rg \
  --query "hostName" -o tsv)

# Set Redis URL
REDIS_URL="rediss://:${REDIS_KEY}@${REDIS_HOST}:6380"

az containerapp update \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --set-env-vars "REDIS_URL=$REDIS_URL"
```

## Step 3: Configure GitHub CI/CD

### Create Service Principal

```bash
# Get your subscription ID
az account show --query "id" -o tsv

# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-shy-bot" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/prakrit-ai-rg \
  --sdk-auth
```

**Copy the JSON output** — you'll need it for GitHub secrets.

### Get ACR Credentials

```bash
# Username
az acr credential show --name prakritai --query "username" -o tsv

# Password
az acr credential show --name prakritai --query "passwords[0].value" -o tsv
```

### Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret | Value |
|--------|-------|
| `AZURE_CREDENTIALS` | JSON output from service principal creation |
| `AZURE_ACR_USERNAME` | ACR username from above |
| `AZURE_ACR_PASSWORD` | ACR password from above |

See [GitHub Secrets Guide](GITHUB_SECRETS.md) for detailed instructions.

## Step 4: Deploy

### Automatic Deployment (CI/CD)

```bash
# Push to main branch
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will:
1. Build Docker image
2. Push to Azure Container Registry
3. Update Container App with new image
4. Run health checks

### Manual Deployment

```bash
# Build Docker image locally
cd bot
docker build -t prakritai.azurecr.io/shy-bot:latest .

# Login to ACR
az acr login --name prakritai

# Push image
docker push prakritai.azurecr.io/shy-bot:latest

# Update Container App
az containerapp update \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --image prakritai.azurecr.io/shy-bot:latest
```

## Step 5: First-Time WhatsApp Authentication

**Important**: WhatsApp requires QR code scanning on first run.

### Option A: View Logs

```bash
# Stream logs to see QR code
az containerapp logs show \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --follow
```

Scan the QR code with WhatsApp → Settings → Linked Devices → Link a Device.

### Option B: Exec into Container

```bash
# Get revision name
REVISION=$(az containerapp revision list \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --query "[0].name" -o tsv)

# Exec into container
az containerapp exec \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --revision "$REVISION"
```

## Step 6: Verify Deployment

### Check Health

```bash
# Get Container App URL
FQDN=$(az containerapp show \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --query "properties.configuration.ingress.fqdn" -o tsv)

# Health check
curl "https://$FQDN/health"

# Readiness check (WhatsApp connected?)
curl "https://$FQDN/ready"

# Detailed status
curl "https://$FQDN/status"
```

### Test Bot

Send a message to your WhatsApp bot number:
- "Hello" → Should respond with health greeting
- Voice note → Should transcribe and respond
- Document → Should analyze and respond

## Step 7: Monitor

### View Logs

```bash
# Azure CLI
az containerapp logs show \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --follow

# Azure Portal
# → Container App → Log stream
```

### View Metrics

```bash
# HTTP endpoint
curl "https://$FQDN/metrics"

# Azure Portal
# → Container App → Metrics
```

### Scale Settings

```bash
# View current scale
az containerapp show \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --query "properties.template.scale"

# Update scale (if needed)
az containerapp update \
  --name shy-bot \
  --resource-group prakrit-ai-rg \
  --min-replicas 1 \
  --max-replicas 5
```

## Troubleshooting

### Container Fails to Start

```bash
# Check logs
az containerapp logs show --name shy-bot --resource-group prakrit-ai-rg

# Common issues:
# - Missing secrets → Check az containerapp secret list
# - Invalid image → Check ACR credentials
# - Out of memory → Increase --memory in containerapp create
```

### WhatsApp Session Lost

```bash
# Restart container
az containerapp revision restart \
  --name shy-bot \
  --resource-group prakrit-ai-rg

# Re-scan QR code from logs
```

### High Costs

- Reduce `MAX_CONVERSATION_HISTORY` (default: 15)
- Reduce `CONVERSATION_TTL_HOURS` (default: 24)
- Scale down Container App replicas
- Use Azure OpenAI pay-as-you-go instead of provisioned

### Performance Issues

- Check response times: `curl https://$FQDN/metrics`
- Increase Container App CPU/memory
- Check Redis latency
- Review Azure OpenAI rate limits

## Cost Optimization

### Estimated Monthly Costs

| Resource | Cost | Notes |
|----------|------|-------|
| Container Apps | $20-40 | 1 CPU, 2GB RAM, 1-3 replicas |
| Redis (Basic) | $15 | C0 tier, 256MB |
| Container Registry | $5 | Basic tier |
| Log Analytics | $5 | 5GB/day ingestion |
| **Total Infrastructure** | **$45-65** | |
| Azure OpenAI | ~$150 | 1000 msgs/day |
| Deepgram | ~$30 | 300 voice notes/day |
| **Total** | **$225-245** | |

### Cost Reduction Tips

1. **Use Redis Free Tier** — Azure Cache for Redis has free tier (limited)
2. **Scale to Zero** — Set `--min-replicas 0` if bot is not 24/7
3. **Use Smaller Instance** — 0.5 CPU, 1GB RAM for low traffic
4. **Optimize Token Usage** — Reduce `MAX_RESPONSE_TOKENS`
5. **Cache Responses** — For common queries, cache in Redis

## Security Best Practices

1. **Never commit .env** — Already in .gitignore
2. **Use Azure Key Vault** — For production secrets
3. **Enable Managed Identity** — For Container App
4. **Restrict Ingress** — Limit health endpoint access
5. **Rotate API Keys** — Regularly rotate Deepgram/Azure keys
6. **Monitor Logs** — Check for suspicious activity
7. **Rate Limit** — Already implemented in bot
8. **Admin Commands** — Protected by phone number

## Next Steps

- [ ] Set up Azure Monitor alerts
- [ ] Configure custom domain
- [ ] Enable HTTPS-only
- [ ] Set up backup for Redis
- [ ] Configure auto-scaling rules
- [ ] Set up budget alerts

## Support

- [Azure Container Apps Docs](https://learn.microsoft.com/azure/container-apps/)
- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [Deepgram Docs](https://developers.deepgram.com/docs)
- [OpenWA Docs](https://docs.openwa.dev/)
