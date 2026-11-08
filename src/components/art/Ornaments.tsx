import { toKhmerDigits } from '../../i18n/strings';
/** Square-holed traditional coin. */
export function CoinIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="#e9a720" stroke="#8a5a12" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="11" fill="#ffd25e" stroke="#c98a14" strokeWidth="1.2" />
      <rect x="12.5" y="12.5" width="7" height="7" rx="1" fill="#b87a12" stroke="#8a5a12" strokeWidth="1.2" />
      <path d="M8 11 A9 9 0 0 1 13 7" stroke="#fff6cf" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const CHIP_COLORS: Record<number, { base: string; edge: string; text: string }> = {
  100: { base: '#3d8fd6', edge: '#1f5f99', text: '#fff' },
  500: { base: '#2fa27f', edge: '#1b6b53', text: '#fff' },
  1000: { base: '#ef6b4f', edge: '#a93d27', text: '#fff' },
  2000: { base: '#7b4fc9', edge: '#4d2c8a', text: '#fff' },
  5000: { base: '#2b2238', edge: '#e7b43c', text: '#ffd25e' },
};

export function ChipGraphic({ value, size = 56 }: { value: number; size?: number }) {
  const c = CHIP_COLORS[value] ?? CHIP_COLORS[100];
  const label = `${toKhmerDigits(String(value))}៛`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <circle cx="32" cy="33.5" r="29" fill="rgba(0,0,0,0.25)" />
      <circle cx="32" cy="32" r="29" fill={c.base} stroke={c.edge} strokeWidth="2" />
      {/* edge inserts */}
      <circle
        cx="32"
        cy="32"
        r="25.5"
        fill="none"
        stroke="#fff8e6"
        strokeWidth="6"
        strokeDasharray="8 12.03"
        transform="rotate(-12 32 32)"
      />
      <circle cx="32" cy="32" r="19" fill={c.base} stroke="#fff8e6" strokeWidth="1.5" strokeDasharray="2 2.5" />
      <circle cx="32" cy="32" r="16" fill={c.edge} opacity="0.35" />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Kantumruy Pro, system-ui, sans-serif"
        fontWeight="700"
        fontSize={label.length >= 5 ? 11.5 : 14}
        fill={c.text}
      >
        {label}
      </text>
      <path d="M12 22 A22 22 0 0 1 24 10" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
