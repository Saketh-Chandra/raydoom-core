#!/bin/bash
set -e

echo "🎮 Building DOOM WASM..."

# Get absolute path to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
EMSDK_PATH="${EMSDK_PATH:-$( cd "$PROJECT_ROOT/../../emsdk" && pwd )}"

# Check if emsdk is available
if [ ! -d "$EMSDK_PATH" ]; then
  echo "❌ Error: Emscripten SDK not found at $EMSDK_PATH"
  echo "Please install emsdk or update the path in this script"
  exit 1
fi

# Activate Emscripten environment
echo "📦 Activating Emscripten SDK from: $EMSDK_PATH"
cd "$EMSDK_PATH"
./emsdk activate latest > /dev/null 2>&1 || true
source "$EMSDK_PATH/emsdk_env.sh"
cd "$PROJECT_ROOT"

# Verify emcc is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Error: emcc not found after sourcing emsdk_env.sh"
    echo "Make sure emsdk is properly installed and activated"
    exit 1
fi

echo "✅ Using emcc: $(which emcc)"

# Check if doom-ascii submodule exists
if [ ! -d "$PROJECT_ROOT/src/doom-ascii" ]; then
  echo "❌ Error: doom-ascii source not found at $PROJECT_ROOT/src/doom-ascii"
  echo "Please add doom-ascii as a git submodule:"
  echo "  git submodule add https://github.com/Saketh-Chandra/doom-ascii-wasm.git src/doom-ascii"
  exit 1
fi

# Build WASM
echo "🔨 Compiling DOOM to WebAssembly..."
cd "$PROJECT_ROOT/src/doom-ascii"
PLATFORM=wasm make clean
PLATFORM=wasm make

# Copy artifacts to dist/
echo "📋 Copying build artifacts..."
cd ../..
mkdir -p dist
cp src/doom-ascii/_wasm/obj/doom.js dist/
cp src/doom-ascii/_wasm/obj/doom.wasm dist/

# Show file sizes
echo "✅ Build complete!"
echo ""
echo "📊 Artifact sizes:"
ls -lh dist/doom.{js,wasm} | awk '{print "  " $9 ": " $5}'
echo ""
echo "📦 Total size: $(du -sh dist | awk '{print $1}')"
