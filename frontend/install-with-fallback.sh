#!/bin/bash
# Script d'installation avec fallback vers registre alternatif

echo "🔧 Starting npm install with fallback mechanism..."

# Essayer d'abord avec le registre officiel
echo "📦 Attempt 1: Using official npm registry..."
if npm install --legacy-peer-deps --registry=https://registry.npmjs.org/ 2>&1; then
  echo "✅ Installation successful with official registry!"
  exit 0
fi

echo "❌ Attempt 1 failed, waiting 10 seconds before retry..."
sleep 10

# Essayer avec nettoyage du cache
echo "📦 Attempt 2: Cleaning cache and retrying..."
npm cache clean --force || true
if npm install --legacy-peer-deps --registry=https://registry.npmjs.org/ 2>&1; then
  echo "✅ Installation successful after cache clean!"
  exit 0
fi

echo "❌ Attempt 2 failed, waiting 15 seconds before final retry..."
sleep 15

# Dernière tentative avec nettoyage complet
echo "📦 Attempt 3: Final attempt with full cache clean..."
npm cache clean --force || true
if npm install --legacy-peer-deps --registry=https://registry.npmjs.org/ --fetch-retries=10 2>&1; then
  echo "✅ Installation successful on final attempt!"
  exit 0
fi

echo "❌ All 3 attempts failed. This appears to be a temporary npm registry issue."
echo "💡 The npm registry (registry.npmjs.org) is experiencing 500 errors."
echo "💡 Please try deploying again in 15-30 minutes when the registry is stable."
exit 1

