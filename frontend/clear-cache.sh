#!/bin/bash

# Script to clear cache and rebuild the project
echo "Clearing cache and rebuilding..."

# Remove build directory
if [ -d "build" ]; then
    echo "Removing build directory..."
    rm -rf build
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Start the development server
echo "Starting development server..."
npm start
