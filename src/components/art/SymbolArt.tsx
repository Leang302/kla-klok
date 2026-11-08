import type { SVGProps } from 'react';
import type { SymbolId } from '../../game/types';

const INK = '#3b2416';
const SHADOW = 'rgba(59,36,22,0.16)';

type ArtProps = SVGProps<SVGSVGElement> & { shadow?: boolean };

function Frame({ children, shadow = true, ...rest }: ArtProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" {...rest}>
      {shadow && <ellipse cx="60" cy="113" rx="34" ry="5" fill={SHADOW} />}
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  );
}

const Eye = ({ x, y, r = 3.4 }: { x: number; y: number; r?: number }) => (
  <g stroke="none">
    <circle cx={x} cy={y} r={r} fill={INK} />
    <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.36} fill="#fff" />
  </g>
);

/** Thick limb: dark outline with a colored core. */
const Limb = ({ d, color, w = 4.5 }: { d: string; color: string; w?: number }) => (
  <g fill="none">
    <path d={d} strokeWidth={w + 3.2} />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
);

export function Tiger(props: ArtProps) {
  return (
    <Frame {...props}>
      {/* ears */}
      <circle cx="28" cy="33" r="14" fill="#f39a2e" />
      <circle cx="92" cy="33" r="14" fill="#f39a2e" />
      <circle cx="28" cy="34" r="7" fill="#ffd2b8" stroke="none" />
      <circle cx="92" cy="34" r="7" fill="#ffd2b8" stroke="none" />
      {/* head with cheek ruffs */}
      <path
        d="M60 22 C86 22 101 38 102 57 L112 63 L102 68 C100 92 82 106 60 106 C38 106 20 92 18 68 L8 63 L18 57 C19 38 34 22 60 22Z"
        fill="#f7a33a"
      />
      <ellipse cx="44" cy="34" rx="11" ry="5" fill="#fff" opacity="0.25" stroke="none" transform="rotate(-18 44 34)" />
      {/* muzzle */}
      <path
        d="M60 63 C71 61 83 66 85 78 C87 92 74 101 60 101 C46 101 33 92 35 78 C37 66 49 61 60 63Z"
        fill="#fff4e2"
        stroke="none"
      />
      {/* eye patches */}
      <ellipse cx="43" cy="56" rx="9" ry="8" fill="#fff4e2" stroke="none" opacity="0.8" />
      <ellipse cx="77" cy="56" rx="9" ry="8" fill="#fff4e2" stroke="none" opacity="0.8" />
      {/* forehead stripes */}
      <g fill={INK} stroke="none">
        <path d="M60 24 L54 33 L60 41 L66 33Z" />
        <path d="M44 27 C48 33 48 39 43 45 C41 38 40 32 44 27Z" />
        <path d="M76 27 C72 33 72 39 77 45 C79 38 80 32 76 27Z" />
      </g>
      {/* cheek stripes */}
      <g fill="none" strokeWidth={3.4}>
        <path d="M20 54 Q27 56 31 61" />
        <path d="M19 73 Q25 72 31 69" />
        <path d="M100 54 Q93 56 89 61" />
        <path d="M101 73 Q95 72 89 69" />
      </g>
      <ellipse cx="44" cy="58" rx="5.5" ry="7" fill={INK} stroke="none" />
      <ellipse cx="76" cy="58" rx="5.5" ry="7" fill={INK} stroke="none" />
      <circle cx="46.2" cy="55" r="2.2" fill="#fff" stroke="none" />
      <circle cx="78.2" cy="55" r="2.2" fill="#fff" stroke="none" />
      {/* blush */}
      <ellipse cx="31" cy="81" rx="7" ry="4" fill="#ff6f6f" opacity="0.35" stroke="none" />
      <ellipse cx="89" cy="81" rx="7" ry="4" fill="#ff6f6f" opacity="0.35" stroke="none" />
      {/* nose + mouth */}
      <path d="M51 70 Q60 66 69 70 Q66 77 60 79 Q54 77 51 70Z" fill="#d9536a" strokeWidth={2.6} />
      <path d="M60 79 L60 84 M60 84 Q55 90 49 87 M60 84 Q65 90 71 87" fill="none" strokeWidth={2.6} />
      <g fill={INK} stroke="none">
        <circle cx="47" cy="80" r="1.5" />
        <circle cx="44" cy="85" r="1.5" />
        <circle cx="73" cy="80" r="1.5" />
        <circle cx="76" cy="85" r="1.5" />
      </g>
    </Frame>
  );
}

