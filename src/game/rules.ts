import {
  MIN_CHIP,
  SYMBOLS,
  type Bets,
  type DiceRoll,
  type SymbolId,
  type SymbolOutcome,
} from './types';

export function emptyBets(): Bets {
  return { tiger: 0, gourd: 0, rooster: 0, shrimp: 0, crab: 0, fish: 0 };
}

export function totalBet(bets: Bets): number {
  return SYMBOLS.reduce((sum, s) => sum + bets[s], 0);
}

export function hasBets(bets: Bets): boolean {
  return totalBet(bets) > 0;
}

export function countMatches(dice: readonly SymbolId[], symbol: SymbolId): number {
  return dice.filter((d) => d === symbol).length;
}

/**
 * Payout for one symbol: a winning bet returns its stake plus
 * (matches × stake) profit. No matches → the stake is lost.
 */
export function payoutFor(bet: number, matches: number): number {
  return matches > 0 ? bet * (1 + matches) : 0;
}

export interface Settlement {
  outcomes: SymbolOutcome[];
  totalBet: number;
  totalPayout: number;
  net: number;
  jackpot: boolean;
}

export function settle(bets: Bets, dice: DiceRoll): Settlement {
  const outcomes: SymbolOutcome[] = [];
  let staked = 0;
  let paid = 0;
  for (const symbol of SYMBOLS) {
    const bet = bets[symbol];
    if (bet <= 0) continue;
    const matches = countMatches(dice, symbol);
    const payout = payoutFor(bet, matches);
    outcomes.push({ symbol, bet, matches, payout });
    staked += bet;
    paid += payout;
  }
  const jackpot = outcomes.some((o) => o.matches === 3);
  return { outcomes, totalBet: staked, totalPayout: paid, net: paid - staked, jackpot };
}

/** Coins not yet committed to a bet. */
export function available(balance: number, bets: Bets): number {
  return balance - totalBet(bets);
}

export function canAfford(balance: number, bets: Bets, amount: number): boolean {
  return amount > 0 && available(balance, bets) >= amount;
}

/** Player can no longer place even the smallest chip and has nothing on the table. */
export function isBroke(balance: number, bets: Bets): boolean {
  return !hasBets(bets) && balance < MIN_CHIP;
}
