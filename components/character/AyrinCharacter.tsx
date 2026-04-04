'use client';

import {
  useEffect, useRef, useState, useCallback,
  useMemo, useLayoutEffect, memo
} from 'react';

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type LODLevel   = 0 | 1 | 2 | 3;
type EmotionKey =
  | 'calm' | 'thoughtful' | 'affectionate' | 'shy' | 'concerned'
  | 'softSmile' | 'serious' | 'reflective' | 'warmAttention'
  | 'quietSadness' | 'subtleSurprise';

interface LODConfig {
  irisRayCount:    number;
  stubbleDensity:  number;
  hairStrandCount: number;
  foldCount:       number;
  showPores:       boolean;
  showLashes:      boolean;
  showVeins:       boolean;
  showKnuckles:    boolean;
  glowIntensity:   number;
  shaderQuality:   'off' | 'low' | 'high';
}

interface EmotionTarget {
  browLiftL: number; browLiftR: number;
  browAngleL: number; browAngleR: number;
  lidDropL: number; lidDropR: number;
  eyeOffsetX: number; eyeOffsetY: number;
  pupilScale: number;
  mouthCornerL: number; mouthCornerR: number;
  lowerLipDrop: number;
  headTiltX: number; headTiltY: number;
  breathScale: number; blinkFreq: number;
}

type StubblePoint = [number, number, number, number];

interface FaceState extends EmotionTarget {
  microBrowL: number; microBrowR: number;
  microGazeX: number; microGazeY: number;
  microLidL: number; microLidR: number;
  microLipTension: number; microLipAsym: number;
  lightPulse: number; rimPulse: number;
  postBlinkDroopL: number; postBlinkDroopR: number;
}

interface EyeState {
  gazeX: number;
  gazeY: number;
  pupilScale: number;
  lidDrop: number;
  blinkAmt: number;
  postDroop: number;
}

interface BrowState {
  leftTransform: string;
  rightTransform: string;
  showPores: boolean;
}

interface LipState {
  jawRotation: number;
  jawTranslateY: number;
  leftCornerX: number;
  leftCornerY: number;
  rightCornerX: number;
  rightCornerY: number;
  microLipTension: number;
  microLipAsym: number;
  lowerLipDrop: number;
}

interface HairState {
  strandCount: number;
  microOffset: number;
}

type CharacterState =
  | 'idle'
  | 'engaged'
  | 'affection'
  | 'thinking'
  | 'surprised'
  | 'sad';

type CharacterEvent =
  | 'MOUSE_ENTER'
  | 'MOUSE_LEAVE'
  | 'CLICK'
  | 'TIME_PASS'
  | 'FOCUS';

interface AnimationGraphNode {
  base: EmotionKey;
  overlay?: EmotionKey;
  overlayWeight: number;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  precision: number;
}