export function Gourd(props: ArtProps) {
  return (
    <Frame {...props}>
      {/* tendril, stem, leaf */}
      <path d="M58 16 C50 9 41 12 44 19 C46 23 53 21 51 16" fill="none" stroke="#5aa043" strokeWidth={2.6} />
      <path d="M60 19 C59 13 60 8 64 5" fill="none" strokeWidth={4} />
      <path d="M63 12 C70 2 86 1 95 8 C87 18 72 21 63 12Z" fill="#72b84f" />
      <path d="M66 12 Q79 8 91 8" fill="none" stroke="#3f7d2d" strokeWidth={1.8} />
      {/* body */}
      <path
        d="M60 18 C70 18 75 27 73 37 C72 43 68 47 69 52 C87 58 99 72 99 87 C99 104 81 114 60 114 C39 114 21 104 21 87 C21 72 33 58 51 52 C52 47 48 43 47 37 C45 27 50 18 60 18Z"
        fill="#e0412f"
      />
      <g stroke="none">
        <path d="M84 63 C97 73 98 97 84 108 C92 95 92 77 84 63Z" fill="#b02a20" />
        <path d="M66 23 C73 29 72 40 67 46 C69 38 69 30 66 23Z" fill="#b02a20" />
        <ellipse cx="39" cy="83" rx="6" ry="13" fill="#fff" opacity="0.45" transform="rotate(22 39 83)" />
        <ellipse cx="53" cy="31" rx="3" ry="6.5" fill="#fff" opacity="0.5" transform="rotate(12 53 31)" />
        <ellipse cx="30" cy="98" rx="2.2" ry="3" fill="#fff" opacity="0.4" />
      </g>
      {/* gold cord + tassel */}
      <path d="M50 53 Q60 58 70 53" fill="none" stroke="#f4c430" strokeWidth={5.5} />
      <path d="M67 56 C68 60 67 63 68 67" fill="none" stroke="#f4c430" strokeWidth={2.6} />
      <path d="M64.5 66 L71.5 66 L74 78 L62 78Z" fill="#f4c430" strokeWidth={2.2} />
      <path d="M66 70 L66 77 M68 70 L68 77 M70 70 L70 77" stroke="#c99a12" strokeWidth={1.2} />
    </Frame>
  );
}

export function Rooster(props: ArtProps) {
  return (
    <Frame {...props}>
      {/* tail */}
      <path d="M80 64 C76 40 82 18 98 10 C93 26 92 44 92 66Z" fill="#2d5aa8" />
      <path d="M84 66 C86 40 100 24 114 26 C104 38 98 52 96 72Z" fill="#2a8c78" />
      <path d="M88 74 C96 54 108 47 116 53 C106 59 102 69 98 82Z" fill="#ec6a35" />
      {/* legs */}
      <g fill="none" stroke="#e8941a" strokeWidth={3.6}>
        <path d="M56 99 L55 112 M55 112 L48 114 M55 112 L61 115" />
        <path d="M70 100 L71 112 M71 112 L64 114 M71 112 L77 115" />
      </g>
      {/* body */}
      <path
        d="M34 54 C30 40 38 28 50 28 C61 28 65 37 63 46 C62 54 66 58 76 60 C90 62 97 74 93 86 C89 98 75 104 60 102 C44 100 34 90 34 76 C34 68 36 60 34 54Z"
        fill="#fbe3a6"
      />
      {/* neck hackles */}
      <path d="M36 50 C36 60 42 67 53 67 C60 66 63 58 63 48 C57 53 45 54 36 50Z" fill="#f39a3c" stroke="none" />
      <path d="M42 58 l3 5 M49 59 l2 6 M56 58 l1 6" stroke="#c96a1c" strokeWidth={1.6} fill="none" />
      <ellipse cx="72" cy="94" rx="12" ry="4" fill="#e9c47a" stroke="none" opacity="0.7" />
      {/* wing */}
      <path d="M52 77 C60 65 80 67 86 79 C82 92 64 94 54 87 C50 83 50 80 52 77Z" fill="#ec6a35" />
      <path d="M60 81 Q70 78 80 81 M58 86 Q68 87 77 87" fill="none" strokeWidth={2} opacity="0.55" />
      {/* comb, beak, wattle */}
      <path d="M40 31 C36 24 41 18 46 23 C46 15 54 15 55 22 C58 16 66 19 62 28 C60 31 50 32 40 31Z" fill="#e33b3b" />
      <path d="M35 38 L23 42.5 L35 47Z" fill="#f6a623" strokeWidth={2.6} />
      <path d="M36 47 C31 50 32 59 37 57 C40 55 40 50 38 47Z" fill="#e33b3b" strokeWidth={2.6} />
      <Eye x={45} y={38} />
      <ellipse cx="50" cy="45" rx="4" ry="2.4" fill="#ff6f6f" opacity="0.4" stroke="none" />
    </Frame>
  );
}

