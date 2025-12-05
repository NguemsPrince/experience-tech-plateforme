#!/bin/bash
# Script d'installation avec fallback vers registre alternatif

set -e

echo "🔧 Starting npm install with fallback mechanism..."

# Essayer d'abord avec le registre officiel
echo "📦 Attempt 1: Using official npm registry..."
if npm install --legacy-peer-deps --registry=https://registry.npmjs.org/; then
  echo "✅ Installation successful with official registry!"
  exit 0
fi

echo "❌ Official registry failed, trying with increased retries..."
sleep 5

# Essayer avec plus de retries
if npm install --legacy-peer-deps --registry=https://registry.npmjs.org/ --fetch-retries=10; then
  echo "✅ Installation successful with increased retries!"
  exit 0
fi

echo "❌ All attempts failed. This appears to be a temporary npm registry issue."
echo "💡 Please try deploying again in a few minutes."
exit 1

