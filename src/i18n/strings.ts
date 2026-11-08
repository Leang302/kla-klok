import { createContext, useContext } from 'react';
import type { Lang } from '../game/storage';
import type { SymbolId } from '../game/types';

const en = {
  title: 'Kla Klok',
  subtitle: 'Tiger · Gourd · Rooster · Shrimp · Crab · Fish',
  tagline: 'The Cambodian festival dice game',
  symbols: {
    tiger: 'Tiger',
    gourd: 'Gourd',
    rooster: 'Rooster',
    shrimp: 'Shrimp',
    crab: 'Crab',
    fish: 'Fish',
  } as Record<SymbolId, string>,
  shake: 'SHAKE!',
  shaking: 'Shaking…',
  available: 'Available',
  inPlay: 'On the table',
  lastWin: 'Last round',
  coins: 'riel',
  chips: 'Choose a chip',
  yourBets: 'Your bets',
  totalBet: 'Total bet',
  noBets: 'Tap a symbol to place your chip.',
  undo: 'Undo',
  clear: 'Clear',
  rebet: 'Rebet',
  quickBet: 'Quick bet',
  luckyPick: 'Lucky pick',
  results: 'Results',
  lastResult: 'Last result',
  noRounds: 'No rounds yet — place a bet and shake!',
  history: 'Recent rounds',
  stats: 'Statistics',
  roundsPlayed: 'Rounds',
  roundsWon: 'Won',
  biggestWin: 'Biggest win',
  howToPlay: 'How to play',
  restart: 'Restart game',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  darkMode: 'Dark mode',
  lightMode: 'Light mode',
  language: 'ភាសាខ្មែរ',
  langShort: 'ខ្មែរ',
  music: 'Background music',
  musicStop: 'Stop music',
  disclaimer: 'Play money for fun only — no real riel.',
  // Results
  win: (n: string) => `You win +${n}!`,
  breakEven: 'Break even!',
  partial: (back: string, net: string) => `Got ${back} back · ${net}`,
  lose: (n: string) => `No luck · −${n}`,
  jackpot: 'JACKPOT!',
  jackpotSub: (sym: string) => `Triple ${sym}!`,
  matched: (n: number) => `×${n}`,
  // Feedback
  notEnough: 'Not enough money for that chip.',
  placeFirst: 'Place a bet first.',
  waitDice: 'Wait for the dice to settle.',
  cantRebet: 'Not enough money to repeat the last bet.',
  // Modals
  confirm: 'Restart',
  cancel: 'Cancel',
  restartTitle: 'Start over?',
  restartBody: 'Your balance resets to 20,000៛ and your history and stats are cleared.',
  brokeTitle: 'Out of money!',
  brokeBody: 'The tiger got lucky this time. Grab a fresh 20,000៛ and play again?',
  brokeCta: 'Play again',
  close: 'Close',
  next: 'Next',
  back: 'Back',
  letsPlay: "Let's play!",
  skip: 'Skip',
  tutorial: [
    { title: 'Pick a chip', body: 'Choose how much to bet — 100៛, 500៛, 1,000៛, 2,000៛ or 5,000៛.' },
    { title: 'Tap the symbols', body: 'Tap any symbol to place your chip. Bet on as many as you like — tap again to add more.' },
    { title: 'Shake the dice!', body: 'Three dice roll. Every die that shows your symbol wins — up to 3× your bet in profit!' },
  ],
  rulesIntro: 'Three dice, each showing one of the six symbols. Bet on symbols, then shake.',
  rulesTable: 'Matching dice on your symbol',
  rulesMatches: (n: number) => (n === 0 ? 'No match' : `${n} ${n === 1 ? 'die' : 'dice'}`),
  rulesPays: (n: number) => (n === 0 ? 'Bet is lost' : `Stake back + ${n}× profit`),
  rulesExample: 'Example: 1,000៛ on Tiger, dice show Tiger · Tiger · Fish → you get 3,000៛ (1,000៛ stake + 2,000៛ profit).',
  rulesKeys: 'Keyboard: 1–6 bet on a symbol · S shake · U undo',
  key: 'Key',
};

export type Strings = typeof en;