export function Shrimp(props: ArtProps) {
  return (
    <Frame {...props}>
      {/* antennae */}
      <path d="M99 50 C108 38 113 24 106 9" fill="none" strokeWidth={2.2} />
      <path d="M96 46 C101 31 96 19 85 12" fill="none" strokeWidth={2.2} />
      {/* swimmerets */}
      <g fill="none" stroke="#c97b25" strokeWidth={2.8}>
        <path d="M71 51 L72 63" />
        <path d="M78 54 L80 65" />
        <path d="M85 59 L89 69" />
        <path d="M60 50 L58 61" />
      </g>
      {/* tail fan */}
      <path d="M44 93 C35 97 31 107 35 114 C44 111 50 106 54 100 C56 108 62 112 68 112 C68 102 62 92 56 84Z" fill="#e58a2e" />
      <path d="M44 101 L47 96 M61 104 L57 96" stroke="#a8641e" strokeWidth={1.6} fill="none" />
      {/* body */}
      <path
        d="M101 53 C97 34 75 22 54 28 C34 34 24 54 30 74 C33 84 38 90 44 94 L56 84 C48 78 44 70 46 62 C48 52 58 46 70 48 C78 50 84 56 88 62Z"
        fill="#f2a541"
      />
      {/* rostrum */}
      <path d="M100 51 L113 49 L101 56Z" fill="#f2a541" strokeWidth={2.2} />
      {/* segments */}
      <g fill="none" stroke="#b06d22" strokeWidth={2.2}>
        <path d="M30 66 L45 66" />
        <path d="M33 47 L48 56" />
        <path d="M45 32 L56 47" />
        <path d="M63 27 L65 47" />
      </g>
      <path d="M77 30 C80 40 82 48 84 56" fill="none" strokeWidth={2.4} />
      <path d="M40 40 C48 32 60 28 70 29" fill="none" stroke="#fff" strokeWidth={3} opacity="0.55" />
      <ellipse cx="94" cy="57" rx="4" ry="2.4" fill="#ff5050" opacity="0.35" stroke="none" />
      <circle cx="90" cy="45" r="5" fill="#fff" strokeWidth={2.2} />
      <Eye x={90.5} y={45.5} r={3} />
    </Frame>
  );
}

export function Crab(props: ArtProps) {
  const half = (
    <>
      <Limb d="M35 78 L18 70 L12 79" color="#4f6fc6" w={4} />
      <Limb d="M33 86 L16 86 L11 97" color="#4f6fc6" w={4} />
      <Limb d="M37 94 L23 100 L20 110" color="#4f6fc6" w={4} />
      <Limb d="M40 70 C31 64 28 57 30 50" color="#4f6fc6" w={4.5} />
      <path
        d="M30 53 C16 55 9 43 13 31 C16 22 26 17 33 22 C35 24 35 27 33 29 L24 35 L37 37 C41 45 39 51 30 53Z"
        fill="#5d7fd6"
      />
      <ellipse cx="19" cy="34" rx="2.5" ry="5" fill="#fff" opacity="0.45" stroke="none" transform="rotate(25 19 34)" />
      <Limb d="M50 63 L46 51" color="#4f6fc6" w={3.5} />
      <circle cx="46" cy="46" r="7" fill="#fff" strokeWidth={2.6} />
      <Eye x={47} y={47} r={3.6} />
      <ellipse cx="41" cy="88" rx="6" ry="3.4" fill="#ff9a8a" opacity="0.7" stroke="none" />
    </>
  );
  return (
    <Frame {...props}>
      {half}
      <g transform="matrix(-1 0 0 1 120 0)">{half}</g>
      <ellipse cx="60" cy="81" rx="32" ry="22" fill="#4f6fc6" />
      <ellipse cx="50" cy="70" rx="12" ry="5" fill="#fff" opacity="0.3" stroke="none" transform="rotate(-10 50 70)" />
      <g fill="#3a539c" stroke="none">
        <circle cx="73" cy="72" r="2.6" />
        <circle cx="80" cy="80" r="2" />
        <circle cx="42" cy="78" r="2" />
        <circle cx="66" cy="66" r="1.6" />
      </g>
      <ellipse cx="42" cy="88" rx="6" ry="3.4" fill="#ff9a8a" opacity="0.7" stroke="none" />
      <ellipse cx="78" cy="88" rx="6" ry="3.4" fill="#ff9a8a" opacity="0.7" stroke="none" />
      <path d="M52 87 Q60 94 68 87" fill="none" strokeWidth={2.6} />
    </Frame>
  );
}

