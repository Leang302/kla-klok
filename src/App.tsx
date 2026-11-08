import { MotionConfig, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { sound } from './audio/sound';
import { useBackgroundMusic } from './audio/useBackgroundMusic';
import { CoinIcon } from './components/art/Ornaments';
import { Medallion } from './components/art/Medallion';
import { ControlPanel, type Delta } from './components/Controls';
import { DiceTray, type DiceTiming } from './components/DiceTray';
import { CoinLayer, useCoinBurst } from './components/effects/CoinBurst';
import { Confetti } from './components/effects/Confetti';
import { JackpotOverlay } from './components/effects/JackpotOverlay';
import { Toast, type ToastMsg } from './components/effects/Toast';
import { Header, ResultBanner } from './components/Header';
import { ConfirmModal, HowToPlayModal, TutorialModal } from './components/modals/Modals';
import { SymbolTile } from './components/SymbolTile';
import { rollDice } from './game/random';
import { gameReducer } from './game/reducer';
import { available as availableOf, canAfford, countMatches, isBroke, totalBet } from './game/rules';
import { loadGame, loadSettings, saveGame, saveSettings, type Settings } from './game/storage';
import { CHIP_VALUES, MIN_CHIP, SYMBOLS, type ChipValue, type SymbolId } from './game/types';
import { I18nContext, setNumberLang, STRINGS } from './i18n/strings';

type ModalKind = 'none' | 'help' | 'tutorial' | 'restart' | 'broke';

/** Largest chip that fits in an amount — used to colour a settled bet's chip. */
function chipFor(amount: number): number {
  return [...CHIP_VALUES].reverse().find((v) => v <= amount) ?? MIN_CHIP;
}

export default function App() {
  const reduce = useReducedMotion() ?? false;
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [game, dispatch] = useReducer(gameReducer, undefined, loadGame);
  const [chip, setChip] = useState<ChipValue>(500);
  const [rollKey, setRollKey] = useState(0);
  const [modal, setModal] = useState<ModalKind>(() => (settings.tutorialSeen ? 'none' : 'tutorial'));
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [delta, setDelta] = useState<Delta | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [jackpot, setJackpot] = useState<{ symbol: SymbolId; amount: number } | null>(null);
  const { flights, launch } = useCoinBurst();
  const closeJackpot = useCallback(() => setJackpot(null), []);

  const trayRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const stopShakeSound = useRef<() => void>(() => {});
  const celebrate = useRef(false);

  const t = STRINGS[settings.lang];
  useBackgroundMusic(settings.music);
  setNumberLang(settings.lang);
  const timing: DiceTiming = useMemo(
    () => (reduce ? { shake: 350, gap: 180, land: 250 } : { shake: 1300, gap: 480, land: 520 }),
    [reduce],
  );

  const rolling = game.phase === 'rolling';
  const avail = availableOf(game.balance, game.bets);
  const staked = totalBet(game.bets);

  // ---------- persistence & settings ----------
  useEffect(() => saveGame(game), [game]);
  useEffect(() => {
    saveSettings(settings);
    sound.enabled = settings.sound;
    document.documentElement.lang = settings.lang;
    document.title = settings.lang === 'km' ? 'ខ្លាឃ្លោក · Kla Klok' : 'Kla Klok · ខ្លាឃ្លោក';
  }, [settings]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const notify = useCallback((text: string) => {
    sound.error();
    setToast({ id: Date.now(), text });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  // ---------- actions ----------
  const placeBet = (symbol: SymbolId) => {
    if (rolling) return notify(t.waitDice);
    if (!canAfford(game.balance, game.bets, chip)) return notify(t.notEnough);
    sound.chip();
    dispatch({ type: 'place', symbol, amount: chip });
  };

  const shake = () => {
    if (rolling) return;
    if (staked === 0) return notify(t.placeFirst);
    dispatch({ type: 'startRoll', dice: rollDice() });
    setRollKey((k) => k + 1);
    setDelta(null);
    stopShakeSound.current = sound.shake(timing.shake + 2 * timing.gap);
    celebrate.current = true;

    const tray = trayRef.current;
    if (tray) {
      const r = tray.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        tray.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
    later(() => {
      stopShakeSound.current();
      dispatch({ type: 'settle', timestamp: Date.now() });
    }, timing.shake + 2 * timing.gap + timing.land);
  };

  const undo = () => {
    if (rolling || game.placements.length === 0) return;
    sound.click();
    dispatch({ type: 'undo' });
  };
  const clear = () => {
    if (rolling) return;
    sound.click();
    dispatch({ type: 'clear' });
  };
  const rebet = () => {
    if (rolling || !game.lastBets) return;
    if (totalBet(game.lastBets) > game.balance) return notify(t.cantRebet);
    sound.chip();
    dispatch({ type: 'rebet' });
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    stopShakeSound.current();
    celebrate.current = false;
    setJackpot(null);
    setDelta(null);
    dispatch({ type: 'restart' });
    setModal('none');
    sound.select();
  };

  // ---------- celebrate a settled round ----------
  useEffect(() => {
    const r = game.lastRound;
    if (!r || !celebrate.current || game.phase !== 'revealed') return;
    celebrate.current = false;
    setDelta({ id: r.id, value: r.net });

    if (r.jackpot) {
      sound.jackpot();
      setJackpot({ symbol: r.outcomes.find((o) => o.matches === 3)!.symbol, amount: r.net });
      setConfettiKey((k) => k + 1);
    } else if (r.net > 0) {
      sound.win(r.net >= 5000);
      if (!reduce && (r.net >= 5000 || r.net >= r.totalBet * 2)) setConfettiKey((k) => k + 1);
    } else if (r.totalPayout > 0) {
      sound.win(false);
    } else {
      sound.lose();
    }

    const els = r.outcomes
      .filter((o) => o.payout > 0)
      .map((o) => document.querySelector(`[data-tile="${o.symbol}"]`))
      .filter((e): e is Element => !!e);
    if (els.length) later(() => launch(els, reduce ? 2 : Math.min(8, 3 + Math.floor(r.totalPayout / 2000))), 350);
    if (isBroke(game.balance, game.bets)) later(() => setModal('broke'), r.jackpot ? 3800 : 1600);
  }, [game.lastRound, game.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- keyboard: 1–6 bet, S shake, U undo ----------
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandler.current = (e: KeyboardEvent) => {
    if (modal !== 'none' || jackpot || e.metaKey || e.ctrlKey || e.altKey) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 6) {
      e.preventDefault();
      placeBet(SYMBOLS[n - 1]);
    } else if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      shake();
    } else if (e.key.toLowerCase() === 'u') {
      e.preventDefault();
      undo();
    }
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ---------- derived view data ----------
  const revealed = game.phase === 'revealed' ? game.lastRound : null;
  // After a round, keep showing that round's bets until the player starts a new one.
  const showSettled = !!revealed && staked === 0;
  const lastChipBySymbol = useMemo(() => {
    const map: Partial<Record<SymbolId, number>> = {};
    for (const p of game.placements) map[p.symbol] = p.amount;
    return map;
  }, [game.placements]);
  const betSymbolsShown = revealed ? SYMBOLS.filter((s) => revealed.bets[s] > 0) : [];

  return (
    <I18nContext.Provider value={{ t, lang: settings.lang }}>
      <MotionConfig reducedMotion="user">
        <Header
          lang={settings.lang}
          soundOn={settings.sound}
          musicOn={settings.music}
          onMusic={() => setSettings((s) => ({ ...s, music: !s.music }))}
          onLang={() => {
            sound.click();
            setSettings((s) => ({ ...s, lang: s.lang === 'en' ? 'km' : 'en' }));
          }}
          onSound={() => {
            const next = !settings.sound;
            sound.enabled = next;
            setSettings((s) => ({ ...s, sound: next }));
            if (next) sound.select();
          }}
          onHelp={() => setModal('help')}
          onRestart={() => setModal('restart')}
        />

        <main
          className="mx-auto grid max-w-6xl gap-4 px-3 pb-4 pt-4 [grid-template-areas:'dice'_'board'_'controls'] sm:gap-6 sm:px-6 sm:pt-6
            lg:grid-cols-[380px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-8 lg:pb-10 lg:[grid-template-areas:'dice_board'_'controls_board']"
        >
          <div className="[grid-area:dice]">
            <DiceTray
              ref={trayRef}
              phase={game.phase}
              dice={game.dice}
              rollKey={rollKey}
              timing={timing}
              betSymbols={betSymbolsShown}
              onLand={(i) => sound.land(i)}
            >
              <ResultBanner round={game.lastRound} visible={!!revealed} />
            </DiceTray>
          </div>

          <ControlPanel
            className="sticky bottom-2 z-30 [grid-area:controls] lg:static lg:self-start"
            available={avail}
            staked={staked}
            chip={chip}
            locked={rolling}
            rolling={rolling}
            canUndo={game.placements.length > 0}
            canRebet={!!game.lastBets}
            delta={delta}
            onChip={(v) => {
              setChip(v);
              sound.select();
            }}
            onUndo={undo}
            onClear={clear}
            onRebet={rebet}
            onShake={shake}
          />

          <section className="[grid-area:board] lg:self-start" aria-label={t.subtitle}>
            <div className="paper rounded-3xl bg-[linear-gradient(#eef4fb_1px,transparent_1px),linear-gradient(90deg,#eef4fb_1px,transparent_1px)] bg-[size:22px_22px] p-3 sm:p-6">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
                {SYMBOLS.map((s, i) => {
                  const bet = showSettled ? revealed!.bets[s] : game.bets[s];
                  return (
                    <SymbolTile
                      key={s}
                      symbol={s}
                      index={i}
                      bet={bet}
                      topChip={showSettled ? chipFor(bet) : (lastChipBySymbol[s] ?? MIN_CHIP)}
                      phase={game.phase}
                      matches={revealed ? countMatches(revealed.dice, s) : null}
                      payout={revealed?.outcomes.find((o) => o.symbol === s)?.payout ?? 0}
                      locked={rolling}
                      onBet={placeBet}
                    />
                  );
                })}
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[#fbefd9]/85">
              <CoinIcon size={14} /> {t.disclaimer}
              <button type="button" onClick={() => setModal('help')} className="ml-2 font-semibold underline underline-offset-2 sm:hidden">
                {t.howToPlay}
              </button>
            </p>
          </section>
        </main>

        <Confetti fireKey={confettiKey} intensity={jackpot ? 1.6 : 1} />
        <CoinLayer flights={flights} />
        <JackpotOverlay symbol={jackpot?.symbol ?? null} amount={jackpot?.amount ?? 0} onDone={closeJackpot} />
        <Toast toast={toast} />

        <TutorialModal
          open={modal === 'tutorial'}
          onClose={() => {
            setSettings((s) => ({ ...s, tutorialSeen: true }));
            setModal('none');
          }}
        />
        <HowToPlayModal open={modal === 'help'} onClose={() => setModal('none')} />
        <ConfirmModal
          open={modal === 'restart'}
          title={t.restartTitle}
          body={t.restartBody}
          confirmLabel={t.confirm}
          onConfirm={restart}
          onClose={() => setModal('none')}
        />
        <ConfirmModal
          open={modal === 'broke'}
          dismissable={false}
          title={t.brokeTitle}
          body={t.brokeBody}
          confirmLabel={t.brokeCta}
          onConfirm={restart}
          onClose={() => {}}
          art={<Medallion symbol="tiger" className="size-28" />}
        />
      </MotionConfig>
    </I18nContext.Provider>
  );
}
