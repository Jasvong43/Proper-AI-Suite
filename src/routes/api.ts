/**
 * API routes — a Cloudflare-workers port of ProperOS/backend/server.js.
 *
 * What changed and why:
 *   - Express          -> Hono (edge runtime, no Node http server)
 *   - systemState{}    -> D1 tables (agents, projects, kb_entries); Workers
 *                         instances are ephemeral and cannot hold state
 *   - writeToObsidian() -> kb_entries inserts. The original used fs.appendFileSync
 *                         against a hardcoded C:/Users/jsmit/... path; there is no
 *                         filesystem on the edge and that path never existed
 *                         anywhere but the original dev machine.
 */
import { Hono } from 'hono'
import type { MiddlewareHandler } from 'hono'

type Bindings = { DB: D1Database; API_KEY?: string }

export const api = new Hono<{ Bindings: Bindings }>()

// ---------------------------------------------------------------------------
// Write authentication
// ---------------------------------------------------------------------------
// Fail-closed gate on every mutating route. No API_KEY configured => writes are
// refused outright (503), never silently allowed. Reads the key from the
// `x-api-key` header, or `Authorization: Bearer <key>`.
//
// The key lives in `.dev.vars` locally (gitignored) and as a secret binding
// anywhere else. It is never inlined into client code or bundled assets.

const MIN_KEY_LENGTH = 16

/** Constant-time string comparison — avoids leaking the key via timing. */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ab = enc.encode(a)
  const bb = enc.encode(b)
  // Length is not secret (it's fixed by the operator), content is.
  if (ab.length !== bb.length) return false
  let diff = 0
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i]
  return diff === 0
}

function presentedKey(header: (n: string) => string | undefined): string | undefined {
  const direct = header('x-api-key')
  if (direct) return direct.trim()

  const auth = header('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()

  return undefined
}

const requireWriteAuth: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const configured = c.env.API_KEY?.trim()

  // Fail closed: an unconfigured gate denies, it does not open.
  if (!configured || configured.length < MIN_KEY_LENGTH) {
    return c.json(
      {
        success: false,
        error: 'write_api_disabled',
        message:
          'API_KEY is not configured (or is shorter than 16 chars). Write endpoints are disabled by design.',
      },
      503,
    )
  }

  const provided = presentedKey((n) => c.req.header(n))

  if (!provided) {
    return c.json(
      {
        success: false,
        error: 'unauthorized',
        message: 'Missing API key. Send it as the x-api-key header or an Authorization: Bearer token.',
      },
      401,
    )
  }

  if (!safeEqual(provided, configured)) {
    return c.json({ success: false, error: 'unauthorized', message: 'Invalid API key.' }, 401)
  }

  await next()
}

/** Pipeline order used by the orchestrator. */
const PIPELINE = ['Viral', 'Storyz', 'VoCaL', 'Pixelz', 'Fuzion', 'Socialz'] as const

// ---------------------------------------------------------------------------
// Schema bootstrap
// ---------------------------------------------------------------------------
// Migrations should have run first (`npm run db:migrate:local`), but the API
// stays functional on a fresh database by creating the tables on first touch.
let schemaReady = false

async function ensureSchema(db: D1Database) {
  if (schemaReady) return
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS agents (
      key TEXT PRIMARY KEY, name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Idle',
      kb_version TEXT NOT NULL DEFAULT 'v1.0',
      last_updated TEXT NOT NULL DEFAULT (datetime('now')))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT 'Untitled Campaign',
      command TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'In Progress',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS kb_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT, agent TEXT NOT NULL,
      content TEXT NOT NULL, mapping TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')))`),
  ])

  // Self-seed the agent registry. A hosted deploy provisions an empty D1 and
  // never runs seed.sql, so without this the status grid would render blank
  // until the first workflow run.
  const count = await db.prepare('SELECT COUNT(*) AS n FROM agents').first<{ n: number }>()
  if (!count || count.n === 0) {
    await db.batch(
      DEFAULT_AGENTS.map((a) =>
        db.prepare('INSERT OR IGNORE INTO agents (key, name, status, kb_version) VALUES (?, ?, ?, ?)')
          .bind(a.key, a.name, a.status, a.kb),
      ),
    )
  }

  schemaReady = true
}

