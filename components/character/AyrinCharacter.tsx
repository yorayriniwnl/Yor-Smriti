'use client';

import { useEffect, useRef, useState } from 'react';

export function AyrinCharacter() {
  const [blink, setBlink] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleBlink = () => {
      closeTimer.current = setTimeout(() => {
        setBlink(true);
        openTimer.current = setTimeout(() => {
          setBlink(false);
          scheduleBlink();
        }, 150);
      }, 2400 + Math.random() * 3400);
    };

    scheduleBlink();

    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
      if (openTimer.current) {
        clearTimeout(openTimer.current);
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
      <style>{`
        .ayrin-breath {
          transform-origin: 130px 502px;
          animation: ayrin-breath 6s ease-in-out infinite;
        }

        .ayrin-head {
          transform-origin: 130px 168px;
          animation: ayrin-head 6.4s ease-in-out infinite;
        }

        .ayrin-mouth {
          transform-origin: 130px 184px;
          animation: ayrin-mouth 6s ease-in-out infinite;
        }

        .ayrin-fringe {
          transform-origin: 130px 90px;
          animation: ayrin-fringe 7.2s ease-in-out infinite;
        }

        @keyframes ayrin-breath {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
          }
          50% {
            transform: translateY(-2px) scaleY(1.012);
          }
        }

        @keyframes ayrin-head {
          0%, 100% {
            transform: rotate(-3.8deg) translateY(0px);
          }
          50% {
            transform: rotate(-5deg) translateY(-1px);
          }
        }

        @keyframes ayrin-mouth {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
          }
          50% {
            transform: translateY(0.7px) scaleY(1.06);
          }
        }

        @keyframes ayrin-fringe {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          50% {
            transform: rotate(-0.8deg) translateY(0.8px);
          }
        }
      `}</style>

      <defs>
        <radialGradient id="a-ambient-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4A8C3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F4A8C3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a-ambient-cool" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#8C73E9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8C73E9" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="a-skin-body" cx="48%" cy="26%" r="76%">
          <stop offset="0%" stopColor="#E8B88E" />
          <stop offset="55%" stopColor="#C68458" />
          <stop offset="100%" stopColor="#8D5738" />
        </radialGradient>
        <radialGradient id="a-skin-face" cx="48%" cy="22%" r="74%">
          <stop offset="0%" stopColor="#E9BC92" />
          <stop offset="48%" stopColor="#CC8D63" />
          <stop offset="100%" stopColor="#985B38" />
        </radialGradient>
        <linearGradient id="a-neck-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>

        <linearGradient id="a-hair" x1="16%" y1="0%" x2="84%" y2="100%">
          <stop offset="0%" stopColor="#31261F" />
          <stop offset="40%" stopColor="#16100D" />
          <stop offset="100%" stopColor="#070506" />
        </linearGradient>
        <linearGradient id="a-hair-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B473B" stopOpacity="0.62" />
          <stop offset="38%" stopColor="#7A5A47" stopOpacity="0.36" />
          <stop offset="72%" stopColor="#2E231D" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#080607" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="a-kurta" x1="15%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#FBF5EB" />
          <stop offset="55%" stopColor="#F1E4D2" />
          <stop offset="100%" stopColor="#DFCAB1" />
        </linearGradient>
        <linearGradient id="a-kurta-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id="a-kurta-rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE8F4" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="a-trouser" x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#27222E" />
          <stop offset="50%" stopColor="#16121E" />
          <stop offset="100%" stopColor="#09070F" />
        </linearGradient>
        <linearGradient id="a-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6E7EC" />
          <stop offset="100%" stopColor="#BFC3CF" />
        </linearGradient>
        <linearGradient id="a-chain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF6E5" />
          <stop offset="50%" stopColor="#D7C3A2" />
          <stop offset="100%" stopColor="#A98B66" />
        </linearGradient>

        <radialGradient id="a-iris" cx="38%" cy="28%" r="64%">
          <stop offset="0%" stopColor="#AA7141" />
          <stop offset="28%" stopColor="#7B4B25" />
          <stop offset="72%" stopColor="#2B170B" />
          <stop offset="100%" stopColor="#090403" />
        </radialGradient>
        <linearGradient id="a-eye-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#C1D9FF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="a-lip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5148" />
          <stop offset="100%" stopColor="#72423D" />
        </linearGradient>
        <radialGradient id="a-lip-gloss" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#F7BAC0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F7BAC0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF92AC" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FF92AC" stopOpacity="0" />
        </radialGradient>

        <clipPath id="a-left-eye-clip" clipPathUnits="userSpaceOnUse">
          <path d="M 82,114 C 90,101 99,95 106,95 C 113,95 122,101 130,114 C 122,125 113,129 106,129 C 99,129 90,125 82,114 Z" />
        </clipPath>
        <clipPath id="a-right-eye-clip" clipPathUnits="userSpaceOnUse">
          <path d="M 130,114 C 138,101 147,95 154,95 C 161,95 170,101 178,114 C 170,125 161,129 154,129 C 147,129 138,125 130,114 Z" />
        </clipPath>
      </defs>

      <ellipse cx="130" cy="714" rx="66" ry="8" fill="rgba(0,0,0,0.16)" />
      <ellipse cx="96" cy="286" rx="58" ry="180" fill="url(#a-ambient-warm)" opacity="0.24" />
      <ellipse cx="174" cy="252" rx="52" ry="154" fill="url(#a-ambient-cool)" opacity="0.16" />
      <ellipse cx="132" cy="454" rx="82" ry="124" fill="#FFFFFF" opacity="0.035" />

      <g className="ayrin-breath">
        <path
          fill="url(#a-trouser)"
          d="
            M 98,506
            C 86,570 84,632 92,694
            C 99,708 120,708 127,694
            C 135,632 136,570 128,506
            Z
          "
        />
        <path
          fill="url(#a-trouser)"
          d="
            M 132,506
            C 124,570 125,632 133,694
            C 140,708 161,708 168,694
            C 176,632 174,570 162,506
            Z
          "
        />
        <path
          d="M 110,508 C 106,572 106,636 112,699"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d="M 150,508 C 154,572 154,636 148,699"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.54"
        />

        <ellipse cx="108" cy="706" rx="22" ry="10" fill="url(#a-shoe)" />
        <ellipse cx="153" cy="706" rx="22" ry="10" fill="url(#a-shoe)" />
        <path
          d="M 90,705 C 101,698 116,698 127,705"
          fill="none"
          stroke="#C6CAD4"
          strokeWidth="1.9"
          opacity="0.7"
        />
        <path
          d="M 136,705 C 147,698 162,698 173,705"
          fill="none"
          stroke="#C6CAD4"
          strokeWidth="1.9"
          opacity="0.7"
        />

        <path
          fill="url(#a-kurta)"
          d="
            M 70,226
            C 59,244 54,280 54,332
            L 54,444
            C 54,486 79,518 115,524
            L 145,524
            C 181,518 206,486 206,444
            L 206,332
            C 206,280 201,244 190,226
            C 172,212 151,206 130,206
            C 109,206 88,212 70,226
            Z
          "
        />
        <path
          fill="url(#a-kurta-shadow)"
          opacity="0.24"
          d="
            M 188,226
            C 201,244 206,280 206,332
            L 206,444
            C 206,486 181,518 145,524
            L 136,524
            C 143,486 146,430 145,360
            C 144,290 140,244 135,206
            C 155,207 173,213 188,226
            Z
          "
        />
        <path
          d="M 76,232 C 66,252 61,286 61,334 L 61,441 C 61,478 84,506 112,511"
          fill="none"
          stroke="url(#a-kurta-rim)"
          strokeWidth="2.3"
          strokeLinecap="round"
          opacity="0.42"
        />
        <path
          d="M 94,262 C 88,324 88,392 94,456"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.06"
        />
        <path
          d="M 166,262 C 172,324 172,392 166,456"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.06"
        />

        <path
          d="M 112,224 C 119,235 124,248 130,270 C 136,248 141,235 148,224"
          fill="none"
          stroke="rgba(95,72,52,0.42)"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
        <path
          d="M 118,228 C 123,236 126,242 129,248"
          fill="none"
          stroke="#C8AA7D"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1.6 5"
          opacity="0.92"
        />
        <path
          d="M 142,228 C 137,236 134,242 131,248"
          fill="none"
          stroke="#C8AA7D"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1.6 5"
          opacity="0.92"
        />
        <path
          d="M 130,266 L 130,510"
          fill="none"
          stroke="rgba(72,50,38,0.18)"
          strokeWidth="2.1"
          opacity="0.55"
        />
        {[302, 330, 358, 386].map((y) => (
          <circle key={y} cx={130} cy={y} r={2.25} fill="rgba(66,48,39,0.2)" opacity={0.86} />
        ))}
        <path
          d="M 104,252 C 116,264 123,268 130,270"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d="M 156,252 C 144,264 137,268 130,270"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d="M 84,492 C 98,500 115,503 130,503 C 145,503 162,500 176,492"
          fill="none"
          stroke="rgba(108,84,65,0.18)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          fill="url(#a-skin-body)"
          d="
            M 82,248
            C 62,270 51,304 51,346
            C 51,384 63,418 81,445
            C 88,455 99,457 108,449
            L 113,444
            C 98,416 92,389 92,358
            C 92,324 96,293 104,262
            Z
          "
        />
        <path
          fill="url(#a-kurta)"
          opacity="0.98"
          d="
            M 70,226
            C 57,238 47,257 42,283
            L 36,318
            C 53,306 70,290 86,272
            Z
          "
        />
        <path
          d="M 63,274 C 58,312 62,350 74,385"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          fill="url(#a-skin-body)"
          d="
            M 81,438
            C 74,442 71,449 72,457
            C 75,467 86,471 95,469
            C 103,467 108,460 107,452
            C 106,443 93,436 81,438
            Z
          "
        />
        <path
          d="M 83,444 C 86,451 86,458 84,464"
          fill="none"
          stroke="rgba(108,65,43,0.24)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 90,443 C 92,450 92,457 91,462"
          fill="none"
          stroke="rgba(108,65,43,0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          fill="url(#a-skin-body)"
          d="
            M 178,248
            C 198,270 209,304 209,346
            C 209,384 197,418 179,445
            C 172,455 161,457 152,449
            L 147,444
            C 162,416 168,389 168,358
            C 168,324 164,293 156,262
            Z
          "
        />
        <path
          fill="url(#a-kurta)"
          opacity="0.98"
          d="
            M 190,226
            C 203,238 213,257 218,283
            L 224,318
            C 207,306 190,290 174,272
            Z
          "
        />
        <path
          d="M 197,274 C 202,312 198,350 186,385"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          fill="url(#a-skin-body)"
          d="
            M 179,438
            C 186,442 189,449 188,457
            C 185,467 174,471 165,469
            C 157,467 152,460 153,452
            C 154,443 167,436 179,438
            Z
          "
        />
        <path
          d="M 177,444 C 174,451 174,458 176,464"
          fill="none"
          stroke="rgba(108,65,43,0.24)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 170,443 C 168,450 168,457 169,462"
          fill="none"
          stroke="rgba(108,65,43,0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          fill="url(#a-skin-body)"
          d="M 112,184 C 110,199 108,218 108,238 L 152,238 C 152,218 150,199 148,184 Z"
        />
        <path
          fill="url(#a-neck-shadow)"
          opacity="0.7"
          d="M 116,184 C 116,204 117,220 120,238 L 140,238 C 143,220 144,204 144,184 Z"
        />
        <path
          d="M 107,209 C 117,225 143,225 153,209"
          fill="none"
          stroke="url(#a-chain)"
          strokeWidth="2.25"
          strokeLinecap="round"
          opacity="0.92"
        />
        <path
          d="M 112,224 C 118,218 124,215 130,215 C 136,215 142,218 148,224"
          fill="none"
          stroke="rgba(113,80,58,0.22)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 108,226 C 118,222 124,220 130,220 C 136,220 142,222 152,226"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <g className="ayrin-head">
          <path
            fill="url(#a-hair)"
            d="
              M 92,84
              C 90,58 108,39 130,37
              C 152,39 170,58 168,84
              C 160,79 150,76 141,77
              C 135,78 131,82 129,86
              C 127,82 123,78 117,77
              C 108,76 98,79 92,84
              Z
            "
          />
          <path
            fill="url(#a-hair)"
            opacity="0.92"
            d="
              M 93,96
              C 86,108 85,123 89,137
              C 92,148 97,156 104,160
              C 100,146 100,133 104,121
              C 107,112 112,104 118,99
              C 109,96 101,95 93,96
              Z
            "
          />
          <path
            fill="url(#a-hair)"
            opacity="0.92"
            d="
              M 167,96
              C 174,108 175,123 171,137
              C 168,148 163,156 156,160
              C 160,146 160,133 156,121
              C 153,112 148,104 142,99
              C 151,96 159,95 167,96
              Z
            "
          />
          <path
            fill="url(#a-hair-shine)"
            opacity="0.52"
            d="
              M 106,50
              C 117,44 130,43 144,47
              C 137,52 131,54 124,54
              C 116,54 110,53 106,50
              Z
            "
          />

          <path
            fill="url(#a-skin-face)"
            d="
              M 84,112
              C 84,64 107,38 130,36
              C 153,38 176,64 176,112
              C 176,148 166,180 148,202
              C 142,209 136,214 130,214
              C 124,214 118,209 112,202
              C 94,180 84,148 84,112
              Z
            "
          />
          <ellipse cx="98" cy="128" rx="17" ry="35" fill="#000000" opacity="0.05" />
          <ellipse cx="162" cy="128" rx="17" ry="35" fill="#000000" opacity="0.05" />
          <ellipse cx="128" cy="74" rx="31" ry="18" fill="#FFFFFF" opacity="0.14" />
          <ellipse cx="130" cy="194" rx="24" ry="9" fill="#000000" opacity="0.08" />
          <ellipse cx="96" cy="132" rx="22" ry="13" fill="url(#a-blush)" opacity="0.45" />
          <ellipse cx="164" cy="132" rx="22" ry="13" fill="url(#a-blush)" opacity="0.45" />
          <path
            d="M 99,175 C 109,194 120,201 130,201 C 140,201 151,194 161,175"
            fill="none"
            stroke="#000000"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.035"
          />

          <g className="ayrin-fringe">
            <path
              fill="url(#a-hair)"
              d="
                M 101,82
                C 108,88 112,97 111,108
                C 106,103 100,100 94,98
                C 96,91 98,86 101,82
                Z
              "
            />
            <path
              fill="url(#a-hair)"
              opacity="0.98"
              d="
                M 121,78
                C 128,86 131,96 129,109
                C 125,103 121,99 116,95
                C 117,88 119,82 121,78
                Z
              "
            />
            <path
              fill="url(#a-hair)"
              d="
                M 139,81
                C 146,88 149,98 147,109
                C 143,103 138,99 132,96
                C 134,89 136,84 139,81
                Z
              "
            />
            <path
              fill="url(#a-hair-shine)"
              opacity="0.38"
              d="
                M 108,82
                C 114,88 116,96 115,105
                C 111,100 106,97 101,95
                C 103,89 105,85 108,82
                Z
              "
            />
            <path
              fill="url(#a-hair-shine)"
              opacity="0.34"
              d="
                M 126,79
                C 131,86 133,94 132,104
                C 128,99 124,95 120,92
                C 121,87 123,82 126,79
                Z
              "
            />
            <path
              fill="url(#a-hair-shine)"
              opacity="0.3"
              d="
                M 142,82
                C 147,89 149,97 148,105
                C 144,100 140,96 135,93
                C 137,88 139,84 142,82
                Z
              "
            />
            <path
              d="M 109,82 C 113,89 114,97 113,106"
              fill="none"
              stroke="#6E5344"
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.26"
            />
            <path
              d="M 126,79 C 130,86 131,94 130,105"
              fill="none"
              stroke="#6E5344"
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.24"
            />
            <path
              d="M 143,82 C 147,89 148,97 147,106"
              fill="none"
              stroke="#6E5344"
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.22"
            />
          </g>

          <path
            d="M 89,94 C 100,87 112,86 123,90"
            fill="none"
            stroke="#17110E"
            strokeWidth="4.8"
            strokeLinecap="round"
            opacity="0.92"
          />
          <path
            d="M 138,90 C 149,86 161,88 171,95"
            fill="none"
            stroke="#17110E"
            strokeWidth="4.8"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M 82,114 C 90,101 99,95 106,95 C 113,95 122,101 130,114 C 122,125 113,129 106,129 C 99,129 90,125 82,114 Z"
            fill="#FFF8F1"
          />
          <ellipse
            cx="104.8"
            cy="115.4"
            rx="14.8"
            ry="14.4"
            fill="url(#a-iris)"
            clipPath="url(#a-left-eye-clip)"
          />
          <ellipse
            cx="104.8"
            cy="115.4"
            rx="7.1"
            ry="7.1"
            fill="#05020D"
            clipPath="url(#a-left-eye-clip)"
          />
          <ellipse cx="109.4" cy="109.2" rx="4.8" ry="4.5" fill="#FFFFFF" opacity="0.97" />
          <ellipse cx="99.2" cy="120.5" rx="2.2" ry="2" fill="#FFFFFF" opacity="0.62" />
          <circle cx="112.4" cy="118.2" r="1.1" fill="#FFFFFF" opacity="0.48" clipPath="url(#a-left-eye-clip)" />
          <ellipse
            cx="104.8"
            cy="115.4"
            rx="11.2"
            ry="11"
            fill="none"
            stroke="#4B2F19"
            strokeWidth="1.1"
            opacity="0.34"
            clipPath="url(#a-left-eye-clip)"
          />
          {blink ? (
            <path
              d="M 84,115 C 95,111 100,110 106,110 C 112,110 117,111 128,115"
              fill="none"
              stroke="#090610"
              strokeWidth="10.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 82,112 C 90,101 99,96 106,96 C 113,96 122,101 130,112
                 C 121,108 113,106 106,107 C 99,106 91,108 82,112 Z"
              fill="#090610"
              opacity="0.9"
            />
          )}
          <path
            d="M 86,122 C 96,130 106,131 124,122"
            fill="none"
            stroke="#090610"
            strokeWidth="1.45"
            opacity="0.2"
            strokeLinecap="round"
          />
          <path
            d="M 86,123 C 96,131 106,132 124,123"
            fill="none"
            stroke="url(#a-eye-water)"
            strokeWidth="2.2"
            opacity="0.32"
            strokeLinecap="round"
          />
          <path
            d="M 81,113 L 77,110"
            fill="none"
            stroke="#090610"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.35"
          />
          <ellipse cx="90" cy="117" rx="3.1" ry="2" fill="#FFB0B8" opacity="0.16" />

          <path
            d="M 130,114 C 138,101 147,95 154,95 C 161,95 170,101 178,114 C 170,125 161,129 154,129 C 147,129 138,125 130,114 Z"
            fill="#FFF8F1"
          />
          <ellipse
            cx="153.2"
            cy="115.4"
            rx="14.8"
            ry="14.4"
            fill="url(#a-iris)"
            clipPath="url(#a-right-eye-clip)"
          />
          <ellipse
            cx="153.2"
            cy="115.4"
            rx="7.1"
            ry="7.1"
            fill="#05020D"
            clipPath="url(#a-right-eye-clip)"
          />
          <ellipse cx="157.8" cy="109.2" rx="4.8" ry="4.5" fill="#FFFFFF" opacity="0.97" />
          <ellipse cx="147.6" cy="120.5" rx="2.2" ry="2" fill="#FFFFFF" opacity="0.62" />
          <circle cx="160.6" cy="118.2" r="1.1" fill="#FFFFFF" opacity="0.48" clipPath="url(#a-right-eye-clip)" />
          <ellipse
            cx="153.2"
            cy="115.4"
            rx="11.2"
            ry="11"
            fill="none"
            stroke="#4B2F19"
            strokeWidth="1.1"
            opacity="0.34"
            clipPath="url(#a-right-eye-clip)"
          />
          {blink ? (
            <path
              d="M 132,115 C 143,111 148,110 154,110 C 160,110 165,111 176,115"
              fill="none"
              stroke="#090610"
              strokeWidth="10.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 130,112 C 138,101 147,96 154,96 C 161,96 170,101 178,112
                 C 169,108 161,106 154,107 C 147,106 139,108 130,112 Z"
              fill="#090610"
              opacity="0.9"
            />
          )}
          <path
            d="M 136,122 C 146,130 154,131 172,122"
            fill="none"
            stroke="#090610"
            strokeWidth="1.45"
            opacity="0.2"
            strokeLinecap="round"
          />
          <path
            d="M 136,123 C 146,131 154,132 172,123"
            fill="none"
            stroke="url(#a-eye-water)"
            strokeWidth="2.2"
            opacity="0.32"
            strokeLinecap="round"
          />
          <path
            d="M 179,113 L 183,110"
            fill="none"
            stroke="#090610"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.35"
          />
          <ellipse cx="170" cy="117" rx="3.1" ry="2" fill="#FFB0B8" opacity="0.16" />

          <path
            d="M 127,136 C 125,144 125,152 127,158 C 129,160 132,160 134,158 C 136,152 136,144 134,136"
            fill="none"
            stroke="#AA6A46"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.48"
          />
          <path
            d="M 130,136 C 131,144 131,150 130,156"
            fill="none"
            stroke="#F2C5A3"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.24"
          />
          <ellipse cx="126.6" cy="157.6" rx="4.2" ry="2.1" fill="#8C5539" opacity="0.18" />
          <ellipse cx="133.4" cy="157.6" rx="4.2" ry="2.1" fill="#8C5539" opacity="0.18" />
          <circle cx="136.3" cy="157" r="0.95" fill="#E4E7EF" opacity="0.48" />

          <g className="ayrin-mouth">
            <path
              d="
                M 113,181
                C 118,174 123,171 128,173
                C 130,170 132,170 132.8,173
                C 138,171 143,174 148,181
                C 143,177 138,176 132.5,177
                C 130,175.2 129,175.2 127.5,177
                C 122,176 117,177 113,181
                Z
              "
              fill="url(#a-lip)"
              opacity="0.92"
            />
            <path
              d="
                M 114,181
                C 118,187 123,191 128.5,192
                C 131.2,192 133.5,191.4 136.4,190.4
                C 141.6,188.6 145,185 147,181.4
                C 143,185.1 138.2,187.2 130.4,187.2
                C 122.6,187.2 118,185.2 114,181
                Z
              "
              fill="#A06059"
              opacity="0.86"
            />
            <path
              d="M 121.5,183.6 C 125,182.1 128.4,181.8 137.4,183.5"
              fill="none"
              stroke="rgba(255,229,233,0.36)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <ellipse cx="130.5" cy="188.1" rx="9.4" ry="3.1" fill="url(#a-lip-gloss)" opacity="0.25" />
            <path
              d="M 123,186.1 C 126.1,187.3 129.2,187.7 132.8,187.5"
              fill="none"
              stroke="#56302C"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.24"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
