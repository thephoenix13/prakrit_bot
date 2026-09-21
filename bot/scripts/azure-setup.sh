#!/bin/bash
# ============================================================
# Prakrit AI — Shy Bot: Azure Infrastructure Setup
# Run this ONCE to create all Azure resources needed.
# After this, CI/CD handles deployments automatically.
# ============================================================

set -e

# --- Configuration (edit these) ---
RESOURCE_GROUP="prakrit-ai-rg"
LOCATION="eastus"              # Or: southindia, southeastasia
ACR_NAME="prakritai"           # Must be globally unique, lowercase
CONTAINER_APP_ENV="prakrit-ai-env"
CONTAINER_APP_NAME="shy-bot"
REDIS_NAME="prakrit-redis"
LOG_ANALYTICS="prakrit-ai-logs"

echo "🚀 Prakrit AI — Azure Infrastructure Setup"
echo "============================================"
echo ""

# --- Check prerequisites ---
echo "📋 Checking prerequisites..."
command -v az >/dev/null 2>&1 || { echo "❌ Azure CLI not installed. Run: https://aka.ms/installazurecli"; exit 1; }
az account show >/dev/null 2>&1 || { echo "❌ Not logged in. Run: az login"; exit 1; }
echo "✅ Azure CLI ready"
echo ""

# --- 1. Create Resource Group ---
echo "📦 Creating resource group: $RESOURCE_GROUP"
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags "project=prakrit-ai" "bot=shy" \
  --output none
echo "✅ Resource group created"
echo ""

# --- 2. Create Azure Container Registry ---
echo "🐳 Creating container registry: $ACR_NAME"
az acr create \
  --name "$ACR_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --sku Basic \
  --admin-enabled true \
  --output none
echo "✅ Container registry created"

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)
echo "   Username: $ACR_USERNAME"
echo ""

# --- 3. Create Log Analytics Workspace ---
echo "📊 Creating Log Analytics workspace: $LOG_ANALYTICS"
az monitor log-analytics workspace create \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$LOG_ANALYTICS" \
  --location "$LOCATION" \
  --output none
echo "✅ Log Analytics workspace created"

LOG_ANALYTICS_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$LOG_ANALYTICS" \
  --query "id" -o tsv)
echo ""

# --- 4. Create Container Apps Environment ---
echo "🌐 Creating Container Apps environment: $CONTAINER_APP_ENV"
az containerapp env create \
  --name "$CONTAINER_APP_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --logs-workspace-id "$LOG_ANALYTICS_ID" \
  --output none
echo "✅ Container Apps environment created"
echo ""

# --- 5. Create Azure Cache for Redis ---
echo "🔴 Creating Redis cache: $REDIS_NAME"
az redis create \
  --name "$REDIS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Basic \
  --vm-size c0 \
  --enable-non-ssl-port false \
  --output none
echo "✅ Redis cache created"

# Get Redis connection string
REDIS_KEY=$(az redis list-keys \
  --name "$REDIS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "primaryKey" -o tsv)
REDIS_HOST=$(az redis show \
  --name "$REDIS_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "hostName" -o tsv)
REDIS_URL="rediss://:${REDIS_KEY}@${REDIS_HOST}:6380"
echo "   Host: $REDIS_HOST"
echo ""

# --- 6. Create Container App (initial deployment) ---
echo "🚀 Creating Container App: $CONTAINER_APP_NAME"
az containerapp create \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_APP_ENV" \
  --image "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --registry-server "${ACR_NAME}.azurecr.io" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --output none
echo "✅ Container App created"
echo ""

# --- 7. Set up secrets (placeholder — fill in your values) ---
echo "🔐 Setting up secrets..."
echo ""
echo "   ⚠️  You need to manually set these secrets in Azure Portal or via CLI:"
echo ""
echo "   az containerapp secret set --name $CONTAINER_APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --secrets deepgram-api-key=YOUR_DEEPGRAM_KEY \\"
echo "              azure-openai-endpoint=YOUR_AZURE_OPENAI_ENDPOINT \\"
echo "              azure-openai-api-key=YOUR_AZURE_OPENAI_KEY \\"
echo "              azure-openai-deployment=gpt-4o"
echo ""

# --- 8. Set environment variables ---
echo "⚙️  Setting environment variables..."
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "BOT_NAME=Shy" \
    "NODE_ENV=production" \
    "LOG_LEVEL=info" \
    "MAX_CONVERSATION_HISTORY=15" \
    "CONVERSATION_TTL_HOURS=24" \
    "MAX_RESPONSE_TOKENS=300" \
    "TEMPERATURE=0.7" \
    "REDIS_URL=$REDIS_URL" \
  --output none
echo "✅ Environment variables set"
echo ""

# --- 9. Configure health probes ---
echo "🏥 Configuring health probes..."
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --scale-rule-name http-scaling \
  --scale-rule-type http \
  --scale-rule-http-concurrency 10 \
  --output none
echo "✅ Health probes configured"
echo ""

# --- Summary ---
echo "============================================"
echo "✅ Azure infrastructure setup complete!"
echo ""
echo "📋 Resources created:"
echo "   • Resource Group: $RESOURCE_GROUP"
echo "   • Container Registry: ${ACR_NAME}.azurecr.io"
echo "   • Container Apps Env: $CONTAINER_APP_ENV"
echo "   • Container App: $CONTAINER_APP_NAME"
echo "   • Redis: $REDIS_NAME"
echo "   • Log Analytics: $LOG_ANALYTICS"
echo ""
echo "🔑 Next steps:"
echo "   1. Set secrets (see above)"
echo "   2. Add GitHub secrets:"
echo "      • AZURE_CREDENTIALS (az ad sp create-for-rbac)"
echo "      • AZURE_ACR_USERNAME = $ACR_USERNAME"
echo "      • AZURE_ACR_PASSWORD = (from ACR credentials)"
echo "   3. Push to main branch to trigger deployment"
echo ""
echo "🌐 Get Container App URL:"
echo "   az containerapp show --name $CONTAINER_APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --query 'properties.configuration.ingress.fqdn' -o tsv"
echo "============================================"
