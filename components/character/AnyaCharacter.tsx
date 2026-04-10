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

export function AnyaCharacter() {
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
      aria-label="Anya character illustration"
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

      <path
        fill="url(#c-hair-shine)"
        d="
          M 84,42
          C 102,32 116,28 130,28
          C 144,28 158,32 176,42
          C 164,48 154,58 146,72
          C 138,86 133,100 130,114
          C 127,100 122,86 114,72
          C 106,58 96,48 84,42
          Z
        "
        opacity="0.68"
      />
      <path
        fill="#0E0B09"
        d="
          M 64,74
          C 76,50 98,40 130,38
          C 162,40 184,50 196,74
          C 190,76 184,82 178,92
          C 170,106 164,124 160,146
          C 150,126 140,110 130,98
          C 120,110 110,126 100,146
          C 96,124 90,106 82,92
          C 76,82 70,76 64,74
          Z
        "
      />

      <path
        fill="#120F0D"
        d="
          M 76,58
          C 88,44 104,36 130,34
          C 156,36 172,44 184,58
          C 178,60 170,68 162,82
          C 154,96 148,110 144,126
          C 138,116 134,108 130,102
          C 126,108 122,116 116,126
          C 112,110 106,96 98,82
          C 90,68 82,60 76,58
          Z
        "
      />

      <ellipse cx="94" cy="98" rx="10" ry="8" fill="#F2BC90" opacity="0.18" />
      <ellipse cx="166" cy="98" rx="10" ry="8" fill="#F2BC90" opacity="0.18" />

      <ellipse cx="106" cy="116" rx="18" ry={blink ? 2.2 : 8.8} fill="#FFF7EE" />
      <ellipse cx="154" cy="116" rx="18" ry={blink ? 2.2 : 8.8} fill="#FFF7EE" />
      {!blink && (
        <>
          <circle cx="106" cy="116" r="8.5" fill="url(#c-iris)" />
          <circle cx="154" cy="116" r="8.5" fill="url(#c-iris)" />
          <circle cx="106" cy="116" r="4.1" fill="#040302" />
          <circle cx="154" cy="116" r="4.1" fill="#040302" />
          <circle cx="103" cy="113" r="1.8" fill="#FFF" opacity="0.9" />
          <circle cx="151" cy="113" r="1.8" fill="#FFF" opacity="0.9" />
        </>
      )}
      <path d="M 90,99 C 98,93 113,93 121,100" fill="none" stroke="#1A1410" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 139,100 C 147,93 162,93 170,99" fill="none" stroke="#1A1410" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 90,131 C 98,136 113,136 121,131" fill="none" stroke="#B06A40" strokeWidth="1.2" opacity="0.35" />
      <path d="M 139,131 C 147,136 162,136 170,131" fill="none" stroke="#B06A40" strokeWidth="1.2" opacity="0.35" />

      <ellipse cx="94" cy="138" rx="18" ry="12" fill="url(#c-blush)" />
      <ellipse cx="166" cy="138" rx="18" ry="12" fill="url(#c-blush)" />

      <path
        d="M 130,112 C 126,124 124,136 124,148 C 128,150 132,150 136,148"
        fill="none"
        stroke="#C17C48"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M 114,160 C 122,166 138,166 146,160"
        fill="none"
        stroke="#7E2F50"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 116,161 C 122,164 138,164 144,161"
        fill="none"
        stroke="#F07A92"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />

      <path
        fill="#0C0907"
        d="
          M 74,78
          C 70,96 68,116 68,144
          C 68,176 72,212 78,250
          C 84,286 88,332 88,388
          L 88,642
          L 102,642
          L 106,402
          C 106,334 102,280 96,240
          C 92,212 90,182 90,146
          C 90,118 92,98 98,86
          Z
        "
        opacity="0.65"
      />
      <path
        fill="#0C0907"
        d="
          M 186,78
          C 190,96 192,116 192,144
          C 192,176 188,212 182,250
          C 176,286 172,332 172,388
          L 172,642
          L 158,642
          L 154,402
          C 154,334 158,280 164,240
          C 168,212 170,182 170,146
          C 170,118 168,98 162,86
          Z
        "
        opacity="0.65"
      />
    </svg>
  );
}
