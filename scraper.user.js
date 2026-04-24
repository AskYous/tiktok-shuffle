// ==UserScript==
// @name         TikTok Collection Scraper → Shuffle Player
// @namespace    https://github.com/askyous/tiktok-shuffle
// @version      0.1.0
// @description  Scrape video IDs from a TikTok collection page and copy a shuffle-player URL to clipboard.
// @match        https://www.tiktok.com/*collection*
// @match        https://www.tiktok.com/@*/collection/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const PLAYER_URL = 'https://askyous.github.io/tiktok-shuffle/player.html';

  function makeButton() {
    const btn = document.createElement('button');
    btn.textContent = '⇄ Scrape & Copy Shuffle URL';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 999999,
      padding: '12px 16px',
      background: '#fe2c55',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    });
    btn.onclick = run;
    document.body.appendChild(btn);
  }

  async function autoScroll() {
    let lastHeight = 0;
    let stable = 0;
    while (stable < 3) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1500));
      const h = document.body.scrollHeight;
      if (h === lastHeight) stable++;
      else { stable = 0; lastHeight = h; }
    }
  }

  function extractIds() {
    const ids = new Set();
    document.querySelectorAll('a[href*="/video/"]').forEach((a) => {
      const m = a.href.match(/\/video\/(\d+)/);
      if (m) ids.add(m[1]);
    });
    return [...ids];
  }

  async function run() {
    const btn = document.querySelector('button[data-tts-scraper]');
    const status = (msg) => console.log('[TTS]', msg);
    status('Auto-scrolling to load all videos...');
    await autoScroll();
    const ids = extractIds();
    status(`Found ${ids.length} videos.`);
    if (!ids.length) { alert('No videos found. Are you on a collection page?'); return; }
    const url = `${PLAYER_URL}#${ids.join(',')}`;
    if (typeof GM_setClipboard === 'function') GM_setClipboard(url);
    else await navigator.clipboard.writeText(url);
    alert(`Copied URL with ${ids.length} videos.\nOpen on phone to play.`);
  }

  const observer = new MutationObserver(() => {
    if (!document.body || document.querySelector('[data-tts-scraper]')) return;
    const b = document.createElement('div');
    b.setAttribute('data-tts-scraper', '1');
    document.body.appendChild(b);
    makeButton();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
