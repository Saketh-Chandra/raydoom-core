# raydoom-core

[![npm version](https://badge.fury.io/js/raydoom-core.svg)](https://www.npmjs.com/package/raydoom-core)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

raydoom-core is the GPLv2-licensed core package that provides the DOOM ASCII engine compiled to WebAssembly. Published on npm and consumed by the [RayDoom Raycast extension](https://github.com/Saketh-Chandra/raydoom-core) (which is MIT-licensed).

## Contents
- `dist/doom.wasm`, `dist/doom.js` — compiled WASM artifacts
- `dist/loader.js` — helper to load the WASM engine in Node.js
- `dist/types.d.ts` — TypeScript typings for the loader and engine

## Installation

```bash
npm install raydoom-core
```

## Usage

```ts
import { loadDoomEngine } from 'raydoom-core';

async function start() {
  const engine = await loadDoomEngine();
  // Use engine API
}
```

## Building from Source

For contributors or local development:

### Prerequisites
- [Emscripten SDK (emsdk)](https://emscripten.org/docs/getting_started/downloads.html)
- Node.js 18+
- Git

### Setup

```bash
# Clone repository with submodules
git clone --recursive https://github.com/Saketh-Chandra/raydoom-core.git
cd raydoom-core

# If you already cloned without --recursive:
git submodule update --init --recursive

# Install dependencies
npm install
```

### Build

```bash
# Build WASM and TypeScript
npm run build

# Run linting
npm run lint

# Create tarball for local testing
npm pack
```

**Note:** The build script expects `emsdk` at `../emsdk` relative to the repository root. If installed elsewhere, update `scripts/build-wasm.sh`.

### WASM Source
This package uses a [custom fork of doom-ascii](https://github.com/Saketh-Chandra/doom-ascii-wasm) (included as a git submodule) with WASM-specific modifications for Raycast integration:
- Additional exported runtime functions for state access
- Player status exports (health, armor, ammo, weapons)
- Dynamic WAD file loading support
- Raycast-specific input handling

## Installation

```bash
npm install raydoom-core
```

## Usage

```ts
import { loadDoomEngine } from 'raydoom-core';

async function start() {
  const engine = await loadDoomEngine();
  // Use engine API
}
```

## License
This package is licensed under GNU GPL v2. See the `LICENSE` file.

## Attributions
See `NOTICE.md` for third-party attributions and acknowledgements.
