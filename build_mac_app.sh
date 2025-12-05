#!/bin/bash
# Build script for Mac app
# Run this in Terminal: ./build_mac_app.sh

echo "========================================="
echo "  Building Skiing Analyzer for Mac"
echo "========================================="
echo ""

# Step 1: Install PyInstaller if not installed
echo "Step 1: Installing PyInstaller..."
pip3 install pyinstaller

# Step 2: Build the app
echo ""
echo "Step 2: Building the app..."
pyinstaller --onefile --windowed \
    --name "Skiing Analyzer" \
    --add-data "requirements.txt:." \
    skiing_video_analyzer.py

# Step 3: Done!
echo ""
echo "========================================="
echo "  BUILD COMPLETE!"
echo "========================================="
echo ""
echo "Your app is here:"
echo "  dist/Skiing Analyzer.app"
echo ""
echo "To share with others:"
echo "  1. Right-click the .app file"
echo "  2. Click 'Compress'"
echo "  3. Share the .zip file"
echo ""
echo "========================================="
