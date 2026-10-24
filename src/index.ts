import { Hono } from 'hono'
import { api } from './routes/api'
import { APP_META } from './apps-meta'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

app.route('/api', api)

// ---------------------------------------------------------------------------
// Launcher shell — Midnight Slate #020617 / Neon Cyan #00f3ff (suite standard)
// ---------------------------------------------------------------------------
app.get('/', (c) => {
  const cards = APP_META.map(
    (a, i) => `
      <a class="app-card" href="/apps/${a.dir}/" style="--accent:${a.accent};animation-delay:${i * 55}ms">
        <div class="app-card__glow"></div>
        <div class="app-card__head">
          <span class="app-card__icon">${a.icon}</span>
          <span class="app-card__arrow" aria-hidden="true">→</span>
        </div>
        <h2 class="app-card__title">${a.title}</h2>
        <p class="app-card__agent">${a.agent}</p>
        <p class="app-card__blurb">${a.blurb}</p>
      </a>`,
  ).join('')

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proper AI Suite</title>
<meta name="description" content="Eight specialized AI agents. One orchestrator. Running on the edge.">
<link rel="preconnect" href="https://cdn.tailwindcss.com">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
  :root {
    --slate: #020617;
    --cyan: #00f3ff;
    --panel: rgba(15, 23, 42, 0.62);
    --hairline: rgba(255, 255, 255, 0.07);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--slate);
    color: #e2e8f0;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
  }
  /* Ambient field */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 15% 0%, rgba(0, 243, 255, 0.10), transparent 45%),
      radial-gradient(circle at 85% 10%, rgba(168, 85, 247, 0.08), transparent 40%),
      radial-gradient(circle at 50% 100%, rgba(0, 243, 255, 0.06), transparent 55%);
    pointer-events: none;
    z-index: 0;
  }
  /* Subtle grid */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }
  .shell { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 24px 72px; }

  /* Header */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 26px 0 0; flex-wrap: wrap;
  }
  .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
  .brand__mark {
    width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center;
    background: linear-gradient(145deg, rgba(0,243,255,.22), rgba(0,243,255,.04));
    border: 1px solid rgba(0, 243, 255, 0.34);
    box-shadow: 0 0 22px rgba(0, 243, 255, 0.20);
    font-size: 17px;
  }
  .brand__name { font-weight: 800; letter-spacing: -0.02em; font-size: 15px; }
  .brand__sub { font-size: 10.5px; letter-spacing: .17em; text-transform: uppercase; color: #64748b; }

  .topbar__status {
    display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: #94a3b8;
    border: 1px solid var(--hairline); background: rgba(15,23,42,.55);
    padding: 7px 13px; border-radius: 999px;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
    box-shadow: 0 0 9px #22c55e; animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

  /* Hero */
  .hero { padding: 62px 0 44px; max-width: 760px; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10.5px; letter-spacing: .19em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 20px;
    border: 1px solid rgba(0,243,255,.24); background: rgba(0,243,255,.055);
    padding: 6px 13px; border-radius: 999px;
  }
  .hero h1 {
    font-size: clamp(2.3rem, 5.4vw, 3.6rem); line-height: 1.04;
    font-weight: 800; letter-spacing: -0.035em; margin: 0 0 20px; color: #f8fafc;
  }
  .hero h1 em {
    font-style: normal;
    background: linear-gradient(100deg, #00f3ff, #7dd3fc 45%, #a855f7);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .hero p { font-size: 16.5px; line-height: 1.65; color: #94a3b8; margin: 0; max-width: 620px; }

  .stats { display: flex; gap: 30px; margin-top: 38px; flex-wrap: wrap; }
  .stat__n { font-size: 25px; font-weight: 800; color: #f1f5f9; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
  .stat__l { font-size: 10.5px; letter-spacing: .15em; text-transform: uppercase; color: #64748b; margin-top: 3px; }

  /* Grid */
  .section-label {
    display: flex; align-items: center; gap: 14px; margin: 12px 0 22px;
    font-size: 10.5px; letter-spacing: .19em; text-transform: uppercase; color: #64748b;
  }
  .section-label::after { content: ""; flex: 1; height: 1px; background: var(--hairline); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(258px, 1fr)); gap: 14px; }

  .app-card {
    position: relative; overflow: hidden; text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    padding: 20px 20px 22px; border-radius: 15px;
    background: var(--panel);
    border: 1px solid var(--hairline);
    backdrop-filter: blur(10px);
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
    animation: rise .5s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

  .app-card__glow {
    position: absolute; inset: -60% 40% 60% -40%;
    background: radial-gradient(circle, var(--accent), transparent 68%);
    opacity: 0; transition: opacity .28s ease; pointer-events: none;
  }
  .app-card:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 42%, transparent);
    box-shadow: 0 14px 40px -14px color-mix(in srgb, var(--accent) 42%, transparent); }
  .app-card:hover .app-card__glow { opacity: .10; }
  .app-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  .app-card__head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 15px; }
  .app-card__icon { font-size: 21px; line-height: 1; filter: saturate(1.15); }
  .app-card__arrow { color: #475569; font-size: 14px; transition: transform .22s ease, color .22s ease; }
  .app-card:hover .app-card__arrow { color: var(--accent); transform: translateX(3px); }

  .app-card__title { margin: 0; font-size: 15.5px; font-weight: 700; letter-spacing: -.015em; color: #f1f5f9; }
  .app-card__agent {
    margin: 4px 0 0; font-size: 10px; letter-spacing: .13em; text-transform: uppercase;
    color: var(--accent); opacity: .9; font-weight: 600;
  }
  .app-card__blurb { margin: 11px 0 0; font-size: 12.6px; line-height: 1.55; color: #8b9bb0; }

  /* Footer */
  footer {
    margin-top: 54px; padding-top: 22px; border-top: 1px solid var(--hairline);
    display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    font-size: 11.5px; color: #475569;
  }
  footer a { color: #64748b; text-decoration: none; }
  footer a:hover { color: var(--cyan); }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
</style>
</head>
<body>
<div class="shell">

  <header class="topbar">
    <a class="brand" href="/">
      <span class="brand__mark">◈</span>
      <span>
        <span class="brand__name">Proper AI Suite</span><br>
        <span class="brand__sub">Edge Runtime</span>
      </span>
    </a>
    <div class="topbar__status"><span class="dot"></span> All agents online</div>
  </header>

  <main>
    <section class="hero" id="hero">
      <span class="eyebrow"><i class="fa-solid fa-bolt"></i> Eight agents · One orchestrator</span>
      <h1>A full creative agency<br><em>running on the edge.</em></h1>
      <p>Ideation, scripting, voice, visuals, video, and distribution — eight specialist AI agents
         coordinated by a single command center. Every app here deploys as static edge assets with a
         Hono API behind it.</p>
      <div class="stats">
        <div><div class="stat__n" id="stat-apps">8</div><div class="stat__l">Agents</div></div>
        <div><div class="stat__n" id="stat-projects">—</div><div class="stat__l">Campaigns</div></div>
        <div><div class="stat__n" id="stat-kb">—</div><div class="stat__l">KB Entries</div></div>
        <div><div class="stat__n">0ms</div><div class="stat__l">Cold Start</div></div>
      </div>
    </section>

    <div class="section-label">The Suite</div>
    <div class="grid">${cards}</div>
  </main>

  <footer>
    <span>Proper AI Suite · Hono on Cloudflare Workers</span>
    <span>
      <a href="/api/health">API Health</a> ·
      <a href="/api/status">Agent Status</a> ·
      <a href="/JOURNAL.md">Journal</a>
    </span>
  </footer>

</div>
<script>
  // Live stat hydration; degrades silently to the static defaults if the API is cold.
  (async () => {
    try {
      const r = await fetch('/api/stats');
      if (!r.ok) return;
      const s = await r.json();
      document.getElementById('stat-projects').textContent = s.projects ?? 0;
      document.getElementById('stat-kb').textContent = s.kbEntries ?? 0;
    } catch (e) { /* static fallback stands */ }
  })();
</script>
</body>
</html>`)
})

// Fallback 404
app.notFound((c) =>
  c.html(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 — Proper AI Suite</title>
     <script src="https://cdn.tailwindcss.com"></script></head>
     <body class="bg-[#020617] text-slate-300 flex items-center justify-center min-h-screen">
     <div class="text-center">
       <p class="text-6xl font-extrabold text-[#00f3ff] mb-3">404</p>
       <p class="text-slate-400 mb-6">That node isn't part of the suite.</p>
       <a href="/" class="px-5 py-2.5 rounded-lg border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff] text-sm font-bold">Back to launcher</a>
     </div></body></html>`,
    404,
  ),
)

export default app
