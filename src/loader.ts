/**
 * DOOM WASM Loader
 * Simplified loader for the DOOM engine compiled to WebAssembly
 * @packageDocumentation
 */

import { DoomModule } from "./types";
import * as path from "path";

/**
 * Load the DOOM WASM module
 * @param config Configuration options for the module
 * @returns Promise that resolves to the initialized DoomModule
 */
export async function loadDoomEngine(config?: {
  assetsPath?: string;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
  arguments?: string[];
  noInitialRun?: boolean;
}): Promise<DoomModule> {
  const assetsPath = config?.assetsPath || path.join(__dirname, "..");
  const doomModulePath = path.join(assetsPath, "doom.js");
  
  // Dynamic import of the Doom module (CommonJS module from Emscripten)
  // Using require for CommonJS compatibility with Emscripten output
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DoomModuleFactory = require(doomModulePath) as (
    config: Partial<DoomModule>
  ) => Promise<DoomModule>;

  // Create module with configuration
  const module = await DoomModuleFactory({
    print: config?.print || ((text: string) => console.log(`[DOOM] ${text}`)),
    printErr: config?.printErr || ((text: string) => console.error(`[DOOM ERROR] ${text}`)),
    locateFile: (filename: string) => {
      // Tell Emscripten where to find .wasm and .data files
      return path.join(assetsPath, filename);
    },
    arguments: config?.arguments || ["doom"],
    noInitialRun: config?.noInitialRun !== undefined ? config.noInitialRun : true,
  });

  return module;
}

/**
 * Helper function to build command line arguments for DOOM
 * @param episode Episode number (1-4)
 * @param difficulty Skill level (1-5)
 * @param scaling Optional resolution scaling factor (default: 3)
 * @returns Array of command line arguments
 */
export function buildDoomArgs(
  episode?: number,
  difficulty?: number,
  scaling?: number
): string[] {
  const args = ["doom"];
  
  if (scaling !== undefined) {
    args.push("-scaling", String(scaling));
  } else {
    args.push("-scaling", "3"); // Default: 320/3 ≈ 106, 200/3 ≈ 66
  }
  
  if (difficulty !== undefined) {
    args.push("-skill", String(difficulty));
  }
  
  if (episode !== undefined) {
    args.push("-episode", String(episode));
  }
  
  return args;
}

/**
 * Initialize DOOM graphics
 * @param module The loaded DoomModule
 */
export function initDoomGraphics(module: DoomModule): void {
  if (module._DG_Init) {
    module._DG_Init();
  }
}

/**
 * Draw a frame
 * @param module The loaded DoomModule
 */
export function drawFrame(module: DoomModule): void {
  if (module._DG_DrawFrame) {
    module._DG_DrawFrame();
  }
}

/**
 * Queue a keyboard input
 * @param module The loaded DoomModule
 * @param keycode The DOOM keycode to queue
 */
export function queueKey(module: DoomModule, keycode: number): void {
  if (module._WASM_QueueKey) {
    module._WASM_QueueKey(keycode);
  }
}

/**
 * Get player health
 * @param module The loaded DoomModule
 * @returns Player health (0-100)
 */
export function getPlayerHealth(module: DoomModule): number {
  return module._WASM_GetPlayerHealth ? module._WASM_GetPlayerHealth() : 0;
}

/**
 * Get player armor
 * @param module The loaded DoomModule
 * @returns Player armor (0-200)
 */
export function getPlayerArmor(module: DoomModule): number {
  return module._WASM_GetPlayerArmor ? module._WASM_GetPlayerArmor() : 0;
}

/**
 * Get current weapon
 * @param module The loaded DoomModule
 * @returns Weapon type (0-8)
 */
export function getPlayerWeapon(module: DoomModule): number {
  return module._WASM_GetPlayerWeapon ? module._WASM_GetPlayerWeapon() : 0;
}

/**
 * Get player ammo for a specific type
 * @param module The loaded DoomModule
 * @param ammoType Ammo type (0-3)
 * @returns Current ammo count
 */
export function getPlayerAmmo(module: DoomModule, ammoType: number): number {
  return module._WASM_GetPlayerAmmo ? module._WASM_GetPlayerAmmo(ammoType) : 0;
}

/**
 * Get player max ammo for a specific type
 * @param module The loaded DoomModule
 * @param ammoType Ammo type (0-3)
 * @returns Maximum ammo capacity
 */
export function getPlayerMaxAmmo(module: DoomModule, ammoType: number): number {
  return module._WASM_GetPlayerMaxAmmo ? module._WASM_GetPlayerMaxAmmo(ammoType) : 0;
}

/**
 * Get current weapon ammo
 * @param module The loaded DoomModule
 * @returns Current weapon ammo count
 */
export function getCurrentWeaponAmmo(module: DoomModule): number {
  return module._WASM_GetCurrentWeaponAmmo ? module._WASM_GetCurrentWeaponAmmo() : 0;
}

/**
 * Check if player has a specific key
 * @param module The loaded DoomModule
 * @param keyId Key card ID (0-5)
 * @returns 1 if player has key, 0 otherwise
 */
export function getPlayerHasKey(module: DoomModule, keyId: number): number {
  return module._WASM_GetPlayerHasKey ? module._WASM_GetPlayerHasKey(keyId) : 0;
}

/**
 * Get player kill count
 * @param module The loaded DoomModule
 * @returns Number of kills
 */
export function getPlayerKills(module: DoomModule): number {
  return module._WASM_GetPlayerKills ? module._WASM_GetPlayerKills() : 0;
}

/**
 * Get player item count
 * @param module The loaded DoomModule
 * @returns Number of items collected
 */
export function getPlayerItems(module: DoomModule): number {
  return module._WASM_GetPlayerItems ? module._WASM_GetPlayerItems() : 0;
}

/**
 * Get player secret count
 * @param module The loaded DoomModule
 * @returns Number of secrets found
 */
export function getPlayerSecrets(module: DoomModule): number {
  return module._WASM_GetPlayerSecrets ? module._WASM_GetPlayerSecrets() : 0;
}

// Re-export types for convenience
export * from "./types";