interface Bone {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface CharacterRig {
  head: Bone;
  jaw: Bone;
  eyeL: Bone;
  eyeR: Bone;
  browL: Bone;
  browR: Bone;
  lipCornerL: Bone;
  lipCornerR: Bone;
}

/* ═══════════════════════════════════════════════════════════════
   LOD CONFIG
═══════════════════════════════════════════════════════════════ */
const LOD: Record<LODLevel, LODConfig> = {
  0: { irisRayCount:28,  stubbleDensity:1,    hairStrandCount:12, foldCount:5, showPores:true,  showLashes:true,  showVeins:true,  showKnuckles:true,  glowIntensity:0.85, shaderQuality:'high' },
  1: { irisRayCount:16,  stubbleDensity:0.65, hairStrandCount:8,  foldCount:3, showPores:false, showLashes:true,  showVeins:false, showKnuckles:true,  glowIntensity:0.6,  shaderQuality:'low'  },
  2: { irisRayCount:8,   stubbleDensity:0.35, hairStrandCount:5,  foldCount:2, showPores:false, showLashes:false, showVeins:false, showKnuckles:false, glowIntensity:0.35, shaderQuality:'low'  },
  3: { irisRayCount:0,   stubbleDensity:0.12, hairStrandCount:2,  foldCount:1, showPores:false, showLashes:false, showVeins:false, showKnuckles:false, glowIntensity:0,    shaderQuality:'off'  },
};
const LOD_THRESHOLDS = [200, 130, 80] as const;

/* ═══════════════════════════════════════════════════════════════
   EMOTION TABLE — tuned for calm, grounded personality
═══════════════════════════════════════════════════════════════ */
const EMOTIONS: Record<EmotionKey, EmotionTarget> = {
  calm:           { browLiftL:0,    browLiftR:0,    browAngleL:0,    browAngleR:0,    lidDropL:0.12, lidDropR:0.11, eyeOffsetX:0,    eyeOffsetY:0,   pupilScale:1.0,  mouthCornerL:0,    mouthCornerR:0,    lowerLipDrop:0,   headTiltX:-2.5, headTiltY:0,   breathScale:1,    blinkFreq:4000 },
  thoughtful:     { browLiftL:-1.2, browLiftR:0.4,  browAngleL:-0.8, browAngleR:0.8,  lidDropL:0.18, lidDropR:0.14, eyeOffsetX:1.5,  eyeOffsetY:1.2, pupilScale:0.96, mouthCornerL:0.3,  mouthCornerR:0.1,  lowerLipDrop:0.1, headTiltX:-3.2, headTiltY:1.2, breathScale:0.97, blinkFreq:4800 },
  affectionate:   { browLiftL:-1.5, browLiftR:-1.4, browAngleL:0.4,  browAngleR:-0.3, lidDropL:0.2,  lidDropR:0.18, eyeOffsetX:0,    eyeOffsetY:0.4, pupilScale:1.1,  mouthCornerL:-0.7, mouthCornerR:-0.5, lowerLipDrop:0.3, headTiltX:-2.8, headTiltY:-0.8,breathScale:1.01, blinkFreq:3200 },
  shy:            { browLiftL:0.8,  browLiftR:1.2,  browAngleL:1.2,  browAngleR:1.6,  lidDropL:0.24, lidDropR:0.27, eyeOffsetX:-0.8, eyeOffsetY:1.5, pupilScale:1.08, mouthCornerL:0.3,  mouthCornerR:0.2,  lowerLipDrop:0.1, headTiltX:-3.8, headTiltY:-1.6,breathScale:1.03, blinkFreq:2600 },
  concerned:      { browLiftL:-0.8, browLiftR:0.8,  browAngleL:-1.8, browAngleR:1.8,  lidDropL:0.08, lidDropR:0.08, eyeOffsetX:0,    eyeOffsetY:-0.3,pupilScale:1.03, mouthCornerL:0.7,  mouthCornerR:0.6,  lowerLipDrop:0.4, headTiltX:-2.2, headTiltY:0.4, breathScale:0.98, blinkFreq:3400 },
  softSmile:      { browLiftL:-0.8, browLiftR:-0.6, browAngleL:0,    browAngleR:0,    lidDropL:0.18, lidDropR:0.15, eyeOffsetX:0,    eyeOffsetY:0,   pupilScale:1.06, mouthCornerL:-1.1, mouthCornerR:-0.9, lowerLipDrop:0.5, headTiltX:-3.0, headTiltY:0,   breathScale:1.01, blinkFreq:3600 },
  serious:        { browLiftL:0.4,  browLiftR:0.3,  browAngleL:-1.2, browAngleR:-0.8, lidDropL:0.06, lidDropR:0.06, eyeOffsetX:0,    eyeOffsetY:0,   pupilScale:0.92, mouthCornerL:0.2,  mouthCornerR:0.1,  lowerLipDrop:0,   headTiltX:-1.8, headTiltY:0,   breathScale:0.95, blinkFreq:5200 },
  reflective:     { browLiftL:-0.4, browLiftR:0,    browAngleL:0.4,  browAngleR:0,    lidDropL:0.22, lidDropR:0.2,  eyeOffsetX:-2.0, eyeOffsetY:0.8, pupilScale:1.0,  mouthCornerL:0.15, mouthCornerR:0.1,  lowerLipDrop:0.2, headTiltX:-4.2, headTiltY:-1.2,breathScale:0.97, blinkFreq:5000 },
  warmAttention:  { browLiftL:-1.2, browLiftR:-1.0, browAngleL:0.2,  browAngleR:-0.2, lidDropL:0.12, lidDropR:0.1,  eyeOffsetX:0,    eyeOffsetY:0,   pupilScale:1.14, mouthCornerL:-0.4, mouthCornerR:-0.2, lowerLipDrop:0.2, headTiltX:-2.8, headTiltY:0,   breathScale:1.0,  blinkFreq:3400 },
  quietSadness:   { browLiftL:1.6,  browLiftR:2.0,  browAngleL:2.5,  browAngleR:3.0,  lidDropL:0.3,  lidDropR:0.32, eyeOffsetX:0,    eyeOffsetY:1.6, pupilScale:1.03, mouthCornerL:1.0,  mouthCornerR:1.1,  lowerLipDrop:0.2, headTiltX:-4.6, headTiltY:-0.4,breathScale:0.96, blinkFreq:5600 },
  subtleSurprise: { browLiftL:-2.4, browLiftR:-2.0, browAngleL:-0.4, browAngleR:0.4,  lidDropL:0.02, lidDropR:0.02, eyeOffsetX:0,    eyeOffsetY:-0.8,pupilScale:1.14, mouthCornerL:0.2,  mouthCornerR:0.1,  lowerLipDrop:0.6, headTiltX:-1.4, headTiltY:0,   breathScale:1.05, blinkFreq:2800 },
};

const STATE_TRANSITIONS: Record<CharacterState, Partial<Record<CharacterEvent, CharacterState>>> = {
  idle: {
    MOUSE_ENTER: 'engaged',
    CLICK: 'affection',
    FOCUS: 'thinking',
  },
  engaged: {
    MOUSE_LEAVE: 'idle',
    CLICK: 'affection',
    FOCUS: 'thinking',
  },
  affection: {
    TIME_PASS: 'idle',
    MOUSE_LEAVE: 'idle',
  },
  thinking: {
    TIME_PASS: 'idle',
    MOUSE_ENTER: 'engaged',
    CLICK: 'affection',
  },
  surprised: {
    TIME_PASS: 'engaged',
    MOUSE_LEAVE: 'idle',
  },
  sad: {
    TIME_PASS: 'idle',
    MOUSE_ENTER: 'engaged',
    CLICK: 'affection',
  },
};

const STATE_TIMEOUTS: Partial<Record<CharacterState, number>> = {
  affection: 2200,
  thinking: 4200,
  surprised: 1800,
  sad: 5200,
};

const STATE_GRAPH: Record<CharacterState, AnimationGraphNode> = {
  idle: { base: 'calm', overlayWeight: 0 },
  engaged: { base: 'calm', overlay: 'warmAttention', overlayWeight: 0.78 },
  affection: { base: 'warmAttention', overlay: 'softSmile', overlayWeight: 0.84 },
  thinking: { base: 'thoughtful', overlay: 'reflective', overlayWeight: 0.42 },
  surprised: { base: 'calm', overlay: 'subtleSurprise', overlayWeight: 0.9 },
  sad: { base: 'reflective', overlay: 'quietSadness', overlayWeight: 0.82 },
};

/* ═══════════════════════════════════════════════════════════════
   TIMING — identity-tuned: calm, slow, grounded
═══════════════════════════════════════════════════════════════ */
const T = {
  emotionBlend:        700,
  /* micro oscillators — irrational to prevent sync */
  microBrowLFreq:      0.000289,
  microBrowRFreq:      0.000241,
  microGazeXFreq:      0.000361,
  microGazeYFreq:      0.000287,
  microLidLFreq:       0.000447,
  microLidRFreq:       0.000419,
  microLipTensionFreq: 0.000161,
  microLipAsymFreq:    0.000133,
  lightPulseFreq:      0.000658,
  rimPulseFreq:        0.000571,
  /* amplitudes — reduced for calm personality */
  microBrowAmpl:       0.18,    // was 0.28 — calmer brow
  microGazeXAmpl:      0.55,    // was 0.9  — gentle drift
  microGazeYAmpl:      0.38,    // was 0.6
  microLidAmpl:        0.018,   // was 0.025 — subtle flutter
  microLipAmpl:        0.055,   // was 0.08
  lightPulseAmpl:      0.08,    // softer light variation
  rimPulseAmpl:        0.06,
  /* gaze — slower, more purposeful */
  gazeSettleDuration:  2400,    // was 1800
  gazeSettlePause:     3200,    // was 2400 — holds longer
  gazeSettleAmplX:     0.9,     // was 1.4
  gazeSettleAmplY:     0.55,    // was 0.9
  /* blink */
  postBlinkDroopPeak:  0.1,
  postBlinkDroopDecay: 420,
  /* breathing */
  breathAsymDelay:     240,
} as const;

const DEFAULT_EMOTION_SPRING: SpringConfig = {
  stiffness: 0.085,
  damping: 0.72,
  precision: 0.0012,
};

const EMOTION_TARGET_KEYS = Object.keys(EMOTIONS.calm) as (keyof EmotionTarget)[];

/* ═══════════════════════════════════════════════════════════════
   EASING
═══════════════════════════════════════════════════════════════ */
const easeInOut  = (t: number) => t<.5?2*t*t:-1+(4-2*t)*t;
const easeOutQ   = (t: number) => 1-(1-t)*(1-t);
const lerp       = (a: number, b: number, t: number) => a+(b-a)*t;

const seededRng  = (seed: number) => {
  let s = seed;
  return () => { s=(s*16807+0)%2147483647; return (s-1)/2147483646; };
};

function blendEmotionTargets(a: EmotionTarget, b: EmotionTarget, weight: number): EmotionTarget {
  const out = { ...a };

  for (const key of EMOTION_TARGET_KEYS) {
    out[key] = lerp(a[key], b[key], weight);
  }

  return out;
}

function createZeroEmotionTarget(): EmotionTarget {
  return {
    browLiftL: 0,
    browLiftR: 0,
    browAngleL: 0,
    browAngleR: 0,
    lidDropL: 0,
    lidDropR: 0,
    eyeOffsetX: 0,
    eyeOffsetY: 0,
    pupilScale: 0,
    mouthCornerL: 0,
    mouthCornerR: 0,
    lowerLipDrop: 0,
    headTiltX: 0,
    headTiltY: 0,
    breathScale: 0,
    blinkFreq: 0,
  };
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function createBone(x: number, y: number, rotation = 0, scale = 1): Bone {
  return { x, y, rotation, scale };
}

const BASE_RIG: CharacterRig = {
  head: createBone(130, 160),
  jaw: createBone(130, 186),
  eyeL: createBone(107, 114),
  eyeR: createBone(153, 114),
  browL: createBone(104, 102),
  browR: createBone(156, 102),
  lipCornerL: createBone(117, 186),
  lipCornerR: createBone(144, 186),
};

function cloneRig(rig: CharacterRig): CharacterRig {
  return {
    head: { ...rig.head },
    jaw: { ...rig.jaw },
    eyeL: { ...rig.eyeL },
    eyeR: { ...rig.eyeR },
    browL: { ...rig.browL },
    browR: { ...rig.browR },
    lipCornerL: { ...rig.lipCornerL },
    lipCornerR: { ...rig.lipCornerR },
  };
}

function resolveRigTarget(face: FaceState): CharacterRig {
  const leftCornerYOffset = clamp(face.mouthCornerL * 1.35 + face.microLipAsym * 0.65, -4, 4);
  const rightCornerYOffset = clamp(face.mouthCornerR * 1.35 - face.microLipAsym * 0.65, -4, 4);

  return {
    head: {
      ...BASE_RIG.head,
      x: BASE_RIG.head.x + clamp(face.eyeOffsetX * 0.15, -1.2, 1.2),
      y: BASE_RIG.head.y + clamp(face.headTiltY * 1.2, -6, 6),
      rotation: clamp(face.headTiltX, -8, 4),
    },
    jaw: {
      ...BASE_RIG.jaw,
      y: BASE_RIG.jaw.y + clamp(face.lowerLipDrop * 2.1 + Math.max(0, face.microLipTension) * 1.2, 0, 4.5),
      rotation: clamp(face.lowerLipDrop * 12 + Math.abs(face.microLipTension) * 4.5, 0, 14),
    },
    eyeL: {
      ...BASE_RIG.eyeL,
      x: BASE_RIG.eyeL.x + clamp(face.microGazeX, -2, 2),
      y: BASE_RIG.eyeL.y + clamp(face.microGazeY, -1.5, 1.5),
    },
    eyeR: {
      ...BASE_RIG.eyeR,
      x: BASE_RIG.eyeR.x + clamp(face.microGazeX, -2, 2),
      y: BASE_RIG.eyeR.y + clamp(face.microGazeY, -1.5, 1.5),
    },
    browL: {
      ...BASE_RIG.browL,
      x: BASE_RIG.browL.x + clamp(face.browAngleL * 0.18, -1.2, 1.2),
      y: BASE_RIG.browL.y + clamp(face.browLiftL + face.microBrowL, -3, 3),
      rotation: clamp(face.browAngleL, -8, 8),
    },
    browR: {
      ...BASE_RIG.browR,
      x: BASE_RIG.browR.x + clamp(face.browAngleR * 0.18, -1.2, 1.2),
      y: BASE_RIG.browR.y + clamp(face.browLiftR + face.microBrowR, -3, 3),
      rotation: clamp(face.browAngleR, -8, 8),
    },
    lipCornerL: {
      ...BASE_RIG.lipCornerL,
      x: BASE_RIG.lipCornerL.x + clamp(face.mouthCornerL * 0.7, -2.4, 2.4),
      y: BASE_RIG.lipCornerL.y + leftCornerYOffset + clamp(face.lowerLipDrop * 0.35, -0.5, 1.2),
    },
    lipCornerR: {
      ...BASE_RIG.lipCornerR,
      x: BASE_RIG.lipCornerR.x - clamp(face.mouthCornerR * 0.7, -2.4, 2.4),
      y: BASE_RIG.lipCornerR.y + rightCornerYOffset + clamp(face.lowerLipDrop * 0.35, -0.5, 1.2),
    },
  };
}

function constrainRig(rig: CharacterRig): CharacterRig {
  const next = cloneRig(rig);

  next.head.x = clamp(next.head.x, BASE_RIG.head.x - 1.2, BASE_RIG.head.x + 1.2);
  next.head.y = clamp(next.head.y, BASE_RIG.head.y - 6, BASE_RIG.head.y + 6);
  next.head.rotation = clamp(next.head.rotation, -8, 4);

  next.jaw.y = clamp(next.jaw.y, BASE_RIG.jaw.y, BASE_RIG.jaw.y + 4.5);
  next.jaw.rotation = clamp(next.jaw.rotation, 0, 14);

  next.eyeL.x = clamp(next.eyeL.x, BASE_RIG.eyeL.x - 2, BASE_RIG.eyeL.x + 2);
  next.eyeL.y = clamp(next.eyeL.y, BASE_RIG.eyeL.y - 1.5, BASE_RIG.eyeL.y + 1.5);
  next.eyeR.x = clamp(next.eyeR.x, BASE_RIG.eyeR.x - 2, BASE_RIG.eyeR.x + 2);
  next.eyeR.y = clamp(next.eyeR.y, BASE_RIG.eyeR.y - 1.5, BASE_RIG.eyeR.y + 1.5);

  next.browL.x = clamp(next.browL.x, BASE_RIG.browL.x - 1.2, BASE_RIG.browL.x + 1.2);
  next.browL.y = clamp(next.browL.y, BASE_RIG.browL.y - 3, BASE_RIG.browL.y + 3);
  next.browL.rotation = clamp(next.browL.rotation, -8, 8);
  next.browR.x = clamp(next.browR.x, BASE_RIG.browR.x - 1.2, BASE_RIG.browR.x + 1.2);
  next.browR.y = clamp(next.browR.y, BASE_RIG.browR.y - 3, BASE_RIG.browR.y + 3);
  next.browR.rotation = clamp(next.browR.rotation, -8, 8);

  next.lipCornerL.x = clamp(next.lipCornerL.x, BASE_RIG.lipCornerL.x - 2.8, BASE_RIG.lipCornerL.x + 2.8);
  next.lipCornerL.y = clamp(next.lipCornerL.y, BASE_RIG.lipCornerL.y - 4, BASE_RIG.lipCornerL.y + 4);
  next.lipCornerR.x = clamp(next.lipCornerR.x, BASE_RIG.lipCornerR.x - 2.8, BASE_RIG.lipCornerR.x + 2.8);
  next.lipCornerR.y = clamp(next.lipCornerR.y, BASE_RIG.lipCornerR.y - 4, BASE_RIG.lipCornerR.y + 4);

  return next;
}

function stepBone(current: Bone, target: Bone, positionLag: number, rotationLag: number, scaleLag = positionLag): Bone {
  return {
    x: current.x + (target.x - current.x) * positionLag,
    y: current.y + (target.y - current.y) * positionLag,
    rotation: current.rotation + (target.rotation - current.rotation) * rotationLag,
    scale: current.scale + (target.scale - current.scale) * scaleLag,
  };
}

function stepRig(current: CharacterRig, face: FaceState): CharacterRig {
  const target = constrainRig(resolveRigTarget(face));

  return constrainRig({
    head: stepBone(current.head, target.head, 0.08, 0.08),
    jaw: stepBone(current.jaw, target.jaw, 0.12, 0.12),
    eyeL: stepBone(current.eyeL, target.eyeL, 0.18, 0.16),
    eyeR: stepBone(current.eyeR, target.eyeR, 0.18, 0.16),
    browL: stepBone(current.browL, target.browL, 0.14, 0.16),
    browR: stepBone(current.browR, target.browR, 0.14, 0.16),
    lipCornerL: stepBone(current.lipCornerL, target.lipCornerL, 0.12, 0.12),
    lipCornerR: stepBone(current.lipCornerR, target.lipCornerR, 0.12, 0.12),
  });
}

/* ═══════════════════════════════════════════════════════════════
   WEBGL SHADER  — softened for warm skin, less drama
═══════════════════════════════════════════════════════════════ */
const VERT = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}`;
const FRAG = `
precision mediump float;
varying vec2 uv;
uniform float t;uniform float inten;uniform float warmth;
uniform float lightP;uniform float rimP;
float R(vec2 u,vec2 c,float r){vec2 d=(u-c)*vec2(1.35,1);return smoothstep(r,0.,length(d));}
void main(){
  vec4 c=vec4(0);
  float key=R(uv,vec2(.3,.22),.38);
  c+=vec4(1.,.96,.84,1.)*key*(.08+lightP*.03)*inten;
  float wl=R(uv,vec2(.27,.48),.17),wr=R(uv,vec2(.73,.48),.14);
  c+=vec4(1.,.38,.18,1.)*(wl+wr*.78)*(.065+warmth*.03)*inten;
  float fl=R(uv,vec2(.8,.50),.38);
  c+=vec4(.20,.30,.78,1.)*fl*.038*inten;
  float el=R(uv,vec2(.378,.285),.085),er=R(uv,vec2(.558,.285),.085);
  c+=vec4(.68,.52,.22,1.)*(el+er)*(.09+lightP*.025)*inten;
  float wt1=R(uv,vec2(.394,.268),.019),wt2=R(uv,vec2(.558,.268),.019);
  c+=vec4(1.,1.,1.,1.)*(wt1+wt2)*(.13+lightP*.04)*inten;
  float rimL=smoothstep(.22,.09,uv.x)*smoothstep(.33,.67,uv.y);
  float rimR=smoothstep(.78,.91,uv.x)*smoothstep(.33,.67,uv.y);
  float rg=.78+rimP*.05;
  c+=vec4(rg,.70,.34,1.)*rimL*(.10+rimP*.02)*inten;
  c+=vec4(rg,.70,.34,1.)*rimR*(.07+rimP*.02)*inten;
  float hr=R(uv,vec2(.5,.17),.28);
  c+=vec4(.48,.38,.28,1.)*hr*(.055+lightP*.02)*inten;
  float bp=sin(t*.87+.3)*.5+.5;
  float cb=R(uv,vec2(.44,.72),.24);
  c+=vec4(1.,.95,.86,1.)*cb*bp*.028*inten;
  vec2 vd=(uv-.5)*vec2(1.35,1);
  float vig=1.-smoothstep(.38,.72,length(vd));
  c.rgb*=vig*.14+.86;
  gl_FragColor=clamp(c,0.,1.);
}`;

/* ═══════════════════════════════════════════════════════════════
   useWebGLOverlay
═══════════════════════════════════════════════════════════════ */
function useWebGLOverlay(
  ref: React.RefObject<HTMLCanvasElement | null>,
  lod: LODConfig,
  face: FaceState,
  size: { w: number; h: number }
) {
  const gl   = useRef<WebGLRenderingContext|null>(null);
  const prog = useRef<WebGLProgram|null>(null);
  const raf  = useRef(0);
  const t0   = useRef(performance.now());

  useEffect(() => {
    if (lod.shaderQuality==='off') return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false}) as WebGLRenderingContext|null;
    if (!ctx) return;
    gl.current = ctx;
    ctx.enable(ctx.BLEND); ctx.blendFunc(ctx.ONE,ctx.ONE);
    const mk=(type:number,src:string)=>{const s=ctx.createShader(type)!;ctx.shaderSource(s,src);ctx.compileShader(s);return s;};
    const p=ctx.createProgram()!;
    ctx.attachShader(p,mk(ctx.VERTEX_SHADER,VERT));
    ctx.attachShader(p,mk(ctx.FRAGMENT_SHADER,FRAG));
    ctx.linkProgram(p); prog.current=p; ctx.useProgram(p);
    const buf=ctx.createBuffer()!;
    ctx.bindBuffer(ctx.ARRAY_BUFFER,buf);
    ctx.bufferData(ctx.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),ctx.STATIC_DRAW);
    const al=ctx.getAttribLocation(p,'p');
    ctx.enableVertexAttribArray(al); ctx.vertexAttribPointer(al,2,ctx.FLOAT,false,0,0);
    return ()=>{ctx.deleteProgram(p);};
  },[lod.shaderQuality]);

  useEffect(()=>{
    const canvas=ref.current,ctx=gl.current,p=prog.current;
    if(!canvas||!ctx||!p||lod.shaderQuality==='off') return;
    const tick=()=>{
      const t=(performance.now()-t0.current)*0.001;
      ctx.viewport(0,0,canvas.width,canvas.height); ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.useProgram(p);
      const u=(n:string)=>ctx.getUniformLocation(p,n);
      const q=lod.shaderQuality==='high'?1.0:0.62;
      ctx.uniform1f(u('t'),t);
      ctx.uniform1f(u('inten'),lod.glowIntensity*q);
      ctx.uniform1f(u('warmth'),Math.max(0,-face.mouthCornerL/2));
      ctx.uniform1f(u('lightP'),face.lightPulse);
      ctx.uniform1f(u('rimP'),face.rimPulse);
      ctx.drawArrays(ctx.TRIANGLE_STRIP,0,4);
      raf.current=requestAnimationFrame(tick);
    };
    raf.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  },[lod.glowIntensity,lod.shaderQuality,face]);
}

/* ═══════════════════════════════════════════════════════════════
   useLOD
═══════════════════════════════════════════════════════════════ */
function useLOD(ref: React.RefObject<HTMLDivElement | null>): LODLevel {
  const [lod,setLod]=useState<LODLevel>(0);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const ro=new ResizeObserver(([e])=>{
      const w=e.contentRect.width;
      const next:LODLevel=w>=LOD_THRESHOLDS[0]?0:w>=LOD_THRESHOLDS[1]?1:w>=LOD_THRESHOLDS[2]?2:3;
      setLod(next);
    });
    ro.observe(el); return ()=>ro.disconnect();
  },[]);
  return lod;
}

/* ═══════════════════════════════════════════════════════════════
   useGazeSettle — slow, purposeful
═══════════════════════════════════════════════════════════════ */
function useGazeSettle() {
  const st=useRef<{phase:'drift'|'hold';start:number;fromX:number;fromY:number;toX:number;toY:number}>({
    phase:'hold',start:performance.now(),fromX:0,fromY:0,toX:0,toY:0,
  });
  const rng=useRef(seededRng(42));
  return useCallback(()=>{
    const now=performance.now(),elapsed=now-st.current.start;
    if(st.current.phase==='drift'){
      const t=Math.min(1,elapsed/T.gazeSettleDuration);
      if(t>=1) st.current={phase:'hold',start:now,...{fromX:st.current.toX,fromY:st.current.toY,toX:st.current.toX,toY:st.current.toY}};
      return{x:lerp(st.current.fromX,st.current.toX,easeOutQ(t)),y:lerp(st.current.fromY,st.current.toY,easeOutQ(t))};
    } else {
      if(elapsed>T.gazeSettlePause){
        const nx=(rng.current()-0.5)*2*T.gazeSettleAmplX;
        const ny=(rng.current()-0.5)*2*T.gazeSettleAmplY;
        st.current={phase:'drift',start:now,fromX:st.current.toX,fromY:st.current.toY,toX:nx,toY:ny};
      }
      return{x:st.current.toX,y:st.current.toY};
    }
  },[]);
}

/* ═══════════════════════════════════════════════════════════════
   useBlinkSystem — slow, with partial blinks
═══════════════════════════════════════════════════════════════ */
function useBlinkSystem(baseFreq:number){
  const droopL=useRef(0),droopR=useRef(0),blinkVal=useRef(0);
  const rng=useRef(seededRng(77));
  const nextRef=useRef(performance.now()+baseFreq);
  const stRef=useRef<'open'|'closing'|'opening'>('open');
  const blinkStart=useRef(0),partial=useRef(false),droopDecay=useRef(0);
  const tick=useCallback((now:number,freq:number)=>{
    const elapsed=now-blinkStart.current;
    if(droopDecay.current>0){
      droopDecay.current=Math.max(0,droopDecay.current-(16/T.postBlinkDroopDecay));
      droopL.current=droopDecay.current*T.postBlinkDroopPeak;
      droopR.current=droopDecay.current*T.postBlinkDroopPeak*(0.86+rng.current()*0.14);
    }
    if(stRef.current==='open'){
      if(now>=nextRef.current){blinkStart.current=now;stRef.current='closing';partial.current=rng.current()<0.18;}
    } else if(stRef.current==='closing'){
      const dur=partial.current?65:80,peak=partial.current?0.5:1;
      blinkVal.current=easeInOut(Math.min(1,elapsed/dur))*peak;
      if(elapsed>=dur){stRef.current='opening';blinkStart.current=now;}
    } else {
      const dur=partial.current?85:105,peak=partial.current?0.5:1;
      blinkVal.current=peak*(1-easeOutQ(Math.min(1,elapsed/dur)));
      if(elapsed>=dur){
        stRef.current='open';blinkVal.current=0;droopDecay.current=1;
        nextRef.current=now+freq*(0.5+rng.current()*0.95);
      }
    }
    return blinkVal.current;
  },[]);
  return{tick,droopL,droopR};
}

/* ═══════════════════════════════════════════════════════════════
   useMicroRealism
═══════════════════════════════════════════════════════════════ */
interface MicroState {
  microBrowL:number;microBrowR:number;microGazeX:number;microGazeY:number;
  microLidL:number;microLidR:number;microLipTension:number;microLipAsym:number;
  lightPulse:number;rimPulse:number;postBlinkDroopL:number;postBlinkDroopR:number;blinkAmt:number;
}

const EMPTY_MICRO_STATE: MicroState = {
  microBrowL: 0,
  microBrowR: 0,
  microGazeX: 0,
  microGazeY: 0,
  microLidL: 0,
  microLidR: 0,
  microLipTension: 0,
  microLipAsym: 0,
  lightPulse: 0,
  rimPulse: 0,
  postBlinkDroopL: 0,
  postBlinkDroopR: 0,
  blinkAmt: 0,
};

function useMicroRealism(baseBlinkFreq:number){
  const mRef=useRef<MicroState>({
    microBrowL:0,microBrowR:0,microGazeX:0,microGazeY:0,
    microLidL:0,microLidR:0,microLipTension:0,microLipAsym:0,
    lightPulse:0,rimPulse:0,postBlinkDroopL:0,postBlinkDroopR:0,blinkAmt:0,
  });
  const gazeSettle=useGazeSettle();
  const blinkSys=useBlinkSystem(baseBlinkFreq);
  const t0=useRef(performance.now()),rafR=useRef(0);
  useEffect(()=>{
    const tick=()=>{
      const now=performance.now(),tMs=now-t0.current;
      const m=mRef.current;
      m.microBrowL=Math.sin(tMs*T.microBrowLFreq*Math.PI*2)*T.microBrowAmpl;
      m.microBrowR=Math.sin(tMs*T.microBrowRFreq*Math.PI*2+1.1)*T.microBrowAmpl;
      m.microLidL=Math.abs(Math.sin(tMs*T.microLidLFreq*Math.PI*2))*T.microLidAmpl;
      m.microLidR=Math.abs(Math.sin(tMs*T.microLidRFreq*Math.PI*2+0.7))*T.microLidAmpl;
      m.microLipTension=Math.sin(tMs*T.microLipTensionFreq*Math.PI*2)*T.microLipAmpl;
      m.microLipAsym=Math.sin(tMs*T.microLipAsymFreq*Math.PI*2+2.3)*T.microLipAmpl*0.5;
      m.lightPulse=(Math.sin(tMs*T.lightPulseFreq*Math.PI*2)*0.5+0.5)*T.lightPulseAmpl;
      m.rimPulse=(Math.sin(tMs*T.rimPulseFreq*Math.PI*2+1.8)*0.5+0.5)*T.rimPulseAmpl;
      const g=gazeSettle();
      m.microGazeX=g.x; m.microGazeY=g.y;
      m.blinkAmt=blinkSys.tick(now,baseBlinkFreq);
      m.postBlinkDroopL=blinkSys.droopL.current;
      m.postBlinkDroopR=blinkSys.droopR.current;
      rafR.current=requestAnimationFrame(tick);
    };
    rafR.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(rafR.current);
  },[baseBlinkFreq,gazeSettle,blinkSys.tick]);
  return mRef;
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER ENGINE
═══════════════════════════════════════════════════════════════ */
function resolveGraphTarget(state: CharacterState): EmotionTarget {
  const node = STATE_GRAPH[state];
  const base = EMOTIONS[node.base];

  if (!node.overlay || node.overlayWeight <= 0) {
    return { ...base };
  }

  return blendEmotionTargets(base, EMOTIONS[node.overlay], node.overlayWeight);
}

function composeFaceState(base: EmotionTarget, micro: MicroState): FaceState {
  return {
    ...base,
    microBrowL: micro.microBrowL,
    microBrowR: micro.microBrowR,
    microGazeX: base.eyeOffsetX + micro.microGazeX,
    microGazeY: base.eyeOffsetY + micro.microGazeY,
    microLidL: micro.microLidL,
    microLidR: micro.microLidR,
    microLipTension: micro.microLipTension,
    microLipAsym: micro.microLipAsym,
    lightPulse: micro.lightPulse,
    rimPulse: micro.rimPulse,
    postBlinkDroopL: micro.postBlinkDroopL,
    postBlinkDroopR: micro.postBlinkDroopR,
  };
}

function useStateMachine(initialState: CharacterState) {
  const [state, setState] = useState<CharacterState>(initialState);

  const send = useCallback((event: CharacterEvent) => {
    setState((current) => STATE_TRANSITIONS[current][event] ?? current);
  }, []);

  useEffect(() => {
    const timeoutMs = STATE_TIMEOUTS[state];
    if (!timeoutMs) {
      return;
    }

    const timer = window.setTimeout(() => {
      send('TIME_PASS');
    }, timeoutMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [send, state]);

  return { state, send };
}

function useAnimationGraph(state: CharacterState, emotionOverride?: EmotionKey) {
  return useMemo<EmotionTarget>(() => {
    if (emotionOverride) {
      return { ...EMOTIONS[emotionOverride] };
    }

    return resolveGraphTarget(state);
  }, [emotionOverride, state]);
}

function useSpringEmotionTarget(
  target: EmotionTarget,
  config: SpringConfig = DEFAULT_EMOTION_SPRING
) {
  const liveRef = useRef<EmotionTarget>({ ...target });
  const velocityRef = useRef<EmotionTarget>(createZeroEmotionTarget());
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const next = { ...liveRef.current };
      const nextVelocity = { ...velocityRef.current };

      for (const key of EMOTION_TARGET_KEYS) {
        const current = liveRef.current[key];
        const goal = targetRef.current[key];
        const velocity = velocityRef.current[key];
        const force = (goal - current) * config.stiffness;
        const steppedVelocity = (velocity + force) * config.damping;

        nextVelocity[key] = steppedVelocity;
        next[key] =
          Math.abs(steppedVelocity) < config.precision && Math.abs(goal - current) < config.precision
            ? goal
            : current + steppedVelocity;
      }

      velocityRef.current = nextVelocity;
      liveRef.current = next;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [config.damping, config.precision, config.stiffness]);

  return liveRef;
}

/* ═══════════════════════════════════════════════════════════════
   IRIS RAYS + STUBBLE DATA
═══════════════════════════════════════════════════════════════ */
const ALL_RAYS=Array.from({length:28},(_,i)=>(i*360)/28);

/* Stubble — irregular clusters matching natural beard growth pattern */
/* More density under chin/jawline, sparser on cheeks */
const STUBBLE_L:StubblePoint[]=[
  /* cheek upper — sparse */
  [97,162,1.1,0.75],[101,161,1.0,0.7],[105,161,1.0,0.65],[109,162,0.9,0.65],[113,163,0.8,0.6],
  /* cheek mid */
  [91,170,1.2,0.85],[95,169,1.2,0.82],[99,168,1.1,0.8],[103,168,1.0,0.78],[107,168,1.0,0.75],[111,169,0.9,0.72],
  /* jaw upper */
  [88,178,1.2,0.9],[92,177,1.2,0.88],[96,176,1.1,0.86],[100,176,1.0,0.84],[104,176,1.0,0.82],[108,177,0.9,0.8],[112,177,0.85,0.75],
  /* jaw lower */
  [89,186,1.1,0.85],[93,185,1.1,0.84],[97,184,1.0,0.82],[101,184,1.0,0.8],[105,184,0.95,0.78],[109,184,0.9,0.75],[113,185,0.85,0.72],
  /* chin approach */
  [92,193,1.0,0.78],[96,192,1.0,0.76],[100,191,0.9,0.74],[104,191,0.85,0.72],[108,192,0.8,0.7],
];
const STUBBLE_R:StubblePoint[]=[
  [163,162,-1.1,0.7],[159,161,-1.0,0.65],[155,161,-1.0,0.6],[151,162,-0.9,0.6],[147,163,-0.8,0.55],
  [169,170,-1.2,0.8],[165,169,-1.2,0.78],[161,168,-1.1,0.76],[157,168,-1.0,0.74],[153,168,-1.0,0.72],[149,169,-0.9,0.68],
  [172,178,-1.2,0.88],[168,177,-1.2,0.86],[164,176,-1.1,0.84],[160,176,-1.0,0.82],[156,176,-1.0,0.8],[152,177,-0.9,0.78],[148,177,-0.85,0.72],
  [171,186,-1.1,0.84],[167,185,-1.1,0.82],[163,184,-1.0,0.8],[159,184,-1.0,0.78],[155,184,-0.95,0.76],[151,184,-0.9,0.74],[147,185,-0.85,0.7],
  [168,193,-1.0,0.76],[164,192,-1.0,0.74],[160,191,-0.9,0.72],[156,191,-0.85,0.7],[152,192,-0.8,0.68],
];

/* ═══════════════════════════════════════════════════════════════
   EYE COMPONENT — identity-matched
   - heavy upper lid (reference person has relaxed, droopy lids)
   - almond shape, not round
   - moderate width
═══════════════════════════════════════════════════════════════ */
interface EyeProps {
  cx:number;cy:number;clipId:string;
  eyeState: EyeState;
  showLashes:boolean;showVeins:boolean;rays:number[];
  side:'left'|'right';asymX:number;asymY:number;
}

function areEyeStatesEqual(prev: EyeState, next: EyeState) {
  return (
    prev.gazeX === next.gazeX &&
    prev.gazeY === next.gazeY &&
    prev.pupilScale === next.pupilScale &&
    prev.lidDrop === next.lidDrop &&
    prev.blinkAmt === next.blinkAmt &&
    prev.postDroop === next.postDroop
  );
}

const EyeComponent=memo(({
  cx,cy,clipId,eyeState,showLashes,showVeins,rays,side,asymX,asymY
}:EyeProps)=>{
  const { gazeX, gazeY, pupilScale, lidDrop, blinkAmt, postDroop } = eyeState;
  /* Identity-matched eye dimensions:
     - Narrower horizontal (17px vs 20) → more natural almond
     - Less tall vertically (11px vs 15) → relaxed, heavy-lidded look */
  const w=17,h=11;
  const l=cx-w/2,r=cx+w/2;
  const openness=Math.max(0,1-blinkAmt-lidDrop*0.5-postDroop);
  const lidYBase=cy-h+asymY;
  const lidTopY=lidYBase+(1-openness)*h*1.15;
  const lidMidY=lidYBase+(1-openness)*h*0.55;

  /* More almond-shaped sclera — inner corner slightly lower, outer corner tapers */
  const scleraPath=side==='left'
    ? `M ${l},${cy+1} C ${l+1},${cy-h*.6} ${cx-w/3},${cy-h+asymY} ${cx+asymX},${cy-h+asymY-.5} C ${cx+w/3},${cy-h+asymY+.5} ${r-1},${cy-h*.5} ${r},${cy-.5} C ${r-2},${cy+h*.5} ${cx+w/4},${cy+h*.7+asymY} ${cx+asymX},${cy+h*.7+asymY} C ${cx-w/4},${cy+h*.7} ${l+2},${cy+h*.45} ${l},${cy+1} Z`
    : `M ${l+.5},${cy-.5} C ${l+1},${cy-h*.5} ${cx-w/3},${cy-h+asymY+.5} ${cx+asymX},${cy-h+asymY-.5} C ${cx+w/3},${cy-h+asymY} ${r-1},${cy-h*.6} ${r},${cy+1} C ${r-2},${cy+h*.45} ${cx+w/4},${cy+h*.7} ${cx+asymX},${cy+h*.7+asymY} C ${cx-w/4},${cy+h*.7+asymY} ${l+2},${cy+h*.5} ${l+.5},${cy-.5} Z`;

  /* Lash positions along upper lid */
  const lashCount=7;

  return(
    <g>
      <path d={scleraPath} fill="url(#g-scl)"/>
      {showVeins&&<path d={`M ${l+2},${cy+1} C ${l+5},${cy-.5} ${l+8},${cy-1} ${l+9},${cy+.5}`} fill="none" stroke="rgba(176,80,80,0.1)" strokeWidth="0.38" strokeLinecap="round"/>}
      {/* iris group with gaze */}
      <g transform={`translate(${gazeX},${gazeY})`}>
        {/* iris — very dark, almost black (matches reference) */}
        <ellipse cx={cx} cy={cy} rx={10.2} ry={10} fill="url(#g-iris)" clipPath={`url(#${clipId})`}/>
        <ellipse cx={cx} cy={cy} rx={10.2} ry={10} fill="url(#g-iris-sh)" clipPath={`url(#${clipId})`}/>
        {rays.map((angle,i)=>{
          const rad=angle*Math.PI/180,r0=5.8,r1=i%4===0?8.6:i%2===0?7.6:8.1;
          return<line key={i}
            x1={cx+r0*Math.cos(rad)} y1={cy+r0*Math.sin(rad)}
            x2={cx+r1*Math.cos(rad)} y2={cy+r1*Math.sin(rad)}
            stroke={i%4===0?"#2A1008":"#1E0804"} strokeWidth="0.38"
            opacity={i%4===0?0.15:0.09} clipPath={`url(#${clipId})`}/>;
        })}
        {/* pupil — dark, natural size */}
        <ellipse cx={cx} cy={cy} rx={4.8*pupilScale} ry={4.8*pupilScale} fill="#050108" clipPath={`url(#${clipId})`}/>
        <ellipse cx={cx} cy={cy} rx={4.8*pupilScale} ry={4.8*pupilScale} fill="url(#g-pup-d)" clipPath={`url(#${clipId})`}/>
        <ellipse cx={cx} cy={cy} rx={7.6} ry={7.4} fill="none" stroke="#150604" strokeWidth="0.8" opacity="0.22" clipPath={`url(#${clipId})`}/>
      </g>
      {/* small, realistic catchlight */}
      <ellipse cx={cx+w*.13} cy={cy-h*.32} rx={1.8} ry={1.6} fill="#FFFFFF" opacity="0.92"/>
      <ellipse cx={cx-w*.18} cy={cy+h*.18} rx={0.85} ry={0.75} fill="#FFFFFF" opacity="0.36"/>
      {/* upper lid — heavy identity-defining droop */}
      {blinkAmt>0.95
        ?<path d={`M ${l},${cy} C ${cx},${cy-2} ${cx},${cy-2} ${r},${cy} C ${cx+w/3},${cy+h*.32} ${cx-w/3},${cy+h*.32} ${l},${cy} Z`} fill="#020010" opacity="0.93"/>
        :<>
          <path d={`M ${l+.5},${lidTopY+h*.28} C ${cx-w/3+1},${lidMidY} ${cx+w/3},${lidYBase+h*(1-openness)*.8} ${r-.5},${lidTopY+h*.28} C ${cx+w/3},${lidTopY+h*.44} ${cx},${lidTopY+h*.43+openness*h*.08} ${l+.5},${lidTopY+h*.28} Z`}
            fill="#020010" opacity="0.93"/>
          <path d={`M ${l+2},${lidTopY+h*.36} C ${cx-w/4},${lidMidY+h*.04} ${cx+w/4},${lidMidY+h*.02} ${r-2},${lidTopY+h*.36}`}
            fill="none" stroke="#020008" strokeWidth="2.0" strokeLinecap="round" opacity="0.25"/>
        </>
      }
      {/* lower lid */}
      <path d={`M ${l+2},${cy+h*.58} C ${cx},${cy+h*.74} ${cx+w/3},${cy+h*.76} ${r-3},${cy+h*.58}`}
        fill="none" stroke="#020008" strokeWidth="0.9" opacity="0.14" strokeLinecap="round"/>
      {/* under-eye shadow */}
      <ellipse cx={cx} cy={cy+h*1.1} rx={h+2} ry={3.8} fill="url(#g-eye-us)" opacity="0.68"/>
      <path d={`M ${l+2},${cy+h*.62} C ${cx},${cy+h*.78} ${cx+w/3},${cy+h*.8} ${r-3},${cy+h*.62}`}
        fill="none" stroke="url(#g-eye-wat)" strokeWidth="1.4" opacity="0.23" strokeLinecap="round"/>
      {/* upper lashes — shorter, natural */}
      {showLashes&&blinkAmt<0.65&&Array.from({length:lashCount},(_,i)=>{
        const baseX=l+1+(i/(lashCount-1))*(w-2);
        const baseY=lidTopY+h*.3;
        const ang=side==='left'?[-5,-3,-1,0,1,2.5,4]:[4,2.5,1,0,-1,-3,-5];
        return<path key={i}
          d={`M ${baseX},${baseY} Q ${baseX+ang[i]*.28},${baseY-3.2} ${baseX+ang[i]*.55},${baseY-5.5}`}
          fill="none" stroke="#01000C" strokeWidth={0.95-i*0.03} strokeLinecap="round" opacity={0.64-i*0.02}/>;
      })}
      {/* lower lashes — minimal */}
      {showLashes&&[[l+2,cy+h*.68,-0.3,2.2],[l+6,cy+h*.76,-0.1,2.4],[cx-2,cy+h*.8,0,2.5],[cx+4,cy+h*.8,0.1,2.4],[r-6,cy+h*.76,0.3,2.2],[r-1,cy+h*.68,0.5,2.0]].map(([lx,ly,ox,ln],i)=>(
        <path key={i} d={`M ${lx},${ly} Q ${+lx+ox},${+ly+ln/2} ${+lx+ox*1.5},${+ly+ln}`}
          fill="none" stroke="#01000C" strokeWidth="0.6" strokeLinecap="round" opacity={0.26-i*0.02}/>
      ))}
      {/* tear duct */}
      {side==='left'
        ?<><path d={`M ${l-1},${cy+.5} L ${l-4},${cy-2}`} fill="none" stroke="#020008" strokeWidth="1.0" strokeLinecap="round" opacity="0.22"/><ellipse cx={l-.5} cy={cy+1} rx={1.8} ry={1.3} fill="#A85050" opacity="0.12"/></>
        :<><path d={`M ${r+1},${cy+.5} L ${r+4},${cy-2}`} fill="none" stroke="#020008" strokeWidth="1.0" strokeLinecap="round" opacity="0.22"/><ellipse cx={r+.5} cy={cy+1} rx={1.8} ry={1.3} fill="#A85050" opacity="0.12"/></>
      }
    </g>
  );
},(prev,next)=>(
  prev.cx===next.cx &&
  prev.cy===next.cy &&
  prev.clipId===next.clipId &&
  prev.showLashes===next.showLashes &&
  prev.showVeins===next.showVeins &&
  prev.rays===next.rays &&
  prev.side===next.side &&
  prev.asymX===next.asymX &&
  prev.asymY===next.asymY &&
  areEyeStatesEqual(prev.eyeState,next.eyeState)
));
EyeComponent.displayName='EyeComponent';

