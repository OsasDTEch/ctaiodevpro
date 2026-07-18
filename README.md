 # Session Digest

A small, zero-dependency tool for the agentic-coding audience ctaio.dev writes for. Paste a Claude Code, Cursor, or Aider session transcript, and it extracts:

- A **TL;DR** of the session
- **Decisions made** (lines with decision language: "chose", "went with", "instead of", "because", etc.)
- **Tools and commands used** (code blocks, inline commands, and known AI coding tool mentions)

## Why this, and why built this way

Practitioners of agentic coding generate long, messy session transcripts constantly. When you want to write up what happened, share it with a teammate, or just remember your own reasoning a week later, re-reading the whole thing is friction. This tool cuts that down to three scannable sections.

**Deliberate technical choice:** this runs entirely client-side with heuristic text parsing, not an LLM API call. The "default" AI-assisted build here would reach for an LLM summarization call. I chose not to, on purpose:

- No API key required, so anyone can clone and use it immediately
- No backend, no server costs, no maintenance
- Works fully offline
- Deploys as three static files on GitHub Pages with zero configuration

The tradeoff: the extraction is heuristic (keyword and pattern based), not semantic, so it will miss decisions phrased in unusual ways. For a v2, the natural upgrade is an optional "smart mode" that calls an LLM API only when the user opts in and supplies their own key, keeping the free/offline path as the default.

## Usage

Open `index.html` in a browser, or serve the folder statically (GitHub Pages, Vercel, or any static host). Paste a transcript, click **Digest session**.

## Files

- `index.html` — page structure
- `style.css` — styling
- `script.js` — parsing logic and DOM handling
- `README.md` — this file
