'use client';

import { useEffect, useRef, useState } from 'react';

export function AyrinCharacter() {
  const [blink, setBlink] = useState(false);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      blinkTimer.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, 2400 + Math.random() * 3600);
    };

    schedule();
    return () => {
      if (blinkTimer.current) {
        clearTimeout(blinkTimer.current);
      }
    };
  }, []);

  return (
    <svg
      viewBox="0 0 260 720"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
      aria-label="Ayrin character illustration"
      role="img"
    >
      <defs>
        <radialGradient id="a-skin" cx="48%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#E9BC94" />
          <stop offset="65%" stopColor="#C8875D" />
          <stop offset="100%" stopColor="#A56641" />
        </radialGradient>
        <radialGradient id="a-skin-face" cx="50%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#EDC39C" />
          <stop offset="70%" stopColor="#C98A61" />
          <stop offset="100%" stopColor="#A36240" />
        </radialGradient>

        <linearGradient id="a-hair" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#2B221B" />
          <stop offset="45%" stopColor="#16110D" />
          <stop offset="100%" stopColor="#060504" />
        </linearGradient>
        <linearGradient id="a-hair-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A2F27" />
          <stop offset="35%" stopColor="#4A3C34" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#2B221B" />
          <stop offset="100%" stopColor="#060504" />
        </linearGradient>

        <linearGradient id="a-kurta" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#FBF3E7" />
          <stop offset="55%" stopColor="#F1E1CD" />
          <stop offset="100%" stopColor="#E6D0B4" />
        </linearGradient>
        <linearGradient id="a-kurta-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>

        <linearGradient id="a-pants" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#1A1A20" />
          <stop offset="55%" stopColor="#0D0D12" />
          <stop offset="100%" stopColor="#05050A" />
        </linearGradient>

        <radialGradient id="a-iris" cx="36%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#8B5B2F" />
          <stop offset="45%" stopColor="#3A220F" />
          <stop offset="100%" stopColor="#090402" />
        </radialGradient>

        <radialGradient id="a-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7AA2" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FF7AA2" stopOpacity="0" />
        </radialGradient>

        <clipPath id="a-lec" clipPathUnits="userSpaceOnUse">
          <ellipse cx="106" cy="116" rx="21" ry="14" />
        </clipPath>
        <clipPath id="a-rec" clipPathUnits="userSpaceOnUse">
          <ellipse cx="154" cy="116" rx="21" ry="14" />
        </clipPath>
      </defs>

      <ellipse cx="130" cy="716" rx="60" ry="7" fill="rgba(0,0,0,0.14)" />

      {/* Pants */}
      <path
        fill="url(#a-pants)"
        d="
          M 92,486
          C 84,552 84,624 94,694
          C 100,710 118,710 124,694
          C 134,624 134,552 126,486
          Z
        "
      />
      <path
        fill="url(#a-pants)"
        d="
          M 134,486
          C 126,552 126,624 136,694
          C 142,710 160,710 166,694
          C 176,624 176,552 168,486
          Z
        "
      />
      <path
        d="M 108,486 C 104,556 104,632 110,700"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 152,486 C 156,556 156,632 150,700"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Shoes */}
      <ellipse cx="109" cy="706" rx="21" ry="9.5" fill="#F0F2F5" />
      <ellipse cx="151" cy="706" rx="21" ry="9.5" fill="#F0F2F5" />
      <path
        d="M 90,706 C 104,699 114,699 128,706"
        fill="none"
        stroke="#C9CED6"
        strokeWidth="1.8"
        opacity="0.75"
      />
      <path
        d="M 132,706 C 146,699 156,699 170,706"
        fill="none"
        stroke="#C9CED6"
        strokeWidth="1.8"
        opacity="0.75"
      />

      {/* Kurta */}
      <path
        fill="url(#a-kurta)"
        d="
          M 76,230
          C 64,250 58,286 58,334
          L 58,430
          C 58,462 80,486 110,490
          L 150,490
          C 180,486 202,462 202,430
          L 202,334
          C 202,286 196,250 184,230
          C 166,218 149,212 130,212
          C 111,212 94,218 76,230
          Z
        "
      />
      <path
        fill="url(#a-kurta-shadow)"
        opacity="0.24"
        d="M 184,230 C 196,250 202,286 202,334 L 202,430
           C 202,462 180,486 150,490 L 140,490
           C 146,450 150,386 150,336 C 150,292 146,256 140,220
           C 158,220 174,222 184,230 Z"
      />

      <path
        d="M 92,258 C 86,318 86,382 92,440"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.06"
      />
      <path
        d="M 168,258 C 174,318 174,382 168,440"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.06"
      />

      {/* Collar + placket */}
      <path
        d="M 112,226 C 120,236 125,250 130,270 C 135,250 140,236 148,226"
        fill="none"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="3.1"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M 130,270 L 130,482"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        opacity="0.55"
      />
      {[300, 326, 352].map((y) => (
        <circle key={y} cx={130} cy={y} r={2.2} fill="rgba(0,0,0,0.16)" opacity={0.85} />
      ))}

      <path
        d="M 116,232 C 122,242 126,250 130,258 C 134,250 138,242 144,232"
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="2 6"
        opacity="0.65"
      />

      <path
        d="M 108,252 C 118,262 124,266 130,268"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 152,252 C 142,262 136,266 130,268"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Sleeves + arms */}
      <path
        fill="url(#a-skin)"
        d="M 80,248 C 64,268 54,292 50,318
          C 46,344 50,366 62,384
          C 74,402 88,402 100,390
          L 106,384
          C 92,366 86,346 86,326
          C 86,296 92,270 102,252 Z"
      />
      <path
        fill="url(#a-kurta)"
        opacity="0.97"
        d="M 76,230 C 66,240 58,258 54,282 L 48,308
          C 64,298 80,284 96,266 Z"
      />

      <ellipse cx="106" cy="388" rx="9.2" ry="7.2" fill="url(#a-skin)" opacity="0.98" />

      <path
        fill="url(#a-skin)"
        d="M 180,248 C 196,268 206,292 210,318
          C 214,344 210,366 198,384
          C 186,402 172,402 160,390
          L 154,384
          C 168,366 174,346 174,326
          C 174,296 168,270 158,252 Z"
      />
      <path
        fill="url(#a-kurta)"
        opacity="0.97"
        d="M 184,230 C 194,240 202,258 206,282 L 212,308
          C 196,298 180,284 164,266 Z"
      />

      <ellipse cx="154" cy="388" rx="9.2" ry="7.2" fill="url(#a-skin)" opacity="0.98" />

      {/* Neck */}
      <path
        fill="url(#a-skin)"
        d="M 112,182 C 110,198 108,216 108,234 L 152,234 C 152,216 150,198 148,182 Z"
      />

      <path
        d="M 130,186 C 124,206 124,220 130,234 C 136,220 136,206 130,186 Z"
        fill="#000000"
        opacity="0.04"
      />

      <path
        d="M 108,208 C 118,224 142,224 152,208"
        fill="none"
        stroke="#D8DDE7"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 112,210 C 120,222 140,222 148,210"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.22"
      />

      <g transform="rotate(-2 130 190)">
        {/* Head */}
        <path
          fill="url(#a-skin-face)"
          d="
            M 82,112
            C 82,62 106,34 130,34
            C 154,34 178,62 178,112
            C 178,154 164,182 146,198
            C 140,204 135,208 130,208
            C 125,208 120,204 114,198
            C 96,182 82,154 82,112
            Z
          "
        />
        <ellipse cx="98" cy="126" rx="15" ry="36" fill="#000000" opacity="0.05" />
        <ellipse cx="162" cy="126" rx="15" ry="36" fill="#000000" opacity="0.05" />
        <ellipse cx="130" cy="78" rx="28" ry="16" fill="#FFFFFF" opacity="0.12" />
        <ellipse cx="130" cy="176" rx="24" ry="10" fill="#000000" opacity="0.06" />
        <path
          d="M 100,176 C 110,194 120,200 130,200 C 140,200 150,194 160,176"
          fill="none"
          stroke="#000000"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.04"
        />

        {/* Cheeks + warmth */}
        <ellipse cx="96" cy="132" rx="22" ry="13" fill="url(#a-blush)" opacity="0.55" />
        <ellipse cx="164" cy="132" rx="22" ry="13" fill="url(#a-blush)" opacity="0.55" />

        {/* Hair (layered, textured) */}
        <path
          fill="url(#a-hair)"
          d="
            M 84,80
            C 80,48 102,28 130,28
            C 158,28 180,48 176,80
            C 170,76 154,76 142,78
            C 134,80 132,86 130,88
            C 128,86 126,80 118,78
            C 106,76 90,76 84,80
            Z
          "
        />

        <path
          fill="url(#a-hair)"
          opacity="0.97"
          d="
            M 88,84
            C 74,100 72,124 78,148
            C 84,172 104,184 122,186
            C 108,170 104,150 108,132
            C 112,112 120,96 132,84
            C 118,82 104,82 88,84
            Z
          "
        />
        <path
          fill="url(#a-hair)"
          opacity="0.97"
          d="
            M 172,84
            C 186,100 188,124 182,148
            C 176,172 156,184 138,186
            C 152,170 156,150 152,132
            C 148,112 140,96 128,84
            C 142,82 156,82 172,84
            Z
          "
        />

        {/* Fringe */}
        <path
          fill="url(#a-hair-shine)"
          opacity="0.92"
          d="
            M 94,84
            C 110,64 134,60 154,70
            C 168,78 176,92 176,110
            C 162,96 146,94 132,102
            C 122,108 114,118 112,132
            C 108,114 102,98 94,84
            Z
          "
        />
        <path
          d="M 112,86 C 120,92 124,104 122,118"
          fill="none"
          stroke="#4A3C34"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M 124,84 C 132,90 138,102 136,118"
          fill="none"
          stroke="#4A3C34"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M 138,86 C 146,94 150,104 148,118"
          fill="none"
          stroke="#4A3C34"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Brows (slight asymmetry) */}
        <path
          d="M 88,98 C 100,90 112,88 124,92"
          fill="none"
          stroke="#1A1410"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.92"
        />
        <path
          d="M 136,92 C 148,88 160,90 172,98"
          fill="none"
          stroke="#1A1410"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Eyes */}
        <ellipse cx="106" cy="116" rx="21" ry="14" fill="#FFF9F2" />
        <ellipse cx="104.7" cy="116" rx="14" ry="14" fill="url(#a-iris)" clipPath="url(#a-lec)" />
        <ellipse cx="104.7" cy="116" rx="7" ry="7" fill="#03010E" clipPath="url(#a-lec)" />
        <ellipse cx="110" cy="110" rx="4.8" ry="4.4" fill="white" opacity="0.95" />
        <ellipse cx="99" cy="121" rx="2.2" ry="2" fill="white" opacity="0.55" />
        <circle cx="113.2" cy="124" r="1.1" fill="white" opacity="0.45" clipPath="url(#a-lec)" />
        <ellipse
          cx="104.7"
          cy="116"
          rx="10.8"
          ry="10.8"
          fill="none"
          stroke="#4A2D16"
          strokeWidth="1.15"
          opacity="0.36"
          clipPath="url(#a-lec)"
        />
        {blink ? (
          <path
            d="M 86,116 C 96,112 101,111 106,111 C 111,111 116,112 126,116"
            fill="none"
            stroke="#07051A"
            strokeWidth="11"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 84,112 C 92,102 100,98 106,98 C 112,98 120,102 128,112
               C 120,108 112,107 106,108 C 100,107 92,108 84,112 Z"
            fill="#07051A"
            opacity="0.92"
          />
        )}
        <path
          d="M 88,122 C 98,130 106,131 124,122"
          fill="none"
          stroke="#07051A"
          strokeWidth="1.5"
          opacity="0.22"
          strokeLinecap="round"
        />
        <path
          d="M 88,123 C 98,131 106,132 124,123"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="2"
          opacity="0.22"
          strokeLinecap="round"
        />
        <path
          d="M 82,113 L 78,110"
          fill="none"
          stroke="#07051A"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.34"
        />
        <ellipse cx="90" cy="117" rx="3.2" ry="2.1" fill="#FFAAAA" opacity="0.22" />

        <ellipse cx="154" cy="116" rx="21" ry="14" fill="#FFF9F2" />
        <ellipse cx="152.7" cy="116" rx="14" ry="14" fill="url(#a-iris)" clipPath="url(#a-rec)" />
        <ellipse cx="152.7" cy="116" rx="7" ry="7" fill="#03010E" clipPath="url(#a-rec)" />
        <ellipse cx="158.2" cy="110" rx="4.8" ry="4.4" fill="white" opacity="0.95" />
        <ellipse cx="146.2" cy="121" rx="2.2" ry="2" fill="white" opacity="0.55" />
        <circle cx="161.2" cy="124" r="1.1" fill="white" opacity="0.45" clipPath="url(#a-rec)" />
        <ellipse
          cx="152.7"
          cy="116"
          rx="10.8"
          ry="10.8"
          fill="none"
          stroke="#4A2D16"
          strokeWidth="1.15"
          opacity="0.36"
          clipPath="url(#a-rec)"
        />
        {blink ? (
          <path
            d="M 134,116 C 144,112 149,111 154,111 C 159,111 164,112 174,116"
            fill="none"
            stroke="#07051A"
            strokeWidth="11"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 132,112 C 140,102 148,98 154,98 C 160,98 168,102 176,112
               C 168,108 160,107 154,108 C 148,107 140,108 132,112 Z"
            fill="#07051A"
            opacity="0.92"
          />
        )}
        <path
          d="M 136,122 C 146,130 154,131 172,122"
          fill="none"
          stroke="#07051A"
          strokeWidth="1.5"
          opacity="0.22"
          strokeLinecap="round"
        />
        <path
          d="M 136,123 C 146,131 154,132 172,123"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="2"
          opacity="0.22"
          strokeLinecap="round"
        />
        <path
          d="M 178,113 L 182,110"
          fill="none"
          stroke="#07051A"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.34"
        />
        <ellipse cx="170" cy="117" rx="3.2" ry="2.1" fill="#FFAAAA" opacity="0.22" />

        {/* Nose */}
        <path
          d="M 126,138 C 124,146 124,152 126,156 C 128,158 132,158 134,156 C 136,152 136,146 134,138"
          fill="none"
          stroke="#B8744D"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.46"
        />
        <ellipse cx="126.5" cy="156" rx="4.1" ry="2.1" fill="#8F5536" opacity="0.16" />
        <ellipse cx="133.5" cy="156" rx="4.1" ry="2.1" fill="#8F5536" opacity="0.16" />
        <circle cx="136.8" cy="155.6" r="1.05" fill="#D8DDE7" opacity="0.55" />

        {/* Lips (soft, slightly melancholic) */}
        <path
          d="M 114,182 C 118,174 123,172 128,174
             C 130,171 132,171 132,174
             C 137,172 142,174 146,182
             C 142,178 137,176 132,177
             C 130,175 130,175 128,177
             C 123,176 118,178 114,182 Z"
          fill="#7A3B33"
          opacity="0.88"
        />
        <path
          d="M 114,182 C 118,188 122,192 128,193
             C 131,193 133,192 136,191
             C 141,189 144,185 146,182
             C 142,186 138,189 130,189
             C 122,189 118,186 114,182 Z"
          fill="#9A4B49"
          opacity="0.85"
        />
        <ellipse cx="130" cy="188" rx="9" ry="3.2" fill="#F2A0A6" opacity="0.16" />
        <path
          d="M 123,184 C 126,182 130,181.5 137,184"
          fill="none"
          stroke="rgba(255, 226, 232, 0.35)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
