'use strict';
// Original, locally synthesized ambient score. No external audio requests.
const card = document.createElement('aside');
card.className = 'music-card';
card.setAttribute('aria-label', 'Background music player');
card.innerHTML = '<div class="record" aria-hidden="true"><span></span></div><div class="track-info"><span class="track-title">A quiet afternoon</span><span class="track-state" role="status">Ambient · tap to listen</span></div><button class="music-toggle" type="button" aria-label="Play background music" aria-pressed="false">▶</button><label class="volume-label"><span class="sr-only">Music volume</span><input type="range" min="0" max="100" value="35" aria-label="Music volume"></label>';
document.body.append(card);
const toggle = card.querySelector('button');
const state = card.querySelector('.track-state');
let context, master, timer, playing = false, starting = false, optedOut = false, cursor = 0;
const chords = [[130.81,164.81,196,246.94],[110,130.81,164.81,196],[87.31,130.81,174.61,220],[98,146.83,196,246.94]];
function phrase() {
  const now = context.currentTime;
  const chord = chords[cursor++ % chords.length];
  chord.forEach((frequency, index) => {
    const voice = context.createOscillator();
    const envelope = context.createGain();
    voice.type = 'sine';
    voice.frequency.value = frequency;
    const at = now + index * .45;
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(.10, at + 1.6);
    envelope.gain.exponentialRampToValueAtTime(.001, at + 8);
    voice.connect(envelope).connect(master);
    voice.start(at);
    voice.stop(at + 8.1);
    voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
  });
}
function render() {
  card.classList.toggle('is-playing', playing);
  toggle.textContent = playing ? 'Ⅱ' : '▶';
  toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  toggle.setAttribute('aria-pressed', String(playing));
  state.textContent = playing ? 'Ambient · now playing' : 'Ambient · paused';
}
async function start() {
  if (playing || starting || optedOut) return;
  starting = true;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('Audio unavailable');
    if (!context) {
      context = new Audio();
      master = context.createGain();
      master.gain.value = Number(card.querySelector('input').value) / 100 * .5;
      master.connect(context.destination);
      context.onstatechange = () => {
        if (context.state !== 'running' && playing) { playing = false; clearInterval(timer); render(); }
      };
    }
    await context.resume();
    if (context.state !== 'running' || optedOut) return;
    playing = true;
    phrase();
    clearInterval(timer);
    timer = setInterval(phrase, 6000);
    render();
  } catch { state.textContent = 'Tap play to enable audio'; }
  finally { starting = false; }
}
toggle.addEventListener('click', async () => {
  if (playing) {
    optedOut = true;
    playing = false;
    clearInterval(timer);
    await context.suspend();
    render();
  } else {
    optedOut = false;
    if (context && starting) context.resume().catch(() => { state.textContent = 'Tap play to enable audio'; });
    else start();
  }
});
card.querySelector('input').addEventListener('input', event => {
  if (master) master.gain.setTargetAtTime(Number(event.target.value) / 100 * .5, context.currentTime, .1);
});
// Autoplay is attempted; browsers that block it unlock on the first interaction.
start();
function unlock(event) {
  if (card.contains(event.target) || optedOut || playing) return;
  if (context && starting) { context.resume().catch(() => {}); return; }
  start();
}
document.addEventListener('pointerdown', unlock);
document.addEventListener('keydown', unlock);