const km: Strings = {
  title: 'ខ្លាឃ្លោក',
  subtitle: 'ខ្លា · ឃ្លោក · មាន់ · បង្គា · ក្ដាម · ត្រី',
  tagline: 'ល្បែងប្រជាប្រិយខ្មែរក្នុងពិធីបុណ្យ',
  symbols: {
    tiger: 'ខ្លា',
    gourd: 'ឃ្លោក',
    rooster: 'មាន់',
    shrimp: 'បង្គា',
    crab: 'ក្ដាម',
    fish: 'ត្រី',
  },
  shake: 'ក្រឡុក!',
  shaking: 'កំពុងក្រឡុក…',
  available: 'លុយនៅសល់',
  inPlay: 'កំពុងភ្នាល់',
  lastWin: 'ជុំមុន',
  coins: 'រៀល',
  chips: 'ជ្រើសរើសឈីប',
  yourBets: 'ការភ្នាល់របស់អ្នក',
  totalBet: 'ភ្នាល់សរុប',
  noBets: 'ចុចលើរូបណាមួយដើម្បីដាក់ឈីប។',
  undo: 'ថយក្រោយ',
  clear: 'សម្អាត',
  rebet: 'ភ្នាល់ដដែល',
  quickBet: 'ភ្នាល់រហ័ស',
  luckyPick: 'រើសសំណាង',
  results: 'លទ្ធផល',
  lastResult: 'លទ្ធផលចុងក្រោយ',
  noRounds: 'មិនទាន់មានជុំនៅឡើយ — ដាក់ភ្នាល់ ហើយក្រឡុក!',
  history: 'ជុំថ្មីៗ',
  stats: 'ស្ថិតិ',
  roundsPlayed: 'ជុំ',
  roundsWon: 'ឈ្នះ',
  biggestWin: 'ឈ្នះច្រើនបំផុត',
  howToPlay: 'របៀបលេង',
  restart: 'ចាប់ផ្ដើមឡើងវិញ',
  soundOn: 'បើកសំឡេង',
  soundOff: 'បិទសំឡេង',
  darkMode: 'របៀបងងឹត',
  lightMode: 'របៀបភ្លឺ',
  language: 'English',
  langShort: 'EN',
  music: 'តន្ត្រីផ្ទៃខាងក្រោយ',
  musicStop: 'បិទតន្ត្រី',
  disclaimer: 'លុយលេងសម្រាប់កម្សាន្តតែប៉ុណ្ណោះ — មិនមែនលុយពិតទេ។',
  win: (n) => `អ្នកឈ្នះ +${n}!`,
  breakEven: 'ស្មើទុន!',
  partial: (back, net) => `បានមកវិញ ${back} · ${net}`,
  lose: (n) => `អត់សំណាង · −${n}`,
  jackpot: 'ឈ្នះធំ!',
  jackpotSub: (sym) => `${sym} ទាំងបី!`,
  matched: (n) => `×${n}`,
  notEnough: 'លុយមិនគ្រប់គ្រាន់សម្រាប់ឈីបនេះទេ។',
  placeFirst: 'សូមដាក់ភ្នាល់ជាមុនសិន។',
  waitDice: 'សូមរង់ចាំគ្រាប់ឡុកឡាក់ឈប់សិន។',
  cantRebet: 'លុយមិនគ្រប់គ្រាន់ដើម្បីភ្នាល់ដដែលទេ។',
  confirm: 'ចាប់ផ្ដើមវិញ',
  cancel: 'បោះបង់',
  restartTitle: 'ចាប់ផ្ដើមម្ដងទៀត?',
  restartBody: 'លុយរបស់អ្នកនឹងត្រឡប់ទៅ ២០,០០០៛ វិញ ហើយប្រវត្តិ និងស្ថិតិនឹងត្រូវលុប។',
  brokeTitle: 'អស់លុយហើយ!',
  brokeBody: 'លើកនេះខ្លាសំណាងជាង។ យកលុយ ២០,០០០៛ ថ្មី ហើយលេងម្ដងទៀតទេ?',
  brokeCta: 'លេងម្ដងទៀត',
  close: 'បិទ',
  next: 'បន្ទាប់',
  back: 'ត្រឡប់',
  letsPlay: 'តោះលេង!',
  skip: 'រំលង',
  tutorial: [
    { title: 'ជ្រើសរើសឈីប', body: 'ជ្រើសរើសចំនួនលុយដែលចង់ភ្នាល់ — ១០០៛, ៥០០៛, ១,០០០៛, ២,០០០៛ ឬ ៥,០០០៛។' },
    { title: 'ចុចលើរូប', body: 'ចុចលើរូបណាមួយដើម្បីដាក់ឈីប។ អាចភ្នាល់បានច្រើនរូប — ចុចម្ដងទៀតដើម្បីបន្ថែម។' },
    { title: 'ក្រឡុកគ្រាប់ឡុកឡាក់!', body: 'គ្រាប់ឡុកឡាក់បីគ្រាប់នឹងវិល។ គ្រាប់នីមួយៗដែលចេញរូបរបស់អ្នក គឺឈ្នះ — រហូតដល់ ៣ ដងនៃការភ្នាល់!' },
  ],
  rulesIntro: 'គ្រាប់ឡុកឡាក់បីគ្រាប់ ម្នាក់ៗមានរូបទាំងប្រាំមួយ។ ភ្នាល់លើរូប ហើយក្រឡុក។',
  rulesTable: 'ចំនួនគ្រាប់ដែលត្រូវនឹងរូបរបស់អ្នក',
  rulesMatches: (n) => (n === 0 ? 'មិនត្រូវ' : `${n} គ្រាប់`),
  rulesPays: (n) => (n === 0 ? 'ចាញ់ការភ្នាល់' : `បានដើមវិញ + ចំណេញ ${n} ដង`),
  rulesExample: 'ឧទាហរណ៍៖ ភ្នាល់ ១,០០០៛ លើខ្លា ចេញ ខ្លា · ខ្លា · ត្រី → អ្នកទទួលបាន ៣,០០០៛ (ដើម ១,០០០៛ + ចំណេញ ២,០០០៛)។',
  rulesKeys: 'ក្ដារចុច៖ ១–៦ ភ្នាល់លើរូប · S ក្រឡុក · U ថយក្រោយ',
  key: 'គ្រាប់ចុច',
};

export const STRINGS: Record<Lang, Strings> = { en, km };

export const I18nContext = createContext<{ t: Strings; lang: Lang }>({ t: en, lang: 'en' });
export const useI18n = () => useContext(I18nContext);

const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
export const toKhmerDigits = (s: string) => s.replace(/\d/g, (d) => KM_DIGITS[Number(d)]);

// Number style follows the current language; App sets it before each render.
let numberLang: Lang = 'en';
export const setNumberLang = (lang: Lang) => {
  numberLang = lang;
};

/** Absolute amount in riel, e.g. "2,500៛" or "២,៥០០៛". */
export const fmt = (n: number) => {
  const s = `${Math.abs(Math.round(n)).toLocaleString('en-US')}៛`;
  return numberLang === 'km' ? toKhmerDigits(s) : s;
};