/* ═══════════════════════════════════════════════════════════════
   HAIR COMPONENT — identity: natural messy, slightly asymmetric
   Volume on top-right side (as seen in reference), falls naturally
═══════════════════════════════════════════════════════════════ */
interface HairProps {
  hairState: HairState;
}

const HairComponent=memo(({hairState}:HairProps)=>{
  const { strandCount, microOffset } = hairState;

  return (
  <g>
    {/* scalp base */}
    <path fill="url(#g-hair)" d="M 88,100 C 87,64 107,42 130,40 C 153,42 173,64 172,100 C 164,89 155,83 145,83 C 139,83 134,88 130,93 C 126,88 121,83 115,83 C 105,83 96,89 88,100 Z"/>
    {/* left side — moderate fall */}
    <path fill="url(#g-hair-side)" opacity="0.93" d="M 89,106 C 81,121 79,140 83,158 C 86,170 92,178 100,183 C 96,167 95,152 98,137 C 101,126 107,116 114,110 Z"/>
    <path fill="url(#g-hair)" opacity="0.78" d="M 82,104 C 75,120 73,139 77,156 C 80,167 86,176 92,181 Z"/>
    {strandCount>5&&<path fill="url(#g-hair)" opacity="0.58" d="M 77,112 C 71,127 69,143 72,158 C 75,169 81,177 86,182 Z"/>}
    {/* right side — slightly more volume (matches reference) */}
    <path fill="url(#g-hair-side)" opacity="0.94" d="M 171,106 C 179,121 181,140 177,158 C 174,170 168,178 160,183 C 164,167 165,152 162,137 C 159,126 153,116 146,110 Z"/>
    <path fill="url(#g-hair)" opacity="0.82" d="M 178,104 C 185,120 187,139 183,156 C 180,167 174,176 168,181 Z"/>
    {strandCount>5&&<path fill="url(#g-hair)" opacity="0.66" d="M 184,112 C 190,127 191,143 188,158 C 185,169 180,177 175,182 Z"/>}
    {strandCount>7&&<path fill="url(#g-hair)" opacity="0.56" d="M 188,118 C 193,130 193,145 190,158 C 188,167 184,174 180,179 Z"/>}
    {/* top volume — right-heavy (ref has volume swept left-to-right) */}
    <path fill="url(#g-hair)" opacity="0.86" d="M 108,49 C 116,36 125,32 133,34 C 141,30 151,34 158,44 C 151,51 144,54 137,51 C 131,49 122,47 117,48 Z"/>
    {/* right cluster more prominent */}
    <path fill="url(#g-hair)" opacity="0.84" d="M 152,44 C 161,36 170,36 175,45 C 168,53 162,58 157,64 Z"/>
    <path fill="url(#g-hair)" opacity="0.76" d="M 164,41 C 172,33 181,34 184,43 C 178,51 170,57 164,63 Z"/>
    <path fill="url(#g-hair)" opacity="0.7"  d="M 174,44 C 180,37 186,38 187,45 C 183,51 177,56 173,60 Z"/>
    {/* left cluster — slightly less volume than right */}
    <path fill="url(#g-hair)" opacity="0.8"  d="M 97,61 C 103,50 112,44 120,47 C 115,57 111,65 108,73 Z"/>
    {strandCount>5&&<path fill="url(#g-hair)" opacity="0.62" d="M 96,52 C 88,44 82,43 80,51 C 84,59 90,65 96,71 Z"/>}
    {/* crown wisps */}
    {strandCount>4&&<>
      <path fill="url(#g-hair)" opacity="0.55" d="M 146,36 C 144,28 139,24 133,26 C 137,32 140,38 142,44 Z"/>
      <path fill="url(#g-hair)" opacity="0.5"  d="M 116,37 C 118,29 123,25 129,27 C 125,33 122,39 120,45 Z"/>
      <path fill="url(#g-hair)" opacity="0.42" d="M 160,38 C 163,31 161,26 158,28 C 156,33 157,39 158,44 Z"/>
    </>}
    {/* hair gloss — ref has natural shine, not excessive */}
    <path fill="url(#g-hair-hl1)" opacity="0.46" d="M 112,56 C 124,47 138,45 150,51 C 143,58 134,61 125,60 Z"/>
    {strandCount>5&&<path fill="url(#g-hair-hl2)" opacity="0.3"  d="M 120,68 C 130,59 142,57 150,63 C 142,70 132,73 122,72 Z"/>}
    <path fill="url(#g-hair-rim)" opacity="0.42" d="M 108,53 C 120,44 140,42 154,49 C 145,56 132,60 120,59 Z"/>
    {/* loose desync strand */}
    {strandCount>4&&(
      <g style={{transform:`translateX(${-microOffset*0.35}px) translateY(${Math.abs(microOffset)*0.18}px)`}}>
        <path fill="url(#g-hair)" opacity="0.46" d="M 86,115 C 82,126 80,136 82,145 Z"/>
      </g>
    )}
    {strandCount>4&&(
      <g style={{transform:`translateX(${microOffset*0.28}px) translateY(${Math.abs(microOffset)*0.14}px)`}}>
        <path fill="url(#g-hair)" opacity="0.44" d="M 174,115 C 178,126 180,136 178,145 Z"/>
      </g>
    )}
    {/* baby hairs at hairline */}
    {strandCount>4&&<>
      <path d="M 92,112 C 94,108 96,105 97,102"    fill="none" stroke="#1A1410" strokeWidth="0.76" strokeLinecap="round" opacity="0.48"/>
      <path d="M 96,114 C 98,110 100,107 102,105"   fill="none" stroke="#1A1410" strokeWidth="0.7"  strokeLinecap="round" opacity="0.42"/>
      <path d="M 169,112 C 167,108 165,105 164,102"  fill="none" stroke="#1A1410" strokeWidth="0.76" strokeLinecap="round" opacity="0.46"/>
      <path d="M 165,114 C 163,110 161,107 159,105"  fill="none" stroke="#1A1410" strokeWidth="0.7"  strokeLinecap="round" opacity="0.4"/>
    </>}
    {strandCount>5&&<>
      <path d="M 123,73 C 131,63 139,60 147,63" fill="none" stroke="#3A2C22" strokeWidth="0.66" strokeLinecap="round" opacity="0.13"/>
      <path d="M 87,110 C 93,119 95,131 93,143"  fill="none" stroke="#3A2C22" strokeWidth="0.58" strokeLinecap="round" opacity="0.12"/>
      <path d="M 173,110 C 167,119 165,131 167,143" fill="none" stroke="#3A2C22" strokeWidth="0.58" strokeLinecap="round" opacity="0.12"/>
    </>}
  </g>
  );
},(prev,next)=>(
  prev.hairState.strandCount===next.hairState.strandCount &&
  prev.hairState.microOffset===next.hairState.microOffset
));
HairComponent.displayName='HairComponent';

