export function getSceneTheme(prompt: string, text: string): "cave" | "forest" | "night" | "water" | "castle" | "meadow" {
  const combined = (prompt + " " + text).toLowerCase();
  if (
    combined.includes("cave") ||
    combined.includes("stone") ||
    combined.includes("underground") ||
    combined.includes("dark") ||
    combined.includes("cavern") ||
    combined.includes("shadow")
  ) {
    return "cave";
  }
  if (
    combined.includes("forest") ||
    combined.includes("wood") ||
    combined.includes("tree") ||
    combined.includes("jungle") ||
    combined.includes("garden") ||
    combined.includes("leaves") ||
    combined.includes("grove")
  ) {
    return "forest";
  }
  if (
    combined.includes("night") ||
    combined.includes("star") ||
    combined.includes("moon") ||
    combined.includes("sky") ||
    combined.includes("bed") ||
    combined.includes("sleep") ||
    combined.includes("dream") ||
    combined.includes("twinkle")
  ) {
    return "night";
  }
  if (
    combined.includes("water") ||
    combined.includes("sea") ||
    combined.includes("ocean") ||
    combined.includes("river") ||
    combined.includes("lake") ||
    combined.includes("beach") ||
    combined.includes("boat") ||
    combined.includes("fish") ||
    combined.includes("swim")
  ) {
    return "water";
  }
  if (
    combined.includes("castle") ||
    combined.includes("palace") ||
    combined.includes("tower") ||
    combined.includes("king") ||
    combined.includes("queen") ||
    combined.includes("princess") ||
    combined.includes("dragon") ||
    combined.includes("kingdom")
  ) {
    return "castle";
  }
  return "meadow";
}

