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
      }, 2300 + Math.random() * 3400);
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
      <style>{`
        .ayrin-breath {
          transform-origin: 130px 490px;
          animation: ayrin-breath 5.8s ease-in-out infinite;
        }

        .ayrin-head {
          transform-origin: 130px 154px;
          animation: ayrin-head 6.8s ease-in-out infinite;
        }

        .ayrin-fringe {
          transform-origin: 130px 90px;
          animation: ayrin-fringe 6.4s ease-in-out infinite;
        }

        @keyframes ayrin-breath {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
          }
          50% {
            transform: translateY(-2px) scaleY(1.01);
          }
        }

        @keyframes ayrin-head {
          0%, 100% {
            transform: rotate(-2deg) translateY(0px);
          }
          50% {
            transform: rotate(-3deg) translateY(-1px);
          }
        }

        @keyframes ayrin-fringe {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          50% {
            transform: rotate(-0.9deg) translateY(0.8px);
          }
        }
      `}</style>

      <defs>
        <radialGradient id="ay-skin" cx="46%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#E6B88F" />
          <stop offset="62%" stopColor="#C48359" />
          <stop offset="100%" stopColor="#975833" />
        </radialGradient>
        <radialGradient id="ay-skin-face" cx="48%" cy="24%" r="72%">
          <stop offset="0%" stopColor="#E9BD94" />
          <stop offset="55%" stopColor="#C98A61" />
          <stop offset="100%" stopColor="#955733" />
        </radialGradient>
        <linearGradient id="ay-hair" x1="20%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#2E231C" />
          <stop offset="50%" stopColor="#17110D" />
          <stop offset="100%" stopColor="#070505" />
        </linearGradient>
        <linearGradient id="ay-hair-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F3B32" stopOpacity="0.82" />
          <stop offset="38%" stopColor="#6A4D40" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#0A0808" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ay-kurta" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#F9F2E6" />
          <stop offset="50%" stopColor="#ECDDCA" />
          <stop offset="100%" stopColor="#D6C0A4" />
        </linearGradient>
        <linearGradient id="ay-kurta-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id="ay-trouser" x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#26232E" />
          <stop offset="52%" stopColor="#14121B" />
          <stop offset="100%" stopColor="#08070D" />
        </linearGradient>
        <linearGradient id="ay-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E7E9EE" />
          <stop offset="100%" stopColor="#B9BDC8" />
        </linearGradient>
        <linearGradient id="ay-chain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7E7" />
          <stop offset="50%" stopColor="#D8C2A1" />
          <stop offset="100%" stopColor="#AA8A62" />
        </linearGradient>
        <radialGradient id="ay-iris" cx="36%" cy="28%" r="64%">
          <stop offset="0%" stopColor="#8C5E36" />
          <stop offset="48%" stopColor="#4A2A13" />
          <stop offset="100%" stopColor="#090403" />
        </radialGradient>
        <radialGradient id="ay-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F17C88" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F17C88" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ay-eye-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.56" />
          <stop offset="100%" stopColor="#C8D6FF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="ay-lip-up" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A5650" />
          <stop offset="100%" stopColor="#6C403C" />
        </linearGradient>
        <linearGradient id="ay-lip-low" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A46B66" />
          <stop offset="100%" stopColor="#7C4E48" />
        </linearGradient>
        <radialGradient id="ay-lip-gloss" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#F0B7BD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F0B7BD" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ay-ambient-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5A7C5" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#F5A7C5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ay-ambient-cool" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#8E74E8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8E74E8" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ay-left-eye-clip">
          <ellipse cx="102" cy="111" rx="22" ry="14" />
        </clipPath>
        <clipPath id="ay-right-eye-clip">
          <ellipse cx="158" cy="111" rx="22" ry="14" />
        </clipPath>
      </defs>

      <ellipse cx="130" cy="714" rx="60" ry="7" fill="rgba(0,0,0,0.14)" />
      <ellipse cx="84" cy="302" rx="52" ry="160" fill="url(#ay-ambient-warm)" opacity="0.18" />
      <ellipse cx="184" cy="278" rx="48" ry="142" fill="url(#ay-ambient-cool)" opacity="0.18" />

      <g className="ayrin-breath">
        <path
          fill="url(#ay-trouser)"
          d="
            M 96,504
            C 84,564 84,628 93,695
            C 100,708 120,708 126,695
            C 134,629 134,565 126,504
            Z
          "
        />
        <path
          fill="url(#ay-trouser)"
          d="
            M 134,504
            C 126,564 126,628 135,695
            C 142,708 162,708 168,695
            C 176,629 176,565 164,504
            Z
          "
        />
        <path
          d="M 110,508 C 106,574 106,636 112,699"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 150,508 C 154,574 154,636 148,699"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />

        <ellipse cx="108" cy="706" rx="21" ry="9.5" fill="url(#ay-shoe)" />
        <ellipse cx="152" cy="706" rx="21" ry="9.5" fill="url(#ay-shoe)" />
        <path
          d="M 91,705 C 104,699 114,699 127,705"
          fill="none"
          stroke="#C7CBD4"
          strokeWidth="1.7"
          opacity="0.72"
        />
        <path
          d="M 133,705 C 146,699 156,699 169,705"
          fill="none"
          stroke="#C7CBD4"
          strokeWidth="1.7"
          opacity="0.72"
        />

        <path
          fill="url(#ay-kurta)"
          d="
            M 66,222
            C 54,236 50,270 50,326
            L 50,438
            C 50,482 76,514 114,520
            L 146,520
            C 184,514 210,482 210,438
            L 210,326
            C 210,270 206,236 194,222
            C 176,209 154,203 130,203
            C 106,203 84,209 66,222
            Z
          "
        />
        <path
          fill="url(#ay-kurta-shadow)"
          d="
            M 194,222
            C 206,236 210,270 210,326
            L 210,438
            C 210,482 184,514 146,520
            L 138,520
            C 145,482 148,426 147,356
            C 146,290 142,240 136,206
            C 159,207 178,213 194,222
            Z
          "
          opacity="0.26"
        />
        <path
          d="M 84,222 C 100,216 115,213 130,213 C 145,213 160,216 176,222"
          fill="none"
          stroke="rgba(196,161,113,0.8)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {[96, 108, 120, 132, 144, 156, 168].map((x, i) => (
          <circle key={`stitch-${i}`} cx={x} cy={227} r="2" fill="#C5A36A" opacity="0.8" />
        ))}
        <path
          d="M 112,222 C 118,231 123,242 130,260 C 137,242 142,231 148,222"
          fill="none"
          stroke="rgba(93,70,53,0.4)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 130,260 L 130,508"
          fill="none"
          stroke="rgba(67,49,39,0.18)"
          strokeWidth="2"
          opacity="0.7"
        />
        {[294, 322, 350, 378].map((y) => (
          <circle key={y} cx={130} cy={y} r="2.2" fill="rgba(67,49,39,0.18)" opacity="0.9" />
        ))}
        <path
          d="M 102,250 C 114,260 121,264 130,266"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 158,250 C 146,260 139,264 130,266"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />

        <path
          fill="url(#ay-skin)"
          d="M 78,246 C 58,264 48,294 46,330 C 44,366 54,398 72,424 C 82,436 94,437 104,427 L 109,422 C 96,398 90,374 90,346 C 90,312 95,284 102,258 Z"
        />
        <path
          fill="url(#ay-kurta)"
          d="M 66,222 C 52,232 42,248 36,270 L 30,298 C 46,288 64,274 82,256 Z"
          opacity="0.96"
        />
        <path
          fill="url(#ay-skin)"
          d="M 79,418 C 72,422 69,429 70,437 C 72,447 83,451 92,450 C 101,448 107,441 107,433 C 107,424 92,416 79,418 Z"
        />

        <path
          fill="url(#ay-skin)"
          d="M 182,246 C 202,264 212,294 214,330 C 216,366 206,398 188,424 C 178,436 166,437 156,427 L 151,422 C 164,398 170,374 170,346 C 170,312 165,284 158,258 Z"
        />
        <path
          fill="url(#ay-kurta)"
          d="M 194,222 C 208,232 218,248 224,270 L 230,298 C 214,288 196,274 178,256 Z"
          opacity="0.96"
        />
        <path
          fill="url(#ay-skin)"
          d="M 181,418 C 188,422 191,429 190,437 C 188,447 177,451 168,450 C 159,448 153,441 153,433 C 153,424 168,416 181,418 Z"
        />

        <path fill="url(#ay-skin)" d="M 112,178 C 110,191 108,208 108,224 L 152,224 C 152,208 150,191 148,178 Z" />
        <path d="M 109,206 C 118,221 142,221 151,206" fill="none" stroke="url(#ay-chain)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <path d="M 112,214 C 118,224 142,224 148,214" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

        <g className="ayrin-head">
          <ellipse cx="81" cy="129" rx="11" ry="20" fill="url(#ay-skin)" />
          <ellipse cx="179" cy="129" rx="11" ry="20" fill="url(#ay-skin)" />
          <ellipse cx="80" cy="130" rx="7" ry="14" fill="rgba(255,120,102,0.08)" opacity="0.8" />
          <ellipse cx="180" cy="130" rx="7" ry="14" fill="rgba(255,120,102,0.08)" opacity="0.7" />

          <path
            fill="url(#ay-hair)"
            d="
              M 90,82
              C 88,52 107,28 130,26
              C 153,28 172,52 170,82
              C 162,75 150,71 140,72
              C 134,73 130,77 127,81
              C 124,77 120,73 112,72
              C 102,71 94,75 90,82
              Z
            "
          />
          <path
            fill="url(#ay-hair)"
            d="
              M 92,94
              C 84,108 84,126 88,142
              C 91,154 97,162 105,166
              C 100,152 100,138 104,125
              C 107,113 113,103 120,98
              C 111,95 101,94 92,94
              Z
            "
            opacity="0.92"
          />
          <path
            fill="url(#ay-hair)"
            d="
              M 168,94
              C 176,108 176,126 172,142
              C 169,154 163,162 155,166
              C 160,152 160,138 156,125
              C 153,113 147,103 140,98
              C 149,95 159,94 168,94
              Z
            "
            opacity="0.92"
          />

          <path
            fill="url(#ay-skin-face)"
            d="
              M 86,110
              C 86,62 108,38 130,36
              C 152,38 174,62 174,110
              C 174,148 165,183 148,206
              C 142,214 136,218 130,218
              C 124,218 118,214 112,206
              C 95,183 86,148 86,110
              Z
            "
          />
          <ellipse cx="97" cy="129" rx="18" ry="36" fill="#000000" opacity="0.045" />
          <ellipse cx="163" cy="129" rx="18" ry="36" fill="#000000" opacity="0.045" />
          <ellipse cx="128" cy="74" rx="31" ry="18" fill="#FFFFFF" opacity="0.15" />
          <ellipse cx="130" cy="195" rx="25" ry="10" fill="#000000" opacity="0.06" />
          <ellipse cx="97" cy="134" rx="19" ry="11" fill="url(#ay-blush)" opacity="0.45" />
          <ellipse cx="163" cy="134" rx="19" ry="11" fill="url(#ay-blush)" opacity="0.45" />
          <ellipse cx="130" cy="200" rx="30" ry="15" fill="rgba(0,0,0,0.04)" opacity="0.35" />

          <g className="ayrin-fringe">
            <path
              fill="url(#ay-hair)"
              d="
                M 100,82
                C 108,87 113,97 112,110
                C 107,103 101,100 95,98
                C 96,91 98,86 100,82
                Z
              "
            />
            <path
              fill="url(#ay-hair)"
              d="
                M 121,78
                C 129,86 132,97 130,112
                C 125,105 120,101 114,96
                C 116,88 118,82 121,78
                Z
              "
              opacity="0.98"
            />
            <path
              fill="url(#ay-hair)"
              d="
                M 142,82
                C 149,89 152,99 150,111
                C 145,105 140,101 134,97
                C 136,89 138,84 142,82
                Z
              "
            />
            <path fill="url(#ay-hair-shine)" d="M 107,82 C 113,88 115,97 114,106 C 110,100 105,97 100,95 C 102,89 104,84 107,82 Z" opacity="0.35" />
            <path fill="url(#ay-hair-shine)" d="M 126,79 C 132,86 134,95 133,106 C 128,100 124,96 119,92 C 121,87 123,82 126,79 Z" opacity="0.3" />
            <path fill="url(#ay-hair-shine)" d="M 144,82 C 149,89 151,97 150,106 C 145,101 141,97 136,93 C 138,88 140,84 144,82 Z" opacity="0.26" />
          </g>

          <path
            fill="none"
            stroke="#17110E"
            strokeWidth="4.8"
            strokeLinecap="round"
            d="M 84,94 C 94,87 107,85 120,90"
            opacity="0.92"
          />
          <path
            fill="none"
            stroke="#17110E"
            strokeWidth="4.8"
            strokeLinecap="round"
            d="M 140,90 C 153,85 166,87 176,94"
            opacity="0.9"
          />

          <ellipse cx="102" cy="111" rx="22" ry="15" fill="#FFFDF8" />
          <ellipse cx="102" cy="111" rx="15" ry="15" fill="url(#ay-iris)" clipPath="url(#ay-left-eye-clip)" />
          <ellipse cx="102" cy="111" rx="7.2" ry="7.2" fill="#04010E" clipPath="url(#ay-left-eye-clip)" />
          <ellipse cx="107" cy="104.5" rx="4.9" ry="4.5" fill="#FFFFFF" opacity="0.95" />
          <ellipse cx="96" cy="117" rx="2.1" ry="2" fill="#FFFFFF" opacity="0.62" />
          <circle cx="110.5" cy="114.5" r="1" fill="#FFFFFF" opacity="0.46" clipPath="url(#ay-left-eye-clip)" />
          <ellipse cx="102" cy="111" rx="11.2" ry="11.2" fill="none" stroke="#4A2D16" strokeWidth="1.15" opacity="0.34" clipPath="url(#ay-left-eye-clip)" />
          {blink ? (
            <path
              d="M 82,111 C 92,107 97,106 102,106 C 107,106 112,107 122,111"
              fill="none"
              stroke="#07051A"
              strokeWidth="11"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 80,108 C 87,99 95,95 102,95 C 109,95 117,99 124,108 C 117,105 109,104 102,105 C 95,104 87,105 80,108 Z"
              fill="#07051A"
              opacity="0.92"
            />
          )}
          <path d="M 82,117 C 92,125 102,126 121,117" fill="none" stroke="#07051A" strokeWidth="1.5" opacity="0.2" />
          <path d="M 82,118 C 92,126 102,127 121,118" fill="none" stroke="url(#ay-eye-water)" strokeWidth="2" opacity="0.26" strokeLinecap="round" />
          <path d="M 79,108 L 74,104" fill="none" stroke="#07051A" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />

          <ellipse cx="158" cy="111" rx="22" ry="15" fill="#FFFDF8" />
          <ellipse cx="158" cy="111" rx="15" ry="15" fill="url(#ay-iris)" clipPath="url(#ay-right-eye-clip)" />
          <ellipse cx="158" cy="111" rx="7.2" ry="7.2" fill="#04010E" clipPath="url(#ay-right-eye-clip)" />
          <ellipse cx="163" cy="104.5" rx="4.9" ry="4.5" fill="#FFFFFF" opacity="0.95" />
          <ellipse cx="152" cy="117" rx="2.1" ry="2" fill="#FFFFFF" opacity="0.62" />
          <circle cx="166.5" cy="114.5" r="1" fill="#FFFFFF" opacity="0.46" clipPath="url(#ay-right-eye-clip)" />
          <ellipse cx="158" cy="111" rx="11.2" ry="11.2" fill="none" stroke="#4A2D16" strokeWidth="1.15" opacity="0.34" clipPath="url(#ay-right-eye-clip)" />
          {blink ? (
            <path
              d="M 138,111 C 148,107 153,106 158,106 C 163,106 168,107 178,111"
              fill="none"
              stroke="#07051A"
              strokeWidth="11"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 136,108 C 143,99 151,95 158,95 C 165,95 173,99 180,108 C 173,105 165,104 158,105 C 151,104 143,105 136,108 Z"
              fill="#07051A"
              opacity="0.92"
            />
          )}
          <path d="M 139,117 C 149,125 158,126 177,117" fill="none" stroke="#07051A" strokeWidth="1.5" opacity="0.2" />
          <path d="M 139,118 C 149,126 158,127 177,118" fill="none" stroke="url(#ay-eye-water)" strokeWidth="2" opacity="0.26" strokeLinecap="round" />
          <path d="M 181,108 L 186,104" fill="none" stroke="#07051A" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />

          <path
            d="M 125,134 C 123,142 123,149 126,154 C 128,156 132,156 134,154 C 137,149 137,142 135,134"
            fill="none"
            stroke="#AD6D48"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <ellipse cx="126" cy="154" rx="3.8" ry="2" fill="#8F5538" opacity="0.15" />
          <ellipse cx="134" cy="154" rx="3.8" ry="2" fill="#8F5538" opacity="0.15" />
          <circle cx="136.5" cy="153.5" r="1" fill="#DCE2EB" opacity="0.45" />

          <ellipse cx="130" cy="191" rx="26" ry="12" fill="rgba(40,20,16,0.08)" opacity="0.38" />
          <path
            d="M 112,182 C 116,174 122,171 128,173 C 130,170 132,170 132,173 C 138,171 144,174 148,182 C 144,178 139,177 132,178 C 130,176 130,176 128,178 C 121,177 116,178 112,182 Z"
            fill="url(#ay-lip-up)"
            opacity="0.9"
          />
          <path
            d="M 114,182 C 118,188 123,192 129,193 C 131,193 134,192 137,191 C 142,189 145,186 146,182 C 142,186 138,189 130,189 C 122,189 118,186 114,182 Z"
            fill="url(#ay-lip-low)"
            opacity="0.88"
          />
          <ellipse cx="130" cy="188.6" rx="9" ry="3.2" fill="url(#ay-lip-gloss)" opacity="0.24" />
          <path d="M 122,184 C 126,182 130,181.6 138,184" fill="none" stroke="rgba(255,231,235,0.34)" strokeWidth="1.1" strokeLinecap="round" />

          <ellipse cx="130" cy="204" rx="22" ry="10" fill="rgba(18,10,8,0.08)" opacity="0.42" />
        </g>
      </g>
    </svg>
  );
}
