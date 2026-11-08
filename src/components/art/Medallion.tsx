import crab from '../../assets/symbols/crab.png';
import fish from '../../assets/symbols/fish.png';
import gourd from '../../assets/symbols/gourd.png';
import rooster from '../../assets/symbols/rooster.png';
import shrimp from '../../assets/symbols/shrimp.png';
import tiger from '../../assets/symbols/tiger.png';
import type { SymbolId } from '../../game/types';

/** Traditional Khmer mat illustrations, extracted from the reference poster. */
export const SYMBOL_IMAGES: Record<SymbolId, string> = { tiger, gourd, rooster, shrimp, crab, fish };

/** Medallion background colours, after the classic printed Kla Klok mat. */
export const MEDALLION_BG: Record<SymbolId, string> = {
  tiger: '#fff3d6',
  gourd: '#ffd84a',
  rooster: '#fff3d6',
  shrimp: '#8fcbee',
  crab: '#ffd84a',
  fish: '#cfe9f7',
};

const BEADS = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 70 + 59 * Math.cos(a),
    y: 70 + 59 * Math.sin(a),
    deg: (a * 180) / Math.PI,
    kind: i % 2 === 0 ? 'leaf' : i % 4 === 1 ? 'red' : 'yellow',
  };
});

/** A symbol inside a circular beaded wreath, like the tiles on a traditional mat. */
export function Medallion({ symbol, className }: { symbol: SymbolId; className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden="true" focusable="false">
      <circle cx="70" cy="70" r="68" fill="#fff" stroke="#3a6fc0" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="59" fill="none" stroke="#2f9e57" strokeWidth="1" strokeOpacity="0.5" />
      {BEADS.map((b, i) =>
        b.kind === 'leaf' ? (
          <ellipse
            key={i}
            cx={b.x}
            cy={b.y}
            rx="3.2"
            ry="6.8"
            fill="#2f9e57"
            transform={`rotate(${b.deg} ${b.x} ${b.y})`}
          />
        ) : (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r="3.4"
            fill={b.kind === 'red' ? '#e2403a' : '#f4c430'}
            stroke="#8a3a12"
            strokeWidth="0.8"
          />
        ),
      )}
      <circle cx="70" cy="70" r="51" fill={MEDALLION_BG[symbol]} />
      <image href={SYMBOL_IMAGES[symbol]} x="19" y="19" width="102" height="102" />
      <circle cx="70" cy="70" r="51" fill="none" stroke="#8a3a12" strokeWidth="2.5" />
    </svg>
  );
}
