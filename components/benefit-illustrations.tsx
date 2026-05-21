type IllustrationProps = {
  className?: string;
};

export function BenefitFrictionIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="frictionOrb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b69cff" />
          <stop offset="100%" stopColor="#7550f6" />
        </linearGradient>
      </defs>
      <rect x="18" y="24" width="224" height="122" rx="34" fill="#fff" opacity="0.78" />
      <path className="friction-wave-l1" d="M96 88 C86 58 66 58 56 88" fill="none" stroke="#f0b8ff" strokeWidth="5" strokeLinecap="round" />
      <path className="friction-wave-l2" d="M76 88 C62 42 36 42 24 88" fill="none" stroke="#d9c5ff" strokeWidth="3.5" strokeLinecap="round" />
      <path className="friction-wave-r1" d="M164 88 C174 58 194 58 204 88" fill="none" stroke="#f0b8ff" strokeWidth="5" strokeLinecap="round" />
      <path className="friction-wave-r2" d="M184 88 C198 42 224 42 236 88" fill="none" stroke="#d9c5ff" strokeWidth="3.5" strokeLinecap="round" />
      <circle className="friction-orb-glow" cx="130" cy="88" r="48" fill="#8758ff" opacity="0.12" />
      <circle className="friction-orb" cx="130" cy="88" r="28" fill="url(#frictionOrb)" stroke="#fff" strokeWidth="5" />
      <path d="M124 77 v16 a6 6 0 0 0 12 0 V77 a6 6 0 0 0 -12 0Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M116 91 a14 14 0 0 0 28 0 M130 105 v12 M122 117 h16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path className="friction-star-1" d="M116 40 121 51 132 56 121 61 116 72 111 61 100 56 111 51Z" fill="#f9a8d4" />
      <path className="friction-star-2" d="M160 48 163 55 170 58 163 61 160 68 157 61 150 58 157 55Z" fill="#ffcf5a" />
    </svg>
  );
}

export function BenefitFantasyIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fantasyCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a91" />
          <stop offset="100%" stopColor="#e73562" />
        </linearGradient>
      </defs>
      <g className="fantasy-tag">
        <rect x="88" y="18" width="104" height="30" rx="15" fill="#fff0f4" stroke="#ff5574" strokeWidth="2" />
        <text x="140" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill="#9f1239" fontFamily="ui-rounded, system-ui, sans-serif">
          Maya + dragon
        </text>
      </g>
      <path className="fantasy-cloud" d="M103 72 C96 55 122 43 134 55 C144 44 168 56 160 75 C176 78 172 96 151 96 H111 C94 96 88 78 103 72Z" fill="#fff" stroke="#ff8aa1" strokeWidth="2" opacity="0.92" />
      <g className="fantasy-book" transform="translate(65 94)">
        <path d="M10 0 C28 -8 58 0 62 4 V44 C50 35 28 30 10 40Z" fill="url(#fantasyCover)" stroke="#571022" strokeWidth="3" />
        <path d="M118 0 C100 -8 70 0 66 4 V44 C78 35 100 30 118 40Z" fill="url(#fantasyCover)" stroke="#571022" strokeWidth="3" />
        <path d="M18 4 C34 -1 54 5 60 8 V39 C45 30 30 28 18 34Z" fill="#fff9fb" stroke="#571022" strokeWidth="2" />
        <path d="M110 4 C94 -1 74 5 68 8 V39 C83 30 98 28 110 34Z" fill="#fff9fb" stroke="#571022" strokeWidth="2" />
        <path d="M62 6 h6 v50 l-3 -5 -3 5Z" fill="#ff5574" />
      </g>
      <circle className="fantasy-sparkle-1" cx="68" cy="56" r="3" fill="#ff5574" />
      <path className="fantasy-sparkle-2" d="M202 62 205 69 212 72 205 75 202 82 199 75 192 72 199 69Z" fill="#ffcf5a" />
    </svg>
  );
}

export function BenefitSafetyIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="safetyShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f9f94" />
        </linearGradient>
      </defs>
      <circle className="safety-radar-1" cx="130" cy="86" r="62" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="8 8" opacity="0.35" />
      <circle className="safety-radar-2" cx="130" cy="86" r="44" fill="none" stroke="#2dd4bf" strokeWidth="2" opacity="0.22" />
      <path className="safety-shield" d="M130 35 C154 35 166 43 166 58 C166 88 140 119 130 128 C120 119 94 88 94 58 C94 43 106 35 130 35Z" fill="none" stroke="url(#safetyShield)" strokeWidth="5" strokeLinejoin="round" />
      <g className="safety-lock" transform="translate(116 69)">
        <path className="safety-lock-shackle" d="M7 12 V8 a9 9 0 0 1 18 0 v4" fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
        <rect y="12" width="32" height="25" rx="8" fill="url(#safetyShield)" stroke="#0f766e" strokeWidth="3" />
        <circle cx="16" cy="24" r="3" fill="#063a37" />
        <path d="M16 27 v5" stroke="#063a37" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="safety-badge-1" transform="translate(44 54)">
        <circle cx="15" cy="15" r="15" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <path d="M9 15 l4 4 9 -10" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="safety-badge-2" transform="translate(186 78)">
        <circle cx="15" cy="15" r="15" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
        <path d="M9 15 l4 4 9 -10" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function BenefitPayoffIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 260 170" className={className} aria-hidden="true" focusable="false">
      <g className="payoff-books" transform="translate(38 58)">
        <g className="payoff-book-1" transform="translate(0 58)">
          <rect width="82" height="18" rx="6" fill="#a78bfa" stroke="#21144d" strokeWidth="3" />
          <path d="M12 9 h58" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>
        <g className="payoff-book-2" transform="translate(8 37)">
          <rect width="70" height="18" rx="6" fill="#fb7185" stroke="#21144d" strokeWidth="3" />
          <path d="M12 9 h46" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>
        <g className="payoff-book-3" transform="translate(16 16)">
          <rect width="58" height="18" rx="6" fill="#ffd65c" stroke="#21144d" strokeWidth="3" />
          <path d="M12 9 h34" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>
      </g>
      <path className="payoff-trendline" d="M136 124 L158 92 L184 84 L214 44" fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <path className="payoff-star-point-1" d="M136 124 139 131 146 134 139 137 136 144 133 137 126 134 133 131Z" fill="#f59e0b" />
      <path className="payoff-star-point-2" d="M184 84 187 91 194 94 187 97 184 104 181 97 174 94 181 91Z" fill="#f59e0b" />
      <path className="payoff-star-point-3" d="M214 44 219 55 230 60 219 65 214 76 209 65 198 60 209 55Z" fill="#ffcf5a" />
      <text className="payoff-word-1" x="128" y="34" fontSize="13" fontWeight="900" fill="#8758ff" fontFamily="ui-rounded, system-ui, sans-serif">
        Adventure
      </text>
      <text className="payoff-word-2" x="42" y="38" fontSize="13" fontWeight="900" fill="#fb7185" fontFamily="ui-rounded, system-ui, sans-serif">
        Wonder
      </text>
    </svg>
  );
}
