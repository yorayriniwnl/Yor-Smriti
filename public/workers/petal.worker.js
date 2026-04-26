// Petal canvas worker: draws petals/hearts/confetti on an OffscreenCanvas
// Served from /workers/petal.worker.js — plain JS so it can be loaded as a static worker.
//
// USAGE NOTE: When instantiating this worker from a component, always attach an
// onerror handler so failures surface rather than silently dying:
//
//   const worker = new Worker('/workers/petal.worker.js');
//   worker.onerror = (e) => {
//     console.warn('[PetalWorker] Worker error, canvas animation disabled:', e.message);
//     worker.terminate();
//   };

// Forward unhandled errors inside the worker context to the main thread so
// they appear in DevTools and can be caught by the host's onerror handler.
self.addEventListener('error', (e) => {
  self.postMessage({ type: 'error', message: e.message ?? String(e) });
});
self.addEventListener('unhandledrejection', (e) => {
  self.postMessage({ type: 'error', message: String(e.reason) });
});

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let mode = 'mixed';
let running = false;
let particles = [];
let frameTimer = null;

const PETAL_COLORS = ['#FDE8E8', '#FAD0D0', '#F8BBD0', '#FFC1E3', '#FFD6E7'];
const HEART_COLORS = ['#FF6B6B', '#FF8DAA', '#FFB6C1', '#FF9AA2'];

function randomBetween(a,b){ return Math.random()*(b-a)+a; }
function randomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
let idSeed = 0;
function makeId(){ return `pw-${++idSeed}`; }

function spawnFallingPetal(){
  const size = randomBetween(7,19);
  return {
    id: makeId(),
    x: randomBetween(-20, width+20),
    y: randomBetween(-50, -10),
    vx: randomBetween(-0.5, 0.5),
    vy: randomBetween(0.9, 2.4),
    size,
    color: randomFrom(PETAL_COLORS),
    opacity: randomBetween(0.5, 0.85),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-1.8,1.8),
    life: randomBetween(8000,16000),
    maxLife: 16000,
    type: 'petal',
    swayOffset: randomBetween(0, Math.PI*2),
    swaySpeed: randomBetween(0.4,1.0),
    isRising: false,
  };
}

function spawnRisingHeart(){
  const size = randomBetween(10,22);
  return {
    id: makeId(),
    x: randomBetween(40, width-40),
    y: height + 20,
    vx: randomBetween(-0.3,0.3),
    vy: randomBetween(-1.2,-0.5),
    size,
    color: randomFrom(HEART_COLORS),
    opacity: randomBetween(0.4,0.75),
    rotation: 0,
    rotationSpeed: randomBetween(-0.5,0.5),
    life: randomBetween(5000,9000),
    maxLife: 9000,
    type: 'heart',
    swayOffset: randomBetween(0, Math.PI*2),
    swaySpeed: randomBetween(0.3,0.8),
    isRising: true,
  };
}

function spawnConfetti(){
  const types = ['petal','heart','star','confetti'];
  const type = randomFrom(types);
  return {
    id: makeId(),
    x: randomBetween(0, width),
    y: -20,
    vx: randomBetween(-2,2),
    vy: randomBetween(2,5),
    size: randomBetween(6,14),
    color: randomFrom([...PETAL_COLORS, ...HEART_COLORS]),
    opacity: randomBetween(0.7,1),
    rotation: randomBetween(0,360),
    rotationSpeed: randomBetween(-5,5),
    life: randomBetween(3000,6000),
    maxLife: 6000,
    type,
  };
}

function drawPetalSimple(ctx, x, y, w, h, rotation, color, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x,y);
  ctx.rotate((rotation*Math.PI)/180);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawHeartSimple(ctx, x, y, size, color, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const topCurveHeight = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size/2, y + (size/2), x, y + (size*0.9), x, y + size);
  ctx.bezierCurveTo(x, y + (size*0.9), x + size/2, y + (size/2), x + size/2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size/2, y, x, y, x, y + topCurveHeight);
  ctx.fill();
  ctx.restore();
}

function updateAndDraw(dt){
  if (!ctx) return;
  ctx.clearRect(0,0,width,height);
  const now = Date.now();

  particles = particles.filter((p) => {
    const sway = Math.sin(now * 0.001 * (p.swaySpeed || 0.6) + (p.swayOffset || 0)) * 0.5;
    p.x += ((p.vx || 0) + sway) * dt * 60;
    p.y += (p.vy || 0) * dt * 60;
    p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0) * dt * 60;
    p.life = (p.life || (p.maxLife||5000)) - dt*1000;

    const alive = (p.life || 0) > 0 && (p.isRising ? p.y > -60 : p.y < height+60);
    if (alive){
      const lifeRatio = (p.life || 0) / (p.maxLife || 1);
      const alpha = (p.opacity || 1) * (lifeRatio < 0.15 ? lifeRatio/0.15 : 1);
      switch (p.type){
        case 'heart': drawHeartSimple(ctx, p.x, p.y, p.size, p.color, alpha); break;
        case 'confetti':
          ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = p.color; ctx.translate(p.x,p.y); ctx.rotate((p.rotation||0)*Math.PI/180); ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size/1.8); ctx.restore();
          break;
        default: drawPetalSimple(ctx, p.x, p.y, p.size, (p.size||10)*0.6, p.rotation||0, p.color, alpha);
      }
    }
    return alive;
  });
}

function spawnLoop(maxCount = 40, spawnRate = 300){
  if (!running) return;
  if (particles.length < maxCount){
    if (mode === 'finale') particles.push(spawnConfetti());
    else if (mode === 'petals') particles.push(spawnFallingPetal());
    else if (mode === 'hearts') particles.push(spawnRisingHeart());
    else {
      const r = Math.random();
      if (r < 0.6) particles.push(spawnFallingPetal()); else particles.push(spawnRisingHeart());
    }
  }
  if (!running) return;
  setTimeout(()=>spawnLoop(maxCount, spawnRate), spawnRate + Math.random()*200);
}

function startLoop(){
  if (!canvas) return;
  running = true;
  let last = Date.now();
  function loop(){
    if (!running) return;
    const now = Date.now();
    const dt = Math.min((now - last)/1000, 0.05);
    last = now;
    updateAndDraw(dt);
    frameTimer = setTimeout(loop, 16);
  }
  loop();
  spawnLoop(mode==='finale'?70:30, mode==='finale'?80:350);
}

function stopLoop(){
  running = false;
  if (frameTimer) clearTimeout(frameTimer);
  particles = [];
}

self.addEventListener('message', (e) => {
  const d = e.data || {};
  switch(d.type){
    case 'init':
      canvas = d.canvas;
      width = d.width || 0;
      height = d.height || 0;
      mode = d.mode || 'mixed';
      try {
        ctx = canvas.getContext('2d');
        canvas.width = width; canvas.height = height;
        startLoop();
      } catch (err){
        self.postMessage({ type: 'log', message: 'failed to init canvas: '+String(err) });
      }
      break;
    case 'resize':
      width = d.width || width;
      height = d.height || height;
      if (canvas) { canvas.width = width; canvas.height = height; }
      break;
    case 'stop':
      stopLoop();
      break;
  }
});
