#!/bin/bash

# ============================================
# Alpine Skiing Video Platform - Setup Script
# ============================================
# Just run: chmod +x setup.sh && ./setup.sh

echo "🎿 Setting up Alpine Skiing Video Platform..."
echo ""

# Install npm dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional packages we need
echo "📦 Installing video processing packages..."
npm install uuid

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/icons
mkdir -p public/videos
mkdir -p hooks

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
