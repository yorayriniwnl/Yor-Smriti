'use client';

import { useEffect, useRef, useState } from 'react';

export function AyrinCharacter() {
  const [blink, setBlink] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (openTimer.current)  clearTimeout(openTimer.current);
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
        .ayrin-breath { transform-origin:130px 502px; animation:ayrin-breath 6s ease-in-out infinite; }
        .ayrin-head   { transform-origin:130px 168px; animation:ayrin-head 6.4s ease-in-out infinite; }
        .ayrin-mouth  { transform-origin:130px 184px; animation:ayrin-mouth 6s ease-in-out infinite; }
        .ayrin-fringe { transform-origin:130px 90px;  animation:ayrin-fringe 7.2s ease-in-out infinite; }
        @keyframes ayrin-breath {
          0%,100%{transform:translateY(0px) scaleY(1);}
          50%    {transform:translateY(-2px) scaleY(1.012);}
        }
        @keyframes ayrin-head {
          0%,100%{transform:rotate(-3.8deg) translateY(0px);}
          50%    {transform:rotate(-5deg) translateY(-1px);}
        }
        @keyframes ayrin-mouth {
          0%,100%{transform:translateY(0px) scaleY(1);}
          50%    {transform:translateY(0.7px) scaleY(1.06);}
        }
        @keyframes ayrin-fringe {
          0%,100%{transform:rotate(0deg) translateY(0px);}
          50%    {transform:rotate(-0.8deg) translateY(0.8px);}
        }
      `}</style>

      <defs>
        {/* ════ AMBIENT ════ */}
        <radialGradient id="g-amb-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C87040" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#C87040" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-amb-cool" cx="50%" cy="45%" r="55%">
          <stop offset="0%"   stopColor="#4050A0" stopOpacity="0.38"/>
          <stop offset="100%" stopColor="#4050A0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-bg-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.04"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>

        {/* ════ SKIN — face, body, neck, ear ════ */}
        <radialGradient id="g-skin-face" cx="44%" cy="16%" r="78%">
          <stop offset="0%"   stopColor="#D8926A"/>
          <stop offset="22%"  stopColor="#C47C52"/>
          <stop offset="55%"  stopColor="#A46038"/>
          <stop offset="84%"  stopColor="#8A4828"/>
          <stop offset="100%" stopColor="#6E361A"/>
        </radialGradient>
        <radialGradient id="g-skin-body" cx="42%" cy="22%" r="80%">
          <stop offset="0%"   stopColor="#CC8858"/>
          <stop offset="40%"  stopColor="#AA6438"/>
          <stop offset="100%" stopColor="#7E4020"/>
        </radialGradient>
        <radialGradient id="g-skin-ear" cx="40%" cy="30%" r="72%">
          <stop offset="0%"   stopColor="#C88060"/>
          <stop offset="60%"  stopColor="#A05838"/>
          <stop offset="100%" stopColor="#7A3E20"/>
        </radialGradient>
        <linearGradient id="g-neck-shad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.02"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.3"/>
        </linearGradient>
        {/* SSS — subsurface scattering simulation */}
        <radialGradient id="g-sss-left" cx="20%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#FF8060" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#FF8060" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-sss-right" cx="80%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#FF8060" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#FF8060" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-jaw-depth" cx="50%" cy="98%" r="58%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-cheek-blush-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C04030" stopOpacity="0.18"/>
          <stop offset="60%"  stopColor="#C04030" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#C04030" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-cheek-blush-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C04030" stopOpacity="0.16"/>
          <stop offset="60%"  stopColor="#C04030" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#C04030" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="g-nose-hl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#E4AC70" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#E4AC70" stopOpacity="0.52"/>
          <stop offset="100%" stopColor="#E4AC70" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="g-nose-tip" cx="50%" cy="60%" r="50%">
          <stop offset="0%"   stopColor="#CC6040" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#CC6040" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-temple-shad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-forehead-hl" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
        </radialGradient>
        {/* Nasolabial fold gradient */}
        <linearGradient id="g-nasolabial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7A3C20" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#7A3C20" stopOpacity="0"/>
        </linearGradient>
        {/* Philtrum */}
        <linearGradient id="g-philtrum" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </linearGradient>

        {/* ════ HAIR ════ */}
        <linearGradient id="g-hair-base" x1="16%" y1="0%" x2="84%" y2="100%">
          <stop offset="0%"   stopColor="#1E1814"/>
          <stop offset="36%"  stopColor="#0E0C08"/>
          <stop offset="100%" stopColor="#040302"/>
        </linearGradient>
        <linearGradient id="g-hair-shine1" x1="2%" y1="0%" x2="98%" y2="100%">
          <stop offset="0%"   stopColor="#524038" stopOpacity="0.75"/>
          <stop offset="32%"  stopColor="#6C5248" stopOpacity="0.4"/>
          <stop offset="65%"  stopColor="#2C201C" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="g-hair-shine2" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor="#483830" stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#342824" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="g-hair-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1C1612"/>
          <stop offset="55%"  stopColor="#0C0A07"/>
          <stop offset="100%" stopColor="#040302"/>
        </linearGradient>
        <radialGradient id="g-hair-ambient" cx="40%" cy="20%" r="60%">
          <stop offset="0%"   stopColor="#4A3830" stopOpacity="0.55"/>
          <stop offset="55%"  stopColor="#201814" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </radialGradient>

        {/* ════ SHIRT ════ */}
        <linearGradient id="g-shirt" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor="#EEECEA"/>
          <stop offset="45%"  stopColor="#DADAD6"/>
          <stop offset="100%" stopColor="#BEBDB8"/>
        </linearGradient>
        <linearGradient id="g-shirt-shad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.03"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.24"/>
        </linearGradient>
        <linearGradient id="g-shirt-rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFF" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="g-collar-inner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C8C6C2"/>
          <stop offset="100%" stopColor="#A8A6A0"/>
        </linearGradient>

        {/* ════ PANTS / SHOES / CHAIN ════ */}
        <linearGradient id="g-trouser" x1="16%" y1="0%" x2="84%" y2="100%">
          <stop offset="0%"   stopColor="#28222E"/>
          <stop offset="50%"  stopColor="#16121C"/>
          <stop offset="100%" stopColor="#09070E"/>
        </linearGradient>
        <linearGradient id="g-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#E4E6EC"/>
          <stop offset="50%"  stopColor="#CECFD8"/>
          <stop offset="100%" stopColor="#B6B9C6"/>
        </linearGradient>
        <linearGradient id="g-shoe-sole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D0D2DA"/>
          <stop offset="100%" stopColor="#A8AAB4"/>
        </linearGradient>
        <linearGradient id="g-chain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF6E0"/>
          <stop offset="40%"  stopColor="#DCC4A0"/>
          <stop offset="100%" stopColor="#A88A68"/>
        </linearGradient>

        {/* ════ EYES ════ */}
        <radialGradient id="g-iris" cx="34%" cy="24%" r="68%">
          <stop offset="0%"   stopColor="#906030"/>
          <stop offset="20%"  stopColor="#623818"/>
          <stop offset="55%"  stopColor="#240E06"/>
          <stop offset="100%" stopColor="#050102"/>
        </radialGradient>
        <radialGradient id="g-iris-depth" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0"/>
          <stop offset="72%"  stopColor="#000" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.45"/>
        </radialGradient>
        <radialGradient id="g-sclera" cx="50%" cy="20%" r="80%">
          <stop offset="0%"   stopColor="#FFF9F4"/>
          <stop offset="60%"  stopColor="#F4ECE6"/>
          <stop offset="100%" stopColor="#E8DED6"/>
        </radialGradient>
        <linearGradient id="g-eye-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFF"    stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#C0D4FF" stopOpacity="0.04"/>
        </linearGradient>
        <radialGradient id="g-undereye-shad" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="#6A3C1C" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#6A3C1C" stopOpacity="0"/>
        </radialGradient>

        {/* ════ LIPS ════ */}
        <linearGradient id="g-lip-upper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#7C4242"/>
          <stop offset="50%"  stopColor="#6A3434"/>
          <stop offset="100%" stopColor="#582A2A"/>
        </linearGradient>
        <linearGradient id="g-lip-lower" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#925454"/>
          <stop offset="50%"  stopColor="#7A4040"/>
          <stop offset="100%" stopColor="#623434"/>
        </linearGradient>
        <radialGradient id="g-lip-gloss" cx="50%" cy="8%" r="88%">
          <stop offset="0%"   stopColor="#ECA8B0" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#ECA8B0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-lip-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3E1818" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#3E1818" stopOpacity="0"/>
        </radialGradient>

        {/* ════ STUBBLE / BEARD ════ */}
        <radialGradient id="g-stubble-jaw" cx="50%" cy="75%" r="65%">
          <stop offset="0%"   stopColor="#080604" stopOpacity="0.28"/>
          <stop offset="55%"  stopColor="#080604" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#080604" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-stubble-chin" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#060402" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-mustache-fill" cx="50%" cy="60%" r="55%">
          <stop offset="0%"   stopColor="#0A0806" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#0A0806" stopOpacity="0"/>
        </radialGradient>

        {/* ════ EYE CLIPS ════ */}
        {/* Slightly narrower almond — more realistic, less anime */}
        <clipPath id="cp-left-eye" clipPathUnits="userSpaceOnUse">
          <path d="M 87,115 C 92,104 100,98 107,98 C 114,98 122,104 127,115 C 122,125 114,129 107,129 C 100,129 92,125 87,115 Z"/>
        </clipPath>
        <clipPath id="cp-right-eye" clipPathUnits="userSpaceOnUse">
          <path d="M 133,115 C 138,104 146,98 153,98 C 160,98 168,104 173,115 C 168,125 160,129 153,129 C 146,129 138,125 133,115 Z"/>
        </clipPath>
        {/* Ear clip */}
        <clipPath id="cp-ear-l" clipPathUnits="userSpaceOnUse">
          <ellipse cx="82" cy="130" rx="12" ry="20"/>
        </clipPath>
      </defs>

      {/* ░░ GROUND SHADOW ░░ */}
      <ellipse cx="130" cy="714" rx="65" ry="8" fill="rgba(0,0,0,0.19)"/>
      <ellipse cx="130" cy="714" rx="40" ry="4" fill="rgba(0,0,0,0.1)"/>

      {/* ░░ AMBIENT LIGHT ░░ */}
      <ellipse cx="93"  cy="290" rx="55" ry="175" fill="url(#g-amb-warm)" opacity="0.22"/>
      <ellipse cx="171" cy="256" rx="52" ry="150" fill="url(#g-amb-cool)" opacity="0.12"/>
      <ellipse cx="130" cy="360" rx="90" ry="200" fill="url(#g-bg-glow)"  opacity="1"/>

      {/* ══════════════════════════════════════════
          BREATH GROUP
          ══════════════════════════════════════════ */}
      <g className="ayrin-breath">

        {/* ░░ LEGS ░░ */}
        <path fill="url(#g-trouser)" d="M 99,508 C 87,572 85,634 93,694 C 100,708 120,708 127,694 C 135,632 136,570 128,508 Z"/>
        <path fill="url(#g-trouser)" d="M 131,508 C 123,570 124,632 132,694 C 139,708 160,708 167,694 C 175,634 173,572 161,508 Z"/>
        {/* Trouser highlights */}
        <path d="M 111,510 C 107,574 107,638 113,700" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.8" strokeLinecap="round" opacity="0.54"/>
        <path d="M 149,510 C 153,574 153,638 147,700" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        {/* Knee crease */}
        <path d="M 105,610 C 112,606 121,606 127,609" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
        <path d="M 133,610 C 140,606 149,606 155,609" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>

        {/* ░░ SHOES ░░ */}
        <ellipse cx="108" cy="706" rx="23" ry="11" fill="url(#g-shoe)"/>
        <ellipse cx="108" cy="710" rx="23" ry="5"  fill="url(#g-shoe-sole)" opacity="0.6"/>
        <ellipse cx="153" cy="706" rx="23" ry="11" fill="url(#g-shoe)"/>
        <ellipse cx="153" cy="710" rx="23" ry="5"  fill="url(#g-shoe-sole)" opacity="0.6"/>
        {/* Shoe stitching */}
        <path d="M 88,704 C 100,697 116,697 127,704" fill="none" stroke="#C2C6D0" strokeWidth="1.6" opacity="0.66"/>
        <path d="M 90,706 C 100,699 115,699 125,706" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="2 3" opacity="0.5"/>
        <path d="M 135,704 C 147,697 162,697 173,704" fill="none" stroke="#C2C6D0" strokeWidth="1.6" opacity="0.66"/>
        <path d="M 137,706 C 147,699 161,699 171,706" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="2 3" opacity="0.5"/>

        {/* ░░ SHIRT BODY ░░ */}
        <path fill="url(#g-shirt)" d="
          M 71,229 C 59,248 54,284 54,337 L 54,449
          C 54,490 79,522 115,528 L 145,528
          C 181,522 206,490 206,449 L 206,337
          C 206,284 201,248 189,229
          C 171,213 152,207 130,207
          C 108,207 89,213 71,229 Z
        "/>
        {/* Shirt shadow volume */}
        <path fill="url(#g-shirt-shad)" opacity="0.21" d="
          M 188,229 C 201,248 206,284 206,337 L 206,449
          C 206,490 181,522 145,528 L 136,528
          C 143,490 146,434 145,364
          C 144,294 140,248 135,207
          C 155,208 173,214 188,229 Z
        "/>
        {/* Left rim light */}
        <path d="M 76,236 C 66,256 61,290 61,338 L 61,446 C 61,482 84,510 112,515"
          fill="none" stroke="url(#g-shirt-rim)" strokeWidth="2.1" strokeLinecap="round" opacity="0.35"/>
        {/* Primary fabric fold — left */}
        <path d="M 88,268 C 83,326 82,390 87,452"
          fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.04"/>
        {/* Primary fabric fold — right */}
        <path d="M 172,268 C 177,326 178,390 173,452"
          fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.04"/>
        {/* Secondary fold — mid left */}
        <path d="M 108,280 C 104,340 104,406 108,462"
          fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" opacity="0.028"/>
        {/* Secondary fold — mid right */}
        <path d="M 152,280 C 156,340 156,406 152,462"
          fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" opacity="0.028"/>
        {/* Chest tension crease */}
        <path d="M 100,260 C 112,268 122,270 130,270"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
        <path d="M 160,260 C 148,268 138,270 130,270"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
        {/* V-collar opening */}
        <path d="M 114,228 C 120,239 126,251 130,271 C 134,251 140,239 146,228"
          fill="none" stroke="rgba(80,64,48,0.35)" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Collar inner fabric shadow */}
        <path d="M 114,228 C 120,239 126,251 130,271 C 134,251 140,239 146,228"
          fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Left collar lapel seam */}
        <path d="M 118,232 C 122,240 126,247 129,253"
          fill="none" stroke="rgba(195,180,162,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.4 4.2" opacity="0.9"/>
        {/* Right collar lapel seam */}
        <path d="M 142,232 C 138,240 134,247 131,253"
          fill="none" stroke="rgba(195,180,162,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.4 4.2" opacity="0.9"/>
        {/* Collar stitching detail */}
        <path d="M 110,232 C 114,236 117,240 119,244"
          fill="none" stroke="rgba(160,150,138,0.4)" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="0.8 2" opacity="0.7"/>
        <path d="M 150,232 C 146,236 143,240 141,244"
          fill="none" stroke="rgba(160,150,138,0.4)" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="0.8 2" opacity="0.7"/>
        {/* Center placket */}
        <path d="M 130,268 L 130,516" fill="none" stroke="rgba(60,48,36,0.1)" strokeWidth="1.7" opacity="0.5"/>
        {/* Placket edge lines */}
        <path d="M 127.5,268 L 127.5,516" fill="none" stroke="rgba(60,48,36,0.04)" strokeWidth="0.6"/>
        <path d="M 132.5,268 L 132.5,516" fill="none" stroke="rgba(60,48,36,0.04)" strokeWidth="0.6"/>
        {/* Buttons with detail */}
        {[296, 328, 360, 392].map(y => (
          <g key={y}>
            <circle cx={130} cy={y} r={2.4} fill="rgba(54,42,32,0.2)" opacity={0.86}/>
            <circle cx={130} cy={y} r={1.2} fill="rgba(180,170,155,0.25)"/>
            <path d={`M ${128.6},${y} L ${131.4},${y}`} stroke="rgba(54,42,32,0.15)" strokeWidth="0.5"/>
            <path d={`M ${130},${y-1.4} L ${130},${y+1.4}`} stroke="rgba(54,42,32,0.15)" strokeWidth="0.5"/>
          </g>
        ))}
        {/* Hem */}
        <path d="M 84,496 C 99,504 116,507 130,507 C 144,507 161,504 176,496"
          fill="none" stroke="rgba(92,76,60,0.14)" strokeWidth="2" strokeLinecap="round" opacity="0.68"/>
        {/* Hem stitching */}
        <path d="M 90,498 C 104,505 117,507 130,507 C 143,507 156,505 170,498"
          fill="none" stroke="rgba(150,140,128,0.2)" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="1.2 3" opacity="0.6"/>

        {/* ░░ LEFT ARM ░░ */}
        <path fill="url(#g-skin-body)" d="
          M 82,252 C 61,274 50,310 50,352
          C 50,390 62,424 80,451
          C 87,461 98,463 107,455 L 112,450
          C 97,422 91,395 91,362
          C 91,328 95,297 103,266 Z
        "/>
        {/* Shirt over left arm */}
        <path fill="url(#g-shirt)" opacity="0.97" d="
          M 71,229 C 57,242 47,262 42,288 L 36,323
          C 53,311 71,295 87,277 Z
        "/>
        {/* Arm highlight */}
        <path d="M 63,278 C 58,316 62,354 74,389"
          fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" opacity="0.46"/>
        {/* Arm muscle shadow */}
        <path d="M 70,310 C 65,335 64,360 68,385"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        {/* Left hand */}
        <path fill="url(#g-skin-body)" d="
          M 80,442 C 73,446 70,454 71,462
          C 74,472 85,475 94,473
          C 102,471 107,464 106,456
          C 105,447 92,440 80,442 Z
        "/>
        {/* Knuckle lines */}
        <path d="M 80,447 C 83,451 84,455 83,459" fill="none" stroke="rgba(88,52,32,0.2)" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M 87,446 C 89,450 90,454 89,458"  fill="none" stroke="rgba(88,52,32,0.17)" strokeWidth="1.0" strokeLinecap="round"/>
        <path d="M 93,447 C 94,450 94,454 93,457"  fill="none" stroke="rgba(88,52,32,0.14)" strokeWidth="0.9" strokeLinecap="round"/>
        {/* Knuckle highlight */}
        <path d="M 81,448 L 84,450" fill="none" stroke="rgba(220,180,140,0.25)" strokeWidth="0.7" strokeLinecap="round"/>

        {/* ░░ RIGHT ARM ░░ */}
        <path fill="url(#g-skin-body)" d="
          M 178,252 C 199,274 210,310 210,352
          C 210,390 198,424 180,451
          C 173,461 162,463 153,455 L 148,450
          C 163,422 169,395 169,362
          C 169,328 165,297 157,266 Z
        "/>
        <path fill="url(#g-shirt)" opacity="0.97" d="
          M 189,229 C 203,242 213,262 218,288 L 224,323
          C 207,311 189,295 173,277 Z
        "/>
        <path d="M 197,278 C 202,316 198,354 186,389"
          fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" opacity="0.46"/>
        <path d="M 190,310 C 195,335 196,360 192,385"
          fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        {/* Right hand */}
        <path fill="url(#g-skin-body)" d="
          M 180,442 C 187,446 190,454 189,462
          C 186,472 175,475 166,473
          C 158,471 153,464 154,456
          C 155,447 168,440 180,442 Z
        "/>
        <path d="M 180,447 C 177,451 176,455 177,459" fill="none" stroke="rgba(88,52,32,0.2)" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M 173,446 C 171,450 170,454 171,458" fill="none" stroke="rgba(88,52,32,0.17)" strokeWidth="1.0" strokeLinecap="round"/>
        <path d="M 167,447 C 166,450 166,454 167,457" fill="none" stroke="rgba(88,52,32,0.14)" strokeWidth="0.9" strokeLinecap="round"/>
        <path d="M 179,448 L 176,450" fill="none" stroke="rgba(220,180,140,0.25)" strokeWidth="0.7" strokeLinecap="round"/>

        {/* ░░ NECK ░░ */}
        <path fill="url(#g-skin-body)" d="M 114,188 C 112,202 110,222 110,242 L 150,242 C 150,222 148,202 146,188 Z"/>
        <path fill="url(#g-neck-shad)" opacity="0.62" d="M 118,188 C 118,208 119,224 122,242 L 138,242 C 141,224 142,208 142,188 Z"/>
        {/* Neck muscle left sternocleidomastoid */}
        <path d="M 115,190 C 112,210 110,228 110,242"
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        {/* Neck muscle right */}
        <path d="M 145,190 C 148,210 150,228 150,242"
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        {/* Adam's apple */}
        <ellipse cx="130" cy="210" rx="5" ry="4" fill="rgba(0,0,0,0.04)" opacity="0.8"/>
        <path d="M 127,209 C 128.5,212 131.5,212 133,209"
          fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
        {/* Chain */}
        <path d="M 108,212 C 118,230 142,230 152,212"
          fill="none" stroke="url(#g-chain)" strokeWidth="2.2" strokeLinecap="round" opacity="0.92"/>
        {/* Chain link detail */}
        {[114,119,124,129,134,139,144].map((x,i) => (
          <ellipse key={i} cx={x} cy={212 + Math.abs(i-3)*1.5} rx={1.1} ry={0.8}
            fill="none" stroke="#D8C09A" strokeWidth="0.6" opacity="0.6"/>
        ))}
        <path d="M 113,227 C 119,221 124,218 130,218 C 136,218 141,221 147,227"
          fill="none" stroke="rgba(96,68,46,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M 109,228 C 119,224 125,222 130,222 C 135,222 141,224 151,228"
          fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ══════════════════════════════════════════
            HEAD GROUP
            ══════════════════════════════════════════ */}
        <g className="ayrin-head">

          {/* ░░░░░░░░░░░░░░░░░░░░░░░
              HAIR — 30+ layers
              ░░░░░░░░░░░░░░░░░░░░░░░ */}

          {/* Scalp base mass */}
          <path fill="url(#g-hair-base)" d="
            M 90,94 C 88,57 108,34 130,32
            C 152,34 172,57 170,94
            C 162,84 153,78 143,78
            C 137,78 132,83 130,88
            C 128,83 123,78 117,78
            C 107,78 98,84 90,94 Z
          "/>
          {/* Left side fall — primary */}
          <path fill="url(#g-hair-side)" opacity="0.95" d="
            M 91,100 C 81,116 79,134 83,153
            C 86,165 92,173 100,178
            C 96,162 95,147 98,132
            C 101,120 107,110 114,104
            C 106,101 98,100 91,100 Z
          "/>
          {/* Left side — secondary fall (looser strand) */}
          <path fill="url(#g-hair-base)" opacity="0.78" d="
            M 83,98 C 75,113 73,130 76,147
            C 79,160 86,170 92,176
            C 88,161 87,146 90,131
            C 92,119 97,109 100,102 Z
          "/>
          {/* Right side fall — primary */}
          <path fill="url(#g-hair-side)" opacity="0.95" d="
            M 169,100 C 179,116 181,134 177,153
            C 174,165 168,173 160,178
            C 164,162 165,147 162,132
            C 159,120 153,110 146,104
            C 154,101 162,100 169,100 Z
          "/>
          {/* Right side — secondary fall */}
          <path fill="url(#g-hair-base)" opacity="0.76" d="
            M 177,98 C 185,113 187,130 184,147
            C 181,160 174,170 168,176
            C 172,161 173,146 170,131
            C 168,119 163,109 160,102 Z
          "/>
          {/* Extra left ear-level loose strand */}
          <path fill="url(#g-hair-base)" opacity="0.72" d="
            M 84,105 C 77,118 74,134 77,150
            C 79,162 85,170 89,174
            C 86,160 85,145 88,131 Z
          "/>
          {/* Top left volume cluster */}
          <path fill="url(#g-hair-base)" opacity="0.88" d="
            M 97,56 C 103,45 111,39 119,42
            C 114,52 110,60 107,68
            C 103,63 100,59 97,56 Z
          "/>
          {/* Top centre-left sweep */}
          <path fill="url(#g-hair-base)" opacity="0.86" d="
            M 108,43 C 116,31 125,27 133,29
            C 141,25 151,28 157,39
            C 150,46 143,49 136,46
            C 130,44 121,42 115,43 Z
          "/>
          {/* Top right cluster */}
          <path fill="url(#g-hair-base)" opacity="0.82" d="
            M 148,39 C 158,31 167,31 172,40
            C 166,48 160,54 155,60
            C 151,53 149,46 148,39 Z
          "/>
          {/* Wild right strand — outside */}
          <path fill="url(#g-hair-base)" opacity="0.72" d="
            M 163,36 C 171,28 180,29 183,38
            C 177,46 169,53 164,59
            C 161,52 160,44 163,36 Z
          "/>
          {/* Wild left strand — outside */}
          <path fill="url(#g-hair-base)" opacity="0.68" d="
            M 97,46 C 90,38 84,36 81,44
            C 85,53 92,60 97,66
            C 99,58 99,52 97,46 Z
          "/>
          {/* Crown wisps */}
          <path fill="url(#g-hair-base)" opacity="0.62" d="
            M 115,32 C 117,24 122,20 128,22
            C 124,28 121,34 119,40 Z
          "/>
          <path fill="url(#g-hair-base)" opacity="0.58" d="
            M 145,32 C 143,24 138,20 132,22
            C 136,28 139,34 141,40 Z
          "/>
          {/* Crown micro-wisps */}
          <path fill="url(#g-hair-base)" opacity="0.5" d="M 130,28 C 129,22 130,18 131,22 Z"/>
          <path fill="url(#g-hair-base)" opacity="0.44" d="M 122,30 C 120,24 122,21 124,24 Z"/>
          <path fill="url(#g-hair-base)" opacity="0.44" d="M 138,30 C 140,24 138,21 136,24 Z"/>

          {/* Primary hair shine */}
          <path fill="url(#g-hair-shine1)" opacity="0.48" d="
            M 110,50 C 122,41 138,39 150,45
            C 143,53 134,56 125,55
            C 117,55 112,53 110,50 Z
          "/>
          {/* Secondary shine */}
          <path fill="url(#g-hair-shine2)" opacity="0.36" d="
            M 118,62 C 128,53 140,51 150,57
            C 142,63 132,66 122,65 Z
          "/>
          {/* Ambient hair glow */}
          <path fill="url(#g-hair-ambient)" opacity="0.38" d="
            M 106,46 C 118,38 136,36 150,42
            C 142,50 130,54 118,53 Z
          "/>

          {/* Hair strand texture lines — top */}
          <path d="M 122,68 C 130,58 138,55 146,58" fill="none" stroke="#3E2E24" strokeWidth="0.8" strokeLinecap="round" opacity="0.16"/>
          <path d="M 112,74 C 117,66 124,64 130,65" fill="none" stroke="#3E2E24" strokeWidth="0.75" strokeLinecap="round" opacity="0.13"/>
          <path d="M 148,70 C 154,65 160,64 165,66" fill="none" stroke="#3E2E24" strokeWidth="0.75" strokeLinecap="round" opacity="0.13"/>
          <path d="M 118,78 C 124,72 130,70 136,72" fill="none" stroke="#3E2E24" strokeWidth="0.7" strokeLinecap="round" opacity="0.11"/>
          {/* Side hair strand lines — left */}
          <path d="M 86,104 C 92,112 94,122 92,133"  fill="none" stroke="#3E2E24" strokeWidth="0.7" strokeLinecap="round" opacity="0.14"/>
          <path d="M 90,108 C 95,118 97,130 95,142"  fill="none" stroke="#3E2E24" strokeWidth="0.65" strokeLinecap="round" opacity="0.11"/>
          {/* Side hair strand lines — right */}
          <path d="M 174,104 C 168,112 166,122 168,133" fill="none" stroke="#3E2E24" strokeWidth="0.7" strokeLinecap="round" opacity="0.14"/>
          <path d="M 170,108 C 165,118 163,130 165,142" fill="none" stroke="#3E2E24" strokeWidth="0.65" strokeLinecap="round" opacity="0.11"/>
          {/* Hair part line */}
          <path d="M 130,36 C 132,52 133,68 133,84"
            fill="none" stroke="rgba(60,45,35,0.12)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>

          {/* ░░ LEFT EAR (partially visible under hair) ░░ */}
          <ellipse cx="82" cy="132" rx="10" ry="18" fill="url(#g-skin-ear)"/>
          {/* Ear inner structure */}
          <path d="M 80,122 C 77,126 76,132 77,138 C 78,144 81,148 84,150"
            fill="none" stroke="rgba(90,50,28,0.25)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
          {/* Ear antihelix */}
          <path d="M 79,126 C 77,130 77,135 79,140"
            fill="none" stroke="rgba(90,50,28,0.18)" strokeWidth="1.0" strokeLinecap="round" opacity="0.6"/>
          {/* Ear canal shadow */}
          <ellipse cx="81" cy="134" rx="3.5" ry="4" fill="rgba(60,30,14,0.22)" opacity="0.7"/>
          {/* Hair covering ear */}
          <path fill="url(#g-hair-side)" opacity="0.88" d="
            M 79,118 C 76,122 75,128 76,136
            C 77,142 80,148 84,152
            C 84,144 82,136 82,128
            C 82,124 81,120 79,118 Z
          "/>

          {/* ░░ FACE SHAPE ░░ */}
          <path fill="url(#g-skin-face)" d="
            M 89,115 C 89,65 109,39 130,37
            C 151,39 171,65 171,115
            C 171,152 161,185 143,207
            C 137,215 133,220 130,220
            C 127,220 123,215 117,207
            C 99,185 89,152 89,115 Z
          "/>
          {/* SSS overlay */}
          <ellipse cx="95"  cy="140" rx="30" ry="45" fill="url(#g-sss-left)"  opacity="0.5"/>
          <ellipse cx="165" cy="140" rx="30" ry="45" fill="url(#g-sss-right)" opacity="0.5"/>
          {/* Temple shadows */}
          <ellipse cx="93"  cy="110" rx="14" ry="22" fill="url(#g-temple-shad)" opacity="0.65"/>
          <ellipse cx="167" cy="110" rx="14" ry="22" fill="url(#g-temple-shad)" opacity="0.65"/>
          {/* Cheek blush */}
          <ellipse cx="94"  cy="143" rx="22" ry="15" fill="url(#g-cheek-blush-l)" opacity="0.75"/>
          <ellipse cx="166" cy="143" rx="22" ry="15" fill="url(#g-cheek-blush-r)" opacity="0.72"/>
          {/* Forehead highlight */}
          <ellipse cx="129" cy="79" rx="26" ry="15" fill="url(#g-forehead-hl)" opacity="1"/>
          {/* Glabella (between-brow shadow) */}
          <ellipse cx="130" cy="96" rx="8" ry="5" fill="rgba(0,0,0,0.05)" opacity="0.7"/>
          {/* Jaw depth */}
          <ellipse cx="130" cy="213" rx="32" ry="13" fill="url(#g-jaw-depth)" opacity="0.78"/>
          {/* Chin highlight */}
          <ellipse cx="130" cy="208" rx="8" ry="4" fill="rgba(200,150,100,0.1)" opacity="0.7"/>
          {/* Cheekbone highlight */}
          <ellipse cx="100" cy="130" rx="12" ry="7" fill="rgba(210,160,110,0.12)" opacity="0.7" transform="rotate(-15,100,130)"/>
          <ellipse cx="160" cy="130" rx="12" ry="7" fill="rgba(210,160,110,0.1)"  opacity="0.7" transform="rotate(15,160,130)"/>
          {/* Nasolabial folds */}
          <path d="M 108,158 C 107,163 107,170 110,176 C 112,180 114,182 115,183"
            fill="none" stroke="rgba(100,50,24,0.2)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
          <path d="M 152,158 C 153,163 153,170 150,176 C 148,180 146,182 145,183"
            fill="none" stroke="rgba(100,50,24,0.18)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
          {/* Nose bridge shadow */}
          <rect x="128" y="136" width="6" height="26" rx="3" fill="url(#g-nose-hl)" opacity="0.52"/>
          {/* Chin crease */}
          <path d="M 123,212 C 126,215 130,216 134,215 C 137,215 139,213 140,211"
            fill="none" stroke="rgba(80,40,18,0.12)" strokeWidth="1.1" strokeLinecap="round" opacity="0.65"/>

          {/* ░░ FRINGE (animated) ░░ */}
          <g className="ayrin-fringe">
            {/* Left fringe */}
            <path fill="url(#g-hair-base)" d="
              M 100,90 C 108,99 111,110 109,122
              C 104,116 98,112 92,110
              C 95,102 97,95 100,90 Z
            "/>
            {/* Centre-left fringe */}
            <path fill="url(#g-hair-base)" opacity="0.97" d="
              M 119,84 C 127,95 129,106 127,120
              C 123,113 118,108 113,104
              C 115,96 117,89 119,84 Z
            "/>
            {/* Centre-right fringe */}
            <path fill="url(#g-hair-base)" d="
              M 139,86 C 147,96 149,108 147,120
              C 143,114 138,109 132,105
              C 134,97 137,91 139,86 Z
            "/>
            {/* Wild asymmetric strand */}
            <path fill="url(#g-hair-base)" opacity="0.74" d="
              M 106,88 C 101,78 102,67 107,60
              C 112,67 114,78 112,90 Z
            "/>
            {/* Extra left wisp over forehead */}
            <path fill="url(#g-hair-base)" opacity="0.66" d="
              M 113,82 C 109,72 109,62 113,55
              C 117,62 118,72 116,82 Z
            "/>
            {/* Right forward wisp */}
            <path fill="url(#g-hair-base)" opacity="0.6" d="
              M 148,84 C 152,76 152,67 149,60
              C 145,67 144,76 146,84 Z
            "/>
            {/* Fringe shine */}
            <path fill="url(#g-hair-shine1)" opacity="0.32" d="
              M 107,90 C 113,99 115,109 113,121
              C 109,115 105,111 100,108
              C 103,100 105,94 107,90 Z
            "/>
            <path fill="url(#g-hair-shine2)" opacity="0.28" d="
              M 125,85 C 131,95 133,105 131,117
              C 127,111 123,107 119,104
              C 121,97 123,90 125,85 Z
            "/>
            {/* Fringe strand micro-lines */}
            <path d="M 108,90 C 112,99 113,109 112,120"  fill="none" stroke="#4A3A2C" strokeWidth="0.75" strokeLinecap="round" opacity="0.18"/>
            <path d="M 112,88 C 116,97 117,107 116,118"  fill="none" stroke="#4A3A2C" strokeWidth="0.7"  strokeLinecap="round" opacity="0.14"/>
            <path d="M 125,85 C 129,95 130,104 129,116"  fill="none" stroke="#4A3A2C" strokeWidth="0.75" strokeLinecap="round" opacity="0.16"/>
            <path d="M 130,84 C 133,94 134,103 133,115"  fill="none" stroke="#4A3A2C" strokeWidth="0.7"  strokeLinecap="round" opacity="0.13"/>
            <path d="M 142,87 C 146,97 147,107 145,118"  fill="none" stroke="#4A3A2C" strokeWidth="0.75" strokeLinecap="round" opacity="0.15"/>
            <path d="M 147,86 C 151,95 152,104 150,116"  fill="none" stroke="#4A3A2C" strokeWidth="0.7"  strokeLinecap="round" opacity="0.12"/>
          </g>

          {/* ░░ EYEBROWS — thick, natural, directional hairs ░░ */}
          {/* LEFT brow — 3-layer system */}
          <path d="M 87,103 C 96,95 105,92 121,96"
            fill="none" stroke="#070504" strokeWidth="6.2" strokeLinecap="round" opacity="0.82"/>
          <path d="M 87,103 C 96,95 105,92 121,96"
            fill="none" stroke="#130F0A" strokeWidth="3.8" strokeLinecap="round" opacity="0.52"/>
          <path d="M 88,103 C 96,96 104,93 119,96"
            fill="none" stroke="#1E1814" strokeWidth="1.8" strokeLinecap="round" opacity="0.32"/>
          {/* Left brow directional hairs */}
          <path d="M 89,103 C 90,101 92,99 94,98"   fill="none" stroke="#050302" strokeWidth="0.85" strokeLinecap="round" opacity="0.28"/>
          <path d="M 93,100 C 95,98 97,97 100,97"   fill="none" stroke="#050302" strokeWidth="0.85" strokeLinecap="round" opacity="0.24"/>
          <path d="M 100,96 C 103,95 106,95 109,95"  fill="none" stroke="#050302" strokeWidth="0.85" strokeLinecap="round" opacity="0.22"/>
          <path d="M 108,94 C 111,94 114,94 118,95"  fill="none" stroke="#050302" strokeWidth="0.82" strokeLinecap="round" opacity="0.2"/>
          {/* Left brow lower edge */}
          <path d="M 89,104 C 97,97 105,94 119,97"
            fill="none" stroke="#030200" strokeWidth="1.0" strokeLinecap="round" opacity="0.15"/>
          {/* LEFT brow tail highlight */}
          <path d="M 116,96 C 118,97 120,97 121,96"
            fill="none" stroke="#3A2C22" strokeWidth="0.7" strokeLinecap="round" opacity="0.18"/>

          {/* RIGHT brow — slight asymmetry */}
          <path d="M 139,96 C 155,92 165,95 173,103"
            fill="none" stroke="#070504" strokeWidth="6.2" strokeLinecap="round" opacity="0.8"/>
          <path d="M 139,96 C 155,92 165,95 173,103"
            fill="none" stroke="#130F0A" strokeWidth="3.8" strokeLinecap="round" opacity="0.5"/>
          <path d="M 140,96 C 155,93 165,95 172,103"
            fill="none" stroke="#1E1814" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
          {/* Right brow directional hairs */}
          <path d="M 141,95 C 143,94 146,93 148,93"  fill="none" stroke="#050302" strokeWidth="0.85" strokeLinecap="round" opacity="0.26"/>
          <path d="M 148,93 C 151,93 154,93 157,94"  fill="none" stroke="#050302" strokeWidth="0.85" strokeLinecap="round" opacity="0.23"/>
          <path d="M 157,94 C 160,95 163,96 165,97"  fill="none" stroke="#050302" strokeWidth="0.82" strokeLinecap="round" opacity="0.21"/>
          <path d="M 164,97 C 167,99 169,101 171,102" fill="none" stroke="#050302" strokeWidth="0.82" strokeLinecap="round" opacity="0.19"/>
          <path d="M 140,97 C 155,94 165,96 172,103"
            fill="none" stroke="#030200" strokeWidth="1.0" strokeLinecap="round" opacity="0.14"/>

          {/* ═══════════════════════════════════
              LEFT EYE — premium detail
              ═══════════════════════════════════ */}
          {/* Sclera */}
          <path d="M 87,115 C 92,104 100,98 107,98 C 114,98 122,104 127,115 C 122,125 114,129 107,129 C 100,129 92,125 87,115 Z"
            fill="url(#g-sclera)"/>
          {/* Sclera vein — subtle */}
          <path d="M 90,116 C 93,114 96,113 98,114"
            fill="none" stroke="rgba(200,120,120,0.12)" strokeWidth="0.5" strokeLinecap="round"/>
          {/* Iris */}
          <ellipse cx="107" cy="115" rx="13" ry="12.8" fill="url(#g-iris)" clipPath="url(#cp-left-eye)"/>
          {/* Iris depth */}
          <ellipse cx="107" cy="115" rx="13" ry="12.8" fill="url(#g-iris-depth)" clipPath="url(#cp-left-eye)"/>
          {/* Iris texture — radial rays */}
          {[0,22,44,66,88,110,132,154,176,198,220,242,264,286,308,330].map((angle,i) => {
            const rad = angle * Math.PI / 180;
            const x1 = 107 + 7.2 * Math.cos(rad);
            const y1 = 115 + 7.0 * Math.sin(rad);
            const x2 = 107 + 10.8 * Math.cos(rad);
            const y2 = 115 + 10.5 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#3A1E08" strokeWidth="0.5" opacity="0.15" clipPath="url(#cp-left-eye)"/>;
          })}
          {/* Pupil */}
          <ellipse cx="107" cy="115" rx="5.8" ry="5.8" fill="#020006" clipPath="url(#cp-left-eye)"/>
          {/* Pupil depth ring */}
          <ellipse cx="107" cy="115" rx="4.2" ry="4.2" fill="none" stroke="#0A0412" strokeWidth="1.2" opacity="0.4" clipPath="url(#cp-left-eye)"/>
          {/* Primary catchlight */}
          <ellipse cx="110.2" cy="110.6" rx="2.5" ry="2.3" fill="#FFF" opacity="0.92"/>
          {/* Secondary catchlight */}
          <ellipse cx="103.2" cy="119.5" rx="1.1" ry="1.0" fill="#FFF" opacity="0.4"/>
          {/* Corneal reflection arc */}
          <path d="M 104,109 C 107,108 110,109 112,111"
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeLinecap="round" clipPath="url(#cp-left-eye)"/>
          {/* Limbal ring */}
          <ellipse cx="107" cy="115" rx="9.4" ry="9.2"
            fill="none" stroke="#1C0804" strokeWidth="0.9" opacity="0.28" clipPath="url(#cp-left-eye)"/>
          {/* Upper lid — heavy droop */}
          {blink ? (
            <path d="M 88,115 C 96,111 101,110 107,110 C 113,110 118,111 126,115"
              fill="none" stroke="#03010C" strokeWidth="11.8" strokeLinecap="round"/>
          ) : (
            <>
              <path d="M 87,113 C 92,103 100,98 107,98 C 114,98 122,103 127,113
                C 118,109 112,108 107,109 C 102,108 94,109 87,113 Z"
                fill="#03010C" opacity="0.93"/>
              {/* Lid crease */}
              <path d="M 89,114 C 94,108 101,106 107,107 C 113,106 120,108 125,113"
                fill="none" stroke="#03010A" strokeWidth="2.5" strokeLinecap="round" opacity="0.28"/>
              {/* Double lid fold hint */}
              <path d="M 91,115 C 96,110 102,108 107,109 C 112,108 118,110 123,114"
                fill="none" stroke="#03010A" strokeWidth="1.0" strokeLinecap="round" opacity="0.1"/>
            </>
          )}
          {/* Lower lash line */}
          <path d="M 90,121 C 98,128 107,130 124,122"
            fill="none" stroke="#03010A" strokeWidth="1.1" opacity="0.16" strokeLinecap="round"/>
          {/* Under-eye shadow */}
          <path d="M 90,122 C 98,130 107,132 123,123"
            fill="none" stroke="#6A3C1C" strokeWidth="5" strokeLinecap="round" opacity="0.1"/>
          <path d="M 90,121 C 98,129 107,131 124,122"
            fill="none" stroke="url(#g-eye-water)" strokeWidth="1.7" opacity="0.26" strokeLinecap="round"/>
          {/* Upper eyelashes — individual curved strokes */}
          {!blink && <>
            <path d="M 89,112 C 87,108 86,104 87,101"   fill="none" stroke="#02000A" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
            <path d="M 93,109 C 92,105 92,101 93,98"    fill="none" stroke="#02000A" strokeWidth="1.1" strokeLinecap="round" opacity="0.72"/>
            <path d="M 98,107 C 97,103 98,99 99,96"     fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.68"/>
            <path d="M 103,106 C 103,102 104,98 105,95"  fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.66"/>
            <path d="M 108,106 C 108,102 109,99 110,96"  fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.65"/>
            <path d="M 113,107 C 114,103 115,100 117,97" fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.67"/>
            <path d="M 118,109 C 120,105 122,102 124,100" fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.68"/>
            <path d="M 122,112 C 125,108 127,105 128,103" fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.66"/>
          </>}
          {/* Lower lashes — shorter */}
          <path d="M 91,122 C 90,125 89,127 89,129"  fill="none" stroke="#02000A" strokeWidth="0.75" strokeLinecap="round" opacity="0.32"/>
          <path d="M 96,125 C 95,128 95,130 95,132"  fill="none" stroke="#02000A" strokeWidth="0.75" strokeLinecap="round" opacity="0.3"/>
          <path d="M 102,127 C 101,130 101,132 101,134" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.28"/>
          <path d="M 108,128 C 108,131 108,133 108,135" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.26"/>
          <path d="M 114,127 C 115,130 115,132 115,134" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.26"/>
          <path d="M 119,124 C 120,127 121,129 122,131" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.28"/>
          {/* Tear duct */}
          <path d="M 85,114 L 81,111" fill="none" stroke="#03010A" strokeWidth="1.2" strokeLinecap="round" opacity="0.24"/>
          <ellipse cx="87" cy="116" rx="2.2" ry="1.5" fill="#B86060" opacity="0.14"/>
          {/* Eye shadow (lid colour) */}
          {!blink && <path d="M 90,112 C 97,108 107,107 122,111"
            fill="none" stroke="rgba(80,40,20,0.12)" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>}

          {/* ═══════════════════════════════════
              RIGHT EYE — premium detail
              ═══════════════════════════════════ */}
          <path d="M 133,115 C 138,104 146,98 153,98 C 160,98 168,104 173,115 C 168,125 160,129 153,129 C 146,129 138,125 133,115 Z"
            fill="url(#g-sclera)"/>
          <path d="M 170,116 C 167,114 164,113 162,114"
            fill="none" stroke="rgba(200,120,120,0.12)" strokeWidth="0.5" strokeLinecap="round"/>
          <ellipse cx="153" cy="115" rx="13" ry="12.8" fill="url(#g-iris)" clipPath="url(#cp-right-eye)"/>
          <ellipse cx="153" cy="115" rx="13" ry="12.8" fill="url(#g-iris-depth)" clipPath="url(#cp-right-eye)"/>
          {[0,22,44,66,88,110,132,154,176,198,220,242,264,286,308,330].map((angle,i) => {
            const rad = angle * Math.PI / 180;
            const x1 = 153 + 7.2 * Math.cos(rad);
            const y1 = 115 + 7.0 * Math.sin(rad);
            const x2 = 153 + 10.8 * Math.cos(rad);
            const y2 = 115 + 10.5 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#3A1E08" strokeWidth="0.5" opacity="0.15" clipPath="url(#cp-right-eye)"/>;
          })}
          <ellipse cx="153" cy="115" rx="5.8" ry="5.8" fill="#020006" clipPath="url(#cp-right-eye)"/>
          <ellipse cx="153" cy="115" rx="4.2" ry="4.2" fill="none" stroke="#0A0412" strokeWidth="1.2" opacity="0.4" clipPath="url(#cp-right-eye)"/>
          <ellipse cx="156.2" cy="110.6" rx="2.5" ry="2.3" fill="#FFF" opacity="0.92"/>
          <ellipse cx="149.2" cy="119.5" rx="1.1" ry="1.0" fill="#FFF" opacity="0.4"/>
          <path d="M 150,109 C 153,108 156,109 158,111"
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeLinecap="round" clipPath="url(#cp-right-eye)"/>
          <ellipse cx="153" cy="115" rx="9.4" ry="9.2"
            fill="none" stroke="#1C0804" strokeWidth="0.9" opacity="0.28" clipPath="url(#cp-right-eye)"/>
          {blink ? (
            <path d="M 134,115 C 142,111 147,110 153,110 C 159,110 164,111 172,115"
              fill="none" stroke="#03010C" strokeWidth="11.8" strokeLinecap="round"/>
          ) : (
            <>
              <path d="M 133,113 C 138,103 146,98 153,98 C 160,98 168,103 173,113
                C 164,109 158,108 153,109 C 148,108 140,109 133,113 Z"
                fill="#03010C" opacity="0.93"/>
              <path d="M 135,114 C 140,108 147,106 153,107 C 159,106 166,108 171,113"
                fill="none" stroke="#03010A" strokeWidth="2.5" strokeLinecap="round" opacity="0.28"/>
              <path d="M 137,115 C 142,110 148,108 153,109 C 158,108 164,110 169,114"
                fill="none" stroke="#03010A" strokeWidth="1.0" strokeLinecap="round" opacity="0.1"/>
            </>
          )}
          <path d="M 136,121 C 144,128 153,130 170,122"
            fill="none" stroke="#03010A" strokeWidth="1.1" opacity="0.16" strokeLinecap="round"/>
          <path d="M 136,122 C 144,130 153,132 169,123"
            fill="none" stroke="#6A3C1C" strokeWidth="5" strokeLinecap="round" opacity="0.1"/>
          <path d="M 136,121 C 144,129 153,131 170,122"
            fill="none" stroke="url(#g-eye-water)" strokeWidth="1.7" opacity="0.26" strokeLinecap="round"/>
          {!blink && <>
            <path d="M 135,112 C 133,108 132,104 133,101"  fill="none" stroke="#02000A" strokeWidth="1.1" strokeLinecap="round" opacity="0.68"/>
            <path d="M 139,109 C 138,105 138,101 139,98"   fill="none" stroke="#02000A" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
            <path d="M 144,107 C 143,103 144,99 145,96"    fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.68"/>
            <path d="M 149,106 C 149,102 150,98 151,95"    fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.66"/>
            <path d="M 154,106 C 154,102 155,99 156,96"    fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.65"/>
            <path d="M 159,107 C 160,103 161,100 163,97"   fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.67"/>
            <path d="M 163,109 C 165,105 167,102 169,100"  fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.68"/>
            <path d="M 167,112 C 170,108 172,105 173,103"  fill="none" stroke="#02000A" strokeWidth="1.0" strokeLinecap="round" opacity="0.66"/>
          </>}
          <path d="M 137,122 C 136,125 135,127 135,129" fill="none" stroke="#02000A" strokeWidth="0.75" strokeLinecap="round" opacity="0.32"/>
          <path d="M 142,125 C 141,128 141,130 141,132" fill="none" stroke="#02000A" strokeWidth="0.75" strokeLinecap="round" opacity="0.3"/>
          <path d="M 148,127 C 147,130 147,132 147,134" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.28"/>
          <path d="M 154,128 C 154,131 154,133 154,135" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.26"/>
          <path d="M 160,127 C 161,130 161,132 161,134" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.26"/>
          <path d="M 165,124 C 166,127 167,129 168,131" fill="none" stroke="#02000A" strokeWidth="0.7"  strokeLinecap="round" opacity="0.28"/>
          <path d="M 175,114 L 179,111" fill="none" stroke="#03010A" strokeWidth="1.2" strokeLinecap="round" opacity="0.24"/>
          <ellipse cx="173" cy="116" rx="2.2" ry="1.5" fill="#B86060" opacity="0.14"/>
          {!blink && <path d="M 136,112 C 143,108 153,107 168,111"
            fill="none" stroke="rgba(80,40,20,0.12)" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>}

          {/* ░░ NOSE — fully sculpted ░░ */}
          {/* Bridge sides */}
          <path d="M 126,138 C 124,150 123,160 125,168 C 127,171 130,172 133,171 C 135,169 136,160 135,149 C 134,140 133,138 132,137"
            fill="none" stroke="#7C4622" strokeWidth="1.05" strokeLinecap="round" opacity="0.28"/>
          {/* Bridge highlight */}
          <path d="M 130,140 C 131,150 131,159 130,167"
            fill="none" stroke="#E0AA68" strokeWidth="0.7" strokeLinecap="round" opacity="0.22"/>
          {/* Bridge narrow shadow */}
          <path d="M 128,140 C 127,150 127,158 128,166"
            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          {/* Nose tip */}
          <ellipse cx="130" cy="169" rx="8" ry="5" fill="url(#g-nose-tip)" opacity="0.7"/>
          {/* Alar wing — left */}
          <path d="M 118,166 C 121,163 124,162 126,163 C 128,164 129,166 128,169 C 126,172 122,173 119,170 Z"
            fill="rgba(0,0,0,0.04)" opacity="0.7"/>
          {/* Alar wing — right */}
          <path d="M 142,166 C 139,163 136,162 134,163 C 132,164 131,166 132,169 C 134,172 138,173 141,170 Z"
            fill="rgba(0,0,0,0.04)" opacity="0.7"/>
          {/* Nostril shadows */}
          <path d="M 119,167 C 122,171 126,172 129,171" fill="none" stroke="#4A2210" strokeWidth="1.6" strokeLinecap="round" opacity="0.26"/>
          <path d="M 141,167 C 138,171 134,172 131,171" fill="none" stroke="#4A2210" strokeWidth="1.6" strokeLinecap="round" opacity="0.26"/>
          {/* Alar shadow patches */}
          <ellipse cx="123" cy="166" rx="4"  ry="2.4" fill="#6A3818" opacity="0.12"/>
          <ellipse cx="137" cy="166" rx="4"  ry="2.4" fill="#6A3818" opacity="0.12"/>
          {/* Under-nose shadow */}
          <ellipse cx="130" cy="172" rx="8" ry="3.5" fill="rgba(0,0,0,0.06)" opacity="0.7"/>
          {/* Philtrum groove */}
          <path d="M 128,172 C 128,176 129,179 130,180" fill="none" stroke="url(#g-philtrum)" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
          <path d="M 132,172 C 132,176 131,179 130,180" fill="none" stroke="url(#g-philtrum)" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
          {/* Philtrum ridge highlight */}
          <path d="M 130,172 C 130,176 130,179 130,181"
            fill="none" stroke="rgba(210,160,110,0.18)" strokeWidth="0.8" strokeLinecap="round"/>

          {/* ═══════════════════════════════════════════════
              FACIAL HAIR — dense, realistic, multi-layered
              ═══════════════════════════════════════════════ */}

          {/* ── MUSTACHE — 4-layer system ── */}
          {/* Layer 1: base mass shadow */}
          <ellipse cx="130" cy="174" rx="16" ry="5" fill="url(#g-mustache-fill)" opacity="0.5"/>
          {/* Layer 2: thick stroke */}
          <path d="M 115,176 C 119,170 123,167 127.5,169 C 129,169 131,169 132.5,169 C 137,167 141,170 145,176"
            fill="none" stroke="#0A0806" strokeWidth="4.5" strokeLinecap="round" opacity="0.58"/>
          {/* Layer 3: definition */}
          <path d="M 117,176 C 121,172 124.5,170 128,171 C 129.5,171 130.5,171 132,171.5 C 136,172 139,173 142,176"
            fill="none" stroke="#161210" strokeWidth="2.6" strokeLinecap="round" opacity="0.45"/>
          {/* Layer 4: fine hairs — systematic coverage */}
          <path d="M 118,176 C 119,174 121,172.5 123,172" fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.24"/>
          <path d="M 120,175 C 121,173 123,172 125,172"  fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.22"/>
          <path d="M 123,173 C 125,172 127,172 128.5,172" fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.2"/>
          <path d="M 126,172 C 127.5,172 129,172 130,172"  fill="none" stroke="#060402" strokeWidth="0.82" strokeLinecap="round" opacity="0.18"/>
          <path d="M 129.5,172 C 131,172 132.5,172 134,172.5" fill="none" stroke="#060402" strokeWidth="0.82" strokeLinecap="round" opacity="0.18"/>
          <path d="M 133,172.5 C 135,173 137,174 139,175"   fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.2"/>
          <path d="M 137,174 C 139,175 141,176 142,177"     fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.22"/>
          <path d="M 140,175 C 142,176 144,177 145,177"     fill="none" stroke="#060402" strokeWidth="0.85" strokeLinecap="round" opacity="0.24"/>
          {/* Philtrum divot accent */}
          <path d="M 129,171 C 129.5,173 130,174.5 130,176" fill="none" stroke="#0A0806" strokeWidth="1.4" strokeLinecap="round" opacity="0.18"/>
          <path d="M 131,171 C 130.5,173 130,174.5 130,176" fill="none" stroke="#0A0806" strokeWidth="1.4" strokeLinecap="round" opacity="0.14"/>
          {/* Corner mustache wisp */}
          <path d="M 116,176 C 115,175 115,173 116,172" fill="none" stroke="#080604" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
          <path d="M 144,176 C 145,175 145,173 144,172" fill="none" stroke="#080604" strokeWidth="0.8" strokeLinecap="round" opacity="0.18"/>

          {/* ── CHIN / GOATEE — dense ── */}
          {/* Base fill */}
          <ellipse cx="130" cy="204" rx="14" ry="8" fill="url(#g-stubble-chin)" opacity="0.7"/>
          {/* Outline mass */}
          <path d="M 118,195 C 122,204 126,210 130,212 C 134,210 138,204 142,195"
            fill="none" stroke="#0A0806" strokeWidth="4.3" strokeLinecap="round" opacity="0.5"/>
          <path d="M 120,195 C 124,204 127.5,209 130,211 C 132.5,209 136,204 140,195"
            fill="none" stroke="#181410" strokeWidth="2.5" strokeLinecap="round" opacity="0.38"/>
          {/* Goatee individual hairs — 12 strokes */}
          <path d="M 122,198 C 123,204 124,208 124,211" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.22"/>
          <path d="M 125,197 C 126,203 126.5,207 126,211" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 128,196 C 128.5,203 128.5,207 128,211" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 130,196 C 130,203 130,207 130,211"    fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 132,196 C 131.5,203 131.5,207 132,211" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 135,197 C 134,203 133.5,207 134,211"  fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 138,198 C 137,204 136,208 136,211"   fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.22"/>
          {/* Chin edge hairs */}
          <path d="M 119,197 C 120,201 121,204 121,207" fill="none" stroke="#060402" strokeWidth="0.7" strokeLinecap="round" opacity="0.18"/>
          <path d="M 141,197 C 140,201 139,204 139,207" fill="none" stroke="#060402" strokeWidth="0.7" strokeLinecap="round" opacity="0.18"/>
          {/* Soul patch above goatee */}
          <ellipse cx="130" cy="194" rx="4" ry="2.5" fill="#080604" opacity="0.16"/>
          <path d="M 128,192 C 129,194 130,195.5 130,197" fill="none" stroke="#050302" strokeWidth="0.7" strokeLinecap="round" opacity="0.18"/>
          <path d="M 132,192 C 131,194 130,195.5 130,197" fill="none" stroke="#050302" strokeWidth="0.7" strokeLinecap="round" opacity="0.16"/>

          {/* ── JAW STUBBLE — dense field ── */}
          {/* Left jaw gradient base */}
          <ellipse cx="97"  cy="181" rx="19" ry="13" fill="url(#g-stubble-jaw)" opacity="0.88"/>
          <ellipse cx="100" cy="171" rx="13" ry="10" fill="url(#g-stubble-jaw)" opacity="0.56"/>
          <ellipse cx="106" cy="164" rx="8"  ry="7"  fill="url(#g-stubble-jaw)" opacity="0.36"/>
          {/* Right jaw gradient base */}
          <ellipse cx="163" cy="181" rx="19" ry="13" fill="url(#g-stubble-jaw)" opacity="0.88"/>
          <ellipse cx="160" cy="171" rx="13" ry="10" fill="url(#g-stubble-jaw)" opacity="0.56"/>
          <ellipse cx="154" cy="164" rx="8"  ry="7"  fill="url(#g-stubble-jaw)" opacity="0.36"/>
          {/* Left stubble strokes — row 1 (high) */}
          <path d="M 96,166 C 98,169 98,172 97,174"  fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.13"/>
          <path d="M 100,165 C 102,168 102,171 101,173" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 104,164 C 106,167 106,170 105,172" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.1"/>
          <path d="M 108,164 C 110,167 110,170 109,172" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Left stubble strokes — row 2 (mid) */}
          <path d="M 91,173 C 93,177 93,180 92,182"   fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.13"/>
          <path d="M 95,172 C 97,176 97,179 96,182"   fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.12"/>
          <path d="M 99,171 C 101,175 101,178 100,181" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 103,170 C 105,174 105,177 104,180" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 107,170 C 109,173 109,176 108,179" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          <path d="M 111,170 C 112,173 112,176 111,179" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Left stubble strokes — row 3 (low) */}
          <path d="M 93,182 C 95,186 95,190 94,192"   fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.12"/>
          <path d="M 97,181 C 99,185 99,189 98,192"   fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 101,180 C 103,184 103,188 102,191" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 105,179 C 107,183 107,187 106,190" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 109,179 C 111,182 111,186 110,189" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          <path d="M 113,179 C 114,182 114,186 113,188" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Right stubble strokes — row 1 */}
          <path d="M 164,166 C 162,169 162,172 163,174" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.13"/>
          <path d="M 160,165 C 158,168 158,171 159,173" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 156,164 C 154,167 154,170 155,172" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.1"/>
          <path d="M 152,164 C 150,167 150,170 151,172" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Right stubble strokes — row 2 */}
          <path d="M 169,173 C 167,177 167,180 168,182" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.13"/>
          <path d="M 165,172 C 163,176 163,179 164,182" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.12"/>
          <path d="M 161,171 C 159,175 159,178 160,181" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 157,170 C 155,174 155,177 156,180" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 153,170 C 151,173 151,176 152,179" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          <path d="M 149,170 C 148,173 148,176 149,179" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Right stubble strokes — row 3 */}
          <path d="M 167,182 C 165,186 165,190 166,192" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.12"/>
          <path d="M 163,181 C 161,185 161,189 162,192" fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity="0.11"/>
          <path d="M 159,180 C 157,184 157,188 158,191" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 155,179 C 153,183 153,187 154,190" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.1"/>
          <path d="M 151,179 C 149,182 149,186 150,189" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          <path d="M 147,179 C 146,182 146,186 147,188" fill="none" stroke="#080604" strokeWidth="0.6"  strokeLinecap="round" opacity="0.09"/>
          {/* Jaw-to-chin bridge strokes */}
          <path d="M 110,192 C 112,195 112,198 111,200" fill="none" stroke="#080604" strokeWidth="0.58" strokeLinecap="round" opacity="0.1"/>
          <path d="M 114,191 C 115,194 115,197 114,199" fill="none" stroke="#080604" strokeWidth="0.58" strokeLinecap="round" opacity="0.09"/>
          <path d="M 150,192 C 148,195 148,198 149,200" fill="none" stroke="#080604" strokeWidth="0.58" strokeLinecap="round" opacity="0.1"/>
          <path d="M 146,191 C 145,194 145,197 146,199" fill="none" stroke="#080604" strokeWidth="0.58" strokeLinecap="round" opacity="0.09"/>

          {/* ═══════════════════════════
              MOUTH (animated)
              ═══════════════════════════ */}
          <g className="ayrin-mouth">
            {/* Upper lip — cupid's bow, 3 layers */}
            <path d="
              M 115,183 C 119,175 123,172 127,174
              C 128.8,171 131.2,171 133,174
              C 137,172 141,175 145,183
              C 141,179 137,178 132.5,179
              C 130.2,177.5 129.8,177.5 127.5,179
              C 123,178 119,179 115,183 Z
            " fill="url(#g-lip-upper)" opacity="0.9"/>
            {/* Upper lip gloss */}
            <path d="M 119,181 C 123,179 127,178.5 134,179.5"
              fill="none" stroke="rgba(230,190,200,0.22)" strokeWidth="0.85" strokeLinecap="round"/>
            {/* Upper lip edge line */}
            <path d="M 116,183 C 120,175.5 124,173 127.5,175"
              fill="none" stroke="rgba(80,30,28,0.15)" strokeWidth="0.6" strokeLinecap="round"/>
            <path d="M 144,183 C 140,175.5 136,173 132.5,175"
              fill="none" stroke="rgba(80,30,28,0.15)" strokeWidth="0.6" strokeLinecap="round"/>
            {/* Mouth line shadow */}
            <path d="M 117,183 C 122,182 127,181.8 130,182 C 133,181.8 138,182 143,183"
              fill="none" stroke="rgba(40,12,10,0.28)" strokeWidth="0.85" strokeLinecap="round" opacity="0.7"/>
            {/* Lower lip — fuller, 3 layers */}
            <path d="
              M 116,183 C 119,192 124,197.5 129.5,199
              C 132,199.5 134.5,198.5 137.5,196.5
              C 142.5,193.5 145,188.5 145,183
              C 141,188 137,191 130,191.5
              C 123,191 119,188 116,183 Z
            " fill="url(#g-lip-lower)" opacity="0.9"/>
            {/* Lower lip highlight line */}
            <path d="M 122,190 C 126,192 130,193 135,191.5"
              fill="none" stroke="rgba(230,185,190,0.24)" strokeWidth="0.9" strokeLinecap="round"/>
            {/* Lower lip gloss */}
            <ellipse cx="130" cy="192" rx="9.5" ry="3.8" fill="url(#g-lip-gloss)" opacity="0.22"/>
            {/* Lip crease */}
            <path d="M 124,191 C 127,192.5 130,193 133.5,192"
              fill="none" stroke="rgba(48,20,18,0.2)" strokeWidth="0.82" strokeLinecap="round"/>
            {/* Inner lip darkness */}
            <ellipse cx="130" cy="183.5" rx="15" ry="2.5" fill="url(#g-lip-inner)" opacity="0.3"/>
            {/* Corner depth */}
            <path d="M 116,183 C 115,184.8 115.2,186.5 116,187.5"  fill="none" stroke="#542A28" strokeWidth="0.9" strokeLinecap="round" opacity="0.2"/>
            <path d="M 145,183 C 146,185 145.8,186.8 145,188"       fill="none" stroke="#542A28" strokeWidth="0.9" strokeLinecap="round" opacity="0.17"/>
            {/* Lip skin texture lines */}
            <path d="M 120,185 C 121,186.5 122,188 123,190"  fill="none" stroke="rgba(80,36,32,0.1)" strokeWidth="0.55" strokeLinecap="round"/>
            <path d="M 125,184 C 126,186 127,188.5 128,191"  fill="none" stroke="rgba(80,36,32,0.08)" strokeWidth="0.55" strokeLinecap="round"/>
            <path d="M 130,183.5 C 130,186 130,189 130,192"  fill="none" stroke="rgba(80,36,32,0.08)" strokeWidth="0.55" strokeLinecap="round"/>
            <path d="M 135,184 C 134,186 133,188.5 132,191"  fill="none" stroke="rgba(80,36,32,0.08)" strokeWidth="0.55" strokeLinecap="round"/>
            <path d="M 140,185 C 139,186.5 138,188 137,190"  fill="none" stroke="rgba(80,36,32,0.1)" strokeWidth="0.55" strokeLinecap="round"/>
          </g>

        </g>{/* end .ayrin-head */}
      </g>{/* end .ayrin-breath */}
    </svg>
  );
}