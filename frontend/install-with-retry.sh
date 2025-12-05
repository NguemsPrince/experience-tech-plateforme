#!/bin/bash
# Script d'installation avec retry automatique pour gérer les erreurs npm temporaires

MAX_RETRIES=5
RETRY_DELAY=10

echo "Starting npm install with retry mechanism..."

for i in $(seq 1 $MAX_RETRIES); do
  echo "Attempt $i of $MAX_RETRIES..."
  
  if npm install --legacy-peer-deps; then
    echo "✅ npm install succeeded!"
    exit 0
  else
    if [ $i -lt $MAX_RETRIES ]; then
      echo "❌ npm install failed. Retrying in ${RETRY_DELAY} seconds..."
      sleep $RETRY_DELAY
      # Augmenter le délai pour chaque tentative
      RETRY_DELAY=$((RETRY_DELAY + 10))
    else
      echo "❌ npm install failed after $MAX_RETRIES attempts"
      exit 1
    fi
  fi
done