export function Fish(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="9" cy="40" r="3.6" fill="#e6f6fd" stroke="#4aa8dc" strokeWidth={2} />
      <circle cx="16" cy="28" r="2.5" fill="#e6f6fd" stroke="#4aa8dc" strokeWidth={2} />
      {/* tail + fins behind */}
      <path d="M84 60 C94 46 106 38 115 40 C109 52 109 68 115 80 C106 82 94 74 84 60Z" fill="#e8742c" />
      <path d="M96 52 L108 46 M97 60 L110 60 M96 68 L108 74" stroke="#b9561c" strokeWidth={1.6} fill="none" />
      <path d="M42 40 C46 26 62 20 77 28 C72 32 70 36 70 40Z" fill="#e8742c" />
      <path d="M46 82 C46 92 54 98 61 95 C59 91 58 87 59 83Z" fill="#e8742c" />
      {/* body */}
      <path d="M12 60 C22 40 48 32 70 37 C82 40 90 50 92 60 C90 70 82 80 70 83 C48 88 22 80 12 60Z" fill="#f3b33d" />
      <path d="M22 67 C36 78 58 80 83 72 C71 84 40 86 22 67Z" fill="#fde9b0" stroke="none" />
      {/* scales */}
      <g fill="none" stroke="#c98a1f" strokeWidth={2}>
        <path d="M46 49 q5 6 10 0 M56 49 q5 6 10 0 M66 49 q5 6 10 0" />
        <path d="M51 57 q5 6 10 0 M61 57 q5 6 10 0 M71 57 q5 6 10 0" />
        <path d="M66 65 q5 6 10 0 M76 63 q4 5 8 0" />
      </g>
      <path d="M30 44 C40 38 52 36 62 37" fill="none" stroke="#fff" strokeWidth={3} opacity="0.5" />
      <path d="M33 46 C39 54 39 66 33 74" fill="none" strokeWidth={2.6} />
      <path d="M41 64 C47 61 56 65 58 72 C51 75 44 72 41 64Z" fill="#e8742c" strokeWidth={2.4} />
      <circle cx="25" cy="55" r="6.2" fill="#fff" strokeWidth={2.4} />
      <Eye x={26} y={56} r={3.4} />
      <path d="M13 61 Q17 64 20 62" fill="none" strokeWidth={2.4} />
      <ellipse cx="30" cy="66" rx="4" ry="2.4" fill="#ff7b7b" opacity="0.4" stroke="none" />
    </Frame>
  );
}

const ART: Record<SymbolId, (p: ArtProps) => React.ReactElement> = {
  tiger: Tiger,
  gourd: Gourd,
  rooster: Rooster,
  shrimp: Shrimp,
  crab: Crab,
  fish: Fish,
};

export function SymbolArt({ symbol, ...props }: ArtProps & { symbol: SymbolId }) {
  const Art = ART[symbol];
  return <Art {...props} />;
}

/** Per-symbol accent colours used for tile glows and badges. */
export const SYMBOL_TINT: Record<SymbolId, string> = {
  tiger: '#f7a33a',
  gourd: '#e0412f',
  rooster: '#e33b3b',
  shrimp: '#f2a541',
  crab: '#4f6fc6',
  fish: '#f3b33d',
};
