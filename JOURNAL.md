# Proper AI Suite — Engineering Journal

A running log of every change made to the suite. Newest entries at the bottom.

---

## 2026-10-24 — Session 1: Repo Resurrection + Unified Deploy

**Operator:** Bruce (AI Consultant) · **Agent context:** Genspark sandbox
**Repo:** `Jasvong43/Proper-AI-Suite` @ `main`
**Baseline commit:** `b46c372` — "Resolve merge conflict in ProperOS/index.html and keep local state management logic"

### State of the union at session start

| Metric | Value |
|---|---|
| Tracked files | 655 |
| Files that are `node_modules` | 626 (95.6%) |
| Repo size | 6.1 MB |
| Apps shipped | 8 single-file HTML SPAs |
| Build pipeline | none |
| `.gitignore` | **did not exist** |
| Cross-app navigation | **none — 8 islands** |
| Deploy target | none configured |

### Findings

**F1 — ProperOS was completely broken (CRITICAL).**
`ProperOS/index.html:638` contained an orphaned merge-conflict marker `>>>>>>> origin/main`,
sitting *inside* the `<script>` block, immediately after `console.error('Failed to update agent status', e);`
and before the `catch` block's closing brace. A bare `>>>>>>> origin/main` token is invalid JavaScript,
so the entire script for ProperOS threw a `SyntaxError` at parse time and **none** of its logic ran.
Prior commit claimed to "resolve merge conflict" — it removed the opening `<<<<<<<` and `=======`
but left the trailing `>>>>>>>`. Classic.

**F2 — 626 vendored dependency files committed to git.** `ProperOS/backend/node_modules` was
fully tracked with no `.gitignore` in the repo at all.

**F3 — Stale duplicate app files with literal backticks in the filename.**
`ProperFuzion/`, `ProperOS/`, `ProperPixelz/`, `ProperStory/` each contained an `index.html\`` file.
These were *not* identical to the live file — they were earlier drafts (older titles such as
"ProperPixelz — AI Visual Studio" vs the current "AI Visual Engine"; ProperStory's copy missing the
`html2pdf` CDN import; ProperOS's copy using the old `showView()` router). All four were introduced
in the initial commit `9942d6a` and never subsequently modified. Superseded, dead weight.

**F4 — Backend cannot run at the edge.** `ProperOS/backend/server.js` (91 lines, Express) does
synchronous `fs.appendFileSync` writes into a hardcoded Windows path
`C:/Users/jsmit/Documents/ProperAI_Vault`. No filesystem on Cloudflare Workers, and the path is meaningless
on any machine but the original dev box.

**F5 — Hardcoded `localhost` in shipped frontend.** `ProperOS/index.html:618` fetched
`http://localhost:3000/api/status`. In production the browser resolves that to the *visitor's own machine*, so
agent status would always fail in the deployed app.

**F6 — No cross-app linking.** No `href` anywhere points at another app in the suite.

### Decisions taken

- **Phase A** — purge stale backtick drafts, repair the ProperOS syntax error, add `.gitignore`,
  untrack `node_modules` (leave on disk).
- **Phase B** — serve the suite locally on port 3000, verify every app boots.
- **Phase C** — port the Express backend to Hono on Cloudflare Pages; replace Obsidian filesystem
  writes with D1 (edge-safe); build a suite launcher shell; make all app URLs relative.

---