const DEFAULT_AGENTS = [
  { key: 'viral', name: 'ProperViral', status: 'Idle', kb: 'v4.0' },
  { key: 'storyz', name: 'ProperStoryz', status: 'Idle', kb: 'v4.1' },
  { key: 'vocal', name: 'ProperVoCaL', status: 'Idle', kb: 'v3.5' },
  { key: 'pixelz', name: 'ProperPixelz', status: 'Idle', kb: 'v4.2' },
  { key: 'fuzion', name: 'ProperFuzion', status: 'Idle', kb: 'v3.8' },
  { key: 'socialz', name: 'ProperSocialz', status: 'Idle', kb: 'v4.5' },
  { key: 'flux', name: 'ProperFlux', status: 'Idle', kb: 'v2.9' },
]

/** Replaces writeToObsidian(agent, content, mappingData). */
async function writeKbEntry(
  db: D1Database,
  agent: string,
  content: string,
  mapping: Record<string, unknown>,
) {
  await db
    .prepare('INSERT INTO kb_entries (agent, content, mapping) VALUES (?, ?, ?)')
    .bind(agent, content, JSON.stringify(mapping))
    .run()
}

// ---------------------------------------------------------------------------
// Campaign-name derivation
// ---------------------------------------------------------------------------
const LEAD_PHRASES = [
  'start a new campaign',
  'launch a new campaign',
  'create a new campaign',
  'kick off a new campaign',
  'a new campaign',
  'new campaign',
  'start campaign',
  'launch campaign',
  'launch',
  'start',
  'create',
  'new',
]

/**
 * Derive a campaign name from an orchestrator command.
 *
 * Longest-phrase-first: a plain regex alternation backtracks to the shortest
 * branch, so "launch a new campaign for X" would otherwise yield
 * "a new campaign for X" instead of "X".
 */
export function deriveCampaignName(command: string): string {
  let s = command.trim()
  const lower = s.toLowerCase()

  for (const phrase of LEAD_PHRASES) {
    if (lower.startsWith(phrase)) {
      s = s.slice(phrase.length).trim()
      break
    }
  }

  // Separators people naturally type after the lead phrase.
  s = s.replace(/^(?:for|to|about|on|regarding|:|-|–|—)\s*/i, '').trim()
  s = s.replace(/\s+(?:launch|new)$/i, '').trim()

  return s || 'Untitled Campaign'
}

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------
api.get('/health', (c) =>
  c.json({ ok: true, service: 'proper-ai-suite', runtime: 'cloudflare-workers', ts: new Date().toISOString() }),
)

// ---------------------------------------------------------------------------
// GET /api/status  -> { viral: { status, kbVersion, lastUpdated }, ... }
// Mirrors the shape the original Express endpoint returned so ProperOS's
// existing updateAgentStatus() keeps working unchanged.
// ---------------------------------------------------------------------------
api.get('/status', async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const { results } = await db
    .prepare('SELECT key, name, status, kb_version, last_updated FROM agents ORDER BY rowid')
    .all<{ key: string; name: string; status: string; kb_version: string; last_updated: string }>()

  const payload: Record<string, unknown> = {}
  for (const row of results ?? []) {
    payload[row.key] = {
      name: row.name,
      status: row.status,
      kbVersion: row.kb_version,
      lastUpdated: row.last_updated,
    }
  }
  return c.json(payload)
})

// ---------------------------------------------------------------------------
// POST /api/execute  { command, type }
// ---------------------------------------------------------------------------
api.post('/execute', requireWriteAuth, async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const body = await c.req.json<{ command?: string; type?: string }>().catch(() => ({} as { command?: string; type?: string }))
  const command = (body.command ?? '').toString().trim()
  const type = body.type ?? 'command'

  if (!command) {
    return c.json({ success: false, error: 'command is required' }, 400)
  }

  if (type !== 'workflow') {
    return c.json({ success: true, message: `Processed request: ${command}` })
  }

  const projectId = `proj_${Date.now()}`

  const name = deriveCampaignName(command)

  await db.batch([
    db
      .prepare('INSERT INTO projects (id, name, command, status) VALUES (?, ?, ?, ?)')
      .bind(projectId, name, command, 'In Progress'),
    db
      .prepare("UPDATE agents SET status = ?, last_updated = datetime('now') WHERE key = 'viral'")
      .bind(`Processing: ${command}`),
  ])

  await writeKbEntry(
    db,
    'ProperViral',
    `Executed workflow for: "${command}".\n- Analysis patterns identified.\n- Conversion triggers mapped.`,
    { projectId, intent: 'WorkflowExecution', complexity: 'High' },
  )

  return c.json({
    success: true,
    projectId,
    campaignName: name,
    message: `Initiating FULL-SUITE Pipeline for: "${name}"`,
    pipeline: PIPELINE,
  })
})

