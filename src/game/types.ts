export const SYMBOLS = ['tiger', 'gourd', 'rooster', 'shrimp', 'crab', 'fish'] as const;
export type SymbolId = (typeof SYMBOLS)[number];

export const CHIP_VALUES = [100, 500, 1000, 2000, 5000] as const;
export type ChipValue = (typeof CHIP_VALUES)[number];

export const STARTING_BALANCE = 20000;
export const MIN_CHIP: ChipValue = CHIP_VALUES[0];
export const HISTORY_LIMIT = 10;

export type Bets = Record<SymbolId, number>;
export type DiceRoll = [SymbolId, SymbolId, SymbolId];

export interface Placement {
  symbol: SymbolId;
  amount: number;
}

export interface SymbolOutcome {
  symbol: SymbolId;
  bet: number;
  matches: number;
  /** Stake returned + profit (0 when the bet loses). */
  payout: number;
}

export interface RoundResult {
  id: number;
  dice: DiceRoll;
  bets: Bets;
  outcomes: SymbolOutcome[];
  totalBet: number;
  totalPayout: number;
  /** totalPayout − totalBet */
  net: number;
  /** All three dice matched a symbol the player bet on. */
  jackpot: boolean;
  timestamp: number;
}

export interface GameStats {
  rounds: number;
  wins: number;
  biggestWin: number;
}

export type Phase = 'betting' | 'rolling' | 'revealed';

export interface GameState {
  /** Wallet balance, including coins currently committed as bets. */
  balance: number;
  bets: Bets;
  placements: Placement[];
  lastBets: Bets | null;
  phase: Phase;
  /** The dice currently shown in the tray (final faces once revealed). */
  dice: DiceRoll | null;
  lastRound: RoundResult | null;
  history: RoundResult[];
  stats: GameStats;
  nextRoundId: number;
}
