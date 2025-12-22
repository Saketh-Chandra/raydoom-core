/**
 * Type definitions for DOOM WASM integration
 * @packageDocumentation
 */

/**
 * DOOM keyboard codes matching doomkeys.h
 */
export enum DoomKey {
  KEY_RIGHTARROW = 0xae,
  KEY_LEFTARROW = 0xac,
  KEY_UPARROW = 0xad,
  KEY_DOWNARROW = 0xaf,
  KEY_STRAFE_L = 0xa0,
  KEY_STRAFE_R = 0xa1,
  KEY_USE = 0xa2,
  KEY_FIRE = 0xa3,
  KEY_ESCAPE = 27,
  KEY_ENTER = 13,
  KEY_TAB = 9,
  KEY_F1 = 0x80 + 0x3b,
  KEY_F2 = 0x80 + 0x3c,
  KEY_F3 = 0x80 + 0x3d,
  KEY_F4 = 0x80 + 0x3e,
  KEY_F5 = 0x80 + 0x3f,
  KEY_F6 = 0x80 + 0x40,
  KEY_F7 = 0x80 + 0x41,
  KEY_F8 = 0x80 + 0x42,
  KEY_F9 = 0x80 + 0x43,
  KEY_F10 = 0x80 + 0x44,
  KEY_F11 = 0x80 + 0x57,
  KEY_F12 = 0x80 + 0x58,
  KEY_BACKSPACE = 0x7f,
  KEY_PAUSE = 0xff,
  KEY_EQUALS = 0x3d,
  KEY_MINUS = 0x2d,
  KEY_RSHIFT = 0x80 + 0x36,
  KEY_RCTRL = 0x80 + 0x1d,
  KEY_RALT = 0x80 + 0x38,
  KEY_LALT = KEY_RALT,
  // ASCII keys
  KEY_SPACE = 32,
  KEY_Y = 121,
  KEY_N = 110,
}

/**
 * Base Emscripten Module interface
 */
export interface EmscriptenModule {
  onRuntimeInitialized?: () => void;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
  preRun?: Array<() => void>;
  postRun?: Array<() => void>;
  locateFile?: (filename: string) => string;
  arguments?: string[];
  noInitialRun?: boolean;
}

/**
 * Emscripten Module interface for DOOM WASM
 */
export interface DoomModule extends EmscriptenModule {
  _main: () => number;
  _DG_Init: () => void;
  _DG_DrawFrame: () => void;
  _WASM_QueueKey: (keycode: number) => void;
  callMain: (args: string[]) => number;
  
  // Player status exports
  _WASM_GetPlayerHealth: () => number;
  _WASM_GetPlayerArmor: () => number;
  _WASM_GetPlayerWeapon: () => number;
  _WASM_GetPlayerAmmo: (ammoType: number) => number;
  _WASM_GetPlayerMaxAmmo: (ammoType: number) => number;
  _WASM_GetCurrentWeaponAmmo: () => number;
  _WASM_GetPlayerHasKey: (keyId: number) => number;
  _WASM_GetPlayerKills: () => number;
  _WASM_GetPlayerItems: () => number;
  _WASM_GetPlayerSecrets: () => number;
  
  // Game loop control
  _WASM_StopGameLoop?: () => void;
  
  ccall: (
    ident: string,
    returnType: string | null,
    argTypes: string[],
    args: unknown[]
  ) => unknown;
  
  cwrap: (
    ident: string,
    returnType: string | null,
    argTypes: string[]
  ) => (...args: unknown[]) => unknown;
  
  FS: {
    readFile: (path: string) => Uint8Array;
    writeFile: (path: string, data: Uint8Array | string) => void;
    mkdir: (path: string) => void;
    stat: (path: string) => { size: number };
  };
  
  UTF8ToString: (ptr: number) => string;
}

/**
 * Game state for tracking DOOM execution
 */
export interface GameState {
  isInitialized: boolean;
  isRunning: boolean;
  currentFrame: string;
  frameWidth: number;
  frameHeight: number;
  lastError?: string;
}

/**
 * Player statistics
 */
export interface PlayerStats {
  health: number;
  armor: number;
  weapon: number;
  weaponName: string;
  currentAmmo: number;
  maxAmmo: number;
  kills: number;
  items: number;
  secrets: number;
  keys: {
    blueCard: boolean;
    yellowCard: boolean;
    redCard: boolean;
    blueSkull: boolean;
    yellowSkull: boolean;
    redSkull: boolean;
  };
}

/**
 * Weapon names mapping
 */
export const WEAPON_NAMES: Record<number, string> = {
  0: "Fist",
  1: "Pistol",
  2: "Shotgun",
  3: "Chaingun",
  4: "Rocket Launcher",
  5: "Plasma Rifle",
  6: "BFG 9000",
  7: "Chainsaw",
  8: "Super Shotgun",
};

/**
 * Weapon types (matching doomdef.h weapontype_t)
 */
export enum WeaponType {
  FIST = 0,
  PISTOL = 1,
  SHOTGUN = 2,
  CHAINGUN = 3,
  ROCKET_LAUNCHER = 4,
  PLASMA_RIFLE = 5,
  BFG9000 = 6,
  CHAINSAW = 7,
  SUPER_SHOTGUN = 8,
}

/**
 * Ammo types (matching doomdef.h ammotype_t)
 */
export enum AmmoType {
  CLIP = 0,      // Bullets (Pistol/Chaingun)
  SHELL = 1,     // Shells (Shotgun/SSG)
  CELL = 2,      // Cells (Plasma/BFG)
  ROCKET = 3,    // Rockets (Rocket Launcher)
}

/**
 * Key card types
 */
export enum KeyCard {
  BLUE_CARD = 0,
  YELLOW_CARD = 1,
  RED_CARD = 2,
  BLUE_SKULL = 3,
  YELLOW_SKULL = 4,
  RED_SKULL = 5,
}

/**
 * Player status snapshot for display
 */
export interface PlayerStatus {
  health: number;
  armor: number;
  weapon: WeaponType;
  weaponAmmo: number;
  ammo: {
    bullets: number;
    shells: number;
    cells: number;
    rockets: number;
  };
  maxAmmo: {
    bullets: number;
    shells: number;
    cells: number;
    rockets: number;
  };
  keys: {
    blueCard: boolean;
    yellowCard: boolean;
    redCard: boolean;
    blueSkull: boolean;
    yellowSkull: boolean;
    redSkull: boolean;
  };
  stats: {
    kills: number;
    items: number;
    secrets: number;
  };
}

/**
 * Game configuration options
 */
export interface GameConfig {
  episode: number;      // 1-4
  difficulty: number;   // 1-5
  wadPath?: string;     // Optional custom WAD file path
}