// ---------------------------------------------------------------------------
// POST /api/sync  — touch every agent, log a sync marker per agent
// ---------------------------------------------------------------------------
api.post('/sync', requireWriteAuth, async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  await db
    .prepare("UPDATE agents SET last_updated = datetime('now')")
    .run()

  const { results } = await db
    .prepare('SELECT key, name FROM agents ORDER BY rowid')
    .all<{ key: string; name: string }>()

  for (const row of results ?? []) {
    await writeKbEntry(db, row.name, 'Knowledge base refined through system-wide synchronization.', {
      type: 'Sync',
    })
  }

  return c.json({
    success: true,
    synced: (results ?? []).length,
    message: 'Master KB synchronized and expanded.',
  })
})

// ---------------------------------------------------------------------------
// GET /api/projects?limit=
// ---------------------------------------------------------------------------
api.get('/projects', async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const limit = Math.min(Number(c.req.query('limit') ?? 50) || 50, 200)
  const { results } = await db
    .prepare('SELECT id, name, command, status, created_at, updated_at FROM projects ORDER BY created_at DESC LIMIT ?')
    .bind(limit)
    .all()

  return c.json({ projects: results ?? [] })
})

// ---------------------------------------------------------------------------
// PATCH /api/projects/:id  { status }
// ---------------------------------------------------------------------------
api.patch('/projects/:id', requireWriteAuth, async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const id = c.req.param('id')
  const { status } = await c.req.json<{ status?: string }>().catch(() => ({} as { status?: string }))
  if (!status) return c.json({ success: false, error: 'status is required' }, 400)

  const res = await db
    .prepare("UPDATE projects SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(status, id)
    .run()

  if (!res.meta.changes) return c.json({ success: false, error: 'project not found' }, 404)
  return c.json({ success: true, id, status })
})

// ---------------------------------------------------------------------------
// GET /api/kb?agent=&limit=  — the Obsidian replacement, read side
// ---------------------------------------------------------------------------
api.get('/kb', async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const agent = c.req.query('agent')
  const limit = Math.min(Number(c.req.query('limit') ?? 50) || 50, 500)

  const stmt = agent
    ? db
        .prepare('SELECT id, agent, content, mapping, created_at FROM kb_entries WHERE agent = ? ORDER BY id DESC LIMIT ?')
        .bind(agent, limit)
    : db
        .prepare('SELECT id, agent, content, mapping, created_at FROM kb_entries ORDER BY id DESC LIMIT ?')
        .bind(limit)

  const { results } = await stmt.all()
  return c.json({ entries: results ?? [], count: results?.length ?? 0 })
})

// ---------------------------------------------------------------------------
// GET /api/stats — launcher dashboard numbers
// ---------------------------------------------------------------------------
api.get('/stats', async (c) => {
  const db = c.env.DB
  await ensureSchema(db)

  const [projects, kb, active] = await db.batch([
    db.prepare('SELECT COUNT(*) AS n FROM projects'),
    db.prepare('SELECT COUNT(*) AS n FROM kb_entries'),
    db.prepare("SELECT COUNT(*) AS n FROM agents WHERE status != 'Idle'"),
  ])

  return c.json({
    projects: (projects.results?.[0] as { n: number } | undefined)?.n ?? 0,
    kbEntries: (kb.results?.[0] as { n: number } | undefined)?.n ?? 0,
    activeAgents: (active.results?.[0] as { n: number } | undefined)?.n ?? 0,
  })
})
