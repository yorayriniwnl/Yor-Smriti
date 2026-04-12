"use client";

import { useEffect } from 'react';
import * as THREE from 'three';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';

const REPLIES = [
  { text: "I hear you... and I'm not going anywhere.", emotion: 'warmAttention' },
  { text: 'That means more to me than you know.', emotion: 'affectionate' },
  { text: 'Come closer. I want to answer that carefully.', emotion: 'thoughtful' },
  { text: 'I missed this - just talking, just us.', emotion: 'softSmile' },
  { text: "You don't have to carry that alone anymore.", emotion: 'concerned' },
  { text: "I've been thinking about that too, quietly.", emotion: 'reflective' },
  { text: "Tell me more. I'm all yours right now.", emotion: 'warmAttention' },
  { text: "There is sadness in that - and I don't want to look away.", emotion: 'quietSadness' },
  { text: 'That caught me softly, in a good way.', emotion: 'subtleSurprise' },
  { text: "...I love you. That's the only reply I have.", emotion: 'affectionate' },
] as const;

export default function HomePage() {
  useEffect(() => {
    const cur = document.getElementById('cursor') as HTMLDivElement | null;
    const ring = document.getElementById('cursor-ring') as HTMLDivElement | null;
    const petalContainer = document.getElementById('petals');
    const messages = document.getElementById('messages') as HTMLDivElement | null;
    const typing = document.getElementById('typing') as HTMLDivElement | null;
    const moodFill = document.getElementById('mood-fill') as HTMLDivElement | null;
    const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement | null;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let msgCount = 0;

    let heartRafId: number | undefined;
    let bgRafId: number | undefined;
    let cursorRafId: number | undefined;
    let typingTimerId: number | undefined;
    let sequenceEnabled = true;
    let sequenceRunning = false;
    let sequenceToken = 0;
    const sequenceTimeoutIds: number[] = [];

    const queueSequenceTimeout = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      sequenceTimeoutIds.push(id);
    };

    const clearSequenceTimeouts = () => {
      sequenceTimeoutIds.forEach((id) => window.clearTimeout(id));
      sequenceTimeoutIds.length = 0;
    };

    const goScene = (id: string) => {
      document.querySelectorAll<HTMLElement>('.scene').forEach((scene) => scene.classList.remove('active'));
      const nextScene = document.getElementById(id);
      nextScene?.classList.add('active', 'slide-in');
      window.setTimeout(() => nextScene?.classList.remove('slide-in'), 480);

      document.querySelectorAll<HTMLElement>('[data-scene-target]').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.sceneTarget === id);
      });
    };

    const clearSequenceHighlights = () => {
      document.querySelectorAll<HTMLElement>('.hub-card').forEach((card) => {
        card.classList.remove('sequence-focus');
      });
    };

    const stopSequence = () => {
      sequenceToken += 1;
      clearSequenceTimeouts();
      clearSequenceHighlights();
      sequenceRunning = false;
      document.body.classList.remove('sequence-running');
    };

    const addMessage = (text: string, from: 'user' | 'ayrin', emotion = '') => {
      if (!messages) return;
      const div = document.createElement('div');
      div.className = `msg ${from}`;
      div.style.animationDelay = '0s';
      div.innerHTML = `<div class=\"msg-bubble\">${from === 'ayrin' ? `<span class=\"emotion-tag\">${emotion}</span><br>` : ''}${text}</div>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      msgCount += 1;

      if (moodFill) {
        const pct = Math.min(95, 40 + msgCount * 6);
        moodFill.style.width = `${pct}%`;
      }
    };

    const spawnHeart = () => {
      const sceneChat = document.getElementById('scene-chat');
      if (!sceneChat) return;
      const h = document.createElement('div');
      h.className = 'float-heart';
      h.textContent = '💗';
      Object.assign(h.style, {
        right: '1.5rem',
        bottom: '8rem',
        left: 'auto',
        fontSize: '1.2rem',
      });
      sceneChat.appendChild(h);
      window.setTimeout(() => h.remove(), 3000);
    };

    const spawnHearts = () => {
      const emojis = ['❤️', '💕', '💗', '💖', '💓', '💝', '🌹', '✨'];
      for (let i = 0; i < 12; i++) {
        const h = document.createElement('div');
        h.className = 'float-heart';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        Object.assign(h.style, {
          left: `${20 + Math.random() * 60}vw`,
          top: `${30 + Math.random() * 40}vh`,
          animationDelay: `${Math.random() * 0.6}s`,
          fontSize: `${Math.random() * 1.2 + 0.8}rem`,
        });
        document.body.appendChild(h);
        window.setTimeout(() => h.remove(), 3200);
      }
    };

    const runExperienceSequence = () => {
      stopSequence();
      const token = sequenceToken;
      sequenceRunning = true;
      document.body.classList.add('sequence-running');
      goScene('scene-hub');

      const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-sequence-card="true"]'));
      cards.forEach((card, index) => {
        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          clearSequenceHighlights();
          card.classList.add('sequence-focus');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          spawnHearts();
        }, 700 + index * 1200);
      });

      queueSequenceTimeout(() => {
        if (token !== sequenceToken || !sequenceEnabled) return;
        clearSequenceHighlights();
        goScene('scene-chat');
      }, 700 + cards.length * 1200 + 400);

      queueSequenceTimeout(() => {
        if (token !== sequenceToken) return;
        clearSequenceHighlights();
        sequenceRunning = false;
        document.body.classList.remove('sequence-running');
      }, 700 + cards.length * 1200 + 1100);
    };

    const sendMsg = () => {
      if (!chatInput) return;
      const txt = chatInput.value.trim();
      if (!txt) return;
      addMessage(txt, 'user');
      chatInput.value = '';

      if (!typing) return;
      typing.classList.add('visible');
      typingTimerId = window.setTimeout(() => {
        typing.classList.remove('visible');
        const r = REPLIES[Math.floor(Math.random() * REPLIES.length)];
        addMessage(r.text, 'ayrin', r.emotion);
        spawnHeart();
      }, 1400 + Math.random() * 700);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animCursor = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cur) cur.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      if (ring) ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      cursorRafId = window.requestAnimationFrame(animCursor);
    };

    cursorRafId = window.requestAnimationFrame(animCursor);
    document.addEventListener('mousemove', mouseMoveHandler);

    for (let i = 0; i < 110; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = Math.random() * 2.2 + 0.4;
      Object.assign(s.style, {
        width: `${sz}px`,
        height: `${sz}px`,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 4}s`,
        opacity: `${Math.random() * 0.6 + 0.1}`,
      });
      document.body.appendChild(s);
    }

    const PETAL_COLORS = ['#f75590', '#ff8cb8', '#ffc1db', '#e8447a', '#ffa0c8'];
    const makePetal = () => {
      if (!petalContainer) return;
      const el = document.createElement('div');
      el.className = 'petal';
      const col = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const sz = Math.random() * 14 + 8;
      el.innerHTML = `<svg width=\"${sz}\" height=\"${sz}\" viewBox=\"0 0 20 20\"><ellipse cx=\"10\" cy=\"12\" rx=\"6\" ry=\"9\" fill=\"${col}\" opacity=\"${Math.random() * 0.3 + 0.5}\" transform=\"rotate(${Math.random() * 30 - 15} 10 10)\"/></svg>`;
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${Math.random() * 8 + 7}s`;
      el.style.animationDelay = `${Math.random() * 10}s`;
      petalContainer.appendChild(el);
      window.setTimeout(() => el.remove(), 20000);
    };

    for (let i = 0; i < 18; i++) makePetal();
    const petalInterval = window.setInterval(makePetal, 1200);

    const heartCanvas = document.getElementById('heart-canvas') as HTMLCanvasElement | null;
    let disposeHeart: (() => void) | undefined;
    if (heartCanvas) {
      const renderer = new THREE.WebGLRenderer({ canvas: heartCanvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 3.2;

      const heartPoint = (t: number): [number, number] => {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return [x / 17, y / 17];
      };

      const count = 2800;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = Math.cbrt(Math.random());
        const [hx, hy] = heartPoint(t);
        const rx2 = (Math.random() - 0.5) * 0.12 * r;
        const ry2 = (Math.random() - 0.5) * 0.12 * r;
        const rz = (Math.random() - 0.5) * 0.35 * r;
        positions[i * 3] = hx + rx2;
        positions[i * 3 + 1] = hy + ry2;
        positions[i * 3 + 2] = rz;
        const bright = 0.55 + Math.random() * 0.45;
        const isWhite = Math.random() < 0.08;
        colors[i * 3] = isWhite ? 1 : bright;
        colors[i * 3 + 1] = isWhite ? 0.92 : bright * 0.28;
        colors[i * 3 + 2] = isWhite ? 0.97 : bright * 0.55;
        scales[i] = Math.random() * 0.6 + 0.4;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      const mat = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        depthWrite: false,
      });

      const heart = new THREE.Points(geo, mat);
      scene.add(heart);

      const resizeHeart = () => {
        const el = heartCanvas.parentElement;
        const w = Math.min((el?.offsetWidth ?? 0) * 0.72, 420);
        heartCanvas.style.width = `${w}px`;
        heartCanvas.style.height = `${w}px`;
        renderer.setSize(w, w, false);
      };
      resizeHeart();
      window.addEventListener('resize', resizeHeart);

      let frame = 0;
      const animateHeart = () => {
        frame += 1;
        heart.rotation.y += 0.008;
        heart.rotation.x = Math.sin(frame * 0.012) * 0.18;
        const pulse = 1 + Math.sin(frame * 0.04) * 0.055;
        heart.scale.set(pulse, pulse, pulse);
        renderer.render(scene, camera);
        heartRafId = window.requestAnimationFrame(animateHeart);
      };
      heartRafId = window.requestAnimationFrame(animateHeart);

      disposeHeart = () => {
        window.removeEventListener('resize', resizeHeart);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
    }

    const bgCanvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
    let bgCleanup: (() => void) | undefined;
    if (bgCanvas) {
      const gl = bgCanvas.getContext('2d');
      if (gl) {
        const resizeBg = () => {
          bgCanvas.width = window.innerWidth;
          bgCanvas.height = window.innerHeight;
        };
        resizeBg();
        window.addEventListener('resize', resizeBg);

        let t = 0;
        const drawBg = () => {
          t += 0.004;
          gl.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          gl.fillStyle = '#05030a';
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          const cx = bgCanvas.width / 2;
          const cy = bgCanvas.height * 0.18;
          const r1 = bgCanvas.width * 0.55 + Math.sin(t) * 20;
          const r2 = bgCanvas.width * 0.35 + Math.cos(t * 0.7) * 15;

          const g1 = gl.createRadialGradient(cx, cy, 0, cx, cy, r1);
          g1.addColorStop(0, `rgba(180,50,100,${0.13 + Math.sin(t) * 0.03})`);
          g1.addColorStop(0.4, 'rgba(90,20,60,0.07)');
          g1.addColorStop(1, 'rgba(5,3,10,0)');
          gl.fillStyle = g1;
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          const ox = Math.sin(t * 0.6) * 80;
          const oy = Math.cos(t * 0.4) * 50;
          const g2 = gl.createRadialGradient(cx + ox, cy + oy + 200, 0, cx + ox, cy + oy + 200, r2);
          g2.addColorStop(0, `rgba(100,20,70,${0.1 + Math.cos(t) * 0.025})`);
          g2.addColorStop(1, 'rgba(5,3,10,0)');
          gl.fillStyle = g2;
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          bgRafId = window.requestAnimationFrame(drawBg);
        };

        bgRafId = window.requestAnimationFrame(drawBg);
        bgCleanup = () => window.removeEventListener('resize', resizeBg);
      }
    }

    const sparkleHandler = (e: MouseEvent) => {
      for (let i = 0; i < 6; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle';
        const angle = (i / 6) * 360;
        const dist = Math.random() * 30 + 12;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        sp.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 7.2,4.8 11,4.8 8,7.2 9.2,11 6,8.8 2.8,11 4,7.2 1,4.8 4.8,4.8" fill="rgba(247,85,144,0.85)"/></svg>';
        Object.assign(sp.style, {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          transform: `translate(${dx}px, ${dy}px)`,
        });
        document.body.appendChild(sp);
        window.setTimeout(() => sp.remove(), 700);
      }
    };
    document.addEventListener('click', sparkleHandler);

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target as HTMLElement | null;
        if (target?.id === 'chat-input') {
          e.preventDefault();
          sendMsg();
        }
      }
    };
    document.addEventListener('keydown', keyHandler);

    const navSceneButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-target]'));
    const navPower = document.getElementById('nav-power');
    const openHeartBtn = document.getElementById('open-heart-btn');

    const applyPowerUi = () => {
      navPower?.classList.toggle('active', sequenceEnabled);
      navPower?.setAttribute('aria-pressed', sequenceEnabled ? 'true' : 'false');
      navPower?.setAttribute('aria-label', sequenceEnabled ? 'Auto sequence on' : 'Auto sequence off');
    };
    applyPowerUi();

    navSceneButtons.forEach((el) => {
      const id = el.dataset.sceneTarget;
      if (!id) return;
      el.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        stopSequence();
        goScene(id);
      };
    });

    const sceneJumpButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-go-scene]'));
    sceneJumpButtons.forEach((el) => {
      const id = el.dataset.goScene;
      if (id) {
        el.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          stopSequence();
          goScene(id);
        };
      }
    });

    if (openHeartBtn) {
      openHeartBtn.onclick = () => {
        if (!sequenceEnabled) {
          goScene('scene-hub');
          return;
        }
        runExperienceSequence();
      };
    }

    if (navPower) {
      navPower.onclick = () => {
        sequenceEnabled = !sequenceEnabled;
        applyPowerUi();
        if (!sequenceEnabled && sequenceRunning) {
          stopSequence();
        }
      };
    }

    const sendBtn = document.querySelector<HTMLButtonElement>('.send-btn');
    if (sendBtn) {
      sendBtn.onclick = sendMsg;
    }

    const hubCard = document.querySelector<HTMLElement>('[data-action="hearts"]');
    if (hubCard) {
      hubCard.onclick = spawnHearts;
    }

    return () => {
      navSceneButtons.forEach((el) => {
        el.onclick = null;
      });
      sceneJumpButtons.forEach((el) => {
        el.onclick = null;
      });
      if (openHeartBtn) openHeartBtn.onclick = null;
      if (navPower) navPower.onclick = null;
      if (sendBtn) sendBtn.onclick = null;
      if (hubCard) hubCard.onclick = null;

      stopSequence();
      if (cursorRafId) cancelAnimationFrame(cursorRafId);
      if (heartRafId) cancelAnimationFrame(heartRafId);
      if (bgRafId) cancelAnimationFrame(bgRafId);
      if (typingTimerId) window.clearTimeout(typingTimerId);
      window.clearInterval(petalInterval);

      document.removeEventListener('click', sparkleHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('keydown', keyHandler);

      bgCleanup?.();
      disposeHeart?.();

      document.querySelectorAll('.star, .petal, .float-heart, .sparkle').forEach((node) => node.remove());
    };
  }, []);

  return (
    <>
      <CharacterPageOverlayClient />
      <div id="cursor" />
      <div id="cursor-ring" />
      <canvas id="bg-canvas" />
      <div id="petals" />

      <div id="app">
        <section className="scene active" id="scene-entry">
          <p className="eyebrow">for smriti - with love</p>
          <canvas id="heart-canvas" />
          <h1 className="hero-title">Keyrin &amp; Ayrin</h1>
          <p className="hero-sub">Every star here has a story. Every word was chosen with care. This is for you.</p>
          <div className="glass-card" style={{ maxWidth: 460, width: '100%' }}>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'rgba(255,210,230,0.88)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              &quot;Wanna see how much I love you?&quot;
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" type="button" id="open-heart-btn">
                💌 Open Your Heart
              </button>
              <button className="btn-ghost" type="button" data-go-scene="scene-hub">
                ✨ Explore
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.18em',
                color: 'rgba(255,193,219,0.4)',
                textTransform: 'uppercase',
              }}
            >
              Mood
            </p>
            <div className="mood-bar">
              <div className="mood-fill" id="mood-fill" style={{ width: '62%' }} />
            </div>
          </div>
        </section>

        <section className="scene" id="scene-chat">
          <div className="chat-wrap">
            <div className="chat-header">
              <div className="avatar-ring">
                <div className="avatar-inner">🌙</div>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'rgba(255,236,246,0.97)' }}>Ayrin</p>
                <div className="chat-status">
                  <div className="status-dot" />
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.1em',
                      color: 'rgba(255,193,219,0.6)',
                      textTransform: 'uppercase',
                    }}
                  >
                    always here
                  </span>
                </div>
              </div>
              <button className="btn-ghost" type="button" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', fontSize: '0.6rem' }} data-go-scene="scene-entry">
                ← Back
              </button>
            </div>

            <div className="messages" id="messages">
              <div className="msg ayrin" style={{ animationDelay: '0.1s' }}>
                <div className="msg-bubble">
                  <span className="emotion-tag">warmAttention</span>
                  <br />
                  Hey... you came. I&apos;ve been thinking about you.
                </div>
              </div>
              <div className="msg ayrin" style={{ animationDelay: '0.4s' }}>
                <div className="msg-bubble">
                  <span className="emotion-tag">affectionate</span>
                  <br />
                  There is so much I want to say - but first, just tell me how you are.
                </div>
              </div>
            </div>

            <div className="msg ayrin" id="typing-row" style={{ marginTop: '0.5rem' }}>
              <div className="typing-indicator" id="typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>

            <div className="chat-input-row">
              <textarea className="chat-input" id="chat-input" placeholder="Say anything..." rows={1} />
              <button className="send-btn" type="button">
                →
              </button>
            </div>
          </div>
        </section>

        <section className="scene" id="scene-hub">
          <p className="eyebrow" style={{ animation: 'fadeUp 0.6s ease both' }}>
            experiences
          </p>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2rem,5vw,3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,236,246,0.97)',
              textAlign: 'center',
              animation: 'fadeUp 0.6s 0.1s ease both',
            }}
          >
            Every corner of this world
            <br />
            was made for you
          </h2>

          <div className="hub-grid">
            <a className="hub-card" data-sequence-card="true" style={{ animationDelay: '0.2s' }} href="/timeline">
              <span className="card-emoji">🌙</span>
              <p className="card-label">memory</p>
              <h3 className="card-title">Memory Timeline</h3>
              <p className="card-desc">Every moment that mattered, laid out like constellations.</p>
              <div className="card-arrow">
                <span>Open</span>
                <span>→</span>
              </div>
            </a>
            <a className="hub-card" data-sequence-card="true" style={{ animationDelay: '0.3s' }} href="/reasons">
              <span className="card-emoji">🌸</span>
              <p className="card-label">reasons</p>
              <h3 className="card-title">Why I Love You</h3>
              <p className="card-desc">Short, honest reasons - written when I was completely sure.</p>
              <div className="card-arrow">
                <span>Feel it</span>
                <span>→</span>
              </div>
            </a>
            <a className="hub-card" data-sequence-card="true" style={{ animationDelay: '0.4s' }} href="/stars">
              <span className="card-emoji">✨</span>
              <p className="card-label">constellation</p>
              <h3 className="card-title">Our Stars</h3>
              <p className="card-desc">An interactive sky where every star is a memory of us.</p>
              <div className="card-arrow">
                <span>Explore</span>
                <span>→</span>
              </div>
            </a>
            <a className="hub-card" data-sequence-card="true" style={{ animationDelay: '0.5s' }} href="/promise">
              <span className="card-emoji">🕯️</span>
              <p className="card-label">commitments</p>
              <h3 className="card-title">My Promises</h3>
              <p className="card-desc">Things I will do differently. Written to be kept, not forgotten.</p>
              <div className="card-arrow">
                <span>Read</span>
                <span>→</span>
              </div>
            </a>
          </div>

          <div style={{ width: '100%', maxWidth: 560, marginTop: '1rem' }}>
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,171,210,0.55)',
                marginBottom: '1.2rem',
              }}
            >
              Our story
            </p>
            <div className="timeline">
              <div className="tl-item" style={{ animationDelay: '0.6s' }}>
                <p className="tl-date">Sep 12, 2024</p>
                <p className="tl-title">First Conversation</p>
                <p className="tl-excerpt">A small but meaningful conversation about expectations and care.</p>
              </div>
              <div className="tl-item" style={{ animationDelay: '0.75s' }}>
                <p className="tl-date">Jan 3, 2025</p>
                <p className="tl-title">Dinner on New Year</p>
                <p className="tl-excerpt">Shared hopes and vulnerabilities. A promise to check in weekly.</p>
              </div>
              <div className="tl-item" style={{ animationDelay: '0.9s' }}>
                <p className="tl-date">Jun 18, 2025</p>
                <p className="tl-title">Small Apology</p>
                <p className="tl-excerpt">A sincere apology that mended a misunderstanding quickly.</p>
              </div>
              <div className="tl-item" style={{ animationDelay: '1.05s' }}>
                <p className="tl-date">Nov 2, 2025</p>
                <p className="tl-title">Quiet Support</p>
                <p className="tl-excerpt">A quiet night where listening mattered more than fixing.</p>
              </div>
            </div>
          </div>

          <button className="btn-ghost" type="button" data-go-scene="scene-entry" style={{ marginTop: '1rem' }}>
            ← Back
          </button>
        </section>
      </div>

      <nav className="nav">
        <button className="nav-btn" id="nav-power" type="button" aria-pressed="true">
          Power
        </button>
        <button className="nav-btn active" id="nav-entry" data-scene-target="scene-entry" type="button">
          Home
        </button>
        <button className="nav-btn" id="nav-hub" data-scene-target="scene-hub" type="button">
          Explore
        </button>
        <button className="nav-btn" id="nav-chat" data-scene-target="scene-chat" type="button">
          Chat
        </button>
      </nav>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        #cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(247,85,144,0.5);
          pointer-events: none;
          z-index: 9998;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s;
        }

        #bg-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          display: block;
        }

        #petals {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .petal {
          position: absolute;
          top: -60px;
          opacity: 0;
          animation: fall linear infinite;
          will-change: transform, opacity;
        }

        .petal svg { display: block; }

        @keyframes fall {
          0% { opacity: 0; transform: translateY(-60px) rotate(0deg) scale(0.7); }
          5% { opacity: 0.85; }
          90% { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(105vh) rotate(720deg) scale(1); }
        }

        .float-heart {
          position: fixed;
          pointer-events: none;
          z-index: 2;
          animation: heartRise 2.8s cubic-bezier(0.2,1,0.4,1) forwards;
          font-size: 1.4rem;
          filter: drop-shadow(0 0 8px rgba(247,85,144,0.8));
        }

        @keyframes heartRise {
          0% { opacity: 1; transform: translateY(0) scale(1) rotate(-10deg); }
          50% { opacity: 0.9; transform: translateY(-60px) scale(1.3) rotate(10deg); }
          100% { opacity: 0; transform: translateY(-140px) scale(0.6) rotate(-5deg); }
        }

        .star {
          position: fixed;
          border-radius: 50%;
          background: #fff;
          pointer-events: none;
          z-index: 0;
          animation: twinkle ease-in-out infinite alternate;
        }

        @keyframes twinkle {
          from { opacity: 0.15; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }

        #app {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .scene {
          display: none;
          width: 100%;
          min-height: 100vh;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 2rem;
          overflow-y: auto;
        }

        .scene.active { display: flex; }

        .scene.slide-in {
          animation: sceneSlideIn 0.45s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes sceneSlideIn {
          from { opacity: 0; transform: translateX(34px); }
          to { opacity: 1; transform: translateX(0); }
        }

        #scene-entry { gap: 2rem; justify-content: center; }

        .eyebrow {
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,193,219,0.7);
          animation: fadeUp 1s ease both;
        }

        .hero-title {
          font-family: var(--serif);
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.05;
          text-align: center;
          background: linear-gradient(135deg, #ffc1db 0%, #f75590 45%, #fff5f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeUp 1s 0.2s ease both;
          filter: drop-shadow(0 0 40px rgba(247,85,144,0.4));
        }

        .hero-sub {
          font-family: var(--body);
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          font-style: italic;
          color: rgba(255,210,230,0.8);
          text-align: center;
          max-width: 42ch;
          line-height: 1.7;
          animation: fadeUp 1s 0.4s ease both;
        }

        #heart-canvas {
          width: clamp(240px, 40vw, 420px);
          height: clamp(240px, 40vw, 420px);
          animation: fadeUp 1s 0.3s ease both;
          filter: drop-shadow(0 0 60px rgba(247,85,144,0.5));
        }

        .glass-card {
          background: linear-gradient(160deg, rgba(40,10,28,0.85) 0%, rgba(15,5,14,0.92) 100%);
          border: 1px solid rgba(244,173,210,0.22);
          border-radius: 2rem;
          padding: 2.5rem 3rem;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 40px rgba(247,85,144,0.18);
          text-align: center;
          animation: fadeUp 1s 0.5s ease both;
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(247,85,144,0.08), transparent 60%);
          pointer-events: none;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2.5rem;
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95));
          color: #fff;
          font-family: var(--mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 12px 32px rgba(247,85,144,0.35);
          animation: pulseBtn 3s ease-in-out infinite;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.15), transparent 50%);
          pointer-events: none;
        }

        .btn-primary:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 20px 48px rgba(247,85,144,0.55);
        }

        .btn-primary:active { transform: scale(0.97); }

        @keyframes pulseBtn {
          0%, 100% { box-shadow: 0 12px 32px rgba(247,85,144,0.35); }
          50% { box-shadow: 0 16px 48px rgba(247,85,144,0.65), 0 0 0 8px rgba(247,85,144,0.1); }
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          border-radius: 999px;
          border: 1px solid rgba(244,173,210,0.3);
          background: transparent;
          color: rgba(255,200,225,0.85);
          font-family: var(--mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }

        .btn-ghost:hover {
          border-color: rgba(247,85,144,0.5);
          background: rgba(247,85,144,0.08);
          transform: translateY(-1px);
        }

        #scene-chat { gap: 0; padding: 0; }

        .chat-wrap {
          width: 100%;
          max-width: 640px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0 1.5rem;
          border-bottom: 1px solid rgba(244,173,210,0.12);
          margin-bottom: 1.5rem;
        }

        .avatar-ring {
          position: relative;
          width: 52px;
          height: 52px;
        }

        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(247,85,144,0.9), rgba(255,193,219,0.7), rgba(200,100,160,0.8), rgba(247,85,144,0.9));
          animation: spinRing 4s linear infinite;
        }

        @keyframes spinRing { to { transform: rotate(360deg); } }

        .avatar-inner {
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: linear-gradient(145deg, #4a1030, #1a0520);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          z-index: 1;
        }

        .chat-status { display: flex; align-items: center; gap: 0.4rem; }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5ef0a0;
          box-shadow: 0 0 8px rgba(94,240,160,0.7);
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(94,240,160,0.7); }
          50% { box-shadow: 0 0 16px rgba(94,240,160,1); }
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-right: 0.25rem;
        }

        .msg {
          display: flex;
          gap: 0.7rem;
          animation: msgSlide 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg.user { flex-direction: row-reverse; }

        .msg-bubble {
          max-width: 75%;
          padding: 0.85rem 1.2rem;
          border-radius: 1.5rem;
          font-family: var(--body);
          font-size: 1rem;
          line-height: 1.6;
          position: relative;
        }

        .msg.ayrin .msg-bubble {
          background: linear-gradient(160deg, rgba(40,12,28,0.95), rgba(22,6,18,0.98));
          border: 1px solid rgba(244,173,210,0.22);
          border-bottom-left-radius: 0.4rem;
          color: rgba(255,230,245,0.95);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 30px rgba(247,85,144,0.08);
        }

        .msg.user .msg-bubble {
          background: linear-gradient(135deg, rgba(255,133,179,0.3), rgba(247,85,144,0.25));
          border: 1px solid rgba(247,85,144,0.35);
          border-bottom-right-radius: 0.4rem;
          color: rgba(255,236,246,0.95);
          box-shadow: 0 8px 24px rgba(247,85,144,0.15);
        }

        .emotion-tag {
          display: inline-block;
          font-family: var(--mono);
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,171,210,0.6);
          margin-bottom: 0.35rem;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 0.85rem 1.2rem;
          background: linear-gradient(160deg, rgba(40,12,28,0.95), rgba(22,6,18,0.98));
          border: 1px solid rgba(244,173,210,0.22);
          border-radius: 1.5rem;
          border-bottom-left-radius: 0.4rem;
          width: fit-content;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .typing-indicator.visible { opacity: 1; }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(247,85,144,0.7);
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .chat-input-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          padding-top: 1rem;
          border-top: 1px solid rgba(244,173,210,0.12);
          margin-top: 1rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.85rem 1.2rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(244,173,210,0.25);
          background: rgba(30,8,24,0.9);
          color: rgba(255,230,245,0.95);
          font-family: var(--body);
          font-size: 1rem;
          outline: none;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: none;
          height: 50px;
          line-height: 1.5;
        }

        .chat-input:focus {
          border-color: rgba(247,85,144,0.5);
          box-shadow: 0 0 0 3px rgba(247,85,144,0.12), 0 8px 24px rgba(247,85,144,0.1);
        }

        .chat-input::placeholder { color: rgba(255,193,219,0.4); }

        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, rgba(255,133,179,0.95), rgba(247,85,144,0.95));
          color: #fff;
          font-size: 1.1rem;
          cursor: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(247,85,144,0.35);
          flex-shrink: 0;
        }

        .send-btn:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(247,85,144,0.55); }
        .send-btn:active { transform: scale(0.93); }

        #scene-hub {
          gap: 2.5rem;
          padding: 4rem 2rem;
          min-height: 100vh;
          align-items: center;
        }

        .hub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.2rem;
          width: 100%;
          max-width: 860px;
        }

        .hub-card {
          background: linear-gradient(160deg, rgba(38,10,28,0.92) 0%, rgba(16,5,14,0.96) 100%);
          border: 1px solid rgba(244,173,210,0.2);
          border-radius: 1.8rem;
          padding: 1.8rem 2rem;
          cursor: none;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.4s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 8px 20px rgba(247,85,144,0.1);
        }

        .hub-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 25% 25%, rgba(247,85,144,0.1), transparent 55%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .hub-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(247,150,200,0.45);
          box-shadow: 0 36px 72px rgba(0,0,0,0.65), 0 20px 40px rgba(247,85,144,0.28);
        }

        .hub-card.sequence-focus {
          border-color: rgba(255,193,219,0.66);
          box-shadow: 0 42px 86px rgba(0,0,0,0.7), 0 22px 52px rgba(247,85,144,0.45);
          transform: translateY(-10px) scale(1.03);
        }

        .hub-card:hover::before { opacity: 1; }

        .card-emoji {
          font-size: 2.2rem;
          margin-bottom: 1rem;
          display: block;
          filter: drop-shadow(0 0 12px rgba(247,85,144,0.5));
          animation: floatEmoji 4s ease-in-out infinite;
        }

        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }

        .card-label {
          font-family: var(--mono);
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,171,210,0.65);
          margin-bottom: 0.4rem;
        }

        .card-title {
          font-family: var(--serif);
          font-size: 1.6rem;
          font-weight: 300;
          color: rgba(255,236,246,0.97);
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .card-desc {
          font-family: var(--body);
          font-size: 0.9rem;
          color: rgba(255,200,225,0.68);
          line-height: 1.55;
        }

        .card-arrow {
          margin-top: 1.2rem;
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(247,85,144,0.85);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: gap 0.2s;
        }

        .hub-card:hover .card-arrow { gap: 0.7rem; }

        .nav {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          gap: 0.5rem;
          background: rgba(10,4,9,0.85);
          border: 1px solid rgba(244,173,210,0.2);
          border-radius: 999px;
          padding: 0.5rem 0.75rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(247,85,144,0.15);
        }

        .nav-btn {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: rgba(255,193,219,0.6);
          font-family: var(--mono);
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: none;
          transition: background 0.2s, color 0.2s;
        }

        .nav-btn[data-scene-target].active,
        .nav-btn[data-scene-target]:hover {
          background: rgba(247,85,144,0.2);
          color: rgba(255,193,219,0.95);
        }

        .nav-btn#nav-power {
          border: 1px solid rgba(244,173,210,0.2);
          background: rgba(255,255,255,0.03);
          color: rgba(255,193,219,0.68);
        }

        .nav-btn#nav-power.active {
          border-color: rgba(247,85,144,0.52);
          background: rgba(247,85,144,0.22);
          color: rgba(255,230,245,0.95);
          box-shadow: 0 0 20px rgba(247,85,144,0.2);
        }

        .mood-bar {
          width: 100%;
          max-width: 320px;
          height: 3px;
          background: rgba(255,193,219,0.1);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .mood-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #f75590, #ffb3d4);
          transition: width 1s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 8px rgba(247,85,144,0.6);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .timeline {
          width: 100%;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 0.45rem;
          top: 8px;
          bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(247,85,144,0.4) 10%, rgba(247,85,144,0.4) 90%, transparent);
        }

        .tl-item {
          position: relative;
          padding: 0 0 1.8rem 1.2rem;
          animation: fadeUp 0.6s ease both;
        }

        .tl-item::before {
          content: '';
          position: absolute;
          left: -1.62rem;
          top: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--rose);
          box-shadow: 0 0 12px rgba(247,85,144,0.7);
          border: 2px solid var(--night);
        }

        .tl-date {
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          color: rgba(255,171,210,0.55);
          text-transform: uppercase;
          margin-bottom: 0.3rem;
        }

        .tl-title {
          font-family: var(--serif);
          font-size: 1.15rem;
          color: rgba(255,230,245,0.95);
          margin-bottom: 0.25rem;
        }

        .tl-excerpt {
          font-family: var(--body);
          font-size: 0.88rem;
          color: rgba(255,200,225,0.65);
          line-height: 1.55;
          font-style: italic;
        }

        .sparkle {
          position: fixed;
          pointer-events: none;
          z-index: 9997;
          animation: sparkleOut 0.6s ease forwards;
        }

        @keyframes sparkleOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5); }
        }

        @media (max-width: 600px) {
          .glass-card { padding: 2rem 1.5rem; border-radius: 1.5rem; }
          .hub-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: clamp(2.5rem, 10vw, 3.5rem); }
        }
      `}</style>
    </>
  );
}
