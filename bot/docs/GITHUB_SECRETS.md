# GitHub Secrets Setup Guide

This guide explains what secrets you need to configure in GitHub for the CI/CD pipeline to work.

## Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

### 1. AZURE_CREDENTIALS

This is a service principal that GitHub Actions uses to deploy to Azure.

**Create it with:**
```bash
az ad sp create-for-rbac --name "github-actions-shy-bot" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/prakrit-ai-rg \
  --sdk-auth
```

**Copy the entire JSON output and paste it as the secret value:**
```json
{
  "clientId": "xxxx",
  "clientSecret": "xxxx",
  "subscriptionId": "xxxx",
  "tenantId": "xxxx"
}
```

### 2. AZURE_ACR_USERNAME

Your Azure Container Registry username.

**Get it with:**
```bash
az acr credential show --name prakritai --query "username" -o tsv
```

### 3. AZURE_ACR_PASSWORD

Your Azure Container Registry password.

**Get it with:**
```bash
az acr credential show --name prakritai --query "passwords[0].value" -o tsv
```

## Azure Container App Secrets

These are set in Azure Container Apps (not GitHub), but referenced by the CI/CD pipeline.

**Set them with:**
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

## Environment Variables Reference

| Variable | Where to Set | Description |
|----------|-------------|-------------|
| `DEEPGRAM_API_KEY` | Azure Container App Secret | Deepgram API key for voice transcription |
| `AZURE_OPENAI_ENDPOINT` | Azure Container App Secret | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_API_KEY` | Azure Container App Secret | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Azure Container App Secret | GPT-4o deployment name |
| `BOT_NAME` | Container App Env Var | Bot name (default: Shy) |
| `NODE_ENV` | Container App Env Var | Environment (production) |
| `LOG_LEVEL` | Container App Env Var | Logging level (info) |
| `REDIS_URL` | Container App Env Var | Redis connection string |

## Verification

After setting all secrets, push to `main` branch and check:
1. GitHub Actions tab → workflow should run
2. Azure Portal → Container App → Revisions → should show new deployment
3. Health check: `curl https://<your-app>.azurecontainerapps.io/health`
