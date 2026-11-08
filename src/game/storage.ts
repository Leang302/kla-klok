import { emptyBets } from './rules';
import { initialGameState } from './reducer';
import { SYMBOLS, type GameState } from './types';

const GAME_KEY = 'klaklok:game:v2';
const SETTINGS_KEY = 'klaklok:settings:v1';

export type Lang = 'en' | 'km';

export interface Settings {
  lang: Lang;
  sound: boolean;
  music: boolean;
  tutorialSeen: boolean;
}

function read<T>(key: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the game still works, it just won't persist */
  }
}

const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 0;

export function loadGame(): GameState {
  const base = initialGameState();
  const saved = read<GameState>(GAME_KEY);
  if (!saved || !isNum(saved.balance)) return base;

  const bets = emptyBets();
  if (saved.bets) for (const s of SYMBOLS) if (isNum(saved.bets[s])) bets[s] = saved.bets[s];
  // Never let restored bets exceed the wallet.
  const committed = SYMBOLS.reduce((a, s) => a + bets[s], 0);
  const safeBets = committed <= saved.balance ? bets : emptyBets();

  return {
    ...base,
    balance: Math.floor(saved.balance),
    bets: safeBets,
    // Undo history is per-session; restored bets become one placement per symbol.
    placements: SYMBOLS.filter((s) => safeBets[s] > 0).map((s) => ({ symbol: s, amount: safeBets[s] })),
    lastBets: saved.lastBets ?? null,
    // A roll interrupted by a reload is simply discarded; bets stay on the table.
    phase: 'betting',
    dice: saved.lastRound?.dice ?? null,
    lastRound: saved.lastRound ?? null,
    history: Array.isArray(saved.history) ? saved.history.slice(0, 10) : [],
    stats: { ...base.stats, ...(saved.stats ?? {}) },
    nextRoundId: isNum(saved.nextRoundId) ? saved.nextRoundId : 1,
  };
}

export function saveGame(state: GameState) {
  const { balance, bets, lastBets, lastRound, history, stats, nextRoundId } = state;
  write(GAME_KEY, { balance, bets, lastBets, lastRound, history, stats, nextRoundId });
}

export function loadSettings(): Settings {
  const saved = read<Settings>(SETTINGS_KEY) ?? {};
  return {
    lang: saved.lang === 'km' ? 'km' : 'en',
    sound: saved.sound ?? true,
    music: saved.music ?? true,
    tutorialSeen: saved.tutorialSeen ?? false,
  };
}

export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings);
}
