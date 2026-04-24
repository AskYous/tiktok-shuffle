# tiktok-shuffle

A shuffle player for your TikTok collections.

### ▶ [Open the live player](https://askyous.github.io/tiktok-shuffle/player.html)

TikTok lets you save videos into collections but gives you no shuffle button. With a 300-video collection, the videos you saved early effectively disappear — you only ever rewatch the most recent ones. This project fixes that.

## How it works

Two pieces, no backend, no login, no database.

1. **`scraper.user.js`** — a Tampermonkey userscript. You run it on a TikTok collection page in your logged-in browser. It auto-scrolls to load every video, harvests the IDs, and copies a shuffle-player URL to your clipboard.
2. **`player.html`** — a single static HTML file hosted on GitHub Pages. It reads the video IDs out of the URL fragment (`#id1,id2,id3,...`), shuffles them, and plays each one back-to-back via TikTok's official `embed/v2` iframe. Prev / Next / Reshuffle / optional auto-advance.

Because the IDs live in the URL fragment, no server ever sees your collection. The page is fully static — open it from a CDN, from disk, doesn't matter.

## Setup

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Open [`scraper.user.js`](./scraper.user.js) raw and let Tampermonkey install it.
3. Log into TikTok in the same browser, navigate to a collection page (`tiktok.com/@you/collection/Name-1234567890`).
4. Wait for the page to settle, then click the red **⇄ Scrape & Copy Shuffle URL** button bottom-right.
5. The script auto-scrolls to the bottom (slow for big collections — be patient), grabs every video ID it sees, and writes a `https://askyous.github.io/tiktok-shuffle/player.html#...` URL to your clipboard.
6. Send that URL to whichever device you want to watch on. Tap to play.

## Known limits

- TikTok's collection page DOM is undocumented and changes occasionally. If the scraper ever returns 0 videos, the CSS selector in `extractIds()` is the place to fix.
- Some creators disable embed playback. Those videos render as "Video unavailable" in the iframe — skip with Next.
- Auto-advance has two strategies: a postMessage listener for TikTok's end-of-video event (undocumented, unreliable) and a fixed-duration timer fallback. The timer is off by default because most TikToks vary wildly in length and a fixed value is annoying.
- Mobile browsers throttle background tabs. Keep the screen on during playback.

## Credits

Vibe coded in a single session with [Claude Code](https://claude.com/claude-code) (Opus 4.7, in caveman mode for maximum signal-per-token). Specced, scraped, embedded, and shipped to GitHub Pages without me writing a line.

Idea, direction, and testing: [@AskYous](https://github.com/AskYous).
Implementation: Claude.

If you fork this and improve it, open a PR.
