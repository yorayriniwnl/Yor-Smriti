'use client';

import { useEffect, useRef, useState } from 'react';

function Flower({
  cx,
  cy,
  outerR,
  innerR,
  centerR,
  petals = 5,
  petalColor,
  petalColorAlt,
  centerColor,
  centerDotColor,
}: {
  cx: number;
  cy: number;
  outerR: number;
  innerR: number;
  centerR: number;
  petals?: number;
  petalColor: string;
  petalColorAlt: string;
  centerColor: string;
  centerDotColor: string;
}) {
  const pts = Array.from({ length: petals }, (_, i) => {
    const a = (i / petals) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + Math.cos(a) * outerR, y: cy + Math.sin(a) * outerR };
  });

  const altPts = Array.from({ length: petals }, (_, i) => {
    const a = ((i + 0.5) / petals) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + Math.cos(a) * outerR * 0.85,
      y: cy + Math.sin(a) * outerR * 0.85,
    };
  });

  return (
    <g>
      {pts.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p.x}
          cy={p.y}
          r={innerR}
          fill={i % 2 === 0 ? petalColor : petalColorAlt}
        />
      ))}
      {altPts.map((p, i) => (
        <circle
          key={`ap${i}`}
          cx={p.x}
          cy={p.y}
          r={innerR * 0.7}
          fill={petalColorAlt}
          opacity={0.7}
        />
      ))}
      <circle cx={cx} cy={cy} r={centerR} fill={centerColor} />
      <circle cx={cx} cy={cy} r={centerR * 0.45} fill={centerDotColor} />
    </g>
  );
}