const FringeComponent = memo(({ strandCount }: { strandCount: number }) => (
  <>
    <g className="ayrin-fringe">
      <path fill="url(#g-hair)" d="M 100,96 C 107,105 110,116 108,128 C 103,122 97,118 91,116 Z"/>
      <path fill="url(#g-hair)" opacity="0.96" d="M 118,90 C 126,100 128,112 126,126 C 122,119 117,114 112,110 Z"/>
      <path fill="url(#g-hair)" d="M 137,92 C 145,102 147,114 145,127 C 141,120 136,115 130,111 Z"/>
      {strandCount>4&&<>
        <path fill="url(#g-hair)" opacity="0.72" d="M 105,94 C 101,84 101,74 106,67 C 110,74 112,84 110,96 Z"/>
        <path fill="url(#g-hair)" opacity="0.62" d="M 113,90 C 109,80 109,70 113,62 C 117,69 118,79 116,90 Z"/>
        <path fill="url(#g-hair)" opacity="0.54" d="M 148,92 C 152,82 152,72 148,65 C 144,72 143,82 145,92 Z"/>
      </>}
      <path fill="url(#g-hair-hl1)" opacity="0.32" d="M 106,96 C 112,105 114,116 112,128 C 108,121 104,116 99,113 Z"/>
    </g>
    <g className="ayrin-fringe-b">
      {strandCount>5&&<>
        <path d="M 107,96 C 111,105 112,115 111,126" fill="none" stroke="#48382A" strokeWidth="0.64" strokeLinecap="round" opacity="0.16"/>
        <path d="M 124,91 C 128,100 129,110 128,121" fill="none" stroke="#48382A" strokeWidth="0.64" strokeLinecap="round" opacity="0.14"/>
      </>}
    </g>
    <g className="ayrin-fringe-c">
      {strandCount>5&&(
        <path d="M 140,93 C 144,103 145,113 143,124" fill="none" stroke="#48382A" strokeWidth="0.64" strokeLinecap="round" opacity="0.13"/>
      )}
    </g>
  </>
), (prev, next) => prev.strandCount === next.strandCount);
FringeComponent.displayName='FringeComponent';

