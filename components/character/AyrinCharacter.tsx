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

  /* ── iris fiber angles for both eyes ── */
  const irisAngles = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      viewBox="0 0 260 720"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
      aria-label="Ayrin character illustration"
      role="img"
    >
      {/* ═══════════════════════════════════════════
          STYLES + ANIMATIONS
          ═══════════════════════════════════════════ */}
      <style>{`
        .ayrin-breath { transform-origin:130px 502px; animation:ayrin-breath 6s ease-in-out infinite; }
        .ayrin-head   { transform-origin:130px 168px; animation:ayrin-head 6.4s ease-in-out infinite; }
        .ayrin-mouth  { transform-origin:130px 184px; animation:ayrin-mouth 6s ease-in-out infinite; }
        .ayrin-fringe { transform-origin:130px 90px;  animation:ayrin-fringe 7.2s ease-in-out infinite; }
        @keyframes ayrin-breath {
          0%,100%{ transform:translateY(0px) scaleY(1); }
          50%    { transform:translateY(-2px) scaleY(1.012); }
        }
        @keyframes ayrin-head {
          0%,100%{ transform:rotate(-3.8deg) translateY(0px); }
          50%    { transform:rotate(-5deg) translateY(-1px); }
        }
        @keyframes ayrin-mouth {
          0%,100%{ transform:translateY(0px) scaleY(1); }
          50%    { transform:translateY(0.7px) scaleY(1.06); }
        }
        @keyframes ayrin-fringe {
          0%,100%{ transform:rotate(0deg) translateY(0px); }
          50%    { transform:rotate(-0.8deg) translateY(0.8px); }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          DEFS
          ═══════════════════════════════════════════ */}
      <defs>

        {/* ── SKIN TEXTURE PATTERN ── */}
        <pattern id="p-skin-tex" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="none"/>
          <circle cx="2" cy="2" r="0.4" fill="#7A3C1A" opacity="0.06"/>
          <circle cx="6" cy="5" r="0.35" fill="#7A3C1A" opacity="0.05"/>
          <circle cx="4" cy="7" r="0.3"  fill="#7A3C1A" opacity="0.04"/>
          <circle cx="1" cy="6" r="0.38" fill="#7A3C1A" opacity="0.05"/>
          <circle cx="7" cy="1" r="0.32" fill="#7A3C1A" opacity="0.04"/>
        </pattern>

        {/* ── AMBIENT / ENV ── */}
        <radialGradient id="g-amb-warm" cx="30%" cy="45%" r="60%">
          <stop offset="0%"   stopColor="#D07848" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#D07848" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-amb-cool" cx="75%" cy="35%" r="55%">
          <stop offset="0%"   stopColor="#3848A8" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#3848A8" stopOpacity="0"/>
        </radialGradient>
        {/* Rim light — top-back */}
        <linearGradient id="g-rim-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFE8C0" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#FFE8C0" stopOpacity="0"/>
        </linearGradient>
        {/* Key light — upper left */}
        <radialGradient id="g-key-light" cx="28%" cy="18%" r="72%">
          <stop offset="0%"   stopColor="#FFF4E0" stopOpacity="0.18"/>
          <stop offset="60%"  stopColor="#FFF4E0" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#FFF4E0" stopOpacity="0"/>
        </radialGradient>

        {/* ── SKIN ── */}
        <radialGradient id="g-skin-face" cx="42%" cy="15%" r="80%">
          <stop offset="0%"   stopColor="#DCA070"/>
          <stop offset="18%"  stopColor="#C88058"/>
          <stop offset="48%"  stopColor="#A86040"/>
          <stop offset="78%"  stopColor="#8A4428"/>
          <stop offset="100%" stopColor="#6E3018"/>
        </radialGradient>
        <radialGradient id="g-skin-body" cx="40%" cy="20%" r="82%">
          <stop offset="0%"   stopColor="#CC8858"/>
          <stop offset="40%"  stopColor="#A86238"/>
          <stop offset="100%" stopColor="#7C3E1E"/>
        </radialGradient>
        <radialGradient id="g-skin-ear" cx="35%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#CC8462"/>
          <stop offset="55%"  stopColor="#A05A3A"/>
          <stop offset="100%" stopColor="#7A3C1E"/>
        </radialGradient>
        <linearGradient id="g-neck-shad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.02"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.32"/>
        </linearGradient>
        {/* Subsurface scatter */}
        <radialGradient id="g-sss-l" cx="15%" cy="50%" r="52%">
          <stop offset="0%"   stopColor="#FF7050" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#FF7050" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-sss-r" cx="85%" cy="50%" r="52%">
          <stop offset="0%"   stopColor="#FF7050" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#FF7050" stopOpacity="0"/>
        </radialGradient>
        {/* Ear SSS */}
        <radialGradient id="g-sss-ear" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FF6040" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#FF6040" stopOpacity="0"/>
        </radialGradient>
        {/* Jaw depth */}
        <radialGradient id="g-jaw-depth" cx="50%" cy="100%" r="58%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        {/* Cheek blush */}
        <radialGradient id="g-blush-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C84030" stopOpacity="0.2"/>
          <stop offset="55%"  stopColor="#C84030" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#C84030" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-blush-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C84030" stopOpacity="0.17"/>
          <stop offset="55%"  stopColor="#C84030" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#C84030" stopOpacity="0"/>
        </radialGradient>
        {/* Forehead highlight */}
        <radialGradient id="g-forehead-hl" cx="45%" cy="45%" r="55%">
          <stop offset="0%"   stopColor="#FFF8F0" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#FFF8F0" stopOpacity="0"/>
        </radialGradient>
        {/* Nose bridge */}
        <linearGradient id="g-nose-bridge-hl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#E8B070" stopOpacity="0"/>
          <stop offset="45%"  stopColor="#E8B070" stopOpacity="0.58"/>
          <stop offset="100%" stopColor="#E8B070" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="g-nose-tip-warm" cx="50%" cy="55%" r="50%">
          <stop offset="0%"   stopColor="#CC5030" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#CC5030" stopOpacity="0"/>
        </radialGradient>
        {/* Temple / orbital rim shadow */}
        <radialGradient id="g-orbital" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        {/* Malar / cheekbone */}
        <radialGradient id="g-malar" cx="50%" cy="40%" r="50%">
          <stop offset="0%"   stopColor="#E0A870" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#E0A870" stopOpacity="0"/>
        </radialGradient>
        {/* Philtrum */}
        <linearGradient id="g-philtrum" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </linearGradient>

        {/* ── HAIR ── */}
        <linearGradient id="g-hair" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%"   stopColor="#201A14"/>
          <stop offset="34%"  stopColor="#100E0A"/>
          <stop offset="100%" stopColor="#040302"/>
        </linearGradient>
        {/* Hair warm-brown highlight band */}
        <linearGradient id="g-hair-hl1" x1="5%" y1="0%" x2="95%" y2="100%">
          <stop offset="0%"   stopColor="#5A4438" stopOpacity="0.78"/>
          <stop offset="30%"  stopColor="#704E40" stopOpacity="0.42"/>
          <stop offset="62%"  stopColor="#2C1E18" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </linearGradient>
        {/* Hair second gloss pass */}
        <linearGradient id="g-hair-hl2" x1="8%" y1="5%" x2="92%" y2="95%">
          <stop offset="0%"   stopColor="#4A3A30" stopOpacity="0.5"/>
          <stop offset="48%"  stopColor="#2E2418" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#040302" stopOpacity="0"/>
        </linearGradient>
        {/* Hair rim light (back light) */}
        <radialGradient id="g-hair-rim" cx="50%" cy="10%" r="60%">
          <stop offset="0%"   stopColor="#705848" stopOpacity="0.5"/>
          <stop offset="55%"  stopColor="#3C2C22" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </radialGradient>
        {/* Side hair */}
        <linearGradient id="g-hair-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1C1610"/>
          <stop offset="55%"  stopColor="#0C0A06"/>
          <stop offset="100%" stopColor="#040302"/>
        </linearGradient>
        {/* Hair colour variation — slightly warm micro-strands */}
        <linearGradient id="g-hair-warm" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%"   stopColor="#3A2A1E" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#120C08" stopOpacity="0"/>
        </linearGradient>

        {/* ── SHIRT ── */}
        <linearGradient id="g-shirt" x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%"   stopColor="#F0EEED"/>
          <stop offset="42%"  stopColor="#DCDBD8"/>
          <stop offset="100%" stopColor="#BEBCB8"/>
        </linearGradient>
        <linearGradient id="g-shirt-shad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.03"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="g-shirt-rim-l" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFF" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
        </linearGradient>
        {/* Collar stand gradient */}
        <linearGradient id="g-collar-stand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D0CECA"/>
          <stop offset="100%" stopColor="#B8B6B2"/>
        </linearGradient>
        {/* Shirt inner arm shadow */}
        <radialGradient id="g-shirt-arm-shad" cx="80%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>

        {/* ── PANTS / SHOES / CHAIN ── */}
        <linearGradient id="g-trouser" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%"   stopColor="#2A2430"/>
          <stop offset="48%"  stopColor="#16121E"/>
          <stop offset="100%" stopColor="#09070E"/>
        </linearGradient>
        <linearGradient id="g-trouser-crease" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFF" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#FFF" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="g-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#E8EAF0"/>
          <stop offset="50%"  stopColor="#D2D4DC"/>
          <stop offset="100%" stopColor="#B8BAC4"/>
        </linearGradient>
        <linearGradient id="g-shoe-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C8CAD4"/>
          <stop offset="100%" stopColor="#A4A6B0"/>
        </linearGradient>
        <linearGradient id="g-chain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF8E4"/>
          <stop offset="40%"  stopColor="#E0C8A0"/>
          <stop offset="100%" stopColor="#A88A66"/>
        </linearGradient>

        {/* ── EYES ── */}
        <radialGradient id="g-sclera" cx="40%" cy="22%" r="82%">
          <stop offset="0%"   stopColor="#FFFAF4"/>
          <stop offset="50%"  stopColor="#F2E8E0"/>
          <stop offset="100%" stopColor="#E0D4C8"/>
        </radialGradient>
        <radialGradient id="g-iris" cx="32%" cy="22%" r="70%">
          <stop offset="0%"   stopColor="#9C6832"/>
          <stop offset="18%"  stopColor="#6C3C18"/>
          <stop offset="52%"  stopColor="#280E06"/>
          <stop offset="100%" stopColor="#040102"/>
        </radialGradient>
        <radialGradient id="g-iris-shadow" cx="50%" cy="15%" r="90%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.4"/>
          <stop offset="55%"  stopColor="#000" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-pupil-depth" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#150010" stopOpacity="0.6"/>
          <stop offset="60%"  stopColor="#080008" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#000"    stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="g-eye-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFF"    stopOpacity="0.52"/>
          <stop offset="100%" stopColor="#C8D8FF" stopOpacity="0.04"/>
        </linearGradient>
        <radialGradient id="g-undereye" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="#6C3C1C" stopOpacity="0.26"/>
          <stop offset="100%" stopColor="#6C3C1C" stopOpacity="0"/>
        </radialGradient>
        {/* Eyelid skin crease */}
        <linearGradient id="g-lid-crease" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#8A4828" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#8A4828" stopOpacity="0"/>
        </linearGradient>

        {/* ── LIPS ── */}
        <linearGradient id="g-lip-up" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#844444"/>
          <stop offset="48%"  stopColor="#6E3636"/>
          <stop offset="100%" stopColor="#5A2A2A"/>
        </linearGradient>
        <linearGradient id="g-lip-lo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#985A5A"/>
          <stop offset="45%"  stopColor="#7E4444"/>
          <stop offset="100%" stopColor="#643636"/>
        </linearGradient>
        <radialGradient id="g-lip-gloss" cx="50%" cy="6%" r="90%">
          <stop offset="0%"   stopColor="#F0B0B8" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#F0B0B8" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-lip-dark" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#38100E" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#38100E" stopOpacity="0"/>
        </radialGradient>
        {/* Vermillion border */}
        <linearGradient id="g-vermillion" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C07070" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#C07070" stopOpacity="0"/>
        </linearGradient>

        {/* ── STUBBLE / BEARD ── */}
        <radialGradient id="g-stb-jaw" cx="50%" cy="72%" r="66%">
          <stop offset="0%"   stopColor="#080604" stopOpacity="0.3"/>
          <stop offset="52%"  stopColor="#080604" stopOpacity="0.13"/>
          <stop offset="100%" stopColor="#080604" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-stb-chin" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#060402" stopOpacity="0.36"/>
          <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-moustache-fill" cx="50%" cy="62%" r="56%">
          <stop offset="0%"   stopColor="#0A0806" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#0A0806" stopOpacity="0"/>
        </radialGradient>
        {/* Beard connection band (links jaw stubble to mustache) */}
        <linearGradient id="g-beard-band" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#080604" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#080604" stopOpacity="0"/>
        </linearGradient>

        {/* ── EYE CLIP PATHS ── */}
        <clipPath id="cp-l-eye" clipPathUnits="userSpaceOnUse">
          <path d="M 87,115 C 92,103 100,97 107,97 C 114,97 122,103 127,115 C 122,125 114,130 107,130 C 100,130 92,125 87,115 Z"/>
        </clipPath>
        <clipPath id="cp-r-eye" clipPathUnits="userSpaceOnUse">
          <path d="M 133,115 C 138,103 146,97 153,97 C 160,97 168,103 173,115 C 168,125 160,130 153,130 C 146,130 138,125 133,115 Z"/>
        </clipPath>
        {/* Ear clip */}
        <clipPath id="cp-ear" clipPathUnits="userSpaceOnUse">
          <ellipse cx="82" cy="131" rx="12" ry="21"/>
        </clipPath>
        {/* Face boundary clip for skin texture */}
        <clipPath id="cp-face" clipPathUnits="userSpaceOnUse">
          <path d="M 89,115 C 89,65 109,37 130,35 C 151,37 171,65 171,115 C 171,154 161,188 143,210 C 137,218 133,222 130,222 C 127,222 123,218 117,210 C 99,188 89,154 89,115 Z"/>
        </clipPath>
      </defs>

      {/* ░░░░░░░░░░░░░░░░░░░░░░░
          GROUND SHADOW
          ░░░░░░░░░░░░░░░░░░░░░░░ */}
      <ellipse cx="130" cy="714" rx="66" ry="8.5" fill="rgba(0,0,0,0.2)"/>
      <ellipse cx="130" cy="714" rx="38" ry="4"   fill="rgba(0,0,0,0.1)"/>

      {/* ░░ AMBIENT ░░ */}
      <ellipse cx="88"  cy="295" rx="56" ry="180" fill="url(#g-amb-warm)" opacity="0.22"/>
      <ellipse cx="174" cy="258" rx="52" ry="152" fill="url(#g-amb-cool)" opacity="0.12"/>

      {/* ═══════════════════════════════════════════════════
          BREATH GROUP
          ═══════════════════════════════════════════════════ */}
      <g className="ayrin-breath">

        {/* ══ LEGS ══ */}
        <path fill="url(#g-trouser)" d="M 99,508 C 87,572 85,635 93,695 C 100,709 121,709 128,695 C 136,633 137,570 129,508 Z"/>
        <path fill="url(#g-trouser)" d="M 131,508 C 123,570 124,632 132,695 C 139,709 160,709 167,695 C 175,635 173,572 161,508 Z"/>
        {/* Trouser seam */}
        <path d="M 113,510 C 109,575 109,638 115,701" fill="none" stroke="url(#g-trouser-crease)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 147,510 C 151,575 151,638 145,701" fill="none" stroke="url(#g-trouser-crease)" strokeWidth="2" strokeLinecap="round"/>
        {/* Trouser fabric crease light */}
        <path d="M 110,510 C 106,573 106,636 112,699" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
        <path d="M 150,510 C 154,573 154,636 148,699" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.6" strokeLinecap="round" opacity="0.46"/>
        {/* Knee area crease */}
        <path d="M 103,612 C 110,608 120,607 127,610" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.1" strokeLinecap="round" opacity="0.4"/>
        <path d="M 133,612 C 140,608 150,607 157,610" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.1" strokeLinecap="round" opacity="0.4"/>

        {/* ══ SHOES ══ */}
        {/* Left shoe */}
        <ellipse cx="108" cy="706" rx="23" ry="11" fill="url(#g-shoe)"/>
        <path d="M 86,706 C 97,700 120,700 130,706" fill="none" stroke="url(#g-shoe-side)" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="108" cy="710" rx="22" ry="4.5" fill="url(#g-shoe-side)" opacity="0.55"/>
        {/* Right shoe */}
        <ellipse cx="153" cy="706" rx="23" ry="11" fill="url(#g-shoe)"/>
        <path d="M 132,706 C 143,700 166,700 176,706" fill="none" stroke="url(#g-shoe-side)" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="153" cy="710" rx="22" ry="4.5" fill="url(#g-shoe-side)" opacity="0.55"/>
        {/* Shoe highlight */}
        <path d="M 90,703 C 100,697 116,697 126,703" fill="none" stroke="#D0D4DE" strokeWidth="1.5" opacity="0.65"/>
        <path d="M 136,703 C 146,697 162,697 172,703" fill="none" stroke="#D0D4DE" strokeWidth="1.5" opacity="0.65"/>
        {/* Shoe stitching */}
        <path d="M 92,705 C 101,699 115,699 124,705" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.65" strokeLinecap="round" strokeDasharray="1.8 3.2" opacity="0.55"/>
        <path d="M 138,705 C 147,699 161,699 170,705" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.65" strokeLinecap="round" strokeDasharray="1.8 3.2" opacity="0.55"/>

        {/* ══ SHIRT BODY ══ */}
        <path fill="url(#g-shirt)" d="
          M 72,230 C 60,249 55,285 55,338 L 55,450
          C 55,492 80,524 116,530 L 144,530
          C 180,524 205,492 205,450 L 205,338
          C 205,285 200,249 188,230
          C 170,214 151,208 130,208
          C 109,208 90,214 72,230 Z
        "/>
        {/* Shirt shadow overlay */}
        <path fill="url(#g-shirt-shad)" opacity="0.2" d="
          M 187,230 C 200,249 205,285 205,338 L 205,450
          C 205,492 180,524 144,530 L 135,530
          C 142,492 145,435 144,365
          C 143,295 139,249 134,208 C 154,209 172,215 187,230 Z
        "/>
        {/* Shirt rim light left */}
        <path d="M 77,237 C 67,257 62,291 62,339 L 62,448 C 62,485 85,512 113,517"
          fill="none" stroke="url(#g-shirt-rim-l)" strokeWidth="2.2" strokeLinecap="round" opacity="0.36"/>
        {/* Shirt rim light right — subtle */}
        <path d="M 199,244 C 204,276 204,330 200,382"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        {/* Fabric fold — outer left */}
        <path d="M 87,270 C 82,330 81,392 86,455"
          fill="none" stroke="#000" strokeWidth="2.1" strokeLinecap="round" opacity="0.042"/>
        {/* Fabric fold — outer right */}
        <path d="M 173,270 C 178,330 179,392 174,455"
          fill="none" stroke="#000" strokeWidth="2.1" strokeLinecap="round" opacity="0.042"/>
        {/* Fabric fold — mid left */}
        <path d="M 108,282 C 104,342 104,408 108,464"
          fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="round" opacity="0.028"/>
        {/* Fabric fold — mid right */}
        <path d="M 152,282 C 156,342 156,408 152,464"
          fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="round" opacity="0.028"/>
        {/* Chest pull crease from arms */}
        <path d="M 100,262 C 112,271 122,273 130,273" fill="none" stroke="rgba(0,0,0,0.055)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
        <path d="M 160,262 C 148,271 138,273 130,273" fill="none" stroke="rgba(0,0,0,0.055)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
        {/* Key light sheen on chest */}
        <ellipse cx="110" cy="300" rx="28" ry="40" fill="url(#g-key-light)" opacity="0.7"/>
        {/* Collar V-opening */}
        <path d="M 114,229 C 120,241 126,254 130,272 C 134,254 140,241 146,229"
          fill="none" stroke="rgba(75,58,44,0.32)" strokeWidth="2.9" strokeLinecap="round"/>
        <path d="M 114,229 C 120,241 126,254 130,272 C 134,254 140,241 146,229"
          fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.3" strokeLinecap="round"/>
        {/* Left lapel seam dash */}
        <path d="M 118,233 C 122,241 126,248 129,254"
          fill="none" stroke="rgba(188,174,158,0.52)" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.4 4" opacity="0.9"/>
        {/* Right lapel seam dash */}
        <path d="M 142,233 C 138,241 134,248 131,254"
          fill="none" stroke="rgba(188,174,158,0.52)" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.4 4" opacity="0.9"/>
        {/* Collar inner stitching */}
        <path d="M 111,233 C 115,238 118,242 120,246"
          fill="none" stroke="rgba(155,145,132,0.38)" strokeWidth="0.65" strokeLinecap="round" strokeDasharray="0.7 2.2" opacity="0.65"/>
        <path d="M 149,233 C 145,238 142,242 140,246"
          fill="none" stroke="rgba(155,145,132,0.38)" strokeWidth="0.65" strokeLinecap="round" strokeDasharray="0.7 2.2" opacity="0.65"/>
        {/* Center placket */}
        <path d="M 130,270 L 130,518" fill="none" stroke="rgba(58,44,34,0.1)" strokeWidth="1.8" opacity="0.5"/>
        <path d="M 128.2,270 L 128.2,518" fill="none" stroke="rgba(58,44,34,0.035)" strokeWidth="0.55"/>
        <path d="M 131.8,270 L 131.8,518" fill="none" stroke="rgba(58,44,34,0.035)" strokeWidth="0.55"/>
        {/* Buttons */}
        {[296, 328, 360, 393].map(y => (
          <g key={y}>
            <circle cx={130} cy={y} r={2.6} fill="rgba(50,40,30,0.2)" opacity={0.88}/>
            <circle cx={130} cy={y} r={1.5} fill="rgba(175,168,155,0.28)"/>
            <circle cx={130} cy={y} r={0.5} fill="rgba(50,40,30,0.22)"/>
            <line x1={128.4} y1={y} x2={131.6} y2={y}  stroke="rgba(50,40,30,0.13)" strokeWidth="0.45"/>
            <line x1={130}   y1={y-1.6} x2={130}   y2={y+1.6} stroke="rgba(50,40,30,0.13)" strokeWidth="0.45"/>
          </g>
        ))}
        {/* Hem */}
        <path d="M 84,498 C 99,506 116,509 130,509 C 144,509 161,506 176,498"
          fill="none" stroke="rgba(88,72,56,0.13)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M 90,500 C 104,507 117,509 130,509 C 143,509 156,507 170,500"
          fill="none" stroke="rgba(148,138,126,0.18)" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="1.2 3" opacity="0.58"/>

        {/* ══ COLLAR STAND (visible between neck and shirt opening) ══ */}
        <path fill="url(#g-collar-stand)" d="
          M 116,224 C 118,232 124,240 130,245
          C 136,240 142,232 144,224
          C 140,222 136,221 130,221
          C 124,221 120,222 116,224 Z
        " opacity="0.7"/>

        {/* ══ LEFT ARM ══ */}
        <path fill="url(#g-skin-body)" d="
          M 83,253 C 62,275 51,311 51,353
          C 51,391 63,425 81,452
          C 88,462 99,464 108,456 L 113,451
          C 98,423 92,396 92,363
          C 92,329 96,298 104,267 Z
        "/>
        {/* Shirt over arm */}
        <path fill="url(#g-shirt)" opacity="0.97" d="
          M 72,230 C 58,243 48,263 43,289 L 37,324
          C 54,312 72,296 88,278 Z
        "/>
        {/* Arm highlight */}
        <path d="M 64,279 C 59,317 63,355 75,390" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
        {/* Arm muscle underside shadow */}
        <path d="M 71,312 C 66,337 65,362 69,388" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" strokeLinecap="round" opacity="0.48"/>
        {/* Left hand */}
        <path fill="url(#g-skin-body)" d="
          M 81,443 C 74,447 71,455 72,463
          C 75,473 86,476 95,474
          C 103,472 108,465 107,457
          C 106,448 93,441 81,443 Z
        "/>
        {/* Knuckle rows */}
        {[[80,448],[87,447],[93,448]].map(([kx,ky],i)=>(
          <g key={i}>
            <path d={`M ${kx},${ky} C ${kx+2},${ky+3} ${kx+2},${ky+7} ${kx},${ky+9}`}
              fill="none" stroke="rgba(80,46,26,0.22)" strokeWidth={1.1-i*0.08} strokeLinecap="round"/>
            <path d={`M ${kx+0.5},${ky+1} C ${kx+1.5},${ky+3} ${kx+1.5},${ky+5} ${kx+0.5},${ky+7}`}
              fill="none" stroke="rgba(220,175,130,0.2)" strokeWidth="0.6" strokeLinecap="round"/>
          </g>
        ))}

        {/* ══ RIGHT ARM ══ */}
        <path fill="url(#g-skin-body)" d="
          M 177,253 C 198,275 209,311 209,353
          C 209,391 197,425 179,452
          C 172,462 161,464 152,456 L 147,451
          C 162,423 168,396 168,363
          C 168,329 164,298 156,267 Z
        "/>
        <path fill="url(#g-shirt)" opacity="0.97" d="
          M 188,230 C 202,243 212,263 217,289 L 223,324
          C 206,312 188,296 172,278 Z
        "/>
        <path d="M 196,279 C 201,317 197,355 185,390" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
        <path d="M 189,312 C 194,337 195,362 191,388" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" strokeLinecap="round" opacity="0.48"/>
        {/* Right hand */}
        <path fill="url(#g-skin-body)" d="
          M 179,443 C 186,447 189,455 188,463
          C 185,473 174,476 165,474
          C 157,472 152,465 153,457
          C 154,448 167,441 179,443 Z
        "/>
        {[[180,448],[173,447],[167,448]].map(([kx,ky],i)=>(
          <g key={i}>
            <path d={`M ${kx},${ky} C ${kx-2},${ky+3} ${kx-2},${ky+7} ${kx},${ky+9}`}
              fill="none" stroke="rgba(80,46,26,0.22)" strokeWidth={1.1-i*0.08} strokeLinecap="round"/>
            <path d={`M ${kx-0.5},${ky+1} C ${kx-1.5},${ky+3} ${kx-1.5},${ky+5} ${kx-0.5},${ky+7}`}
              fill="none" stroke="rgba(220,175,130,0.2)" strokeWidth="0.6" strokeLinecap="round"/>
          </g>
        ))}

        {/* ══ NECK ══ */}
        <path fill="url(#g-skin-body)" d="M 114,189 C 112,203 110,223 110,243 L 150,243 C 150,223 148,203 146,189 Z"/>
        <path fill="url(#g-neck-shad)" opacity="0.6" d="M 118,189 C 118,209 119,225 122,243 L 138,243 C 141,225 142,209 142,189 Z"/>
        {/* Neck muscles — left SCM */}
        <path d="M 116,191 C 113,212 111,230 111,243"
          fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="2.8" strokeLinecap="round" opacity="0.55"/>
        {/* Neck muscles — right SCM */}
        <path d="M 144,191 C 147,212 149,230 149,243"
          fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="2.8" strokeLinecap="round" opacity="0.55"/>
        {/* Neck centre tendon */}
        <path d="M 129,192 C 129,208 129.5,226 130,243"
          fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        {/* Adam's apple detail */}
        <path d="M 126,210 C 128,214 132,214 134,210"
          fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.1" strokeLinecap="round" opacity="0.65"/>
        <ellipse cx="130" cy="212" rx="5.5" ry="4.5" fill="rgba(0,0,0,0.035)" opacity="0.8"/>
        {/* Collar shadow on neck */}
        <path d="M 113,228 C 120,235 125,240 130,243 C 135,240 140,235 147,228"
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        {/* Chain */}
        <path d="M 109,213 C 119,231 141,231 151,213"
          fill="none" stroke="url(#g-chain)" strokeWidth="2.3" strokeLinecap="round" opacity="0.92"/>
        {/* Chain links */}
        {[113,118,123,128,133,138,143,148].map((x,i)=>{
          const t = i / 7;
          const cy = 213 + Math.sin(t * Math.PI) * 5.5;
          return <ellipse key={i} cx={x} cy={cy} rx={1.2} ry={0.85}
            fill="none" stroke="#DECA9E" strokeWidth="0.65" opacity="0.58"/>;
        })}
        <path d="M 114,228 C 120,222 125,219 130,219 C 135,219 140,222 146,228"
          fill="none" stroke="rgba(96,66,44,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M 110,229 C 120,225 126,223 130,223 C 134,223 140,225 150,229"
          fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ═══════════════════════════════════════════════════════════
            HEAD GROUP
            ═══════════════════════════════════════════════════════════ */}
        <g className="ayrin-head">

          {/* ╔═══════════════════════════╗
              ║   HAIR — 40+ elements     ║
              ╚═══════════════════════════╝ */}

          {/* Main scalp volume */}
          <path fill="url(#g-hair)" d="
            M 90,95 C 88,57 108,33 130,31
            C 152,33 172,57 170,95
            C 162,84 153,77 143,78
            C 137,78 132,83 130,88
            C 128,83 123,78 117,78
            C 107,77 98,84 90,95 Z
          "/>
          {/* Left side fall — primary */}
          <path fill="url(#g-hair-side)" opacity="0.95" d="
            M 91,101 C 81,117 79,136 83,155
            C 86,168 93,177 101,182
            C 97,165 96,149 99,133
            C 102,121 108,111 115,105
            C 107,102 99,101 91,101 Z
          "/>
          {/* Left side fall — secondary loose */}
          <path fill="url(#g-hair)" opacity="0.8" d="
            M 83,100 C 75,115 73,133 77,151
            C 80,164 87,174 93,180
            C 89,164 88,149 91,134
            C 93,122 98,112 101,104 Z
          "/>
          {/* Left side fall — tertiary wisp */}
          <path fill="url(#g-hair)" opacity="0.65" d="
            M 77,106 C 70,120 68,137 71,153
            C 74,165 80,173 85,178
            C 82,163 81,149 84,136 Z
          "/>
          {/* Right side fall — primary */}
          <path fill="url(#g-hair-side)" opacity="0.95" d="
            M 169,101 C 179,117 181,136 177,155
            C 174,168 167,177 159,182
            C 163,165 164,149 161,133
            C 158,121 152,111 145,105
            C 153,102 161,101 169,101 Z
          "/>
          {/* Right side fall — secondary */}
          <path fill="url(#g-hair)" opacity="0.78" d="
            M 177,100 C 185,115 187,133 183,151
            C 180,164 173,174 167,180
            C 171,164 172,149 169,134
            C 167,122 162,112 159,104 Z
          "/>
          {/* Right side fall — tertiary */}
          <path fill="url(#g-hair)" opacity="0.63" d="
            M 183,106 C 190,120 192,137 189,153
            C 186,165 180,173 175,178
            C 178,163 179,149 176,136 Z
          "/>
          {/* Top volume — far left cluster */}
          <path fill="url(#g-hair)" opacity="0.86" d="
            M 97,57 C 103,46 112,40 120,43
            C 115,53 111,61 108,69 C 103,64 100,60 97,57 Z
          "/>
          {/* Top volume — centre-left sweep */}
          <path fill="url(#g-hair)" opacity="0.85" d="
            M 109,44 C 117,31 126,27 134,29 C 142,25 152,29 158,40
            C 151,47 143,50 136,47 C 130,45 121,43 116,44 Z
          "/>
          {/* Top volume — right cluster */}
          <path fill="url(#g-hair)" opacity="0.81" d="
            M 150,40 C 160,32 169,32 174,41
            C 167,49 161,55 156,61 C 152,54 150,47 150,40 Z
          "/>
          {/* Wild right outer strand */}
          <path fill="url(#g-hair)" opacity="0.7" d="
            M 164,37 C 172,29 182,30 185,39
            C 178,48 170,55 165,61 C 162,53 161,45 164,37 Z
          "/>
          {/* Wild left outer strand */}
          <path fill="url(#g-hair)" opacity="0.67" d="
            M 98,47 C 90,39 84,37 81,45
            C 85,54 92,61 97,67 C 99,59 99,53 98,47 Z
          "/>
          {/* Crown wisps */}
          <path fill="url(#g-hair)" opacity="0.62" d="M 115,33 C 117,25 122,21 128,23 C 124,29 121,35 119,41 Z"/>
          <path fill="url(#g-hair)" opacity="0.58" d="M 145,33 C 143,25 138,21 132,23 C 136,29 139,35 141,41 Z"/>
          {/* Crown micro-wisps */}
          <path fill="url(#g-hair)" opacity="0.50" d="M 130,29 C 129.5,23 130,19 130.5,23 Z"/>
          <path fill="url(#g-hair)" opacity="0.44" d="M 123,31 C 121,25 123,22 125,25 Z"/>
          <path fill="url(#g-hair)" opacity="0.44" d="M 137,31 C 139,25 137,22 135,25 Z"/>
          <path fill="url(#g-hair)" opacity="0.38" d="M 108,50 C 105,43 106,39 109,42 Z"/>
          <path fill="url(#g-hair)" opacity="0.36" d="M 151,50 C 154,43 153,39 150,42 Z"/>
          {/* Baby hairs at hairline — left */}
          <path d="M 92,107 C 94,103 96,100 97,97"  fill="none" stroke="#1C1612" strokeWidth="0.9" strokeLinecap="round" opacity="0.55"/>
          <path d="M 95,109 C 97,104 99,101 101,99"  fill="none" stroke="#1C1612" strokeWidth="0.85" strokeLinecap="round" opacity="0.48"/>
          <path d="M 99,110 C 101,105 103,103 105,101" fill="none" stroke="#1C1612" strokeWidth="0.8" strokeLinecap="round" opacity="0.42"/>
          {/* Baby hairs at hairline — right */}
          <path d="M 168,107 C 166,103 164,100 163,97"  fill="none" stroke="#1C1612" strokeWidth="0.9" strokeLinecap="round" opacity="0.52"/>
          <path d="M 165,109 C 163,104 161,101 159,99"  fill="none" stroke="#1C1612" strokeWidth="0.85" strokeLinecap="round" opacity="0.46"/>
          <path d="M 161,110 C 159,105 157,103 155,101" fill="none" stroke="#1C1612" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          {/* Hair part line */}
          <path d="M 130,36 C 131.5,52 132,68 131.5,84"
            fill="none" stroke="rgba(56,44,34,0.1)" strokeWidth="0.7" strokeLinecap="round" opacity="0.65"/>

          {/* Primary gloss band */}
          <path fill="url(#g-hair-hl1)" opacity="0.5" d="
            M 110,51 C 123,42 139,40 151,46
            C 144,54 134,57 125,56 C 117,56 112,54 110,51 Z
          "/>
          {/* Secondary gloss */}
          <path fill="url(#g-hair-hl2)" opacity="0.38" d="
            M 118,63 C 129,54 141,52 151,58
            C 142,65 131,68 121,67 Z
          "/>
          {/* Ambient warm-brown fill */}
          <path fill="url(#g-hair-warm)" opacity="0.4" d="
            M 107,47 C 119,39 137,37 151,43
            C 143,51 130,55 118,54 Z
          "/>
          {/* Rim light on hair top */}
          <path fill="url(#g-hair-rim)" opacity="0.42" d="
            M 104,48 C 116,38 138,36 152,44
            C 144,52 132,56 120,55 Z
          "/>

          {/* Hair macro strand lines — top */}
          <path d="M 123,69 C 131,59 139,56 147,59" fill="none" stroke="#3C2C22" strokeWidth="0.78" strokeLinecap="round" opacity="0.16"/>
          <path d="M 113,75 C 118,67 125,65 131,66" fill="none" stroke="#3C2C22" strokeWidth="0.72" strokeLinecap="round" opacity="0.13"/>
          <path d="M 149,71 C 155,66 161,65 166,67" fill="none" stroke="#3C2C22" strokeWidth="0.72" strokeLinecap="round" opacity="0.13"/>
          <path d="M 119,80 C 125,74 131,72 137,73" fill="none" stroke="#3C2C22" strokeWidth="0.68" strokeLinecap="round" opacity="0.1"/>
          {/* Side strand lines — left */}
          <path d="M 87,106 C 93,115 95,126 93,138" fill="none" stroke="#3C2C22" strokeWidth="0.68" strokeLinecap="round" opacity="0.13"/>
          <path d="M 91,110 C 96,120 98,133 96,146" fill="none" stroke="#3C2C22" strokeWidth="0.62" strokeLinecap="round" opacity="0.1"/>
          <path d="M 84,112 C 89,122 90,135 88,148" fill="none" stroke="#3C2C22" strokeWidth="0.58" strokeLinecap="round" opacity="0.08"/>
          {/* Side strand lines — right */}
          <path d="M 173,106 C 167,115 165,126 167,138" fill="none" stroke="#3C2C22" strokeWidth="0.68" strokeLinecap="round" opacity="0.13"/>
          <path d="M 169,110 C 164,120 162,133 164,146" fill="none" stroke="#3C2C22" strokeWidth="0.62" strokeLinecap="round" opacity="0.1"/>
          <path d="M 176,112 C 171,122 170,135 172,148" fill="none" stroke="#3C2C22" strokeWidth="0.58" strokeLinecap="round" opacity="0.08"/>

          {/* ══ LEFT EAR (partially under hair) ══ */}
          <ellipse cx="82" cy="132" rx="11" ry="19" fill="url(#g-skin-ear)"/>
          {/* Ear SSS */}
          <ellipse cx="82" cy="132" rx="11" ry="19" fill="url(#g-sss-ear)" opacity="0.7"/>
          {/* Helix rim */}
          <path d="M 79,118 C 74,124 73,132 74,140 C 76,148 80,154 84,156"
            fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
          <path d="M 80,119 C 75,125 75,133 76,141"
            fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          {/* Antihelix */}
          <path d="M 80,127 C 78,131 78,136 80,141"
            fill="none" stroke="rgba(80,38,18,0.2)" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
          {/* Ear canal */}
          <ellipse cx="82" cy="135" rx="3.8" ry="4.5" fill="rgba(55,25,10,0.26)" opacity="0.7"/>
          <ellipse cx="82" cy="135" rx="2.2" ry="2.8" fill="rgba(30,10,4,0.35)"  opacity="0.7"/>
          {/* Lobe */}
          <ellipse cx="83" cy="151" rx="5" ry="4" fill="rgba(0,0,0,0.06)" opacity="0.6"/>
          {/* Ear rim light */}
          <path d="M 79,120 C 77,126 76,133 77,140"
            fill="none" stroke="rgba(210,155,110,0.18)" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
          {/* Hair covers most of ear */}
          <path fill="url(#g-hair-side)" opacity="0.9" d="
            M 78,118 C 75,123 74,130 75,139
            C 76,146 80,153 84,157
            C 84,148 83,139 83,130
            C 83,125 81,121 78,118 Z
          "/>

          {/* ══ FACE SHAPE ══ */}
          <path fill="url(#g-skin-face)" d="
            M 89,115 C 89,64 109,37 130,35
            C 151,37 171,64 171,115
            C 171,154 161,188 143,210
            C 137,218 133,222 130,222
            C 127,222 123,218 117,210
            C 99,188 89,154 89,115 Z
          "/>
          {/* Skin texture overlay */}
          <path fill="url(#p-skin-tex)" opacity="1" clipPath="url(#cp-face)" d="
            M 89,115 C 89,64 109,37 130,35
            C 151,37 171,64 171,115
            C 171,154 161,188 143,210
            C 137,218 133,222 130,222
            C 127,222 123,218 117,210
            C 99,188 89,154 89,115 Z
          "/>
          {/* Key light on face */}
          <ellipse cx="112" cy="105" rx="32" ry="42" fill="url(#g-key-light)" opacity="0.8"/>
          {/* SSS */}
          <ellipse cx="92"  cy="145" rx="32" ry="48" fill="url(#g-sss-l)" opacity="0.55"/>
          <ellipse cx="168" cy="145" rx="32" ry="48" fill="url(#g-sss-r)" opacity="0.5"/>
          {/* Temple / orbital rim shadows */}
          <ellipse cx="92"  cy="112" rx="15" ry="24" fill="url(#g-orbital)" opacity="0.7"/>
          <ellipse cx="168" cy="112" rx="15" ry="24" fill="url(#g-orbital)" opacity="0.7"/>
          {/* Malar / cheekbone highlight */}
          <ellipse cx="100" cy="132" rx="14" ry="8" fill="url(#g-malar)" opacity="0.7" transform="rotate(-14,100,132)"/>
          <ellipse cx="160" cy="132" rx="14" ry="8" fill="url(#g-malar)" opacity="0.62" transform="rotate(14,160,132)"/>
          {/* Cheek blush */}
          <ellipse cx="94"  cy="145" rx="23" ry="16" fill="url(#g-blush-l)" opacity="0.78"/>
          <ellipse cx="166" cy="145" rx="23" ry="16" fill="url(#g-blush-r)" opacity="0.72"/>
          {/* Forehead highlight */}
          <ellipse cx="125" cy="78"  rx="28" ry="17" fill="url(#g-forehead-hl)" opacity="1"/>
          {/* Glabella shadow (between brows) */}
          <ellipse cx="130" cy="98"  rx="9"  ry="6"  fill="rgba(0,0,0,0.055)" opacity="0.7"/>
          {/* Jaw depth shadow */}
          <ellipse cx="130" cy="215" rx="33" ry="15" fill="url(#g-jaw-depth)" opacity="0.8"/>
          {/* Chin highlight */}
          <ellipse cx="130" cy="210" rx="9"  ry="4.5" fill="rgba(195,148,98,0.12)" opacity="0.7"/>
          {/* Nose bridge highlight strip */}
          <rect x="127.5" y="137" width="6" height="27" rx="3" fill="url(#g-nose-bridge-hl)" opacity="0.55"/>
          {/* Nasolabial folds */}
          <path d="M 108,160 C 107,166 107,173 110,179 C 112,183 115,185 116,186"
            fill="none" stroke="rgba(96,48,22,0.22)" strokeWidth="1.7" strokeLinecap="round" opacity="0.7"/>
          <path d="M 152,160 C 153,166 153,173 150,179 C 148,183 145,185 144,186"
            fill="none" stroke="rgba(96,48,22,0.2)"  strokeWidth="1.7" strokeLinecap="round" opacity="0.7"/>
          {/* Forehead horizontal line (expression) */}
          <path d="M 108,82 C 115,80 122,79 130,79 C 138,79 145,80 152,82"
            fill="none" stroke="rgba(80,40,18,0.07)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
          {/* Second forehead line */}
          <path d="M 112,88 C 118,86.5 124,86 130,86 C 136,86 142,86.5 148,88"
            fill="none" stroke="rgba(80,40,18,0.05)" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
          {/* Chin crease */}
          <path d="M 124,216 C 127,218 130,219 134,218 C 137,218 139,216 140,214"
            fill="none" stroke="rgba(75,36,16,0.13)" strokeWidth="1.1" strokeLinecap="round" opacity="0.65"/>

          {/* ╔════════════════════════╗
              ║   FRINGE (animated)    ║
              ╚════════════════════════╝ */}
          <g className="ayrin-fringe">
            {/* Left strand */}
            <path fill="url(#g-hair)" d="
              M 100,91 C 108,100 111,112 109,124
              C 104,118 98,114 92,112 C 95,104 97,97 100,91 Z
            "/>
            {/* Centre-left strand */}
            <path fill="url(#g-hair)" opacity="0.97" d="
              M 119,85 C 127,96 129,108 127,122
              C 123,115 118,110 113,106 C 115,98 117,91 119,85 Z
            "/>
            {/* Centre-right strand */}
            <path fill="url(#g-hair)" d="
              M 139,87 C 147,97 149,110 147,122
              C 143,116 138,111 132,107 C 134,99 137,93 139,87 Z
            "/>
            {/* Wild asymmetric strand */}
            <path fill="url(#g-hair)" opacity="0.74" d="
              M 106,89 C 102,79 102,68 107,61
              C 112,68 114,79 112,91 Z
            "/>
            {/* Extra wisp */}
            <path fill="url(#g-hair)" opacity="0.66" d="
              M 114,84 C 110,74 110,64 114,56
              C 118,63 119,73 117,84 Z
            "/>
            {/* Right forward wisp */}
            <path fill="url(#g-hair)" opacity="0.58" d="
              M 149,86 C 153,77 153,67 150,60
              C 146,67 145,77 147,86 Z
            "/>
            {/* Fringe gloss */}
            <path fill="url(#g-hair-hl1)" opacity="0.34" d="
              M 107,91 C 113,100 115,110 113,122
              C 109,116 105,112 100,109 C 103,102 105,96 107,91 Z
            "/>
            <path fill="url(#g-hair-hl2)" opacity="0.28" d="
              M 125,86 C 131,96 133,107 131,119
              C 127,113 123,109 119,106 C 121,99 123,92 125,86 Z
            "/>
            {/* Fringe strand micro-lines */}
            <path d="M 108,91 C 112,100 113,110 112,121"  fill="none" stroke="#4A3C2E" strokeWidth="0.72" strokeLinecap="round" opacity="0.18"/>
            <path d="M 112,89 C 116,98 117,108 116,119"   fill="none" stroke="#4A3C2E" strokeWidth="0.68" strokeLinecap="round" opacity="0.14"/>
            <path d="M 116,87 C 119,96 120,105 119,116"   fill="none" stroke="#4A3C2E" strokeWidth="0.65" strokeLinecap="round" opacity="0.12"/>
            <path d="M 125,86 C 129,96 130,105 129,117"   fill="none" stroke="#4A3C2E" strokeWidth="0.72" strokeLinecap="round" opacity="0.16"/>
            <path d="M 130,85 C 133,95 134,104 133,116"   fill="none" stroke="#4A3C2E" strokeWidth="0.68" strokeLinecap="round" opacity="0.13"/>
            <path d="M 142,88 C 146,98 147,108 145,119"   fill="none" stroke="#4A3C2E" strokeWidth="0.72" strokeLinecap="round" opacity="0.15"/>
            <path d="M 147,87 C 151,96 152,105 150,117"   fill="none" stroke="#4A3C2E" strokeWidth="0.68" strokeLinecap="round" opacity="0.12"/>
          </g>

          {/* ╔═══════════════════════════════╗
              ║  EYEBROWS — multi-layer pass  ║
              ╚═══════════════════════════════╝ */}
          {/* LEFT brow */}
          {/* Layer 1 — base shadow */}
          <path d="M 87,104 C 96,95 105,92 121,96"
            fill="none" stroke="#050302" strokeWidth="6.8" strokeLinecap="round" opacity="0.8"/>
          {/* Layer 2 — core colour */}
          <path d="M 87,104 C 96,95 105,92 121,96"
            fill="none" stroke="#100C08" strokeWidth="4.2" strokeLinecap="round" opacity="0.54"/>
          {/* Layer 3 — mid tone */}
          <path d="M 88,104 C 96,96 105,93 120,96"
            fill="none" stroke="#1C1610" strokeWidth="2.2" strokeLinecap="round" opacity="0.34"/>
          {/* Layer 4 — arch fine pass */}
          <path d="M 96,98 C 102,95 108,93 116,95"
            fill="none" stroke="#0E0A06" strokeWidth="1.1" strokeLinecap="round" opacity="0.2"/>
          {/* Directional hair strokes — left brow */}
          <path d="M 88,104 C 90,101 92,100 94,99"  fill="none" stroke="#040200" strokeWidth="0.82" strokeLinecap="round" opacity="0.28"/>
          <path d="M 92,101 C 94,99 97,98 99,98"    fill="none" stroke="#040200" strokeWidth="0.82" strokeLinecap="round" opacity="0.25"/>
          <path d="M 96,99 C 98,97 101,97 104,97"   fill="none" stroke="#040200" strokeWidth="0.8"  strokeLinecap="round" opacity="0.23"/>
          <path d="M 101,96 C 104,95.5 107,95.5 110,96" fill="none" stroke="#040200" strokeWidth="0.78" strokeLinecap="round" opacity="0.22"/>
          <path d="M 108,95.5 C 111,95.5 114,96 118,96.5" fill="none" stroke="#040200" strokeWidth="0.75" strokeLinecap="round" opacity="0.2"/>
          {/* Brow lower edge shadow */}
          <path d="M 89,105 C 97,98 106,95 120,97"
            fill="none" stroke="#020100" strokeWidth="1.2" strokeLinecap="round" opacity="0.12"/>
          {/* Brow tail highlight */}
          <path d="M 116,96 C 118,97 120,97 121,96"
            fill="none" stroke="#3A2C20" strokeWidth="0.65" strokeLinecap="round" opacity="0.16"/>

          {/* RIGHT brow — micro-asymmetric */}
          <path d="M 139,96 C 155,92 165,95 173,104"
            fill="none" stroke="#050302" strokeWidth="6.8" strokeLinecap="round" opacity="0.78"/>
          <path d="M 139,96 C 155,92 165,95 173,104"
            fill="none" stroke="#100C08" strokeWidth="4.2" strokeLinecap="round" opacity="0.52"/>
          <path d="M 140,96 C 155,93 165,96 172,104"
            fill="none" stroke="#1C1610" strokeWidth="2.2" strokeLinecap="round" opacity="0.32"/>
          <path d="M 144,94 C 150,93 156,93 162,95"
            fill="none" stroke="#0E0A06" strokeWidth="1.1" strokeLinecap="round" opacity="0.19"/>
          <path d="M 141,95 C 143,94 146,93 149,93"  fill="none" stroke="#040200" strokeWidth="0.82" strokeLinecap="round" opacity="0.26"/>
          <path d="M 148,93 C 151,93 154,93 157,94"  fill="none" stroke="#040200" strokeWidth="0.8"  strokeLinecap="round" opacity="0.23"/>
          <path d="M 155,94 C 158,94.5 161,95.5 164,96.5" fill="none" stroke="#040200" strokeWidth="0.78" strokeLinecap="round" opacity="0.22"/>
          <path d="M 162,96 C 165,97 168,99 171,101"  fill="none" stroke="#040200" strokeWidth="0.75" strokeLinecap="round" opacity="0.2"/>
          <path d="M 140,97 C 155,94 165,96 172,104"
            fill="none" stroke="#020100" strokeWidth="1.2" strokeLinecap="round" opacity="0.11"/>

          {/* ╔════════════════════════════════════╗
              ║  LEFT EYE — cinematic detail       ║
              ╚════════════════════════════════════╝ */}
          {/* Sclera */}
          <path d="M 87,115 C 92,103 100,97 107,97 C 114,97 122,103 127,115 C 122,125 114,130 107,130 C 100,130 92,125 87,115 Z"
            fill="url(#g-sclera)"/>
          {/* Sclera vein — barely visible */}
          <path d="M 90,117 C 93,115 96,114 98,115"
            fill="none" stroke="rgba(190,100,100,0.14)" strokeWidth="0.45" strokeLinecap="round"/>
          <path d="M 123,116 C 121,118 119,119 117,119"
            fill="none" stroke="rgba(190,100,100,0.1)"  strokeWidth="0.4"  strokeLinecap="round"/>

          {/* Iris base */}
          <ellipse cx="107" cy="115.2" rx="13.2" ry="13" fill="url(#g-iris)" clipPath="url(#cp-l-eye)"/>
          {/* Iris shadow from upper lid */}
          <ellipse cx="107" cy="115.2" rx="13.2" ry="13" fill="url(#g-iris-shadow)" clipPath="url(#cp-l-eye)"/>
          {/* Iris fiber rays — 24 strands */}
          {irisAngles.map((angle,i) => {
            const rad = angle * Math.PI / 180;
            const r0=7.4, r1= i%3===0 ? 11.4 : 9.8;
            return <line key={i}
              x1={107 + r0*Math.cos(rad)} y1={115.2 + r0*Math.sin(rad)}
              x2={107 + r1*Math.cos(rad)} y2={115.2 + r1*Math.sin(rad)}
              stroke={i%4===0?"#4A2810":"#361A08"} strokeWidth="0.48" opacity={i%3===0?0.18:0.12}
              clipPath="url(#cp-l-eye)"/>;
          })}
          {/* Pupil */}
          <ellipse cx="107" cy="115.2" rx="6.0" ry="6.0" fill="#010004" clipPath="url(#cp-l-eye)"/>
          {/* Pupil depth */}
          <ellipse cx="107" cy="115.2" rx="6.0" ry="6.0" fill="url(#g-pupil-depth)" clipPath="url(#cp-l-eye)"/>
          {/* Limbal ring */}
          <ellipse cx="107" cy="115.2" rx="9.5" ry="9.3"
            fill="none" stroke="#1C0804" strokeWidth="1.0" opacity="0.26" clipPath="url(#cp-l-eye)"/>
          {/* Primary catchlight */}
          <ellipse cx="110.5" cy="110.5" rx="2.7" ry="2.4" fill="#FFFFFF" opacity="0.94"/>
          {/* Secondary catchlight */}
          <ellipse cx="103.0" cy="120.0" rx="1.2" ry="1.0" fill="#FFFFFF" opacity="0.42"/>
          {/* Corneal arc reflection */}
          <path d="M 103.5,109 C 107,108 111,109 113,112"
            fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.85" strokeLinecap="round" clipPath="url(#cp-l-eye)"/>

          {/* Upper eyelid */}
          {blink ? (
            <path d="M 88,115 C 96,111 101,110 107,110 C 113,110 118,111 126,115"
              fill="none" stroke="#020010" strokeWidth="12.2" strokeLinecap="round"/>
          ) : (
            <>
              <path d="M 87,113 C 92,103 100,98 107,98 C 114,98 122,103 127,113
                C 118,109 112,108 107,109 C 102,108 94,109 87,113 Z"
                fill="#020010" opacity="0.93"/>
              {/* Lid crease */}
              <path d="M 89,114 C 94,108 101,106 107,107 C 113,106 120,108 125,113"
                fill="none" stroke="#020008" strokeWidth="2.6" strokeLinecap="round" opacity="0.29"/>
              {/* Double-lid fold */}
              <path d="M 91,116 C 96,111 102,109 107,110 C 112,109 118,111 123,115"
                fill="none" stroke="#020008" strokeWidth="1.0" strokeLinecap="round" opacity="0.11"/>
              {/* Eyelid skin colour */}
              <path d="M 89,112 C 95,108 107,107 122,111"
                fill="none" stroke="rgba(140,80,40,0.14)" strokeWidth="4" strokeLinecap="round" opacity="0.55"/>
            </>
          )}
          {/* Lower lid */}
          <path d="M 90,122 C 98,129 107,131 124,123"
            fill="none" stroke="#020008" strokeWidth="1.15" opacity="0.17" strokeLinecap="round"/>
          {/* Under-eye shadow gradient */}
          <ellipse cx="107" cy="131" rx="18" ry="5" fill="url(#g-undereye)" opacity="0.7"/>
          {/* Tear-film water line */}
          <path d="M 90,122 C 98,130 107,132 124,123"
            fill="none" stroke="url(#g-eye-water)" strokeWidth="1.8" opacity="0.28" strokeLinecap="round"/>

          {/* Upper lashes — 8 individual curved strands */}
          {!blink && [
            [[89,112],[87,108],[85,103]],
            [[93,109],[92,105],[92,100]],
            [[98,107],[97,103],[98,98]],
            [[103,106],[103,102],[104,97]],
            [[108,106],[108,102],[109,98]],
            [[113,107],[114,103],[116,99]],
            [[118,109],[120,105],[123,102]],
            [[122,112],[125,108],[128,105]]
          ].map(([p1,p2,p3],i)=>(
            <path key={i}
              d={`M ${p1[0]},${p1[1]} C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p3[0]},${p3[1]}`}
              fill="none" stroke="#010008" strokeWidth={1.15-i*0.04} strokeLinecap="round" opacity={0.72-i*0.02}/>
          ))}
          {/* Lower lashes — 6 */}
          {[
            [[91,123],[90,126],[89,130]],[[96,126],[95,129],[95,132]],
            [[102,128],[101,131],[101,134]],[[108,129],[108,132],[108,135]],
            [[114,128],[115,131],[115,134]],[[120,125],[121,128],[122,131]]
          ].map(([p1,p2,p3],i)=>(
            <path key={i}
              d={`M ${p1[0]},${p1[1]} C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p3[0]},${p3[1]}`}
              fill="none" stroke="#010008" strokeWidth="0.75" strokeLinecap="round" opacity={0.33-i*0.02}/>
          ))}
          {/* Tear duct */}
          <path d="M 85,114 L 81,111" fill="none" stroke="#020008" strokeWidth="1.25" strokeLinecap="round" opacity="0.25"/>
          <ellipse cx="87" cy="116" rx="2.4" ry="1.6" fill="#B86060" opacity="0.15"/>

          {/* ╔════════════════════════════════════╗
              ║  RIGHT EYE — cinematic detail      ║
              ╚════════════════════════════════════╝ */}
          <path d="M 133,115 C 138,103 146,97 153,97 C 160,97 168,103 173,115 C 168,125 160,130 153,130 C 146,130 138,125 133,115 Z"
            fill="url(#g-sclera)"/>
          <path d="M 170,117 C 167,115 164,114 162,115"
            fill="none" stroke="rgba(190,100,100,0.14)" strokeWidth="0.45" strokeLinecap="round"/>
          <path d="M 137,116 C 139,118 141,119 143,119"
            fill="none" stroke="rgba(190,100,100,0.1)"  strokeWidth="0.4"  strokeLinecap="round"/>

          <ellipse cx="153" cy="115.2" rx="13.2" ry="13" fill="url(#g-iris)" clipPath="url(#cp-r-eye)"/>
          <ellipse cx="153" cy="115.2" rx="13.2" ry="13" fill="url(#g-iris-shadow)" clipPath="url(#cp-r-eye)"/>
          {irisAngles.map((angle,i) => {
            const rad = angle * Math.PI / 180;
            const r0=7.4, r1= i%3===0 ? 11.4 : 9.8;
            return <line key={i}
              x1={153 + r0*Math.cos(rad)} y1={115.2 + r0*Math.sin(rad)}
              x2={153 + r1*Math.cos(rad)} y2={115.2 + r1*Math.sin(rad)}
              stroke={i%4===0?"#4A2810":"#361A08"} strokeWidth="0.48" opacity={i%3===0?0.18:0.12}
              clipPath="url(#cp-r-eye)"/>;
          })}
          <ellipse cx="153" cy="115.2" rx="6.0" ry="6.0" fill="#010004" clipPath="url(#cp-r-eye)"/>
          <ellipse cx="153" cy="115.2" rx="6.0" ry="6.0" fill="url(#g-pupil-depth)" clipPath="url(#cp-r-eye)"/>
          <ellipse cx="153" cy="115.2" rx="9.5" ry="9.3"
            fill="none" stroke="#1C0804" strokeWidth="1.0" opacity="0.26" clipPath="url(#cp-r-eye)"/>
          <ellipse cx="156.5" cy="110.5" rx="2.7" ry="2.4" fill="#FFFFFF" opacity="0.94"/>
          <ellipse cx="149.0" cy="120.0" rx="1.2" ry="1.0" fill="#FFFFFF" opacity="0.42"/>
          <path d="M 149,109 C 153,108 157,109 159,112"
            fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.85" strokeLinecap="round" clipPath="url(#cp-r-eye)"/>

          {blink ? (
            <path d="M 134,115 C 142,111 147,110 153,110 C 159,110 164,111 172,115"
              fill="none" stroke="#020010" strokeWidth="12.2" strokeLinecap="round"/>
          ) : (
            <>
              <path d="M 133,113 C 138,103 146,98 153,98 C 160,98 168,103 173,113
                C 164,109 158,108 153,109 C 148,108 140,109 133,113 Z"
                fill="#020010" opacity="0.93"/>
              <path d="M 135,114 C 140,108 147,106 153,107 C 159,106 166,108 171,113"
                fill="none" stroke="#020008" strokeWidth="2.6" strokeLinecap="round" opacity="0.29"/>
              <path d="M 137,116 C 142,111 148,109 153,110 C 158,109 164,111 169,115"
                fill="none" stroke="#020008" strokeWidth="1.0" strokeLinecap="round" opacity="0.11"/>
              <path d="M 135,112 C 141,108 153,107 168,111"
                fill="none" stroke="rgba(140,80,40,0.14)" strokeWidth="4" strokeLinecap="round" opacity="0.55"/>
            </>
          )}
          <path d="M 136,122 C 144,129 153,131 170,123"
            fill="none" stroke="#020008" strokeWidth="1.15" opacity="0.17" strokeLinecap="round"/>
          <ellipse cx="153" cy="131" rx="18" ry="5" fill="url(#g-undereye)" opacity="0.7"/>
          <path d="M 136,122 C 144,130 153,132 170,123"
            fill="none" stroke="url(#g-eye-water)" strokeWidth="1.8" opacity="0.28" strokeLinecap="round"/>

          {!blink && [
            [[135,112],[133,108],[131,103]],
            [[139,109],[138,105],[138,100]],
            [[144,107],[143,103],[144,98]],
            [[149,106],[149,102],[150,97]],
            [[154,106],[154,102],[155,98]],
            [[159,107],[160,103],[162,99]],
            [[164,109],[166,105],[169,102]],
            [[168,112],[171,108],[174,105]]
          ].map(([p1,p2,p3],i)=>(
            <path key={i}
              d={`M ${p1[0]},${p1[1]} C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p3[0]},${p3[1]}`}
              fill="none" stroke="#010008" strokeWidth={1.15-i*0.04} strokeLinecap="round" opacity={0.72-i*0.02}/>
          ))}
          {[
            [[137,123],[136,126],[135,130]],[[142,126],[141,129],[141,132]],
            [[148,128],[147,131],[147,134]],[[154,129],[154,132],[154,135]],
            [[160,128],[161,131],[161,134]],[[166,125],[167,128],[168,131]]
          ].map(([p1,p2,p3],i)=>(
            <path key={i}
              d={`M ${p1[0]},${p1[1]} C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p3[0]},${p3[1]}`}
              fill="none" stroke="#010008" strokeWidth="0.75" strokeLinecap="round" opacity={0.33-i*0.02}/>
          ))}
          <path d="M 175,114 L 179,111" fill="none" stroke="#020008" strokeWidth="1.25" strokeLinecap="round" opacity="0.25"/>
          <ellipse cx="173" cy="116" rx="2.4" ry="1.6" fill="#B86060" opacity="0.15"/>

          {/* ╔════════════════╗
              ║  NOSE          ║
              ╚════════════════╝ */}
          {/* Bridge sides — sculpted */}
          <path d="M 125.5,139 C 123.5,151 122.5,162 124.5,170 C 126.5,174 130,175 133.5,174 C 135.5,170 136.5,161 135.5,150 C 134.5,141 133,139 131.5,138"
            fill="none" stroke="rgba(100,52,24,0.22)" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          {/* Bridge highlight */}
          <path d="M 130,140 C 131.2,151 131.2,160 130.2,168"
            fill="none" stroke="#E0AE70" strokeWidth="0.72" strokeLinecap="round" opacity="0.24"/>
          {/* Bridge narrow side shadows */}
          <path d="M 127.5,141 C 126.5,152 126,161 127,169"
            fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
          <path d="M 132.5,141 C 133.5,152 134,161 133,169"
            fill="none" stroke="rgba(0,0,0,0.055)" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"/>
          {/* Nose tip warm */}
          <ellipse cx="130" cy="170" rx="8.5" ry="5.5" fill="url(#g-nose-tip-warm)" opacity="0.75"/>
          {/* Tip highlight */}
          <ellipse cx="129" cy="168" rx="3.5" ry="2.5" fill="rgba(220,175,120,0.22)" opacity="0.7"/>
          {/* Alar wings */}
          <path d="M 118,167 C 121,163 124.5,162 127,163 C 128.5,164.5 129.5,167 128.5,170 C 127,174 122,175 119,171 Z"
            fill="rgba(0,0,0,0.045)" opacity="0.7"/>
          <path d="M 142,167 C 139,163 135.5,162 133,163 C 131.5,164.5 130.5,167 131.5,170 C 133,174 138,175 141,171 Z"
            fill="rgba(0,0,0,0.045)" opacity="0.7"/>
          {/* Alar shadow patches */}
          <ellipse cx="123" cy="167" rx="4.5" ry="2.8" fill="#6A3818" opacity="0.12"/>
          <ellipse cx="137" cy="167" rx="4.5" ry="2.8" fill="#6A3818" opacity="0.12"/>
          {/* Nostrils */}
          <path d="M 119,168 C 122,173 126.5,174.5 130,173"
            fill="none" stroke="#482010" strokeWidth="1.6" strokeLinecap="round" opacity="0.27"/>
          <path d="M 141,168 C 138,173 133.5,174.5 130,173"
            fill="none" stroke="#482010" strokeWidth="1.6" strokeLinecap="round" opacity="0.27"/>
          {/* Nostril inner dark */}
          <ellipse cx="123" cy="170" rx="3.2" ry="2.2" fill="rgba(28,8,2,0.3)" opacity="0.6"/>
          <ellipse cx="137" cy="170" rx="3.2" ry="2.2" fill="rgba(28,8,2,0.3)" opacity="0.6"/>
          {/* Under-nose shadow */}
          <ellipse cx="130" cy="174" rx="9" ry="4" fill="rgba(0,0,0,0.07)" opacity="0.7"/>
          {/* Philtrum groove (paired ridges) */}
          <path d="M 127.5,174 C 127,178 127.5,181.5 128.5,183"
            fill="none" stroke="url(#g-philtrum)" strokeWidth="3" strokeLinecap="round" opacity="0.55"/>
          <path d="M 132.5,174 C 133,178 132.5,181.5 131.5,183"
            fill="none" stroke="url(#g-philtrum)" strokeWidth="3" strokeLinecap="round" opacity="0.55"/>
          {/* Philtrum column highlights */}
          <path d="M 128.4,174 C 128.2,178 128.5,181.5 129,183"
            fill="none" stroke="rgba(200,155,100,0.16)" strokeWidth="0.7" strokeLinecap="round"/>
          <path d="M 131.6,174 C 131.8,178 131.5,181.5 131,183"
            fill="none" stroke="rgba(200,155,100,0.14)" strokeWidth="0.7" strokeLinecap="round"/>

          {/* ╔═══════════════════════════════════════════════════════╗
              ║  FACIAL HAIR — connected beard system, 60+ elements  ║
              ╚═══════════════════════════════════════════════════════╝ */}

          {/* Beard connection band — vertical gradient linking all zones */}
          <path d="M 113,184 C 110,192 108,200 107,208" fill="none" stroke="url(#g-beard-band)" strokeWidth="7" strokeLinecap="round" opacity="0.7"/>
          <path d="M 147,184 C 150,192 152,200 153,208" fill="none" stroke="url(#g-beard-band)" strokeWidth="7" strokeLinecap="round" opacity="0.7"/>

          {/* ── MUSTACHE ── */}
          {/* Gradient fill ellipse */}
          <ellipse cx="130" cy="176" rx="16.5" ry="5.5" fill="url(#g-moustache-fill)" opacity="0.52"/>
          {/* Layer 1 — base mass */}
          <path d="M 114,177 C 118,171 122,168 127,170 C 128.8,170 131.2,170 133,170 C 138,168 142,171 146,177"
            fill="none" stroke="#0A0806" strokeWidth="4.8" strokeLinecap="round" opacity="0.6"/>
          {/* Layer 2 — definition */}
          <path d="M 116,177 C 120,173 124,171 127.5,172 C 129,172 131,172 132.5,172.5 C 136.5,173 140,174.5 144,177"
            fill="none" stroke="#181410" strokeWidth="2.7" strokeLinecap="round" opacity="0.46"/>
          {/* Layer 3 — top edge */}
          <path d="M 118,176 C 122,173 126,172 129.5,172.5 C 130.5,172.5 131.5,172.5 133,173"
            fill="none" stroke="#221C16" strokeWidth="1.4" strokeLinecap="round" opacity="0.3"/>
          {/* Fine directional hairs — left side of moustache */}
          <path d="M 117,177 C 119,175 121,174 124,174"   fill="none" stroke="#060402" strokeWidth="0.82" strokeLinecap="round" opacity="0.24"/>
          <path d="M 120,176 C 122,174.5 124.5,174 126.5,174" fill="none" stroke="#060402" strokeWidth="0.8" strokeLinecap="round" opacity="0.22"/>
          <path d="M 123,174.5 C 125,174 127,174 128.5,174.5" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 126,174 C 127.5,174 129.2,174 130,174.5" fill="none" stroke="#060402" strokeWidth="0.75" strokeLinecap="round" opacity="0.18"/>
          {/* Fine directional hairs — right side */}
          <path d="M 130,174.5 C 131,174 132.5,174 134,174.5" fill="none" stroke="#060402" strokeWidth="0.75" strokeLinecap="round" opacity="0.18"/>
          <path d="M 133.5,174.5 C 135.5,174 137.5,174.5 139.5,175" fill="none" stroke="#060402" strokeWidth="0.78" strokeLinecap="round" opacity="0.2"/>
          <path d="M 137.5,175 C 139.5,175.5 141.5,176 143,177"   fill="none" stroke="#060402" strokeWidth="0.8" strokeLinecap="round" opacity="0.22"/>
          <path d="M 141,176 C 143,176.5 145,177.5 146,178"       fill="none" stroke="#060402" strokeWidth="0.82" strokeLinecap="round" opacity="0.24"/>
          {/* Corner wisps */}
          <path d="M 115,177 C 114,176 114,174.5 115,173.5" fill="none" stroke="#080604" strokeWidth="0.8" strokeLinecap="round" opacity="0.22"/>
          <path d="M 145,177 C 146,176 146,174.5 145,173.5" fill="none" stroke="#080604" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
          {/* Philtrum divot */}
          <path d="M 128.8,172 C 129.3,174.5 129.8,176 130,177"   fill="none" stroke="#0A0806" strokeWidth="1.3" strokeLinecap="round" opacity="0.19"/>
          <path d="M 131.2,172 C 130.7,174.5 130.2,176 130,177"   fill="none" stroke="#0A0806" strokeWidth="1.3" strokeLinecap="round" opacity="0.16"/>

          {/* ── SOUL PATCH ── */}
          <ellipse cx="130" cy="195.5" rx="5" ry="3.5" fill="#080604" opacity="0.2"/>
          <path d="M 127,193 C 128.5,196 129.5,198 130,200" fill="none" stroke="#050302" strokeWidth="0.72" strokeLinecap="round" opacity="0.2"/>
          <path d="M 130,193 C 130,196 130,198 130,200"     fill="none" stroke="#050302" strokeWidth="0.7" strokeLinecap="round" opacity="0.18"/>
          <path d="M 133,193 C 131.5,196 130.5,198 130,200" fill="none" stroke="#050302" strokeWidth="0.72" strokeLinecap="round" opacity="0.19"/>

          {/* ── CHIN GOATEE ── */}
          <ellipse cx="130" cy="205" rx="15" ry="9" fill="url(#g-stb-chin)" opacity="0.75"/>
          <path d="M 117,197 C 121,207 125.5,213 130,215 C 134.5,213 139,207 143,197"
            fill="none" stroke="#0A0806" strokeWidth="4.5" strokeLinecap="round" opacity="0.52"/>
          <path d="M 119,197 C 123,207 127,212 130,214 C 133,212 137,207 141,197"
            fill="none" stroke="#181410" strokeWidth="2.6" strokeLinecap="round" opacity="0.38"/>
          {/* Goatee hairs — 11 strokes */}
          <path d="M 120,199 C 122,206 123.5,211 123.5,214" fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.22"/>
          <path d="M 123,198 C 125,205 126,210 126,214"     fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.2"/>
          <path d="M 126,197 C 127.5,205 128,210 128,214"   fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.2"/>
          <path d="M 129,197 C 129.5,205 129.5,210 129,214" fill="none" stroke="#060402" strokeWidth="0.74" strokeLinecap="round" opacity="0.2"/>
          <path d="M 131,197 C 130.5,205 130.5,210 131,214" fill="none" stroke="#060402" strokeWidth="0.74" strokeLinecap="round" opacity="0.2"/>
          <path d="M 134,197 C 132.5,205 132,210 132,214"   fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.2"/>
          <path d="M 137,198 C 135,205 134,210 134,214"     fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.2"/>
          <path d="M 140,199 C 138,206 136.5,211 136.5,214" fill="none" stroke="#060402" strokeWidth="0.76" strokeLinecap="round" opacity="0.22"/>
          {/* Edge hairs */}
          <path d="M 118,199 C 119,204 120,208 120,212" fill="none" stroke="#060402" strokeWidth="0.68" strokeLinecap="round" opacity="0.17"/>
          <path d="M 142,199 C 141,204 140,208 140,212" fill="none" stroke="#060402" strokeWidth="0.68" strokeLinecap="round" opacity="0.17"/>

          {/* ── JAW STUBBLE — dense multi-row field ── */}
          {/* Base gradient patches */}
          <ellipse cx="96"  cy="183" rx="20" ry="14" fill="url(#g-stb-jaw)" opacity="0.9"/>
          <ellipse cx="99"  cy="172" rx="14" ry="11" fill="url(#g-stb-jaw)" opacity="0.58"/>
          <ellipse cx="105" cy="165" rx="9"  ry="8"  fill="url(#g-stb-jaw)" opacity="0.38"/>
          <ellipse cx="164" cy="183" rx="20" ry="14" fill="url(#g-stb-jaw)" opacity="0.9"/>
          <ellipse cx="161" cy="172" rx="14" ry="11" fill="url(#g-stb-jaw)" opacity="0.58"/>
          <ellipse cx="155" cy="165" rx="9"  ry="8"  fill="url(#g-stb-jaw)" opacity="0.38"/>
          {/* Chin-to-jaw connection */}
          <ellipse cx="115" cy="194" rx="7" ry="6" fill="url(#g-stb-jaw)" opacity="0.45"/>
          <ellipse cx="145" cy="194" rx="7" ry="6" fill="url(#g-stb-jaw)" opacity="0.45"/>

          {/* Left stubble — row 1 top (cheek-high) */}
          {[[96,166],[100,165],[104,164],[108,164],[112,165]].map(([sx,sy],i)=>(
            <path key={`ls1-${i}`} d={`M ${sx},${sy} C ${sx+1.5},${sy+3} ${sx+1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.12-i*0.01}/>
          ))}
          {/* Left stubble — row 2 mid */}
          {[[90,174],[94,173],[98,172],[102,171],[106,171],[110,171],[114,172]].map(([sx,sy],i)=>(
            <path key={`ls2-${i}`} d={`M ${sx},${sy} C ${sx+1.5},${sy+3} ${sx+1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.13-i*0.008}/>
          ))}
          {/* Left stubble — row 3 jaw */}
          {[[88,182],[92,181],[96,180],[100,179],[104,179],[108,180],[112,180],[116,181]].map(([sx,sy],i)=>(
            <path key={`ls3-${i}`} d={`M ${sx},${sy} C ${sx+1.5},${sy+3} ${sx+1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity={0.12-i*0.006}/>
          ))}
          {/* Left stubble — row 4 lower jaw */}
          {[[90,190],[94,189],[98,188],[102,188],[106,189],[110,190],[114,191]].map(([sx,sy],i)=>(
            <path key={`ls4-${i}`} d={`M ${sx},${sy} C ${sx+1.5},${sy+3} ${sx+1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.11-i*0.006}/>
          ))}

          {/* Right stubble — row 1 */}
          {[[164,166],[160,165],[156,164],[152,164],[148,165]].map(([sx,sy],i)=>(
            <path key={`rs1-${i}`} d={`M ${sx},${sy} C ${sx-1.5},${sy+3} ${sx-1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.12-i*0.01}/>
          ))}
          {/* Right stubble — row 2 */}
          {[[170,174],[166,173],[162,172],[158,171],[154,171],[150,171],[146,172]].map(([sx,sy],i)=>(
            <path key={`rs2-${i}`} d={`M ${sx},${sy} C ${sx-1.5},${sy+3} ${sx-1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.13-i*0.008}/>
          ))}
          {/* Right stubble — row 3 */}
          {[[172,182],[168,181],[164,180],[160,179],[156,179],[152,180],[148,180],[144,181]].map(([sx,sy],i)=>(
            <path key={`rs3-${i}`} d={`M ${sx},${sy} C ${sx-1.5},${sy+3} ${sx-1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.62" strokeLinecap="round" opacity={0.12-i*0.006}/>
          ))}
          {/* Right stubble — row 4 */}
          {[[170,190],[166,189],[162,188],[158,188],[154,189],[150,190],[146,191]].map(([sx,sy],i)=>(
            <path key={`rs4-${i}`} d={`M ${sx},${sy} C ${sx-1.5},${sy+3} ${sx-1.5},${sy+6} ${sx},${sy+8}`}
              fill="none" stroke="#080604" strokeWidth="0.6" strokeLinecap="round" opacity={0.11-i*0.006}/>
          ))}

          {/* ╔════════════════════════╗
              ║  MOUTH (animated)      ║
              ╚════════════════════════╝ */}
          <g className="ayrin-mouth">
            {/* Vermillion border — warm outline */}
            <path d="M 113,183 C 117,174 122,170 127,172 C 128.8,169 131.2,169 133,172 C 138,170 143,174 147,183"
              fill="none" stroke="rgba(190,100,90,0.22)" strokeWidth="2.2" strokeLinecap="round"/>
            {/* Upper lip — cupid's bow */}
            <path d="
              M 115,183 C 119,175 123,172 127.5,174.5
              C 129.2,172 130.8,172 132.5,174.5
              C 137,172 141.5,175 145,183
              C 141,179.5 137,178.5 132.5,179.5
              C 130.2,178 129.8,178 127.5,179.5
              C 123,178.5 119,179.5 115,183 Z
            " fill="url(#g-lip-up)" opacity="0.91"/>
            {/* Upper lip skin texture micro-lines */}
            <path d="M 120,181 C 121.5,179.5 122.5,178.5 124,178.5"   fill="none" stroke="rgba(70,28,26,0.12)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 125,179.5 C 126.5,179 128,179 129.5,179.5"     fill="none" stroke="rgba(70,28,26,0.1)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 130.5,179.5 C 132,179 133.5,179 135,179.5"     fill="none" stroke="rgba(70,28,26,0.1)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 136,179.5 C 137.5,179.5 139,180 140.5,181"     fill="none" stroke="rgba(70,28,26,0.12)" strokeWidth="0.5" strokeLinecap="round"/>
            {/* Cupid bow highlight */}
            <path d="M 122,181 C 125.5,180 129,179.8 138.5,181.2"
              fill="none" stroke="rgba(228,192,200,0.26)" strokeWidth="0.85" strokeLinecap="round"/>
            {/* Mouth corner shadow line */}
            <path d="M 116,183 C 121,182 127,181.8 130,182 C 133,181.8 139,182 144,183"
              fill="none" stroke="rgba(35,10,8,0.3)" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
            {/* Lower lip — fuller, natural */}
            <path d="
              M 116,183 C 119,193 124,199 129.5,200.5
              C 132,201 134.5,200 137.5,198
              C 142.5,194.5 145,189 145,183
              C 141,188.5 137,192 130,192.5
              C 123,192 119,188.5 116,183 Z
            " fill="url(#g-lip-lo)" opacity="0.91"/>
            {/* Lower lip highlight central */}
            <path d="M 122,191 C 126,193 130,193.8 135.5,192"
              fill="none" stroke="rgba(228,185,190,0.26)" strokeWidth="0.9" strokeLinecap="round"/>
            {/* Lower lip gloss */}
            <ellipse cx="130" cy="193.5" rx="9.5" ry="4" fill="url(#g-lip-gloss)" opacity="0.24"/>
            {/* Lower lip dark inner */}
            <ellipse cx="130" cy="184" rx="15.5" ry="2.8" fill="url(#g-lip-dark)" opacity="0.32"/>
            {/* Lip skin texture lines — lower */}
            <path d="M 120,186 C 121,188.5 122,191 123.5,193"   fill="none" stroke="rgba(72,30,28,0.09)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 125,185 C 126,188 127,191.5 128,194"     fill="none" stroke="rgba(72,30,28,0.07)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 130,184.5 C 130,188 130,192 130,195"     fill="none" stroke="rgba(72,30,28,0.07)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 135,185 C 134,188 133,191.5 132,194"     fill="none" stroke="rgba(72,30,28,0.07)" strokeWidth="0.5" strokeLinecap="round"/>
            <path d="M 140,186 C 139,188.5 138,191 136.5,193"   fill="none" stroke="rgba(72,30,28,0.09)" strokeWidth="0.5" strokeLinecap="round"/>
            {/* Corner asymmetry */}
            <path d="M 116,183 C 115.2,184.8 115.3,186.6 116,187.8"   fill="none" stroke="#522828" strokeWidth="0.95" strokeLinecap="round" opacity="0.22"/>
            <path d="M 145,183 C 145.8,185.2 145.7,187.0 145,188.5"   fill="none" stroke="#522828" strokeWidth="0.95" strokeLinecap="round" opacity="0.18"/>
            {/* Lip crease */}
            <path d="M 124,191.5 C 127,193.2 130,193.8 134,193"
              fill="none" stroke="rgba(46,18,16,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
          </g>

          {/* Rim light overlay on face edge — adds cinematic 3D */}
          <path d="M 89,115 C 89,64 109,37 130,35 C 151,37 171,64 171,115 C 171,154 161,188 143,210 C 137,218 133,222 130,222 C 127,222 123,218 117,210 C 99,188 89,154 89,115 Z"
            fill="none" stroke="url(#g-rim-light)" strokeWidth="3.5" opacity="0.5"/>

        </g>{/* end .ayrin-head */}
      </g>{/* end .ayrin-breath */}
    </svg>
  );
}