import { canAfford, emptyBets, hasBets, settle, totalBet } from './rules';
import {
  HISTORY_LIMIT,
  STARTING_BALANCE,
  SYMBOLS,
  type Bets,
  type DiceRoll,
  type GameState,
  type SymbolId,
} from './types';

export type GameAction =
  | { type: 'place'; symbol: SymbolId; amount: number }
  | { type: 'placeMany'; placements: { symbol: SymbolId; amount: number }[] }
  | { type: 'undo' }
  | { type: 'clear' }
  | { type: 'rebet' }
  | { type: 'startRoll'; dice: DiceRoll }
  | { type: 'settle'; timestamp: number }
  | { type: 'restart' };

export function initialGameState(): GameState {
  return {
    balance: STARTING_BALANCE,
    bets: emptyBets(),
    placements: [],
    lastBets: null,
    phase: 'betting',
    dice: null,
    lastRound: null,
    history: [],
    stats: { rounds: 0, wins: 0, biggestWin: 0 },
    nextRoundId: 1,
  };
}

/** Leaving the "revealed" phase when the player starts a new round. */
function toBetting(state: GameState): GameState {
  return state.phase === 'revealed' ? { ...state, phase: 'betting' } : state;
}

function placeOne(state: GameState, symbol: SymbolId, amount: number): GameState {
  if (!canAfford(state.balance, state.bets, amount)) return state;
  return {
    ...state,
    bets: { ...state.bets, [symbol]: state.bets[symbol] + amount },
    placements: [...state.placements, { symbol, amount }],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  // Nothing but settling may change the table while the dice are rolling.
  if (state.phase === 'rolling' && action.type !== 'settle' && action.type !== 'restart') {
    return state;
  }

  switch (action.type) {
    case 'place':
      return placeOne(toBetting(state), action.symbol, action.amount);

    case 'placeMany': {
      let next = toBetting(state);
      for (const p of action.placements) next = placeOne(next, p.symbol, p.amount);
      return next;
    }

    case 'undo': {
      const last = state.placements[state.placements.length - 1];
      if (!last) return state;
      return {
        ...state,
        bets: { ...state.bets, [last.symbol]: state.bets[last.symbol] - last.amount },
        placements: state.placements.slice(0, -1),
      };
    }

    case 'clear':
      if (!hasBets(state.bets)) return state;
      return { ...state, bets: emptyBets(), placements: [] };

    case 'rebet': {
      const prev = state.lastBets;
      if (!prev || hasBets(state.bets)) return state;
      if (totalBet(prev) > state.balance) return state;
      const placements = SYMBOLS.filter((s) => prev[s] > 0).map((s) => ({
        symbol: s,
        amount: prev[s],
      }));
      return { ...toBetting(state), bets: { ...prev }, placements };
    }

    case 'startRoll':
      if (!hasBets(state.bets)) return state;
      return { ...state, phase: 'rolling', dice: action.dice };

    case 'settle': {
      if (state.phase !== 'rolling' || !state.dice) return state;
      const s = settle(state.bets, state.dice);
      const round = {
        id: state.nextRoundId,
        dice: state.dice,
        bets: { ...state.bets },
        ...s,
        timestamp: action.timestamp,
      };
      return {
        ...state,
        balance: state.balance + s.net,
        bets: emptyBets(),
        placements: [],
        lastBets: { ...state.bets } as Bets,
        phase: 'revealed',
        lastRound: round,
        history: [round, ...state.history].slice(0, HISTORY_LIMIT),
        stats: {
          rounds: state.stats.rounds + 1,
          wins: state.stats.wins + (s.net > 0 ? 1 : 0),
          biggestWin: Math.max(state.stats.biggestWin, s.net),
        },
        nextRoundId: state.nextRoundId + 1,
      };
    }

    case 'restart':
      return initialGameState();
  }
}