export function getDynamicFallbackImage(prompt: string, text: string): string {
  const theme = getSceneTheme(prompt, text);

  let svgContent = "";

  if (theme === "cave") {
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="cave-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#311e57"/>
    </linearGradient>
    <linearGradient id="crystal-glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#cave-bg)"/>
  
  <!-- Cave archways/walls -->
  <path d="M-50 1074 L250 500 C300 400 450 350 512 350 C574 350 724 400 774 500 L1074 1074 Z" fill="#111827" opacity="0.8"/>
  <path d="M-80 1074 L180 580 C220 500 380 440 512 440 C644 440 804 500 844 580 L1104 1074 Z" fill="#1f2937" opacity="0.9"/>
  <path d="M0 1024 L100 800 C150 720 300 680 512 680 C724 680 874 720 924 800 L1024 1024 Z" fill="#374151"/>

  <!-- Glowing Crystals -->
  <g filter="url(#glow)">
    <!-- Crystal 1 -->
    <path d="M300 750 L320 680 L340 750 L320 800 Z" fill="url(#crystal-glow)" />
    <!-- Crystal 2 (Pink) -->
    <path d="M700 780 L730 700 L760 780 L730 840 Z" fill="#f43f5e" />
    <!-- Crystal 3 (Purple) -->
    <path d="M220 820 L235 760 L250 820 L235 860 Z" fill="#a855f7" />
    <!-- Crystal 4 (Yellow) -->
    <path d="M780 830 L795 780 L810 830 L795 860 Z" fill="#eab308" />
  </g>
  
  <!-- Mysterious glowing dust -->
  <circle cx="512" cy="500" r="10" fill="#22d3ee" opacity="0.8" filter="url(#glow)"/>
  <circle cx="450" cy="580" r="6" fill="#f43f5e" opacity="0.6" filter="url(#glow)"/>
  <circle cx="580" cy="540" r="8" fill="#eab308" opacity="0.7" filter="url(#glow)"/>
  <circle cx="380" cy="620" r="4" fill="#a855f7" opacity="0.5" filter="url(#glow)"/>
  <circle cx="640" cy="600" r="5" fill="#22d3ee" opacity="0.6" filter="url(#glow)"/>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#e2e8f0" letter-spacing="2">MYSTERIOUS CAVE</text>
  <path d="M412 180 L612 180" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  } else if (theme === "forest") {
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="forest-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="tree-grad-1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="tree-grad-2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
    <filter id="forest-glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#forest-bg)"/>
  
  <!-- Back trees (silhouettes) -->
  <path d="M150 700 L250 400 L350 700 Z" fill="#022c22" opacity="0.6"/>
  <path d="M700 750 L800 450 L900 750 Z" fill="#022c22" opacity="0.6"/>
  <path d="M450 680 L550 420 L650 680 Z" fill="#064e3b" opacity="0.5"/>
  
  <!-- Hills/Ground -->
  <path d="M-100 1024 Q 200 800, 600 900 T 1124 950 L 1124 1024 Z" fill="#022c22"/>
  <path d="M-100 1024 Q 400 950, 800 880 T 1124 1024 Z" fill="#064e3b" opacity="0.9"/>
  
  <!-- Foreground Trees -->
  <g transform="translate(180, 480)">
    <rect x="50" y="250" width="30" height="150" fill="#78350f" />
    <path d="M0 250 L65 50 L130 250 Z" fill="url(#tree-grad-1)"/>
    <path d="M15 170 L65 20 L115 170 Z" fill="url(#tree-grad-2)"/>
  </g>
  <g transform="translate(680, 520)">
    <rect x="40" y="200" width="24" height="120" fill="#78350f" />
    <path d="M0 200 L52 30 L104 200 Z" fill="url(#tree-grad-1)"/>
    <path d="M12 130 L52 10 L92 130 Z" fill="url(#tree-grad-2)"/>
  </g>

  <!-- Glowing Fireflies -->
  <g filter="url(#forest-glow)">
    <circle cx="340" cy="550" r="8" fill="#fbbf24" opacity="0.9"/>
    <circle cx="340" cy="550" r="18" fill="#fbbf24" opacity="0.3"/>
    
    <circle cx="480" cy="620" r="6" fill="#a7f3d0" opacity="0.95"/>
    <circle cx="480" cy="620" r="14" fill="#a7f3d0" opacity="0.4"/>

    <circle cx="620" cy="530" r="9" fill="#fbbf24" opacity="0.85"/>
    <circle cx="620" cy="530" r="20" fill="#fbbf24" opacity="0.25"/>

    <circle cx="280" cy="680" r="7" fill="#34d399" opacity="0.9"/>
    <circle cx="780" cy="590" r="5" fill="#fef08a" opacity="0.9"/>
  </g>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#e2e8f0" letter-spacing="2">ENCHANTED FOREST</text>
  <path d="M400 180 L624 180" stroke="#34d399" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  } else if (theme === "night") {
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="night-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <filter id="moon-glow">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#night-bg)"/>
  
  <!-- Stars -->
  <g fill="#ffffff">
    <circle cx="150" cy="200" r="3" opacity="0.8"/>
    <circle cx="280" cy="150" r="2" opacity="0.5"/>
    <circle cx="350" cy="300" r="4" opacity="0.9"/>
    <circle cx="720" cy="180" r="3" opacity="0.7"/>
    <circle cx="850" cy="250" r="2" opacity="0.6"/>
    <circle cx="900" cy="120" r="5" opacity="0.9" filter="url(#moon-glow)"/>
    <circle cx="600" cy="280" r="3" opacity="0.8"/>
    <circle cx="480" cy="190" r="2.5" opacity="0.75"/>
    <circle cx="180" cy="400" r="3.5" opacity="0.85"/>
    <circle cx="800" cy="380" r="2" opacity="0.4"/>
  </g>
  
  <!-- Moon -->
  <g filter="url(#moon-glow)" transform="translate(480, 240)">
    <circle cx="60" cy="60" r="100" fill="#fef08a" />
    <circle cx="110" cy="40" r="90" fill="#020617" />
  </g>

  <!-- Rolling hills silhouetted -->
  <path d="M-100 1024 Q 250 820, 600 920 T 1124 960 L 1124 1024 Z" fill="#020617"/>
  <path d="M-100 1024 Q 450 930, 850 850 T 1124 1024 Z" fill="#0f172a" opacity="0.9"/>

  <!-- Clouds -->
  <path d="M200 900 C 250 850, 350 850, 400 900 C 450 850, 550 850, 600 900" stroke="#f1f5f9" stroke-width="40" stroke-linecap="round" opacity="0.15"/>
  <path d="M500 930 C 560 880, 680 880, 740 930 C 800 880, 920 880, 980 930" stroke="#f1f5f9" stroke-width="30" stroke-linecap="round" opacity="0.1"/>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#e2e8f0" letter-spacing="2">STARRY NIGHT</text>
  <path d="M420 180 L604 180" stroke="#fef08a" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  } else if (theme === "water") {
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="water-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="sun-glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffedd5"/>
      <stop offset="100%" stop-color="#fdba74"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="1024" height="600" fill="url(#water-sky)"/>
  
  <!-- Glowing Sun -->
  <circle cx="800" cy="250" r="70" fill="url(#sun-glow)" filter="url(#glow)"/>
  
  <!-- Sea water -->
  <rect y="550" width="1024" height="474" fill="url(#sea)"/>
  
  <!-- Waves -->
  <path d="M 0 570 C 150 540, 300 540, 450 570 C 600 600, 750 600, 900 570 L 1024 570 L 1024 1024 L 0 1024 Z" fill="url(#sea)"/>
  <path d="M 0 630 C 200 610, 400 610, 600 630 C 800 650, 1000 650, 1024 630 L 1024 1024 L 0 1024 Z" fill="#0284c7" opacity="0.8"/>
  <path d="M 0 710 C 250 690, 500 690, 750 710 C 850 720, 950 720, 1024 710 L 1024 1024 L 0 1024 Z" fill="#0369a1" opacity="0.6"/>

  <!-- Cute Sailboat -->
  <g transform="translate(320, 440) scale(0.8)">
    <!-- Hull -->
    <path d="M 50 120 L 250 120 L 220 160 L 80 160 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- Mast -->
    <line x1="150" y1="120" x2="150" y2="20" stroke="#451a03" stroke-width="5" stroke-linecap="round"/>
    <!-- Sail -->
    <path d="M 150 25 L 230 110 L 150 110 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <!-- Flag -->
    <path d="M 150 20 L 170 30 L 150 40 Z" fill="#ef4444"/>
  </g>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#0369a1" letter-spacing="2">DEEP BLUE SEA</text>
  <path d="M410 180 L614 180" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  } else if (theme === "castle") {
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="castle-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdf2f8"/>
      <stop offset="60%" stop-color="#fce7f3"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
    <linearGradient id="castle-wall" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="roof-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#be185d"/>
    </linearGradient>
  </defs>
  
  <rect width="1024" height="1024" fill="url(#castle-sky)"/>
  
  <!-- Mountain base -->
  <path d="M-100 1024 C 200 750, 450 780, 1124 1024 Z" fill="#475569" opacity="0.8"/>
  <path d="M-100 1024 C 300 850, 700 820, 1124 1024 Z" fill="#334155"/>
  
  <!-- Castle silhouette -->
  <g transform="translate(362, 520)">
    <!-- Left Tower -->
    <rect x="0" y="80" width="50" height="220" fill="url(#castle-wall)"/>
    <polygon points="-10,80 25,-10 60,80" fill="url(#roof-grad)"/>
    <!-- Right Tower -->
    <rect x="250" y="80" width="50" height="220" fill="url(#castle-wall)"/>
    <polygon points="240,80 275,-10 310,80" fill="url(#roof-grad)"/>
    <!-- Main Center building -->
    <rect x="50" y="140" width="200" height="160" fill="url(#castle-wall)"/>
    <!-- Center Keep/Tower -->
    <rect x="110" y="40" width="80" height="180" fill="url(#castle-wall)"/>
    <polygon points="95,40 150,-50 205,40" fill="url(#roof-grad)"/>
    
    <!-- Door -->
    <path d="M 125 300 L 125 240 C 125 220, 175 220, 175 240 L 175 300 Z" fill="#78350f" />
    
    <!-- Small Flags -->
    <path d="M 25 -10 L 50 -5 L 25 0 Z" fill="#eab308"/>
    <path d="M 275 -10 L 300 -5 L 275 0 Z" fill="#eab308"/>
    <path d="M 150 -50 L 180 -42 L 150 -35 Z" fill="#eab308"/>
  </g>

  <!-- Sparkles -->
  <g fill="#eab308">
    <circle cx="320" cy="450" r="6" opacity="0.8"/>
    <circle cx="700" cy="480" r="4" opacity="0.6"/>
    <circle cx="512" cy="400" r="8" opacity="0.9"/>
    <circle cx="280" cy="550" r="5" opacity="0.7"/>
    <circle cx="750" cy="580" r="7" opacity="0.8"/>
  </g>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#be185d" letter-spacing="2">FAIRY TALE CASTLE</text>
  <path d="M380 180 L644 180" stroke="#f472b6" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  } else {
    // Default Meadow Theme
    svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fee2e2"/>
      <stop offset="50%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#bfdbfe"/>
    </linearGradient>
    <linearGradient id="sun-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="hill-grad-1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a7f3d0"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <linearGradient id="hill-grad-2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  
  <rect width="1024" height="1024" fill="url(#bg)"/>
  
  <!-- Sun -->
  <circle cx="850" cy="180" r="90" fill="url(#sun-grad)" opacity="0.95"/>
  
  <!-- Clouds -->
  <circle cx="200" cy="300" r="80" fill="#ffffff" opacity="0.85"/>
  <circle cx="280" cy="320" r="70" fill="#ffffff" opacity="0.85"/>
  <circle cx="130" cy="330" r="60" fill="#ffffff" opacity="0.85"/>

  <!-- Back Hill -->
  <path d="M-100 1024 C 200 680, 500 700, 1124 1024 Z" fill="url(#hill-grad-2)" opacity="0.8"/>
  
  <!-- Front Hill -->
  <path d="M-100 1024 C 300 800, 750 720, 1124 1024 Z" fill="url(#hill-grad-1)"/>

  <!-- Simple Whimsical Flowers -->
  <g fill="#ec4899">
    <circle cx="150" cy="900" r="8"/>
    <circle cx="162" cy="900" r="8"/>
    <circle cx="156" cy="890" r="8"/>
    <circle cx="156" cy="910" r="8"/>
    <circle cx="156" cy="900" r="5" fill="#fef08a"/>
  </g>
  <g fill="#3b82f6" transform="translate(680, 50)">
    <circle cx="150" cy="820" r="6"/>
    <circle cx="160" cy="820" r="6"/>
    <circle cx="155" cy="812" r="6"/>
    <circle cx="155" cy="828" r="6"/>
    <circle cx="155" cy="820" r="4" fill="#fef08a"/>
  </g>
  <g fill="#eab308" transform="translate(-250, 30)">
    <circle cx="700" cy="870" r="7"/>
    <circle cx="712" cy="870" r="7"/>
    <circle cx="706" cy="860" r="7"/>
    <circle cx="706" cy="880" r="7"/>
    <circle cx="706" cy="870" r="5" fill="#ffffff"/>
  </g>

  <!-- Magical Text -->
  <text x="512" y="150" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="52" font-weight="bold" fill="#047857" letter-spacing="2">SUNNY MEADOW</text>
  <path d="M420 180 L604 180" stroke="#10b981" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
</svg>`;
  }

  return "data:image/svg+xml;utf8," + encodeURIComponent(svgContent.trim());
}
