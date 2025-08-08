#!/bin/bash
cd "$(dirname "$0")/Core"
if [ -f "start-dslr-hybrid.bat" ]; then
    echo "Starting DSLR system..."
    node dslr-auto-upload-service.js
else
    echo "❌ start-dslr-hybrid.bat not found"
fi
