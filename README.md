# raydoom-core

raydoom-core is the GPLv2-licensed core package that provides the DOOM ASCII engine compiled to WebAssembly. It's intended to be published on npm and consumed by the RayDoom Raycast extension (which is MIT-licensed).

## Contents
- `dist/doom.wasm`, `dist/doom.js`, `dist/doom.data` — compiled WASM artifacts
- `dist/loader.js` — helper to load the WASM engine in Node.js
- `dist/types.d.ts` — TypeScript typings for the loader and engine

## Building
Requirements: Emscripten SDK (emsdk) installed and activated.

From the repository root:

```bash
# Build WASM and TypeScript
npm run build

# Create a tarball for local testing
npm pack
```

Note: The build script expects `emsdk` to be located at `../emsdk` relative to this repository root. Adjust `scripts/build-wasm.sh` if your `emsdk` is installed elsewhere.

### WASM Source
This package uses a [custom fork of doom-ascii](https://github.com/Saketh-Chandra/doom-ascii-wasm) with WASM-specific modifications for Raycast integration, including:
- Additional exported runtime functions for state access
- Player status exports (health, armor, ammo, weapons)
- Dynamic WAD file loading support
- Raycast-specific input handling

## Usage
Install from npm (after publishing) or with a local `.tgz`:

```bash
npm install raydoom-core
# or for local testing
npm install ../raydoom-core/raydoom-core-1.0.0.tgz
```

In your project:

```ts
import { loadDoomEngine } from 'raydoom-core';

async function start() {
  const engine = await loadDoomEngine();
  // engine API ...
}
```

## License
This package is licensed under GNU GPL v2. See the `LICENSE` file.

## Attributions
See `NOTICE.md` for third-party attributions and acknowledgements.