const LeftEarComponent = memo(() => (
  <>
    <ellipse cx="83" cy="132" rx="10.5" ry="19" fill="url(#g-ear)"/>
    <ellipse cx="83" cy="132" rx="10.5" ry="19" fill="url(#g-ear-sss)" opacity="0.68"/>
    <path d="M 80,120 C 75,126 74,134 75,143 C 77,151 81,157 85,159" fill="none" stroke="rgba(0,0,0,0.17)" strokeWidth="1.5" strokeLinecap="round" opacity="0.52"/>
    <path d="M 80,129 C 78,133 78,138 80,143" fill="none" stroke="rgba(68,26,10,0.17)" strokeWidth="0.9" strokeLinecap="round" opacity="0.54"/>
    <ellipse cx="83" cy="135" rx="3.4" ry="4.0" fill="rgba(42,14,4,0.26)" opacity="0.7"/>
    <ellipse cx="83" cy="135" rx="1.9" ry="2.4" fill="rgba(20,4,0,0.34)" opacity="0.7"/>
    <path fill="url(#g-hair-side)" opacity="0.9" d="M 79,120 C 75,126 74,134 75,143 C 77,151 81,158 85,161 C 85,151 84,141 84,132 C 84,127 82,123 79,120 Z"/>
  </>
));
LeftEarComponent.displayName='LeftEarComponent';

const FaceBaseComponent = memo(({ showPores }: { showPores: boolean }) => (
  <>
    <path fill="url(#g-face)" d="
      M 87,115
      C 87,76 107,56 130,54
      C 153,56 173,76 173,115
      C 173,148 165,176 148,197
      C 142,205 137,209 130,209
      C 123,209 118,205 112,197
      C 95,176 87,148 87,115 Z
    "/>
    {showPores&&(
      <path fill="url(#p-pore)" clipPath="url(#cp-face)" d="
        M 87,115 C 87,76 107,56 130,54 C 153,56 173,76 173,115
        C 173,148 165,176 148,197 C 142,205 137,209 130,209
        C 123,209 118,205 112,197 C 95,176 87,148 87,115 Z
      "/>
    )}
    <ellipse cx="112" cy="100" rx="34" ry="46" fill="url(#g-key)" className="ayrin-key-light" opacity="0.8"/>
    <ellipse cx="91" cy="148" rx="30" ry="50" fill="url(#g-sss)" opacity="0.52"/>
    <ellipse cx="91" cy="114" rx="14" ry="24" fill="url(#g-temple)" opacity="0.68"/>
    <ellipse cx="169" cy="114" rx="14" ry="24" fill="url(#g-temple)" opacity="0.68"/>
    <ellipse cx="100" cy="134" rx="13" ry="7" fill="url(#g-malar)" opacity="0.68" transform="rotate(-12,100,134)"/>
    <ellipse cx="160" cy="134" rx="13" ry="7" fill="url(#g-malar)" opacity="0.6" transform="rotate(12,160,134)"/>
    <ellipse cx="94" cy="147" rx="21" ry="14" fill="url(#g-blush)" opacity="0.72"/>
    <ellipse cx="166" cy="147" rx="21" ry="14" fill="url(#g-blush)" opacity="0.66"/>
    <ellipse cx="124" cy="78" rx="27" ry="17" fill="url(#g-fhl)" opacity="1"/>
    <ellipse cx="130" cy="100" rx="8.5" ry="5.5" fill="rgba(0,0,0,0.048)" opacity="0.68"/>
    <ellipse cx="130" cy="211" rx="30" ry="11" fill="url(#g-jaw-d)" opacity="0.78"/>
    <rect x="127.5" y="140" width="5" height="25" rx="2.5" fill="url(#g-nb)" opacity="0.5"/>
    <ellipse cx="130" cy="173" rx="8" ry="5" fill="url(#g-ntip)" opacity="0.72"/>
    {showPores&&<>
      <path d="M 109,160 C 108,168 108,176 111,182 C 113,186 116,188 117,189" fill="none" stroke="rgba(78,32,12,0.19)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
      <path d="M 151,161 C 152,169 152,177 149,183 C 147,187 144,189 143,190" fill="none" stroke="rgba(78,32,12,0.17)" strokeWidth="1.4" strokeLinecap="round" opacity="0.68"/>
    </>}
  </>
), (prev, next) => prev.showPores === next.showPores);
FaceBaseComponent.displayName='FaceBaseComponent';

const BrowsComponent = memo(({ browState }: { browState: BrowState }) => (
  <>
    <g className="brow-l" style={{transform:browState.leftTransform,transformOrigin:'104px 102px'}}>
      <path d="M 88,104 C 96,98 104,95 119,98" fill="none" stroke="#050302" strokeWidth="6.0" strokeLinecap="round" opacity="0.80"/>
      <path d="M 88,104 C 96,98 104,95 119,98" fill="none" stroke="#0C0808" strokeWidth="3.5" strokeLinecap="round" opacity="0.52"/>
      <path d="M 89,104 C 96,99 104,96 118,98"  fill="none" stroke="#1A1410" strokeWidth="1.9" strokeLinecap="round" opacity="0.32"/>
      {browState.showPores&&[
        [89,104,91,101,93,100],[93,101,96,99,99,99],[98,98,101,97,104,97],
        [103,97,107,96.5,110,97],[109,97,113,97.5,117,98]
      ].map((p,i)=>(
        <path key={i} d={`M ${p[0]},${p[1]} C ${p[2]},${p[3]} ${p[4]},${p[5]}`}
          fill="none" stroke="#030200" strokeWidth="0.72" strokeLinecap="round" opacity={0.24-i*0.03}/>
      ))}
    </g>
    <g className="brow-r" style={{transform:browState.rightTransform,transformOrigin:'156px 102px'}}>
      <path d="M 141,98 C 156,94 164,97 172,104" fill="none" stroke="#050302" strokeWidth="6.0" strokeLinecap="round" opacity="0.78"/>
      <path d="M 141,98 C 156,94 164,97 172,104" fill="none" stroke="#0C0808" strokeWidth="3.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M 142,98 C 156,95 164,97 171,104" fill="none" stroke="#1A1410" strokeWidth="1.9" strokeLinecap="round" opacity="0.30"/>
      {browState.showPores&&[
        [142,97.5,145,96.5,149,96],[149,96,152,95.5,155,96],
        [155,96,159,97,161,98],[160,98,164,100,167,102],[165,101,168,103,171,104]
      ].map((p,i)=>(
        <path key={i} d={`M ${p[0]},${p[1]} C ${p[2]},${p[3]} ${p[4]},${p[5]}`}
          fill="none" stroke="#030200" strokeWidth="0.70" strokeLinecap="round" opacity={0.23-i*0.03}/>
      ))}
    </g>
  </>
), (prev, next) => (
  prev.browState.leftTransform === next.browState.leftTransform &&
  prev.browState.rightTransform === next.browState.rightTransform &&
  prev.browState.showPores === next.browState.showPores
));
BrowsComponent.displayName='BrowsComponent';

const NoseComponent = memo(() => (
  <>
    <path d="M 126,140 C 124,151 123,162 125,170 C 127,174 130,175.5 133,174.5 C 135.5,170 136,162 135,151 C 134,142 132.5,140 131,139"
      fill="none" stroke="rgba(82,36,12,0.2)" strokeWidth="1.0" strokeLinecap="round" opacity="0.7"/>
    <path d="M 130,142 C 131,152 131,161 130.5,169" fill="none" stroke="#B88050" strokeWidth="0.62" strokeLinecap="round" opacity="0.2"/>
    <path d="M 128,142 C 127,153 126.5,162 127.5,170" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.3" strokeLinecap="round" opacity="0.48"/>
    <path d="M 132.5,142 C 133.5,153 133.5,162 132.5,170" fill="none" stroke="rgba(0,0,0,0.044)" strokeWidth="1.1" strokeLinecap="round" opacity="0.44"/>
    <ellipse cx="130" cy="172" rx="8" ry="5" fill="url(#g-ntip)" opacity="0.72"/>
    <ellipse cx="129" cy="170" rx="3.0" ry="2.0" fill="rgba(205,160,100,0.18)" opacity="0.68"/>
    <ellipse cx="122" cy="169" rx="4" ry="2.4" fill="#5C2E10" opacity="0.1"/>
    <ellipse cx="138" cy="169" rx="4" ry="2.4" fill="#5C2E10" opacity="0.1"/>
    <path d="M 118,170 C 121,165 125,163.5 127.5,164.5 C 129,166 129.8,169 128.8,172 C 127,176 122,177 119,173 Z" fill="rgba(0,0,0,0.042)" opacity="0.7"/>
    <path d="M 142,170 C 139,165 135,163.5 132.5,164.5 C 131,166 130.2,169 131.2,172 C 133,176 138,177 141,173 Z" fill="rgba(0,0,0,0.042)" opacity="0.7"/>
    <path d="M 119,171 C 122,176 126,177 130,176" fill="none" stroke="#3A1A08" strokeWidth="1.45" strokeLinecap="round" opacity="0.25"/>
    <path d="M 141,171 C 138,176 134,177 130,176" fill="none" stroke="#3A1A08" strokeWidth="1.45" strokeLinecap="round" opacity="0.25"/>
    <ellipse cx="122" cy="172" rx="3.0" ry="2.1" fill="rgba(18,4,0,0.27)" opacity="0.64"/>
    <ellipse cx="138" cy="172" rx="3.0" ry="2.1" fill="rgba(18,4,0,0.27)" opacity="0.64"/>
    <ellipse cx="130" cy="175" rx="9" ry="3.6" fill="rgba(0,0,0,0.055)" opacity="0.7"/>
    <path d="M 128,175 C 127.8,179 128.2,183 129.5,185" fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="2.7" strokeLinecap="round" opacity="0.52"/>
    <path d="M 132,175 C 132.2,179 131.8,183 130.5,185" fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="2.7" strokeLinecap="round" opacity="0.52"/>
  </>
));
NoseComponent.displayName='NoseComponent';

