'use strict';
const card = document.createElement('aside');
card.className = 'music-card paper-player';
card.setAttribute('aria-label', 'Background music player');
card.innerHTML = `<div class="paper-notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♩</span><span>♪</span><span>♫</span></div><div class="track-info"><span class="track-title">just a note</span><span class="track-state" role="status">Tap to play · ambient</span></div><button class="music-toggle" type="button" aria-label="Play background music" aria-pressed="false">▶</button><label class="volume-label"><span class="sr-only">Music volume</span><input type="range" min="0" max="100" value="65" aria-label="Music volume"></label>`;
document.body.append(card);
const audio = new Audio('assets/quiet-afternoon.wav');
audio.loop = true;
audio.preload = 'auto';
audio.volume = .65;
const toggle = card.querySelector('button');
const status = card.querySelector('.track-state');
let optedOut = false;
function render(playing, message) {
  card.classList.toggle('is-playing', playing);
  toggle.textContent = playing ? 'Ⅱ' : '▶';
  toggle.setAttribute('aria-pressed', String(playing));
  toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  status.textContent = message;
}
function start() {
  if (optedOut) return;
  audio.play().catch(error => {
    if (error.name === 'AbortError') return;
    render(false, error.name === 'NotAllowedError' ? 'Tap to play · ambient' : 'Unable to load · tap to retry');
  });
}
audio.addEventListener('playing', () => render(true, 'A quiet afternoon · playing'));
audio.addEventListener('pause', () => render(false, 'A quiet afternoon · paused'));
audio.addEventListener('waiting', () => { status.textContent = 'Loading music…'; });
audio.addEventListener('error', () => render(false, 'Unable to load · tap to retry'));
toggle.addEventListener('click', () => {
  if (!audio.paused) { optedOut = true; audio.pause(); }
  else { optedOut = false; if (audio.error) audio.load(); start(); }
});
card.querySelector('input').addEventListener('input', event => { audio.volume = Number(event.target.value) / 100; });
function unlock(event) {
  if (card.contains(event.target) || optedOut || !audio.paused) return;
  start();
}
document.addEventListener('click', unlock);
document.addEventListener('keydown', unlock);
start();
