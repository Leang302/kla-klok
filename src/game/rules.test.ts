import { describe, expect, it } from 'vitest';
import { gameReducer, initialGameState } from './reducer';
import { randomInt, rollDice } from './random';
import { emptyBets, isBroke, payoutFor, settle } from './rules';
import { STARTING_BALANCE, type GameState } from './types';

const bets = (b: Partial<Record<string, number>>) => ({ ...emptyBets(), ...b });

describe('payout rules', () => {
  it('returns stake + matches × stake', () => {
    expect(payoutFor(100, 0)).toBe(0);
    expect(payoutFor(100, 1)).toBe(200);
    expect(payoutFor(100, 2)).toBe(300);
    expect(payoutFor(100, 3)).toBe(400);
  });

  it('settles multiple bets in one round', () => {
    const s = settle(bets({ tiger: 50, crab: 20, fish: 10 }), ['tiger', 'tiger', 'crab']);
    // tiger: 50 + 2×50 = 150, crab: 20 + 20 = 40, fish: lost
    expect(s.totalBet).toBe(80);
    expect(s.totalPayout).toBe(190);
    expect(s.net).toBe(110);
    expect(s.jackpot).toBe(false);
  });

  it('flags a jackpot only for a triple the player bet on', () => {
    expect(settle(bets({ gourd: 10 }), ['gourd', 'gourd', 'gourd']).jackpot).toBe(true);
    expect(settle(bets({ fish: 10 }), ['gourd', 'gourd', 'gourd']).jackpot).toBe(false);
  });

  it('can lose everything', () => {
    const s = settle(bets({ shrimp: 100 }), ['tiger', 'fish', 'crab']);
    expect(s.net).toBe(-100);
  });
});

describe('reducer', () => {
  const play = (state: GameState, ...actions: Parameters<typeof gameReducer>[1][]) =>
    actions.reduce(gameReducer, state);

  it('prevents betting more than the balance', () => {
    let s = initialGameState();
    s = play(s, { type: 'place', symbol: 'tiger', amount: STARTING_BALANCE / 2 }, { type: 'place', symbol: 'crab', amount: STARTING_BALANCE / 2 });
    expect(s.bets.tiger + s.bets.crab).toBe(STARTING_BALANCE);
    s = gameReducer(s, { type: 'place', symbol: 'fish', amount: 10 });
    expect(s.bets.fish).toBe(0);
  });

  it('undo removes only the latest chip, clear removes all', () => {
    let s = play(
      initialGameState(),
      { type: 'place', symbol: 'tiger', amount: 10 },
      { type: 'place', symbol: 'tiger', amount: 25 },
      { type: 'place', symbol: 'fish', amount: 50 },
      { type: 'undo' },
    );
    expect(s.bets).toEqual(bets({ tiger: 35 }));
    s = gameReducer(s, { type: 'clear' });
    expect(s.bets).toEqual(emptyBets());
    expect(s.placements).toHaveLength(0);
  });

  it('settles a round, updates balance, history and stats', () => {
    let s = play(
      initialGameState(),
      { type: 'place', symbol: 'rooster', amount: 100 },
      { type: 'place', symbol: 'crab', amount: 50 },
      { type: 'startRoll', dice: ['rooster', 'rooster', 'rooster'] },
    );
    // betting is locked while rolling
    expect(gameReducer(s, { type: 'place', symbol: 'fish', amount: 10 })).toBe(s);
    expect(gameReducer(s, { type: 'startRoll', dice: ['fish', 'fish', 'fish'] })).toBe(s);
    s = gameReducer(s, { type: 'settle', timestamp: 1 });
    expect(s.balance).toBe(STARTING_BALANCE - 150 + 400);
    expect(s.lastRound?.jackpot).toBe(true);
    expect(s.stats).toEqual({ rounds: 1, wins: 1, biggestWin: 250 });
    expect(s.bets).toEqual(emptyBets());
    expect(s.lastBets).toEqual(bets({ rooster: 100, crab: 50 }));
    expect(s.phase).toBe('revealed');
  });

  it('will not roll without bets', () => {
    const s = initialGameState();
    expect(gameReducer(s, { type: 'startRoll', dice: ['fish', 'fish', 'fish'] })).toBe(s);
  });

  it('rebet repeats the previous bets when affordable', () => {
    let s = play(
      initialGameState(),
      { type: 'place', symbol: 'gourd', amount: 25 },
      { type: 'startRoll', dice: ['fish', 'fish', 'fish'] },
      { type: 'settle', timestamp: 1 },
      { type: 'rebet' },
    );
    expect(s.bets.gourd).toBe(25);
    expect(s.balance).toBe(STARTING_BALANCE - 25);
    expect(s.phase).toBe('betting');
  });

  it('keeps history to the last 10 rounds', () => {
    let s = initialGameState();
    for (let i = 0; i < 12; i++) {
      s = play(s, { type: 'place', symbol: 'tiger', amount: 10 }, { type: 'startRoll', dice: ['tiger', 'fish', 'crab'] }, { type: 'settle', timestamp: i });
    }
    expect(s.history).toHaveLength(10);
    expect(s.history[0].id).toBe(12);
    expect(s.balance).toBe(STARTING_BALANCE + 12 * 10);
  });

  it('detects running out of coins', () => {
    expect(isBroke(50, emptyBets())).toBe(true);
    expect(isBroke(50, bets({ tiger: 50 }))).toBe(false);
    expect(isBroke(100, emptyBets())).toBe(false);
  });
});

describe('randomness', () => {
  it('produces every face with roughly equal frequency', () => {
    const counts = Array(6).fill(0);
    const n = 60000;
    for (let i = 0; i < n; i++) counts[randomInt(6)]++;
    for (const c of counts) expect(Math.abs(c - n / 6)).toBeLessThan(n * 0.01);
  });

  it('rolls three valid symbols', () => {
    const r = rollDice();
    expect(r).toHaveLength(3);
  });
});