const LipsComponent = memo(({ lipState }: { lipState: LipState }) => {
  const leftX = lipState.leftCornerX;
  const rightX = lipState.rightCornerX;
  const leftUpperY = lipState.leftCornerY + lipState.microLipTension * 0.25;
  const rightUpperY = lipState.rightCornerY + lipState.microLipTension * 0.25;
  const seamLeftY = lipState.leftCornerY + lipState.microLipTension * 0.18;
  const seamRightY = lipState.rightCornerY + lipState.microLipTension * 0.18;
  const lowerCenterY = 194.5 + lipState.lowerLipDrop + lipState.microLipAsym * 0.12;
  const jawTransform = `translate(0 ${lipState.jawTranslateY.toFixed(2)}) rotate(${lipState.jawRotation.toFixed(2)} 130 186)`;

  return (
    <g transform={jawTransform}>
      <g className="ayrin-mouth">
        <path d={`M ${leftX-3},186 C ${leftX+1},177 ${123},174 ${127},176.5 C 128.8,174 131.2,174 133,176.5 C 137,174 141.5,177 149,186`}
          fill="none" stroke="rgba(160,70,64,0.18)" strokeWidth="1.9" strokeLinecap="round"/>
        <path d={`
          M ${leftX},${leftUpperY}
          C ${leftX+4},${178+lipState.microLipTension*.15} 123,${175+lipState.microLipTension*.1} 127.5,${177.5+lipState.microLipTension*.1}
          C 129.2,${175+lipState.microLipTension*.1} 130.8,${175+lipState.microLipTension*.1} 132.5,${177.5+lipState.microLipTension*.1}
          C 137,${175+lipState.microLipTension*.1} ${rightX-4},${178+lipState.microLipTension*.15} ${rightX},${rightUpperY}
          C ${rightX-3.5},${183+lipState.microLipTension*.12} 136.5,${182+lipState.microLipTension*.1} 132.5,${183+lipState.microLipTension*.1}
          C 130.2,181.5 129.8,181.5 127.5,${183+lipState.microLipTension*.1}
          C 123.5,${182+lipState.microLipTension*.1} ${leftX+3.5},${183+lipState.microLipTension*.12} ${leftX},${leftUpperY} Z
        `} fill="url(#g-lip-up)" opacity="0.89"/>
        <path d={`M ${leftX+1},${seamLeftY} C 122,185.3 127,184.9 130,185.1 C 133,184.9 138,185.3 ${rightX-1},${seamRightY}`}
          fill="none" stroke="rgba(22,5,4,0.28)" strokeWidth="0.85" strokeLinecap="round" opacity="0.7"/>
        <path d={`
          M ${leftX},${seamLeftY}
          C ${leftX+3},${195+lipState.lowerLipDrop*2.8+lipState.microLipAsym*.4}
            124.5,${200+lipState.lowerLipDrop*2.8+lipState.microLipAsym*.25}
            129.5,${201.5+lipState.lowerLipDrop*2.8+lipState.microLipAsym*.18}
          C 132,${202+lipState.lowerLipDrop*2.8}
            134.5,${201+lipState.lowerLipDrop*2.5-lipState.microLipAsym*.1}
            137.5,${199+lipState.lowerLipDrop*2-lipState.microLipAsym*.2}
          C 142,${195+lipState.lowerLipDrop*1.8-lipState.microLipAsym*.25}
            ${rightX},${190+lipState.lowerLipDrop*.8} ${rightX},${seamRightY}
          C 140,${191+lipState.lowerLipDrop*1.5} 136.5,${194+lipState.lowerLipDrop} 130,${lowerCenterY}
          C 123.5,${194+lipState.lowerLipDrop} 120,${191+lipState.lowerLipDrop*1.5} ${leftX},${seamLeftY} Z
        `} fill="url(#g-lip-lo)" opacity="0.89"/>
        <ellipse cx="130" cy={195+lipState.lowerLipDrop+lipState.jawTranslateY*0.2} rx="8.8" ry="3.8" fill="url(#g-lip-gls)" opacity="0.2"/>
        <ellipse cx="130" cy="186.5" rx="14" ry="2.5" fill="url(#g-lip-drk)" opacity="0.3"/>
        <path d={`M ${leftX},${seamLeftY} C ${leftX-0.7},${seamLeftY+1.5} ${leftX-0.6},${seamLeftY+3} ${leftX},${seamLeftY+4}`}
          fill="none" stroke="#482020" strokeWidth="0.85" strokeLinecap="round" opacity="0.19"/>
        <path d={`M ${rightX},${seamRightY} C ${rightX+0.7},${seamRightY+1.8-lipState.microLipAsym*.08} ${rightX+0.6},${seamRightY+3.5} ${rightX},${seamRightY+4.5-lipState.microLipAsym*.12}`}
          fill="none" stroke="#482020" strokeWidth="0.85" strokeLinecap="round" opacity="0.15"/>
      </g>
    </g>
  );
}, (prev, next) => (
  prev.lipState.jawRotation === next.lipState.jawRotation &&
  prev.lipState.jawTranslateY === next.lipState.jawTranslateY &&
  prev.lipState.leftCornerX === next.lipState.leftCornerX &&
  prev.lipState.leftCornerY === next.lipState.leftCornerY &&
  prev.lipState.rightCornerX === next.lipState.rightCornerX &&
  prev.lipState.rightCornerY === next.lipState.rightCornerY &&
  prev.lipState.microLipTension === next.lipState.microLipTension &&
  prev.lipState.microLipAsym === next.lipState.microLipAsym &&
  prev.lipState.lowerLipDrop === next.lipState.lowerLipDrop
));
LipsComponent.displayName='LipsComponent';

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
interface AyrinCharacterProps {
  emotion?:EmotionKey;
  onEmotionChange?:(e:EmotionKey)=>void;
  reducedMotion?:boolean;
}