export function KeyrinCharacter() {
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
      }, 2200 + Math.random() * 3800);
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
      aria-label="Keyrin character illustration"
      role="img"
    >
      <defs>
        <radialGradient id="c-skin" cx="48%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FCDEB8" />
          <stop offset="65%" stopColor="#F0B98C" />
          <stop offset="100%" stopColor="#E0A070" />
        </radialGradient>
        <radialGradient id="c-skin-face" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FDDFC0" />
          <stop offset="75%" stopColor="#F2BC90" />
          <stop offset="100%" stopColor="#E2A575" />
        </radialGradient>
        <linearGradient id="c-hair" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#2B221B" />
          <stop offset="45%" stopColor="#16110D" />
          <stop offset="100%" stopColor="#060504" />
        </linearGradient>
        <linearGradient id="c-hair-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A2F27" />
          <stop offset="35%" stopColor="#4A3C34" stopOpacity="0.8" />
          <stop offset="65%" stopColor="#2B221B" />
          <stop offset="100%" stopColor="#060504" />
        </linearGradient>
        <linearGradient id="c-kurta" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#1D1D26" />
          <stop offset="50%" stopColor="#0F0F16" />
          <stop offset="100%" stopColor="#05050A" />
        </linearGradient>
        <linearGradient id="c-kurta-hi" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#353545" />
          <stop offset="100%" stopColor="#161621" />
        </linearGradient>
        <radialGradient id="c-iris" cx="36%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#6B4A2A" />
          <stop offset="55%" stopColor="#2E1B0D" />
          <stop offset="100%" stopColor="#080402" />
        </radialGradient>
        <radialGradient id="c-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7AA2" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF7AA2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="c-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="c-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C040" />
          <stop offset="100%" stopColor="#C49018" />
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="716" rx="60" ry="7" fill="rgba(0,0,0,0.14)" />

      <path
        fill="url(#c-hair)"
        d="
          M 82,42
          C 60,32 38,50 36,82
          C 34,118 36,170 40,232
          C 44,310 48,398 52,476
          C 54,532 60,570 72,594
          L 86,600
          C 74,576 66,548 64,508
          C 60,450 60,372 62,302
          C 64,248 70,200 78,172
          C 84,152 92,130 104,110
          C 114,92 124,80 130,76
          C 136,80 146,92 156,110
          C 168,130 176,152 182,172
          C 190,200 196,248 198,302
          C 200,372 200,450 196,508
          C 194,548 186,576 174,600
          L 188,594
          C 200,570 206,532 208,476
          C 212,398 216,310 220,232
          C 224,170 226,118 224,82
          C 222,50 200,32 178,42
          C 163,31 148,24 130,22
          C 112,24 97,31 82,42
          Z
        "
      />
      <path
        fill="#1A1410"
        opacity="0.55"
        d="M 60,130 C 58,165 58,210 60,265 C 62,240 64,195 64,152 Z"
      />
      <path
        fill="#1A1410"
        opacity="0.55"
        d="M 200,130 C 202,165 202,210 200,265 C 198,240 196,195 196,152 Z"
      />
      <path
        fill="#0F0C09"
        opacity="0.7"
        d="M 198,300 C 202,340 204,390 200,440 C 196,410 194,360 196,320 Z"
      />

      <path
        fill="url(#c-kurta)"
        d="
          M 54,228
          C 40,240 28,264 26,298
          L 22,388
          C 20,438 20,496 22,552
          L 24,648
          C 26,668 34,680 46,684
          L 214,684
          C 226,680 234,668 236,648
          L 238,552
          C 240,496 240,438 238,388
          L 234,298
          C 232,264 220,240 206,228
          L 180,220
          C 163,216 148,214 130,214
          C 112,214 97,216 80,220
          Z
        "
      />
      <path
        fill="url(#c-shadow)"
        d="M 206,228 L 234,298 L 238,388 L 240,496 L 238,552 L 236,648
           C 234,668 226,680 214,684
           L 188,684 L 190,550 L 192,440 L 192,348 L 188,265 Z"
        opacity="0.42"
      />
      <path
        fill="#2A2A35"
        opacity="0.22"
        d="M 54,228 L 26,298 L 22,388 L 20,496 L 22,552 L 24,648
           C 26,668 34,680 46,684
           L 72,684 L 70,550 L 68,440 L 68,348 L 72,265 Z"
      />
      <path
        fill="#242431"
        opacity="0.18"
        d="M 115,214 C 124,212 136,212 145,214 L 148,240 C 138,236 122,236 112,240 Z"
      />

      <path
        d="M 82,222 C 98,216 114,213 130,213 C 146,213 162,216 178,222"
        fill="none"
        stroke="url(#c-gold)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {[90, 103, 117, 130, 143, 157, 170].map((x, i) => (
        <circle key={`nd${i}`} cx={x} cy={228} r="2.8" fill="#D4A020" opacity="0.9" />
      ))}
      <path
        d="M 72,264 C 82,256 98,258 110,270"
        fill="none"
        stroke="#C89018"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="82" cy="260" r="2.2" fill="#D4A020" opacity="0.8" />
      <circle cx="98" cy="258" r="2.2" fill="#D4A020" opacity="0.8" />
      <path
        d="M 188,264 C 178,256 162,258 150,270"
        fill="none"
        stroke="#C89018"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="178" cy="260" r="2.2" fill="#D4A020" opacity="0.8" />
      <circle cx="162" cy="258" r="2.2" fill="#D4A020" opacity="0.8" />
      <path
        d="M 105,298 C 114,293 122,291 130,291 C 138,291 146,293 155,298"
        fill="none"
        stroke="#D4A020"
        strokeWidth="1.6"
        opacity="0.6"
      />

      <Flower
        cx={93}
        cy={336}
        outerR={7}
        innerR={3.5}
        centerR={3}
        petalColor="#C89018"
        petalColorAlt="#B07810"
        centerColor="#E8C040"
        centerDotColor="#FF9818"
      />
      <Flower
        cx={167}
        cy={336}
        outerR={7}
        innerR={3.5}
        centerR={3}
        petalColor="#C89018"
        petalColorAlt="#B07810"
        centerColor="#E8C040"
        centerDotColor="#FF9818"
      />
      <Flower
        cx={130}
        cy={358}
        outerR={6}
        innerR={3}
        centerR={2.5}
        petalColor="#D4A820"
        petalColorAlt="#B87810"
        centerColor="#F0D050"
        centerDotColor="#FF9818"
      />
      <Flower
        cx={104}
        cy={390}
        outerR={5}
        innerR={2.5}
        centerR={2}
        petalColor="#C89018"
        petalColorAlt="#A06810"
        centerColor="#E0B838"
        centerDotColor="#FF8818"
      />
      <Flower
        cx={156}
        cy={390}
        outerR={5}
        innerR={2.5}
        centerR={2}
        petalColor="#C89018"
        petalColorAlt="#A06810"
        centerColor="#E0B838"
        centerDotColor="#FF8818"
      />

      <path d="M 24,568 L 236,568" stroke="#C89018" strokeWidth="2.8" opacity="0.55" />
      <path
        d="M 22,578 C 60,573 100,575 130,574 C 160,575 200,573 238,578"
        fill="none"
        stroke="#D4A020"
        strokeWidth="1.6"
        opacity="0.45"
      />
      {[42, 66, 90, 110, 130, 150, 170, 194, 218].map((x, i) => (
        <circle key={`hd${i}`} cx={x} cy={570} r="2.2" fill="#C89018" opacity="0.65" />
      ))}

      <path
        fill="url(#c-skin)"
        d="M 54,228 C 38,238 24,256 18,278 L 12,310 C 10,332 12,352 18,368
           L 26,388 C 32,398 40,404 50,402 L 56,400
           C 48,384 44,366 44,348 L 42,318
           C 42,300 46,280 54,265 Z"
      />
      <path
        fill="url(#c-kurta)"
        d="M 54,228 C 40,236 28,250 22,268 L 16,286 C 32,276 50,264 58,252 Z"
        opacity="0.95"
      />
      <path
        fill="#000000"
        opacity="0.2"
        d="M 20,278 L 14,312 L 14,338 L 20,354 L 26,372 L 32,390 L 44,402
           L 42,380 L 36,360 L 32,340 L 28,310 L 28,282 Z"
      />

      <path
        fill="url(#c-skin)"
        d="M 206,228 C 222,238 236,256 242,278 L 248,310 C 250,332 248,352 242,368
           L 234,388 C 228,398 220,404 210,402 L 204,400
           C 212,384 216,366 216,348 L 218,318
           C 218,300 214,280 206,265 Z"
      />
      <path
        fill="url(#c-kurta)"
        d="M 206,228 C 220,236 232,250 238,268 L 244,286 C 228,276 210,264 202,252 Z"
        opacity="0.95"
      />
      <path
        fill="#000000"
        opacity="0.2"
        d="M 240,278 L 246,312 L 246,338 L 240,354 L 234,372 L 228,390 L 216,402
           L 218,380 L 224,360 L 228,340 L 232,310 L 232,282 Z"
      />

      <path
        fill="url(#c-skin)"
        d="M 112,176 C 110,188 108,204 108,220 L 152,220 C 152,204 150,188 148,176 Z"
      />
      <path
        fill="#D09060"
        opacity="0.28"
        d="M 112,176 C 111,192 110,208 110,220 L 118,220 C 118,208 117,192 116,176 Z"
      />
      <path
        fill="#C08050"
        opacity="0.18"
        d="M 108,214 C 108,218 108,220 108,220 L 152,220 C 152,220 152,218 151,214 Z"
      />

      <ellipse cx="130" cy="105" rx="58" ry="71" fill="url(#c-skin-face)" />
      <ellipse cx="87" cy="116" rx="20" ry="44" fill="#DFA070" opacity="0.14" />
      <ellipse cx="173" cy="116" rx="20" ry="44" fill="#DFA070" opacity="0.14" />
      <ellipse cx="128" cy="67" rx="34" ry="24" fill="#FDDFC4" opacity="0.42" />
      <ellipse cx="130" cy="170" rx="24" ry="10" fill="#C88050" opacity="0.18" />
      <ellipse cx="100" cy="162" rx="14" ry="8" fill="#D09060" opacity="0.1" />
      <ellipse cx="160" cy="162" rx="14" ry="8" fill="#D09060" opacity="0.1" />

      <path
        fill="url(#c-hair)"
        d="M 78,48
           C 74,38 82,27 98,23
           C 110,20 122,21 130,25
           C 138,21 150,20 162,23
           C 178,27 186,38 182,48
           C 174,38 160,31 148,30
           C 140,28 135,28 130,28
           C 125,28 120,28 112,30
           C 100,31 86,38 78,48 Z"
      />
      <path
        fill="url(#c-hair-shine)"
        d="M 80,50
           C 68,64 60,85 58,112
           C 56,140 58,168 64,184
           C 70,166 74,144 76,118
           C 78,92 80,70 84,56 Z"
      />
      <path
        fill="url(#c-hair)"
        d="M 180,50
           C 192,64 200,85 202,112
           C 204,140 202,168 196,184
           C 190,166 186,144 184,118
           C 182,92 180,70 176,56 Z"
      />
      <path
        fill="#0F0C09"
        opacity="0.85"
        d="M 82,56 C 72,74 68,102 68,128 C 72,108 76,82 82,62 Z"
      />
      <path
        fill="#4A3C34"
        opacity="0.65"
        d="M 108,24 C 120,19 130,19 142,22 C 136,27 130,27 124,27 C 116,27 110,25 108,24 Z"
      />
      <path
        fill="#3A2F27"
        opacity="0.5"
        d="M 124,22 C 128,20 132,20 136,22 C 134,25 130,25 126,25 Z"
      />

      <path
        fill="#1A1410"
        d="M 74,86 C 82,80 91,78 101,78 C 112,78 120,80 125,85
           C 119,87 112,87 102,86 C 91,85 82,85 74,86 Z"
      />
      <path fill="#0F0C09" d="M 73,86 C 72,88 72,91 74,91 C 77,90 78,87 73,86 Z" />
      <path
        fill="#1A1410"
        d="M 135,85 C 140,80 149,78 160,78 C 170,78 179,80 187,86
           C 179,85 170,85 160,86 C 151,87 144,87 135,85 Z"
      />
      <path fill="#0F0C09" d="M 187,86 C 188,88 188,91 186,91 C 183,90 182,87 187,86 Z" />

      <ellipse cx="100" cy="104" rx="22" ry="15" fill="white" />
      <clipPath id="lec">
        <ellipse cx="100" cy="104" rx="22" ry="15" />
      </clipPath>
      <ellipse
        cx="100"
        cy="104"
        rx="15"
        ry="15"
        fill="url(#c-iris)"
        clipPath="url(#lec)"
      />
      <ellipse
        cx="100"
        cy="104"
        rx="7.5"
        ry="7.5"
        fill="#03010E"
        clipPath="url(#lec)"
      />
      <ellipse cx="105" cy="98" rx="5" ry="4.6" fill="white" opacity="0.95" />
      <ellipse cx="94" cy="109" rx="2.3" ry="2.1" fill="white" opacity="0.55" />
      <circle cx="108" cy="108" r="1.1" fill="white" opacity="0.55" clipPath="url(#lec)" />
      <ellipse
        cx="100"
        cy="104"
        rx="11"
        ry="11"
        fill="none"
        stroke="#4A2D16"
        strokeWidth="1.2"
        opacity="0.4"
        clipPath="url(#lec)"
      />
      {blink ? (
        <path
          d="M 81,104 C 90,100 95,99 100,99 C 105,99 110,100 119,104"
          fill="none"
          stroke="#07051A"
          strokeWidth="12"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 80,101 C 87,93 95,90 100,90 C 105,90 113,93 120,101
             C 113,98 105,97 100,98 C 95,97 87,98 80,101 Z"
          fill="#07051A"
        />
      )}
      <path
        d="M 82,110 C 91,116 100,117 119,110"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path
        d="M 79,102 L 74,99"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 80,106 L 74,106"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 81,110 L 76,112"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <ellipse cx="83" cy="105" rx="3" ry="2" fill="#FFAAAA" opacity="0.35" />

      <ellipse cx="160" cy="104" rx="22" ry="15" fill="white" />
      <clipPath id="rec">
        <ellipse cx="160" cy="104" rx="22" ry="15" />
      </clipPath>
      <ellipse
        cx="160"
        cy="104"
        rx="15"
        ry="15"
        fill="url(#c-iris)"
        clipPath="url(#rec)"
      />
      <ellipse
        cx="160"
        cy="104"
        rx="7.5"
        ry="7.5"
        fill="#03010E"
        clipPath="url(#rec)"
      />
      <ellipse cx="165" cy="98" rx="5" ry="4.6" fill="white" opacity="0.95" />
      <ellipse cx="154" cy="109" rx="2.3" ry="2.1" fill="white" opacity="0.55" />
      <circle cx="168" cy="108" r="1.1" fill="white" opacity="0.55" clipPath="url(#rec)" />
      <ellipse
        cx="160"
        cy="104"
        rx="11"
        ry="11"
        fill="none"
        stroke="#4A2D16"
        strokeWidth="1.2"
        opacity="0.4"
        clipPath="url(#rec)"
      />
      {blink ? (
        <path
          d="M 141,104 C 150,100 155,99 160,99 C 165,99 170,100 179,104"
          fill="none"
          stroke="#07051A"
          strokeWidth="12"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 140,101 C 147,93 155,90 160,90 C 165,90 173,93 180,101
             C 173,98 165,97 160,98 C 155,97 147,98 140,101 Z"
          fill="#07051A"
        />
      )}
      <path
        d="M 142,110 C 151,116 160,117 179,110"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path
        d="M 181,102 L 186,99"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 180,106 L 186,106"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 179,110 L 184,112"
        fill="none"
        stroke="#07051A"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <ellipse cx="177" cy="105" rx="3" ry="2" fill="#FFAAAA" opacity="0.35" />

      <path
        d="M 124,130 C 122,137 122,143 125,146 C 127,148 133,148 135,146 C 138,143 138,137 136,130"
        fill="none"
        stroke="#D09060"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <ellipse cx="125.5" cy="146" rx="4.2" ry="2.2" fill="#C08050" opacity="0.28" />
      <ellipse cx="134.5" cy="146" rx="4.2" ry="2.2" fill="#C08050" opacity="0.28" />

      <circle cx="137.6" cy="145.5" r="1.15" fill="#D8DDE7" opacity="0.9" />
      <circle cx="137.2" cy="145.1" r="0.45" fill="#FFFFFF" opacity="0.55" />

      <ellipse cx="87" cy="126" rx="23" ry="14" fill="url(#c-blush)" />
      <ellipse cx="173" cy="126" rx="23" ry="14" fill="url(#c-blush)" />

      <path
        d="M 114,158 C 118,151 123,149 128,150
           C 130,147 132,147 132,150
          C 137,149 142,151 146,158
           C 142,154 137,152 132,153
           C 130,150 130,150 128,153
          C 123,152 118,154 114,158 Z"
        fill="#B05256"
      />
      <path
        d="M 114,158 C 118,164 122,168 128,169
           C 131,169 133,168 136,167
          C 141,165 144,161 146,158
          C 142,162 138,165 130,165
          C 122,165 118,162 114,158 Z"
        fill="#D06B71"
      />
      <ellipse cx="130" cy="164" rx="8.6" ry="3.2" fill="#F2A0A6" opacity="0.26" />
      <path
        d="M 121,154 C 126,151 130,150 134,153"
        fill="none"
        stroke="rgba(255, 226, 232, 0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 113,158 C 111,160 111,163 112,164"
        fill="none"
        stroke="#C08060"
        strokeWidth="1"
        opacity="0.28"
        strokeLinecap="round"
      />
      <path
        d="M 147,158 C 149,160 149,163 148,164"
        fill="none"
        stroke="#C08060"
        strokeWidth="1"
        opacity="0.28"
        strokeLinecap="round"
      />

      <circle cx="130" cy="70" r="3.2" fill="#0E0E10" opacity="0.92" />
      <circle cx="129" cy="69" r="1.1" fill="#FFFFFF" opacity="0.18" />

      <g opacity="0.92">
        <circle cx="72" cy="118" r="3.1" fill="#D8DDE7" />
        <circle cx="71.2" cy="117.2" r="1.2" fill="#FFFFFF" opacity="0.35" />
        <path
          d="M 72,122 C 71,136 71,150 72,164"
          fill="none"
          stroke="#B8BEC9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="72" cy="140" r="4.2" fill="#D8DDE7" opacity="0.95" />
        <circle cx="72" cy="155" r="5.2" fill="#D8DDE7" opacity="0.95" />
        <circle cx="72" cy="172" r="6.2" fill="#D8DDE7" opacity="0.95" />
      </g>

      <g opacity="0.92">
        <circle cx="188" cy="118" r="3.1" fill="#D8DDE7" />
        <circle cx="187.2" cy="117.2" r="1.2" fill="#FFFFFF" opacity="0.35" />
        <path
          d="M 188,122 C 189,136 189,150 188,164"
          fill="none"
          stroke="#B8BEC9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="188" cy="140" r="4.2" fill="#D8DDE7" opacity="0.95" />
        <circle cx="188" cy="155" r="5.2" fill="#D8DDE7" opacity="0.95" />
        <circle cx="188" cy="172" r="6.2" fill="#D8DDE7" opacity="0.95" />
      </g>

      <path
        d="M 105,194 C 112,188 121,185 130,184 C 139,185 148,188 155,194"
        fill="none"
        stroke="#B8BEC9"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.62"
      />
      <circle cx="130" cy="198" r="3.2" fill="#D8DDE7" opacity="0.9" />
      <circle cx="129" cy="197" r="1.1" fill="#FFFFFF" opacity="0.3" />

      <ellipse cx="108" cy="706" rx="21" ry="10" fill="#E8A870" />
      <ellipse cx="152" cy="706" rx="21" ry="10" fill="#E8A870" />
      <path
        d="M 92,704 C 100,698 116,698 124,704"
        fill="none"
        stroke="#C07848"
        strokeWidth="2.2"
        opacity="0.6"
      />
      <path
        d="M 136,704 C 144,698 160,698 168,704"
        fill="none"
        stroke="#C07848"
        strokeWidth="2.2"
        opacity="0.6"
      />
    </svg>
  );
}
