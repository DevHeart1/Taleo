const letterColors = ["#8b5cf6", "#f7a22d", "#50c5c8", "#f57a9d", "#76c78e"];

export function TaleoLogoLegacy() {
  return (
    <>
      <div className="mascot-book">
        <svg
          width={24}
          height={24}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="taleo-logo-cover-legacy" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#a78bfa" offset="0%" />
              <stop stopColor="#6366f1" offset="100%" />
            </linearGradient>
            <linearGradient id="taleo-logo-pages-legacy" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ffffff" offset="0%" />
              <stop stopColor="#fef3c7" offset="100%" />
            </linearGradient>
            <linearGradient id="taleo-logo-star-legacy" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fffead" offset="0%" />
              <stop stopColor="#fbbf24" offset="100%" />
            </linearGradient>
          </defs>
          <g transform="rotate(-8 39 40)">
            {/* Book Cover */}
            <path
              d="M16 28 C28 22 38 29 38 29 L38 58 C38 58 28 51 16 57 Z"
              fill="url(#taleo-logo-cover-legacy)"
              stroke="#1e1b4b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M62 28 C50 22 40 29 40 29 L40 58 C40 58 50 51 62 57 Z"
              fill="url(#taleo-logo-cover-legacy)"
              stroke="#1e1b4b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Book Pages */}
            <path
              d="M18 29 C28 24 37 30 37 30 L37 56 C37 56 28 50 18 55 Z"
              fill="url(#taleo-logo-pages-legacy)"
              stroke="#1e1b4b"
              strokeWidth="2"
            />
            <path
              d="M60 29 C50 24 41 30 41 30 L41 56 C41 56 50 50 60 55 Z"
              fill="url(#taleo-logo-pages-legacy)"
              stroke="#1e1b4b"
              strokeWidth="2"
            />
            {/* Ribbon Bookmark */}
            <path
              d="M38 30 L40 30 L40 64 L37 61 L34 64 L34 30 Z"
              fill="#f43f5e"
            />
            {/* Star Mascot */}
            <path
              d="M39 12 L42.5 19.5 L50.5 20.5 L44.5 26 L46 34 L39 30 L32 34 L33.5 26 L27.5 20.5 L35.5 19.5 Z"
              fill="url(#taleo-logo-star-legacy)"
              stroke="#1e1b4b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Star Face */}
            <circle cx="36.5" cy="22.5" r="1.5" fill="#1e1b4b" />
            <circle cx="41.5" cy="22.5" r="1.5" fill="#1e1b4b" />
            <path
              d="M37.5 25.5 Q39 27 40.5 25.5"
              stroke="#1e1b4b"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sparkles */}
            <circle cx="56" cy="16" r="3" fill="#fbbf24" />
            <path d="M12 20l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5Z" fill="#38bdf8" />
          </g>
        </svg>
        <span />
      </div>
      <span className="brand-text" aria-hidden="true">
        {"Taleo".split("").map((letter, index) => (
          <span key={index} style={{ color: letterColors[index % letterColors.length] }}>
            {letter}
          </span>
        ))}
      </span>
    </>
  );
}