export function AyrinCharacter({
  emotion:emotionProp,
  onEmotionChange,
  reducedMotion=false,
}:AyrinCharacterProps={}){

  const containerRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const lodLevel=useLOD(containerRef);
  const lodCfg=LOD[lodLevel];
  const { state: characterState, send } = useStateMachine('idle');
  const animationTarget = useAnimationGraph(characterState, emotionProp);
  const springEmotionRef = useSpringEmotionTarget(animationTarget);
  const microRef=useMicroRealism(animationTarget.blinkFreq);
  const [cSize,setCSize]=useState({w:260,h:720});
  useLayoutEffect(()=>{
    const el=containerRef.current; if(!el) return;
    const ro=new ResizeObserver(([e])=>setCSize({w:e.contentRect.width,h:e.contentRect.height}));
    ro.observe(el); return ()=>ro.disconnect();
  },[]);

  const [face,setFace]=useState<FaceState>(()=>composeFaceState(EMOTIONS.calm, EMPTY_MICRO_STATE));
  const rigRef=useRef<CharacterRig>(resolveRigTarget(composeFaceState(EMOTIONS.calm, EMPTY_MICRO_STATE)));

  useEffect(()=>{
    let raf:number;
    const merge=()=>{
      const nextFace=composeFaceState(springEmotionRef.current, microRef.current);
      rigRef.current=stepRig(rigRef.current, nextFace);
      setFace(nextFace);
      raf=requestAnimationFrame(merge);
    };
    raf=requestAnimationFrame(merge); return ()=>cancelAnimationFrame(raf);
  },[microRef,springEmotionRef]);

  useWebGLOverlay(canvasRef,lodCfg,face,cSize);

  const irisAngles=useMemo(()=>
    ALL_RAYS.filter((_,i)=>i%Math.max(1,Math.round(28/Math.max(1,lodCfg.irisRayCount)))===0),
    [lodCfg.irisRayCount]
  );
  const leftJawStubble=useMemo(
    ()=>STUBBLE_L.filter((_,i)=>i/STUBBLE_L.length<lodCfg.stubbleDensity),
    [lodCfg.stubbleDensity]
  );
  const rightJawStubble=useMemo(
    ()=>STUBBLE_R.filter((_,i)=>i/STUBBLE_R.length<lodCfg.stubbleDensity),
    [lodCfg.stubbleDensity]
  );

  const M=microRef.current;
  const rig=rigRef.current;
  const blinkAmt=reducedMotion?0:M.blinkAmt;
  const breathStyle=useMemo(() => ({
    transformOrigin: '130px 490px',
    transform: `translateY(${((1-face.breathScale)*7).toFixed(2)}px) scaleY(${face.breathScale.toFixed(4)})`,
  }), [face.breathScale]);
  const headRigStyle=useMemo(() => ({
    transformOrigin: '130px 160px',
    transform: `translate(${(rig.head.x-BASE_RIG.head.x).toFixed(2)}px, ${(rig.head.y-BASE_RIG.head.y).toFixed(2)}px) rotate(${rig.head.rotation.toFixed(2)}deg)`,
  }), [rig.head.rotation, rig.head.x, rig.head.y]);

  const folds=useMemo(() => ([
    'M 91,262 C 86,320 86,386 91,448',
    'M 169,262 C 174,320 174,386 169,448',
    'M 111,274 C 107,330 107,396 111,452',
    'M 149,274 C 153,330 153,396 149,452',
    'M 121,270 C 118,326 118,392 121,448',
  ].slice(0,lodCfg.foldCount)), [lodCfg.foldCount]);

  const leftEyeState=useMemo<EyeState>(() => ({
    gazeX: rig.eyeL.x-BASE_RIG.eyeL.x,
    gazeY: rig.eyeL.y-BASE_RIG.eyeL.y,
    pupilScale: face.pupilScale,
    lidDrop: face.lidDropL + face.microLidL,
    blinkAmt,
    postDroop: face.postBlinkDroopL,
  }), [
    rig.eyeL.x,
    rig.eyeL.y,
    face.pupilScale,
    face.lidDropL,
    face.microLidL,
    blinkAmt,
    face.postBlinkDroopL,
  ]);

  const rightEyeState=useMemo<EyeState>(() => ({
    gazeX: rig.eyeR.x-BASE_RIG.eyeR.x,
    gazeY: rig.eyeR.y-BASE_RIG.eyeR.y,
    pupilScale: face.pupilScale,
    lidDrop: face.lidDropR + face.microLidR,
    blinkAmt,
    postDroop: face.postBlinkDroopR,
  }), [
    rig.eyeR.x,
    rig.eyeR.y,
    face.pupilScale,
    face.lidDropR,
    face.microLidR,
    blinkAmt,
    face.postBlinkDroopR,
  ]);

  const browState=useMemo<BrowState>(() => ({
    leftTransform: `translate(${(rig.browL.x-BASE_RIG.browL.x).toFixed(2)}px, ${(rig.browL.y-BASE_RIG.browL.y).toFixed(2)}px) rotate(${rig.browL.rotation.toFixed(2)}deg)`,
    rightTransform: `translate(${(rig.browR.x-BASE_RIG.browR.x).toFixed(2)}px, ${(rig.browR.y-BASE_RIG.browR.y).toFixed(2)}px) rotate(${rig.browR.rotation.toFixed(2)}deg)`,
    showPores: lodCfg.showPores,
  }), [
    rig.browL.rotation,
    rig.browL.x,
    rig.browL.y,
    rig.browR.rotation,
    rig.browR.x,
    rig.browR.y,
    lodCfg.showPores,
  ]);

  const lipState=useMemo<LipState>(() => ({
    jawRotation: rig.jaw.rotation,
    jawTranslateY: rig.jaw.y-BASE_RIG.jaw.y,
    leftCornerX: rig.lipCornerL.x,
    leftCornerY: rig.lipCornerL.y,
    rightCornerX: rig.lipCornerR.x,
    rightCornerY: rig.lipCornerR.y,
    microLipTension: face.microLipTension,
    microLipAsym: face.microLipAsym,
    lowerLipDrop: face.lowerLipDrop,
  }), [
    rig.jaw.rotation,
    rig.jaw.y,
    rig.lipCornerL.x,
    rig.lipCornerL.y,
    rig.lipCornerR.x,
    rig.lipCornerR.y,
    face.microLipTension,
    face.microLipAsym,
    face.lowerLipDrop,
  ]);

  const hairState=useMemo<HairState>(() => ({
    strandCount: lodCfg.hairStrandCount,
    microOffset: (rig.head.rotation + (rig.browL.y-BASE_RIG.browL.y))*0.32,
  }), [lodCfg.hairStrandCount, rig.browL.y, rig.head.rotation]);

  const handleMouseEnter=useCallback(() => {
    send('MOUSE_ENTER');
    onEmotionChange?.('warmAttention');
  }, [onEmotionChange, send]);

  const handleMouseLeave=useCallback(() => {
    send('MOUSE_LEAVE');
    onEmotionChange?.(emotionProp ?? 'calm');
  }, [emotionProp, onEmotionChange, send]);

  const handleClick=useCallback(() => {
    send('CLICK');
    onEmotionChange?.('softSmile');
  }, [onEmotionChange, send]);

  return(
    <div
      ref={containerRef}
      style={{position:'relative',width:'100%',height:'100%',display:'inline-block'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {lodCfg.shaderQuality!=='off'&&(
        <canvas ref={canvasRef} width={cSize.w||260} height={cSize.h||720}
          style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',
            pointerEvents:'none',mixBlendMode:'screen',opacity:lodCfg.glowIntensity*0.82}}/>
      )}

      <svg viewBox="0 0 260 720" xmlns="http://www.w3.org/2000/svg"
        style={{width:'100%',height:'100%',overflow:'visible',display:'block'}}
        aria-label="Ayrin character" role="img"
      >
        <style>{`
          .ayrin-breath{transform-origin:130px 490px;animation:ayrin-breath ${reducedMotion?'999999s':'6s'} ease-in-out infinite}
          .ayrin-head{transform-origin:130px 158px;animation:ayrin-head ${reducedMotion?'999999s':'6.4s'} ease-in-out infinite}
          .ayrin-mouth{transform-origin:130px 180px;animation:ayrin-mouth ${reducedMotion?'999999s':'6s'} ease-in-out infinite}
          .ayrin-fringe{transform-origin:130px 86px;animation:ayrin-fringe ${reducedMotion?'999999s':'7.2s'} ease-in-out infinite}
          .ayrin-fringe-b{transform-origin:130px 86px;animation:ayrin-fringe-b ${reducedMotion?'999999s':'8.1s'} ease-in-out infinite;animation-delay:-1.6s}
          .ayrin-fringe-c{transform-origin:130px 86px;animation:ayrin-fringe-c ${reducedMotion?'999999s':'6.8s'} ease-in-out infinite;animation-delay:-3.4s}
          .ayrin-shoulder-l{transform-origin:76px 262px;animation:ayrin-shoulder-l ${reducedMotion?'999999s':'6s'} ease-in-out infinite;animation-delay:-${T.breathAsymDelay}ms}
          .ayrin-shoulder-r{transform-origin:184px 262px;animation:ayrin-shoulder-r ${reducedMotion?'999999s':'6s'} ease-in-out infinite;animation-delay:-${Math.round(T.breathAsymDelay*1.16)}ms}
          .ayrin-key-light{animation:ayrin-key-flicker ${reducedMotion?'999999s':'24.2s'} ease-in-out infinite}
          .ayrin-rim-light{animation:ayrin-rim-flicker ${reducedMotion?'999999s':'27.3s'} ease-in-out infinite;animation-delay:-8.1s}
          .brow-l,.brow-r{transition:transform ${T.emotionBlend}ms cubic-bezier(.4,0,.2,1)}
          @keyframes ayrin-breath{
            0%,100%{transform:translateY(0) scaleY(1)}
            42%{transform:translateY(-2.0px) scaleY(1.012)}
            50%{transform:translateY(-1.8px) scaleY(1.011)}
            55%{transform:translateY(-1.6px) scaleY(1.010)}
          }
          @keyframes ayrin-head{
            0%,100%{transform:translateY(0)}
            46%{transform:translateY(-.8px) rotate(.25deg)}
            70%{transform:translateY(-.3px) rotate(.08deg)}
          }
          @keyframes ayrin-mouth{0%,100%{transform:translateY(0)}50%{transform:translateY(.4px)}}
          @keyframes ayrin-fringe{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(-.6deg) translateY(.5px)}}
          @keyframes ayrin-fringe-b{0%,100%{transform:rotate(0) translateX(0)}50%{transform:rotate(-.4deg) translateX(.35px)}}
          @keyframes ayrin-fringe-c{0%,100%{transform:rotate(.15deg)}50%{transform:rotate(-.35deg) translateY(.7px)}}
          @keyframes ayrin-shoulder-l{0%,100%{transform:translateY(0) rotate(0)}48%{transform:translateY(-1.4px) rotate(-.18deg)}}
          @keyframes ayrin-shoulder-r{0%,100%{transform:translateY(0) rotate(0)}48%{transform:translateY(-1.2px) rotate(.14deg)}}
          @keyframes ayrin-key-flicker{0%,100%{opacity:.8}34%{opacity:.9}67%{opacity:.76}}
          @keyframes ayrin-rim-flicker{0%,100%{opacity:.42}40%{opacity:.52}69%{opacity:.36}}
        `}</style>

        <defs>
          {/* ══ SKIN — warm dark brown matching reference ══ */}
          {/* Reference: warm brown skin, #9A6238 highlights, #6E3E1C midtones */}
          <radialGradient id="g-face" cx="40%" cy="12%" r="82%">
            <stop offset="0%"   stopColor="#C28050"/>
            <stop offset="16%"  stopColor="#A86840"/>
            <stop offset="42%"  stopColor="#8A4E28"/>
            <stop offset="74%"  stopColor="#6C3618"/>
            <stop offset="100%" stopColor="#502410"/>
          </radialGradient>
          <radialGradient id="g-body" cx="36%" cy="16%" r="84%">
            <stop offset="0%"   stopColor="#B87848"/>
            <stop offset="40%"  stopColor="#925830"/>
            <stop offset="100%" stopColor="#6A3418"/>
          </radialGradient>
          <radialGradient id="g-ear" cx="28%" cy="22%" r="74%">
            <stop offset="0%"   stopColor="#B87258"/>
            <stop offset="52%"  stopColor="#8A4E30"/>
            <stop offset="100%" stopColor="#60301A"/>
          </radialGradient>
          <linearGradient id="g-neck-sh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.01"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0.30"/>
          </linearGradient>
          <radialGradient id="g-jaw-d" cx="50%" cy="100%" r="55%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          {/* Blush — warmer, slightly muted for dark skin */}
          <radialGradient id="g-blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#B83020" stopOpacity="0.15"/>
            <stop offset="54%"  stopColor="#B83020" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#B83020" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-fhl" cx="38%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#F0E8D8" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#F0E8D8" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-malar" cx="50%" cy="34%" r="56%">
            <stop offset="0%"   stopColor="#C09050" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#C09050" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-sss" cx="14%" cy="50%" r="62%">
            <stop offset="0%"   stopColor="#E04010" stopOpacity="0.09"/>
            <stop offset="100%" stopColor="#E04010" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-temple" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.11"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="g-nb" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#C09050" stopOpacity="0"/>
            <stop offset="50%"  stopColor="#C09050" stopOpacity="0.44"/>
            <stop offset="100%" stopColor="#C09050" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="g-ntip" cx="50%" cy="60%" r="52%">
            <stop offset="0%"   stopColor="#A83C1C" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#A83C1C" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-chin-hl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#B88040" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#B88040" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-ear-sss" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#D83010" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#D83010" stopOpacity="0"/>
          </radialGradient>
          {lodCfg.showPores&&(
            <pattern id="p-pore" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="none"/>
              <circle cx="2"   cy="2"   r="0.34" fill="#5A2810" opacity="0.048"/>
              <circle cx="7"   cy="5"   r="0.28" fill="#5A2810" opacity="0.038"/>
              <circle cx="4.5" cy="8"   r="0.26" fill="#5A2810" opacity="0.034"/>
              <circle cx="1"   cy="6.5" r="0.32" fill="#5A2810" opacity="0.042"/>
              <circle cx="8"   cy="1.5" r="0.24" fill="#5A2810" opacity="0.034"/>
            </pattern>
          )}

          {/* ══ HAIR — very dark, almost black ══ */}
          <linearGradient id="g-hair" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%"   stopColor="#1A1410"/>
            <stop offset="32%"  stopColor="#0C0A08"/>
            <stop offset="100%" stopColor="#040302"/>
          </linearGradient>
          <linearGradient id="g-hair-hl1" x1="3%" y1="0%" x2="97%" y2="100%">
            <stop offset="0%"   stopColor="#483A2E" stopOpacity="0.68"/>
            <stop offset="30%"  stopColor="#604A3A" stopOpacity="0.36"/>
            <stop offset="65%"  stopColor="#221814" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#040302" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="g-hair-hl2" x1="6%" y1="2%" x2="94%" y2="98%">
            <stop offset="0%"   stopColor="#403228" stopOpacity="0.46"/>
            <stop offset="50%"  stopColor="#281C14" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#040302" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="g-hair-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#181210"/>
            <stop offset="54%"  stopColor="#0A0806"/>
            <stop offset="100%" stopColor="#040302"/>
          </linearGradient>
          <radialGradient id="g-hair-rim" cx="50%" cy="5%" r="62%">
            <stop offset="0%"   stopColor="#503C2E" stopOpacity="0.52"/>
            <stop offset="52%"  stopColor="#281810" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#040302" stopOpacity="0"/>
          </radialGradient>

          {/* ══ WHITE TEE ══ */}
          <linearGradient id="g-tee" x1="8%" y1="0%" x2="92%" y2="100%">
            <stop offset="0%"   stopColor="#F4F2F0"/>
            <stop offset="40%"  stopColor="#E2E0DC"/>
            <stop offset="100%" stopColor="#CACAC6"/>
          </linearGradient>
          <linearGradient id="g-tee-shad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.012"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0.19"/>
          </linearGradient>
          <linearGradient id="g-tee-rim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FFF" stopOpacity="0.30"/>
            <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="g-sleeve-sh" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </linearGradient>

          {/* ══ PANTS / SHOES ══ */}
          <linearGradient id="g-trsr" x1="14%" y1="0%" x2="86%" y2="100%">
            <stop offset="0%"   stopColor="#262030"/>
            <stop offset="50%"  stopColor="#120E1A"/>
            <stop offset="100%" stopColor="#08060E"/>
          </linearGradient>
          <linearGradient id="g-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#EAECF2"/>
            <stop offset="100%" stopColor="#BABCC8"/>
          </linearGradient>
          <linearGradient id="g-chain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFF4DC"/>
            <stop offset="40%"  stopColor="#DCC498"/>
            <stop offset="100%" stopColor="#A88864"/>
          </linearGradient>

          {/* ══ EYES — very dark iris (near black) ══ */}
          <radialGradient id="g-scl" cx="34%" cy="16%" r="86%">
            <stop offset="0%"   stopColor="#FBF8F2"/>
            <stop offset="50%"  stopColor="#EEE4D8"/>
            <stop offset="100%" stopColor="#D8C8BC"/>
          </radialGradient>
          {/* Identity: iris almost black-brown, very little visible brown */}
          <radialGradient id="g-iris" cx="26%" cy="16%" r="74%">
            <stop offset="0%"   stopColor="#5A3018"/>
            <stop offset="18%"  stopColor="#341808"/>
            <stop offset="50%"  stopColor="#180804"/>
            <stop offset="100%" stopColor="#040102"/>
          </radialGradient>
          <radialGradient id="g-iris-sh" cx="50%" cy="6%" r="94%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.52"/>
            <stop offset="50%"  stopColor="#000" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-pup-d" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#100008" stopOpacity="0.58"/>
            <stop offset="60%"  stopColor="#080004" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#000"    stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="g-eye-wat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFF"    stopOpacity="0.48"/>
            <stop offset="100%" stopColor="#C0CCFF" stopOpacity="0.03"/>
          </linearGradient>
          <radialGradient id="g-eye-us" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="#583014" stopOpacity="0.24"/>
            <stop offset="100%" stopColor="#583014" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-lid-warm" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7A3C1A" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#7A3C1A" stopOpacity="0"/>
          </radialGradient>

          {/* ══ LIPS — medium fullness, darker tones for dark skin ══ */}
          <linearGradient id="g-lip-up" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#6E3434"/>
            <stop offset="48%"  stopColor="#5C2828"/>
            <stop offset="100%" stopColor="#4A2020"/>
          </linearGradient>
          <linearGradient id="g-lip-lo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#7E4242"/>
            <stop offset="45%"  stopColor="#6A3434"/>
            <stop offset="100%" stopColor="#562A2A"/>
          </linearGradient>
          <radialGradient id="g-lip-gls" cx="50%" cy="5%" r="92%">
            <stop offset="0%"   stopColor="#D0908C" stopOpacity="0.26"/>
            <stop offset="100%" stopColor="#D0908C" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-lip-drk" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2E0C08" stopOpacity="0.52"/>
            <stop offset="100%" stopColor="#2E0C08" stopOpacity="0"/>
          </radialGradient>

          {/* ══ BEARD — light, natural stubble ══ */}
          <radialGradient id="g-stb" cx="50%" cy="72%" r="68%">
            <stop offset="0%"   stopColor="#060402" stopOpacity="0.26"/>
            <stop offset="52%"  stopColor="#060402" stopOpacity="0.09"/>
            <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-mst" cx="50%" cy="64%" r="58%">
            <stop offset="0%"   stopColor="#0A0806" stopOpacity="0.54"/>
            <stop offset="100%" stopColor="#0A0806" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="g-chn-b" cx="50%" cy="50%" r="56%">
            <stop offset="0%"   stopColor="#060402" stopOpacity="0.32"/>
            <stop offset="100%" stopColor="#060402" stopOpacity="0"/>
          </radialGradient>

          {/* ══ LIGHTING ══ */}
          <radialGradient id="g-key" cx="25%" cy="12%" r="76%">
            <stop offset="0%"   stopColor="#F8F0DC" stopOpacity="0.2"/>
            <stop offset="56%"  stopColor="#F8F0DC" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#F8F0DC" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="g-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#F0D8A0" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#F0D8A0" stopOpacity="0"/>
          </linearGradient>

          {/* ══ EYE CLIPS — identity: narrow almond ══ */}
          {/* Left eye: slightly more inner corner visible */}
          <clipPath id="cp-le" clipPathUnits="userSpaceOnUse">
            <path d="M 88,114 C 92,105 99,100 107,100 C 114,100 121,106 126,114 C 121,122 114,126 107,126 C 100,126 92,122 88,114 Z"/>
          </clipPath>
          {/* Right eye: 1px wider outer corner */}
          <clipPath id="cp-re" clipPathUnits="userSpaceOnUse">
            <path d="M 134,114 C 138,105 145,100 152,100 C 160,100 167,106 172,114 C 167,122 160,126 152,126 C 145,126 138,122 134,114 Z"/>
          </clipPath>
          <clipPath id="cp-face" clipPathUnits="userSpaceOnUse">
            <path d="M 87,115 C 87,77 107,56 130,54 C 153,56 173,77 173,115 C 173,151 162,180 143,201 C 137,209 133,213 130,213 C 127,213 123,209 117,201 C 98,180 87,151 87,115 Z"/>
          </clipPath>
        </defs>

        {/* ── GROUND SHADOW ── */}
        <ellipse cx="130" cy="714" rx="66" ry="9"  fill="rgba(0,0,0,0.21)"/>
        <ellipse cx="130" cy="714" rx="39" ry="4"  fill="rgba(0,0,0,0.11)"/>

        {/* ════════════════════════════ BREATH ════════════════════════════ */}
        <g style={breathStyle}>
          <g className="ayrin-breath">

          {/* PANTS */}
          <path fill="url(#g-trsr)" d="M 97,508 C 86,572 84,635 92,695 C 99,709 119,709 126,695 C 134,633 135,571 127,508 Z"/>
          <path fill="url(#g-trsr)" d="M 133,508 C 125,571 126,633 134,695 C 141,709 161,709 168,695 C 176,635 174,573 163,508 Z"/>
          <path d="M 109,510 C 105,574 105,638 111,700" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M 151,510 C 155,574 155,638 149,700" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" strokeLinecap="round"/>

          {/* SHOES */}
          <ellipse cx="107" cy="704" rx="23" ry="11" fill="url(#g-shoe)"/>
          <ellipse cx="107" cy="709" rx="22" ry="4.5" fill="#A8AAB8" opacity="0.6"/>
          <ellipse cx="153" cy="704" rx="23" ry="11" fill="url(#g-shoe)"/>
          <ellipse cx="153" cy="709" rx="22" ry="4.5" fill="#A8AAB8" opacity="0.6"/>
          <path d="M 87,701 C 98,694 115,694 125,701"  fill="none" stroke="#C0C6D2" strokeWidth="1.4" opacity="0.6"/>
          <path d="M 135,701 C 146,694 163,694 173,701" fill="none" stroke="#C0C6D2" strokeWidth="1.4" opacity="0.6"/>

          {/* WHITE TEE BODY */}
          <path fill="url(#g-tee)" d="
            M 74,232 C 62,250 57,278 57,322 L 57,448
            C 57,490 80,520 116,526 L 144,526
            C 180,520 203,490 203,448 L 203,322
            C 203,278 198,250 186,232
            C 168,218 151,212 130,212
            C 109,212 92,218 74,232 Z
          "/>
          <path fill="url(#g-tee-shad)" opacity="0.2" d="
            M 184,232 C 197,250 203,278 203,322 L 203,448
            C 203,490 180,520 144,526 L 136,526
            C 142,490 145,436 144,366
            C 143,296 139,250 134,212 C 152,213 170,219 184,232 Z
          "/>
          <path d="M 76,238 C 66,256 61,282 61,324 L 61,445 C 61,481 82,508 110,513"
            fill="none" stroke="url(#g-tee-rim)" strokeWidth="2.0" strokeLinecap="round" opacity="0.34"/>
          <ellipse cx="108" cy="300" rx="34" ry="50" fill="url(#g-key)" className="ayrin-key-light" opacity="0.8"/>
          {folds.map((d,i)=>(
            <path key={i} d={d} fill="none" stroke="#000" strokeWidth={i<2?1.6:i<4?0.9:0.65} strokeLinecap="round" opacity={i<2?0.035:i<4?0.020:0.013}/>
          ))}
          <path d="M 103,256 C 113,265 122,269 130,270" fill="none" stroke="rgba(0,0,0,0.038)" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 157,256 C 147,265 138,269 130,270" fill="none" stroke="rgba(0,0,0,0.038)" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 84,510 C 99,517 115,520 130,520 C 145,520 161,517 176,510" fill="none" stroke="rgba(75,68,55,0.11)" strokeWidth="1.6" strokeLinecap="round"/>
          {/* crew neck */}
          <path d="M 112,224 C 117,234 124,241 130,243 C 136,241 143,234 148,224" fill="none" stroke="rgba(162,156,150,0.56)" strokeWidth="2.1" strokeLinecap="round"/>
          <path fill="rgba(0,0,0,0.062)" d="M 112,224 C 117,234 124,241 130,243 C 136,241 143,234 148,224 C 143,220 137,217 130,217 C 123,217 117,220 112,224 Z" opacity="0.7"/>

          {/* LEFT ARM */}
          <g className="ayrin-shoulder-l">
            <path fill="url(#g-body)" d="M 75,316 C 68,339 66,367 68,394 C 70,414 76,432 84,444 C 88,452 95,456 101,452 L 104,449 C 94,436 89,418 87,398 C 85,376 86,350 90,328 Z"/>
            <path fill="url(#g-tee)" opacity="0.97" d="M 74,232 C 60,244 50,262 46,288 L 40,322 C 56,312 74,298 89,282 Z"/>
            <path fill="url(#g-sleeve-sh)" d="M 74,232 C 60,244 50,262 46,288 L 40,322 C 56,312 74,298 89,282 Z" opacity="0.48"/>
            <path d="M 68,319 C 75,314 83,314 90,317" fill="none" stroke="rgba(158,152,144,0.52)" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
          <path fill="url(#g-body)" d="M 76,442 C 70,446 67,454 68,463 C 71,474 82,477 91,475 C 99,473 104,465 103,457 C 101,448 89,440 76,442 Z"/>
          {lodCfg.showKnuckles&&([[77,447],[83,446],[89,447]] as [number,number][]).map(([kx,ky],i)=>(
            <g key={i}>
              <path d={`M ${kx},${ky} C ${kx+2},${ky+3} ${kx+2},${ky+7} ${kx},${ky+9}`} fill="none" stroke="rgba(70,36,16,0.2)" strokeWidth={1.0-i*0.06} strokeLinecap="round"/>
              <path d={`M ${kx+.4},${ky+1.5} C ${kx+1.1},${ky+3.5} ${kx+1.1},${ky+6} ${kx+.4},${ky+8}`} fill="none" stroke="rgba(190,148,96,0.17)" strokeWidth="0.52" strokeLinecap="round"/>
            </g>
          ))}

          {/* RIGHT ARM */}
          <g className="ayrin-shoulder-r">
            <path fill="url(#g-body)" d="M 185,316 C 192,339 194,367 192,394 C 190,414 184,432 176,444 C 172,452 165,456 159,452 L 156,449 C 166,436 171,418 173,398 C 175,376 174,350 170,328 Z"/>
            <path fill="url(#g-tee)" opacity="0.97" d="M 186,232 C 200,244 210,262 214,288 L 220,322 C 204,312 186,298 171,282 Z"/>
            <path fill="url(#g-sleeve-sh)" d="M 186,232 C 200,244 210,262 214,288 L 220,322 C 204,312 186,298 171,282 Z" opacity="0.36"/>
            <path d="M 192,319 C 185,314 177,314 170,317" fill="none" stroke="rgba(158,152,144,0.52)" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
          <path fill="url(#g-body)" d="M 184,442 C 190,446 193,454 192,463 C 189,474 178,477 169,475 C 161,473 156,465 157,457 C 159,448 171,440 184,442 Z"/>
          {lodCfg.showKnuckles&&([[183,447],[177,446],[171,447]] as [number,number][]).map(([kx,ky],i)=>(
            <g key={i}>
              <path d={`M ${kx},${ky} C ${kx-2},${ky+3} ${kx-2},${ky+7} ${kx},${ky+9}`} fill="none" stroke="rgba(70,36,16,0.2)" strokeWidth={1.0-i*0.06} strokeLinecap="round"/>
              <path d={`M ${kx-.4},${ky+1.5} C ${kx-1.1},${ky+3.5} ${kx-1.1},${ky+6} ${kx-.4},${ky+8}`} fill="none" stroke="rgba(190,148,96,0.17)" strokeWidth="0.52" strokeLinecap="round"/>
            </g>
          ))}

          {/* NECK */}
          <path fill="url(#g-body)" d="M 114,206 C 112,219 110,230 110,244 L 150,244 C 150,230 148,219 146,206 Z"/>
          <path fill="url(#g-neck-sh)" opacity="0.58" d="M 118,206 C 118,222 119,232 122,244 L 138,244 C 141,232 142,222 142,206 Z"/>
          <path d="M 116,208 C 113,222 111,234 111,244" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.5" strokeLinecap="round" opacity="0.52"/>
          <path d="M 144,208 C 147,222 149,234 149,244" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.5" strokeLinecap="round" opacity="0.52"/>
          <path d="M 127,220 C 129,225 131,225 133,220" fill="none" stroke="rgba(0,0,0,0.075)" strokeWidth="1.0" strokeLinecap="round" opacity="0.6"/>
          {/* chain */}
          <path d="M 110,216 C 120,234 140,234 150,216" fill="none" stroke="url(#g-chain)" strokeWidth="2.1" strokeLinecap="round" opacity="0.9"/>
          {([114,119,124,129,134,139,144,149] as number[]).map((cx,i)=>{
            const t=i/7,cy2=216+Math.sin(t*Math.PI)*5.5;
            return<ellipse key={i} cx={cx} cy={cy2} rx={1.15} ry={0.82} fill="none" stroke="#D8C090" strokeWidth="0.6" opacity="0.52"/>;
          })}
          <path d="M 114,231 C 120,224 125,221 130,221 C 135,221 140,224 146,231" fill="none" stroke="rgba(84,52,28,0.15)" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 111,232 C 120,228 126,226 130,226 C 134,226 140,228 149,232" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.0" strokeLinecap="round"/>

          {/* ═══════ HEAD GROUP ═══════ */}
          <g style={headRigStyle}>
            <g className="ayrin-head">

            {/* HAIR */}
            <HairComponent hairState={hairState}/>
            <FringeComponent strandCount={hairState.strandCount}/>
            <LeftEarComponent />
            <FaceBaseComponent showPores={lodCfg.showPores} />
            <BrowsComponent browState={browState} />

            {/* LEFT EYE */}
            <EyeComponent
              cx={107} cy={114} clipId="cp-le"
              eyeState={leftEyeState}
              showLashes={lodCfg.showLashes} showVeins={lodCfg.showVeins}
              rays={irisAngles} side="left" asymX={0} asymY={0}
            />
            {/* RIGHT EYE — micro-asymmetric */}
            <EyeComponent
              cx={153} cy={114} clipId="cp-re"
              eyeState={rightEyeState}
              showLashes={lodCfg.showLashes} showVeins={lodCfg.showVeins}
              rays={irisAngles} side="right" asymX={0.5} asymY={0.25}
            />

            {/* NOSE — identity: straight bridge, medium width, soft tip */}
            <NoseComponent />

            {/* ═══════ FACIAL HAIR — natural, light, irregular ═══════ */}
            {/* Connection bands */}
            <path d="M 113,187 C 110,195 108,204 107,212" fill="none" stroke="rgba(8,6,4,0.13)" strokeWidth="6.5" strokeLinecap="round" opacity="0.62"/>
            <path d="M 147,187 C 150,195 152,204 153,212" fill="none" stroke="rgba(8,6,4,0.13)" strokeWidth="6.5" strokeLinecap="round" opacity="0.62"/>

            {/* Mustache — light, natural */}
            <ellipse cx="130" cy="178" rx="15" ry="4.8" fill="url(#g-mst)" opacity="0.46"/>
            {/* Ref: light mustache, not very dense, slightly fuller at center */}
            <path d="M 115,178 C 119,173 123,171 128,173 C 129.5,171.5 130.5,171.5 132,173 C 137,171 141,173 145,178"
              fill="none" stroke="#0A0806" strokeWidth="4.2" strokeLinecap="round" opacity="0.54"/>
            <path d="M 117,178 C 121,174 125,172 128.5,173.5 C 130,173 131,173 132.5,173.5 C 136,174 140,175.5 143,178"
              fill="none" stroke="#181410" strokeWidth="2.4" strokeLinecap="round" opacity="0.42"/>
            {/* Fine hairs — irregular density */}
            {lodCfg.stubbleDensity>0.3&&[
              [119,178,121,176.5,124,176],[122.5,176.5,125,176,127.5,176.5],
              [130.5,176.5,133,176,135.5,176.5],[136,176.5,139,177.5,141,178.5]
            ].map((p,i)=>(
              <path key={i} d={`M ${p[0]},${p[1]} C ${p[2]},${p[3]} ${p[4]},${p[5]}`}
                fill="none" stroke="#050302" strokeWidth="0.72" strokeLinecap="round" opacity={0.22-i*0.02}/>
            ))}
            {/* Soul patch — small, natural */}
            <ellipse cx="130" cy="196" rx="4.2" ry="3.0" fill="#080604" opacity="0.19"/>
            {lodCfg.stubbleDensity>0.3&&<>
              <path d="M 128.5,194 C 129,197 129.5,199 130,200.5" fill="none" stroke="#040202" strokeWidth="0.62" strokeLinecap="round" opacity="0.19"/>
              <path d="M 130,194 C 130,197 130,199 130,200.5" fill="none" stroke="#040202" strokeWidth="0.60" strokeLinecap="round" opacity="0.17"/>
              <path d="M 131.5,194 C 131,197 130.5,199 130,200.5" fill="none" stroke="#040202" strokeWidth="0.62" strokeLinecap="round" opacity="0.18"/>
            </>}

            {/* Chin beard — ref: concentrated at chin center, soft edges */}
            <ellipse cx="130" cy="206" rx="12" ry="7.5" fill="url(#g-chn-b)" opacity="0.68"/>
            <path d="M 119,199 C 123,208 127,213.5 130,215.5 C 133,213.5 137,208 141,199"
              fill="none" stroke="#0A0806" strokeWidth="3.8" strokeLinecap="round" opacity="0.48"/>
            <path d="M 121,199 C 124,208 127.5,213 130,214.5 C 132.5,213 136,208 139,199"
              fill="none" stroke="#181410" strokeWidth="2.2" strokeLinecap="round" opacity="0.34"/>
            {lodCfg.stubbleDensity>0.4&&[
              [[121,201],[123,207],[123,212]],[[124,200],[126,207],[126,212]],
              [[129,199],[129.5,206],[129.5,212]],[[131,199],[130.5,206],[130.5,212]],
              [[135,200],[133,207],[133,212]],[[138,201],[136,207],[135.5,212]]
            ].map(([p1,p2,p3],i)=>(
              <path key={i} d={`M ${p1[0]},${p1[1]} C ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p3[0]},${p3[1]}`}
                fill="none" stroke="#050302" strokeWidth="0.68" strokeLinecap="round" opacity={0.18-i*0.004}/>
            ))}

            {/* Jaw stubble — irregular cluster patches */}
            {lodCfg.stubbleDensity>0.1&&<>
              <ellipse cx="95"  cy="184" rx="19" ry="13" fill="url(#g-stb)" opacity="0.82"/>
              <ellipse cx="165" cy="184" rx="19" ry="13" fill="url(#g-stb)" opacity="0.82"/>
            </>}
            {lodCfg.stubbleDensity>0.22&&<>
              <ellipse cx="98"  cy="172" rx="13" ry="10" fill="url(#g-stb)" opacity="0.52"/>
              <ellipse cx="162" cy="172" rx="13" ry="10" fill="url(#g-stb)" opacity="0.52"/>
            </>}
            {/* Irregular stroke clusters — varied opacity for uneven growth */}
            {leftJawStubble.map(([sx,sy,dx,opMult],i)=>(
              <path key={`jsl${i}`}
                d={`M ${sx},${sy} C ${sx+dx*0.85},${sy+3} ${sx+dx*0.85},${sy+6} ${sx+dx*0.1},${sy+8}`}
                fill="none" stroke="#080604" strokeWidth="0.56" strokeLinecap="round"
                opacity={0.10*lodCfg.stubbleDensity*opMult}/>
            ))}
            {rightJawStubble.map(([sx,sy,dx,opMult],i)=>(
              <path key={`jsr${i}`}
                d={`M ${sx},${sy} C ${sx+dx*0.85},${sy+3} ${sx+dx*0.85},${sy+6} ${sx+dx*0.1},${sy+8}`}
                fill="none" stroke="#080604" strokeWidth="0.56" strokeLinecap="round"
                opacity={0.10*lodCfg.stubbleDensity*opMult}/>
            ))}

            {/* ══ MOUTH — identity: medium fullness, natural ══ */}
            <LipsComponent lipState={lipState} />

            {/* RIM LIGHT — soft, warm */}
            <path d="M 87,115 C 87,76 107,56 130,54 C 153,56 173,76 173,115
              C 173,148 165,176 148,197 C 142,205 137,209 130,209
              C 123,209 118,205 112,197 C 95,176 87,148 87,115 Z"
              fill="none" stroke="url(#g-rim)" strokeWidth="3.4" className="ayrin-rim-light" opacity="0.42"/>

            </g>{/* .ayrin-head */}
          </g>
        </g>{/* .ayrin-breath */}
        </g>
      </svg>
    </div>
  );
}
