import { SYMBOLS, type DiceRoll, type SymbolId } from './types';

/**
 * Unbiased integer in [0, max) using crypto.getRandomValues with rejection
 * sampling. Falls back to Math.random when the secure API is unavailable.
 */
export function randomInt(max: number): number {
  if (max <= 0 || max > 256) throw new RangeError('max must be in 1..256');
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === 'function') {
    const limit = 256 - (256 % max); // largest multiple of max ≤ 256
    const buf = new Uint8Array(1);
    for (;;) {
      c.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  }
  return Math.floor(Math.random() * max);
}

export function randomSymbol(): SymbolId {
  return SYMBOLS[randomInt(SYMBOLS.length)];
}

export function rollDice(): DiceRoll {
  return [randomSymbol(), randomSymbol(), randomSymbol()];
}

/** Pick `count` distinct symbols at random (Fisher–Yates). */
export function pickDistinctSymbols(count: number): SymbolId[] {
  const pool = [...SYMBOLS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(0, Math.min(count, pool.length)));
}
